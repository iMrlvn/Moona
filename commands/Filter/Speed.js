const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: ["filter", "speed"],
    description: "Sets the speed of the song.",
    category: "Filter",
    options: [
        {
            name: "amount",
            description: "The amount of speed to set the song to.",
            type: ApplicationCommandOptionType.Integer,
            required: true,
            min_value: 0,
            max_value: 10
        }
    ],
    playerPermissions: ["InVoiceChannel", "InSameVoiceChannel"],
    isPlayer: true,
    async execute(ci) {
        await ci.deferReply({ ephemeral: false });
        
        const value = ci.args[0];

        const data = {
            op: 'filters',
            guildId: ci.guild.id,
            timescale: { speed: value },
        }

        await ci.player.node.send(data);

        const msg = await ci.editReply(`${ci.client.i18n.get(ci.language, "filters", "speed_loading", {
            amount: value
        })}`);

        const embed = new EmbedBuilder()
            .setDescription(`${ci.client.i18n.get(ci.language, "filters", "speed_on", {
                amount: value
            })}`)
            .setColor(ci.client.color);

        await delay(2000);
        msg.edit({ content: " ", embeds: [embed] });
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}