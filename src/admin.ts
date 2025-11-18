import express from "express";
import { Db } from "mongodb";

export default function adminRouter(db: Db) {
  const router = express.Router();
  const admins = db.collection("admins");
  const logs = db.collection("logs");

  router.use((req, res, next) => {
    const secret = req.headers["x-admin-secret"];
    if (!secret || secret !== process.env.ADMIN_SECRET)
      return res.status(401).json({ error: "Unauthorized" });

    next();
  });

  router.get("/list", async (req, res) => {
    const adminList = await admins.find({}).toArray();
    res.json(adminList);
  });

  router.post("/add", express.json(), async (req, res) => {
    const { tg_id } = req.body;
    if (!tg_id)
      return res.status(400).json({ error: "tg_id required" });

    await admins.updateOne({ tg_id }, { $set: { tg_id } }, { upsert: true });
    res.json({ success: true });
  });

  router.post("/remove", express.json(), async (req, res) => {
    const { tg_id } = req.body;

    await admins.deleteOne({ tg_id });
    res.json({ success: true });
  });

  router.get("/stats", async (req, res) => {
    const userCount = await logs.distinct("user.id");
    res.json({ users: userCount.length });
  });

  return router;
}
