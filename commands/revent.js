module.exports = {
  name: 'revent',
  aliases: ['rv'],
  description: 'Reload an event.',
  usage: '<event_name>',
  guildOnly: false,
  needsParameters: true,
  noParametersMessage: 'I need an event name to reload.',
  viewHelp: false,
  meme: false,
  onlyOwner: true,
  run(bot, message, parameters) {
    const eventToReload = parameters[0];
    if (!bot.events.has(eventToReload)) return message.react('❌');
    bot.events.delete(eventToReload);
    bot.removeAllListeners(eventToReload);
    const event = require(`../events/${eventToReload}`);
    bot.on(eventToReload, event.bind(null, bot));
    bot.events.set(eventToReload, event);
    delete require.cache[require.resolve(`../events/${eventToReload}`)];
    message.react('☑️');
  },
};
