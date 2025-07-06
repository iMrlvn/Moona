const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const KoFi = require("../../schema/Donate.js");
const Codes = require('voucher-code-generator');
const Redeem = require("../../schema/Redeem.js");

module.exports = {
    name: ["premium", "transaction"],
    description: "Verify ko-fi transaction",
    category: "Premium",
    options: [
        {
            name: "id",
            description: "The transaction id",
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
        const kofi = await KoFi.findOne({ transaction: input });

        let codes = [];

        if (kofi) {
            if (kofi.useable === true) return ci.editReply({ content: "The provided transaction id has already been used." });

            const generate = Codes.generate({
                pattern: '####-####-####'
            });

            const code = generate.toString().toUpperCase();
            const find = await Redeem.findOne({ code: code });

            if (!find) {
                if (kofi.type === "Donation") {
                    Redeem.create({
                        code: code,
                        plan: "weekly",
                        expiresAt: Date.now() + 86400000 * 7,
                    });
                } else if (kofi.type === "Subscription") {
                    Redeem.create({
                        code: code,
                        plan: "monthly",
                        expiresAt: Date.now() + 86400000 * 30,
                    });
                } else if (kofi.type === "Commission") {
                    // I not have commission plan
                    return ci.editReply({ content: "Commission Transaction is not supported yet!" });
                } else if (kofi.type === "Shop Order") {
                    // I not have shop plan
                    return ci.editReply({ content: "Shop Order Transaction is not aupported yet!" });
                }

                codes.push(`${code}`);
            }

            KoFi.findOneAndUpdate({ transaction: input }, { $set: { useable: true } }, { new: true }, (err, doc) => {
                if (err) console.log(err);
            });

            const embed = new EmbedBuilder()
                .setTitle("Verify your Transaction")
                .setDescription(`Here your code is: \`${codes.join('\n')}\``)
                .setColor(ci.client.color)
                .setFooter({ text: `${ci.client.i18n.get(ci.language, "premium", "gen_footer", {
                    prefix: "/"
                })}`, iconURL: ci.user.displayAvatarURL() })
                .setTimestamp();

            return ci.editReply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder()
                .setColor(ci.client.color)
                .setDescription(`The transaction id is invalid or has been used already.`)

            return ci.editReply({ embeds: [embed] })
        }
    }
}
