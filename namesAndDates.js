const axios = require('axios');
let json = require('./AuthInfo.json');

const API_KEY = json.APIKey;
const API_TOKEN = json.APIToken;

const authentication = {
  key: API_KEY,
  token: API_TOKEN
};

const nameAndDate = {};

// Make a request for a user with a given ID
axios.get('https://api.trello.com/1/Boards/lVpwvqjp?fields=name&boardPlugins=true&cards=visible&card_fields=name&card_attachments=true&card_attachment_fields=bytes%2Cdate%2CedgeColor%2CidMember%2CisUpload%2CmimeType%2Cname%2Curl&card_customFieldItems=true&customFields=true&pluginData=true&card_pluginData=true&organization=true&organization_fields=&organization_pluginData=true')
  .then(function (response) {
    // handle success

    for (var i = 0; i < response.data.cards.length; i++) {
      nameAndDate[response.data.cards[i].name] = response.data.cards[i].customFieldItems[0].value.date;
	}
  });