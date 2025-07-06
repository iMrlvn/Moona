const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: ["replay"],
    description: "Replay the current song!",
    category: "Music",
    playerPermissions: ["InVoiceChannel", "InSameVoiceChannel"],
    isPlayer: true,
    async execute(ci) {
        await ci.deferReply({ ephemeral: false });

        await ci.player.seek(0);

        const embed = new EmbedBuilder()
            .setDescription(`${ci.client.i18n.get(ci.language, "music", "replay_msg")}`)
            .setColor(ci.client.color);

        return ci.editReply({ embeds: [embed] });
    }
}