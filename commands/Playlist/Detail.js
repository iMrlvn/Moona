const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const formatDuration = require('../../utils/FormatDuration.js');
const { SlashPage } = require('../../utils/PageQueue.js');
const Playlist = require("../../schema/Playlist.js");

module.exports = {
    name: ["playlist", "detail"],
    description: "Detail a playlist",
    category: "Playlist",
    options: [
        {
            name: "name",
            description: "The name of the playlist",
            required: true,
            type: ApplicationCommandOptionType.String,
            autocomplete: true
        },
        {
            name: "page",
            description: "The page you want to view",
            required: false,
            type: ApplicationCommandOptionType.Integer,
        }
    ],
    permissions: {
        channel: [],
        bot: [],
        user: []
    },
    settings: {
        isPremium: true,
        isPlayer: false,
        isOwner: false,
        inVoice: false,
        sameVoice: false,
    },
    async execute(ci) {
        await ci.deferReply({ ephemeral: false });
        
        const name = ci.args[0];
        const number = ci.args[1];

        const PName = name.replace(/_/g, ' ');
        const playlist = await Playlist.findOne({ name: PName });
        if(!playlist) return ci.editReply(`${ci.client.i18n.get(ci.language, "playlist", "detail_notfound")}`);
        if(playlist.private && playlist.owner !== ci.user.id) return ci.editReply(`${ci.client.i18n.get(ci.language, "playlist", "detail_private")}`);

        let pagesNum = Math.ceil(playlist.tracks.length / 10);
        if(pagesNum === 0) pagesNum = 1;

        const playlistStrings = [];
        for(let i = 0; i < playlist.tracks.length; i++) {
            const playlists = playlist.tracks[i];
            playlistStrings.push(
                `${ci.client.i18n.get(ci.language, "playlist", "detail_track", {
                    num: i + 1,
                    title: playlists.title,
                    url: playlists.uri,
                    author: playlists.author,
                    duration: formatDuration(playlists.length)
                })}
                `);
        }

        const totalDuration = formatDuration(playlist.tracks.reduce((acc, cur) => acc + cur.length, 0));

        const pages = [];
        for (let i = 0; i < pagesNum; i++) {
            const str = playlistStrings.slice(i * 10, i * 10 + 10).join('');
            const embed = new EmbedBuilder() //${playlist.name}'s Playlists
                .setAuthor({ name: `${ci.client.i18n.get(ci.language, "playlist", "detail_embed_title", {
                    name: playlist.name
                })}`, iconURL: ci.user.displayAvatarURL() })
                .setDescription(`${str == '' ? '  Nothing' : '\n' + str}`)
                .setColor(ci.client.color) //Page • ${i + 1}/${pagesNum} | ${playlist.tracks.length} • Songs | ${totalDuration} • Total duration
                .setFooter({ text: `${ci.client.i18n.get(ci.language, "playlist", "detail_embed_footer", {
                    page: i + 1,
                    pages: pagesNum,
                    songs: playlist.tracks.length,
                    duration: totalDuration
                })}` });

            pages.push(embed);
        }

        if (!number) {
            if (pages.length == pagesNum && playlist.tracks.length > 10) SlashPage(ci.client, ci, pages, 60000, playlist.tracks.length, totalDuration, ci.language);
            else return ci.editReply({ embeds: [pages[0]] });
        } else {
            if (isNaN(number)) return ci.editReply(`${ci.client.i18n.get(ci.language, "playlist", "detail_notnumber")}`);
            if (number > pagesNum) return ci.editReply(`${ci.client.i18n.get(ci.language, "playlist", "detail_page_notfound", {
                page: pagesNum
            })}`);
            const pageNum = number == 0 ? 1 : number - 1;
            return ci.editReply({ embeds: [pages[pageNum]] });
        } 
    }
}