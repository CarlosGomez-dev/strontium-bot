const { MessageAttachment } = require('discord.js');

module.exports = {
  name: 'database',
  aliases: ['db'],
  description: 'Get database as attachment.',
  usage: '',
  guildOnly: false,
  needsParameters: false,
  noParametersMessage: '',
  viewHelp: false,
  meme: false,
  onlyOwner: true,
  run(bot, message, parameters) {
    const attachment = new MessageAttachment('./database.sqlite');
    message.author.send(attachment);
  },
};
