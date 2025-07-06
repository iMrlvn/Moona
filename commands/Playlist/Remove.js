const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const Playlist = require("../../schema/Playlist.js");

module.exports = {
    name: ["playlist", "remove"],
    description: "Remove a song from a playlist",
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
            name: "postion",
            description: "The position of the song",
            required: true,
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

        const name = ci.args[0];
        const position = ci.args[1];

        const PName = name.replace(/_/g, ' ');
        const playlist = await Playlist.findOne({ name: PName });
        if(!playlist) return ci.editReply(`${ci.client.i18n.get(ci.language, "playlist", "remove_notfound")}`);
        if(playlist.owner !== ci.user.id) return ci.editReply(`${ci.client.i18n.get(ci.language, "playlist", "remove_owner")}`);

        const song = playlist.tracks[position];
        if(!song) return ci.editReply(`${ci.client.i18n.get(ci.language, "playlist", "remove_song_notfound")}`);

        playlist.tracks.splice(position - 1, 1);
        await playlist.save();

        const embed = new EmbedBuilder()
            .setDescription(`${ci.client.i18n.get(ci.language, "playlist", "remove_removed", {
                name: PName,
                position: position
                })}`)
            .setColor(ci.client.color)

        return ci.editReply({ embeds: [embed] });
    }
}