const fetch = require('node-fetch');
const querystring = require('querystring');

module.exports = {
  name: 'wiki',
  aliases: ['wikipedia'],
  description: 'Find articles related to search terms',
  usage: '<keywords>',
  guildOnly: false,
  needsParameters: true,
  noParametersMessage: 'I need a keyword to search',
  viewHelp: true,
  meme: false,
  onlyOwner: false,
  async run(bot, message, parameters) {
    const searchArgument = parameters.join(' ');
    const apiUrl = 'https://en.wikipedia.org/w/api.php?';

    const titleSearchOptions = {
      action: 'query',
      list: 'search',
      srsearch: searchArgument,
      format: 'json',
    };

    const titleSearchUrl = apiUrl + querystring.stringify(titleSearchOptions);
    console.log(titleSearchUrl);
    const resultTitle = await fetch(titleSearchUrl)
      .then(response => response.json())
      .then(data => data.query)
      .catch(error => console.error(error.name, error.message));

    if (!resultTitle) return message.react('0️⃣');
    let chosenTitle = resultTitle.search[0];

    if (
      resultTitle.search[0].snippet.includes('may refer to') ||
      resultTitle.search[0].title.includes('disambiguation')
    ) {
      console.log('chose another >>', resultTitle.search[0]);
      chosenTitle = resultTitle.search[1];
    }

    const bodySearchOptions = {
      action: 'query',
      titles: chosenTitle.title,
      prop: 'info|extracts',
      inprop: 'url',
      explaintext: 1,
      exintro: 1,
      format: 'json',
    };

    const bodySearchUrl = apiUrl + querystring.stringify(bodySearchOptions);

    const resultBody = await fetch(bodySearchUrl)
      .then(response => response.json())
      .then(data => data.query.pages[chosenTitle.pageid])
      .catch(error => console.error(error.name, error.message));

    const imageSearchOptions = {
      action: 'query',
      prop: 'pageimages',
      pithumbsize: 1000,
      titles: chosenTitle.title,
      format: 'json',
    };

    const imageSearchUrl = apiUrl + querystring.stringify(imageSearchOptions);
    const resultimage = await fetch(imageSearchUrl)
      .then(response => response.json())
      .then(data => data.query.pages[chosenTitle.pageid].thumbnail.source)
      .catch(error => console.error(error.name, error.message));

    const resultBodyFormatted =
      resultBody.extract
        .split('.\n')
        .join('.\n\n')
        .split('. ')
        .slice(0, 4)
        .join('.\n\n')
        .replace('\n\n\n', '\n\n') + '.';

    const embed = {
      title: `${chosenTitle.title} - Wikipedia`,
      description: resultBodyFormatted.replace('\n\n.', ''),
      url: resultBody.fullurl,
      color: 3561847,
      footer: {
        icon_url: `${bot.user.displayAvatarURL()}`,
        text: `Use ${bot.config.prefix}help for more commands`,
      },
      thumbnail: {
        url: `${
          resultimage
            ? resultimage
            : 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Wikipedia-logo-v2-en.svg/1024px-Wikipedia-logo-v2-en.svg.png'
        }`,
      },
      author: {
        name: 'From Wikipedia, the free encyclopedia',
        url: 'https://en.wikipedia.org/',
        icon_url: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Black_W_for_promotion.png',
      },
    };
    message.channel.send({ embed });
  },
};
