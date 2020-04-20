import eel
import connect
import collections
import sqlite3

#import twitch
from twitchio.ext import commands
import read_oauth
#import asyncio

import langdetect
import googletrans

import threading



MAX_QUEUE_SIZE = 2000

#@eel.expose
#def HandleNewChat(display_name, username, original_chat, translated_chat):

ChatDict = collections.OrderedDict()

DBConn = sqlite3.connect('db/test.db', check_same_thread=False)
DBCursor = DBConn.cursor()


@eel.expose
def BookmarkChat(chat_id):
    message = ChatDict.get(chat_id)
    if message is None:
        print('message is None for ID', chat_id)
    
    # Add to Sqlite DB
    streamer_id = message.tags['room-id']
    chatter_id = message.tags['user-id']
    timestamp = message.timestamp
    #mesage.content
    message.raw_data

    
    DBCursor.execute(
        'REPLACE INTO ChatBookmarks(streamer_id, chatter_id, chat_id, chat_timestamp, chat_text, raw_chat) VALUES(?, ?, ?, ?, ?, ?)',
        (streamer_id, chatter_id, chat_id, message.timestamp, message.content, message.raw_data))

    DBConn.commit()

    print('at the end of BookmarkChat')


@eel.expose
def UnbookmarkChat(chat_id):
    DBCursor.execute(
        'DELETE FROM ChatBookmarks WHERE chat_id =?', (chat_id, ))

    DBConn.commit()

    print('at the end of UnbookmarkChat')


class Bot(commands.Bot):

    def __init__(self, nick, irc_token, initial_channels):
        super().__init__(irc_token=irc_token, nick=nick, prefix='',
                         initial_channels=initial_channels)

        self.translator = googletrans.Translator()
        #self.chats = collections.OrderedDict()

    def addToChatDict(self, message):
        chat_id = message.tags['id']
        if chat_id in ChatDict:
            return
        if len(ChatDict) >= MAX_QUEUE_SIZE:
            ChatDict.popitem(last=False)
        ChatDict[chat_id] = message
 

    async def event_message(self, message):
        if message.author.name in ('c_rainbow_test', 'ssakdook', 'streamelements'):
            return

        eel.my_javascript_function(2, 4)


        #print(message.tags)
        #print(dir(message.tags))

        chat_id = message.tags['id']
        self.addToChatDict(message)
        
        try:
            lang_code = langdetect.detect(message.content)
        except:
            lang_code = 'ko'  # langdetect has many weird errors

        if lang_code != 'ko':
            print('lang_code:', lang_code)
            translated = self.translator.translate(message.content, dest='ko').text
        else:
            translated = message.content

        eel.handle_new_chat(message.author.display_name, message.author.name, message.content, translated, chat_id)
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

    DBConn.close()

    