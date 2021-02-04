module.exports = (bot, message) => {
  if (message.includes('Limit')) {
    console.log('Remaining logins: ' + bot.colors.fg.red + parseInt(message.substr(-4)) + bot.colors.reset);
  }
};
