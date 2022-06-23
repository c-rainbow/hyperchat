import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ChatUserstate, Client } from 'tmi.js';
import { francAll } from 'franc';
import { ipcRenderer } from 'electron';
import SingleChat from '../components/SingleChat';
import Footer from '../components/Footer';
import { ChatFragment } from '../../common/types';

var client: Client = null;

function Home() {
  const [chatList, setChatList] = useState([]);
  const chatListRef = useRef(chatList);
  const usernameRef = useRef<HTMLInputElement>();
  const [currentChannel, setCurrentChannel] = useState<string>(null);

  const switchChannel = async (e) => {
    e.preventDefault();
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

    client.on('message', async (channel, userstate: ChatUserstate, message, self) => {
      console.log('channel:', channel);
      console.log('userstate:', userstate);
      console.log('message:', message);
      console.log('self:', self);

      const result = await ipcRenderer.invoke('translateToEngOrKor', message);
      console.log(result);

      const fragments: ChatFragment[] = await ipcRenderer.invoke(
          'getFragments', (userstate['room-id']), message, userstate['emotes'] ?? {});

      console.log('old list:', chatListRef.current);
      console.log('fragments:', fragments);
      let newList = [
        ...chatListRef.current,
        { userstate, message, translated: result.text, fragments },
      ];
      // Keeps only the last 100 chats
      if (newList.length > 100) {
        newList = newList.slice(-100);
      }
      console.log('new list:', newList);
      setChatList(newList);
      chatListRef.current = newList;
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
      <div className="drawer">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          {/* Navbar */}
          <div className="w-full navbar bg-base-300">
            <div className="flex-none md:hidden">
              <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-6 h-6 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </label>
            </div>
            <div className="flex-1 px-2 mx-2 text-3xl">Chat Translator</div>
            <div className="flex-none hidden md:block">
              <ul className="menu menu-horizontal">
                {/* Navbar menu content here. Separate definition for sidebar content */}
                <li>
                  <a onClick={() => alert('config')}>Config</a>
                </li>
                <li>
                  <a onClick={() => alert('test 2')}>Login</a>
                </li>
              </ul>
            </div>
          </div>
          {/* Page content here */}
          <div className="content flex">
            <div className="flex-1 p-1 ">
              <div className="text-2xl w-full text-center">
                Enter the channel name
              </div>
              <form
                onSubmit={switchChannel}
                className="mt-2 w-full text-center grid justify-center"
              >
                <input
                  ref={usernameRef}
                  type="text"
                  className="block w-[200px] input input-bordered"
                />
                <button
                  className="btn m-3 p-1 block border-solid border-2"
                  onClick={switchChannel}
                >
                  Go!
                </button>
              </form>
              <div className="divider mt-2 mb-2">
                {currentChannel ? `Current in channel ${currentChannel}` : "Chat not activated"}
              </div>
              <div className="w-full overflow-y-scroll">
                <>
                  {chatList.map((singleChat) => {
                    console.log(singleChat.userstate.id);
                    return (
                      <SingleChat
                        key={singleChat.userstate.id}
                        userstate={singleChat.userstate}
                        message={singleChat.message}
                        translated={singleChat.translated}
                        fragments={singleChat.fragments}
                      />
                    );
                  })}
                </>
              </div>
            </div>
            <div className="flex-1 p-1">Menu comes here</div>
          </div>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
          <ul className="menu p-4 overflow-y-auto w-80 bg-base-100">
            {/* Sidebar content here. Separate menu content for navbar */}
            <li>
              <a onClick={() => alert('test 1')}>Do something 1</a>
            </li>
            <li>
              <a onClick={() => alert('test 2')}>Do something 2</a>
            </li>
          </ul>
        </div>
      </div>
      <Footer/>
    </>
  );
}

export default Home;
