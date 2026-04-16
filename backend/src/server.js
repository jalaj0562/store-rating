import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import storeRoutes from "./routes/store.js";
import ownerRoutes from "./routes/owner.js";

dotenv.config();
const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => res.json({ ok: true }));

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/stores", storeRoutes);
app.use("/owner", ownerRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API listening on :${port}`));
