var Bot = require('./bot');
require('dotenv').config();

console.log("Oh hello, you found the entry point!")
var bot = new Bot();

const today = "1/22"
let trelloResponse = [
    {
        "name": "Chelsea",
        "birthday": "1/22"
    },
    {
        "name": "Nora",
        "birthday": "9/26"
    },
    {
        "name": "Sam",
        "birthday": "1/22"
    },
    {
        "name": "Hello",
        "birthday": "2/11"
    },
    {
        "name": "Bot",
        "birthday": "1/1/1970"
    }
]

for (var birthday in trelloResponse) {
    if (birthday["birthday"] === today) {
        
    }
}
