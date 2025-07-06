const { readdirSync } = require("node:fs");

const files = readdirSync("./structures").filter(s => s !== "index.js");

const Structure = {};

for (const name of files) {
    Structure[name.split(".")[0]] = require(`./${name}`);
};

module.exports = Structure;