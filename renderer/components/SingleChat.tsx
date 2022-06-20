

export default function SingleChat({ userstate, message, translated }) {

  const displayName = userstate['display-name'];


  return (
    <div className="mt-1 w-full flex-wrap flex">
      <span className="mr-1">{displayName}</span>
      <span className="mr-1">{message}</span>
      <span className="mr-1">{translated}</span>
    </div>
  );
}