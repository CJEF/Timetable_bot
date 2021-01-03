// import token from "./token";
process.env.NTBA_FIX_319 = 1;
const TelegramBot = require("node-telegram-bot-api");
// const token = "1479181498:AAEoHAQZ-UBonskkMlcVh-X-WwrKN9Ehwk4";
const helper = require("./helper");

mongoUrl = `mongodb+srv://cj:${helper.password}@cluster0.k46yt.mongodb.net/${helper.dbname}?retryWrites=true&w=majority`;

const bot = new TelegramBot(helper.TOKEN, {
  polling: true,
});

const addShedule = (msg) => {
  const id = msg.chat.id;
  let days = [
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
    "Воскресенье",
  ];
  console.log(msg);
  for (let index = 0; index < days.length; index++) {
    const promise = new Promise((resolve, reject) => {
      const day = days[index];
      resolve(day);
    });

    promise
      .then((data) => {
        bot.sendMessage(
          id,
          `Расписание на ${data}, Введите название предмета: `
        );
        return;
        // resolve()
      })
      .then((resolve, reject) => {
        bot.on("message", (lessonName) => {
          // отправить lessonName в БД
          console.log(lessonName);
          bot.sendMessage(id, "Введите время начала урока:");
        });
        resolve();
        // return;
      })
      .then(() => {
        bot.on("message", (lessonStartTime) => {
          // отправить lessonStartTime в БД
          console.log(lessonStartTime);
          bot.sendMessage(id, "Описание урока (Опционально)");
        });
      })
      .then(() => {
        bot.on("message", (lessonDescr) => {
          console.log(lessonDescr);
          // отправить lessonDescr в БД
          console.log("add Shedule ended");
        });
      });
  }
  console.log("add Shedule");
  // return `Расписание на ${day}`;
};

const viewShedule = () => {
  console.log("view Shedule");
};

bot.onText(/\/start/, function (message, match) {
  // console.log(message);
  let id = message.hasOwnProperty("chat") ? message.chat.id : message.from.id;
  bot.sendMessage(
    id,
    "Привет, " + message.from.first_name + "! Выберите пункт в меню",
    {
      reply_markup: {
        keyboard: [["Добавить расписание"], ["Смотреть расписание"]],
      },
    }
  );
});

bot.onText(/Добавить расписание/, (message) => addShedule(message));
bot.onText(/Смотреть расписание/, () => viewShedule());

// firstPromise.then((msg) => {
//   if (msg == 'Добавить расписание') {
//     addShedule();
//   } else if (msg == 'Смотреть расписание') {
//     viewShedule();
//   } else {
//     bot.sendMessage(message.chat.id, 'Выберите пункт в меню')
//   }
// })

// bot.on("message", (msg) => {
//   let { id } = msg.chat;
//   if ((msg.text = "Добавить расписание")) {
//     addShedule(msg);
//   }
// });

bot.on("polling_error", (m) => console.error(m));
