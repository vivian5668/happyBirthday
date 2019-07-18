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
var columns = {
         "Week Away"  : [],
         "Today"      : [],
         "NonBirthday": []  
};
var listOfPromises = [];

 
// Make a request for a user with a given ID
axios.get('https://api.trello.com/1/Boards/lVpwvqjp?fields=name&boardPlugins=true&cards=visible&card_fields=&card_attachments=true&card_attachment_fields=bytes%2Cdate%2CedgeColor%2CidMember%2CisUpload%2CmimeType%2Cname%2Curl&card_customFieldItems=true&customFields=true&pluginData=true&card_pluginData=true&organization=true&organization_fields=&organization_pluginData=true')
  .then(function (response) {
    // handle success

    for (var i = 0; i < response.data.cards.length; i++) {
      //calculate date comparators
      var cardID = response.data.cards[i].id;
      var birthdayDate = new Date(response.data.cards[i].customFieldItems[0].value.date);
      var birthdayCompare = new Date(2000, birthdayDate.getMonth(), birthdayDate.getDate(), 0, 0, 0, 0);
      var currentDateCompare = new Date(2000, new Date().getMonth(), new Date().getDate(), 0, 0, 0, 0);
      var weekAwayTemp = new Date();
      weekAwayTemp.setDate(new Date().getDate()+7);
      var weekAway = new Date(2000, weekAwayTemp.getMonth(), weekAwayTemp.getDate(), 0, 0, 0, 0);
      var dayAgoTemp = new Date();
      dayAgoTemp.setDate(new Date().getDate()-1);
      var dayAgo = new Date(2000, dayAgoTemp.getMonth(), dayAgoTemp.getDate(), 0, 0, 0, 0);
      // determine which cards to move
      if(birthdayCompare.getTime() === currentDateCompare.getTime()){

        listOfPromises.push(getCardName(cardID, "Today"));
      }
      else if(birthdayCompare.getTime() === weekAway.getTime()){
        listOfPromises.push(getCardName(cardID, "Week Away"));
      }
      else if(birthdayCompare.getTime() === dayAgo.getTime()){
        columns["NonBirthday"].push([cardID, null]);
      }
	}

  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
    Promise.all(listOfPromises).then(function() {
      //today, week away, unbirthday
      // const idList = ['5d2fbf84889f9e2623b4c824', '5d2fbf84889f9e2623b4c823', '5d2fbf84889f9e2623b4c825'];
      var mapping = {
        "Week Away"  : '5d2fbf84889f9e2623b4c823',
         "Today"      : '5d2fbf84889f9e2623b4c824',
         "NonBirthday": '5d2fbf84889f9e2623b4c825'
      }
      // const idCard = '5d2fc0346157c314f9212008';
      for(key in columns){
        for(var i = 0; i<columns[key].length; i++){
            axios.put(`https://api.trello.com/1/cards/${columns[key][i][0]}`, {
              idList: mapping[key],
              ...authentication
            })
            .then(function(response) {
            })
            .catch(function (error) {
            // handle error
            console.log(error);
          })
          .finally(function () {
            // always executed
          });
        }
      }
      
    })
  });

function getCardName(id, key) {
  return axios.get('https://api.trello.com/1/cards/' + id + '/name')
  .then(function (response) {
    columns[key].push([id, response.data._value])

  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  });
}

 