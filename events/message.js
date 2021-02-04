const Messages = require('../models/sequelize');

module.exports = (bot, message) => {
  const mentions = ['802391856935731240', 'strontium', 'srbot', 'sr-bot'];
  const emojis = ['💪', '👍', '🤙', '👋', '🔥'];

  Messages.create({
    messageId: message.id,
    channelId: message.channel.id,
    guildId: message.guild ? message.guild.id : '-',
    userId: message.author.id,
    isBot: message.author.bot,
    createdTime: message.createdTimestamp,
  }).catch(error => {
    if (error.name !== 'SequelizeUniqueConstraintError') {
      console.error(error);
    }
  });

  mentions.forEach(mention => {
    if (message.content.toLowerCase().includes(mention) && !message.author.bot) {
      message.react(emojis[Math.floor(Math.random() * emojis.length)]).catch(console.error);
    }
  });

  if (!message.content.startsWith(bot.config.prefix) || message.author.bot) return;
  const keywords = message.content.slice(bot.config.prefix.length).trim().split(/ +/g);
  const command = keywords[0].toLowerCase();
  const parameters = keywords.slice(1).length ? keywords.slice(1) : null;
  const usersMentioned = message.mentions.users.size;

  const cmd =
    bot.commands.get(command) || bot.commands.find(alt => alt.aliases && alt.aliases.includes(command));

  console.log(
    bot.stamp(),
    'cmd: ' + bot.colors.fg.red + command + bot.colors.reset,
    '- author: ' + bot.colors.fg.cyan + message.author.username + bot.colors.reset,
    '- valid: ' + bot.colors.fg.magenta + !!cmd + bot.colors.reset,
    '- args: ' + bot.colors.fg.green + parameters + bot.colors.reset,
    '- mentions: ' + bot.colors.fg.cyan + !!usersMentioned + bot.colors.reset,
  );

  if (!cmd) {
    return message.react('❓');
  }

  if (cmd.onlyOwner && message.author.id !== bot.config.owner) {
    message.react('🚫');
    return console.log(
      `Not owner, ignoring ${bot.colors.fg.red}${bot.config.prefix}${command}${bot.colors.reset} command`,
    );
  }

  if (cmd.guildOnly && message.channel.type === 'dm') {
    message.react('❌');
    return message.channel.send(`\`${bot.config.prefix}${command}\` doesn't work on DMs.`);
  }

  if (cmd.needsParameters && !parameters) {
    let reply = cmd.noParametersMessage;
    if (cmd.usage) reply += `\nCorrect usage is : \`${bot.config.prefix}${command} ${cmd.usage}\``;
    message.react('❌');
    return message.channel.send(reply);
  }

  try {
    cmd.run(bot, message, parameters);
  } catch (error) {
    console.error(error);
    message.react('😢');
    message.channel.send(`\`${bot.config.prefix}${command}\` failed successfully...`);
  }
};
