const Messages = require('../models/sequelize');

module.exports = {
  name: 'fetch',
  aliases: ['f', 'get'],
  description: 'Fetch messages.',
  usage: '',
  guildOnly: true,
  needsParameters: false,
  noParametersMessage: 'I need to know how many messages to fetch.',
  viewHelp: false,
  meme: false,
  onlyOwner: true,
  async run(bot, message, parameters) {
    message.react('⏱️');

    const fetchOptions = { limit: 100 };
    let uniqueEntryTotalErrors = 0;
    let totalFetchedRecords = 0;

    let messageArray = [];
    let continueLoop = true;
    let loopCounter = 0;
    while (continueLoop) {
      loopCounter++;

      if (loopCounter > 1) fetchOptions.before = messageArray[messageArray.length - 1].id;
      const messages = await message.channel.messages.fetch(fetchOptions);
      messageArray = messages.array();
      if (messageArray.length === 0) break;
      totalFetchedRecords += messageArray.length;

      let uniqueEntryErrors = 0;
      for (let i = 0; i < messageArray.length; i++) {
        const messageToSave = messageArray[i];

        await Messages.create({
          messageId: messageToSave.id,
          channelId: messageToSave.channel.id,
          guildId: messageToSave.guild.id,
          userId: messageToSave.author.id,
          isBot: messageToSave.author.bot,
          createdTime: messageToSave.createdTimestamp,
        }).catch(error => {
          if (error.name === 'SequelizeUniqueConstraintError') {
            uniqueEntryErrors++;
            uniqueEntryTotalErrors++;
          } else {
            message.react('❌');
            console.error(error);
          }
        });
      }
      continueLoop = !(messageArray.length < fetchOptions.limit || uniqueEntryTotalErrors >= 500);
      console.log('loop:', loopCounter, 'fetched:', messageArray.length, 'errors:', uniqueEntryErrors);
    }
    message.react('☑️');
    console.log('Done, fetched:', totalFetchedRecords, 'errors:', uniqueEntryTotalErrors);
  },
};
