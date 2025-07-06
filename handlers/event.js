const { readdirSync } = require('fs');
const { resolve } = require("node:path");

module.exports = async (client) => {
    const folder = resolve("events");

    readdirSync(folder)
        .filter(d => ["client","guild"].includes(d))
        .forEach((directory) => {
            const events = readdirSync(`./events/${directory}/`).filter(d => d.endsWith('.js'));

            for (const file of events) {
                const event = require(`${resolve(`events/${directory}/${file}`)}`);
                const name = file.split('.')[0];

                client.on(name, event.bind(null, client));
            }
        });
};