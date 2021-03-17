import { Client, Structures } from "discord.js";
import mongoose from 'mongoose'
import interactions from "discord-slash-commands-client";
import Path from "path";
import Fs from "fs";

import Logger from "./Libraries/Logger";

export default class extends Client {
  constructor(options) {
    Logger.debug("client:constructor", { options });
    super(options);

    try {
      this.on("debug", (...args) => Logger.debug("client", args));
      this.on("warn", (...args) => Logger.warn("client", args));
      this.on("error", (...args) => Logger.error("client:constructor", args));

      mongoose.createConnection(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
      });

      this.loadExtensions(Path.join(__dirname, "Extensions"));
      this.loadReactions(Path.join(__dirname, "Reactions"));
      this.loadCommands(Path.join(__dirname, "Commands"));
      this.loadEvents(Path.join(__dirname, "Events"));

      this.interactions = new interactions.Client(
        process.env.DISCORD_TOKEN,
        process.env.DISCORD_USERID
      );
    } catch (error) {
      Logger.fatal(error)
    }
  }

  loadExtensions(path) {
    Logger.debug("client:loadExtensions", { path });
    if (!Fs.existsSync(path) || !Fs.statSync(path).isDirectory)
      throw new Error(`${path} doesn't exist or isn't a directory!`);

    try {
      const files = Fs.readdirSync(path);
      for (const file of files) {
        let extension = require(Path.join(path, file));
        let name = file.split(".")[0];

        Structures.extend(name, () => extension);
      }
    } catch (error) {
      Logger.fatal(error)
    }
  }

  loadEvents(path) {
    Logger.debug("client:loadEvents", { path });
    if (!Fs.existsSync(path) || !Fs.statSync(path).isDirectory)
      throw new Error(`${path} doesn't exist or isn't a directory!`);

    try {
      const files = Fs.readdirSync(path);
      for (const file of files) {
        let event = require(Path.join(path, file));
        let name = file.split(".")[0];

        this.on(name, (...args) => event.run(this, ...args));
      }
    } catch (error) {
      Logger.fatal(error)
    }
  }

  loadReactions(path) {
    Logger.debug("client:loadReactions", { path });
    if (!Fs.existsSync(path) || !Fs.statSync(path).isDirectory)
      throw new Error(`${path} doesn't exist or isn't a directory!`);

    try {
      const files = Fs.readdirSync(path);
      for (const file of files) {
        let reaction,
          { emojis } = require(Path.join(oath, file));

        for (const emoji of emojis) {
          client.on(`messageReactionAdd.${emoji}`, (...args) => {
            reaction.run(client, ...args);
          });
        }
      }
    } catch (error) {
      Logger.fatal(error)
    }
  }

  loadCommands(path) {
    Logger.debug("client:loadCommands", { path });
    if (!Fs.existsSync(path) || !Fs.statSync(path).isDirectory)
      throw new Error(`${path} doesn't exist or isn't a directory!`);
   
    try {
      const files = Fs.readdirSync(path);
      client.interactions
        .getCommands()
        .then((commands) => {
          for (const file of files) {
            let name = file.split(".")[0];
            let registerdCommand = commands.filter((command) => command.name);
            let command,
              { description, options } = require(Path.join(path, file));
            if (!registerdCommand) {
              client.interactions
                .createCommand({ name, description, options })
                .catch(error, Logger.error("client:loadCommands", { error }));
            } else {
              if (
                registerdCommand.description != description ||
                registerdCommand.options != options
              ) {
                client.interactions
                  .editCommand({ description, options }, registerdCommand.id)
                  .catch(error, Logger.error("client:loadCommands", { error }));
              }
            }
  
            this.on(name, (...args) => command(this, ...args));
          }
  
          for (const command of commands) {
            const names = files.map((file) => file.replace(".js", ""));
            if (names.indexOf(command.name) === -1) {
              client.interactions
                .deleteCommand(command.id)
                .catch(error, Logger.error("client:loadCommands", { error }));
            }
          }
        })
        .catch(error, Logger.error("client:loadCommands", { error }));
    } catch (error) {
      Logger.fatal(error)
    }
  }
}
