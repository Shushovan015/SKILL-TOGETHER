import { Link } from "react-router-dom";

export function HomePage(): React.JSX.Element {
  return (
    <main className="auth-page" aria-labelledby="home-title">
      <section className="auth-panel">
        <p className="auth-panel__eyebrow">SkillTogether</p>
        <h1 id="home-title">Learn with accountability</h1>
        <p className="auth-panel__helper">
          Create an account or log in to continue to your private workspace.
        </p>
        <div className="auth-panel__actions">
          <Link className="button-link" to="/register">
            Register
          </Link>
          <Link className="button-link button-link--secondary" to="/login">
            Log in
          </Link>
        </div>
      </section>
    </main>
  );
}
