const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: ["filter", "rate"],
    description: "Sets the rate of the song.",
    category: "Filter",
    options: [
        {
            name: "amount",
            description: "The amount of rate to set.",
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
            timescale: { rate: value },
        }

        await ci.player.node.send(data);
        
        const msg = await ci.editReply(`${ci.client.i18n.get(ci.language, "filters", "rate_loading", {
            amount: value
        })}`);

        const embed = new EmbedBuilder()
            .setDescription(`${ci.client.i18n.get(ci.language, "filters", "rate_on", {
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