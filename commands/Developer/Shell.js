const { MoonaCommand } = require("../../structures/index.js");
const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const { execSync } = require("node:child_process");

module.exports = new MoonaCommand({
    name: ["shell"],
    description: "Running shell command",
    options: [{
        name: "command",
        description: "?",
        type: ApplicationCommandOptionType.String,
        required: true,
    }],
    category: "Developer",
    private: true,
    async execute(ci) {
        await ci.deferReply();
    let command = ci.args.join(" ")
    if (!command) return ci.message.react('❌');

    const embed = new EmbedBuilder().setColor("Green");

    try {
        const _execute = execSync(command);
        embed.setTitle(`$ __${command}__`)
        embed.setDescription(`\`\`\`shell\n${_execute}\`\`\``);

        ci.editReply({ embeds: [embed] });
    }
    catch(error) {
        embed.setColor("Red");
        embed.setDescription(`Cannot running shell commands: $ ${command}\n\`${error.message}\``);

        ci.editReply({ embeds: [embed], ephemeral: true });
    }
    }
})