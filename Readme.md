# Шаблон от Ayomi : )

За вас сделано большинство рутины связанной с сбором команд, компонентов и т.п. Вам остаётся лишь понять как это работает <br>

# Объясняю:
Руководство по этой структуре разделяется на 2 блока
1) Работа с файлами
2) Личные рекомендации по использованию

# Работа с файлами

Итак, перед вами структура проекта:

- **common**: Здесь хранятся общие функции или классы, которые могут быть переиспользованы в различных частях проекта.
  
- **configs**: В этой папке содержатся конфигурационные файлы, такие как константы с ID каналов и другими настройками.

- **events**: Здесь расположены обработчики событий вашего бота. Например, `onReady`, который запускается при старте бота.

- **interactions**: Эта папка содержит команды и другие элементы, которые обрабатываются в событии `onInteractionCreate`.

- **migrations**: В этой папке хранятся файлы для управления состоянием базы данных, если используется MongoDB или другая СУБД.

- **models**: Здесь находятся модели и схемы для работы с базой данных, например, с помощью Mongoose.

- **base.d.ts**: Файл с объявлениями типов, который помогает при разработке, улучшая поддержку TypeScript.

- **constants.ts**: Файл с константами, используемыми в проекте, такими как пути к файлам или ключи доступа к API.

- **index.ts**: Основной файл, который может содержать код для запуска вашего бота или других основных операций.

<img src="https://i.imgur.com/6EyoLKe.png">

## Создание команды

Чтобы создать новую команду, следуйте этим шагам:

1. Перейдите в папку `interactions`.
2. Создайте новую папку с названием вашей команды.
3. Внутри этой папки создайте два файла: `{Название команды}.command.ts` и `{Название команды}.service.ts`.
4. Реализуйте логику вашей команды в соответствующих файлах.

Пример структуры вашей команды:

interactions/
myCommand/
myCommand.command.ts
myCommand.service.ts

```ts
import {
  SlashCommandBuilder,
  CommandInteraction,
} from "discord.js";
import { SlashCommandStructure, ISlashCommandStructure } from "@structures/command.structure";
import { PingService } from "./ping.service";
import { UseGuard } from "@decorators/permissions.decorator";
import { PingPermission } from "@configs/real/permissions.config";

/**
 * ЗДЕСЬ МОЖЕТ БЫТЬ СКОЛЬКО УГОДНО КОМАНД
 */

/**
 * ВАЖНО, ДОЛЖЕН БЫТЬ ИМЕННО ТАКОЙ ПОРЯДОК 
 * EXTENDS ОТ КЛАССА SlashCommandStructure И IMPLEMENTS (опциально, только для удобства) ОТ ИНТЕРФЕЙСА ISlashCommandStructure
 */

export class Ping extends SlashCommandStructure implements ISlashCommandStructure {
  data: SlashCommandBuilder;

  constructor() {
    super();
    this.data = new SlashCommandBuilder()
      .setName("ping")
      .setDescription("Пинг бота");
  }

  @UseGuard(PingPermission)
  async execute(interaction: CommandInteraction) {
    const pingService = new PingService(interaction); 

    return pingService.generateEmbed(); 
  }
}

/**
 * Вот пример
 * Это запустится и зарегистрируется!
 */
export class Ping2 extends SlashCommandStructure implements ISlashCommandStructure {
  data: SlashCommandBuilder;

  constructor() {
    super();
    this.data = new SlashCommandBuilder()
      .setName("ping2")
      .setDescription("Пинг бота");
  }

  @UseGuard(PingPermission)
  async execute(interaction: CommandInteraction) {
    const pingService = new PingService(interaction); 

    return pingService.generateEmbed(); 
  }
}
```

Все сервисы выглядят примерно так:


```ts
import {
  CommandInteraction,
  EmbedBuilder,
  InteractionResponse,
} from "discord.js";
import mongoose from "mongoose";
import { defaultColours } from "@constants";

// Example Service for commands

export class PingService {
  readonly interaction: CommandInteraction;

  constructor(interaction: CommandInteraction) {
    this.interaction = interaction;
  }

  async generateEmbed(): Promise<InteractionResponse> {
    const embed = new EmbedBuilder()
      .setTitle("Проверка задержки бота")
      .setColor(defaultColours.baseEmbed)
      .addFields(
        {
          name: "Задержка сообщений",
          value: `> ${String(this.calculateMessagePing())}ms`,
          inline: true,
        },
        {
          name: "Задержка вебсокета",
          value: `> ${this.interaction.client.ws.ping}`,
          inline: true,
        },
        {
          name: "Задержка базы данных",
          value: `${await this.calculateDbPing()}ms`,
          inline: true,
        }
      );
    return await this.interaction.reply({ embeds: [embed] });
  }

  private calculateMessagePing(): number {
    return Math.floor((Date.now() - this.interaction.createdTimestamp) / 1000);
  }

  private async calculateDbPing(): Promise<number> {
    const start = Date.now();
    await mongoose.connect(
      process.env.DB_URI || "mongodb://127.0.0.1:27017/",
      {}
    );
    return Math.floor((Date.now() - start) / 1000);
  }
}

```


#   a u t o - r o l e s  
 #   a u t o - r o l e s  
 #   a u t o - r o l e s  
 