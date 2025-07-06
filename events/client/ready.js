const { ActivityType } = require("discord.js");
const chalk = require('chalk');

const Language = require("../../schema/Language.js");
const Setup = require("../../schema/Setup.js");

module.exports = async (client) => {

    console.info(chalk.green("Client ›"), chalk.magentaBright(client.user.tag), "is Ready!");

    let guilds = client.guilds.cache.size;
    let members = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0);
    let channels = client.channels.cache.size;

    client.user.setActivity({ name: "discord.gg/Moona", url: "https://discord.gg/Moona", type: ActivityType.Streaming });
    const activities = [
        `/help | ${guilds} servers`,
        `/profile | ${members} users`,
        `/play | ${channels} channels`,
    ]

    setInterval(() => {
        client.user.setPresence({ 
            activities: [{ name: `${activities[Math.floor(Math.random() * activities.length)]}`, type: 2 }], 
            status: 'online', 
        });
    }, 60000*3);

    client.user.setStatus("dnd");
    for await (const guild of client.guilds.cache.toJSON()) {
        let glang =  await Language.findOne({ guild: guild.id });
        if (!glang) {
            glang = { guild: guild.id, language: client.config.Language.defaultLocale }
            const setLang = await new Language(glang);
            await setLang.save();
        }
        let gsetup = await Setup.findOne({ guild: guild.id });
        if (!gsetup) {
            gsetup = {
                guild: guild.id,
                enable: false,
                channel: "",
                playmsg: "",
            };
            const newSetup = await new Setup(gsetup);
            await newSetup.save();
        }

        client.db.language.set(guild.id, glang);
        client.db.setup.set(guild.id, gsetup);
    }
    client.user.setStatus("online");
};
