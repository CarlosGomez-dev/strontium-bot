const fs = require('fs');

module.exports = {
  name: 'reloadall',
  aliases: ['rlall'],
  description: 'Reload all commands.',
  usage: '',
  guildOnly: false,
  needsParameters: false,
  noParametersMessage: '',
  viewHelp: false,
  meme: false,
  onlyOwner: true,
  run(bot, message, parameters) {
    bot.commands.clear();
    const commandList = [];
    fs.readdir('./commands/', (error, files) => {
      if (error) return console.error(error);
      files.forEach(file => {
        if (!file.endsWith('.js')) return;
        const command = require(`./${file}`);
        const commandName = file.split('.')[0];
        commandList.push(commandName);
        bot.commands.set(commandName, command);
        delete require.cache[require.resolve(`./${file}`)];
      });
      message.react('☑️');
      console.log(`\`${commandList.join('`, `')}\``);
    });
  },
};
