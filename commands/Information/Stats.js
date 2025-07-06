const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

const bot = require("../../package.json")

const iStatus = {
    "online": "https://cdn.discordapp.com/emojis/689448141774389275.png",
    "idle": "https://cdn.discordapp.com/emojis/689448170307977240.png",
    "dnd": "https://cdn.discordapp.com/emojis/689448200406302765.png",
    "invisible": "https://cdn.discordapp.com/emojis/695461329800134696.png"
};

module.exports = {
    name: ["stats", "bot"],
    description: "View a bot stats",
    category: "Information",
    async execute(ci) {
    await ci.deferReply('Sedang diproses...');
    const waitnow = await Date.now();
    const embed = new EmbedBuilder()
        .setColor(ci.client.color)
        .setAuthor({ name: `Information Stats`, iconURL: iStatus[ci.client.presence.status] })
        .setDescription(bot.description)
        .setThumbnail(ci.client.user.displayAvatarURL({ forceStatic: true, size: 1024 }))
        .addFields([
        { name: "User ID", value: ci.client.user.id, inline: true },
        { name: "Created On", value: `<t:${int(ci.client.user.createdTimestamp)}:D>`, inline: true },
        { name: "Developer", value: `[${(await ci.client.users.fetch(ci.config.OwnerId)).tag}](https://discord.com/users/${ci.config.OwnerId})`, inline: true }
        ])
        .addFields([
        { name: "Latency", value: `Ping **${waitnow - ci.createdTimestamp}** ms`, inline: true },
        { name: "Guilds", value: ci.client.guilds.cache.size.toLocaleString().replaceAll(",", ".")+" Server", inline: true },
        { name: "Users", value: (ci.client.guilds.cache.reduce((members, guild) => members + guild.memberCount, 0)).toLocaleString().replaceAll(",", ".")+" User", inline: true }
        ])
        .addFields({ name: "Uptime", value: `<t:${int(ci.client.readyTimestamp)}:R>`})
        .setFooter({ text: `Version: ${bot.version} | © 2024 ${ci.client.user.username} Bot` });

    await ci.editReply({ content: null, embeds: [embed] });
    }
}

function int(timestamp) {
    return Math.round(timestamp / 1000);
};