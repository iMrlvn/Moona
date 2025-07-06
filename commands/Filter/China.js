const { MoonaCommand } = require("../../structures/index.js");
const { EmbedBuilder } = require('discord.js');

module.exports = new MoonaCommand({
    name: ["filter", "china"],
    description: "Turning on china filter",
    category: "Filter",
    playerPermissions: ["InVoiceChannel", "InSameVoiceChannel"],
    isPlayer: true,
    async execute(ci) {
        await ci.deferReply({ ephemeral: false });
        
        const msg = await ci.editReply(`${ci.client.i18n.get(ci.language, "filters", "filter_loading", {
            name: "china"
        })}`);

        const data = {
            op: 'filters',
            guildId: ci.guild.id,
            timescale: { 
                speed: 0.75, 
                pitch: 1.25, 
                rate: 1.25 
            }
        }

        await ci.player.node.send(data);

        const embed = new EmbedBuilder()
            .setDescription(`${ci.client.i18n.get(ci.language, "filters", "filter_on", {
                name: "china"
            })}`)
            .setColor(ci.client.color);

        await delay(2000);
        msg.edit({ content: " ", embeds: [embed] });
    }
})

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}