const Messages = require('../models/sequelize');
const Sequelize = require('sequelize');

module.exports = {
  name: 'test',
  aliases: ['testing'],
  description: 'Test commands',
  usage: '',
  guildOnly: false,
  needsParameters: false,
  noParametersMessage: '',
  viewHelp: false,
  meme: false,
  onlyOwner: true,
  async run(bot, message, parameters) {
    console.log(message.guild.id);
  },
};
