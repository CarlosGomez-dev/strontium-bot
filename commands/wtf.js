const { MessageAttachment } = require('discord.js');

module.exports = {
  name: 'wtf',
  aliases: ['w'],
  description: 'WTF!?',
  usage: '',
  guildOnly: false,
  needsParameters: false,
  noParametersMessage: '',
  viewHelp: true,
  meme: true,
  onlyOwner: false,
  run(bot, message, parameters) {
    const attachment = new MessageAttachment('./img/jwtf.png');
    message.channel.send(`${message.author}`, attachment);
  },
};
