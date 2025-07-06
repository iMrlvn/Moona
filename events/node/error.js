const chalk = require("chalk");

module.exports = class {
    execute(client, name, error) {
        console.error(chalk.red("Lavalink ›"), chalk.redBright(name), error);
    }
}