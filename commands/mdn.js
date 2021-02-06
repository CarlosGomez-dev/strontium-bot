const https = require('https');

module.exports = {
  name: 'mdn',
  aliases: ['m'],
  description: 'Find articles in MDN',
  usage: '<keywords>',
  guildOnly: false,
  needsParameters: true,
  noParametersMessage: 'I need a keyword to search',
  viewHelp: true,
  meme: false,
  onlyOwner: false,
  async run(bot, message, parameters) {
    const mdnSearchUrl = 'https://developer.mozilla.org/en-US/search?q=';
    const searchArgument = parameters.join('+');

    const mdnResults = await getMdnResult();

    function getMdnResult() {
      return new Promise((resolve, reject) => {
        const req = https.get(mdnSearchUrl + searchArgument, response => {
          let mdnRawData = '';
          response.on('data', data => (mdnRawData += data));
          response.on('end', () => resolve(mdnRawData));
        });
        req.on('error', error => reject(error));
      });
    }

    if (!mdnResults.includes('Showing results 1') && mdnResults.includes('>0 documents found'))
      return message.react('0️⃣');

    const firstResultStart = mdnResults.indexOf('="', mdnResults.indexOf('result-title')) + 2;
    const secondResultStart =
      mdnResults.indexOf('="', mdnResults.indexOf('result-title', firstResultStart)) + 2;
    const thirdResultStart =
      mdnResults.indexOf('="', mdnResults.indexOf('result-title', secondResultStart)) + 2;

    const resultArray = [
      mdnResults.substring(firstResultStart, mdnResults.indexOf('">', firstResultStart)),
      mdnResults.substring(secondResultStart, mdnResults.indexOf('">', secondResultStart)),
      mdnResults.substring(thirdResultStart, mdnResults.indexOf('">', thirdResultStart)),
    ];

    const githubResults = [];
    for (let i = 0; i < resultArray.length; i++) {
      const githubResult = await getGithubResults(resultArray[i]);
      githubResults.push(githubResult);
    }

    function getGithubResults(mdnResult) {
      const githubUrl = 'https://raw.githubusercontent.com/mdn/content/main/files';
      const cleanResult = mdnResult.toLowerCase().replace('/docs', '');
      console.log(githubUrl + cleanResult + '/index.html');
      return new Promise((resolve, reject) => {
        const req = https.get(githubUrl + cleanResult + '/index.html', response => {
          let githubRawData = '';
          response.on('data', data => (githubRawData += data));
          response.on('end', () => resolve(githubRawData));
        });
        req.on('error', error => reject(error));
      });
    }

    const embedResults = githubResults.map((rawGithubResult, i) => {
      const githubTitleStart = rawGithubResult.indexOf('title:') + 7;
      const githubTitleEnd = rawGithubResult.indexOf('slug:') - 1;
      const githubTitle = rawGithubResult.substring(githubTitleStart, githubTitleEnd);
      const githubParagraphStart = rawGithubResult.indexOf('<p');
      const githubParagraphEnd = rawGithubResult.indexOf('</p>', githubParagraphStart + 24) + 4;
      const githubParagraph = rawGithubResult.substring(githubParagraphStart, githubParagraphEnd);
      const cleanParagraph = githubParagraph
        .replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, '')
        .replace(/\n/g, '')
        .replace(/({{\w+|}}|,\s"",\s+\d+)/g, '')
        .replace(/\s{2,}/g, ' ');
      const mozillaUrl = 'https://developer.mozilla.org';
      return `**[${i + 1}. ${githubTitle}](${mozillaUrl + resultArray[i]})**\n${cleanParagraph}\n\n`;
    });

    const embed = {
      title: `Results: ${parameters.join(' ')} - MDN web docs`,
      description: embedResults.join(' '),
      url: mdnSearchUrl + searchArgument,
      color: 3561847,
      footer: {
        icon_url: `${bot.user.displayAvatarURL()}`,
        text: `Use ${bot.config.prefix}help for more commands`,
      },
      thumbnail: {
        url: 'https://developer.mozilla.org/static/img/opengraph-logo.72382e605ce3.png',
      },
      author: {
        name: 'MDN - intentionally undocumented API for developers.',
        url: 'https://developer.mozilla.org/en-US/',
        icon_url: 'https://developer.mozilla.org/static/img/opengraph-logo.72382e605ce3.png',
      },
    };
    message.channel.send({ embed });
  },
};
