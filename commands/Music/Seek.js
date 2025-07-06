const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const formatDuration = require('../../utils/FormatDuration.js');

module.exports = {
    name: ["seek"],
    description: "Seek timestamp in the song!",
    category: "Music",
    options: [
        {
            name: "seconds",
            description: "The number of seconds to seek the timestamp by.",
            type: ApplicationCommandOptionType.Integer,
            required: true,
        }
    ],
    playerPermissions: ["InVoiceChannel", "InSameVoiceChannel"],
    isPlayer: true,
    async execute(ci) {
        await ci.deferReply({ ephemeral: false });
        
        const value = ci.args[0];
        if(value * 1000 >= ci.player.playing.length || value < 0) return ci.editReply(`${ci.client.i18n.get(ci.language, "music", "seek_beyond")}`);
        await ci.player.seek(value * 1000);

        const Duration = formatDuration(ci.player.position);

        const embed = new EmbedBuilder()
            .setDescription(`${ci.client.i18n.get(ci.language, "music", "seek_msg", {
                duration: Duration
            })}`)
            .setColor(ci.client.color);

        ci.editReply({ embeds: [embed] });
    }
}