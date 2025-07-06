const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: ["filter", "equalizer"],
    description: 'Custom Equalizer!',
    category: "Filter",
    options: [
        {
            name: 'bands',
            description: 'Number of bands to use (max 14 bands.)',
            type: ApplicationCommandOptionType.String,
            required: false,
        }
    ],
    playerPermissions: ["InVoiceChannel", "InSameVoiceChannel"],
    isPlayer: true,
    async execute(ci) {
        await ci.deferReply({ ephemeral: false });
        
        const value = ci.args[0];

        if (!value) {
            const embed = new EmbedBuilder()
                .setAuthor({ name: `${ci.client.i18n.get(ci.language, "filters", "eq_author")}`, iconURL: `${ci.client.i18n.get(ci.language, "filters", "eq_icon")}` })
                .setColor(ci.client.color)
                .setDescription(`${ci.client.i18n.get(ci.language, "filters", "eq_desc")}`)
                .addFields({ name: `${ci.client.i18n.get(ci.language, "filters", "eq_field_title")}`, value: `${ci.client.i18n.get(ci.language, "filters", "eq_field_value", {
                    prefix: "/"
                })}`, inline: false })
                .setFooter({ text: `${ci.client.i18n.get(ci.language, "filters", "eq_footer", {
                    prefix: "/"
                })}` })
            return ci.editReply({ embeds: [embed] });
        } else if (value == 'off' || value == 'reset') {
            const data = {
                op: 'filters',
                guildId: ci.guild.id,
            }
            return ci.player.node.send(data);
        }

        const bands = value.split(/[ ]+/);
        let bandsStr = '';
        for (let i = 0; i < bands.length; i++) {
            if (i > 13) break;
            if (isNaN(bands[i])) return ci.editReply(`${ci.client.i18n.get(ci.language, "filters", "eq_number", {
                num: i + 1
            })}`);
            if (bands[i] > 10) return ci.editReply(`${ci.client.i18n.get(ci.language, "filters", "eq_than", {
                num: i + 1
            })}`);
        }

        for (let i = 0; i < bands.length; i++) {
            if (i > 13) break;
            const data = {
                op: 'filters',
                guildId: ci.guild.id,
                equalizer: [
                    { band: i, gain: (bands[i]) / 10 },
                ]
            }
            ci.player.node.send(data);
            bandsStr += `${bands[i]} `;
        }
    
        const msg = await ci.editReply(`${ci.client.i18n.get(ci.language, "filters", "eq_loading", {
            bands: bandsStr
        })}`);

        const embed = new EmbedBuilder()
            .setDescription(`${ci.client.i18n.get(ci.language, "filters", "eq_on", {
                bands: bandsStr
                })}`)
            .setColor(ci.client.color);

        await delay(2000);
        return msg.edit({ content: " ", embeds: [embed] });
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}