const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const formatDuration = require('../../utils/FormatDuration.js');

const rewindNum = 10;

module.exports = {
    name: ["rewind"],
    description: "Rewind timestamp in the song!",
    category: "Music",
    options: [
        {
            name: "seconds",
            description: "Rewind timestamp in the song!",
            type: ApplicationCommandOptionType.Integer,
            required: false,
        }
    ],
    playerPermissions: ["InVoiceChannel", "InSameVoiceChannel"],
    isPlayer: true,
    async execute(ci) {
        await ci.deferReply({ ephemeral: false });

        const value = ci.args[0];
        const CurrentDuration = formatDuration(ci.player.position);

        if(value && !isNaN(value)) {
            if((ci.player.position - value * 1000) > 0) {
                await ci.player.seek(ci.player.position - value * 1000);
                
                const embed = new EmbedBuilder()
                    .setDescription(`${ci.client.i18n.get(ci.language, "music", "rewind_msg", {
                        duration: CurrentDuration,
                    })}`)
                    .setColor(ci.client.color);

                return ci.editReply({ embeds: [embed] });
            } else {
                return ci.editReply(`${ci.client.i18n.get(ci.language, "music", "rewind_beyond")}`);
            }
        } else if(value && isNaN(value)) {
            return ci.editReply(`${ci.client.i18n.get(ci.language, "music", "rewind_invalid", {
                prefix: "/"
            })}`);
        }

        if(!value) {
            if((ci.player.position - rewindNum * 1000) > 0) {
                await ci.player.seek(ci.player.position - rewindNum * 1000);
                
                const embed = new EmbedBuilder()
                    .setDescription(`${ci.client.i18n.get(ci.language, "music", "rewind_msg", {
                        duration: CurrentDuration,
                    })}`)
                    .setColor(ci.client.color);

                return ci.editReply({ embeds: [embed] });
            } else {
                return ci.editReply(`${ci.client.i18n.get(ci.language, "music", "rewind_beyond")}`);
            }
        }
    }
}