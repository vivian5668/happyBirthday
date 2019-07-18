const SlackBot = require('slackbots');

module.exports = {
    botInit: function() {
        const bot = new SlackBot({
            token: process.env.SLACK_TOKEN,
            name: 'birthdaybot'
        });
        
        bot.on('start', () => {
            bot.postMessageToChannel(
                'hackhouse19birthday',
                'whats up guys its ya boy birthday bot'
            );
        });

        bot.on('error', err => console.log(err));

        bot.on('message', data => {
            if (data.type !== 'message') {
                return;
            }

            handleMessage(bot, data.text);
        });
    }
}

const birthdays = {
    'Jacob': '5/1',
    'Chelsea': '6/42/3019',
    'Sam': '7/1',
    'Brandon': '8/1',
    'Alex': '9/1',
    'Nora': '10/1'
};

function handleMessage(bot, text) {
    var lower = text.toLowerCase();
    var message = "I don't know who that is!";

    if (lower.includes('when') && lower.includes('birthday')) {
        for (var name in birthdays) {
            if (lower.includes(name.toLowerCase())) {
                message = name + "'s birthday is on " + birthdays[name] + "! :party:";
            }
        }

        bot.postMessageToChannel(
            'hackhouse19birthday',
            message
        );
    }
}