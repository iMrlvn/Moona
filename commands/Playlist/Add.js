const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const { convertTime } = require("../../utils/ConvertTime.js");
const Playlist = require("../../schema/Playlist.js");

const tracks = [];

module.exports = {
    name: ["playlist", "add"],
    description: "Add song to a playlist",
    category: "Playlist",
    options: [
        {
            name: "name",
            description: "The name of the playlist",
            required: true,
            type: ApplicationCommandOptionType.String,
            autocomplete: true
        },
        {
            name: "song",
            description: "The song to add",
            required: true,
            type: ApplicationCommandOptionType.String,
        }
    ],
    permissions: {
        channel: [],
        bot: [],
        user: []
    },
    settings: {
        isPremium: true,
        isPlayer: false,
        isOwner: false,
        inVoice: false,
        sameVoice: false,
    },
    async execute(ci) {
        await ci.deferReply({ ephemeral: false });

        const name = ci.args[0];
        const song = ci.args[1];

        const PName = name.replace(/_/g, ' ');
        const playlist = await Playlist.findOne({ name: PName });
        if(!playlist) return ci.editReply(`${ci.client.i18n.get(ci.language, "playlist", "import_notfound")}`);

        const res = await ci.client.manager.search(song, { engine: ci.config.DefaultSource, requester: ci.user });

        if(res.tracks.length > 0) {
            if(res.type == "TRACK") {
                tracks.push(res.tracks[0]);

                const embed = new EmbedBuilder()
                    .setDescription(`${ci.client.i18n.get(ci.language, "playlist", "add_track", {
                        title: modTitle(res.tracks[0].title, res.tracks[0]),
                        url: res.tracks[0].uri,
                        duration: convertTime(res.tracks[0].length, true),
                        user: ci.user
                        })}`)
                    .setColor(ci.client.color)

                ci.editReply({ embeds: [embed] });
            } else if(res.type == "PLAYLIST") {
                for (let i = 0; i < res.tracks.length; i++) {
                    tracks.push(res.tracks[i]);
                }

                const embed = new EmbedBuilder()
                    .setDescription(`${ci.client.i18n.get(ci.language, "playlist", "add_playlist", {
                        title: res.playlist.name,
                        url: song,
                        duration: convertTime(res.playlist.length),
                        track: res.tracks.length,
                        user: ci.user
                        })}`)
                    .setColor(ci.client.color)

                ci.editReply({ embeds: [embed] });
            } else if(res.type == "SEARCH") {
                tracks.push(res.tracks[0]);

                const embed = new EmbedBuilder()
                    .setDescription(`${ci.client.i18n.get(ci.language, "playlist", "add_search", {
                        title: modTitle(res.tracks[0].title, res.tracks[0]),
                        url: res.tracks[0].uri,
                        duration: convertTime(res.tracks[0].length, true),
                        user: ci.user
                        })}`)
                    .setColor(ci.client.color)

                ci.editReply({ embeds: [embed] });
            } else { //Error loading playlist.
                return ci.editReply(`${ci.client.i18n.get(ci.language, "playlist", "add_fail")}`);
            }
        } else { //The playlist link is invalid.
            return ci.editReply(`${ci.client.i18n.get(ci.language, "playlist", "add_match")}`);
        }

        Playlist.findOne({ name: PName }).then(playlist => {
            if(playlist) {
                if(playlist.owner !== ci.user.id) { 
                    ci.followUp(`${ci.client.i18n.get(ci.language, "playlist", "add_owner")}`); 
                    tracks.length = 0; 
                    return; 
                }

                const LimitTrack = playlist.tracks.length + tracks.length;

                if(LimitTrack > ci.config.TrackLimit) { 
                    ci.followUp(`${ci.client.i18n.get(ci.language, "playlist", "add_limit_track", {
                        limit: ci.config.TrackLimit
                    })}`); 
                    tracks.length = 0; 
                    return; 
                }

                for (let i = 0; i < tracks.length; i++) {
                    playlist.tracks.push(tracks[i]);
                }

                playlist.save().then(() => {
                    const embed = new EmbedBuilder()
                        .setDescription(`${ci.client.i18n.get(ci.language, "playlist", "add_added", {
                            count: tracks.length,
                            playlist: PName
                            })}`)
                        .setColor(ci.client.color)
                    ci.followUp({ content: " ", embeds: [embed] });
                tracks.length = 0;
                });
            }
        });
    }
}