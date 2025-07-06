const chalk = require("chalk");

module.exports = class {
    execute(client, name, code, reason) {
        console.warn(chalk.red("Lavalink ›"), chalk.redBright(name), `${chalk.yellow(code+":")} ${chalk.yellowBright(code)}`, reason || "No Reason");
    }
}