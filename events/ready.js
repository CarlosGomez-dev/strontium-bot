const Messages = require('../models/sequelize');

module.exports = (bot, message) => {
  if (bot.config.env === 'development') {
    bot.user.setActivity('NODE_ENV=test');
    console.log('Logged in as ' + bot.colors.fg.green + bot.user.tag + bot.colors.reset + '!');
  } else {
    bot.user.setActivity('foobar with Google.');
    console.log('Logged in as ' + bot.colors.fg.magenta + bot.user.tag + bot.colors.reset + '!');
  }
  Messages.sync();
};
