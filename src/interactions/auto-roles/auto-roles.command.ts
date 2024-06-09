import {
  ISlashCommandStructure,
  SlashCommandStructure,
} from "@common/structure/command.structure";
import { rolesSettings } from "@configs/settings";
import {
  ActionRowBuilder,
  EmbedBuilder,
  Message,
  StringSelectMenuBuilder,
} from "discord.js";

export class AutoRoleCommand
  extends SlashCommandStructure
  implements ISlashCommandStructure
{
  name = "roles";
  isSlash: boolean = false;

  async execute(message: Message) {
    if (!message.member?.permissions.has(8n)) {
      return
    }
    const embed = new EmbedBuilder()
      .setTitle("Пинг-роли")
      .setColor(0x2c2f33);
    const args = message.content.split(" ");
    const channelFromGuild = message.guild?.channels.cache.get(args[1]);
    if (!channelFromGuild) {
      return await message.reply({
        embeds: [embed.setDescription(`Указан неверно айди канала`)],
      });
    }
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId(`autoRoleSelect`)
      .setPlaceholder(`Выберите желаемую роль`);
    for (const role of rolesSettings) {
      const roleFromGuild = message.guild?.roles.cache.get(role.roleId);
      if (!roleFromGuild) {
        continue;
      }
      selectMenu.addOptions({
        label: role.name,
        value: role.roleId,
      });
    }
    await message.reply({
      embeds: [
        embed.setDescription(
          "В данной панели вы можете выбрать пинг-роль, используя меню ниже"
        ),
      ],
      components: [
        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
          selectMenu
        ),
      ],
    });
  }
}
