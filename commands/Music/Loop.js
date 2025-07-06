const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: ["loop"],
    description: "Loop the music",
    category: "Music",
    options: [
        {
            name: "mode",
            description: "What mode do you want to loop?",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: "Current 🔂",
                    value: "current"
                },
                {
                    name: "Queue 🔁",
                    value: "queue"
                }
            ]
        }
    ],
    playerPermissions: ["InVoiceChannel", "InSameVoiceChannel"],
    isPlayer: true,
    async execute(ci) {
        await ci.deferReply({ ephemeral: false });

        const choice = ci.args[0];
 
        if(choice === "current") {
            if (ci.player.loop === "none") {
                await ci.player.setLoop("track");

                const embed = new EmbedBuilder()
                    .setDescription(`${ci.client.i18n.get(ci.language, "music", "loop_current")}`)
                    .setColor(ci.client.color);

                return ci.editReply({ embeds: [embed] });
            } else {
                await ci.player.setLoop("none");

                const embed = new EmbedBuilder()
                    .setDescription(`${ci.client.i18n.get(ci.language, "music", "unloop_current")}`)
                    .setColor(ci.client.color);

                return ci.editReply({ embeds: [embed] });
            }
        } else if(choice === "queue") {
            if (ci.player.loop === "none") {
                await ci.player.setLoop("queue");

                const embed = new EmbedBuilder()
                    .setDescription(`${ci.client.i18n.get(ci.language, "music", "loop_all")}`)
                    .setColor(ci.client.color);

                return ci.editReply({ embeds: [embed] });
            } else {
                await ci.player.setLoop("none");

                const embed = new EmbedBuilder()
                    .setDescription(`${ci.client.i18n.get(ci.language, "music", "unloop_all")}`)
                    .setColor(ci.client.color);

                return ci.editReply({ embeds: [embed] });
            }
        }
    }
}
