import { Link } from "react-router-dom";
import type { ReactNode } from "react";

interface AuthShellProps {
  readonly eyebrow: string;
  readonly title: string;
  readonly children: ReactNode;
}

export function AuthShell({ eyebrow, title, children }: AuthShellProps): React.JSX.Element {
  return (
    <main className="auth-page" aria-labelledby="auth-title">
      <section className="auth-panel">
        <p className="auth-panel__eyebrow">{eyebrow}</p>
        <h1 id="auth-title">{title}</h1>
        {children}
        <nav className="auth-panel__nav" aria-label="Authentication">
          <Link to="/register">Register</Link>
          <Link to="/login">Log in</Link>
        </nav>
      </section>
    </main>
  );
}
