import tr from 'googletrans';



export async function translate(message: string) {
  const result = await tr(message, {
    to: 'en'  // TODO: Get target language from config
  });

  return result;
}



