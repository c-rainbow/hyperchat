import { ChatFragment } from '../../../common/twitch-ext-emotes/types';

interface PropType {
  fragment: ChatFragment;
}

export default function SingleChatFragment({ fragment }: PropType) {
  if (fragment.emote) {
    return (
      <img className="inline" src={fragment.emote.url} alt={fragment.text} />
    );
  } else {
    return <>{' ' + fragment.text + ' '}</>;
  }
}
