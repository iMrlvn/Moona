const { MoonaCommand } = require("../../structures/index.js");
const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = new MoonaCommand({
    name: ["filter", "bassboost"],
    description: 'Turning on bassboost filter',
    category: "Filter",
    options: [
        {
            name: 'amount',
            description: 'The amount of the bassboost',
            type: ApplicationCommandOptionType.Integer,
            required: false,
            min_value: 0,
            max_value: 10
        }
    ],
    playerPermissions: ["InVoiceChannel", "InSameVoiceChannel"],
    isPlayer: true,
    async execute(ci) {
        await ci.deferReply({ ephemeral: false });

        const value = ci.args[0];
        if(!value) {
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
                ]
            }

            await ci.player.node.send(data);

            const msg = await ci.editReply(`${ci.client.i18n.get(ci.language, "filters", "filter_loading", {
                name: "bassboost"
            })}`);

            const embed = new EmbedBuilder()
                .setDescription(`${ci.client.i18n.get(ci.language, "filters", "filter_on", {
                    name: "bassboost"
                })}`)
                .setColor(ci.client.color);
                    
            await delay(2000);
            return msg.edit({ content: " ", embeds: [embed] });
        } else {
            const data = {
                op: 'filters',
                guildId: ci.guild.id,
                equalizer: [
                    { band: 0, gain: value / 10 },
                    { band: 1, gain: value / 10 },
                    { band: 2, gain: value / 10 },
                    { band: 3, gain: value / 10 },
                    { band: 4, gain: value / 10 },
                    { band: 5, gain: value / 10 },
                    { band: 6, gain: value / 10 },
                    { band: 7, gain: 0 },
                    { band: 8, gain: 0 },
                    { band: 9, gain: 0 },
                    { band: 10, gain: 0 },
                    { band: 11, gain: 0 },
                    { band: 12, gain: 0 },
                    { band: 13, gain: 0 },
                ]
            }
            
            await ci.player.node.send(data);
    
            const msg = await ci.editReply(`${ci.client.i18n.get(ci.language, "filters", "bassboost_loading", {
                amount: value
            })}`);
    
            const embed = new EmbedBuilder()
                .setDescription(`${ci.client.i18n.get(ci.language, "filters", "bassboost_set", {
                    amount: value
                })}`)
                .setColor(ci.client.color);
                    
            await delay(2000);
            return msg.edit({ content: " ", embeds: [embed] });
        }
    }
})

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}