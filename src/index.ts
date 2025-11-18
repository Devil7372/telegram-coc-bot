import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import adminRouter from "./admin.js";
import { createBot } from "./bot.js";

dotenv.config();

const PORT = Number(process.env.PORT || 3000);
const USE_WEBHOOK = (process.env.USE_WEBHOOK || "false") === "true";
const WEBHOOK_URL = process.env.WEBHOOK_URL;

async function main() {
  const db = await connectDB();
  const app = express();

  // Admin API
  app.use("/admin", adminRouter(db));

  app.get("/", (req, res) => res.send("COC Telegram Bot Running"));

  const bot = createBot(db);

  if (USE_WEBHOOK) {
    if (!WEBHOOK_URL) throw new Error("WEBHOOK_URL missing");
    await bot.launch({
      webhook: { domain: WEBHOOK_URL, port: PORT },
    });
    console.log("Bot running in webhook mode");
  } else {
    await bot.launch();
    console.log("Bot running in polling mode");
  }

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
}

main().catch((err) => console.error(err));
