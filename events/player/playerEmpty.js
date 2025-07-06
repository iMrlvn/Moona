module.exports = class {
    async execute(client, player) {
        const channel = client.channels.cache.get(player.textId);

        if (player.voiceId && !player.data.has("24x7")) player.destroy();
    }
}