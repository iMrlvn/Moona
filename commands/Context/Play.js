const { MoonaCommand } = require("../../structures/index.js");
const { EmbedBuilder, ApplicationCommandType } = require('discord.js');
const { convertTime } = require("../../utils/ConvertTime.js");

module.exports = new MoonaCommand({ 
    name: ["Play This"],
    type: ApplicationCommandType.Message,
    category: "Context",
    channelPermissions: ["Speak", "Connect"],
    playerPermissions: ["InVoiceChannel"],
    async execute(ci) {
        await ci.deferReply({ ephemeral: false });

        const value = (ci.channel.messages.cache.get(ci.targetId).content ?? ci.channel.messages.cache.get(ci.targetId));
        if (!value.startsWith('https')) return ci.editReply(`${ci.client.i18n.get(ci.language, "music", "play_startwith")}`);
        
        ci.player = await ci.client.manager.createPlayer({
            guildId: ci.guild.id,
            voiceId: ci.member.voice.channel.id,
            textId: ci.channel.id,
            deaf: true,
        });
        
        if (!ci.player.connected) await ci.player.connect();
        const res = await ci.client.manager.search(value, {engine: ci.config.DefaultSource, requester: ci.user });

        if(res.type != "empty") {
            if(res.type == "track") {
                await ci.player.queue.add(res.tracks[0]);

                const embed = new EmbedBuilder()
                    .setDescription(`${ci.client.i18n.get(ci.language, "music", "play_track", {
                        title: modTitle(res.tracks[0].title, res.tracks[0]),
                        url: res.tracks[0].url,
                        duration: convertTime(res.tracks[0].length, true),
                        request: res.tracks[0].requester
                    })}`)
                    .setColor(ci.client.color)

                ci.editReply({ embeds: [embed] });
                if(!ci.player.playing) ci.player.play();
            } else if(res.type == "playlist") {
                await ci.player.queue.add(res.tracks);

                const embed = new EmbedBuilder()
                    .setDescription(`${ci.client.i18n.get(ci.language, "music", "play_playlist", {
                        title: res.playlist.name,
                        url: value,
                        duration: convertTime(res.playlist.length),
                        songs: res.tracks.length,
                        request: res.tracks[0].requester
                    })}`)
                    .setColor(ci.client.color)

                ci.editReply({ embeds: [embed] });
                if(!ci.player.playing) ci.player.play();
            } else if(res.type == "search") {
                await ci.player.queue.add(res.tracks[0]);

                const embed = new EmbedBuilder()
                    .setDescription(`${ci.client.i18n.get(ci.language, "music", "play_result", {
                        title: modTitle(res.tracks[0].title, res.tracks[0]),
                        url: res.tracks[0].url,
                        duration: convertTime(res.tracks[0].length, true),
                        request: res.tracks[0].requester
                    })}`)
                    .setColor(ci.client.color)

                ci.editReply({ embeds: [embed] });
                if(!ci.player.playing) ci.player.play();
            } else {
                ci.editReply(`${ci.client.i18n.get(ci.language, "music", "play_fail")}`); 
                ci.player.destroy();
            }
        } else {
            ci.editReply(`${ci.client.i18n.get(ci.language, "music", "play_match")}`); 
            ci.player.destroy();
        }
    }
});