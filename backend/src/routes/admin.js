import { Router } from "express";
import { prisma } from "../db.js";
import { auth, requireRole } from "../middleware/auth.js";
import { createUserSchema, createStoreSchema } from "../utils/validators.js";

const router = Router();
router.use(auth(true), requireRole("ADMIN"));

// Dashboard stats
router.get("/dashboard", async (_req, res) => {
  const [users, stores, ratings] = await Promise.all([
    prisma.user.count(),
    prisma.store.count(),
    prisma.rating.count()
  ]);
  res.json({ totalUsers: users, totalStores: stores, totalRatings: ratings });
});

// Create user
router.post("/users", async (req, res) => {
  try {
    const data = createUserSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) return res.status(409).json({ error: "Email already exists" });
    const bcrypt = (await import("bcrypt")).default;
    const hash = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        name: data.name, email: data.email, address: data.address,
        passwordHash: hash, role: data.role,
        storeId: data.role === "OWNER" ? data.storeId ?? undefined : undefined
      },
      select: { id: true, name: true, email: true, address: true, role: true, storeId: true }
    });
    res.status(201).json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Create store
router.post("/stores", async (req, res) => {
  try {
    const data = createStoreSchema.parse(req.body);
    const store = await prisma.store.create({ data });
    res.status(201).json(store);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Common list query util (search/sort/pagination)
function buildListQuery({ search, role, sortBy="name", order="asc", page=1, pageSize=10 }) {
  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);
  const orderBy = [{ [sortBy]: order.toLowerCase() === "desc" ? "desc" : "asc" }];
  const where = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { address: { contains: search, mode: "insensitive" } }
    ];
  }
  if (role) where.role = role;
  return { skip, take, orderBy, where };
}

// List users
router.get("/users", async (req, res) => {
  const q = buildListQuery(req.query);
  const [items, total] = await Promise.all([
    prisma.user.findMany({
      ...q,
      select: { id: true, name: true, email: true, address: true, role: true, storeId: true }
    }),
    prisma.user.count({ where: q.where })
  ]);
  res.json({ items, total });
});

// Get user by id (if owner, include their store avg rating)
router.get("/users/:id", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
    select: { id: true, name: true, email: true, address: true, role: true, storeId: true }
  });
  if (!user) return res.status(404).json({ error: "Not found" });
  let ownerRating = null;
  if (user.role === "OWNER" && user.storeId) {
    const agg = await prisma.rating.aggregate({
      where: { storeId: user.storeId },
      _avg: { value: true }, _count: { value: true }
    });
    ownerRating = { average: agg._avg.value ?? 0, count: agg._count.value };
  }
  res.json({ ...user, ownerRating });
});

// List stores
router.get("/stores", async (req, res) => {
  const { search, sortBy="name", order="asc", page=1, pageSize=10 } = req.query;
  const skip = (Number(page)-1) * Number(pageSize);
  const take = Number(pageSize);
  const orderBy = [{ [sortBy]: order.toLowerCase()==="desc" ? "desc" : "asc" }];
  const where = search ? {
    OR: [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { address: { contains: search, mode: "insensitive" } }
    ]
  } : {};

  const [items, total] = await Promise.all([
    prisma.store.findMany({ where, orderBy, skip, take }),
    prisma.store.count({ where })
  ]);
  res.json({ items, total });
});

export default router;
