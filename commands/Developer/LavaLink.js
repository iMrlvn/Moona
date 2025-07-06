const { MoonaCommand } = require("../../structures/index.js");
const { EmbedBuilder } = require('discord.js');
const ButtonPage = require('../../utils/ButtonPage.js');
const prettyBytes = require("pretty-bytes");
const { request } = require("undici");

module.exports = new MoonaCommand({
    name: ["stats","lavalink"], // The name of the command
    description: "Display the Lavalink stats", // The description of the command (for help text)
    category: "Developer",
    private: true,
    async execute(ci) {
        await ci.deferReply({ fetchReply: true });

        var pages = [];

        ci.client.manager.shoukaku.nodes.forEach(node => {
            pages.push(
                new EmbedBuilder()
                .setColor(ci.client.color)
                .setAuthor({ name: 'Lavalink Node' })
                .setThumbnail(ci.client.user.displayAvatarURL({ forceStatic: true, size: 1024 }))
                .setTitle(`${node.name} [\`${node.state==2 ? "🟢" : "🔴"}\`]`)
                .setDescription(`${node.version.replaceAll("/", "")}`)
                .addFields({ name: "Uptime", value: `<t:${Math.round((Date.now() - node.stats.uptime) / 1000)}:R>`, inline:true })
                .addFields({ name: "Player", value: `${node.stats.playingPlayers} / ${node.stats.players}`, inline:true })
                .addFields({ name: "Memory Usage", value: `${prettyBytes(node.stats.memory.used)} / ${prettyBytes(node.stats.memory.reservable)}`, inline:true })
                .addFields({ name: "CPU Cores", value: `${node.stats.cpu.cores + " Core(s)"}`, inline:true })
                .addFields({ name: "System Load", value: `${(Math.round(node.stats.cpu.systemLoad * 100) / 100).toFixed(2)}%`, inline:true })
                .addFields({ name: "Lavalink Load", value: `${(Math.round(node.stats.cpu.lavalinkLoad * 100) / 100).toFixed(2)}%`, inline:true })
                .setTimestamp()
            );
        });

        if (pages.length === 1) return ci.editReply({ embeds: pages });
        else return ButtonPage.execute(ci, pages);
    }
})