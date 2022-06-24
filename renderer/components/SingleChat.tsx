import { ChatFragment } from '../../common/twitch-ext-emotes';

export default function SingleChat({
  userstate,
  message,
  translated,
  fragments,
}) {
  const displayName = userstate['display-name'];

  return (
    <div className="mt-1 ">
      <span
        className="mr-1 font-bold"
        style={{ color: userstate.color ?? '#b22222' }}
      >
        {displayName}
      </span>
      <span className="mr-1">
        {fragments.map((fragment: ChatFragment) => {
          if (fragment.emote !== undefined) {
            return (
              <img
                className="inline"
                src={fragment.emote.url}
                alt={fragment.text}
              />
            );
          } else {
            return ' ' + fragment.text + ' ';
          }
        })}
      </span>
      <span className="mr-2">{translated}</span>
    </div>
  );
}
