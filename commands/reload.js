module.exports = {
  name: 'reload',
  aliases: ['rl'],
  description: 'Reload a command.',
  usage: '<command_name>',
  guildOnly: false,
  needsParameters: true,
  noParametersMessage: 'I need a command name to reload.',
  viewHelp: false,
  meme: false,
  onlyOwner: true,
  run(bot, message, parameters) {
    const commandToReload = parameters[0];
    if (!bot.commands.has(commandToReload)) return message.react('❌');
    bot.commands.delete(commandToReload);
    const command = require(`./${commandToReload}`);
    bot.commands.set(commandToReload, command);
    delete require.cache[require.resolve(`./${commandToReload}`)];
    message.react('☑️');
  },
};
