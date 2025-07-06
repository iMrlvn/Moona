const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Collection } = require("discord.js");
const formatduration = require('../../utils/FormatDuration.js');

const PlayerButtons = require("../../plugins/PlayerButtons.js");

module.exports = class {
    async execute(client, player, track, payload) {
    if(!player) return;

    /////////// Update Music Setup ///////////

    await client.UpdateQueueMsg(player);
    await client.clearInterval(client.interval);
    await client.addChart(player, track);

    /////////// Update Music Setup ///////////

    const channel = client.channels.cache.get(player.textId);
    if (!channel) return;

    const db = client.db.setup.get(channel.guild.id);
    if (db.channel == channel.guild.id) return;

    const language = client.db.language.get(channel.guild.id);

    const sourceEmoji = client.emoji.source[track.sourceName];
    const embeded = new EmbedBuilder()
      //.setAuthor({ name: `${client.i18n.get(language, "player", "track_title")}`, iconURL: `${client.i18n.get(language, "player", "track_icon")}` })
      .setDescription(`${sourceEmoji ? sourceEmoji+" ": ""}${client.i18n.get(language, "player", "track_title")} [${modTitle(track.title, track)}](${track.uri}) [${track.requester}]`)
      .setColor(client.color)
      /*.addFields({ name: `${client.i18n.get(language, "player", "author_title")}`, value: `${track.author}`, inline: true })
      .addFields({ name: `${client.i18n.get(language, "player", "request_title")}`, value: `${track.requester}`, inline: true })
      .addFields({ name: `${client.i18n.get(language, "player", "volume_title")}`, value: `${player.volume}%`, inline: true })
      .addFields({ name: `${client.i18n.get(language, "player", "queue_title")}`, value: `${player.queue.length}`, inline: true })
      .addFields({ name: `${client.i18n.get(language, "player", "duration_title")}`, value: `${formatduration(track.length, true)}`, inline: true })
      .addFields({ name: `${client.i18n.get(language, "player", "total_duration_title")}`, value: `${formatduration(player.queue.length)}`, inline: true })
      .addFields({ name: `${client.i18n.get(language, "player", "current_duration_title", {
        current_duration: formatduration(track.length, true),
      })}`, value: `\`\`\`🔴 | 🎶──────────────────────────────\`\`\``, inline: false })
      .setTimestamp();*/

      if (track.thumbnail) {
        embeded.setThumbnail(`https://img.youtube.com/vi/${track.identifier}/maxresdefault.jpg`);
      } else {
        embeded.setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }));
      }

      const bc1 = new  ActionRowBuilder().addComponents(PlayerButtons[0]);
      
      const bc2 = new  ActionRowBuilder().addComponents(PlayerButtons[1]);
      
      const bc3 = new ActionRowBuilder().addComponents(PlayerButtons[2]);

    const playStartMessage = await channel.send({ embeds: [embeded], components: [bc1, bc2, bc3] });
    client.updateMessage("ps_message", playStartMessage);

    const filter = (message) => {
      if(message.guild.members.me.voice.channel && message.guild.members.me.voice.channelId === message.member.voice.channelId) return true;
      else {
        message.reply({ content: `${client.i18n.get(language, "player", "join_voice")}`, ephemeral: true });
      }
    };
    const collector = playStartMessage.createMessageComponentCollector({ filter, time: track.length });

    collector.on('collect', async (message) => {
      const id = message.customId;
      switch(id) {
      case "pause": {
      if(!player) {
          collector.stop();
      }
        await player.pause(!player.paused);
        const uni = player.paused ? `${client.i18n.get(language, "player", "switch_pause")}` : `${client.i18n.get(language, "player", "switch_resume")}`;

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "player", "pause_msg", {
              pause: uni,
            })}`)
            .setColor(client.color);

        message.reply({ embeds: [embed], ephemeral: true });
      }
      case "skip": {
        if(!player) {
          collector.stop();
        }
        if (player.queue.size == 0) {
            await player.destroy();
            await client.UpdateMusic(player);

            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "music", "skip_msg")}`)
                .setColor(client.color);
    
            await playStartMessage.edit({ embeds: [embeded], components: [] });
            message.reply({ embeds: [embed], ephemeral: true });
        } else {
            await player.skip();

            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "music", "skip_msg")}`)
                .setColor(client.color);
    
            await playStartMessage.edit({ embeds: [embeded], components: [] });
            message.reply({ embeds: [embed], ephemeral: true });
        }
      }
      case "stop": {
        if(!player) {
          collector.stop();
        }

        await player.destroy();
        await client.UpdateMusic(player);

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "player", "stop_msg")}`)
            .setColor(client.color);

        message.reply({ embeds: [embed], ephemeral: true });
        collector.stop();
      }
      case "shuffle": {
        if(!player) {
          collector.stop();
        }
        await player.queue.shuffle();

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "player", "shuffle_msg")}`)
            .setColor(client.color);

        message.reply({ embeds: [embed], ephemeral: true });
      }
      case "loop": {
        if(!player) {
          collector.stop();
        }
        await player.setLoop(player.loop != "queue" ? "queue" : "none");

        const uni = player.loop == "queue" ? `${client.i18n.get(language, "player", "switch_enable")}` : `${client.i18n.get(language, "player", "switch_disable")}`;

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "player", "repeat_msg", {
              loop: uni,
            })}`)
            .setColor(client.color);

        message.reply({ embeds: [embed], ephemeral: true });
      }
      case "volup": {
        if(!player) {
          collector.stop();
        }
        await player.setVolume(player.volume + 5);

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "player", "volup_msg", {
              volume: player.volume,
            })}`)
            .setColor(client.color);

        message.reply({ embeds: [embed], ephemeral: true });
      }
      case "voldown": {
        if(!player) {
          collector.stop();
        }
        await player.setVolume(player.volume - 5);

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "player", "voldown_msg", {
              volume: player.volume,
            })}`)
            .setColor(client.color);

        message.reply({ embeds: [embed], ephemeral: true });
      }
      case "previous": {
        if(!player) {
          collector.stop();
        }
        await player.seek(0);

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "player", "replay_msg")}`)
            .setColor(client.color);

        message.reply({ embeds: [embed], ephemeral: true });
      }
      case "queue": {
        if(!player) {
          collector.stop();
        }
        const song = player.queue.current;
        const qduration = `${formatduration(player.queue.length)}`;
        
        let pagesNum = Math.ceil(player.queue.length / 10);
        if(pagesNum === 0) pagesNum = 1;
    
        const songStrings = [];
        for (let i = 0; i < player.queue.length; i++) {
          const song = player.queue[i];
          songStrings.push(
            `**${i + 1}.** [${song.title}](${song.uri}) \`[${formatduration(song.length)}]\` • ${song.requester}
            `);
        }

        const pages = [];
        for (let i = 0; i < pagesNum; i++) {
          const str = songStrings.slice(i * 10, i * 10 + 10).join('');
    
          const embed = new EmbedBuilder()
            .setAuthor({ name: `${client.i18n.get(language, "player", "queue_author", {
              guild: message.guild.name,
            })}`, iconURL: message.guild.iconURL({ dynamic: true }) })
            .setColor(client.color)
            .setDescription(`${client.i18n.get(language, "player", "queue_description", {
              track: song.title,
              track_url: song.uri,
              duration: formatduration(song.length),
              requester: song.requester,
              list_song: str == '' ? '  Nothing' : '\n' + str,
            })}`)
            .setFooter({ text: `${client.i18n.get(language, "player", "queue_footer", {
              page: i + 1,
              pages: pagesNum,
              queue_lang: player.queue.length,
              total_duration: qduration,
            })}` });

          if (song.thumbnail) {
            embed.setThumbnail(`https://img.youtube.com/vi/${song.identifier}/maxresdefault.jpg`);
          } else {
              embed.setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }));
          }
    
          pages.push(embed);
        }
        message.reply({ embeds: [pages[0]], ephemeral: true });
      }
      case "clear": {
        if(!player) {
          collector.stop();
        }
        await player.queue.clear();

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "player", "clear_msg")}`)
            .setColor(client.color);

        message.reply({ embeds: [embed], ephemeral: true });
      }
      }
    });

    collector.on('end', async (collected, reason) => {
        const oldMessage = channel.messages.cache.get(playStartMessage.id);
        if (playStartMessage && oldMessage) playStartMessage.edit({ embeds: [embeded], components: [] })
    });
    }
}
