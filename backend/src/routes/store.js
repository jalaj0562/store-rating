import { Router } from "express";
import { prisma } from "../db.js";
import { auth } from "../middleware/auth.js";
import { ratingSchema } from "../utils/validators.js";

const router = Router();

// List stores for users — include overall + my rating
router.get("/", auth(true), async (req, res) => {
  const { search, sortBy="name", order="asc", page=1, pageSize=10 } = req.query;
  const skip = (Number(page)-1) * Number(pageSize);
  const take = Number(pageSize);
  const orderBy = [{ [sortBy]: order.toLowerCase()==="desc" ? "desc" : "asc" }];
  const where = search ? {
    OR: [
      { name: { contains: search, mode: "insensitive" } },
      { address: { contains: search, mode: "insensitive" } }
    ]
  } : {};

  const stores = await prisma.store.findMany({ where, orderBy, skip, take });
  const total = await prisma.store.count({ where });

  let myRatings = {};
  if (req.user) {
    const r = await prisma.rating.findMany({
      where: { userId: req.user.id, storeId: { in: stores.map(s => s.id) } },
      select: { storeId: true, value: true }
    });
    myRatings = Object.fromEntries(r.map(x => [x.storeId, x.value]));
  }

  // overall ratings
  const aggregates = await Promise.all(stores.map(async s => {
    const agg = await prisma.rating.aggregate({
      where: { storeId: s.id },
      _avg: { value: true }, _count: { value: true }
    });
    return [s.id, { average: agg._avg.value ?? 0, count: agg._count.value }];
  }));

  const overall = Object.fromEntries(aggregates);

  res.json({
    items: stores.map(s => ({
      ...s,
      overallRating: overall[s.id],
      myRating: myRatings[s.id] ?? null
    })),
    total
  });
});

// Submit or update rating
router.post("/:id/ratings", auth(true), async (req, res) => {
  try {
    const { value } = ratingSchema.parse(req.body);
    const storeId = req.params.id;
    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store) return res.status(404).json({ error: "Store not found" });

    // upsert rating
    const existing = await prisma.rating.findUnique({
      where: { userId_storeId: { userId: req.user.id, storeId } }
    });
    if (existing) {
      const updated = await prisma.rating.update({
        where: { id: existing.id }, data: { value }
      });
      return res.json(updated);
    } else {
      const created = await prisma.rating.create({
        data: { value, userId: req.user.id, storeId }
      });
      return res.status(201).json(created);
    }
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

export default router;
