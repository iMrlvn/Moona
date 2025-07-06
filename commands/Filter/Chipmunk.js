const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: ["filter", "chipmunk"],
    description: "Turning on chipmunk filter",
    category: "Filter",
    playerPermissions: ["InVoiceChannel", "InSameVoiceChannel"],
    isPlayer: true,
    async execute(ci) {
        await ci.deferReply({ ephemeral: false });
        
        const msg = await ci.editReply(`${ci.client.i18n.get(ci.language, "filters", "filter_loading", {
            name: "chipmunk"
        })}`);

        const data = {
            op: 'filters',
            guildId: ci.guild.id,
            timescale: {
                speed: 1.05,
                pitch: 1.35,
                rate: 1.25
            },
        }

        await ci.player.node.send(data);

        const embed = new EmbedBuilder()
            .setDescription(`${ci.client.i18n.get(ci.language, "filters", "filter_on", {
                name: "chipmunk"
            })}`)
            .setColor(ci.client.color);

        await delay(2000);
        msg.edit({ content: " ", embeds: [embed] });
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}