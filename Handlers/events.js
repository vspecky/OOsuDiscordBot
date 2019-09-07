const { readdirSync } = require("fs");

module.exports = bot => {
    const events = readdirSync(`./Events/`).filter(e => e.endsWith('.js'));
    for (let file of events) {
        const evt = require(`../Events/${file}`);
        let eName = file.split(".")[0];
        bot.on(eName, evt.bind(null, bot));
    }
}