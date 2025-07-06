const { ButtonBuilder, ButtonStyle } = require("discord.js");

const { default: data } = require("../settings/button.js");

const First = [
    new ButtonBuilder()
        .setCustomId(data.previous.id)
        .setEmoji(data.previous.emoji)
        .setStyle(ButtonStyle[data.previous.style]),
    new ButtonBuilder()
        .setCustomId(data.pause.id)
        .setEmoji(data.pause.emoji)
        .setStyle(ButtonStyle[data.pause.style]),
    new ButtonBuilder()
        .setCustomId(data.stop.id)
        .setEmoji(data.stop.emoji)
        .setStyle(ButtonStyle[data.stop.style]),
    new ButtonBuilder()
        .setCustomId(data.loop.id)
        .setEmoji(data.loop.emoji)
        .setStyle(ButtonStyle[data.loop.style]),
    new ButtonBuilder()
        .setCustomId(data.skip.id)
        .setEmoji(data.skip.emoji)
        .setStyle(ButtonStyle[data.skip.style]),
];

const Second = [
    new ButtonBuilder()
        .setCustomId(data.voldown.id)
        .setEmoji(data.voldown.emoji)
        .setStyle(ButtonStyle[data.voldown.style]),
    new ButtonBuilder()
        .setCustomId(data.queue.id)
        .setEmoji(data.queue.emoji)
        .setStyle(ButtonStyle[data.queue.style]),
    new ButtonBuilder()
        .setCustomId(data.shuffle.id)
        .setEmoji(data.shuffle.emoji)
        .setStyle(ButtonStyle[data.shuffle.style]),   
    new ButtonBuilder()
        .setCustomId(data.clear.id)
        .setEmoji(data.clear.emoji)
        .setStyle(ButtonStyle[data.clear.style]),
    new ButtonBuilder()
        .setCustomId(data.volup.id)
        .setEmoji(data.volup.emoji)
        .setStyle(ButtonStyle[data.volup.style]),   
];

const Third = [
    new ButtonBuilder()
        .setCustomId(data.lyrics.id)
        .setEmoji(data.lyrics.emoji)
        .setLabel(data.lyrics.label)
        .setStyle(ButtonStyle[data.lyrics.style]),
];

module.exports = [First, Second, Third];