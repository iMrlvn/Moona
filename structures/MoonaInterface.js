const { ChatInputCommandInteraction, InteractionType, Message } = require("discord.js");

class MoonaInterface {
    constructor(moona) {
        this.client = moona.client;
        this.interaction = moona.interaction instanceof ChatInputCommandInteraction ? moona.interaction : null;
        this.message = moona.message instanceof Message ? moona.message : null;
        if (!this.interaction && !this.message) return;
        this._set("id");
        this._set("channel");
        this._set("channelId");
        this._set("guild");
        this._set("guildId");
        this._set("me", moona.client.user);
        this._set("member");
        this.author = moona.message instanceof Message ? moona.message.author : moona.interaction.user;
        this.user = moona.interaction instanceof ChatInputCommandInteraction ? moona.interaction.user : moona.message.author;
        this.player = this.client.manager.players.get(this.guildId) ?? null;
        this.config = moona.client.config;
        this._set("language", moona.language);
        this._set("prefix", moona.prefix);
        this._set("createdAt");
        this._set("createdTimestamp");
        this._setArgs();
        this.init();
    }
    get isInteraction() {
        return this.interaction instanceof ChatInputCommandInteraction
    }
    get isMessage() {
        return this.message instanceof Message;
    }
    get deferred() {
        if (this.isInteraction) return this.interaction.deferred;
        if (this.msg) return true;

        return false;
    }
    async reply(data) {
        if (this.isInteraction) {
            this.msg = this.interaction.reply(data);
            return this.msg;
        } else {
            this.msg = await this.message.reply(data);
            return this.msg;
        }
    }
    async deferReply(options={}) {
        if (this.isInteraction) {
            if (typeof options.fetchReply !== "boolean") options.fetchReply=true;
            this.msg = await this.interaction.deferReply(options);
            return this.msg;
        } else {
            this.msg = await this.message.reply(`**${this.client.user?.username}** is thinking...`);
            return this.msg;
        }
    }
    async editReply(data) {
        if (this.isInteraction) {
            return this.interaction.editReply(data);
        } else if (typeof data === "object") {
            if (!data.content) {
                const array = Object.entries(data);
                for (const d of array) {
                    data[d[0]] = d[1];
                }
                data.content = "";

                return this.msg.edit(data);
            }
            else return this.msg.edit(data);
        }
        else return this.msg.edit(data)
    }
    async fetchReply() {
        if (this.isInteraction) {
            return this.interaction.fetchReply();
        } else {
            return this.msg;
        }
    }
    async deleteReply() {
        if (this.isInteraction) {
            return this.interaction?.deleteReply();
        } else {
            return this.msg?.delete();
        }
    }
    async followUp(data) {
        if (this.isInteraction) {
            await this.interaction.followUp(data);
        } else {
            this.msg = await this.message.reply(data);
        }
    }
    async execute() {
        console.log(("CommandUsed ›"), `${(this.command.name.join("-"))} by ${(this.user.tag)} in ${(this.guild.name)} (${(this.guildId)})`);
        try {
            this.command.execute(this);
        } catch(error) {
            console.error(error);
            this.reply({ content: `${this.client.i18n.get(this.language, "interaction", "error")}`, ephmeral: true });
        }
    }
    async init() {
        const interactionCommand = () => {
            return this.client.commands.find(command => {
                switch (command.name.length) {
                    case 1: return command.name[0] == this.interaction.commandName;
                    case 2: return command.name[0] == this.interaction.commandName && command.name[1] == this.interaction.options.getSubcommand()
                    case 3: return command.name[0] == this.interaction.commandName && command.name[1] == this.interaction.options.getSubcommandGroup() && command.name[2] == this.interaction.options.getSubcommandGroup();
                }
            });
        };
        const messageCommand = () => {
            const command = this.args.shift().toLowerCase();
            return this.client.commands.get(command) ?? this.client.commands.find(cmd => cmd.name.join("-") === command) ?? this.client.commands.find(any => any.alias && any.alias.includes(command));
        };

        this.command = this.isInteraction ? interactionCommand() : messageCommand();

        if (!this.command) return;

        if (!this.command.initPermissions(this)) return;

        return this.execute();
    }
    updateMessage(...options) {
        return this.client.updateMessage(...options);
    }
    _set(key, value) {
        if (this.isInteraction) return (this[key] = value ?? this.interaction[key] ?? null)
        else return (this[key] = value ?? this.message[key] ?? null)
    }
    _setArgs() {
        if (this.isInteraction) return (this.args = this.interaction.options.data.map((data) => data?.value));
        else return (this.args = this.message.content.trim()?.slice(this.prefix.length)?.split(/ +/g));
    }
}

module.exports = MoonaInterface;