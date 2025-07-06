const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: ["247"],
    description: "24/7 in voice channel",
    category: "Music",
    playerPermissions: ["InVoiceChannel"],
    isPlayer: true,
    async execute(ci) {
        await ci.deferReply({ ephemeral: false });

        if (ci.player.twentyFourSeven) {
            ci.player.twentyFourSeven = false;

            const embed = new EmbedBuilder()
                .setDescription(`${ci.client.i18n.get(ci.language, "music", "247_off")}`)
                .setColor(ci.client.color);

            return ci.editReply({ embeds: [embed] });
        } else {
            ci.player.twentyFourSeven = true;

            const embed = new EmbedBuilder()
                .setDescription(`${ci.client.i18n.get(ci.language, "music", "247_on")}`)
                .setColor(ci.client.color);

            return ci.editReply({ embeds: [embed] });
        }
    }
}