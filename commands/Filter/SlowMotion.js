const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: ["filter", "slowmotion"],
    description: "Turning on slowmotion filter",
    category: "Filter",
    playerPermissions: ["InVoiceChannel", "InSameVoiceChannel"],
    isPlayer: true,
    async execute(ci) {
        await ci.deferReply({ ephemeral: false });
        
        const msg = await ci.editReply(`${ci.client.i18n.get(ci.language, "filters", "filter_loading", {
            name: "slowmotion"
        })}`);

        const data = {
            op: 'filters',
            guildId: ci.guild.id,
            timescale: {
                speed: 0.5,
                pitch: 1.0,
                rate: 0.8
            }
        }

        await ci.player.node.send(data);

        const embed = new EmbedBuilder()
            .setDescription(`${ci.client.i18n.get(ci.language, "filters", "filter_on", {
                name: "slowmotion"
            })}`)
            .setColor(ci.client.color);

        await delay(2000);
        msg.edit({ content: " ", embeds: [embed] });
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}