const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: ["previous"],
    description: "Play the previous song in the queue.",
    category: "Music",
    playerPermissions: ["InVoiceChannel", "InSameVoiceChannel"],
    isPlayer: true,
    async execute(ci) {
        await ci.deferReply({ ephemeral: false });
        
        if (!ci.player.queue.previous) return ci.editReply(`${ci.client.i18n.get(ci.language, "music", "previous_notfound")}`);

        await ci.player.queue.unshift(ci.player.queue.previous);
        await ci.player.skip();

        const embed = new EmbedBuilder()
            .setDescription(`${ci.client.i18n.get(ci.language, "music", "previous_msg")}`)
            .setColor(ci.client.color);

        return ci.editReply({ embeds: [embed] });
    }
}