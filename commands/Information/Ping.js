const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    name: ["ping"],
    description: "Respond to ping latency",
    category: "Information",
    async execute(ci) {
        await ci.deferReply({ ephemeral: true });

        await ci.editReply(`Pong! **${ci.client.ws.ping}** ms`);
        return;
    }
}