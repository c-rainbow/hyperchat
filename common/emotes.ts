import { BTTVEmote, Channel, EmoteFetcher, FFZEmote } from "@mkody/twitch-emoticons";
import { Emote, ChatFragment } from './types';



export function getUrlFromTwitchEmote(emoteId: string, size: number = 0): string {
  return `https://static-cdn.jtvnw.net/emoticons/v1/${emoteId}/${size + 1}.0`;
}


export function convertBttvEmote(text: string, bttvEmote: BTTVEmote): Emote {
  return {
    source: 'bttv',
    id: bttvEmote.id,
    text,
    url: bttvEmote.toLink(0),
  }
}

export function convertFfzEmote(text: string, ffzEmote: FFZEmote): Emote {
  return {
    source: 'ffz',
    id: ffzEmote.id,
    text,
    url: ffzEmote.toLink(0),
  }
}


export class EmoteManager {
  _cachedChannels: Set<string>;
  _bttvGlobalEmotes: Map<string, Emote>;
  _emotesByChannel: Map<string, Map<string, Emote>>;
  _emoteFetcher: EmoteFetcher;


  constructor() {
    this._bttvGlobalEmotes = new Map<string, Emote>();
    this._emotesByChannel = new Map<string, Map<string, Emote>>();
    this._emoteFetcher = new EmoteFetcher();
  }

  async convertTextToFragments(channel: string, text: string): Promise<ChatFragment[]> {
    const words = text.split(' ');
    const fragments: ChatFragment[] = [];

    words.forEach(async (word) => {
      const trimmed = word.trim();
      if (!trimmed) {
        return;
      }
      const emote = await this.getEmote(channel, trimmed);
      fragments.push({
        text: trimmed,
        emote,
      });
    });

    return fragments;
  }

  async getEmote(channel: string, word: string): Promise<Emote | undefined> {
    // Check BTTV global emote first
    this._populateBttvGlobalEmotes();
    if (this._bttvGlobalEmotes.has(word)) {
      return this._bttvGlobalEmotes.get(word);
    }

    // Check channel emote
    if (!this._emotesByChannel.has(channel)) {
      this._populateChannelEmotes(channel);
    }

    return this._emotesByChannel.get(channel)?.get(word);
  }

  async _populateBttvGlobalEmotes() {
    if (this._bttvGlobalEmotes.size !== 0) {
      // Already populated. Skipping..
      return;
    }

    // null for global channel
    const channel = new Channel(this._emoteFetcher, null);
    const bttvEmotes = await channel.fetchBTTVEmotes();
    
    bttvEmotes.forEach((bttvEmote, code) => {
      this._bttvGlobalEmotes.set(code, convertBttvEmote(code, bttvEmote));
    });
  }

  async _populateChannelEmotes(channel: string) {
    const channelObj = new Channel(this._emoteFetcher, channel);
    const channelEmotes = new Map<string, Emote>();

    const bttvEmotes = await channelObj.fetchBTTVEmotes();
    bttvEmotes.forEach((bttvEmote, code) => {
      channelEmotes.set(code, convertBttvEmote(code, bttvEmote));
    });

    const ffzEmotes = await channelObj.fetchFFZEmotes();
    ffzEmotes.forEach((ffzEmote, code) => {
      channelEmotes.set(code, convertFfzEmote(code, ffzEmote));
    });
  }
}