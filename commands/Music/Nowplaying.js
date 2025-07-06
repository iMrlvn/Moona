const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const formatDuration = require('../../utils/FormatDuration.js');
const Setup = require("../../schema/Setup.js");

module.exports = {
    name: ["nowplaying"], // I move search to main issues subcmd (max 25)
    description: "Display the song currently playing.",
    category: "Music",
    isPlayer: true,
    async execute(ci) {
        await ci.deferReply({ ephemeral: false });

        const database = await Setup.findOne({ guild: ci.guild.id });
        if (database.enable === true) return ci.editReply(`${ci.client.i18n.get(ci.language, "setup", "setup_enable")}`);

        const realtime = ci.config.NpRealTime;

        const song = ci.player.queue.current;
        const CurrentDuration = formatDuration(ci.player.position);
        const TotalDuration = formatDuration(song.length);
        const Part = Math.floor(ci.player.position / song.length * 30);
        const Emoji = ci.player.playing ? "🔴 |" : "⏸ |";
        
        const embeded = new EmbedBuilder()
            .setColor(ci.client.color)
            .setDescription(`${ci.player.playing ? ci.client.i18n.get(ci.language, "music", "np_title") : ci.client.i18n.get(ci.language, "music", "np_title_pause")} [${modTitle(song.title, song)}](${song.uri}) [${song.requester}]`)

        const button = ci.client.button.nowplaying;

        const row = new  ActionRowBuilder()
            .addComponents(
            new ButtonBuilder()
                .setCustomId("previous")
                //.setLabel(`${button.previous.label}`)
                .setEmoji(`${button.previous.emoji}`)
                .setStyle(ButtonStyle[button.previous.style])
            )
            .addComponents(
            new ButtonBuilder()
                .setCustomId("pause")
                //.setLabel(`${button.pause.label}`)
                .setEmoji(`${button.pause.emoji}`)
                .setStyle(ButtonStyle[button.pause.style])
            )
            .addComponents(
            new ButtonBuilder()
                .setCustomId("stop")
                //.setLabel(`${button.stop.label}`)
                .setEmoji(`${button.stop.emoji}`)
                .setStyle(ButtonStyle[button.stop.style])
            )
            .addComponents(
            new ButtonBuilder()
                .setCustomId("loop")
                //.setLabel(`${button.loop.label}`)
                .setEmoji(`${button.loop.emoji}`)
                .setStyle(ButtonStyle[button.loop.style])
            )
            .addComponents(
            new ButtonBuilder()
                .setCustomId("skip")
                //.setLabel(`${button.skip.label}`)
                .setEmoji(`${button.skip.emoji}`)
                .setStyle(ButtonStyle[button.skip.style])
            )

        const nowPlayingMessage = await ci.editReply({ embeds: [embeded], components: [row] });
        ci.updateMessage("np_message", nowPlayingMessage);

        if (realtime === 'true') {
        ci.client.interval = setInterval(async () => {
            if (!ci.player.playing) return;
            const CurrentDuration = formatDuration(ci.player.position);
            const Part = Math.floor(ci.player.position / song.length * 30);
            const Emoji = ci.player.playing ? "🔴 |" : "⏸ |";

            embeded.data.fields[6] = { name: `${ci.client.i18n.get(ci.language, "music", "np_current_duration", {
                current_duration: CurrentDuration,
                total_duration: TotalDuration
            })}`, value: `\`\`\`${Emoji} ${'─'.repeat(Part) + '🎶' + '─'.repeat(30 - Part)}\`\`\`` };

            if (nowPlayingMessage) nowPlayingMessage.edit({ content: " ", embeds: [embeded], components: [row] })
        }, 5000);
        } else if (realtime === 'false') {
            if (!ci.player.playing) return;
            if (nowPlayingMessage) nowPlayingMessage.edit({ content: " ", embeds: [embeded], components: [row] });
        }

        const filter = (ci) => {
            if(ci.guild.members.me.voice.channel && ci.guild.members.me.voice.channelId === ci.member.voice.channelId) return true;
            else {
                ci.reply({ content: `${ci.client.i18n.get(ci.language, "music", "np_invoice")}`, ephemeral: true });
            }
        };
        const collector = nowPlayingMessage.createMessageComponentCollector({ filter, time: song.length });

        collector.on('collect', async (ci) => {
            const id = ci.customId;

            if(id === "pause") {
            if(!ci.player) {
                collector.stop();
            }
            await ci.player.pause(!ci.player.paused);
            const uni = ci.player.paused ? `${ci.client.i18n.get(ci.language, "music", "np_switch_pause")}` : `${ci.client.i18n.get(ci.language, "music", "np_switch_resume")}`;
        
            const embed = new EmbedBuilder()
                .setDescription(`${ci.client.i18n.get(ci.language, "music", "np_pause_msg", {
                    pause: uni
                })}`)
                .setColor(ci.client.color);
            
            embeded.setAuthor({ name: ci.player.playing ? `${ci.client.i18n.get(ci.language, "music", "np_title")}` : `${ci.client.i18n.get(ci.language, "music", "np_title_pause")}`, iconURL: `${ci.client.i18n.get(ci.language, "music", "np_icon")}` })
            embeded.data.fields[6] = { name: `${ci.client.i18n.get(ci.language, "music", "np_current_duration", {
                current_duration: formatDuration(ci.player.position),
                total_duration: TotalDuration
            })}`, value: `\`\`\`${ci.player.playing ? "🔴 |" : "⏸ |"} ${'─'.repeat(Math.floor(ci.player.position / song.length * 30)) + '🎶' + '─'.repeat(30 - Math.floor(ci.player.position / song.length * 30))}\`\`\`` };

            if(nowPlayingMessage) await nowPlayingMessage.edit({ embeds: [embeded] });
            ci.reply({ embeds: [embed], ephemeral: true });
            } else if(id === "previous") {
            if(!ci.player) {
                collector.stop();
            }

            await ci.player.seek(0);
            
            const embed = new EmbedBuilder()
                .setDescription(`${ci.client.i18n.get(ci.language, "music", "np_replay_msg")}`)
                .setColor(ci.client.color);;
        
            ci.reply({ embeds: [embed], ephemeral: true });
            } else if(id === "stop") {
            if(!ci.player) {
                collector.stop();
            }
            await ci.player.destroy();
        
            const embed = new EmbedBuilder()
                .setDescription(`${ci.client.i18n.get(ci.language, "music", "np_stop_msg")}`)
                .setColor(ci.client.color);

            await ci.client.clearInterval(ci.client.interval);
            if (nowPlayingMessage) await nowPlayingMessage.edit({ components: [] })
            ci.reply({ embeds: [embed], ephemeral: true });
            } else if (id === "skip") {
            if(!ci.player) {
                collector.stop();
            }
            await ci.player.skip();
        
            const embed = new EmbedBuilder()
                .setDescription(`${ci.client.i18n.get(ci.language, "music", "np_skip_msg")}`)
                .setColor(ci.client.color);

            await ci.client.clearInterval(ci.client.interval);
            if (nowPlayingMessage) await nowPlayingMessage.edit({ components: [] });
            ci.reply({ embeds: [embed], ephemeral: true });
            } else if(id === "loop") {
            if(!ci.player) {
                collector.stop();
            }
            await ci.player.setLoop(ci.player.loop != "queue" ? "queue" : "none");
            const uni = ci.player.loop = "queue" ? `${ci.client.i18n.get(ci.language, "music", "np_switch_enable")}` : `${ci.client.i18n.get(ci.language, "music", "np_switch_disable")}`;
        
            const embed = new EmbedBuilder()
                .setDescription(`${ci.client.i18n.get(ci.language, "music", "np_repeat_msg", {
                    loop: uni
                    })}`)
                .setColor(ci.client.color);
        
            ci.reply({ embeds: [embed], ephemeral: true });
        }
        });

        collector.on('end', async (collected, reason) => {
            const oldMessage = ci.channel.messages.cache.get(nowPlayingMessage.id);
            if (nowPlayingMessage && oldMessage) await nowPlayingMessage.edit({ components: [] });
                await ci.client.clearInterval(ci.client.interval);
        });
    }
}