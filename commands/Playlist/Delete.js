const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const Playlist = require("../../schema/Playlist.js");

module.exports = {
    name: ["playlist", "delete"],
    description: "Delete a playlist",
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
        if(!playlist) return ci.editReply(`${ci.client.i18n.get(ci.language, "playlist", "delete_notfound")}`);
        if(playlist.owner !== ci.user.id) return ci.editReply(`${ci.client.i18n.get(ci.language, "playlist", "delete_owner")}`);

        await playlist.delete();

        const embed = new EmbedBuilder()
            .setDescription(`${ci.client.i18n.get(ci.language, "playlist", "delete_deleted", {
                name: PName
            })}`)
            .setColor(ci.client.color)

        return ci.editReply({ embeds: [embed] });
    }
}