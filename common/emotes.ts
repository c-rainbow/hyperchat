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
  _bttvGlobalEmotes: Map<string, Emote>;
  _emotesByChannel: Map<string, Map<string, Emote>>;
  _emoteFetcher: EmoteFetcher;


  constructor() {
    this._bttvGlobalEmotes = new Map<string, Emote>();
    this._emotesByChannel = new Map<string, Map<string, Emote>>();
    this._emoteFetcher = new EmoteFetcher();
  }

  async convertTextToFragments(channel: string, text: string, twitchEmotes: {[emoteId: string]: string[]}): Promise<ChatFragment[]> {
    const words = text.split(' ');
    const fragments: ChatFragment[] = [];
    const twitchEmoteMap = new Map<string, Emote>();  // From word to emote ID.

    channel = channel.toString();

    for(const [emoteId, indexRanges] of Object.entries(twitchEmotes)) {
      console.log('emoteId, indexRange', emoteId, indexRanges);
      const splitted = indexRanges[0].split('-');
      const startIndex = parseInt(splitted[0]);
      const endIndex = parseInt(splitted[1])+1;
      const emoteWord = text.substring(startIndex, endIndex);
      console.log('startIndex, endIndex, emoteWord:', startIndex, endIndex, emoteWord);
      twitchEmoteMap.set(emoteWord, {
        source: 'twitch',
        id: emoteId,
        text: emoteWord,
        url: getUrlFromTwitchEmote(emoteId, 0),
      });
    }

    console.log('Twitch emote map:', twitchEmoteMap);

    words.forEach(async (word) => {
      const trimmed = word.trim();
      if (!trimmed) {
        return;
      }

      let emote = twitchEmoteMap.get(trimmed);
      console.log('Twitch emote for', trimmed, 'is', emote);
      if(!emote) {
        console.log('before calling getEmote');
        emote = await this.getEmote(channel, trimmed);
        console.log('after calling getEmote');
      }
      console.log('External emote for', trimmed, 'is', emote);
      fragments.push({
        text: trimmed,
        emote,
      });
    });

    console.log('final fragments:', fragments);
    return fragments;
  }

  async getEmote(channel: string, word: string): Promise<Emote | undefined> {
    // Check BTTV global emote first
    
    await this._populateBttvGlobalEmotes();
    if (this._bttvGlobalEmotes.has(word)) {
      return this._bttvGlobalEmotes.get(word);
    }

    channel = channel.toString()
    

    // Check channel emote
    if (!this._emotesByChannel.has(channel)) {
      await this._populateChannelEmotes(channel);
    }

    //console.log('channel:', channel); 
    //console.log('get:', this._emotesByChannel.get(channel));

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
    const channelEmotesdddd = new Map<string, Emote>();


    const bttvEmotes = await channelObj.fetchBTTVEmotes();
    //console.log('bttv emotes:', bttvEmotes);
    bttvEmotes.forEach((bttvEmote, code) => {
      const emote = convertBttvEmote(code, bttvEmote);
      //console.log('emoteemote:', code, emote);
      channelEmotesdddd.set(code.toString(), emote);
      //console.log('Channel emote set', channelEmotesdddd.size);
    });

    //console.log('channel emotes:', channelEmotesdddd.size);
    //console.log('keys', channelEmotesdddd.keys())

    /*
    const ffzEmotes = await channelObj.fetchFFZEmotes();
    ffzEmotes.forEach((ffzEmote, code) => {
      channelEmotes.set(code, convertFfzEmote(code, ffzEmote));
    });
    */

    //console.log('channel inside populate:', channel);
    this._emotesByChannel.set(channel, channelEmotesdddd);
  }
}