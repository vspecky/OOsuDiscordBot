const { RichEmbed } = require('discord.js');

let helpembed = new RichEmbed()
.setTitle('OOsu! Commands List:')
.setColor('#FD7CB6')
.addField('Osu! Commands:', "`prof`, `profset`, `recent`, `top`")
.addField('Settings:', "`setosuch`")
.setFooter("Type 'o.help <CommandName>' for more information on each command.")

module.exports.run = async (bot, message, args) => {

    let usageEmbed = new RichEmbed(bot.usages.get(exports.config.name));

    if(!args[0]) return message.reply(helpembed);

    const command = bot.commands.get(args[0].toLowerCase())

    if(!command) return message.reply(new RichEmbed({
        description: 'That command does not exist.'
    }).setColor('#FD7CB6'));

    return message.channel.send(new RichEmbed(bot.usages.get(command.config.name)));

}

module.exports.config = {
    name: 'help',
    usage: "```o.help <CommandName>```",
    desc: 'Shows information regarding the specified command.'
}