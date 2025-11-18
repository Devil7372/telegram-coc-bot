import { Telegraf } from "telegraf";
import dotenv from "dotenv";
import { Db } from "mongodb";
import { getPlayer } from "./coc.js";
import { normalizeTag, shortPlayerSummary } from "./utils.js";

dotenv.config();
const TOKEN = process.env.BOT_TOKEN;
if (!TOKEN) throw new Error("BOT_TOKEN not provided");

export function createBot(db: Db) {
  const bot = new Telegraf(TOKEN);
  const admins = db.collection("admins");
  const logs = db.collection("logs");

  async function isAdmin(id: number) {
    return !!(await admins.findOne({ tg_id: id }));
  }

  bot.start((ctx) =>
    ctx.reply("👋 Namaste! Player info lene ke liye: /player #TAG")
  );

  bot.command("myid", (ctx) =>
    ctx.reply(`Your Telegram ID: ${ctx.from?.id}`)
  );

  bot.command("player", async (ctx) => {
    const raw = ctx.message?.text || "";
    const tagString = raw.split(" ")[1];

    if (!tagString) return ctx.reply("Use: /player #TAG");

    const tag = normalizeTag(tagString);

    await logs.insertOne({
      time: new Date(),
      user: ctx.from,
      command: "player",
      tag,
    });

    const data = await getPlayer(tag);

    if ((data as any).error) {
      return ctx.reply(`Error: ${(data as any).message}`);
    }

    ctx.reply(shortPlayerSummary(data));
  });

  bot.command("stats", async (ctx) => {
    if (!ctx.from?.id) return;
    if (!(await isAdmin(ctx.from.id)))
      return ctx.reply("❌ Only admins can use this.");

    const total = await logs.countDocuments();
    ctx.reply(`📊 Total logs: ${total}`);
  });

  return bot;
}
