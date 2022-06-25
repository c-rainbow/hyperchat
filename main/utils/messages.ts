/**
 * Utility functions related to chat messages
 */
import { ChatFragment } from "../../common/twitch-ext-emotes";


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