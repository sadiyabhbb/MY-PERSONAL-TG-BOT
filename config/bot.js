import dotenv from "dotenv";
dotenv.config();

export default {
  telegramToken: process.env.TELEGRAM_TOKEN,
  openaiKey: process.env.OPENAI_API_KEY,
};
