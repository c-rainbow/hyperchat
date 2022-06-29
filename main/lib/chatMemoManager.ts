/**
 * Manager of starred chats
 */
import { PrismaClient } from '@prisma/client'
import { ChatMessageType } from '../../common/types';


export interface IChatMemoManager {
  starChat: (chat:ChatMessageType) => Promise<void>;
  unstarChat: (chatId: string) => Promise<void>;
}

export class ChatMemoManager {

  private _prisma: PrismaClient;

  constructor() {
    this._prisma = new PrismaClient();
  }

  async starChat(chat: ChatMessageType) {
    const chatDatetime = new Date(chat.userstate['tmi-sent-ts']);
    console.log(chatDatetime, chat.userstate['tmi-sent-ts'])
    await this._prisma.chatBookmark.upsert({
      where: {
        chatId: chat.uuid,
      },
      create: {
        chatId: chat.uuid,
        streamerId: chat.channelId,
        chatterId: chat.userstate['user-id'],
        text: chat.message,
        raw: chat.textMessage,
        chattedAt: new Date(parseInt(chat.userstate['tmi-sent-ts'])),
      },
      update: {}
    });
  }

  async unstarChat(chatId: string) {
    await this._prisma.chatBookmark.delete({
      where: { chatId }
    });
  }
}


export default new ChatMemoManager();