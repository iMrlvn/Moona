module.exports = class {
    async execute(client, player, oldChannel, newChannel) {
        const guild = client.guilds.cache.get(player.guildId)
        if(!guild) return;

        const channel = guild.channels.cache.get(player.textId);
        if (!channel) return;

        /////////// Update Music Setup ///////////

        await client.UpdateMusic(player);
        await client.clearInterval(client.interval);

        ////////// End Update Music Setup //////////

        if(oldChannel === newChannel) return;
        if(newChannel === null || !newChannel) {
        if(!player) return;

        if(player.voiceId) player.destroy();
      } else {
        player.voiceId = newChannel;
        return;
      }
    }
}