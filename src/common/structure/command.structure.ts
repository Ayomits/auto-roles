import {
  AutocompleteInteraction,
  CommandInteraction,
  Message,
  SlashCommandBuilder,
} from "discord.js";

/**
 * Этот класс нужен тупо для типов
 */
export class SlashCommandStructure {}

/**
 * Для работы с свойствами
 */
export interface ISlashCommandStructure {
  readonly name?: string
  readonly isSlash: boolean
  readonly data?: SlashCommandBuilder;
  execute(interaction: CommandInteraction | Message): any;
  autoComplete?(interaction: AutocompleteInteraction ): any;
}