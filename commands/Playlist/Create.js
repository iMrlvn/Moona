const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const Playlist = require("../../schema/Playlist.js");

module.exports = {
    name: ["playlist", "create"],
    description: "Create a new playlist",
    category: "Playlist",
    options: [
        {
            name: "name",
            description: "The name of the playlist",
            required: true,
            type: ApplicationCommandOptionType.String,
            mix_length: 3,
            max_length: 16
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
        if(playlist) return msg.edit(`${ci.client.i18n.get(ci.language, "playlist", "create_name_exist")}`);

        const Limit = await Playlist.find({ owner: ci.user.id }).countDocuments();
        if(Limit >= ci.config.PlaylistLimit) return msg.edit(`${ci.client.i18n.get(ci.language, "playlist", "create_limit_playlist", {
            limit: ci.config.PlaylistLimit
        })}`);

        const create = new Playlist({
            name: PName,
            owner: ci.user.id,
            tracks: [],
            private: true,
            created: Date.now()
        });

        create.save().then(() => {
            const embed = new EmbedBuilder()
                .setDescription(`${ci.client.i18n.get(ci.language, "playlist", "create_created", {
                    playlist: PName
                    })}`)
                .setColor(ci.client.color)
            ci.editReply({ embeds: [embed] });
        });
    }       
}