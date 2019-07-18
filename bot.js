const SlackBot = require('slackbots');
const emojiChoices = [
    ":birthday:",
    ":happy:",
    ":cake:",
    ":confetti_ball:",
    ":partyblob:",
    ":roohappy:",
    ":blobderpyhappy:",
    ":parrotbirthdayparty:",
    ":sohappy:",
    ":blobhype:",
    ":a-cool:",
]
const birthdays = {
    'Jacob': '5/1',
    'Chelsea': '6/42/3019',
    'Sam': '7/1',
    'Brandon': '8/1',
    'Alex': '9/1',
    'Nora': '10/1'
};

module.exports = class BirthdayBot {
    constructor(callback) {
        this.bot = new SlackBot({
            token: process.env.SLACK_TOKEN,
            name: 'birthdaybot'
        });

        this.bot.on('start', () => this._onStart(callback));

        this.bot.on('error', err => console.log(err));

        this.bot.on('message', (data) => this._onMessage(data));
    }

    announceBirthdays(today, oneWeek) {
        if (today.length > 0) {
            let attachments = [];
            
            // Create the messages (attachments) for today's birthdays
            today.forEach((name) => {
                let emoji = emojiChoices[Math.floor(Math.random() * emojiChoices.length)];
                let emojiText = emoji + emoji;
                attachments.push({
                    color: 'good',
                    text: `${name} ${emojiText}`
                });
            });
    
            // Send announcement for today's birthdays
            this._sendSlackNotification("Cake is better to be shared! Here are your beloved birthday cake 'excuses' today!", {
                attachments: attachments
            });
        }

        setTimeout(()=> {
            if (oneWeek.length > 0) {
                // Create the message for birthdays which are in 1 week
                let message;
    
                if (oneWeek.length == 1) {
                    message = `Save money to buy some cake for ${oneWeek[0]}'s birthday next week!`;
                } else {
                    message = `Save money to buy some cake for these birthdays next week: ${oneWeek.join(", ")}`;
                }
    
                // Send the message for birthdays which are in 1 week
                this._sendSlackNotification(message, {});
            }
        }, 5000);
    }

    _onStart(callback) {
        this.bot.postMessageToChannel(
            'hackhouse19birthday',
            ':robot_face: I am your happyBirthday Bot! :robot_face:'
        );

        setTimeout(callback, 5000);;
    }

    _onMessage(data) {
        if (data.type !== 'message') {
            return;
        }

        this._handleMessage(data.text);
    }

    _handleMessage(text) {
        let lower = text.toLowerCase();
        let message = "I don't know who that is!";
        let params;

        if (lower.includes('help')) {
            message = `I am your lovely birthday bot! You can ask "When is [name]'s birthday?`;
            params = {
                attachments: [{
                    color: 'danger',
                    text: message
                }]
            }
            this._sendSlackNotification("", params);
        } else if (lower.includes(' when') && lower.includes(' birthday')) {
            for (var name in birthdays) {
                if (lower.includes(name.toLowerCase())) {
                    message = name + "'s birthday is on " + birthdays[name] + "! :party:";
                }
            }
            this._sendSlackNotification(message, params);
        }
    }

    _sendSlackNotification(message, params) {
        this.bot.postMessageToChannel(
            'hackhouse19birthday',
            message,
            params,
        );
    }
}