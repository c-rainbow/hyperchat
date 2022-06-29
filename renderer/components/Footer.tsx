export default function Footer() {
  return (
    <footer className="footer footer-center p-10 bg-base-200 text-base-content rounded">
      <div className="grid grid-flow-col gap-4">
        <a className="link link-hover">About us</a>
        <a className="link link-hover">Contact</a>
      </div>
      <div>
        <p>
          Hyperchat is not affiliated with or endorsed by Twitch Interactive,
          Inc.
        </p>
      </div>
    </footer>
  );
}
