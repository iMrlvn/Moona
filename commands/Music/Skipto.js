const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: ["skipto"],
    description: "Skips to a certain song in the queue.",
    category: "Music",
    options: [
        {
            name: "position",
            description: "The position of the song in the queue.",
            type: ApplicationCommandOptionType.Integer,
            required: true,
        }
    ],
    playerPermissions: ["InVoiceChannel", "InSameVoiceChannel"],
    isPlayer: true,
    async execute(ci) {
        await ci.deferReply({ ephemeral: false });
        
        const value = ci.args[0];
        if (value === 0) return ci.editReply(`${ci.client.i18n.get(ci.language, "music", "skipto_arg", {
            prefix: "/"
        })}`);

        if ((value > ci.player.queue.length) || (value && !ci.player.queue[value - 1])) return ci.editReply(`${ci.client.i18n.get(ci.language, "music", "skipto_invalid")}`);
        if (value == 1) ci.player.skip();

        await ci.player.queue.splice(0, value - 1);
        await ci.player.skip();
        await ci.client.clearInterval(ci.client.interval);
        
        const embed = new EmbedBuilder()
            .setDescription(`${ci.client.i18n.get(ci.language, "music", "skipto_msg", {
                position: value
            })}`)
            .setColor(ci.client.color);

        return ci.editReply({ embeds: [embed] });       
    }
}