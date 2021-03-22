import {
  Client,
  Structures,
  ApplicationCommand,
  InteractionClient,
} from "discord.js";
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

      this.interactionClient = new InteractionClient(options)

      this.loadExtensions(Path.join(__dirname, "Extensions"));
      this.loadReactions(Path.join(__dirname, "Reactions"));
      this.loadCommands(Path.join(__dirname, "Commands"));
      this.loadEvents(Path.join(__dirname, "Events"));
    } catch (error) {
      Logger.fatal(Object.assign(error, { pid: process.pid }));
    }
  }

  loadExtensions(path) {
    Logger.debug("client:loadExtensions", { path });
    if (!Fs.existsSync(path) || !Fs.statSync(path).isDirectory)
      throw new Error(`${path} doesn't exist or isn't a directory!`);

    try {
      const files = Fs.readdirSync(path);
      for (const file of files) {
        const { Extension } = require(Path.join(path, file));
        let name = file.split(".")[0];

        Logger.info("client:loadExtensions", { name });
        Structures.extend(name, () => Extension);
      }
    } catch (error) {
      Logger.fatal(Object.assign(error, { pid: process.pid }));
    }
  }

  loadEvents(path) {
    Logger.debug("client:loadEvents", { path });
    if (!Fs.existsSync(path) || !Fs.statSync(path).isDirectory)
      throw new Error(`${path} doesn't exist or isn't a directory!`);

    try {
      const files = Fs.readdirSync(path);
      for (const file of files) {
        let { run } = require(Path.join(path, file));
        let name = file.split(".")[0];

        Logger.info("client:loadEvents", { name });
        this.on(name, (...args) => run(this, ...args));
      }
    } catch (error) {
      Logger.fatal(Object.assign(error, { pid: process.pid }));
    }
  }

  loadReactions(path) {
    Logger.debug("client:loadReactions", { path });
    if (!Fs.existsSync(path) || !Fs.statSync(path).isDirectory)
      throw new Error(`${path} doesn't exist or isn't a directory!`);

    try {
      const directories = Fs.readdirSync(path);
      for (const directory of directories) {
        if (!Fs.existsSync(Path.join(path, directory))) continue;
        let { emojis, run } = require(Path.join(path, directory, "index"));

        Logger.info("client:loadReactions", { emojis });
        for (const emoji of emojis) {
          this.on(`messageReactionAdd.${emoji}`, (...args) => {
            run(this, ...args);
          });
        }
      }
    } catch (error) {
      Logger.fatal(Object.assign(error, { pid: process.pid }));
    }
  }

  async loadCommands(path) {
    Logger.debug("client:loadCommands", { path });
    if (!Fs.existsSync(path) || !Fs.statSync(path).isDirectory)
      throw new Error(`${path} doesn't exist or isn't a directory!`);

    try {      
      const commands = [] // await this.interactionClient.fetchCommands();
      const directories = Fs.readdirSync(path);
      for (const directory of directories) {
        if (!Fs.existsSync(Path.join(path, directory, "index.js"))) continue;
        let name = directory;
        let registerdCommand = commands.find(
          (command) => command.name === name
        );
        let { run, description, options } = require(Path.join(path, directory));
        if (!registerdCommand) {
          /* await this.interactionClient.createCommand(
            new ApplicationCommand(this.interactionClient, {
              name,
              description,
              options,
            })
          ); */
        } else {
          if (
            registerdCommand.description != description ||
            registerdCommand.options != options
          ) {
            // await registerdCommand.edit({ name, description, options });
          }
        }

        Logger.info("client:loadCommands", { name });
        this.on(`command.${name}`, (...args) => run(this, ...args));
      }

      for (const command of commands) {
        if (directories.indexOf(command.name) === -1) {
          // await command.delete();
        }
      }
    } catch (error) {
      Logger.fatal(Object.assign(error, { pid: process.pid }));
    }
  }
}
