module.exports = class {
    async execute(client, player, queue) {

        await client.clearInterval(client.interval);
        client.updateMessage(true);
    }
}