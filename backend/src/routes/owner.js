import { Router } from "express";
import { prisma } from "../db.js";
import { auth, requireRole } from "../middleware/auth.js";

const router = Router();
router.use(auth(true), requireRole("OWNER"));

router.get("/store/ratings", async (req, res) => {
  const me = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!me?.storeId) return res.status(400).json({ error: "No store linked to owner" });

  const ratings = await prisma.rating.findMany({
    where: { storeId: me.storeId },
    select: { id: true, value: true, user: { select: { id: true, name: true, email: true } }, createdAt: true }
  });
  const agg = await prisma.rating.aggregate({ where: { storeId: me.storeId }, _avg: { value: true }, _count: { value: true } });
  res.json({ ratings, average: agg._avg.value ?? 0, count: agg._count.value });
});

export default router;
