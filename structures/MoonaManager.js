const { Connectors } = require("shoukaku");
const { Kazagumo, Plugins: KazagumoPlugins } = require("kazagumo");

const Plugins = {
    Apple: require("kazagumo-apple"),
    Deezer: require("kazagumo-deezer"),
    Filter: require("kazagumo-filter"),
    Spotify: require("kazagumo-spotify"),
    PlayerMoved: KazagumoPlugins.PlayerMoved,
};

const MoonaPlayer = require("./MoonaPlayer.js");

const { readdirSync } = require("node:fs");
const { resolve } = require("node:path");

class MoonaManager extends Kazagumo {
    constructor(client) {
        super({
            defaultSearchEngine: "youtube",
            defaultYoutubeThumbnail: "maxresdefault",
            extends: {
                player: MoonaPlayer,
            },
            plugins: [
                new Plugins.Apple(),
                new Plugins.Deezer(),
                new Plugins.Filter(),
                new Plugins.Spotify({
                    clientId: process.env.SpotifyId,
                    clientSecret: process.env.SpotifySecret
                }),
                new Plugins.PlayerMoved(client),
            ],
            send: (guildId, payload) => {
                const guild = client.guilds.cache.get(guildId);
                if (guild) guild.shard.send(payload);
            }
        },
        new Connectors.DiscordJS(client),
        client.config.Nodes,
        {
            reconnectInterval: 1,
            reconnectTries: Infinity,
            resume: true,
            resumeTimeout: 1,
        });

        this.client = client;

        for (const name of readdirSync("./events/node")) {
            const classEvents = require(`${resolve(`events/node/${name}`)}`);
            const events = new classEvents();
            this.shoukaku.on(name.split(".")[0], events.execute.bind(null, client));
        }
    }
    async search(query, options={}) {
        if (!options.engine) options.engine = this.client.config.DefaultSource;
        return super.search(query, options);
    }
};

module.exports = MoonaManager;