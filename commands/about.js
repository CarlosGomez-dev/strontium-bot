const Messages = require('../models/sequelize');
const Sequelize = require('sequelize');

module.exports = {
  name: 'about',
  aliases: ['a'],
  description: 'Bot information.',
  usage: '',
  guildOnly: false,
  needsParameters: false,
  noParametersMessage: '',
  viewHelp: true,
  meme: false,
  onlyOwner: false,
  async run(bot, message, parameters) {
    const embed = {
      title: 'Strontium - Software Rookies Bot',
      description: `**Strontium** is a discord bot created by <@${bot.config.owner}> for the Software Rookies discord server.\nStrontium is [open source](https://github.com/CarlosGomez-dev/strontium-bot), if you have any problems or suggestions, feel free to [open a new issue](https://github.com/CarlosGomez-dev/strontium-bot/issues). Pull requests are also welcome.`,
      color: 3561847,
      footer: {
        icon_url: `${bot.user.displayAvatarURL()}`,
        text: `Use ${bot.config.prefix}help for more commands`,
      },
      thumbnail: {
        url: `${bot.user.displayAvatarURL()}`,
      },
    };
    message.channel.send({ embed });
  },
};
