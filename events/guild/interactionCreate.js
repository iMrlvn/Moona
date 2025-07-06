const { PermissionsBitField, InteractionType } = require("discord.js");
const Playlist = require("../../schema/Playlist.js");
const chalk = require('chalk');

const { MoonaInterface } = require("../../structures/index.js");

module.exports = async(client, interaction) => {
    if (interaction.isCommand || interaction.isContextMenuCommand || interaction.isModalSubmit || interaction.isChatInputCommand) {
        if (!interaction.guild || interaction.user.bot) return;

        const language = client.db.language.get(interaction.guild.id);

        if (interaction.type == InteractionType.ApplicationCommandAutocomplete) {

            client.commands.forEach(async command => {
                if (command.autoComplete) return await command.autoComplete(interaction);
            });
            return;
          /*if (interaction.options.getSubcommand() == "add") { 
              const playlists = await Playlist.find({ owner: interaction.user.id });
              let choice = []
              playlists.forEach(x => { choice.push({ name: x.name, value: x.name }) })
              return await interaction.respond(choice).catch(() => { });
          } else if (interaction.options.getSubcommand() == "delete") {
              const playlists = await Playlist.find({ owner: interaction.user.id });
              let choice = []
              playlists.forEach(x => { choice.push({ name: x.name, value: x.name }) })
              return await interaction.respond(choice).catch(() => { });
          } else if (interaction.options.getSubcommand() == "detail") {
              const playlists = await Playlist.find({ owner: interaction.user.id });
              let choice = []
              playlists.forEach(x => { choice.push({ name: x.name, value: x.name }) })
              return await interaction.respond(choice).catch(() => { });
          } else if (interaction.options.getSubcommand() == "import") {
              const playlists = await Playlist.find({ owner: interaction.user.id });
              let choice = []
              playlists.forEach(x => { choice.push({ name: x.name, value: x.name }) })
              return await interaction.respond(choice).catch(() => { });
          } else if (interaction.options.getSubcommand() == "private") {
              const playlists = await Playlist.find({ owner: interaction.user.id });
              let choice = []
              playlists.forEach(x => { choice.push({ name: x.name, value: x.name }) })
              return await interaction.respond(choice).catch(() => { });
          } else if (interaction.options.getSubcommand() == "public") {
              const playlists = await Playlist.find({ owner: interaction.user.id });
              let choice = []
              playlists.forEach(x => { choice.push({ name: x.name, value: x.name }) })
              return await interaction.respond(choice).catch(() => { });
          } else if (interaction.options.getSubcommand() == "savecurrent") {
              const playlists = await Playlist.find({ owner: interaction.user.id });
              let choice = []
              playlists.forEach(x => { choice.push({ name: x.name, value: x.name }) })
              return await interaction.respond(choice).catch(() => { });
          } else if (interaction.options.getSubcommand() == "savequeue") {
              const playlists = await Playlist.find({ owner: interaction.user.id });
              let choice = []
              playlists.forEach(x => { choice.push({ name: x.name, value: x.name }) })
              return await interaction.respond(choice).catch(() => { });
          } else if (interaction.commandName == "playlist") {
              if (interaction.options.getSubcommand() == "remove") {
                  const playlists = await Playlist.find({ owner: interaction.user.id });
                  let choice = []
                  playlists.forEach(x => { choice.push({ name: x.name, value: x.name }) })
                  return await interaction.respond(choice).catch(() => { });
              }
          }*/
      }

      try {
          new MoonaInterface({
            client,
            interaction,
            language,
            prefix: client.config.Prefix
          });
      } catch (error) {
          console.info(error);
      }

  }
}