const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: ["pause"],
    description: "Pause the music!",
    category: "Music",
    playerPermissions: ["InVoiceChannel", "InSameVoiceChannel"],
    isPlayer: true,
    async execute(ci) {
        await ci.deferReply({ ephemeral: false });
        
        await ci.player.pause(ci.player.playing);
        const Emojis = ci.player.paused ? `${ci.client.i18n.get(ci.language, "music", "pause_switch_pause")}` : `${ci.client.i18n.get(ci.language, "music", "pause_switch_resume")}`;

        const embed = new EmbedBuilder()
            .setDescription(`${ci.client.i18n.get(ci.language, "music", "pause_msg", {
                pause: Emojis
            })}`)
            .setColor(ci.client.color);

        return ci.editReply({ embeds: [embed] });
    }
}