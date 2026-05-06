const { ActionRowBuilder, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const items = require('../items');

module.exports = async (i) => {

  const parts = i.customId.split('_');
  const type = parts[0];
  const action = parts[1];
  const cat = parts[2];

  // SUB → ITEM
  if (action === 'sub') {

    const sub = i.values[0];
    const list = items[cat][sub];

    const menu = new StringSelectMenuBuilder()
      .setCustomId(`${type}_item_${cat}_${sub}`)
      .addOptions(list.map(x => ({ label: x, value: x })));

    return i.update({
      content: `Select item`,
      components: [new ActionRowBuilder().addComponents(menu)]
    });
  }

  // ITEM → MODAL
  if (action === 'item') {

    const sub = parts[3];
    const item = i.values[0];

    const modal = new ModalBuilder()
      .setCustomId(`${type}_modal_${cat}_${sub}_${item}`)
      .setTitle('Enter Quantity');

    const input = new TextInputBuilder()
      .setCustomId('qty_input')
      .setLabel('Quantity')
      .setStyle(TextInputStyle.Short);

    modal.addComponents(new ActionRowBuilder().addComponents(input));

    return i.showModal(modal);
  }
};