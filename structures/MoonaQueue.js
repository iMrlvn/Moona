const { KazagumoQueue } = require("kazagumo");

class MoonaQueue extends KazagumoQueue {
    constructor(...KazagumoPlayer) {
        super(...KazagumoPlayer);
    }
}

module.exports = MoonaQueue;