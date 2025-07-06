const { EmbedBuilder } = require("discord.js");
const { white, red } = require("chalk");
const GLang = require("../../schema/Language.js");

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
    
    console.log(white('[') + red('DEBUG') + white('] ') + red('Track Stuck in ') + white(player.guildId) + red(' Auto-Leaved!'));
    if (!player.voiceId) player.destroy();
    }
}