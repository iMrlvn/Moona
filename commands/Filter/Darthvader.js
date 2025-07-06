const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: ["filter", "darthvader"],
    description: "Turning on darthvader filter",
    category: "Filter",
    playerPermissions: ["InVoiceChannel", "InSameVoiceChannel"],
    isPlayer: true,
    async execute(ci) {
        await ci.deferReply({ ephemeral: false });
        
        const msg = await ci.editReply(`${ci.client.i18n.get(ci.language, "filters", "filter_loading", {
            name: "darthvader"
        })}`);

        const data = {
            op: 'filters',
            guildId: ci.guild.id,
            timescale: {
                speed: 0.975,
                pitch: 0.5,
                rate: 0.8
            },
        }

        await ci.player.node.send(data);

        const embed = new EmbedBuilder()
            .setDescription(`${ci.client.i18n.get(ci.language, "filters", "filter_on", {
                name: "darthvader"
            })}`)
            .setColor(ci.client.color);

        await delay(2000);
        msg.edit({ content: " ", embeds: [embed] });
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}