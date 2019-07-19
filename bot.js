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
        "Cake tastes better if shared! Here are your beloved b-day cake \"excuses\" today!",
        "Today is the best day of my life so far! And here's why: it's a birthday day!",
        "I know your Social Security Number! Actually I don't, but now that I have your attention: today's birthday announcement!"
    ],
    nextWeekSingularAnnouncement: [
        "Save some money in the next 7 days to buy cake for ${0}'s birthday!",
        "Did you know that ${0} has a birthday next week? Well, now you do!",
        "Alert! :warning: ${0}'s birthday will be here in a week!"
    ],
    nextWeekPluralAnnouncement: [
        "Save some money in the next 7 days to buy cake for ${0}'s birthdays!'",
        "Did you know that ${0} have birthdays next week? Well, now you do!",
        "Alert! :warning: ${0}'s birthdays will be here in a week!"
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

module.exports = class BirthdayBot {
    constructor(callback) {
        this.bot = new SlackBot({
            token: process.env.SLACK_TOKEN,
            name: 'birthdaybot'
        });

        this.birthdays = {};

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

    registerBirthday(name, birthday) {
        this.birthdays[name] = birthday;
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
            for (var name in this.birthdays) {
                console.log(name);
                if (lower.includes(name.toLowerCase()) || lower.includes(name.split(" ")[0].toLowerCase())) {
                    message = name + "'s birthday is on " + this.birthdays[name] + "! :party:";
                    break;
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
