const { ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder, Colors } = require("discord.js");
const { readdirSync } = require("node:fs");

const Chunk = require("../../utils/Chunk.js");
const categoryConfig = require("../../commands/config.js");

const { help: helpEmoji } = require("../../settings/emoji.js");

module.exports = {
    name: ["help"],
    description: "Displays a list of commands and info commands each category",
    category: "Information",
    options: [{
        name: "commands",
        description: "Enter the name of a specific commands",
        type: ApplicationCommandOptionType.String
    }],
    async execute(ci) {
    await ci.deferReply({ fecthReply: true });
    const query = ci.args.join(" ");

    const buttons = [];

    const embed = new EmbedBuilder()
       .setColor(ci.client.color)
       .setTitle(ci.client.i18n.get(ci.language, "utilities", "help_title", { bot: ci.client.user?.username }))
       .setDescription(`${ci.client.i18n.get(ci.language, "utilities", "help_desc", { prefix: "/", serverLink: ci.config.ServerLink, })}`);

    if (!query) {
        embed.setFooter({ text: `${ci.client.i18n.get(ci.language, "utilities", "help_footer")}` });

        createButtons(buttons);
        createEmbedFields(embed, ci);

        const components = [];
        for (const _buttons of Chunk(buttons, 5)) {
            components.push(
                new ActionRowBuilder().addComponents(..._buttons)
            );
        };

        ci.editReply({ embeds: [embed], components, fetchReply: true });

        buttonInterface(ci, await ci.fetchReply(), { buttons, components, embed });
        return;
    }
    else {
        const command = ci.client.commands.find(c => c.name.join("-") === query);
        if (!command) {
        embed.setColor(Colors.Red)
        embed.setDescription(ci.client.i18n.get(ci.language, "utilities", "help_not_found", { query }));
        ci.editReply({ embeds: [embed], ephemeral: true });
        return;
        }
        const ctg = categoryConfig[command.category];
        embed.setAuthor({ name: command.category })
        .setTitle(command.name.join("-"))
        .setDescription(command.description)
        //.setFooter({ text: `Cooldown ${cdTime(command.cooldown || 3000)}` });

        ci.editReply({ embeds: [embed], ephemeral: true });
        return;
    }
}
};

function createButtons(buttons) {
    const categories = readdirSync("./commands").filter(c => !c?.endsWith(".js")).filter(c => !categoryConfig[c]?.private);

    for (const category of categories) {
        buttons.push(
            new ButtonBuilder()
            .setCustomId(category)
            //.setLabel(category)
            .setEmoji(helpEmoji[category.toLowerCase()])
            .setStyle(ButtonStyle.Primary)
        );
    }
    return buttons;
}

function createEmbedFields(embed, ci) {
    const categories = readdirSync("./commands").filter(c => !c?.endsWith(".js")).filter(c => !categoryConfig[c]?.private);

    for (const category of categories) {
        const commands = ci.client.commands.filter(command => command.category === category);
        const ctg = categoryConfig[category];

        embed.addFields({
            name: `${helpEmoji[category.toLowerCase()]} ${ctg.name}`,
            value: commands.map(c => `\`${c.name.join("-")}\``).join(", ")
        });
    }
    return embed;
}

async function buttonInterface(ci, message, first) {
    const timeout = 1000 * 60 * 5;
    const filter = i => i.isButton() && i.user && i.message.author.id == ci.client.user.id;
    const collector = await message.createMessageComponentCollector({ 
        filter,
        time: timeout,
    });

    var buttons = [
        new ButtonBuilder()
            .setCustomId("minimize")
            //.setLabel(ci.client.i18n.get(ci.language, "utilities", "help_button_home"))
            .setEmoji(helpEmoji["minimize"])
            .setStyle(ButtonStyle.Secondary),
        ...first.buttons,
    ];

    collector.on("collect", async i => {
    if (!i.deferred) await i.deferUpdate();
    buttons = buttons.map(button => button.setDisabled(false));

    if (i.customId === "minimize") {
        await i.editReply({ embeds: [first.embed], components: first.components });
        return;
    }

    const commands = ci.client.commands.filter(command => command.category === i.customId);
    const ctg = categoryConfig[i.customId];

    const embed = new EmbedBuilder()
        .setColor(ci.client.color)
        .setTitle(`${helpEmoji[i.customId.toLowerCase()]} ${ctg.name}`)
        .setDescription(ctg.description+"\n\n"+
        commands.map(c => `\`${c.name.join("-")}\` : ${c.description}.`).join("\n")
        )
        .setFooter({ text: `${ci.client.i18n.get(ci.client.language, "utilities", "help_available", { size: commands.size })}` });

    buttons = buttons.map(button => {
        if (button.data.custom_id === i.customId) button.setDisabled(true);
        return button;
    });

    const components = [];
    for (const _buttons of Chunk(buttons, 5)) {
        components.push(
            new ActionRowBuilder().addComponents(..._buttons)
        );
    }

    if (i) {
        await i.editReply({ embeds: [embed], components }).catch(console.error);
        collector.resetTimer();
    } else {
        collector.stop();
    }
    });

    collector.on("end", async() => {
    if (!message) return;

    const buttons = first.buttons.map(button => button.setStyle(ButtonStyle.Secondary).setDisabled(true));

    const components = [];
    for (const _buttons of Chunk(buttons, 5)) {
        components.push(
            new ActionRowBuilder().addComponents(..._buttons)
        );
    };

    message.edit({ embeds: [first.embed.setFooter({ text: `${ci.client.i18n.get(ci.language, "utilities", "help_timeout")}` })], components }).catch(console.error);
    });
}

function cdTime(ms) {
    let tipe;
    if (ms<1000*60) tipe = "seconds";
    if (ms>1000*60) tipe = "minutes";
    switch(tipe) {
        case "seconds": {
            return Math.round(ms/1000) + ' seconds';
        }
        case "minutes": {
            return Math.round(ms/1000) + ' minutes';
        }
    }
}
