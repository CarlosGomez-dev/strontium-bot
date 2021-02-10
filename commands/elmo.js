const { MessageAttachment } = require('discord.js');

module.exports = {
  name: 'elmo',
  aliases: ['e'],
  description: 'Dead...',
  usage: '',
  guildOnly: false,
  needsParameters: false,
  noParametersMessage: '',
  viewHelp: true,
  meme: true,
  onlyOwner: false,
  run(bot, message, parameters) {
    const attachment = new MessageAttachment('./img/elmo.gif');
    message.channel.send(`${message.author}`, attachment);
  },
};
