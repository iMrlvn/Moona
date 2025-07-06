const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: ["filter", "reset"],
    description: "Reset filter",
    category: "Filter",
    playerPermissions: ["InVoiceChannel", "InSameVoiceChannel"],
    isPlayer: true,
    async execute(ci) {
        await ci.deferReply({ ephemeral: false });

        const msg = await ci.editReply(`${ci.client.i18n.get(ci.language, "filters", "reset_loading")}`);

        const data = {
            op: 'filters',
            guildId: ci.guild.id,
        }

        await ci.player.node.send(data);
        await ci.player.setVolume(100);
        
        const embed = new EmbedBuilder()
            .setDescription(`${ci.client.i18n.get(ci.language, "filters", "reset_on")}`)
            .setColor(ci.client.color);

        await delay(2000);
        msg.edit({ content: " ", embeds: [embed] });
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}