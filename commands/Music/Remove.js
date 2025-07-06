const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const { convertTime } = require("../../utils/ConvertTime.js");

module.exports = {
    name: ["remove"],
    description: "Remove song from queue!",
    category: "Music",
    options: [
        {
            name: "position",
            description: "The position in queue want to remove.",
            type: ApplicationCommandOptionType.Integer,
            required: true,
        }
    ],
    playerPermissions: ["InVoiceChannel", "InSameVoiceChannel"],
    isPlayer: true,
    async execute(ci) {
        await ci.deferReply({ ephemeral: false });

        const tracks = ci.args[0];
        if (tracks == 0) return ci.editReply(`${ci.client.i18n.get(ci.language, "music", "removetrack_already")}`);
        if (tracks > ci.player.queue.length) return ci.editReply(`${ci.client.i18n.get(ci.language, "music", "removetrack_notfound")}`);

        const song = ci.player.queue[tracks - 1];

        ci.player.queue.splice(tracks - 1, 1);

        const embed = new EmbedBuilder()
            .setDescription(`${ci.client.i18n.get(ci.language, "music", "removetrack_desc", {
                name: modTitle(song.title, song),
                url: song.uri,
                duration: convertTime(song.length, true),
                request: song.requester
            })
        }`)

        return ci.editReply({ embeds: [embed] });
    }
}