const fs = require('fs');

module.exports = {
  name: 'reloadall',
  aliases: ['rvall'],
  description: 'Reload all events.',
  usage: '',
  guildOnly: false,
  needsParameters: false,
  noParametersMessage: '',
  viewHelp: false,
  meme: false,
  onlyOwner: true,
  run(bot, message, parameters) {
    bot.events.clear();
    bot.removeAllListeners();
    const eventList = [];
    fs.readdir('./events/', (error, files) => {
      if (error) return console.error(error);
      files.forEach(file => {
        if (!file.endsWith('.js')) return;
        const event = require(`../events/${file}`);
        const eventName = file.split('.')[0];
        eventList.push(eventName);
        bot.on(eventName, event.bind(null, bot));
        bot.events.set(eventName, event);
        delete require.cache[require.resolve(`../events/${file}`)];
      });
      message.react('☑️');
      console.log(`\`${eventList.join('`, `')}\``);
    });
  },
};
