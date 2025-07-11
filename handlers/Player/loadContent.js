const { EmbedBuilder } = require("discord.js");
const Setup = require("../../schema/Setup.js");
const GLang = require("../../schema/Language.js");

module.exports = async (client) => {
try {
    client.on("interactionCreate", async (interaction) => {
        if (interaction.isButton()) {
            const { customId, member } = interaction;
            let voiceMember = interaction.guild.members.cache.get(member.id);
            let channel = voiceMember.voice.channel;

            const player = await client.manager.players.get(interaction.guild.id);
            if (!player) return;

            const playChannel = client.channels.cache.get(player.textId);
            if (!playChannel) return;
        
            const guildModel = await GLang.findOne({ guild: playChannel.guild.id });
            const { language } = guildModel;

            const database = await Setup.findOne({ guild: interaction.guild.id });
            if (database.enable === false) return;

            switch (customId) {
                case "sprevious":
                    {
                        if (!channel) { 
                            return interaction.reply(`${client.i18n.get(language, "noplayer", "no_voice")}`);
                        } else if (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel)) {
                            return interaction.reply(`${client.i18n.get(language, "noplayer", "no_voice")}`);
                        } else if (!player || !player.queue.previous) {
                            return interaction.reply(`${client.i18n.get(language, "music", "previous_notfound")}`);
                        } else {
                            await player.queue.unshift(player.queue.previous);
                            await player.skip();

                            const embed = new EmbedBuilder()
                                .setDescription(`${client.i18n.get(language, "music", "previous_msg")}`)
                                .setColor(client.color);

                            interaction.reply({ embeds: [embed] });
                        }
                    }
                    break;

                case "sskip":
                    {
                        if (!channel) { 
                            return interaction.reply(`${client.i18n.get(language, "noplayer", "no_voice")}`);
                        } else if (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel)) {
                            return interaction.reply(`${client.i18n.get(language, "noplayer", "no_voice")}`);
                        } else if (!player) {
                            return interaction.reply(`${client.i18n.get(language, "noplayer", "no_player")}`);
                        } else {}
                        if (player.queue.size == 0) {
                            await player.destroy();
                            await client.UpdateMusic(player);

                            const embed = new EmbedBuilder()
                                .setDescription(`${client.i18n.get(language, "music", "skip_msg")}`)
                                .setColor(client.color);

                            interaction.reply({ embeds: [embed] });
                        } else {
                            await player.skip();

                            const embed = new EmbedBuilder()
                                .setDescription(`${client.i18n.get(language, "music", "skip_msg")}`)
                                .setColor(client.color);

                            interaction.reply({ embeds: [embed] });
                        }
                    }
                    break;

                case "sstop":
                    {
                        if (!channel) { 
                            return interaction.reply(`${client.i18n.get(language, "noplayer", "no_voice")}`);
                        } else if (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel)) {
                            return interaction.reply(`${client.i18n.get(language, "noplayer", "no_voice")}`);
                        } else if (!player) {
                            return interaction.reply(`${client.i18n.get(language, "noplayer", "no_player")}`);
                        } else {
                            await player.destroy();
                            await client.UpdateMusic(player);

                            const embed = new EmbedBuilder()
                                .setDescription(`${client.i18n.get(language, "player", "stop_msg")}`)
                                .setColor(client.color);

                            interaction.reply({ embeds: [embed] });
                        }
                    }
                    break;

                case "spause":
                    {
                        if (!channel) { 
                            return interaction.reply(`${client.i18n.get(language, "noplayer", "no_voice")}`);
                        } else if (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel)) {
                            return interaction.reply(`${client.i18n.get(language, "noplayer", "no_voice")}`);
                        } else if (!player) {
                            return interaction.reply(`${client.i18n.get(language, "noplayer", "no_player")}`);
                        } else {
                            await player.pause(!player.paused);
                            const uni = player.paused ? `${client.i18n.get(language, "player", "switch_pause")}` : `${client.i18n.get(language, "player", "switch_resume")}`;

                            const embed = new EmbedBuilder()
                                .setDescription(`${client.i18n.get(language, "player", "pause_msg", {
                                pause: uni,
                                })}`)
                                .setColor(client.color);
                                
                            client.UpdateQueueMsg(player);
                            interaction.reply({ embeds: [embed] });
                        }
                    }
                    break;

                case "sloop":
                    {
                        if (!channel) { 
                            return interaction.reply(`${client.i18n.get(language, "noplayer", "no_voice")}`);
                        } else if (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel)) {
                            return interaction.reply(`${client.i18n.get(language, "noplayer", "no_voice")}`);
                        } else if (!player) {
                            return interaction.reply(`${client.i18n.get(language, "noplayer", "no_player")}`);
                        } else {
                            await player.setLoop(player.loop != "queue" ? "queue" : "none");
                            const uni = player.loop == "queue"  ? `${client.i18n.get(language, "player", "switch_enable")}` : `${client.i18n.get(language, "player", "switch_disable")}`;
                    
                            const embed = new EmbedBuilder()
                                .setDescription(`${client.i18n.get(language, "player", "repeat_msg", {
                                loop: uni,
                                })}`)
                                .setColor(client.color);

                            interaction.reply({ embeds: [embed] });
                        }
                    }
                break;
            default:
                break;
            }
        }
    });
    } catch (e) {
        console.log(e);
}

client.on("messageCreate", async (message) => {
        if (!message.guild || !message.guild.available) return;

        await client.createMessage(message);
        
        const database = await Setup.findOne({ guild: message.guild.id });
        if (database.enable === false) return;

        const channel_find = await message.guild.channels.cache.get(database.channel);
        if (!channel_find) return;

        if (database.channel != message.channel.id) return; 

        try {
            const msg = await channel_find.messages.fetch(database.playmsg, { cache: true, force: true });
            if (!msg) return;
        } catch (e) {
            return;
        }

        const guildModel = await GLang.findOne({ guild: message.guild.id });
        const { language } = guildModel;
        
        if (message.author.id === client.user.id) {
            // check if from database.playmsg
            if (message.id === database.playmsg) {
                ///
            } else {
                await delay(3000);
                message.delete();
            }
        }

        if (message.author.bot) return;

        const song = message.cleanContent;
        await message.delete();

        const { channel } = await message.member.voice;
        if (!channel) return message.channel.send(`${client.i18n.get(language, "noplayer", "no_voice")}`);

        const player = await client.manager.createPlayer({
            guildId: message.guild.id,
            voiceId: message.member.voice.channel.id,
            textId: message.channel.id,
            deaf: true,
        });

        if (player.state != 0) await player.connect();
        const res = await client.manager.search(song, { engine: client.config.DefaultSource, requester: message.author });

        if(res.tracks.length > 0) {
            if(res.type == "TRACK") {
                player.queue.add(res.tracks[0]);
                if(!player.playing) player.play();
            } else if(res.type == "PLAYLIST") {
                player.queue.add(res.tracks)
                if(!player.playing) player.play();
            } else if(res.type == "SEARCH") {
                player.queue.add(res.tracks[0]);
                if(!player.playing) player.play();
            } else {
                message.channel.send(`${client.i18n.get(language, "music", "play_fail")}`).then((msg) => { 
                    setTimeout(() => {
                        msg.delete()
                    }, 4000);
                });
                player.destroy();
            }
        } else {
            message.channel.send(`${client.i18n.get(language, "music", "play_match")}`).then((msg) => { 
                setTimeout(() => {
                    msg.delete()
                }, 4000);
            });
            player.destroy();
        }

        if (player) {
            client.UpdateQueueMsg(player);
        }
    });
};

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}