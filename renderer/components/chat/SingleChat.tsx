import { ChatFragment } from '../../../common/twitch-ext-emotes';
import { useSelectedChatStore } from '../../states/index';
import SingleChatFragment from './SingleChatFragment';
import { ChatMessageType } from '../../../common/types';
import { useState } from 'react';
import { ipcRenderer } from 'electron';


type SingleChatPropType = {
  chat: ChatMessageType;
};

export default function SingleChat({ chat }: SingleChatPropType) {
  const selectedChat = useSelectedChatStore((state) => state.selectChat);
  const [isMemoedChat, setIsMemoedChat] = useState<boolean>(false);

  const toggleMemo = async () => {
    // TODO: network call or IPC call
    if (isMemoedChat) {
      ipcRenderer.send('chat.unstar', chat.uuid);
    }
    else {
      ipcRenderer.send('chat.star', chat);
    }
    setIsMemoedChat(!isMemoedChat);
  };

  return (
    <div className="mt-1 ">
      <span
        className="mr-1 font-bold"
        style={{ color: chat.color ?? '#b22222' }}
        onClick={() => selectedChat(chat)}
      >
        {chat.fullName}
      </span>
      :
      <span className="mr-1">
        {chat.fragments.map((fragment: ChatFragment) => (
          <SingleChatFragment fragment={fragment} />
        ))}
      </span>
      {/* TODO: Change to a bigger icon */}
      <span className="place-self-end" onClick={toggleMemo}>
        {isMemoedChat ? '★' : '☆'}
      </span>
    </div>
  );
}
