const { model, Schema } = require("mongoose");

const User = new Schema({
    id: String,
    suspended: {
        type: Boolean,
        default: false
    },
    suspend: {
        type: Object,
        default: {
            duration: 0,
            since: 0,
            reason: null,
        }
    },
    playedCount: Number,
    playedDuration: Number,
    playedHistory: Array,
});

module.exports = model("user", User);