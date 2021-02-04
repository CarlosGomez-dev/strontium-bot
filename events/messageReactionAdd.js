module.exports = (bot, message) => {
  const isReactedMessageByBot = message.message.author.id === bot.user.id;
  const isReactionByBotOwner = !!message.users.cache.get(bot.config.owner);
  const isReactionX = message._emoji.name === '❌';

  if (isReactedMessageByBot && isReactionByBotOwner && isReactionX) {
    message.message.channel.messages.cache
      .get(message.message.id)
      .delete()
      .catch(error => console.error(error.name, error.message));
  }
};
