import { ChatFragment } from '../../../common/twitch-ext-emotes';
import { useSelectedChatStore } from '../../states/index';
import SingleChatFragment from './SingleChatFragment';
import { ChatMessageType } from '../../../common/types';

type SingleChatPropType = {
  chat: ChatMessageType;
};

export default function SingleChat({ chat }: SingleChatPropType) {
  const selectedChat = useSelectedChatStore((state) => state.selectChat);

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
    </div>
  );
}
