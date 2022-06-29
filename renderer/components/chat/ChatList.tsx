import SingleChat from './SingleChat';
import { ChatMessageType } from '../../../common/types';

export default function ChatList({ chatList }) {
  return (
    <div className="w-full overflow-y-scroll">
      {chatList.map((singleChat: ChatMessageType) => {
        return <SingleChat key={singleChat.uuid} chat={singleChat} />;
      })}
    </div>
  );
}
