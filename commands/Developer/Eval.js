const { MoonaCommand } = require("../../structures/index.js");
const { ApplicationCommandOptionType, EmbedBuilder, Colors } = require("discord.js");
const { inspect } = require("node:util");

const djs = require("discord.js");
const util = require("node:util");

module.exports = new MoonaCommand({
    name: ["eval"],
    description: "Programming code evaluation",
    options: [{
        name: "code",
        description: "Program code value",
        required: true,
        type: ApplicationCommandOptionType.String,
    }],
    category: "Developer",
    private: true,
    async execute(ci) {
    await ci.deferReply();

    let code = ci.args.join(" ");
    if (!code) code = 'null';

    const embed = new EmbedBuilder().setColor(Colors.Blue);

    try {
        const evaled = await eval(code);

        embed.setTitle("Response[Code]")
        embed.setDescription(`\`\`\`js\n${clean(evaled)}\`\`\``);

        await ci.editReply({ content: null, embeds: [embed] });
    }
    catch(error) {
        embed.setColor(Colors.Red);
        embed.setTitle("Response[ERROR]")
        embed.setDescription(`\`\`\`js\n${clean(error)}\`\`\``);

        await ci.editReply({ content: null, embeds: [embed] })
    }
    }
})

function clean(code) {
    if  (typeof code === "string") {
        return code
        .replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203));
    }
    else {
        return inspect(code, { depth: 0 });
    }
};