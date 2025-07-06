const { MoonaCommand } = require("../../structures/index.js");
const { EmbedBuilder } = require('discord.js');

module.exports = new MoonaCommand({
    name: ["filter", "bass"],
    description: "Turning on bass filter",
    category: "Filter",
    playerPermissions: ["InVoiceChannel", "InSameVoiceChannel"],
    isPlayer: true,
    async execute(ci) {
        await ci.deferReply({ ephemeral: false });

        const msg = await ci.editReply(`${ci.client.i18n.get(ci.language, "filters", "filter_loading", {
            name: "bass"
        })}`);

        const data = {
            op: 'filters',
            guildId: ci.guild.id,
            equalizer: [
                { band: 0, gain: 0.10 },
                { band: 1, gain: 0.10 },
                { band: 2, gain: 0.05 },
                { band: 3, gain: 0.05 },
                { band: 4, gain: -0.05 },
                { band: 5, gain: -0.05 },
                { band: 6, gain: 0 },
                { band: 7, gain: -0.05 },
                { band: 8, gain: -0.05 },
                { band: 9, gain: 0 },
                { band: 10, gain: 0.05 },
                { band: 11, gain: 0.05 },
                { band: 12, gain: 0.10 },
                { band: 13, gain: 0.10 },
            ],
        }
        
        await ci.player.node.send(data);

        const bassed = new EmbedBuilder()
            .setDescription(`${ci.client.i18n.get(ci.language, "filters", "filter_on", {
                name: "bass"
            })}`)
            .setColor(ci.client.color);

        await delay(2000);
        msg.edit({ content: " ", embeds: [bassed] });
    }
})

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}