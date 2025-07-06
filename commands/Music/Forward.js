const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const formatDuration = require('../../utils/FormatDuration.js');

const forward = 10;

module.exports = {
    name: ["forward"],
    description: "forward the currently playing song.",
    category: "Music",
    options: [
        {
            name: "seconds",
            description: "How many seconds to forward?",
            type: ApplicationCommandOptionType.Integer,
            required: false
        }
    ],
    playerPermissions: ["InVoiceChannel", "InSameVoiceChannel"],
    isPlayer: true,
    async execute(ci) {
        await ci.deferReply({ ephemeral: false });

        const value = ci.args[0];

        if (value && !isNaN(value)) {
            if((ci.player.position + value * 1000) < ci.player.queue.current.length) {
                await ci.player.seek(ci.player.position + value * 1000);
                
                const embed = new EmbedBuilder()
                .setDescription(`${ci.client.i18n.get(ci.language, "music", "forward_msg", {
                    duration: formatDuration(ci.player.position)
                })}`)
                    .setColor(ci.client.color);

                return ci.editReply({ embeds: [embed] });

            } else { 
                return ci.editReply(`${ci.client.i18n.get(ci.language, "music", "forward_beyond")}`);
            }
        } else if (value && isNaN(value)) { 
            return ci.editReply(`${ci.client.i18n.get(ci.language, "music", "forward_invalid", {
                prefix: "/"
            })}`);
        }

        if (!value) {
            if((ci.player.position + forward * 1000) < ci.player.queue.current.length) {
                await ci.player.seek(ci.player.position + forward * 1000);
                
                const embed = new EmbedBuilder()
                    .setDescription(`${ci.client.i18n.get(ci.language, "music", "forward_msg", {
                        duration: formatDuration(ci.player.position)
                    })}`)
                    .setColor(ci.client.color);

                return ci.editReply({ embeds: [embed] });
            } else {
                return ci.editReply(`${ci.client.i18n.get(ci.language, "music", "forward_beyond")}`);
            }
        }
    }
}
