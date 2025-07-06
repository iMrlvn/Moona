const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const Playlist = require("../../schema/Playlist.js");

module.exports = {
    name: ["playlist", "public"],
    description: "Public a playlist",
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
        isPlayer: false,
        isOwner: false,
        inVoice: false,
        sameVoice: false,
    },
    async execute(ci) {
        await ci.deferReply({ ephemeral: false });

        const name = ci.args[0];

        const PName = name.replace(/_/g, ' ');
        const playlist = await Playlist.findOne({ name: PName });
        if(!playlist) return ci.editReply(`${ci.client.i18n.get(ci.language, "playlist", "public_notfound")}`);
        if(playlist.owner !== ci.user.id) return ci.editReply(`${ci.client.i18n.get(ci.language, "playlist", "public_owner")}`);

        const Public = await Playlist.findOne({ name: PName, private: false });
        if(Public) return ci.editReply(`${ci.client.i18n.get(ci.language, "playlist", "public_already")}`);

        playlist.private = false;

        playlist.save().then(() => {
            const embed = new EmbedBuilder()
                .setDescription(`${ci.client.i18n.get(ci.language, "playlist", "public_success")}`)
                .setColor(ci.client.color)
            ci.editReply({ embeds: [embed] });
        });
    }
}