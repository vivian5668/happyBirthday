const SlackBot = require('slackbots');

const choices = {
    emoji: [
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
        ":a-cool:"
    ],
    todayAnnouncement: [
        "Cake tastes better when shared! Here are your beloved b-day cake \"excuses\" today!",
        "wow birthdays! TODO better message",
        "TODO COOL BIRTHDAY ANNOUNCEMENT"
    ],
    nextWeekSingularAnnouncement: [
        "Save money to buy some cake for ${0}'s birthday next week!",
        "TODO ${0} has a birthday next week",
        "${0}'s birthday is in a week or something i guess"
    ],
    nextWeekPluralAnnouncement: [
        "Save money to buy some cake for these birthdays next week: ${0}",
        "These people have birthday next week which is cool or something: ${0}",
        "TODO: next week birthdays are ${0}"
    ]
}

function randomChoice(choices) {
    return choices[Math.floor(Math.random() * choices.length)];
}

function substitute(target, replacement) {
    return target.replace("${0}", replacement);
}

function listArray(arr) {
    let message = "";

    for (let i = 0; i < arr.length; i++) {
        message += arr[i];
        if (i < arr.length - 1) {
            message += ", ";
        }
        if (i == arr.length - 2) {
            message += "and ";
        }
    }

    return message;
}

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
                let emoji = randomChoice(choices.emoji);
                attachments.push({
                    color: 'good',
                    text: `${name} ${emoji} ${emoji}`
                });
            });
    
            // Send announcement for today's birthdays
            this._sendSlackNotification(randomChoice(choices.todayAnnouncement), {
                attachments: attachments
            });
        }

        setTimeout(()=> {
            if (oneWeek.length > 0) {
                // Create the message for birthdays which are in 1 week
                let message;
    
                if (oneWeek.length == 1) {
                    message = substitute(randomChoice(choices.nextWeekSingularAnnouncement), oneWeek[0]);
                } else {
                    message = substitute(randomChoice(choices.nextWeekPluralAnnouncement), listArray(oneWeek));
                }
    
                // Send the message for birthdays which are in 1 week
                this._sendSlackNotification(message, {});
            }
        }, 5000);
    }

    _onStart(callback) {
        this.bot.postMessageToChannel(
            'hackhouse19birthday',
            'Hello! :robot_face: I am your loyal Birthday Bot! :robot_face:'
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