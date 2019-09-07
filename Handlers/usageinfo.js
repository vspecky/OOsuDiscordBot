const { RichEmbed } = require('discord.js');

module.exports = ({ name, usage, note, desc, aliases }) => {
    let usageEmbed = new RichEmbed()
    .setTitle(`Command: ${name}`)
    .setColor('#FD7CB6');
    if(usage) usageEmbed.addField('Usage', usage);
    if(desc) usageEmbed.addField('Description', desc);
    if(note) usageEmbed.setFooter(note);
    if(aliases) usageEmbed.setDescription(`Aliases: ${aliases.join(', ')}`);

    return usageEmbed;
}