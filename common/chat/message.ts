import { ChatMessageType, TranslationResult } from "../types";
import { ChatFragment } from '../twitch-ext-emotes/types';
import { ChatUserstate } from "tmi.js";


export function getFullUserName(username: string, displayName: string) {
  if (username.toLocaleUpperCase() === displayName.toLocaleUpperCase()) {
    return displayName;
  }
  return `${displayName}(${username})`;
}

export function getTextMessage(fragments: ChatFragment[]) {
  const textFragments = fragments
    .filter(fragment => fragment.emote === undefined)
    .map(fragment => fragment.text.trim());
  return textFragments.join(' ');
}


export function makeChatMessage(
    channel: string, userstate: ChatUserstate, message: string, fragments: ChatFragment[],
    translation: TranslationResult): ChatMessageType {
  const username = userstate.username;
  const displayName = userstate.displayName;
  const emotes = userstate.emotes || {};

  return {
    channel,
    userstate,
    message,
    fragments,
    translation,
    username,
    displayName,
    fullName: getFullUserName(username, displayName),
    channelId: userstate["room-id"],
    emotes,
    textMessage: getTextMessage(fragments),
    isEmoteOnly: emotes === {},
  };
}

