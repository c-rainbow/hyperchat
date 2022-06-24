import { ChatUserstate } from 'tmi.js';
import { ChatFragment, TwitchEmoteTags } from './twitch-ext-emotes/types';


export interface ChatMessageType {
  channel: string;  // Channel name (streamer's username)
  userstate: ChatUserstate;
  message: string;
  fragments: ChatFragment[];
  translation?: TranslationResult;

  // Wrapper for userstate properties
  uuid: string;
  username: string;
  displayName: string;
  channelId: string;
  color?: string;
  emotes: TwitchEmoteTags

  // Compound properties
  fullName: string;
  textMessage: string;
  isEmoteOnly: boolean;
}


// This interface is copied from googletrans.
export interface TranslationResult {
  text: string;
  textArray: string[];
  pronunciation: string;
  hasCorrectedLang: boolean;
  src: string;
  hasCorrectedText: boolean;
  correctedText: string;
  translations: [];
  raw: [];
}
