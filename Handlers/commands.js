const { readdirSync, readFileSync, writeFileSync } = require('fs');
const usageEmbed = require('./usageinfo.js');
let commandjson = JSON.parse(readFileSync('./commandsinfo.json', 'utf8'));

module.exports = bot => {
    const commands = readdirSync(`./Commands/`).filter(c => c.endsWith('.js'));
    for (let file of commands) {
        const pull = require(`../Commands/${file}`);
        bot.usages.set(pull.config.name, usageEmbed(pull.config));
        bot.commands.set(pull.config.name, pull);
        commandjson[pull.config.name] = pull.config;
        writeFileSync('./commandsinfo.json', JSON.stringify(commandjson, null, 2), err => {
            if(err) console.log(err);
        });
        console.log(`${file.slice(0, -3)} command functional.`);
    }
}