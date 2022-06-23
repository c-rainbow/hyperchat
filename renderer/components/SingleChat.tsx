export default function SingleChat({ userstate, message, translated }) {
  const displayName = userstate['display-name'];

  return (
    <div className="mt-1 ">
      <span
        className="mr-1 font-bold"
        style={{ color: userstate.color ?? '#b22222' }}
      >
        {displayName}
      </span>
      <span className="mr-1">{message}</span>
      <span className="mr-2">{translated}</span>
    </div>
  );
}
