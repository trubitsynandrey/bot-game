const TelegramApi = require("node-telegram-bot-api");

const token = "6359634698:AAF1SPVdI6KnceKJzsMbmgXs2xO5wuoeZWw";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const { gameOptions, againOptions } = require("./options");

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    "Now i make a number from 0 to 5 and you should guess it!"
  );
  const randomNumber = Math.floor(Math.random() * 5);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "lets go! try to guess", gameOptions);
};

bot.setMyCommands([
  { command: "/start", description: "Initial greeting" },
  { command: "/game", description: "Guess the number game" },
]);

const start = () => {
  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    const userFullName = `${msg.from.first_name} ${msg.from.last_name}`;
    console.log(msg);

    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://tlgrm.ru/_/stickers/dc7/a36/dc7a3659-1457-4506-9294-0d28f529bb0a/1.webp"
      );
      return bot.sendMessage(chatId, `Welcome ${userFullName}!`);
    }

    if (text === "/game") {
      return startGame(chatId);
    }

    if (text.startsWith("/")) {
      return bot.sendMessage(chatId, "I dont understand you!");
    }

    await bot.sendMessage(chatId, `You wrote me ${text}`);
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    const madeNumber = chats[chatId];
    console.log(data, "data");
    console.log(madeNumber, "makedNumber");

    if (data === "/again") {
      startGame(chatId);
      return;
    }

    if (data == chats[chatId]) {
      await bot.sendSticker(
        chatId,
        "https://cdn.tlgrm.app/stickers/e08/6af/e086af32-dbde-4ee5-870f-7244d07d20fe/256/8.webp"
      );
      return bot.sendMessage(
        chatId,
        `Congrats you guess the number ${madeNumber}`,
        againOptions
      );
    } else {
      await bot.sendSticker(
        chatId,
        "https://cdn.tlgrm.app/stickers/e08/6af/e086af32-dbde-4ee5-870f-7244d07d20fe/256/2.webp"
      );
      return bot.sendMessage(
        chatId,
        `I am sorry but it's the number ${madeNumber}`,
        againOptions
      );
    }
  });
};

start();
