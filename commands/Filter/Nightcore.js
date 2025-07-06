const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: ["filter", "nightcore"],
    description: "Turning on nightcore filter",
    category: "Filter",
    playerPermissions: ["InVoiceChannel", "InSameVoiceChannel"],
    isPlayer: true,
    async execute(ci) {
        await ci.deferReply({ ephemeral: false });
        
        const msg = await ci.editReply(`${ci.client.i18n.get(ci.language, "filters", "filter_loading", {
            name: "nightcore"
        })}`);

        const data = {
            op: 'filters',
            guildId: ci.guild.id,
            timescale: {
                speed: 1.165,
                pitch: 1.125,
                rate: 1.05
            },
        }

        await ci.player.node.send(data);

        const embed = new EmbedBuilder()
            .setDescription(`${ci.client.i18n.get(ci.language, "filters", "filter_on", {
                name: "nightcore"
            })}`)
            .setColor(ci.client.color);

        await delay(2000);
        msg.edit({ content: " ", embeds: [embed] });
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}