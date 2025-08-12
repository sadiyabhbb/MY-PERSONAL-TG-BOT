import fs from "fs";
import path from "path";

export const config = {
  name: "help",
  description: "Shows all available commands or details for a specific command",
  permission: "user",
  cooldown: 2,
  prefix: "/",
  author: "You",
  credits: "You",
  usage: "/help or /help <command>",
};

export async function likhon(bot, globalConfig) {
  bot.command("help", async (ctx) => {
    const prefix = globalConfig.prefix || "/";

    const args = ctx.message.text.trim().split(" ").slice(1);

    const cmdDir = path.join(process.cwd(), "script", "cmd");

    const files = fs.readdirSync(cmdDir).filter(f => f.endsWith(".js"));

    const commands = [];

    for (const file of files) {
      try {
        const { config } = await import(`../cmd/${file}`);

        if (config) commands.push(config);

      } catch {}
    }

    if (!args.length) {
      let text = "✨ *Available Commands:*\n\n";

      commands.forEach(cmd => {
        if (cmd.permission === "admin" && !globalConfig.roles.admins.includes(ctx.from.id)) return;

        text += `• ${cmd.prefix || prefix}${cmd.name} - ${cmd.description}\n`;
      });

      return ctx.reply(text.trim(), { parse_mode: "Markdown" });
    }

    const cmd = commands.find(c => c.name.toLowerCase() === args[0].toLowerCase());

    if (!cmd) return ctx.reply(`❌ Command '${args[0]}' not found.`);

    if (cmd.permission === "admin" && !globalConfig.roles.admins.includes(ctx.from.id)) {
      return ctx.reply("❌ You don't have permission to view this command.");
    }

    let details = `*${cmd.prefix || prefix}${cmd.name}*\n${cmd.description}\n`;

    details += `Permission: ${cmd.permission}\nCooldown: ${cmd.cooldown || 0}s\n`;

    if (cmd.author) details += `Author: ${cmd.author}\n`;

    if (cmd.credits) details += `Credits: ${cmd.credits}\n`;

    if (cmd.usage) details += `Usage: ${cmd.usage}`;

    return ctx.reply(details.trim(), { parse_mode: "Markdown" });
  });
}
