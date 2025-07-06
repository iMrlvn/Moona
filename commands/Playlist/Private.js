const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const Playlist = require("../../schema/Playlist.js");

module.exports = {
    name: ["playlist", "private"],
    description: "Private a playlist",
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
        
        const name = ci.args.join(" ");

        const PName = name.replace(/_/g, ' ');
        const playlist = await Playlist.findOne({ name: PName });
        if(!playlist) return ci.editReply(`${ci.client.i18n.get(ci.language, "playlist", "private_notfound")}`);
        if(playlist.owner !== ci.user.id) return ci.editReply(`${ci.client.i18n.get(ci.language, "playlist", "private_owner")}`);

        const Private = await Playlist.findOne({ name: PName, private: true });
        if(Private) return ci.editReply(`${ci.client.i18n.get(ci.language, "playlist", "private_already")}`);

        playlist.private = true;

        playlist.save().then(() => {
            const embed = new EmbedBuilder()
                .setDescription(`${ci.client.i18n.get(ci.language, "playlist", "private_success")}`)
                .setColor(ci.client.color)
            ci.editReply({ embeds: [embed] });
        });
    }
}