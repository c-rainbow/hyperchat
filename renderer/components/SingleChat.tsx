import { ChatFragment } from '../../common/twitch-ext-emotes';
import { ChatUserstate } from 'tmi.js';
import { useSelectedChatStore } from '../states/index';
import SingleChatFragment from './SingleChatFragment';


type SingleChat = {
  userstate: ChatUserstate,
  message: string,
  translated: string,
  fragments: ChatFragment[],
}

class ChatClass implements SingleChat {
  userstate: ChatUserstate;
  message: string;
  translated: string;
  fragments: ChatFragment[];
}

export default function SingleChat({ userstate, translated, fragments }: SingleChat) {


  //const singleChat: SingleChat = new SingleChat({ ... });

  //singleChat.blahblah();


  const selectedChat = useSelectedChatStore(state => state.selectChat);

  const displayName = userstate['display-name'];
  const username = userstate.username;

  const nameToDisplay = displayName.toLocaleLowerCase() === username
      ? displayName : `${displayName}(${username})`;

  return (
    <div className="mt-1 ">
      <span
        className="mr-1 font-bold"
        style={{ color: userstate.color ?? '#b22222' }}
        onClick={() => selectedChat(userstate, fragments)}
      >
        {nameToDisplay}
      </span>
      :
      <span className="mr-1">
        {fragments.map((fragment: ChatFragment) => <SingleChatFragment fragment={fragment}/>)}
      </span>
      {/*<span className="mr-2">{translated}</span>*/}
    </div>
  );
}
