const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const { convertTime } = require("../../utils/ConvertTime.js");

module.exports = {
    name: ["play"],
    description: "Play music in your voice channel",
    category: "Music",
    options: [
        {
            name: "query",
            description: "Input the song query or link",
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true
        }
    ],
    channelPermissions: ["Speak", "Connect"],
    playerPermissions: ["InVoiceChannel"],
    async execute(ci) {
        try {
            if (ci.args[0]) {
                await ci.deferReply({ ephemeral: false });

                const value = ci.args.join(" ");

                if(!ci.player) {
                    ci.player = await ci.client.manager.createPlayer({
                    guildId: ci.guild.id,
                    voiceId: ci.member.voice.channel.id,
                    textId: ci.channel.id,
                    deaf: true,
                });
                }

                const res = await ci.client.manager.search(value, { engine: ci.config.DefaultSource, requester: ci.user });

                if(!res.tracks.length) {
                    ci.editReply(`${ci.client.i18n.get(ci.language, "music", "play_match")}`); 
                    ci.player.destroy();
                    return;
                }
                    if(res.type == "TRACK") {
                        await ci.player.queue.add(res.tracks[0]);

                        const embed = new EmbedBuilder()
                            .setDescription(`${ci.client.i18n.get(ci.language, "music", "play_track", {
                                title: modTitle(res.tracks[0].title, res.tracks[0]),
                                url: res.tracks[0].uri,
                                duration: convertTime(res.tracks[0].length, true),
                                request: res.tracks[0].requester
                            })}`)
                            .setColor(ci.client.color)

                        ci.editReply({ content: " ", embeds: [embed] });
                        if(!ci.player.playing) ci.player.play();
                    } else if(res.type == "PLAYLIST") {
                        await ci.player.queue.add(res.tracks)

                        const embed = new EmbedBuilder()
                            .setDescription(`${ci.client.i18n.get(ci.language, "music", "play_playlist", {
                                title: res.playlist.name,
                                url: value,
                                duration: convertTime(res.playlist.length),
                                songs: res.tracks.length,
                                request: res.tracks[0].requester
                            })}`)
                            .setColor(ci.client.color)

                        ci.editReply({ content: " ", embeds: [embed] });
                        if(!ci.player.playing) ci.player.play();
                    } else if(res.type == "SEARCH") {
                        await ci.player.queue.add(res.tracks[0]);

                        const embed = new EmbedBuilder()
                            .setDescription(`${ci.client.i18n.get(ci.language, "music", "play_result", {
                                title: modTitle(res.tracks[0].title, res.tracks[0]),
                                url: res.tracks[0].uri,
                                duration: convertTime(res.tracks[0].length, true),
                                request: res.tracks[0].requester
                            })}`)
                            .setColor(ci.client.color)

                        ci.editReply({ content: " ", embeds: [embed] });
                        if(!ci.player.playing) ci.player.play();
                    }
            }
        } catch (error) {
            console.info(error);
            ci.editReply(`${ci.client.i18n.get(ci.language, "music", "play_fail")}`); 
            if (!ci.player.playing) ci.player.destroy();
        }
    },
    async autoComplete(i) {
        const Random = i.client.config.SearchDefault[Math.floor(Math.random() * i.client.config.SearchDefault.length)];
        const query = i.options.getString("song");

        const data = await i.client.manager.search(query || Random, { engine: i.client.config.DefaultSource }).catch(console.error);

        const choices = data.tracks.map(track => ({ name: modTitle(track.title, track), value: track.uri }) );

        return await i.respond(choices).catch(console.error);
    }
}
