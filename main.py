import eel
import connect

#import twitch
from twitchio.ext import commands
import read_oauth
#import asyncio

import langdetect
import googletrans

import threading





#@eel.expose
#def HandleNewChat(display_name, username, original_chat, translated_chat):


class Bot(commands.Bot):

    def __init__(self, nick, irc_token, initial_channels):
        super().__init__(irc_token=irc_token, nick=nick, prefix='',
                         initial_channels=initial_channels)

        self.translator = googletrans.Translator()

    async def event_message(self, message):
        if message.author.name in ('c_rainbow_test', 'ssakdook', 'streamelements'):
            return

        eel.my_javascript_function(2, 4)

        try:
            lang_code = langdetect.detect(message.content)
        except:
            lang_code = 'ko'  # langdetect has many weird errors

        if lang_code != 'ko':
            print('lang_code:', lang_code)
            translated = self.translator.translate(message.content, dest='ko').text
        else:
            translated = message.content

        eel.handle_new_chat(message.author.display_name, message.author.name, message.content, translated)
        #await message.channel.send('번역: ' + translated.text)
        


class EelOpener(threading.Thread):
    def run(self):
        eel.init('frontend')
        eel.start('index.html', mode='chrome', 
            cmdline_args=['--user-data-dir=C:/Users/Rainbow/Desktop/temp_profile', '--no-first-run'])



if __name__ == '__main__':

    e = EelOpener().start()

    print('opening bot')
    oauth = read_oauth.GetOauthCode()
    bot = Bot('c_rainbow_test', oauth, ['c_rainbow'])
    bot.run()

    