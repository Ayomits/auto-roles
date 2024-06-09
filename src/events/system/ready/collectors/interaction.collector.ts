import { Client } from "discord.js";
import { glob } from "glob";
import * as path from "path";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
/** @ts-ignore */
import kleur from "kleur";
import { rootDir } from "@constants";
import { SlashCommandStructure } from "@structures/command.structure";
import { ComponentStructure } from "@structures/component.structure";

export default class InteractionCollector {
  readonly client: Client;

  constructor(client: Client) {
    this.client = client;
    this.collect();
  }

  public async collect() {
    const currentDir = path.basename(rootDir);
    const pattern = `${currentDir}/**/*.{command,button,select,modal}.{js,ts}`;
    const files = await glob(pattern, {});

    await Promise.all(
      files.map(async (file) => {
        if (file.includes(`command`)) {
          const relativePath = path.relative(__dirname, file);
          const modulePath = `./${relativePath.slice(0, -3)}`;
          const command = await import(modulePath);
          Object.values(command).forEach((commandClass: any) => {
            if (
              typeof commandClass === "function" &&
              commandClass.prototype instanceof SlashCommandStructure
            ) {
              const commandInstance = new commandClass();
              const date = new Date();
              console.log(
                kleur.green(`[${process.env.INSCRIPTION}] -`),
                kleur.yellow(
                  `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
                ),
                kleur.green(`-`),
                kleur.green(
                  `[${commandInstance?.data?.name?.toUpperCase() || commandInstance.name.toUpperCase()}]`
                ),
                `команда успешно подгружена`
              );
              this.client.commands?.set(
                commandInstance?.data?.name || commandInstance?.name,
                commandInstance
              );
            }
          });
        }
        if (
          file.includes("button") ||
          file.includes("select") ||
          file.includes("modal")
        ) {
          const relativePath = path.relative(__dirname, file);
          const modulePath = `./${relativePath.slice(0, -3)}`;
          const component = await import(modulePath);
          Object.values(component).forEach((componentClass: any) => {
            if (
              typeof componentClass === "function" &&
              componentClass.prototype instanceof ComponentStructure
            ) {
              const componentInstance = new componentClass();
              this.client.buttons?.set(
                componentInstance.customId,
                componentInstance
              );
            }
          });
        }
      })
    );
  }
}
