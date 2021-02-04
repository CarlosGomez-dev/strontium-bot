const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: 'database.sqlite',
});

const Messages = sequelize.define('messages', {
  messageId: {
    type: Sequelize.STRING,
    unique: true,
  },
  channelId: Sequelize.STRING,
  guildId: Sequelize.STRING,
  userId: Sequelize.STRING,
  isBot: Sequelize.BOOLEAN,
  createdTime: Sequelize.DOUBLE,
});

module.exports = Messages;
