
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


export type EmoteSource = 'twitch' | 'bttv' | 'ffz' | '7tv';

export interface Emote {
  source: EmoteSource;  // From which emote provider?
  id: string;  // provider-specific unique ID 
  text: string;  //  text of the emote (ex: "BibleThump")
  url: string;  // URL of the emote pic
}


export interface ChatFragment {
  text: string;
  emote: Emote;
}
