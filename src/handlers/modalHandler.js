const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { mainMenu } = require('../ui/menu');
const rolePing = `<@&${process.env.LEAD_ROLE_ID}>`;
module.exports = async (i) => {

  const qty = parseInt(i.fields.getTextInputValue('qty_input'));
  if (!qty || qty <= 0) {
    return i.reply({ content: "Invalid quantity", flags: 64 });
  }

  const parts = i.customId.split('_');
  const type = parts[0];
  const cat = parts[2];
  const sub = parts[3];
  const item = parts.slice(4).join('_');

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`${type === 'request' ? 'approve_req' : 'approve'}|${cat}|${sub}|${item}|${qty}`)
      .setLabel('Approve')
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId(`${type === 'request' ? 'reject_req' : 'reject'}|${cat}|${sub}|${item}|${qty}`)
      .setLabel('Reject')
      .setStyle(ButtonStyle.Danger)
  );

await i.update({
  content: "🏦 Guild Bank",
  components: [mainMenu()]
});


const { EmbedBuilder } = require('discord.js');

const rolePing = `<@&${process.env.LEAD_ROLE_ID}>`;

const embed = new EmbedBuilder()
  .setTitle(type === 'request' ? "📤 Request" : "🎁 Donation")
  .addFields(
    { name: "👤 User", value: `${i.user}`, inline: true },
    { name: "📦 Item", value: item, inline: true },
    { name: "🔢 Quantity", value: `${qty}`, inline: true },
    { name: "📂 Category", value: `${cat}/${sub}`, inline: false }
  )
  .setColor(type === 'request' ? 0xff9900 : 0x00cc66)
  .setFooter({ text: "Guild Bank System" });

await i.channel.send({
  content: `${rolePing}`, // 👈 THIS PINGS LEADS
  embeds: [embed],
  components: [row]
});
};