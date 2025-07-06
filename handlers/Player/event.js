const { readdirSync } = require("fs");

module.exports = async (client) => {
    try {
        readdirSync("./events/player/").forEach(file => {
            const classEvents= require(`../../events/player/${file}`);
            const events = new classEvents();
            let eventName = file.split(".")[0];
            client.manager.on(eventName, events.execute.bind(null, client));
        });
    }
    catch (error) {
        console.error("Player Events ›", error);
    }
};
