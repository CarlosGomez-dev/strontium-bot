const { MessageAttachment } = require('discord.js');

module.exports = {
  name: 'delete',
  aliases: ['dm'],
  description: 'Delete a message.',
  usage: '<message_snowflake>',
  guildOnly: false,
  needsParameters: true,
  noParametersMessage: 'Need a message snowflake.',
  viewHelp: false,
  meme: false,
  onlyOwner: true,
  run(bot, message, parameters) {
    if (parameters[0].length < 18) return message.react('❌');
    message.channel.messages.cache
      .get(parameters[0])
      .delete()
      .catch(error => {
        message.react('❌');
        console.log(error.name, error.message);
      });
  },
};
