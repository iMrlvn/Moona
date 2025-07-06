const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: ["move"],
    description: "Change a songs position in a queue.",
    category: "Music",
    options: [
        {
            name: "from",
            description: "The queue number of the song",
            type: ApplicationCommandOptionType.Integer,
            required: true,
        },
        {
            name: "to",
            description: "The position in queue you want to move",
            type: ApplicationCommandOptionType.Integer,
            required: true,
        }
    ],
    playerPermissions: ["InVoiceChannel", "InSameVoiceChannel"],
    isPlayer: true,
    async execute(ci) {
        await ci.deferReply({ ephemeral: false });

        const tracks = ci.args[0];
        const position = ci.args[1];

        if (tracks == 0 && position == 0) return ci.editReply(`${ci.client.i18n.get(ci.language, "music", "move_already")}`);
        if (tracks > ci.player.queue.length || (tracks && !ci.player.queue[tracks - 1])) return ci.editReply(`${ci.client.i18n.get(ci.language, "music", "move_notfound")}`);
        if ((position > ci.player.queue.length) || !ci.player.queue[position - 1]) return ci.editReply(`${ci.client.i18n.get(ci.language, "music", "move_notfound")}`);

        const song = ci.player.queue[tracks - 1];

        await ci.player.queue.splice(tracks - 1, 1);
        await ci.player.queue.splice(position - 1, 0, song);

        const embed = new EmbedBuilder()
            .setColor(ci.client.color) //**Moved • [${song.title}](${song.uri})** to ${position}
            .setDescription(`${ci.client.i18n.get(ci.language, "music", "move_desc", {
                name: song.title,
                url: song.uri,
                pos: position
            }) }`)

        return ci.editReply({ embeds: [embed] });
    }
}
