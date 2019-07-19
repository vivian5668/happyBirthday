/* 1. check time
// 2. if date change, we need to make api call to retrieve cards
// 3. process cards accordingly: 
	- week before special date
	- on the special date(current date)
	- other

*/

const axios = require('axios');
let json = require('./AuthInfo.json');

const API_KEY = json.APIKey;
const API_TOKEN = json.APIToken;

const authentication = {
  key: API_KEY,
  token: API_TOKEN
};

module.exports = {
  getCardsByDate, getCardNames, moveCardsById, getAllBirthdays
}

async function getCardsByDate() {
  // Make a request for a user with a given ID
  let response = await axios.get('https://api.trello.com/1/Boards/lVpwvqjp?fields=name&boardPlugins=true&cards=visible&card_fields=&card_attachments=true&card_attachment_fields=bytes%2Cdate%2CedgeColor%2CidMember%2CisUpload%2CmimeType%2Cname%2Curl&card_customFieldItems=true&customFields=true&pluginData=true&card_pluginData=true&organization=true&organization_fields=&organization_pluginData=true')
  let cards = {
    today: [],
    nextWeek: [],
    nonBirthday: []
  };

  for (var i = 0; i < response.data.cards.length; i++) {
    //calculate date comparators
    var cardID = response.data.cards[i].id;
    var birthdayDate = new Date(response.data.cards[i].customFieldItems[0].value.date);
    var birthdayCompare = new Date(2000, birthdayDate.getMonth(), birthdayDate.getDate(), 0, 0, 0, 0);
    var currentDateCompare = new Date(2000, new Date().getMonth(), new Date().getDate(), 0, 0, 0, 0);
    var weekAwayTemp = new Date();
    weekAwayTemp.setDate(new Date().getDate() + 7);
    var weekAway = new Date(2000, weekAwayTemp.getMonth(), weekAwayTemp.getDate(), 0, 0, 0, 0);
    var dayAgoTemp = new Date();
    dayAgoTemp.setDate(new Date().getDate() - 1);
    var dayAgo = new Date(2000, dayAgoTemp.getMonth(), dayAgoTemp.getDate(), 0, 0, 0, 0);
    // determine which cards to move
    if (birthdayCompare.getTime() === currentDateCompare.getTime()) {
      cards.today.push(cardID);
    }
    else if (birthdayCompare.getTime() === weekAway.getTime()) {
      cards.nextWeek.push(cardID);
    }
    else if (birthdayCompare.getTime() === dayAgo.getTime()) {
      cards.nonBirthday.push(cardID);
    }
  }

  return cards;
}

async function getCardNames(cardsByDate) {
  let cardPromises = {
    today: [],
    nextWeek: [],
  };

  cardsByDate.today.forEach(cardID => {
    cardPromises.today.push(getCardName(cardID, "Today"))
  });

  cardsByDate.nextWeek.forEach(cardID => {
    cardPromises.nextWeek.push(getCardName(cardID, "Week Away"))
  });

  let cardNames = {
    today: [],
    nextWeek: [],
  };

  await Promise.all(cardPromises.today).then(result => {
    result.forEach(name => {
      cardNames.today.push(name.data._value);
    });
  });

  await Promise.all(cardPromises.nextWeek).then(result => {
    result.forEach(name => {
      cardNames.nextWeek.push(name.data._value);
    });
  });

  return cardNames;
}

async function moveCardsById(cardsByDate) {
  var mapping = {
    nextWeek: '5d2fbf84889f9e2623b4c823',
    today: '5d2fbf84889f9e2623b4c824',
    nonBirthday: '5d2fbf84889f9e2623b4c825'
  }

  for (let key in mapping) {
    cardsByDate[key].forEach(cardId => {
      axios.put(`https://api.trello.com/1/cards/${cardId}`, {
        idList: mapping[key],
        ...authentication
      })
    })
  }
}

async function getAllBirthdays() {
  const nameAndDate = {};

  // Make a request for a user with a given ID
  await axios.get('https://api.trello.com/1/Boards/lVpwvqjp?fields=name&boardPlugins=true&cards=visible&card_fields=name&card_attachments=true&card_attachment_fields=bytes%2Cdate%2CedgeColor%2CidMember%2CisUpload%2CmimeType%2Cname%2Curl&card_customFieldItems=true&customFields=true&pluginData=true&card_pluginData=true&organization=true&organization_fields=&organization_pluginData=true')
    .then(function (response) {
      // handle success

      for (var i = 0; i < response.data.cards.length; i++) {
        let date = new Date(response.data.cards[i].customFieldItems[0].value.date);
        nameAndDate[response.data.cards[i].name] = `${date.getMonth()}/${date.getDate()}`
      }
    });

  return nameAndDate;
}

async function getCardName(id, key) {
  return await axios.get('https://api.trello.com/1/cards/' + id + '/name');
}

