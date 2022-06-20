import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Client } from 'tmi.js';
import { francAll } from 'franc';
import { ipcRenderer } from 'electron';
import SingleChat from '../components/SingleChat';

var client: Client = null;

function Home() {

  const [chatList, setChatList] = useState([]);
  const chatListRef = useRef(chatList);
  const usernameRef = useRef();
  const [currentChannel, setCurrentChannel] = useState<string>(null);

  const switchChannel = async (e) => {
    const channel = usernameRef.current?.value;
    setCurrentChannel(channel);
  };

  useEffect(() => {
    if (client !== null) {
      client.disconnect();
      client = null;
      setChatList([]);
      chatListRef.current = [];
    }

    console.log('useEffect with current channel', currentChannel);

    if (currentChannel === null) {
      return;
    }

    client = new Client({
      channels: [currentChannel],
    });
  
    client.connect();
    console.log('connected to client');
  
  
    client.on('message', async (channel, userstate, message, self) => {
      console.log('channel:', channel);
      console.log('userstate:', userstate);
      console.log('message:', message);
      console.log('self:', self);

      const result = await ipcRenderer.invoke('translateToEngOrKor', message);
      console.log(result);

      console.log('old list:', chatListRef.current);
      let newList = [...chatListRef.current, { userstate, message, translated: result.text }];
      // Keeps only the last 100 chats
      if (newList.length > 100) {
        newList = newList.slice(-100);
      }
      console.log('new list:', newList);
      setChatList(newList);
      chatListRef.current = newList;
  
      /*
      const langDetected = francAll(message, {
        minLength: 2,
        only: ['eng', 'kor', 'cmn', 'jpn', 'fra'],
      });
      console.log(langDetected);
  
      //const result = await fetch(`/api/user?message=${message}`);
      */
    });
  }, [currentChannel]);

  /*
  useEffect(
    ()=>{ chatListRef.current = chatList },
    [chatList]
  );
  */

  return (
    <>  
      <Head>
        <title>Twitch Chat Translator</title>
      </Head>
      <div className="text-2xl w-full text-center">
        Chat
      </div>
      <div className="mt-2 w-full text-center grid justify-center text-black">
        <input ref={usernameRef} type="text" className="block w-[200px] text-black" style={{ color:"black !important"}}/>
        <button className="m-3 p-1 block border-solid border-2" onClick={switchChannel}>Go!</button>
      </div>
      <hr className="mt-2 mb-2" />
      <div className="w-full h-[800px] overflow-y-scroll">
        <>
        {chatList.map(
          singleChat  => {
            console.log(singleChat.userstate.id);
            return <SingleChat
              key={singleChat.userstate.id}
              userstate={singleChat.userstate}
              message={singleChat.message}
              translated={singleChat.translated} />
          }
        )}</>
      </div>
    </>
  );
}

export default Home;
