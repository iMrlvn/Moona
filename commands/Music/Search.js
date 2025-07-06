const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ApplicationCommandOptionType } = require('discord.js');
const { convertTime } = require("../../utils/ConvertTime.js");

module.exports = {
    name: ["search"], // I move search to main issues subcmd (max 25)
    description: "Search for a song!",
    category: "Music",
    options: [
        {
            name: "query",
            description: "Input the song query or link",
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    channelPermissions: ["Speak", "Connect"],
    playerPermissions: ["InVoiceChannel"],
    async execute(ci) {
        await ci.deferReply({ fetchReply: true });

        const search = ci.args.join(" ");
        await ci.editReply(`Searching for \`${search}\`...`);

        if (!ci.player) {
            ci.player = await ci.client.manager.createPlayer({
            guildId: ci.guild.id,
            voiceId: ci.member.voice.channel.id,
            textId: ci.channel.id,
            deaf: true,
        });
        };

        const button = ci.client.button.search;

        const row = new  ActionRowBuilder()
            .addComponents(
            new ButtonBuilder()
                .setCustomId("one")
                //.setLabel(`${button.one.label}`)
                .setEmoji(`${button.one.emoji}`)
                .setStyle(ButtonStyle[button.one.style])
            )
            .addComponents(
            new ButtonBuilder()
                .setCustomId("two")
                //.setLabel(`${button.two.label}`)
                .setEmoji(`${button.two.emoji}`)
                .setStyle(ButtonStyle[button.two.style])
            )
            .addComponents(
            new ButtonBuilder()
                .setCustomId("three")
                //.setLabel(`${button.three.label}`)
                .setEmoji(`${button.three.emoji}`)
                .setStyle(ButtonStyle[button.three.style])
            )
            .addComponents(
            new ButtonBuilder()
                .setCustomId("four")
                //.setLabel(`${button.four.label}`)
                .setEmoji(`${button.four.emoji}`)
                .setStyle(ButtonStyle[button.four.style])
            )
            .addComponents(
            new ButtonBuilder()
                .setCustomId("five")
                //.setLabel(`${button.five.label}`)
                .setEmoji(`${button.five.emoji}`)
                .setStyle(ButtonStyle[button.five.style])
            )

        if (ci.player.state != 0) await ci.player.connect();
        const res = await ci.client.manager.search(search, { engine: ci.config.DefaultSource, requester: ci.user });

        if(!res.tracks.length) {
            ci.editReply(`${ci.client.i18n.get(ci.language, "music", "search_match")}`);
            ci.player.destroy();
            return;
        };
            if(res.type == "TRACK") {
                await ci.player.queue.add(res.tracks[0]);

                const embed = new EmbedBuilder() //`**Queued • [${res.tracks[0].title}](${res.tracks[0].uri})** \`${convertTime(res.tracks[0].length, true)}\` • ${res.tracks[0].requester}
                    .setDescription(`${ci.client.i18n.get(ci.language, "music", "search_result", {
                        title: modTitle(res.tracks[0].title, res.tracks[0]),
                        url: res.tracks[0].uri,
                        duration: convertTime(res.tracks[0].length, true),
                        request: res.tracks[0].requester
                    })}`)
                    .setColor(ci.client.color)

                ci.editReply({ content: " ", embeds: [embed] });
                if (!ci.player.playing) ci.player.play();
                } else if(res.type == "SEARCH") {
                    let index = 1;
                    const results = res.tracks
                        .slice(0, 5) //**(${index++}.) [${video.title}](${video.uri})** \`${convertTime(video.length)}\` Author: \`${video.author}\`
                        .map(video => `${ci.client.i18n.get(ci.language, "music", "search_select", {
                            num: index++,
                            title: modTitle(video.title, video),
                            url: video.uri,
                            duration: convertTime(video.length),
                            author: video.author
                        })}`)
                        .join("\n");
                    const playing = new EmbedBuilder()
                        .setAuthor({ name: `${ci.client.i18n.get(ci.language, "music", "search_title")}`, iconURL: ci.guild.iconURL({ dynamic: true }) })
                        .setColor(ci.client.color)
                        .setDescription(results)
                        .setFooter({ text: `${ci.client.i18n.get(ci.language, "music", "search_footer")}` })
                    await ci.editReply({ content: " ", embeds: [playing], components: [row] });
                    const msg = await ci.fetchReply();

                    const collector = msg.createMessageComponentCollector({ filter: (m) => m.user.id === ci.user.id, time: 30000, max: 1 });

                    collector.on('collect', async (ci) => {
                        if(!ci.player && !collector.ended) return collector.stop();
                        if (!ci.deferred) await ci.deferUpdate();
                        const id = ci.customId;

                        if(id === "one") {
                            await ci.player.queue.add(res.tracks[0]);

                            if(ci.player && ci.player.state === 0 && !ci.player.playing && !ci.player.paused && !ci.player.queue.size) await ci.player.play();

                            const embed = new EmbedBuilder() //**Queued • [${res.tracks[0].title}](${res.tracks[0].uri})** \`${convertTime(res.tracks[0].length, true)}\` • ${res.tracks[0].requester}
                                .setDescription(`${ci.client.i18n.get(ci.language, "music", "search_result", {
                                    title: modTitle(res.tracks[0].title, res.tracks[0]),
                                    url: res.tracks[0].uri,
                                    duration: convertTime(res.tracks[0].length, true),
                                    request: res.tracks[0].requester
                                })}`)
                                .setColor(ci.client.color)
            
                            if(msg) await ci.editReply({ embeds: [embed], components: [] });
                        } else if(id === "two") {
                            await ci.player.queue.add(res.tracks[1]);

                            if(ci.player && ci.player.state === 0 && !ci.player.playing && !ci.player.paused && !ci.player.queue.size) await ci.player.play();

                            const embed = new EmbedBuilder() //**Queued • [${res.tracks[1].title}](${res.tracks[1].uri})** \`${convertTime(res.tracks[1].length, true)}\` • ${res.tracks[1].requester}
                                .setDescription(`${ci.client.i18n.get(ci.language, "music", "search_result", {
                                    title: modTitle(res.tracks[1].title,res.tracks[1]),
                                    url: res.tracks[1].uri,
                                    duration: convertTime(res.tracks[1].length, true),
                                    request: res.tracks[1].requester
                                })}`)
                                .setColor(ci.client.color)
        
                            if(msg) await ci.editReply({ embeds: [embed], components: [] });
                        } else if(id === "three") {
                            await ci.player.queue.add(res.tracks[2]);

                            if(ci.player && ci.player.state === 0 && !ci.player.playing && !ci.player.paused && !ci.player.queue.size) await ci.player.play();

                            const embed = new EmbedBuilder() //**Queued • [${res.tracks[2].title}](${res.tracks[2].uri})** \`${convertTime(res.tracks[2].length, true)}\` • ${res.tracks[2].requester}
                                .setDescription(`${ci.client.i18n.get(ci.language, "music", "search_result", {
                                    title: modTitle(res.tracks[2].title, res.tracks[2]),
                                    url: res.tracks[2].uri,
                                    duration: convertTime(res.tracks[2].length, true),
                                    request: res.tracks[2].requester
                                })}`)
                                .setColor(ci.client.color)
        
                            if(msg) await ci.editReply({ embeds: [embed], components: [] });
                        } else if(id === "four") {
                            await ci.player.queue.add(res.tracks[3]);

                            if(ci.player && ci.player.state === 0 && !ci.player.playing && !ci.player.paused && !ci.player.queue.size) await ci.player.play();

                            const embed = new EmbedBuilder() //**Queued • [${res.tracks[3].title}](${res.tracks[3].uri})** \`${convertTime(res.tracks[3].length, true)}\` • ${res.tracks[3].requester}
                                .setDescription(`${ci.client.i18n.get(ci.language, "music", "search_result", {
                                    title: modTitle(res.tracks[3].title, res.tracks[3]),
                                    url: res.tracks[3].uri,
                                    duration: convertTime(res.tracks[3].length, true),
                                    request: res.tracks[3].requester
                                    })}`)
                                .setColor(ci.client.color)
        
                            if(msg) await ci.editReply({ embeds: [embed], components: [] });
                        } else if(id === "five") {
                            await ci.player.queue.add(res.tracks[4]);

                            if(ci.player && ci.player.state === 0 && !ci.player.playing && !ci.player.paused && !ci.player.queue.size) await ci.player.play();

                            const embed = new EmbedBuilder() //**Queued • [${res.tracks[4].title}](${res.tracks[4].uri})** \`${convertTime(res.tracks[4].length, true)}\` • ${res.tracks[4].requester}
                                .setDescription(`${ci.client.i18n.get(ci.language, "music", "search_result", {
                                    title: modTitle(res.tracks[4].title, res.tracks[4]),
                                    url: res.tracks[4].uri,
                                    duration: convertTime(res.tracks[4].length, true),
                                    request: res.tracks[4].requester
                                    })}`)
                                .setColor(ci.client.color)
        
                            if(msg) await ci.editReply({ embeds: [embed], components: [] });
                        }
                    });

                    collector.on('end', async (collected, reason) => {
                        if(reason === "time") {
                            ci.editReply({ content: `${ci.client.i18n.get(ci.language, "music", "search_no_response")}`, embeds: [], components: [] });
                            ci.player.destroy();
                        }
                    });

                } else if(res.type == "PLAYLIST") {
                    await ci.player.queue.add(res.tracks);

                    const playlist = new EmbedBuilder() //**Queued** • [${res.playlist.name}](${search}) \`${convertTime(res.playlist.length)}\` (${res.tracks.length} tracks) • ${res.tracks[0].requester}
                        .setDescription(`${ci.client.i18n.get(ci.language, "music", "search_playlist", {
                            title: res.playlist.name,
                            url: search,
                            duration: convertTime(res.playlist.length),
                            songs: res.tracks.length,
                            request: res.tracks[0].requester
                        })}`)
                        .setColor(ci.client.color)

                    ci.editReply({ content: " ", embeds: [playlist] });
                    if(!ci.player.playing) ci.player.play()
                } else {
                    ci.editReply(`${ci.client.i18n.get(ci.language, "music", "search_fail")}`);
                    ci.player.destroy();
                }
    }
}