const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: ["join"],
    description: "Summon the bot to your voice channel.",
    category: "Music",
    channelPermissions: ["Speak", "Connect"],
    playerPermissions: ["InVoiceChannel"],
    async execute(ci) {
        await ci.deferReply({ ephemeral: false });
        
        const { channel } = ci.member.voice;

        ci.player = await ci.client.manager.createPlayer({
            guildId: ci.guild.id,
            voiceId: ci.member.voice.channel.id,
            textId: ci.channel.id,
            deaf: true,
        });

        const embed = new EmbedBuilder()
            .setDescription(`${ci.client.i18n.get(ci.language, "music", "join_msg", {
                channel: channel.name
            })}`)
            .setColor(ci.client.color)

        return ci.editReply({ embeds: [embed] });
    }
}
