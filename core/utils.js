export function isOwner(ctx, ownerId) {
  return ctx.from?.id === ownerId;
}

export function logMessage(type, message) {
  console.log(`[${type}] ${message}`);
}
