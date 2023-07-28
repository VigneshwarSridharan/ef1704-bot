import { createWriteStream, existsSync, mkdirSync } from "fs";
import { DashboardService } from "../../utils/APIService";
import Bot from "../../utils/Bot";
import { DASHBOARD_SERVICES } from "../../utils/constants";
import { random } from "lodash";
import { unlink } from "fs/promises";

export const DRSCommand = async (query) => {
  const chatId = query.chat.id;
  const text = query.text;
  const id = query.id;
  Bot.sendChatAction(chatId, "typing");

  const { message_id } = await Bot.sendMessage(chatId, "Please wait");

  Bot.sendChatAction(chatId, "typing");

  try {
    const dirPath = "./uploads";
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath);
    }
    const fileName = `${chatId}-${new Date()
      .getTime()
      .toString(36)
      .toUpperCase()}.pdf`;
    const status = await new Promise((resolve, reject) => {
      DashboardService.get(DASHBOARD_SERVICES.DRS_DOWNLOAD, {
        responseType: "stream",
      })
        .catch((err) => console.log("Error: => ", err))
        .then((res) => {
          const writer = createWriteStream(`${dirPath}/${fileName}`);

          // Pipe the response data stream to the output file stream
          res.pipe(writer);

          // Handle the 'finish' event to know when the file write operation is complete
          writer.on("finish", () => {
            resolve(true);
            console.log("File downloaded and saved successfully.");
          });

          // Handle errors during the file write operation
          writer.on("error", (err) => {
            reject(err);
            console.error("Error writing to file:", err);
          });
        });
    });
    if (status) {
      await Bot.deleteMessage(chatId, message_id);
      await Bot.sendDocument(chatId, `${dirPath}/${fileName}`);
      unlink(`${dirPath}/${fileName}`);
    } else {
      Bot.sendMessage(chatId, "Oops! Something went wrong.");
    }
  } catch (err) {
    Bot.sendMessage(chatId, "Error: " + err.toString());
  }
};
