import tr from 'googletrans';



/**
 * Translate the message to Korean if English,
 * and to English for all other languages.
 * @param message 
 * @returns 
 */
export async function translateToEngOrKor(message: string) {
  const result = await tr(message, {
    to: 'en'  // TODO: Get target language from config
  });

  if (result.src === 'en') {
    const result = await tr(message, {
      to: 'ko'  // TODO: Get target language from config
    });

    return result;
  }

  return result;
}



export async function translate(message: string) {
  const result = await tr(message, {
    to: 'en'  // TODO: Get target language from config
  });

  return result;
}



