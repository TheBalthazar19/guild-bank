const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const mainMenu = () =>
  new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('menu_donate').setLabel('🎁 Donate').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('menu_request').setLabel('📤 Request').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('menu_inventory').setLabel('📦 Inventory').setStyle(ButtonStyle.Primary)
  );

const navButtons = () =>
  new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('nav_back').setLabel('⬅️ Back').setStyle(ButtonStyle.Secondary)
  );

module.exports = { mainMenu, navButtons };