const { MessageAttachment } = require('discord.js');

module.exports = {
  name: 'serious',
  aliases: ['s'],
  description: 'Seriously?...',
  usage: '',
  guildOnly: false,
  needsParameters: false,
  noParametersMessage: '',
  viewHelp: true,
  meme: true,
  onlyOwner: false,
  run(bot, message, parameters) {
    const attachment = new MessageAttachment('./img/seriously.png');
    message.channel.send(attachment);
  },
};
