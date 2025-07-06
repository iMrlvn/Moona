const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const Premium = require("../../schema/Premium.js");

module.exports = {
    name: ["premium", "remove"],
    description: "Remove premium from members!",
    category: "Premium",
    options: [
        {
            name: "target",
            description: "Mention a user want to remove!",
            required: true,
            type: ApplicationCommandOptionType.User,
        }
    ],
    permissions: {
        channel: [],
        bot: [],
        user: []
    },
    settings: {
        isPremium: false,
        isPlayer: false,
        isOwner: true,
        inVoice: false,
        sameVoice: false,
    },
    async execute(ci) {
        await ci.deferReply({ ephemeral: false });
        
        const mentions = ci.args[0];
        
        const db = await Premium.findOne({ Id: mentions.id });

        if (db.isPremium) {
            db.isPremium = false
            db.premium.redeemedBy = []
            db.premium.redeemedAt = null
            db.premium.expiresAt = null
            db.premium.plan = null

            const newUser = await db.save({ new: true }).catch(() => {})

            const embed = new EmbedBuilder()
                .setDescription(`${ci.client.i18n.get(ci.language, "premium", "remove_desc", {
                    user: mentions
                })}`)
                .setColor(ci.client.color)

            ci.editReply({ embeds: [embed] });

        } else {
            const embed = new EmbedBuilder()
                .setDescription(`${ci.client.i18n.get(ci.language, "premium", "remove_already", {
                    user: mentions
                })}`)
                .setColor(ci.client.color)

            ci.editReply({ embeds: [embed] });
        }
    }
}