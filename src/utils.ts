export function normalizeTag(tag: string) {
  tag = tag.trim().toUpperCase();
  if (!tag.startsWith("#")) tag = "#" + tag;
  return tag;
}

export function shortPlayerSummary(player: any) {
  return `
👤 नाम: ${player.name}
🏰 Town Hall: ${player.townHallLevel}
⭐ Level: ${player.expLevel}
🏆 Trophies: ${player.trophies}
`.trim();
}
