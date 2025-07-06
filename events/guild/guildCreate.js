const Language = require("../../schema/Language.js");

module.exports = async (client, guild) => {
    let dataLang = await Language.findOne({ guild: guild.id });
    if (!dataLang) {
        const setLang = await new Language({
            guild: guild.id,
            language: client.config.Language.defaultLocale,
        });
        dataLang = await setLang.save();
    };
    client.db.language.set(guild.id, dataLang);
}