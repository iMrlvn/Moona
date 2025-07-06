const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: ["leave"],
    description: "Disconnect the bot from your voice channel",
    category: "Music",
    isPlayer: true,
    async execute(ci) {
        await ci.deferReply({ ephemeral: false });
        
        const { channel } = ci.member.voice;

        await ci.player.destroy();
        await ci.client.UpdateMusic(ci.player);
        await ci.client.clearInterval(ci.client.interval);

        const embed = new EmbedBuilder()
            .setDescription(`${ci.client.i18n.get(ci.language, "music", "leave_msg", {
                channel: channel.name
            })}`)
            .setColor(ci.client.color);

        return ci.editReply({ embeds: [embed] })
    }
}
