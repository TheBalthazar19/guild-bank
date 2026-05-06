const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const buttonHandler = require('./buttonHandler');
const selectHandler = require('./selectHandler');
const modalHandler = require('./modalHandler');
const gearSetHandler = require('./gearSetHandler');
module.exports = async (i) => {

  // /bank command
  if (i.isChatInputCommand()) {
    if (i.commandName === 'bank') {
      return i.reply({
        content: "🏦 Guild Bank",
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId('start')
              .setLabel('Start')
              .setStyle(ButtonStyle.Success)
          )
        ]
      });
    }
  }
if (i.isButton()) {

  const handled = await gearSetHandler(i);

  if (handled) return;

  return buttonHandler(i);
}

if (i.isModalSubmit()) {

  const handled = await gearSetHandler(i);

  if (handled) return;

  return modalHandler(i);
}
if (i.isStringSelectMenu()) return selectHandler(i);
};