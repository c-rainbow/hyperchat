#import twitch
from twitchio.ext import commands
import read_oauth
#import asyncio

import langdetect
import googletrans

class Bot(commands.Bot):

    def __init__(self, nick, irc_token, initial_channels):
        super().__init__(irc_token=irc_token, nick=nick, prefix='',
                         initial_channels=initial_channels)

        self.translator = googletrans.Translator()

    async def event_message(self, message):
        if message.author.name == 'c_rainbow_test':
            return

        eel.my_javascript_function(2, 4)

        lang_code = langdetect.detect(message.content)
        if lang_code != 'ko':
            translated = self.translator.translate(message.content, dest='ko')
            await message.channel.send('번역: ' + translated.text)


if __name__ == '__main__':
    oauth = read_oauth.GetOauthCode()
    bot = Bot('c_rainbow_test', oauth, ['c_rainbow'])
    bot.run()
    