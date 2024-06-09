import { Client, Guild, REST, Routes } from "discord.js";
import InteractionCollector from "./collectors/interaction.collector";
import { logger } from "@common/decorators/logFunction.decorator";
import kleur = require("kleur");
import { connectToDb } from "@functions/connectToDb";
// не удивляйся, эт норма
// Example service and how it works

/**
 * Этот класс представляет собой сервис, ответственный за обработку различных событий и действий при старте бота.
 */
export class EventReadyService {
  /* 
    Здесь передаётся клиент и инициализируется класс сборщика команд
  **/
  constructor(
    private readonly client: Client,
    private readonly interactionCollector: InteractionCollector = new InteractionCollector(
      client
    )
  ) {}

  /**
   * Всевозможные действия с командами
   * Этот метод является центральным для сборки и регистрации команд
   * @returns {void}
   */
  @logger(`Действия с командами начаты...`, `Действия с командами закончены`)
  public async commandActions(): Promise<void> {
    await this.collectInteractions();
    await this.commandRegister(this.client);
  }
  @logger(`Начинаю регистрацию команд`, `Закончил регистрацию команд`)
  protected async commandRegister(client: Client) {
    try {
      const rest = new REST().setToken(
        process.env.TOKEN ||
          "MTEyNjk2ODYxMTkxNTk3Njg5NA.GMstbh.pT0jxxoacZaZmCwd3Mf-glqzT-sE_YsKFcPvF0" // старый токен если что, он не рабочий
      );
      const commands = client.commands
        ?.filter((command) => command.isSlash)
        .map((command) => command.data?.toJSON());

      const commandData: any = await rest.put(
        Routes.applicationCommands(client.user?.id || "1126968611915976894"),
        { body: commands }
      );
      const date = new Date();
      console.log(
        kleur.green(`[${process.env.INSCRIPTION}] -`),
        kleur.yellow(
          `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        ),
        kleur.green(`- [COMMANDREGISTER]`),
        `все команды зарегистрированы. Количество команд: ${commandData.length}`
      );
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Этот метод вызывает метод collect из класса InteractionCollector (не Discord.js),
   * что собирает все взаимодействия обрабатываемые в ивенте InteractionCreate
   * Например, кнопки, модалки
   * У сборщика есть особый паттерн поиска
   * Для кнопок суффикс - *.button.ts
   * Для модалок - *.modal.ts
   * Для селект - *.select.ts
   * Также для кнопок/модалок/селектов обязательно создание собственных папок с названиями:
   *
   * buttons - кнопки
   * selects - селекты
   * modals - модалки
   *
   * (в каждую папку кладутся файлы со своими суффиксами)
   */

  @logger(
    `Начинаю сбор всех взаимодействий`,
    `Закончил сбор всех взаимодействий`
  )
  protected async collectInteractions() {
    await this.interactionCollector.collect();
  }

  /**
   * Вкратце о том зачем я придумал сделать такой метод
   * Т.к. будет использоваться такая конструкцию как for (const guild of this.client.guilds.cache), можно это сократить
   */

  @logger(
    `Начинаю выполнять действия с каждой гильдией`,
    `Заканчиваю выполнять действия с каждой гильдией`
  )
  public async allGuilds() {
    const guilds = this.client.guilds.cache;
    for (const guild of guilds) {
      const thisGuild = guild[1];
      await Promise.all([
        /**
         * Логика связанная с перебором гильдий
         * Вызывать через await this.method(thisGuild)
         */
        await this.collectAllUsers(thisGuild),
      ]);
    }
  }

  /**
   * Сборка всех пользователей и добавление их в коллекцию users
   */
  @logger(
    `Начинаю собирать всех пользователей со всех серверов в БД`,
    `Закончил сбор всех пользователей со всех серверов в БД`
  )
  protected async collectAllUsers(guild: Guild): Promise<any> {
    const members = await guild.members.fetch();
    // Давайте по приколу их засунем в кеш войс юзеров
    members.forEach((member) => {
      this.client.voiceUsers?.set(member.id, member);
    });
  }

  @logger(`Подключаюсь к БД`, `Подключился к БД`)
  public async dbConnect() {
    await connectToDb();
  }
}
