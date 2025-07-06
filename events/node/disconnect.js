const chalk = require("chalk");

module.exports = class {
    execute(client, name, players, moved) {
        if (moved) return;
            players.map(player => player.connection.disconnect())
            console.warn(chalk.yellow("Lavalink ›"), chalk.yellowBright(name), "Disconnected");
    }
}