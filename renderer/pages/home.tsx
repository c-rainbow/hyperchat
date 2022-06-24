import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { ChatUserstate, Client } from 'tmi.js';
import { ipcRenderer } from 'electron';
import SingleChat from '../components/chat/SingleChat';
import Footer from '../components/Footer';
import { ChatFragment } from '../../common/twitch-ext-emotes';
import { useSelectedChatStore } from '../states';
import SingleChatFragment from '../components/chat/SingleChatFragment';
import { ChatMessageType, TranslationResult } from '../../common/types';
import { ChatMessage } from '../lib/message';
import ChatList from '../components/chat/ChatList';

var client: Client = null;

function Home() {
  const [chatList, setChatList] = useState<ChatMessageType[]>([]);
  const chatListRef = useRef(chatList);
  const usernameRef = useRef<HTMLInputElement>();
  const [currentChannel, setCurrentChannel] = useState<string>(null);

  const switchChannel = async (e) => {
    e.preventDefault();
    const channel = usernameRef.current?.value;
    setCurrentChannel(channel);
  };

  const { selectChat, chat: selectedChat } = useSelectedChatStore();

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

    client.on(
      'message',
      async (channel, userstate: ChatUserstate, message, self) => {
        console.log('channel:', channel);
        console.log('userstate:', userstate);
        console.log('message:', message);
        console.log('self:', self);

        const fragments: ChatFragment[] = await ipcRenderer.invoke(
          'getFragments',
          userstate['room-id'],
          message,
          userstate['emotes'] || {}
        );

        const translation: TranslationResult = await ipcRenderer.invoke(
          'translateFragments',
          fragments
        );
        // console.log(translationResult);

        // console.log('old list:', chatListRef.current);
        // console.log('fragments:', fragments);
        let newList = [
          ...chatListRef.current,
          new ChatMessage(channel, userstate, message, fragments, translation),
        ];
        // Keeps only the last 100 chats
        if (newList.length > 30) {
          newList = newList.slice(-30);
        }
        console.log('new list:', newList);
        setChatList(newList);
        chatListRef.current = newList;
      }
    );
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
        <title>HyperChat</title>
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
            <div className="flex-1 px-2 mx-2 text-3xl">HyperChat</div>
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
                {currentChannel
                  ? `Current in channel ${currentChannel}`
                  : 'Chat not activated'}
              </div>
              <ChatList chatList={chatList} />
            </div>
            <div className="flex-1 p-1">
              <div className="hero min-h-screen bg-base-200">
                <div className="hero-content text-center">
                  <div className="max-w-md">
                    <h1 className="text-5xl font-bold">
                      {selectedChat?.displayName}
                    </h1>
                    <p className="pt-6 pb-2">
                      {selectedChat?.fragments.map((fragment) => (
                        <SingleChatFragment fragment={fragment} />
                      ))}
                    </p>
                    <p className="pt-2 pb-6">
                      Translation: {selectedChat?.translation?.text}
                    </p>
                    <button className="btn btn-primary">Learn more</button>
                  </div>
                </div>
              </div>
            </div>
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
      <Footer />
    </>
  );
}

export default Home;
