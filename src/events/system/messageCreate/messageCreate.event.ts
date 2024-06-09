import { EventStructure } from "@common/structure/event.structure";
import { prefix } from "@configs/settings";
import { Events, Message } from "discord.js";

export class MessageCreateEvent extends EventStructure {
  name: string = Events.MessageCreate;

  async execute(message: Message) {
    if (message.author.bot) {
      return;
    }
    if (message.content.startsWith(prefix)) {
      const command = message.content.split(" ")[0];
      const commandFromCache = message.client.commands?.get(
        command.slice(1, command.length)
      );
      if (!commandFromCache || commandFromCache.isSlash) {
        return;
      }
      await commandFromCache.execute(message);
    }
  }
}
