import { Telegraf } from "telegraf";
import fs from "fs";
import path from "path";
import botConfig from "./config/bot.js";
import adminConfig from "./config/admin.js";
import OpenAI from "openai";

if (!botConfig.telegramToken || !botConfig.openaiKey) {
  console.error("❌ Missing TELEGRAM_TOKEN or OPENAI_API_KEY in .env");
  process.exit(1);
}

const bot = new Telegraf(botConfig.telegramToken);
const openai = new OpenAI({ apiKey: botConfig.openaiKey });

// Log Incoming messages
bot.on("message", ctx => {
  const from = ctx.from?.username || ctx.from?.first_name || "Unknown";
  const chat = ctx.chat?.title || ctx.chat?.username || ctx.chat?.id;
  const text = ctx.message.text || "[non-text message]";
  console.log(`[MSG IN] Chat: ${chat} | From: ${from} | Text: ${text}`);
});

// Log Outgoing messages
const originalSendMessage = bot.telegram.sendMessage.bind(bot.telegram);
bot.telegram.sendMessage = async (chatId, text, extra) => {
  console.log(`[MSG OUT] To: ${chatId} | Text: ${typeof text === "string" ? text : JSON.stringify(text)}`);
  return originalSendMessage(chatId, text, extra);
};

// Load commands
const cmdDir = path.join(process.cwd(), "script", "cmd");
fs.readdirSync(cmdDir).forEach(async (file) => {
  if (file.endsWith(".js")) {
    try {
      const mod = await import(path.join(cmdDir, file));
      if (typeof mod.likhon === "function") {
        await mod.likhon(bot, adminConfig, openai);
        console.log(`✅ Command ${file} started successfully`);
      } else {
        console.warn(`⚠️ Command ${file} has no likhon() function.`);
      }
    } catch (error) {
      console.error(`❌ Failed to start command ${file}:`, error);
    }
  }
});

// Load events
const evtDir = path.join(process.cwd(), "script", "events");
fs.readdirSync(evtDir).forEach(async (file) => {
  if (file.endsWith(".js")) {
    try {
      const mod = await import(path.join(evtDir, file));
      if (typeof mod.default === "function") {
        mod.default(bot, adminConfig, openai);
        console.log(`✅ Event ${file} loaded`);
      }
    } catch (error) {
      console.error(`❌ Failed to load event ${file}:`, error);
    }
  }
});

bot.launch().then(() => console.log("✅ Bot Started!"));

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
