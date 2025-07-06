const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const formatDuration = require('../../utils/FormatDuration.js');
const { SlashPage } = require('../../utils/PageQueue.js');

module.exports = {
    name: ["queue"], // I move play to main issues subcmd (max 25)
    description: "Show the queue of songs.",
    category: "Music",
    options: [
        {
            name: "page",
            description: "Page number to show.",
            type: ApplicationCommandOptionType.Integer,
            required: false,
        }
    ],
    playerPermissions: ["InVoiceChannel", "InSameVoiceChannel"],
    isPlayer: true,
    async execute(ci) {
        await ci.deferReply({ ephemeral: false });

        const song = ci.player.queue.current;
        const qduration = `${formatDuration(ci.player.queue.length)}`;

        let pagesNum = Math.ceil(ci.player.queue.length / 10);
        if(pagesNum === 0) pagesNum = 1;

        const songStrings = [];
        for (let i = 0; i < ci.player.queue.length; i++) {
            const song = ci.player.queue[i];
            songStrings.push(
                `**${i + 1}.** [${modTitle(song.title, song)}](${song.uri}) \`[${formatDuration(song.length)}]\` • ${song.requester}
                `);
        }

        const pages = [];
        for (let i = 0; i < pagesNum; i++) {
            const str = songStrings.slice(i * 10, i * 10 + 10).join('');

            const embed = new EmbedBuilder()
                .setAuthor({ name: `${ci.client.i18n.get(ci.language, "music", "queue_author", {
                    guild: ci.guild.name,
                })}`, iconURL: ci.guild.iconURL({ dynamic: true }) })
                .setColor(ci.client.color)
                .setDescription(`${ci.client.i18n.get(ci.language, "music", "queue_description", {
                    title: song.title,
                    url: song.uri,
                    duration: formatDuration(song.length),
                    request: song.requester,
                    rest: str == '' ? '  Nothing' : '\n' + str,
                })}`)
                .setFooter({ text: `${ci.client.i18n.get(ci.language, "music", "queue_footer", {
                    page: i + 1,
                    pages: pagesNum,
                    queue_lang: ci.player.queue.length,
                    duration: qduration,
                })}` });

                if (song.thumbnail) {
                    embed.setThumbnail(`https://img.youtube.com/vi/${song.identifier}/maxresdefault.jpg`);
                } else {
                    embed.setThumbnail(ci.client.user.displayAvatarURL({ dynamic: true, size: 2048 }));
                }

            pages.push(embed);
        }
        
        const value = ci.args[0];
        if (!value) {
            if (pages.length == pagesNum && ci.player.queue.length > 10) SlashPage(ci.client, ci, pages, 60000, ci.player.queue.length, qduration, ci.language);
            else return ci.editReply({ embeds: [pages[0]] });
        } else {
            if (isNaN(value)) return ci.editReply(`${ci.client.i18n.get(ci.language, "music", "queue_notnumber")}`);
            if (value > pagesNum) return ci.editReply(`${ci.client.i18n.get(ci.language, "music", "queue_page_notfound", {
                page: pagesNum,
            })}`);
            const pageNum = value == 0 ? 1 : value - 1;
            return ci.editReply({ embeds: [pages[pageNum]] });
        }
    }
}