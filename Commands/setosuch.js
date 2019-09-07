const { RichEmbed } = require('discord.js');
const { readFileSync, writeFileSync } = require('fs');

module.exports.run = async (bot, message, args) => {

    if(!message.member.hasPermission(['ADMINISTRATOR'])) return;

    let usageEmbed = new RichEmbed(bot.usages.get(exports.config.name))

    if(!args.length || args.length > 1) return message.reply(usageEmbed);

    channelID = args[0].match(/\d{18}/)[0];

    message.channel.send(new RichEmbed({
        description: `The osu channel has been set to <#${channelID}>.`
    }));

    let setter = setInterval(() => {

        if(bot.writeflag == 0) {
            bot.writeflag = 1;
            const settings = JSON.parse(readFileSync('./settings.json', 'utf8'))

            settings["osuch"] = channelID;

            writeFileSync('./settings.json', JSON.stringify(settings), err => console.log(err));
            bot.writeflag = 0;
            clearInterval(setter);
        }

    }, 1000);

}

module.exports.config = {
    name: 'setosuch',
    usage: "```o.setosuch <#Channel/ChannelID>```",
    desc: 'Sets the osu channel.'
}