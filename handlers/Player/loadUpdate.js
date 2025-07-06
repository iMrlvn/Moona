const { EmbedBuilder } = require("discord.js");
const formatDuration = require("../../utils/FormatDuration.js");
const GLang = require("../../schema/Language.js");
const Setup = require("../../schema/Setup.js");
  
module.exports = async (client) => {

    client.UpdateQueueMsg = async function (player) {
        const database = await Setup.findOne({ guild: player.guildId });
        if (database.enable === false) return;

        const channel = await client.channels.cache.get(database.channel);
        if (!channel) return;

        const msg = await channel.messages.fetch(database.playmsg, { cache: false, force: true });
        if (!msg) return;
    
        const guildModel = await GLang.findOne({ guild: player.guildId });
        const { language } = guildModel;

        const songStrings = [];
        const queuedSongs = player.queue.map((song, i) => `${client.i18n.get(language, "setup", "setup_content_queue", {
            index: i + 1,
            title: modTitle(song.title, song),
            duration: formatDuration(song.length),
            request: song.requester.tag,
        })}`);

        songStrings.push(...queuedSongs);

        const Str = songStrings.slice(0, 10).join('\n');

        const cSong = player.queue.current;
        const qDuration = `${formatDuration(player.queue.length)}`;

        const played = player.playing ? `${client.i18n.get(language, "setup", "setup_nowplay")}` : `${client.i18n.get(language, "setup", "setup_songpause")}`;

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${played}`, iconURL: `${client.i18n.get(language, "setup", "setup_author_icon")}` })
            .setDescription(`${client.i18n.get(language, "setup", "setup_desc", {
                title: modTitle(cSong.title, cSong),
                url: cSong.uri,
                duration: formatDuration(cSong.length),
                request: cSong.requester,
            })}`) // [${cSong.title}](${cSong.uri}) \`[${formatDuration(cSong.length)}]\` • ${cSong.requester}
            .setColor(client.color)
            .setFooter({ text: `${client.i18n.get(language, "setup", "setup_footer", {
                songs: player.queue.length,
                volume: player.volume,
                duration: qDuration,
            })}` }) //${player.queue.length} • Song's in Queue | Volume • ${player.volume}% | ${qDuration} • Total Duration

            if(cSong.thumbnail) {
                embed.setImage(`https://img.youtube.com/vi/${cSong.identifier}/sddefault.jpg`);
            } else {
                embed.setImage(`${client.i18n.get(language, "setup", "setup_playembed_image")}`);
            }

        return msg.edit({ 
            content: `${client.i18n.get(language, "setup", "setup_content")}\n${Str == '' ? `${client.i18n.get(language, "setup", "setup_content_empty")}` : '\n' + Str}`, 
            embeds: [embed], 
            components: [client.enSwitch] 
        }).catch((e) => {});
    };

    client.UpdateMusic = async function (player) {
        const database = await Setup.findOne({ guild: player.guildId });
        if (database.enable === false) return;

        const channel = await client.channels.cache.get(database.channel);
        if (!channel) return;

        const msg = await channel.messages.fetch(database.playmsg, { cache: true, force: true });
        if (!msg) return;
    
        const guildModel = await GLang.findOne({ guild: player.guildId });
        const { language } = guildModel;

        const queueMsg = `${client.i18n.get(language, "setup", "setup_queuemsg")}`;

        const playEmbed = new EmbedBuilder()
          .setColor(client.color)
          .setAuthor({ name: `${client.i18n.get(language, "setup", "setup_playembed_author")}` })
          .setImage(`${client.i18n.get(language, "setup", "setup_playembed_image")}`)
          .setDescription(`${client.i18n.get(language, "setup", "setup_playembed_desc", {
              clientId: client.user.id,
          })}`)
          .setFooter({ text: `${client.i18n.get(language, "setup", "setup_playembed_footer", {
            prefix: "/"
          })}` });

        return msg.edit({ 
            content: `${queueMsg}`, 
            embeds: [playEmbed], 
            components: [client.diSwitch] 
        }).catch((e) => {});
    };
};