import tr from 'googletrans';
import { TranslationResult } from '../../common/types';

const EMPTY_RESULT: TranslationResult = {
  text: '',
  textArray: [''],
  pronunciation: '',
  hasCorrectedLang: false,
  src: null,
  hasCorrectedText: false,
  correctedText: '',
  translations: [],
  raw: [],
};

export interface ITranslator {
  translate: (message: string) => Promise<TranslationResult>;
  translateAuto: (message: string) => Promise<TranslationResult>;
}

export class GoogleTranslator implements ITranslator {
  /**
   * Translate to a specific target language in the config.
   * TODO: Auto-detect the source language and find the target language from config.
   * @param message
   * @returns
   */
  async translate(message: string) {
    if (!message) {
      return EMPTY_RESULT;
    }

    const result = await tr(message, {
      to: 'en', // TODO: Get target language from config
    });

    return result;
  }

  /**
   * Automatically translate to English or Korean, depending on the source language.
   * This is a temporary function before the preferred language is configurable.
   * @param message
   * @returns
   */
  async translateAuto(message: string): Promise<TranslationResult> {
    if (!message) {
      return EMPTY_RESULT;
    }

    const result = await tr(message, {
      to: 'en', // TODO: Get target language from config
    });

    if (result.src === 'en') {
      const result = await tr(message, {
        to: 'ko', // TODO: Get target language from config
      });

      return result;
    }

    return result;
  }
}

export default new GoogleTranslator();
