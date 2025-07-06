const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: ["skip"],
    description: "Skips the song currently playing.",
    category: "Music",
    playerPermissions: ["InVoiceChannel", "InSameVoiceChannel"],
    isPlayer: true,
    async execute(ci) {
        await ci.deferReply({ ephemeral: false });
        
        if (ci.player.queue.size == 0) {
            await ci.player.destroy();
            await ci.client.UpdateMusic(ci.player);
            await ci.client.clearInterval(ci.client.interval);

            const embed = new EmbedBuilder()
                .setDescription(`${ci.client.i18n.get(ci.language, "music", "skip_msg")}`)
                .setColor(ci.client.color);
    
            return ci.editReply({ embeds: [embed] });
        } else {
            await ci.player.skip();
            await ci.client.clearInterval(ci.client.interval);

            const embed = new EmbedBuilder()
                .setDescription(`${ci.client.i18n.get(ci.language, "music", "skip_msg")}`)
                .setColor(ci.client.color);
    
            return ci.editReply({ embeds: [embed] });
        }
    }
}