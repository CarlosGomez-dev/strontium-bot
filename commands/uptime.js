module.exports = {
  name: 'uptime',
  aliases: ['up'],
  description: 'Bot uptime.',
  usage: '',
  guildOnly: false,
  needsParameters: false,
  noParametersMessage: '',
  viewHelp: true,
  meme: false,
  onlyOwner: false,
  run(bot, message, parameters) {
    let uptimeSeconds = bot.uptime / 1000;

    const days = Math.floor(uptimeSeconds / 86400);
    uptimeSeconds %= 86400;
    const hours = Math.floor(uptimeSeconds / 3600);
    uptimeSeconds %= 3600;
    const minutes = Math.floor(uptimeSeconds / 60);
    const seconds = Math.floor(uptimeSeconds % 60);

    const uptimeMessage = (days === 0 ? '' : '**' + days + '**d ') + `${hours}h, ${minutes}m, ${seconds}s.`;
    message.channel.send(uptimeMessage);
  },
};
