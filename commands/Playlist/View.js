const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const { SlashPlaylist } = require('../../utils/PageQueue.js');
const Playlist = require("../../schema/Playlist.js");
const humanizeDuration = require('humanize-duration');

module.exports = {
    name: ["playlist", "view"],
    description: "View your playlists",
    category: "Playlist",
    options: [
        {
            name: "page",
            description: "The page you want to view",
            required: false,
            type: ApplicationCommandOptionType.Integer
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

        const number = ci.args[0];

        const playlists = await Playlist.find({ owner: ci.user.id });

        let pagesNum = Math.ceil(playlists.length / 10);
        if(pagesNum === 0) pagesNum = 1;

        const tracks = [];
        for(let i = 0; i < playlists.length; i++) {
            const playlist = playlists[i];
            const created = humanizeDuration(Date.now() - playlists[i].created, { largest: 1 })
            tracks.push(
                `${ci.client.i18n.get(ci.language, "playlist", "view_embed_playlist", {
                    num: i + 1,
                    name: playlist.name,
                    tracks: playlist.tracks.length,
                    create: created
                })}
                `);
        }

        const pages = [];
        for (let i = 0; i < pagesNum; i++) {
            const str = tracks.slice(i * 10, i * 10 + 10).join('');
            const embed = new EmbedBuilder()
                .setAuthor({ name: `${ci.client.i18n.get(ci.language, "playlist", "view_embed_title", {
                    user: ci.user.username
                })}`, iconURL: ci.user.displayAvatarURL() })
                .setDescription(`${str == '' ? '  Nothing' : '\n' + str}`)
                .setColor(ci.client.color)
                .setFooter({ text: `${ci.client.i18n.get(ci.language, "playlist", "view_embed_footer", {
                    page: i + 1,
                    pages: pagesNum,
                    songs: playlists.length
                })}` });

            pages.push(embed);
        }
        if (!number) {
            if (pages.length == pagesNum && playlists.length > 10) SlashPlaylist(ci.client, ci, pages, 30000, playlists.length, ci.language);
            else return ci.editReply({ embeds: [pages[0]] });
        } else {
            if (isNaN(number)) return ci.editReply({ content: `${ci.client.i18n.get(ci.language, "playlist", "view_notnumber")}` });
            if (number > pagesNum) return ci.editReply({ content: `${ci.client.i18n.get(ci.language, "playlist", "view_page_notfound", {
                page: pagesNum
            })}` });
            const pageNum = number == 0 ? 1 : number - 1;
            return ci.editReply({ embeds: [pages[pageNum]] });
        }
    }
}