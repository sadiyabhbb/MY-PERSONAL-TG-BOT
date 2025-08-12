import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";


export const OWNER_SIGNATURE = "likhon";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CMD_DIR = path.join(__dirname, "script", "cmd");


function verifySignature(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return content.includes(OWNER_SIGNATURE);

  } catch {
    return false;
  }
}


export async function loadCommands(bot, globalConfig) {
  if (!fs.existsSync(CMD_DIR)) return;


  const files = fs.readdirSync(CMD_DIR).filter(f => f.endsWith(".js"));


  for (const file of files) {
    const filePath = path.join(CMD_DIR, file);

    if (!verifySignature(filePath)) continue;


    try {
      const cmdModule = await import(`file://${filePath}`);

      if (typeof cmdModule.likhon !== "function" || !cmdModule.config) continue;

      await cmdModule.likhon(bot, globalConfig);

    } catch {}
  }
}
