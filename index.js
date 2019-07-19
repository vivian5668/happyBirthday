var Bot = require('./bot');
require('dotenv').config();

var trello = require('./trello');

async function main() {
    var cardIds = await trello.getCardsByDate();
    var cardNames = await trello.getCardNames(cardIds);
    await trello.moveCardsById(cardIds);
    var allBirthdays = await trello.getAllBirthdays();
    
    

    var bot = new Bot(() => {
        for (let name in allBirthdays) {
            bot.registerBirthday(name, allBirthdays[name]);
        }

        bot.announceBirthdays(cardNames.today, cardNames.nextWeek);
    });
}

main();

/*
var bot = new Bot(() => {
    // Pass in todays birthdays, birthdays in 1 week
    bot.announceBirthdays(["Chelsea", "Sam"], ["Brandon"])
});

// This data is used to lookup birthdays in Slack
// e.g. should be populated with ALL birthday data from slack

for (let name in birthdays) {
    bot.registerBirthday(name, birthdays[name]);
}*/