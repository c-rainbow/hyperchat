import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Client } from 'tmi.js';
import { francAll } from 'franc';
import { ipcRenderer } from 'electron';
import SingleChat from '../components/SingleChat';

function Home() {

  const [chatList, setChatList] = useState([]);
  const chatListRef = useRef(chatList);

  useEffect(() => {
    const client = new Client({
      channels: ['c_rainbow'],
    });
  
    client.connect();
    console.log('connected to client');
  
    client.on('message', async (channel, userstate, message, self) => {
      console.log('channel:', channel);
      console.log('userstate:', userstate);
      console.log('message:', message);
      console.log('self:', self);

      const result = await ipcRenderer.invoke('translate', message);
      console.log(result);

      console.log('old list:', chatListRef.current);
      const newList = [...chatListRef.current, { userstate, message, translated: result.text }];
      console.log('new list:', newList);
      setChatList(newList);
      chatListRef.current = newList;



      //const newList = [...chatListRef.current, { userstate, message }];
      //console.log('new list:', newList);
      //setChatList(newList);
      //console.log('new List set');

  
      /*
      const langDetected = francAll(message, {
        minLength: 2,
        only: ['eng', 'kor', 'cmn', 'jpn', 'fra'],
      });
      console.log(langDetected);
  
      //const result = await fetch(`/api/user?message=${message}`);
      */
    });
  }, []);

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
      <div className="grid grid-col-1 text-2xl w-full text-center">
        Chat
      </div>
      <div className="grid grid-col-1 text-2xl w-full text-center">
        <>{console.log(chatList)}
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
