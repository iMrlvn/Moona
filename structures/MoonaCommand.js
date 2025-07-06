const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");

class MoonaCommand extends SlashCommandBuilder {
    constructor(data) {
        super();

        if (!data && typeof data != "object") {
            throw new Error("Required valid data!");
        }
        this.category = data.category ?? "Uncategorized";

        this.name = data.name;
        this.description = data.description;
        this.options = data.options ?? [];

        this.aliases = data.aliases ?? [];
        this.autoComplete = data.autoComplete ?? false;
        this.clientPermissions = data.clientPermissions ?? [];
        this.channelPermissions = data.channelPermissions ?? [];
        this.playerPermissions = data.playerPermissions ?? [];
        this.userPermissions = data.userPermissions ?? [];
        this.isPlayer = data.isPlayer ?? false;
        this.execute = data.execute ?? (() => { throw new Error("Data Execute Not Set!"); })
    }
    initPermissions(moona) {
        const Permissions = {
            Client: this.clientPermissions,
            Channel: this.channelPermissions,
            Player: this.playerPermissions,
            User: this.userPermissions,
        };

        if (!moona.guild.members.me.permissions.has(PermissionsBitField.Flags.ViewChannel) || !moona.guild.members.me.permissions.has(PermissionsBitField.Flags.SendMessages)) return false;

        if (!moona.guild.members.me.permissions.has(PermissionsBitField.Flags.EmbedLinks)) {
            moona.reply({ content: moona.client.i18n.get(moona.language, "interaction", "bot_perms", { perms: "EmbedLinks" }), ephemeral: true });
            return false;
        }

        if ((moona.command.category == "Developer" ?? moona.command.private) && moona.user.id !== moona.client.ownerId) {
            moona.reply({ content: moona.client.i18n.get(moona.language, "interaction", "owner_only"), ephemeral: true });
            return false;
        }

        const AllInOnePermissions = Object.values(Permissions);
        const aioPermissions = !AllInOnePermissions[0].length && !AllInOnePermissions[1].length && !AllInOnePermissions[2].length && !AllInOnePermissions[3].length;
        if (aioPermissions) return aioPermissions;

        const player = moona.client.manager.players.get(moona.guildId);

        if (moona.command.isPlayer && !player) {
            moona.reply({ content: moona.client.i18n.get(moona.language, "noplayer", "no_player"), ephemeral: true });
            return false;
        }

        const voiceChannel = moona.member.voice.channel;

        if (Permissions.Player.includes("InVoiceChannel") && !voiceChannel) {
            moona.reply({ content: moona.client.i18n.get(moona.language, "noplayer", "no_voice"), ephemeral: true });
            return false;
        }

        if (Permissions.Player.includes("InSameVoiceChannel") && moona.guild.members.me.voice.channel) {
            if (moona.guild.members.me.voice.channel.id !== voiceChannel.id) {
                moona.reply({ content: moona.client.i18n.get(moona.language, "noplayer", "no_same_voice"), ephemeral: true });
                return false;
            }
        }

        if (!moona.guild.members.me.permissionsIn(voiceChannel).has(Permissions.Channel || [])) {
            moona.reply({ content: moona.client.i18n.get(moona.language, "interaction", moona.guild.members.me.permissions.has(Permissions.Channel) ? "voice_perms" : "bot_perms", { perms: Permissions.Channel.join(", "), channel: VoiceChannel.name }), ephemeral: true });
            return false;
        }

        /*//check user premium
        if (moona.command.isPremium) {
            return moona.reply({ content: `${moona.client.i18n.get(moona.language, "nopremium", "premium_desc")}`, ephemeral: true });
        }*/

        if (!moona.guild.members.me.permissions.has(Permissions.Client || [])) {
            moona.reply({ content: moona.client.i18n.get(moona.language, "interaction", "bot_perms", { perms: Permissions.Client.join(", ") }), ephemeral: true });
            return false;
        }

        if (!moona.member.permissions.has(Permissions.User || [])) {
            moona.reply({ content: moona.client.i18n.get(moona.language, "interaction", "user_perms", { perms: Permissions.User.join(", ") }), ephemeral: true });
            return false;
        }

        return true;
    }
    toJSON() {
        return {
            options: this.options,
            name: this.name,
            name_localizations: this.name_localizations,
            description: this.description,
            description_localizations: this.description_localizations,
            default_permission: this.default_permission,
            default_member_permissions: this.default_member_permissions,
            dm_permission: this.dm_permission,
            nsfw: this.nsfw,
        };
    }
}

module.exports = MoonaCommand;