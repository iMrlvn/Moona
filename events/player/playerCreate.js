const chalk = require("chalk");

module.exports = class {
    execute(client, player) {
        console.debug(chalk.black("DEBUG ›"), chalk.gray(`Player created in ${chalk.white(player.guildId)}`))
    }
}