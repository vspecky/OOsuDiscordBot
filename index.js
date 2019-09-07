const { Client, Collection } = require('discord.js');
const { readFileSync } = require('fs');
let bot = new Client({ disableEveryone: true });
['commands', 'usages'].forEach(field => bot[field] = new Collection());
['commands', 'events'].forEach(handler => require(`./Handlers/${handler}`)(bot));
bot.writeflag = 0;
bot.login('yourtokenhere');

setInterval(() => {
    if(bot.writeflag == 0) {
        bot.writeflag = 1;
        let sets = JSON.parse(readFileSync('./settings.json', 'utf8'));
        bot.settings = sets;
        bot.writeflag = 0;
    }  
}, 10000);