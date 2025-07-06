const { readdirSync } = require("node:fs");
const { resolve } = require("node:path");

const { GlobalFonts } = require("@napi-rs/canvas");

module.exports = async (client) => {
    for (const name of readdirSync('./assets/fonts')) {
        GlobalFonts.registerFromPath(resolve(`assets/fonts/${name}`), (name.split('.')[0]));
    }
};