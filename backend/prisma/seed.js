import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_DEFAULT_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_DEFAULT_PASSWORD || "Admin@123";

  const hash = await bcrypt.hash(password, 10);
  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    await prisma.user.create({
      data: {
        name: "System Administrator",
        email,
        address: "HQ",
        passwordHash: hash,
        role: "ADMIN"
      }
    });
    console.log("Seeded admin:", email);
  } else {
    console.log("Admin already exists:", email);
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
