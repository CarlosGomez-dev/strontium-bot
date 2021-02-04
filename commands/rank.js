const Messages = require('../models/sequelize');
const Sequelize = require('sequelize');

module.exports = {
  name: 'rank',
  aliases: ['r'],
  description: 'Activity ranking. Optional days filter, default = 0',
  usage: '<optional_filter_days>',
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
    guildRoles.push({ roleId: '000000000000000000', roleName: 'None', roleColor: 0 });

    const discordMembers = await message.guild.members.fetch({ force: true });
    const guildMembers = [];
    discordMembers.forEach(discordMember => {
      const memberDatabaseInfo = membersInDatabase.find(memberDB => memberDB.userId === discordMember.id);
      const memberRoleInfo = guildRoles.find(role => role.roleId === discordMember._roles[0]);
      guildMembers.push({
        userId: discordMember.id,
        username: discordMember.user.username,
        nickname: discordMember.nickname,
        joinedTime: discordMember.joinedTimestamp,
        isBot: discordMember.user.bot,
        firstRole: memberRoleInfo ? memberRoleInfo.roleName : 'None',
        lastActivityTime: memberDatabaseInfo
          ? memberDatabaseInfo['max(`createdTime`)']
          : discordMember.joinedTimestamp,
        totalMessages: memberDatabaseInfo ? memberDatabaseInfo['count(`userId`)'] : 0,
      });
    });

    const timestampCalc = memberLastActivity => {
      let timeSinceLastActivity = (Date.now() - (memberLastActivity - 1000)) / 1000;

      const days = Math.floor(timeSinceLastActivity / 86400);
      timeSinceLastActivity %= 86400;
      const hours = Math.floor(timeSinceLastActivity / 3600);
      timeSinceLastActivity %= 3600;
      const minutes = Math.floor(timeSinceLastActivity / 60);

      const timestamp =
        (days === 0 ? '' : '**' + days + '**d ') +
        `**${hours}**h` +
        (days === 0 ? ' **' + minutes + '**m ' : '');

      return [timestamp, days];
    };

    const filterDays = parameters ? parameters[0] : 0;
    const memberActivity = guildMembers
      .filter(member => !member.isBot)
      .sort((memberA, memberB) => memberB.lastActivityTime - memberA.lastActivityTime)
      .map(toMember => {
        const [timestamp, days] = timestampCalc(toMember.lastActivityTime);
        toMember.timestamp = timestamp;
        toMember.activityDays = days;
        toMember.memberInfo = `${toMember.timestamp} - ${toMember.totalMessages} - <@${toMember.userId}>`;
        return toMember;
      })
      .filter(member => member.activityDays >= filterDays);

    const embedData = [];
    const validRoles = Object.freeze({
      testMod: '806194053837881394',
      moderator: '720652596418969672',
      newbie: '720652600172609636',
      rookie: '792582808043520021',
    });

    guildRoles.forEach(role => {
      const listSize = 20;
      const membersInRole = memberActivity.filter(member => member.firstRole === role.roleName);
      let loopNumber = 1;
      let roleGroup = {};
      if (membersInRole.length > 0) {
        for (let i = 0; i < membersInRole.length; i += listSize) {
          const filteredList = membersInRole
            .slice(i, i + listSize)
            .map((toMember, order) => `${order + i + 1}. ${toMember.memberInfo}`);
          roleGroup.name = loopNumber === 1 ? `${role.roleName}` : '-';
          roleGroup.value = filteredList;
          embedData.push(roleGroup);
          roleGroup = {};
          loopNumber++;
        }
      } else if (Object.values(validRoles).find(validRole => validRole === role.roleId)) {
        roleGroup.name = `${role.roleName}`;
        roleGroup.value = 'No data.';
        embedData.push(roleGroup);
      }
    });

    const databaseRows = membersInDatabase.reduce((acc, member) => acc + member['count(`userId`)'], 0);

    const filterMessage =
      filterDays > 0
        ? `\n_Rank filtered to show inactivity greater or equal to **${filterDays}** days._`
        : '';

    const embed = {
      title: 'Software Rookies Activity Record',
      description: `These lists contains activity recorded by ${bot.user} on all text channels. Database contains the previous _${databaseRows}_ messages.${filterMessage}`,
      color: 3561847,
      footer: {
        icon_url: `${bot.user.displayAvatarURL()}`,
        text: `Use ${bot.config.prefix}help for more commands`,
      },
      thumbnail: {
        url: `${message.guild.iconURL()}`,
      },
      fields: [embedData],
    };
    message.channel.send({ embed });
  },
};
