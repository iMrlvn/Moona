const chalk = require("chalk");

module.exports = class {
    execute(client, player) {
        console.debug(chalk.black("DEBUG ›"), chalk.gray(`Player destroyed in ${chalk.white(player.guildId)}`));
        player.emit("Ending", player);
    }
}