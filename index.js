var Bot = require('./bot');
require('dotenv').config();

var bot = new Bot(() => {
    // Pass in todays birthdays, birthdays in 1 week
    bot.announceBirthdays(["Chelsea", "Sam"], ["Brandon"])
});

// This data is used to lookup birthdays in Slack
// e.g. should be populated with ALL birthday data from slack
const birthdays = {
    'Jacob': '5/1',
    'Chelsea': '6/42/3019',
    'Sam': '7/1',
    'Brandon': '8/1',
    'Alex': '9/1',
    'Nora': '10/1'
};


for (let name in birthdays) {
    bot.registerBirthday(name, birthdays[name]);
}