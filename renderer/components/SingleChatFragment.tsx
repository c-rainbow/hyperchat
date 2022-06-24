import { ChatFragment } from '../../common/twitch-ext-emotes/types';

export interface SingleChatFragmentPropType {
  fragment: ChatFragment;
}

export default function SingleChatFragment({
  fragment,
}: SingleChatFragmentPropType) {
  if (fragment.emote) {
    return (
      <img className="inline" src={fragment.emote.url} alt={fragment.text} />
    );
  } else {
    return <>{' ' + fragment.text + ' '}</>;
  }
}
