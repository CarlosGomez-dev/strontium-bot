module.exports = {
  name: 'help',
  aliases: ['h', 'commands'],
  description: 'List all commands and info. Option command name.',
  usage: '<command_name>',
  guildOnly: false,
  needsParameters: false,
  noParametersMessage: '',
  viewHelp: true,
  meme: false,
  onlyOwner: false,
  run(bot, message, parameters) {
    const prefix = bot.config.prefix;
    const data = [];
    const { commands } = bot;
    const helpOnlyCommands = commands.filter(command => command.viewHelp);

    if (!parameters) {
      data.push('Commands:');
      data.push(
        helpOnlyCommands
          .filter(command => !command.meme)
          .map(command => '`' + prefix + command.name + '`')
          .join(', '),
      );
      data.push('Memes:');
      data.push(
        helpOnlyCommands
          .filter(command => command.meme)
          .map(command => '`' + prefix + command.name + '`')
          .join(', '),
      );
      data.push(`\nUse \`${prefix}help <command_name>\` for more info.`);
      return message.channel.send(data, { split: true });
    }

    const name = parameters[0].toLowerCase();
    const command =
      helpOnlyCommands.get(name) || helpOnlyCommands.find(cmd => cmd.aliases && cmd.aliases.includes(name));

    if (!command) {
      return message.react('❓');
    }

    data.push(`**Name > ** \`${command.name}\``);
    if (command.aliases) data.push(`**Aliases > ** \`${command.aliases.join('`, `')}\``);
    if (command.description) data.push(`**Desc > ** *${command.description}*`);
    if (command.usage) data.push(`**Usage > ** \`${prefix}${command.name} ${command.usage}\``);
    message.channel.send(data, { split: true });
  },
};
