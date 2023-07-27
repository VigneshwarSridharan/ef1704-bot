import Bot from "../utils/Bot";

const HelpAction = (query) => {
    const chatId = !!query.chat_instance ? query.message.chat.id : query.chat.id;
    const text = !!query.chat_instance ? query.data : query.text;
    const id = query.id;

    Bot.sendMessage(chatId,'Hi!')
} 

export default HelpAction