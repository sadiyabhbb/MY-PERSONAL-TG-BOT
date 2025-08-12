import fs from "fs";
import path from "path";
import adminConfig from "./config/admin.js";

/**
 * Update commands.json বা অন্য ডাটাফাইল আপডেট করার জন্য হেল্পার ফাংশন
 * এখানে কমান্ড যোগ, মোডিফাই, ডিলিট ইত্যাদি কাজ করা যেতে পারে
 */

const commandsFilePath = path.resolve("./data/commands.json");

/**
 * কমান্ড গুলো লোড করবে
 */
export function loadCommands() {
  if (!fs.existsSync(commandsFilePath)) {
    return {};
  }
  const raw = fs.readFileSync(commandsFilePath, "utf-8");
  return JSON.parse(raw);
}

/**
 * নতুন বা আপডেটেড কমান্ড সংরক্ষণ করবে
 * @param {Object} commands 
 */
export function saveCommands(commands) {
  fs.writeFileSync(commandsFilePath, JSON.stringify(commands, null, 2));
}

/**
 * কমান্ড যোগ করার ফাংশন
 * @param {string} cmdName 
 * @param {string} responseText 
 */
export function addCommand(cmdName, responseText) {
  const commands = loadCommands();
  commands[cmdName] = responseText;
  saveCommands(commands);
}

/**
 * কমান্ড মুছে ফেলার ফাংশন
 * @param {string} cmdName 
 */
export function deleteCommand(cmdName) {
  const commands = loadCommands();
  if (commands[cmdName]) {
    delete commands[cmdName];
    saveCommands(commands);
    return true;
  }
  return false;
}

/**
 * commands.json ফাইল আপডেট করার জন্য মূল ফাংশন (যেমন CLI বা বট কমান্ড থেকে কল করবেন)
 */
export async function likhon(bot, adminConfig) {
  // Example: এখানে আপনি কমান্ড যুক্ত/ডিলিট বা অন্য আপডেটের হ্যান্ডলার লিখতে পারবেন
  // উদাহরণস্বরূপ:
  bot.command("addcommand", async (ctx) => {
    if (!adminConfig.roles.admins.includes(ctx.from.id)) {
      return ctx.reply("❌ আপনার অনুমতি নেই!");
    }
    const args = ctx.message.text.split(" ").slice(1);
    if (args.length < 2) return ctx.reply("ব্যবহার: /addcommand কমান্ড_নাম উত্তর");

    const cmdName = args[0];
    const responseText = args.slice(1).join(" ");

    addCommand(cmdName, responseText);
    await ctx.reply(`✅ কমান্ড '${cmdName}' সফলভাবে যোগ করা হয়েছে।`);
  });

  bot.command("delcommand", async (ctx) => {
    if (!adminConfig.roles.admins.includes(ctx.from.id)) {
      return ctx.reply("❌ আপনার অনুমতি নেই!");
    }
    const args = ctx.message.text.split(" ").slice(1);
    if (args.length !== 1) return ctx.reply("ব্যবহার: /delcommand কমান্ড_নাম");

    const cmdName = args[0];
    const deleted = deleteCommand(cmdName);
    if (deleted) {
      await ctx.reply(`✅ কমান্ড '${cmdName}' মুছে ফেলা হয়েছে।`);
    } else {
      await ctx.reply(`❌ কমান্ড '${cmdName}' পাওয়া যায়নি।`);
    }
  });
        }
