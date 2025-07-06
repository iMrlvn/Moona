const { readdirSync } = require("node:fs");

const chalk = require("chalk");

module.exports = function(client) {
    const directories = readdirSync("./handlers");
    const files = directories.filter(file => file.endsWith(".js") && file !== "index.js");
    const folders = directories.filter(folder => !folder.endsWith(".js"));

    console.info(chalk.yellow("Loading Handlers ›", chalk.yellowBright("Start...")));
    try {
        files.forEach(f => {
            require(`./${f}`)(client);
            console.info(chalk.blue("Handlers ›"), chalk.blueBright(`${f}`));
        });
        for (const fd of folders) {
            readdirSync(`./handlers/${fd}`)
                .forEach(
                    f => {
                        require(`./${fd}/${f}`)(client);
                        console.info(chalk.blue("Handlers ›"), chalk.blueBright(`${fd}/${f}`));
                    }
                );
        }
    }
    catch(error) {
        console.error(chalk.red("Loading Handlers ›"), error);
    }
    console.info(chalk.green("Loading Handlers >"), chalk.greenBright("Done."));
};