module.exports = {
  name: 'ping',
  aliases: ['latency', 'lag'],
  description: 'Roundtrip latency.',
  usage: '',
  guildOnly: false,
  needsParameters: false,
  noParametersMessage: '',
  viewHelp: true,
  meme: false,
  onlyOwner: false,
  run(bot, message, parameters) {
    message.channel.send('Testing...').then(sent => {
      sent.edit(`Latency: ${sent.createdTimestamp - message.createdTimestamp}ms`);
    });
  },
};
