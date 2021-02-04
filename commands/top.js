const Messages = require('../models/sequelize');
const Sequelize = require('sequelize');

module.exports = {
  name: 'top',
  aliases: ['t'],
  description: 'Top members by Messages or Joined time.',
  usage: '',
  guildOnly: true,
  needsParameters: false,
  noParametersMessage: '',
  viewHelp: true,
  meme: false,
  onlyOwner: true,
  async run(bot, message, parameters) {
    const membersInDatabase = await Messages.findAll({
      attributes: [
        'userId',
        Sequelize.fn('count', Sequelize.col('userId')),
        Sequelize.fn('max', Sequelize.col('createdTime')),
      ],
      where: {
        guildId: message.guild.id,
      },
      group: ['userId'],
      raw: true,
    });

    if (membersInDatabase.length === 0)
      return message.channel.send(
        `Didn't find any information. \`${bot.config.prefix}fetch\` some channels.`,
      );

    const discordRoles = await message.guild.roles.cache;
    const guildRoles = [];
    discordRoles.forEach(role => {
      guildRoles.push({
        roleId: role.id,
        roleName: role.name,
        roleColor: role.color,
      });
    });

    const discordMembers = await message.guild.members.fetch({ force: true });
    const guildMembers = [];
    discordMembers.forEach(member => {
      const memberDatabaseInfo = membersInDatabase.find(memberDB => memberDB.userId === member.id);
      const memberRoleInfo = guildRoles.find(role => role.roleId === member._roles[0]);
      guildMembers.push({
        userId: member.id,
        username: member.user.username,
        nickname: member.nickname,
        joinedTime: member.joinedTimestamp,
        isBot: member.user.bot,
        firstRole: memberRoleInfo ? memberRoleInfo.roleName : 'None',
        lastMessageTime: memberDatabaseInfo ? memberDatabaseInfo['max(`createdTime`)'] : 0,
        totalMessages: memberDatabaseInfo ? memberDatabaseInfo['count(`userId`)'] : 0,
      });
    });

    const membersWithNoActivity = guildMembers
      .filter(member => !member.isBot && !member.lastMessageTime)
      .sort((memberA, memberB) => memberA.joinedTime - memberB.joinedTime)
      .slice(0, 15)
      .map((member, i) => {
        let timeSinceLastActivity = (Date.now() - member.joinedTime) / 1000;
        const days = Math.floor(timeSinceLastActivity / 86400);
        timeSinceLastActivity %= 86400;
        const hours = Math.floor(timeSinceLastActivity / 3600);
        return `${i + 1}. <@${member.userId}> - ${days}d ${hours}h ago`;
      });

    const membersSortedByActivity = guildMembers
      .filter(member => !member.isBot && member.totalMessages)
      .sort((memberA, memberB) => memberB.totalMessages - memberA.totalMessages)
      .slice(0, 15)
      .map((member, i) => `${i + 1}. <@${member.userId}> - ${member.totalMessages}`);

    const databaseRows = membersInDatabase.reduce((acc, member) => acc + member['count(`userId`)'], 0);

    const embed = {
      title: 'Software Rookies Activity Record',
      description: `These lists contains activity recorded by ${bot.user} on all text channels. Database contains _${databaseRows}_ messages.`,
      color: 3561847,
      footer: {
        icon_url: `${bot.user.displayAvatarURL()}`,
        text: `Use ${bot.config.prefix}help for more commands`,
      },
      thumbnail: {
        url: `${message.guild.iconURL()}`,
      },
      fields: [
        {
          name: 'Top 15 - Most messages sent:',
          value: `${membersSortedByActivity.join('\n')}`,
        },
        {
          name: 'Top 15 - No activity found since joined:',
          value: `${membersWithNoActivity.length === 0 ? '-' : membersWithNoActivity.join('\n')}`,
        },
      ],
    };
    message.channel.send({ embed });
  },
};
