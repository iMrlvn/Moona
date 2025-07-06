const { model, Schema } = require("mongoose");
const { Collection } = require("discord.js");

const Moona = new Schema({
    playedHistory: Array,
    donator: Array,
    voter: Array,
});

module.exports = model("moona", Moona);