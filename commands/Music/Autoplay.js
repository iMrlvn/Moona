const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: ["autoplay"],
    description: "Autoplay music (Random play songs)",
    category: "Music",
    playerPermissions: ["InVoiceChannel", "InSameVoiceChannel"],
    isPlayer: true,
    async execute(ci) {
        await ci.deferReply({ ephemeral: false });

        const autoplay = ci.player.get("autoplay");
        if (autoplay === true) {
            await ci.player.set("autoplay", false);

            const embed = new EmbedBuilder()
                .setDescription(`${ci.client.i18n.get(ci.language, "music", "autoplay_off")}`)
                .setColor(ci.client.color);

            return ci.editReply({ embeds: [embed] });
        } else {
            const identifier = ci.player.queue.current.identifier;
            const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
            const res = await ci.player.search(search, {engine: ci.config.DefautlSource, requester: ci.user});

            await ci.player.set("autoplay", true);
            await ci.player.set("requester", ci.user);
            await ci.player.set("identifier", identifier);
            try {
                await ci.player.queue.add(res.tracks[1]);
            } catch (e) {
                return ci.editReply(`**Autoplay Support Only Youtube!**`);
            }

            const embed = new EmbedBuilder()
                .setDescription(`${ci.client.i18n.get(ci.language, "music", "autoplay_on")}`)
                .setColor(ci.client.color);

            return ci.editReply({ embeds: [embed] });
        }
    }
}