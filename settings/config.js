const { resolve } = require("node:path");

module.exports = {
    Prefix: "m",
    ServerLink: "https://discord.gg/Moona",
    Color: process.env.Color || "#9F69FF", //<= default is "#000001"

    SearchDefault: ["Alan Walker", "Aespa", "Adele"],

    OwnerId: process.env.OwnerId || "561170896480501790", //your owner discord id example: "515490955801919488"

    NpRealTime: process.env.NpRealTime || "false", // "true" = realtime, "false" = not realtime :3 // WARNING: on set to "true" = laggy and bot will ratelimit if you have a lot of servers
    LeaveTimeout: parseInt(process.env.LeaveTimeout || "180000"), // leave timeout default "120000" = 2 minutes // 1000 = 1 seconds

    Language: {
      defaultLocale: process.env.Language || "en", // "en" = default language
      directory: resolve("languages"), // <= location of language
    },

    Developer: ["561170896480501790"], // if you want to use command bot only, you can put your id here example: ["123456789", "123456789"]

    MongoUri: process.env.MongoUri || "", // your mongo uri
    TrackLimit: parseInt(process.env.TrackLimit || "25"),  //<= dafault is "50" // limit track in playlist
    PlaylistLimit: parseInt(process.env.PlaylistLimit || "20"), //<= default is "10" // limit can create playlist per user

    DefaultSource: "spotify", // default search engine & "ytmsearch" / "ytsearch" / "scsearch" / "spsearch"
    Nodes: [
      { 
        name: "L1",
        url: "lavalink4.alfari.id:443",
        auth: "catfein",
        secure: true,
      } 
    ],
}
