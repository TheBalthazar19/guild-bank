const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder
} = require('discord.js');
const { mainMenu } = require('../ui/menu');
const gearsets = require('../data/gearsets');
const { navButtons } = require('../ui/menu');

module.exports = async (i) => {

  // ===== OPEN GEAR SETS =====
  if (i.customId === 'request_sets') {

    const row = new ActionRowBuilder().addComponents(
      ...gearsets.classes.map(c =>
        new ButtonBuilder()
          .setCustomId(`setclass_${c}`)
          .setLabel(c)
          .setStyle(ButtonStyle.Primary)
      )
    );

    await i.update({
      content: "Select class:",
      components: [row, navButtons()]
    });
    return true;
  }

  // ===== CLASS SELECT =====
  if (i.customId.startsWith('setclass_')) {

    const cls = i.customId.split('_')[1];

    const row = new ActionRowBuilder().addComponents(
      ...gearsets.levels.map(l =>
        new ButtonBuilder()
          .setCustomId(`setlvl_${cls}_${l}`)
          .setLabel(`Lvl ${l}`)
          .setStyle(ButtonStyle.Secondary)
      )
    );

    await i.update({
      content: `${cls} Sets`,
      components: [row, navButtons()]
    });
    return true;
  }

  // ===== LEVEL SELECT =====
  if (i.customId.startsWith('setlvl_')) {

    const [, cls, lvl] = i.customId.split('_');

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`submitset_${cls}_${lvl}`)
        .setLabel('Submit')
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId(`specialset_${cls}_${lvl}`)
        .setLabel('Special Request')
        .setStyle(ButtonStyle.Primary)
    );

    await i.update({
      content: `${cls} Level ${lvl} Set`,
      components: [row, navButtons()]
    });
    return true;
  }

  // ===== NORMAL SUBMIT =====
  if (i.customId.startsWith('submitset_')) {

    const [, cls, lvl] = i.customId.split('_');

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`approve_set|${cls}|${lvl}`)
        .setLabel('Approve')
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId(`reject_set|${cls}|${lvl}`)
        .setLabel('Reject')
        .setStyle(ButtonStyle.Danger)
    );

    const rolePing = `<@&${process.env.LEAD_ROLE_ID}>`;

    const embed = new EmbedBuilder()
      .setTitle('📤 Gear Set Request')
      .addFields(
        { name: 'User', value: `${i.user}`, inline: true },
        { name: 'Class', value: cls, inline: true },
        { name: 'Level', value: lvl, inline: true }
      )
      .setColor(0x0099ff);

    await i.deferUpdate();

    await i.channel.send({
      content: rolePing,
      embeds: [embed],
      components: [row],
      allowedMentions: { roles: [process.env.LEAD_ROLE_ID] }
    });

    return;
  }

  // ===== SPECIAL REQUEST =====
  if (i.customId.startsWith('specialset_')) {

    const [, cls, lvl] = i.customId.split('_');

    const modal = new ModalBuilder()
      .setCustomId(`specialmodal_${cls}_${lvl}`)
      .setTitle('Special Request');

    const input = new TextInputBuilder()
      .setCustomId('special_input')
      .setLabel('Anything specific?')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(false);

    modal.addComponents(
      new ActionRowBuilder().addComponents(input)
    );

    await i.showModal(modal);
    return true;
  }

  // ===== APPROVE / REJECT =====
  if (
    i.customId.startsWith('approve_set') ||
    i.customId.startsWith('reject_set')
  ) {

    if (!i.member.roles.cache.has(process.env.LEAD_ROLE_ID)) {
      await i.reply({
        content: "Not allowed",
        flags: 64
      });
      return true;
    }

    await i.deferUpdate();

    setTimeout(() => {
      i.message.delete().catch(() => {});
    }, 300);

    return true;
  }
  // ===== SPECIAL MODAL SUBMIT =====
if (i.customId.startsWith('specialmodal_')) {

  const [, cls, lvl] = i.customId.split('_');

  const note =
    i.fields.getTextInputValue('special_input') || "";

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`approve_set|${cls}|${lvl}`)
      .setLabel('Approve')
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId(`reject_set|${cls}|${lvl}`)
      .setLabel('Reject')
      .setStyle(ButtonStyle.Danger)
  );

  const rolePing = `<@&${process.env.LEAD_ROLE_ID}>`;

  const embed = new EmbedBuilder()
    .setTitle('📤 Gear Set Request')
    .addFields(
      { name: 'User', value: `${i.user}`, inline: true },
      { name: 'Class', value: cls, inline: true },
      { name: 'Level', value: lvl, inline: true },
      {
        name: 'Special Request',
        value: note || "None",
        inline: false
      }
    )
    .setColor(0x0099ff);
await i.update({
  content: "🏦 Guild Bank",
  components: [mainMenu()]
});

  await i.channel.send({
    content: rolePing,
    embeds: [embed],
    components: [row],
    allowedMentions: {
      roles: [process.env.LEAD_ROLE_ID]
    }
  });

  return true;
}
};
