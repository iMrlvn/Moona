const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const Playlist = require("../../schema/Playlist.js");

const tracks = [];

module.exports = {
    name: ["playlist", "savecurrent"],
    description: "Save the current song to a playlist",
    category: "Playlist",
    options: [
        {
            name: "name",
            description: "The name of the playlist",
            required: true,
            type: ApplicationCommandOptionType.String,
            autocomplete: true
        }
    ],
    permissions: {
        channel: [],
        bot: [],
        user: []
    },
    settings: {
        isPremium: true,
        isPlayer: true,
        isOwner: false,
        inVoice: false,
        sameVoice: false,
    },
    async execute(ci) {
        await ci.deferReply({ ephemeral: false });

        const name = ci.args[0];
        const PName = name.replace(/_/g, ' ');

        const playlist = await Playlist.findOne({ name: PName });
        if(!playlist) return ci.editReply(`${ci.client.i18n.get(ci.language, "playlist", "savequeue_notfound")}`);
        if(playlist.owner !== ci.user.id) return ci.editReply(`${ci.client.i18n.get(ci.language, "playlist", "savequeue_owner")}`);

        const current = ci.player.queue.current;

        tracks.push(current);

        const embed = new EmbedBuilder()
            .setDescription(`${ci.client.i18n.get(ci.language, "playlist", "savequeue_saved", {
                name: PName,
                tracks: 1
                })}`)
            .setColor(ci.client.color)

        ci.editReply({ embeds: [embed] });

        playlist.tracks.push(...tracks);

        playlist.save().then(() => {
            tracks.length = 0;
        }); 
    }
}