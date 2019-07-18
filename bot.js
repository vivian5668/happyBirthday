const SlackBot = require('slackbots');

const birthdays = {
    'Jacob': '5/1',
    'Chelsea': '6/42/3019',
    'Sam': '7/1',
    'Brandon': '8/1',
    'Alex': '9/1',
    'Nora': '10/1'
};

module.exports = class BirthdayBot {
    constructor() {
        this.bot = new SlackBot({
            token: process.env.SLACK_TOKEN,
            name: 'birthdaybot'
        });

        this.bot.on('start', () => this._onStart());

        this.bot.on('error', err => console.log(err));

        this.bot.on('message', (data) => this._onMessage(data));
    }

    _onStart() {
        this.bot.postMessageToChannel(
            'hackhouse19birthday',
            'whats up guys its ya boy birthday bot'
        );
    }

    _onMessage(data) {
        if (data.type !== 'message') {
            return;
        }

        this._handleMessage(data.text);
    }

    _handleMessage(text) {
        var lower = text.toLowerCase();
        var message = "I don't know who that is!";
    
        if (lower.includes('when') && lower.includes('birthday')) {
            for (var name in birthdays) {
                if (lower.includes(name.toLowerCase())) {
                    message = name + "'s birthday is on " + birthdays[name] + "! :party:";
                }
            }

            this.sendSlackNotification(message);
        }
    }

    sendSlackNotification(message) {
        this.bot.postMessageToChannel(
            'hackhouse19birthday',
            message
        );
    }
}