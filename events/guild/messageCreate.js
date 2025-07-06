const { MoonaInterface } = require("../../structures/index.js");

module.exports = (client, message) => {
    if (!message.guild || message.author.bot) return;

    const language = client.db.language.get(message.guild.id);
    const mentions = new RegExp(`^<@!?${client.user?.id}>( |)$`);
    if (message.content.match(mentions)) {
        return message.reply("Hai!");
    }

    let prefix;
    const prefixList = [client.user.toString(), client.user.username.toLowerCase(), client.config.Prefix.toLowerCase()];
    const rawContent = message.content.toLowerCase();

    for (const thisPrefix of prefixList) {
        if (rawContent.startsWith(thisPrefix)) {
            prefix = rawContent.match(new RegExp(`^(${thisPrefix})\\s*`))[0];
        }
    }

    if (!prefix) return;

    try {
        new MoonaInterface({
            client,
            message,
            language,
            prefix,
        });
    } catch(error) {
        console.info(error);
    }

}