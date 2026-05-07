const { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');
const { mainMenu, navButtons } = require('../ui/menu');
const items = require('../items');
const { add, removeItem } = require('../utils/db');

module.exports = async (i) => {

  const log = i.client.channels.cache.get(process.env.LOG_CHANNEL_ID);
  const approver = i.member?.nickname || i.user.username;

  // START → ephemeral session
  if (i.customId === 'start') {
    return i.reply({
      content: "🏦 Guild Bank",
      components: [mainMenu()],
      flags: 64
    });
  }

  // BACK → always go to main menu
  if (i.customId === 'nav_back') {
    return i.update({
      content: "🏦 Guild Bank",
      components: [mainMenu()]
    });
  }
// ===== REQUEST =====
if (i.customId === 'menu_request') {

  const row = new ActionRowBuilder().addComponents(
  new ButtonBuilder().setCustomId('request_weapon').setLabel('⚔️ Weapon').setStyle(ButtonStyle.Primary),
  new ButtonBuilder().setCustomId('request_armor').setLabel('🛡️ Armor').setStyle(ButtonStyle.Primary),
  new ButtonBuilder().setCustomId('request_tools').setLabel('🛠️ Tools').setStyle(ButtonStyle.Primary),
  new ButtonBuilder().setCustomId('request_sets').setLabel('📦 Gear Sets').setStyle(ButtonStyle.Success)
);

  return i.update({
    content: "Select category:",
    components: [row, navButtons()]
  });
}
  // DONATE
  if (i.customId === 'menu_donate') {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('donate_weapon').setLabel('⚔️ Weapon').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('donate_armor').setLabel('🛡️ Armor').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('donate_tools').setLabel('🛠️ Tools').setStyle(ButtonStyle.Primary)
    );

    return i.update({
      content: "Select category:",
      components: [row, navButtons()]
    });
  }

  // CATEGORY → SUBCATEGORY
  if (
  (i.customId.startsWith('donate_') ||
   i.customId.startsWith('request_'))
  &&
  i.customId !== 'request_sets'
) {

    const [type, cat] = i.customId.split('_');

    const subs = Object.keys(items[cat]);

    const menu = new StringSelectMenuBuilder()
      .setCustomId(`${type}_sub_${cat}`)
      .addOptions(subs.map(s => ({ label: s, value: s })));

    return i.update({
      content: `Select ${cat}`,
      components: [new ActionRowBuilder().addComponents(menu), navButtons()]
    });
  }

  // APPROVE / REJECT (silent)
  // ===== APPROVE / REJECT =====
if (i.customId.startsWith('approve') || i.customId.startsWith('reject')) {

  const [type, cat, sub, item, qty] = i.customId.split('|');

  if (!i.member.roles.cache.has(process.env.LEAD_ROLE_ID)) {
    return i.reply({ content: "Not allowed", flags: 64 });
  }

  const log = i.client.channels.cache.get(process.env.LOG_CHANNEL_ID);
  const approver = i.member?.nickname || i.user.username;

  // ✅ STEP 1: acknowledge immediately
  await i.deferUpdate();

  // ✅ STEP 2: delete immediately (no delay)
  i.message.delete().catch(err => console.log("Delete error:", err));

  // ✅ STEP 3: THEN do logic (async safe)
  setTimeout(() => {

    if (type === 'approve') {
      (cat, sub, item, parseInt(qty));
      log?.send(`✅ APPROVED ${item} x${qty} by ${approver}`);
    }

    if (type === 'approve_req') {
      const ok = removeItem(cat, sub, item, parseInt(qty));
      log?.send(ok ? `📤 REQUEST ${item}` : `❌ FAILED ${item}`);
    }

    if (type.startsWith('reject')) {
      log?.send(`❌ REJECTED ${item} by ${approver}`);
    }

  }, 0);

  return;
}

const fs = require('fs');

// ===== INVENTORY =====
if (i.customId === 'menu_inventory') {

  const data = JSON.parse(fs.readFileSync('./data/bank.json'));

  let msg = "📦 INVENTORY\n\n";

  for (const cat in data) {
    msg += `=== ${cat.toUpperCase()} ===\n`;

    for (const sub in data[cat]) {

      let hasItems = false;
      let subText = "";

      for (const item in data[cat][sub]) {
        const qty = data[cat][sub][item];

        if (qty > 0) {
          subText += `${item}: ${qty}\n`;
          hasItems = true;
        }
      }

      if (hasItems) {
        msg += `[${sub}]\n${subText}\n`;
      }
    }
  }

  if (msg.trim() === "📦 INVENTORY") {
    msg += "No items available.";
  }

  msg = "```" + msg + "```";

  return i.update({
    content: msg,
    components: [navButtons()]
  });
}
};