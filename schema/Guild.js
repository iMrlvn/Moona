const { model, Schema } = require("mongoose");

const Guild = new Schema({
    id: String,
    suspended: {
        type: Boolean,
        default: false,
    },
    suspend: {
        type: Object,
        default: {
            duration: 0,
            since: 0,
            reason: null,
        }
    },
    language: {
        type: String,
        default: "en",
    },
    setup: {
        type: Object,
        default: {
            enable: false,
            channelId: null,
            playMessage: null,
            queueMessage: null,
        },
    },
    playedHistory: Array,
});

module.exports = model("guild", Guild);