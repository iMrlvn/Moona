const { readdirSync } = require("node:fs");
const { resolve } = require("node:path");

const { MoonaCommand } = require("../structures/index.js");

module.exports = async (client) => {
    const folder = resolve("commands");

    readdirSync(folder)
        .filter(d => !d.endsWith(".js"))
        .forEach((directory) => {
            const files = readdirSync(`${folder}/${directory}`);

            for (const file of files) {
                const command = new MoonaCommand(require(`${folder}/${directory}/${file}`));

                client.commands.set(command.name, command);
            }
        });
};