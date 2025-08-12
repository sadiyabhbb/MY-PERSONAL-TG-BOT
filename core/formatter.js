export function escapeMarkdownV2(text) {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
}

export function escapeMarkdown(text) {
  return text.replace(/([_*`\[\]])/g, "\\$1");
}

export function sanitizeHTML(text) {
  return text.replace(/[<>&"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "\"": return "&quot;";
      default: return c;
    }
  });
    }
