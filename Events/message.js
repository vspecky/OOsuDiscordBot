const prefix = 'o.';
const fetch = require('node-fetch');
const apikey = require('../apikey.json').apikey;
const { RichEmbed } = require('discord.js');
let cmdcooldown = new Set();

module.exports = async (bot, message) => {

    if(message.author.bot || message.channel.type === 'dm') return;


    if(message.content.startsWith(prefix)) {
        if(cmdcooldown.has(message.author.id)) return message.channel.send(new RichEmbed({
            description: 'Whoa! be patient. One command every 10 seconds.'
        }).setColor('#FD7CB6'));

        const messageArray = message.content.split(/ +/g);
        const cmd = messageArray[0].slice(prefix.length).toLowerCase();
        const args = messageArray.slice(1);
        const commandFile = bot.commands.get(cmd);

        if(commandFile && !cmdcooldown.has(message.author.id) && (message.channel.id == bot.settings["osuch"] || commandFile.config.name == 'setosuch')) {
            cmdcooldown.add(message.author.id);

            setTimeout(() => {
                cmdcooldown.delete(message.author.id)
            }, 10000);

            return commandFile.run(bot, message, args);
        }
    }

    if(message.channel.id == bot.settings["osuch"]) await checkForBeatmaps(message);
}

const checkForBeatmaps = async msg => {

    const regex = /https:\/\/osu.ppy.sh\/beatmapsets\/\d+#osu\/\d+/g;

    const matches = msg.content.match(regex);

    if(!matches) return;

    for(let ids of matches) {
        const idmatches = ids.match(/\d+/g);

        let binfo = await fetch(`https://osu.ppy.sh/api/get_beatmaps?k=${apikey}&b=${idmatches[1]}`).then(res => res.json());

        if(!binfo) return;

        binfo = binfo[0];

        let bEmbed = new RichEmbed()
        .setTitle(`${binfo.artist} - ${binfo.title} [${binfo.version}] (Mapper: ${binfo.creator})`)
        .setColor('#FD7CB6')
        .setImage(`https://assets.ppy.sh/beatmaps/${idmatches[0]}/covers/cover.jpg`);

        let infostr = ''

        const lenmin = Math.floor(Number(binfo.total_length)/60);
        let lensec = Number(binfo.total_length) - (lenmin*60);
        lensec = lensec.toString();

        while(lensec.length < 2) {
            lensec = '0' + lensec;
        }

        infostr += `**Star Rating:** ${binfo.difficultyrating.match(/\d+\.?\d{2}?/)[0]}* | **Status:** ${status[`${binfo.approved}`]}\n`
        infostr += `**Length:** ${lenmin}:${lensec} | **BPM:** ${binfo.bpm}\n`;
        infostr += `**CS:** ${binfo.diff_size} | **OD:** ${binfo.diff_overall} | **AR:** ${binfo.diff_approach} | **HP:** ${binfo.diff_drain}\n`;
        infostr += `**Circles:** ${binfo.count_normal} | **Sliders:** ${binfo.count_slider} | **Spinners:** ${binfo.count_spinner}\n`;
        infostr += `**Max Combo:** x${binfo.max_combo} | **Play Count:** ${binfo.playcount}\n\n`;
        infostr += `Download this beatmap [here](https://osu.ppy.sh/beatmapsets/${idmatches[0]}/download?NoVideo=1) (No Video).`

        bEmbed.setDescription(infostr);

        msg.channel.send('Beatmap Detected:', { embed: bEmbed });
    }

}

const status = {
    '4': 'Loved',
    '3': 'Qualified',
    '2': 'Approved',
    '1': 'Ranked',
    '0': 'Pending',
    '-1': 'WIP',
    '-2': 'Graveyard'
}