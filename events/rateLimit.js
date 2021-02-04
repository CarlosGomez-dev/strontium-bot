module.exports = (bot, message) => {
  console.log(bot.stamp(), bot.colors.bg.red + 'Rate limit:' + bot.colors.reset, message);
};
