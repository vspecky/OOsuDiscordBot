const { RichEmbed } = require('discord.js');
const { readFileSync, writeFileSync } = require('fs');

module.exports.run = async (bot, message, args) => {

    if(!args.length) return message.channel.send(new RichEmbed(bot.usages.get(exports.config.name)).setColor('#FD7CB6'))

    //bot.userprofs.set(message.author.id, args.join(' '));

    message.channel.send(new RichEmbed({
        description: `<@${message.author.id}>'s osu! profile was set to ${args.join(' ')}`
    }).setColor('#FD7CB6'));

    let setter = setInterval(() => {

        if(bot.writeflag == 0) {
            bot.writeflag = 1;
            const settings = JSON.parse(readFileSync('./settings.json', 'utf8'))

            settings["users"][message.author.id] = args.join(' ');

            writeFileSync('./settings.json', JSON.stringify(settings), err => console.log(err));
            bot.writeflag = 0;
            clearInterval(setter);
        }
        
    }, 1000);

}

module.exports.config = {
    name: 'profset',
    usage: "```o.profset <ProfileName>```",
    desc: 'Sets the Osu! profile of the user.'
}