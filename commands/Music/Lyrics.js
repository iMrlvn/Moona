const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const { Lyricist } = require("@execaman/lyricist");
const Lyrics = new Lyricist();

module.exports = {
    name: ["lyrics"],
    description: "Display lyrics of a song.",
    category: "Music",
    options: [
        {
            name: "result",
            description: "Song name to return lyrics for.",
            type: ApplicationCommandOptionType.String,
            required: false,
        }
    ],
    async execute(ci) {
        await ci.deferReply({ ephemeral: false });

        let value = ci.args.join(" "),
            songs = ci.player ? ci.player.queue.current : null;
        if (!value && songs) value = songs.title + ' ' + songs.author;

        let search = null;

        try {
            search = await Lyrics.fetch(value, 3);
            if (!search) return ci.editReply(`${ci.client.i18n.get(ci.language, "music", "lyrics_notfound")}`);
        } catch (error) {
            return ci.editReply(`${ci.client.i18n.get(ci.language, "music", "lyrics_notfound")}`);
        }

        if (!search) search = {};

        const { info, lyrics, song } = search;
        const artist = info ? info.find(x => x.label.startsWith("Artist")) : {};

        const embed = new EmbedBuilder()
            .setColor(ci.client.color)
            .setAuthor({ name: artist.value ?? "[Unknown Artist]" })
            .setTitle(song? song.title: "[Unknown Title]")
            .setDescription(lyrics.length > 4096? lyrics.substring(0, 4093)+"...": lyrics)
            .setFooter({ text: `Provided by ${ci.me?.username} [Lyrics Engine]`});

        return ci.editReply({ embeds: [embed] });
    }
}
