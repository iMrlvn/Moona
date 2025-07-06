const { EmbedBuilder } = require("discord.js");
const Setup = require("../../schema/Setup.js");

module.exports = class {
    async execute(client, player, queue) {
	const channel = client.channels.cache.get(player.textId);
	if (!channel) return;

    const language = client.db.language.get(channel.guild.id);

	/////////// Update Music Setup ///////////

	await client.UpdateMusic(player);
	await client.clearInterval(client.interval);

	const db = await Setup.findOne({ guild: channel.guild.id });
	if (db.enable) return player.destroy();

	////////// End Update Music Setup //////////

	const embed = new EmbedBuilder()
		.setColor(client.color)
		.setDescription(`${client.i18n.get(language, "player", "queue_end_desc")}`);

	await channel.send({ embeds: [embed] });
	return // player.destroy();
    }
}