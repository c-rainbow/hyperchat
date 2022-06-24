import { ChatUserstate } from 'tmi.js';
import { ChatFragment, TwitchEmoteTags } from '../../common/twitch-ext-emotes';
import { ChatMessageType, TranslationResult } from '../../common/types';

export class ChatMessage implements ChatMessageType {
  channel: string;
  userstate: ChatUserstate;
  message: string;
  fragments: ChatFragment[];
  translation: TranslationResult;

  constructor(
    channel: string,
    userstate: ChatUserstate,
    message: string,
    fragments: ChatFragment[],
    translation: TranslationResult
  ) {
    this.channel = channel;
    this.userstate = userstate;
    this.message = message;
    this.fragments = fragments;
    this.translation = translation;
  }

  get username() {
    return this.userstate.username;
  }

  get displayName() {
    return this.userstate['display-name'];
  }

  get fullName() {
    const username = this.username.toLocaleUpperCase();
    const displayName = this.displayName.toLocaleUpperCase();
    if (username === displayName) {
      return displayName;
    }
    return `${this.displayName}(${this.username})`;
  }

  get channelId() {
    return this.userstate['room-id'];
  }

  get emotes(): TwitchEmoteTags {
    return this.userstate['emotes'] || {};
  }

  get textMessage() {
    const textFragments = this.fragments
      .filter((fragment) => fragment.emote === undefined)
      .map((fragment) => fragment.text.trim());
    return textFragments.join(' ');
  }

  get isEmoteOnly() {
    return this.emotes === {};
  }
}
