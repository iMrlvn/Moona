const { music, page } = require("./emoji.js");

module.exports = {
    default: { 
        // Section 1
        pause: {
            id: "pause",
            label: "Pause",
            emoji: music.pause,
            style: "Secondary"
        },
        previous: {
            id: "previous",
            label: "Previous",
            emoji: music.previous,
            style: "Secondary"
        },
        stop: {
            id: "stop",
            label: "Stop",
            emoji: music.stop,
            style: "Secondary"
        },
        skip: {
            id: "skip",
            label: "Skip",
            emoji: music.skip,
            style: "Secondary"
        },
        loop: {
            id: "loop",
            label: "Loop",
            emoji: music.repeat,
            style: "Secondary"
        },

        // Section 2
        shuffle: {
            id: "shuffle",
            label: "Shuffle",
            emoji: music.shuffle,
            style: "Secondary"
        },
        voldown: {
            id: "voldown",
            label: "Volume -",
            emoji: music.voldown,
            style: "Secondary"
        },
        clear: {
            id: "clear",
            label: "Clear",
            emoji: music.delete,
            style: "Secondary"
        },
        volup: {
            id: "volup",
            label: "Volume +",
            emoji: music.volup,
            style: "Secondary"
        },
        queue: {
            id: "qlist",
            label: "Queue",
            emoji: music.queue,
            style: "Secondary"
        },

        lyrics: {
            id: "lyrics",
            label: "Lyrics",
            emoji: "❔",
            style: "Secondary"
        }
    },

    nowplaying: {
        pause: {
            label: "Pause",
            emoji: music.pause,
            style: "Secondary"
        },
        previous: {
            label: "Previous",
            emoji: music.previous,
            style: "Secondary"
        },
        stop: {
            label: "Stop",
            emoji: music.stop,
            style: "Danger"
        },
        skip: {
            label: "Skip",
            emoji: music.skip,
            style: "Secondary"
        },
        loop: {
            label: "Loop",
            emoji: music.repeat,
            style: "Secondary"
        },
    },

    search: {
        one: {
            label: "", // Set Button Name // Not use set to here " "
            emoji: "1️⃣", // Set Button Emoji
            style: "Secondary" //Primary //Secondary //Success //Danger
        },
        two: {
            label: "",
            emoji: "2️⃣",
            style: "Secondary"
        },
        three: {
            label: "",
            emoji: "3️⃣",
            style: "Secondary"
        },
        four: {
            label: "",
            emoji: "4️⃣",
            style: "Secondary"
        },
        five: {
            label: "",
            emoji: "5️⃣",
            style: "Secondary"
        },
    },

    queue_page: {
        back: {
            label: " ",
            emoji: page.left,
            style: "Secondary"
        },
        next: {
            label: " ",
            emoji: page.right,
            style: "Secondary"
        },
    },

    playlist_page: {
        back: {
            label: " ",
            emoji: page.left,
            style: "Secondary"
        },
        next: {
            label: " ",
            emoji: page.right,
            style: "Secondary"
        }
    },

    song_request_on: {
        pause: {
            label: "Pause", // Set Button Name // Not use set to here " "
            emoji: "⏯", // Set Button Emoji
            style: "Success" //Primary //Secondary //Success //Danger
        },
        previous: {
            label: "Previous",
            emoji: "⬅",
            style: "Primary"
        },
        stop: {
            label: "Stop",
            emoji: "✖",
            style: "Danger"
        },
        skip: {
            label: "Skip",
            emoji: "➡",
            style: "Primary"
        },
        loop: {
            label: "Loop",
            emoji: "🔁",
            style: "Success"
        }
    },

    song_request_off: {
        pause: {
            label: "Pause", // Set Button Name // Not use set to here " "
            emoji: "⏯", // Set Button Emoji
            style: "Secondary" //Primary //Secondary //Success //Danger
        },
        previous: {
            label: "Previous",
            emoji: "⬅",
            style: "Secondary"
        },
        stop: {
            label: "Stop",
            emoji: "✖",
            style: "Secondary"
        },
        skip: {
            label: "Skip",
            emoji: "➡",
            style: "Secondary"
        },
        loop: {
            label: "Loop",
            emoji: "🔁",
            style: "Secondary"
        }
    },

    pages: {
        back: {
            label: "Back",
            emoji: page.left,
            style: "Secondary"
        },
        next: {
            label: "Next",
            emoji: page.right,
            style: "Secondary"
        },
        remove: {
            label: "Remove",
            emoji: page.remove,
            style: "Danger"
        }
    },
}