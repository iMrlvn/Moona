const { KazagumoPlayer } = require("kazagumo");
const MoonaQueue = require("./MoonaQueue.js");

class MoonaPlayer extends KazagumoPlayer {
    constructor(...KazagumoPlayerOptions) {
        if(typeof KazagumoPlayerOptions[2].extends != "object") KazagumoPlayerOptions[2].extends = {};
        KazagumoPlayerOptions[2].extends.queue = MoonaQueue;
        super(...KazagumoPlayerOptions);
    }
}

module.exports = MoonaPlayer;