module.exports = class {
    async execute(client, player) {
        client.updateMessage(true);
        const channel = client.channels.cache.get(player.textId);

        channel?.send({ content: `${client.emoji.respond.info} | Music has ended.` });
    }
}