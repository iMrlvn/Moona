const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const Premium = require("../../schema/Premium.js");
const Redeem = require("../../schema/Redeem.js");

const formatTime = require("../../utils/FormatTime.js");

module.exports = {
    name: ["redeem"],
    description: "Redeem your premium!",
    category: "Premium",
    options: [
        {
            name: "code",
            description: "The code you want to redeem",
            required: true,
            type: ApplicationCommandOptionType.String,
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
        isOwner: false,
        inVoice: false,
        sameVoice: false,
    },
    async execute(ci) {
        await ci.deferReply({ ephemeral: false });
        
        const input = ci.args[0];
        
        let member = await Premium.findOne({ Id: ci.user.id })

        if (member && member.isPremium) {
            const embed = new EmbedBuilder()
                .setColor(ci.client.color)
                .setDescription(`${ci.client.i18n.get(ci.language, "premium", "redeem_already")}`)
            return ci.editReply({ embeds: [embed] });
        }
  
        const premium = await Redeem.findOne({ code: input.toUpperCase() });
        if (premium) {
            const expires = formatTime(premium.expiresAt);
  
            member.isPremium = true
            member.premium.redeemedBy.push(ci.user)
            member.premium.redeemedAt = Date.now()
            member.premium.expiresAt = premium.expiresAt
            member.premium.plan = premium.plan

            member = await member.save({ new: true });
            await premium.deleteOne();

            const embed = new EmbedBuilder()
                .setAuthor({ name: `${ci.client.i18n.get(ci.language, "premium", "redeem_title")}`, iconURL: ci.client.user.displayAvatarURL() })
                .setDescription(`${ci.client.i18n.get(ci.language, "premium", "redeem_desc", {
                    expires: expires,
                    plan: premium.plan
                })}`)
                .setColor(ci.client.color)
                .setTimestamp()

            return ci.editReply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder()
                .setColor(ci.client.color)
                .setDescription(`${ci.client.i18n.get(ci.language, "premium", "redeem_invalid")}`)
            return ci.editReply({ embeds: [embed] })
        }
    }
}