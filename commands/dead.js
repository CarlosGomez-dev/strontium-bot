const { MessageAttachment } = require('discord.js');

module.exports = {
  name: 'dead',
  aliases: ['d'],
  description: 'Dead...',
  usage: '',
  guildOnly: false,
  needsParameters: false,
  noParametersMessage: '',
  viewHelp: true,
  meme: true,
  onlyOwner: false,
  run(bot, message, parameters) {
    const attachment = new MessageAttachment('./img/bart.png');
    message.channel.send(`${message.author}`, attachment);
  },
};
