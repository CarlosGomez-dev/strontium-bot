const Discord = require('discord.js');
const fs = require('fs');
const colors = require('./utils/colors.js');

const config = {
  prefix: '!',
  token: process.env.TOKEN,
  owner: process.env.OWNER,
  env: process.env.NODE_ENV,
};

const bot = new Discord.Client();
bot.config = config;
bot.colors = colors;
bot.stamp = () => '[' + colors.fg.red + Date.now().toString() + colors.reset + ']';
bot.commands = new Discord.Collection();
bot.events = new Discord.Collection();

fs.readdir('./events/', (error, files) => {
  if (error) return console.error(error);
  const events = [];
  files.forEach(file => {
    if (!file.endsWith('.js')) return;
    const event = require(`./events/${file}`);
    const eventName = file.split('.')[0];
    events[events.length] = eventName;
    bot.on(eventName, event.bind(null, bot));
    bot.events.set(eventName, event);
    delete require.cache[require.resolve(`./events/${file}`)];
  });
  console.log(
    `[${colors.fg.red}Events - ${events.length}${colors.reset}]${colors.fg.cyan}`,
    ...events,
    colors.reset,
  );
});

fs.readdir('./commands/', (error, files) => {
  if (error) return console.error(error);
  const commands = [];
  files.forEach(file => {
    if (!file.endsWith('.js')) return;
    const command = require(`./commands/${file}`);
    const commandName = file.split('.')[0];
    commands[commands.length] = commandName;
    bot.commands.set(commandName, command);
    delete require.cache[require.resolve(`./commands/${file}`)];
  });
  console.log(
    `[${colors.fg.red}Commands - ${commands.length}${colors.reset}]${colors.fg.cyan}`,
    ...commands,
    colors.reset,
  );
});

bot.login(config.token);
