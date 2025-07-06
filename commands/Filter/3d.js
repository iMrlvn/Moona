const { MoonaCommand } = require("../../structures/index.js");
const { EmbedBuilder } = require('discord.js');

module.exports = new MoonaCommand({
    name: ["filter", "3d"],
    description: "Turning on 3d filter",
    category: "Filter",
    playerPermissions: ["InVoiceChannel", "InSameVoiceChannel"],
    isPlayer: true,
    async execute(ci) {
        await ci.deferReply({ ephemeral: false });

        const msg = await ci.editReply(`${ci.client.i18n.get(ci.language, "filters", "filter_loading", {
            name: "3d"
        })}`);

        const data = {
            op: 'filters',
            guildId: ci.guild.id,
            rotation: { rotationHz: 0.2 }
        }

        await ci.player.node.send(data);

        const embed = new EmbedBuilder()
            .setDescription(`${ci.client.i18n.get(ci.language, "filters", "filter_on", {
                name: "3d"
            })}`)
            .setColor(ci.client.color);

        await delay(2000);
        msg.edit({ content: " ", embeds: [embed] });
    }
})

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}