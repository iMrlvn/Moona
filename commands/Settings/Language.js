const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const GLang = require('../../schema/Language.js'); 

module.exports = {
    name: ["language"],
    description: "Change the language for the server",
    category: "Settings",
    options: [
        {
            name: "set",
            description: "Set the language as specified",
            required: true,
            type: ApplicationCommandOptionType.String,
        }
    ],
    permissions: {
        channel: [],
        bot: [],
        user: ["ManageGuild"],
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

        const languages = ci.client.i18n.getLocales();
        if (!languages.includes(input)) return ci.editReply(`${ci.client.i18n.get(ci.language, "utilities", "provide_lang", {
            languages: languages.join(', ')
        })}`);

        const newLang = await GLang.findOne({ guild: ci.guild.id });
        if(!newLang) {
            const newLang = new GLang({
                guild: ci.guild.id,
                language: input
            });
            newLang.save().then(() => {
                const embed = new EmbedBuilder()
                .setDescription(`${ci.client.i18n.get(ci.language, "utilities", "lang_set", {
                    language: input
                })}`)
                .setColor(ci.client.color)

                ci.editReply({ content: " ", embeds: [embed] });
                ci.client.db.language.set(ci.guild.id, input);
            }
            ).catch(() => {
                ci.editReply(`${ci.client.i18n.get(ci.language, "utilities", "Lang_error")}`);
            });
        } else if(newLang) {
            newLang.ci.language = input;
            newLang.save().then(() => {
                const embed = new EmbedBuilder()
                .setDescription(`${ci.client.i18n.get(ci.language, "utilities", "lang_change", {
                    language: input
                })}`)
                .setColor(ci.client.color)
    
                ci.editReply({ content: " ", embeds: [embed] });
                ci.client.db.language.set(ci.guild.id, input);
            }
            ).catch(() => {
                ci.editReply(`${ci.client.i18n.get(ci.language, "utilities", "Lang_error")}`);
            });
        }
    }
}