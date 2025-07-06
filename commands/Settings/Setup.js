const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const Setup = require("../../schema/Setup.js");

module.exports = {
    name: ["setup"],
    description: "Setup channel song request",
    category: "Settings",
    permissions: {
        channel: [],
        bot: ["ManageChannels", "ManageMessages", "AttachFiles"],
        user: ["ManageGuild"]
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

        if (ci.player) ci.player.destroy();

        await ci.guild.channels.create({
            name: "song-request",
            type: 0, // 0 = text, 2 = voice
            topic: `${ci.client.i18n.get(ci.language, "setup", "setup_topic")}`,
            parent: ci.channel.parentId,
            user_limit: 3,
            rate_limit_per_user: 3, 
        }).then(async (channel) => {

        const attachment = new AttachmentBuilder("./assets/image/banner.png", { name: "setup.png" });

        const queueMsg = `${ci.client.i18n.get(ci.language, "setup", "setup_queuemsg")}`;

        const playEmbed = new EmbedBuilder()
            .setColor(ci.client.color)
            .setAuthor({ name: `${ci.client.i18n.get(ci.language, "setup", "setup_playembed_author")}` })
            .setImage(`${ci.client.i18n.get(ci.language, "setup", "setup_playembed_image")}`)
            .setDescription(`${ci.client.i18n.get(ci.language, "setup", "setup_playembed_desc")}`)
            .setFooter({ text: `${ci.client.i18n.get(ci.language, "setup", "setup_playembed_footer", {
                prefix: "/"
            })}` });

        await channel.send({ files: [attachment] });
            await channel.send({ content: `${queueMsg}`, embeds: [playEmbed], components: [ci.client.diSwitch] }).then(async (playmsg) => {
                await Setup.findOneAndUpdate({ guild: ci.guild.id }, {
                    guild: ci.guild.id,
                    enable: true,
                    channel: channel.id,
                    playmsg: playmsg.id,
                });
                
                const embed = new EmbedBuilder()
                    .setDescription(`${ci.client.i18n.get(ci.language, "setup", "setup_msg", {
                        channel: channel,
                    })}`)
                    .setColor(ci.client.color);

                return ci.followUp({ embeds: [embed] });
            })
        }); 
    }
}