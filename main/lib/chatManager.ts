import { ChatUserstate, Client } from "tmi.js";
import { ChatMessageType } from '../../common/types';
import { IEmoteParser } from '../../common/twitch-ext-emotes';
import { ITranslator } from "./translator";
import { getFullUserName, getTextMessage } from "../utils/messages";


// TODO: Get this value from config
const MAX_CHATS_FRONTEND = 100;

type SendFunctionType = (channel: string, ...args: any[]) => void;


export interface IChatManager {
  connect: () => void;
  join: (channel: string) => void;
  part: (channel: string) => void;
  disconnect: () => void;
  handleMessage: (channel: string, userstate: ChatUserstate, message: string) => void;
  makeChatMessage: (channel: string, userstate: ChatUserstate, message: string) => Promise<ChatMessageType>;
}


/**
 * Connect to Twitch IRC server and stores all chats
 */
export class ChatManager implements IChatManager {
  private _sendFunction: SendFunctionType;
  private _ircClient: Client;
  private _emoteParser: IEmoteParser;
  private _translator: ITranslator;
  private _messageList: Map<string, ChatMessageType[]>;

  constructor(sendFunction: SendFunctionType, ircClient: Client, emoteParser: IEmoteParser, translator: ITranslator) {
    this._sendFunction = sendFunction;

    this._ircClient = ircClient;
    this._emoteParser = emoteParser;
    this._translator = translator;

    this._messageList = new Map<string, ChatMessageType[]>();

    this._ircClient.on('message', this.handleMessage.bind(this));
  }

  async connect() {
    await this._ircClient.connect();
  }

  async join(channel: string) {
    console.log('Joining', channel);
    await this._ircClient.join(channel);
    console.log('Joined', channel);
  }

  async part(channel: string) {
    console.log('Parting', channel);
    await this._ircClient.part(channel)
    console.log('Parted', channel);
  }

  async disconnect() {
    await this._ircClient.disconnect();
  }

  async handleMessage(channel: string, userstate: ChatUserstate, message: string) {
    const chatMessage = await this.makeChatMessage(channel, userstate, message);
    console.log('chat message in handle message:', chatMessage);

    // Append to the chat list for the channel
    let oldList = this._messageList.get(channel)
    if (!oldList) {
      oldList = [];
      this._messageList.set(channel, oldList);
    }
    oldList.push(chatMessage);
    // Send the last n chats to the frontend
    this._sendFunction('chat.new_message', channel, chatMessage);
    console.log('Send function chat.new_message');
  }
  
  async makeChatMessage(
      channel: string, userstate: ChatUserstate, message: string): Promise<ChatMessageType> {
    const channelId = userstate["room-id"];
    const fragments = await this._emoteParser.parse(channelId, message, userstate.emotes);
    const username = userstate.username;
    const displayName = userstate.displayName;
    const emotes = userstate.emotes || {};
    const textMessage = getTextMessage(fragments);
    const translation = await this._translator.translateAuto(textMessage);

    return {
      channel,
      userstate,
      message,
      fragments,
      uuid: userstate.id,
      translation,
      username,
      displayName,
      fullName: getFullUserName(username, displayName),
      channelId,
      emotes,
      textMessage,
      isEmoteOnly: emotes === {},
    }
  }
}