const { MessageAttachment } = require('discord.js');

module.exports = {
  name: 'botavatar',
  aliases: ['ba'],
  description: 'Bot avatar.',
  usage: '',
  guildOnly: false,
  needsParameters: false,
  noParametersMessage: '',
  viewHelp: true,
  meme: false,
  onlyOwner: false,
  run(bot, message, parameters) {
    const attachment = new MessageAttachment('./img/srbot-avatar.png');
    message.channel.send(attachment);
  },
};
