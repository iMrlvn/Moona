const { EmbedBuilder } = require("discord.js");
const chalk = require("chalk");

module.exports = class {
    async execute(client, player, track, payload) {

        const channel = client.channels.cache.get(player.textId);
        if (!channel) return;

        const language = client.db.language.get(channel.guild.id);
        /////////// Update Music Setup ///////////

        await client.UpdateMusic(player);
        await client.clearInterval(client.interval);

        /////////// Update Music Setup ///////////

        const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(`${client.i18n.get(language, "player", "error_desc")}`);

        channel.send({ embeds: [embed] });

        console.error(chalk.red('DEBUG ›'), chalk.redBright(`Track Error in ${player.guildId}`), JSON.parse(payload));

        if (!player.voiceId) player.destroy();
    }
}