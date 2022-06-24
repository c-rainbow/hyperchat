
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
