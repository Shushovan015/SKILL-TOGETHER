import { Link } from "react-router-dom";

export function NotFoundPage(): React.JSX.Element {
  return (
    <main className="status-page" aria-labelledby="not-found-title">
      <h1 id="not-found-title">Page not found</h1>
      <p>The address may be incorrect, or this page may no longer be available.</p>
      <div className="auth-panel__actions">
        <Link className="button-link" to="/today">Go to Today</Link>
        <Link className="button-link button-link--secondary" to="/tracks">My Tracks</Link>
      </div>
    </main>
  );
}
