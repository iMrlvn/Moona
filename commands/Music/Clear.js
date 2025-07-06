const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: ["clear"],
    description: "Clear song in queue!",
    category: "Music",
    playerPermissions: ["InVoiceChannel", "InSameVoiceChannel"],
    isPlayer: true,
    async execute(ci) {
        await ci.deferReply({ ephemeral: false });

        await ci.player.queue.clear();
        
        const embed = new EmbedBuilder()
            .setDescription(`${ci.client.i18n.get(ci.language, "music", "clearqueue_msg")}`)
            .setColor(ci.client.color);
            
        return ci.editReply({ embeds: [embed] });
    }
}