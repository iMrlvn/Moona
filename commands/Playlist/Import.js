const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const { convertTime } = require("../../utils/ConvertTime.js");
const Playlist = require("../../schema/Playlist.js");

module.exports = {
    name: ["playlist", "import"],
    description: "Import a playlist to queue.",
    category: "Playlist",
    options: [
        {
            name: "name",
            description: "The name of the playlist",
            required: true,
            type: ApplicationCommandOptionType.String,
            autocomplete: true
        }
    ],
    permissions: {
        channel: ["Speak", "Connect"],
        bot: ["Speak", "Connect"],
        user: []
    },
    settings: {
        isPremium: true,
        isPlayer: false,
        isOwner: false,
        inVoice: true,
        sameVoice: false,
    },
    async execute(ci) {
        await ci.deferReply({ ephemeral: false });

        const name = ci.args.join(" ");

        const PName = name.replace(/_/g, ' ');
        const playlist = await Playlist.findOne({ name: PName });
        if(!playlist) return ci.editReply(`${ci.client.i18n.get(ci.language, "playlist", "import_notfound")}`);
        if(playlist.private && playlist.owner !== ci.user.id) return ci.editReply(`${ci.client.i18n.get(ci.language, "playlist", "import_private")}`);

        if(!ci.player) {
            ci.player = await ci.client.manager.createPlayer({
                guildId: ci.guild.id,
                voiceId: ci.member.voice.channel.id,
                textId: ci.channel.id,
                deaf: true,
            });

            if (ci.player.state != 0) await ci.player.connect();
        }

        const tracks = [];
        let tracks_length = 0;
        const totalDuration = convertTime(playlist.tracks.reduce((acc, cur) => acc + cur.length, 0));

        const embed = new EmbedBuilder() // **Imported • \`${PName}\`** (${playlist.tracks.length} tracks) • ${ci.user}
            .setDescription(`${ci.client.i18n.get(ci.language, "playlist", "import_imported", {
                name: PName,
                tracks: playlist.tracks.length,
                duration: totalDuration,
                user: ci.user
            })}`)
            .setColor(ci.client.color)

        ci.editReply({ embeds: [embed] });

        for (let i = 0; i < playlist.tracks.length; i++) {
            const res = await ci.client.manager.search(playlist.tracks[i].uri, { engine: ci.config.DefaultSource, requester: ci.user });
            if(res.tracks.length > 0) {
                if(res.type == "TRACK") {
                    tracks.push(res.tracks[0]);
                    tracks_length++;
                } else if(res.type == "PLAYLIST") {
                    for (let t = 0; t < res.playlist.tracks.length; t++) {
                        tracks.push(res.playlist.tracks[t]);
                        tracks_length++;
                    }
                } else if(res.type == "SEARCH") {
                    tracks.push(res.tracks[0]);
                    tracks_length++;
                } else {
                    ci.channel.send(`${ci.client.i18n.get(ci.language, "playlist", "import_fail")}`); 
                    ci.player.destroy(); 
                    return;
                }
            } else {
                ci.channel.send(`${ci.client.i18n.get(ci.language, "playlist", "import_match")}`); 
                ci.player.destroy(); 
                return;
            }

            if(tracks_length == playlist.tracks.length) {
                ci.player.queue.add(tracks);
                if (!ci.player.playing)  ci.player.play(); 
            }
        }
    }
}