const { Events } = require("discord.js");

const GuildChart = require("../../schema/GuildChart.js");
const GuildLanguage = require("../../schema/Language.js");
const GuildSetup = require("../../schema/Setup.js");

const UserPremium = require('../../schema/Premium.js');
const UserProfile = require("../../schema/Profile.js");

module.exports = async (client) => {
    client.on(Events.InteractionCreate, async(interaction) => {
        if (!interaction.guild || interaction.user.bot) return;

        await createDatabase("guild", interaction.guild);
        await createDatabase("user", interaction.user)
    });
    client.on(Events.MessageCreate, async(message) => {
        if (!message.guild || message.author.bot) return;

        await createDatabase("guild", message.guild);
        await createDatabase("user", message.author);
    });
};

async function createDatabase(type, raw) {
    try {
        switch(type.toLowerCase()) {
            case "guild": {
                const guild = raw;

                const find_setup = await GuildSetup.findOne({ guild: guild.id });
                if (!find_setup) {
                    const newSetup = await new GuildSetup({
                        guild: guild.id,
                        enable: false,
                        channel: "",
                        playmsg: "",
                    });
                    await newSetup.save();
                }

                const find_lang = await GuildLanguage.findOne({ guild: guild.id });
                if (!find_lang) {
                    const newLang = await GuildLanguage.create({
                        guild: guild.id,
                        language: "en",
                    });
                    await newLang.save();
                }

                const CGuild = await GuildChart.findOne({ guildId: guild.id });
                if (!CGuild) {
                    const newChart = await GuildChart.create({ 
                        guildId: guild.id,
                        playedHistory: []
                    });
                    await newChart.save();
                }
            }

            case "user": {
                const user = raw;

                const find_premium = await UserPremium.findOne({ Id: user.id });
                if (!find_premium) {
                    const newPremium = await UserPremium.create({ Id: user.id });
                    await newPremium.save();
                }

                const CProfile = await UserProfile.findOne({ userId: user.id });
                if (!CProfile) {
                    const newUser = await UserProfile.create({ 
                        userId: user.id,
                        playedCount: 0,
                        useCount: 0,
                        listenTime: 0,
                        playedHistory: [],
                    });
                    await newUser.save();
                }
            }
        }
    }
    catch(error) {
        console.error("Database Create ›", error);
    }
};
