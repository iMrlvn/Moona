const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: ["filter", "vibrate"],
    description: "Turning on vibrate filter",
    category: "Filter",
    playerPermissions: ["InVoiceChannel", "InSameVoiceChannel"],
    isPlayer: true,
    async execute(ci) {
        await ci.deferReply({ ephemeral: false });
        
        const msg = await ci.editReply(`${ci.client.i18n.get(ci.language, "filters", "filter_loading", {
            name: "vibrate"
        })}`);

        const data = {
            op: 'filters',
            guildId: ci.guild.id,
            vibrato: {
                frequency: 4.0,
                depth: 0.75
            },
            tremolo: {
                frequency: 4.0,
                depth: 0.75
            },
        }

        await ci.player.node.send(data);

        const embed = new EmbedBuilder()
            .setDescription(`${ci.client.i18n.get(ci.language, "filters", "filter_on", {
                name: "vibrate"
            })}`)
            .setColor(ci.client.color);

        await delay(2000);
        msg.edit({ content: " ", embeds: [embed] });
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}