const { RichEmbed } = require('discord.js');
const fetch = require('node-fetch');
const apikey = require('../apikey.json').apikey;
const ms = require('ms');

module.exports.run = async (bot, message, args) => {

    if(!args.length && !bot.settings["users"][message.author.id]) return message.channel.send(new RichEmbed({
        description: 'Please set a profile first using `o.profset <ProfileName>` or provide a user profile.'
    }).setColor('#FD7CB6'));

    if(!args.length) return message.channel.send(await getProfileEmbed(bot.settings["users"][message.author.id]));
    else return message.channel.send(await getProfileEmbed(args.join(' ')))

}

const getProfileEmbed = async user => {

    let info = await fetch(`https://osu.ppy.sh/api/get_user?k=${apikey}&u=${user}`).then(res => res.json());

    if(!info.length) return new RichEmbed({
        description: 'The user was not found.',
    }).setColor('#FD7CB6');

    info = info[0]

    let userEmbed = new RichEmbed()
        .setColor('#FD7CB6')
        .setTitle(`Osu! Profile: ${info.username}`)
        .setURL(`https://osu.ppy.sh/users/${info.user_id}`)
        .setThumbnail(`https://a.ppy.sh/${info.user_id}`)
        .addField('Rank:', `#${info.pp_rank} (${info.country}#${info.pp_country_rank})`, true)
        .addField('PP:', info.pp_raw.match(/\d+\.?\d{2}?/)[0], true)
        .addField('Accuracy:', `${info.accuracy.match(/\d+\.?\d{2}?/)[0]}%`, true)
        .addField('Level:', info.level.match(/\d+\.?\d{2}?/)[0], true)
        .addField('Play Count:', info.playcount, true)
        .addField('Play Time:', ms(parseInt(info.total_seconds_played) * 1000, { long: true }), true)
        .addField('Ranked Score:', info.ranked_score, true)
        .addField('Total Score:', info.total_score, true)
        .setFooter('Click the title link to go to the Player Profile Page.')


    return userEmbed;

} 

module.exports.config = {
    name: 'prof',
    usage: "```o.prof <ProfileName(optional)>```",
    desc: "Displays the specified user's Osu! profile."
}