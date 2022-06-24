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

  get uuid() {
    return this.userstate.id;
  }

  get username() {
    return this.userstate.username;
  }

  get displayName() {
    return this.userstate['display-name'];
  }

  get color() {
    return this.userstate.color;
  }

  get fullName() {
    const usernameUpper = this.username.toLocaleUpperCase();
    const displayNameUpper = this.displayName.toLocaleUpperCase();
    if (usernameUpper === displayNameUpper) {
      return this.displayName;
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
