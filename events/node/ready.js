const chalk = require("chalk");

module.exports = class {
    execute(client, name) {
        console.info(chalk.green("Lavalink ›"), chalk.greenBright(name), "Connected")
    }
}