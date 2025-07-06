const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { I18n } = require("@hammerhq/localization");

const MoonaManager = require("./MoonaManager.js");
const LoadHandlers = require("../handlers/index.js");

class Moona extends Client {
    constructor() {
        super({
            shards: "auto",
            allowedMentions: { 
                parse: ["users", "roles","everyone"],
                repliedUser: false,
            },
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.MessageContent,
            ]
        });

        process.on('unhandledRejection', info => console.error("Unhandled ›", info));
        process.on('uncaughtException', info => console.error("Uncaught ›", info));

        this.on("error", console.error);
        this.on("warn", console.warn);

        this.config = require("../settings/config.js");
        this.button = require("../settings/button.js");
        this.emoji = require("../settings/emoji.js");

        this.color = this.config.Color;
        this.ownerId = this.config.OwnerId;

        this.i18n = new I18n(this.config.Language);

        this.commands = new Collection();
        this.db = {
            language: new Collection(),
            setup: new Collection(),
        };
        this.messages = {};

        const client = this;

        this.manager = new MoonaManager(client);
        LoadHandlers(client);

        super.login(process.env.Token);
    }
    updateMessage(key, message) {
        if (!key && !message) return;
        else if (key === true && this.messages) {
            for (const msg of Object.values(this.messages)) {
                if (msg) msg.delete().catch(_ => void 0);
            }
            return (this.messages = {});
        }
        if (this.messages[key]) this.messages[key].delete().catch(_ => void 0);

        return (this.messages[key] = message);
    }
};

module.exports = Moona;