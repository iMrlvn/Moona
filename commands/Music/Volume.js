const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: ["volume"],
    description: "Adjusts the volume of the bot.",
    category: "Music",
    options: [
        {
            name: "amount",
            description: "The amount of volume to set the bot to.",
            type: ApplicationCommandOptionType.Integer,
            required: false,
            min_value: 1,
            max_value: 100
        }
    ],
    playerPermissions: ["InVoiceChannel", "InSameVoiceChannel"],
    isPlayer: true,
    async execute(ci) {
        await ci.deferReply({ ephemeral: false });
        
        const value = ci.args[0];
        if (!value) return ci.editReply(`${ci.client.i18n.get(ci.language, "music", "volume_usage", {
            volume: ci.player.volume
        })}`);

        await ci.player.setVolume(Number(value));

        const embed = new EmbedBuilder()
            .setDescription(`${ci.client.i18n.get(ci.language, "music", "volume_msg", {
                volume: value
            })}`)
            .setColor(ci.client.color);
        
        return ci.editReply({ embeds: [embed] });
    }
}