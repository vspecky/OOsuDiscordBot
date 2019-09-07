const { RichEmbed } = require('discord.js');
const fetch = require('node-fetch');
const apikey = require('../apikey.json').apikey;
const ms = require('ms');

module.exports.run = async (bot, message, args) => {

    if(!args.length && !bot.settings["users"][message.author.id]) return message.channel.send(new RichEmbed({
        description: 'Please set a profile first using `o.profset <ProfileName>` or provide a user profile.'
    }).setColor('#FD7CB6'));

    if(!args.length) return message.channel.send(await getRecentEmbed(bot.settings["users"][message.author.id]));
    else return message.channel.send(await getRecentEmbed(args.join(' ')))

}

const getRecentEmbed = async user => {

    let info = await fetch(`https://osu.ppy.sh/api/get_user_recent?k=${apikey}&u=${user}&limit=5`).then(res => res.json());

    if(!info.length) return new RichEmbed({
        description: 'The user was not found or has no recent scores.',
    }).setColor('#FD7CB6');

    info = info[0];

    let recentEmbed = new RichEmbed()
    .setColor('#FD7CB6')
    .setTitle(`User Most Recent: ${user}`)
    .setURL(`https://osu.ppy.sh/users/${info.user_id}`)
    .setThumbnail(`https://a.ppy.sh/${info.user_id}`)
    .setFooter('Click the title link to go to the Player Profile Page.');

    let binfo = await fetch(`https://osu.ppy.sh/api/get_beatmaps?k=${apikey}&b=${info.beatmap_id}`).then(res => res.json());

    let s300 = Number(info.count300);
    let s100 = Number(info.count100);
    let s50 = Number(info.count50);

    let acc = (((s300 * 300) + (s100 * 100) + (s50 * 50)) / ((s300 + s100 + s50) * 300)) * 100;

    let rank = info.rank;
    if(rank == 'SH') rank = 'S+';

    binfo = binfo[0];

    const lenmin = Math.floor(Number(binfo.total_length)/60);
    let lensec = Number(binfo.total_length) - (lenmin*60);
    lensec = lensec.toString();

    while(lensec.length < 2) {
        lensec = '0' + lensec;
    }

    let infostr = '';
    infostr += `**Score:** ${info.score} | **Rank:** ${rank} | **PP:** ${info.pp}\n`;
    infostr += `**Length:** ${lenmin}:${lensec} | **Accuracy:** ${acc.toString().match(/\d+\.?\d{2}?/)[0]}%\n`
    infostr += `**300s:** ${info.count300} | **100s:** ${info.count100} | **50s:** ${info.count50} | **Miss:** ${info.countmiss}\n`;
    infostr += `**Combo:** x${info.maxcombo}/x${binfo.max_combo} | **Mods:** +${getMods(info.enabled_mods)}\n`;
    infostr += `**Set:** ${ms(Date.now() - new Date(info.date).getTime(), { long: true })} ago`;

    recentEmbed.addField(`${binfo.artist} - ${binfo.title} [${binfo.version}] [${binfo.difficultyrating.match(/\d+\.?\d{2}?/)[0]}*] (Mapper: ${binfo.creator})`, infostr);

    return recentEmbed;

}

const getMods = modno => {

    let sumnos = [];

    if(modno == 0) sumnos.push(0);
    else while(modno != 0) {
        let pow = 1;
        while(Math.pow(2, pow) <= modno) {
            pow += 1
        }
        sumnos.push(Math.pow(2, pow-1))
        modno -= Math.pow(2, pow-1);
    }

    if(sumnos.includes(512)) sumnos.splice(sumnos.indexOf(64));
    if(sumnos.includes(16384)) sumnos.splice(sumnos.indexOf(32));

    let modstr = '';

    for (let i = sumnos.length - 1; i >= 0; i--) {
        modstr += mods[`${sumnos[i]}`];
    }

    return modstr;

}

const mods = {
    '0': 'NoMod',
    '1': 'NF',
    '2': 'EZ',
    '4': 'TD',
    '8': 'HD',
    '16': 'HR',
    '32': 'SD',
    '64': 'DT',
    '128': 'RX',
    '256': 'HT',
    '512': 'NC',
    '1024': 'FL',
    '2048': 'AT',
    '4096': 'SO',
    '16384': 'PF'
}

module.exports.config = {
    name: 'recent',
    usage: "```o.recent <UserName>```",
    desc: 'Gets the most recent score of the user.'
}