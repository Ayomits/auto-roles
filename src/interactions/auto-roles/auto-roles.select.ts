import {
  ComponentStructure,
  IComponentStructure,
} from "@common/structure/component.structure";
import { EmbedBuilder } from "@discordjs/builders";
import { GuildMember, StringSelectMenuInteraction } from "discord.js";

export class AutoRolesSelectMenu
  extends ComponentStructure
  implements IComponentStructure
{
  customId: any = "autoRoleSelect";

  async execute(interaction: StringSelectMenuInteraction) {
    await interaction.deferReply({ ephemeral: true });
    const value = interaction.values[0];
    const embed = new EmbedBuilder()
      .setTitle(`Пинг-роли`)
      .setColor(0x2c2f33)
      .setThumbnail(interaction.user.displayAvatarURL());
    const member = interaction.member as GuildMember;
    let type: string;
    if (member?.roles.cache.some((role) => role.id === value)) {
      await member?.roles.remove(value);
      type = "сняли";
    } else {
      type = "надели";
      await member.roles.add(value);
    }
    return await interaction.followUp({
      embeds: [
        embed.setDescription(`Вы **успешно** ${type} роль <@&${value}>`),
      ],
    });
  }
}
