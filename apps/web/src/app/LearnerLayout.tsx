import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

import { LogoutButton } from "../features/auth/LogoutButton.js";

interface LearnerLayoutProps {
  readonly children: ReactNode;
}

const navigationItems = [
  { to: "/today", label: "Today" },
  { to: "/tracks", label: "My Tracks" },
  { to: "/roadmap", label: "Roadmap" },
  { to: "/progress", label: "Progress" }
] as const;

export function LearnerLayout({ children }: LearnerLayoutProps): React.JSX.Element {
  return (
    <div className="learner-shell">
      <header className="app-nav" aria-label="Main navigation">
        <NavLink className="app-nav__brand" to="/today">
          SkillTogether
        </NavLink>
        <nav className="app-nav__links" aria-label="Learning">
          {navigationItems.map((item) => (
            <NavLink
              className={({ isActive }) => (isActive ? "app-nav__link app-nav__link--active" : "app-nav__link")}
              key={item.to}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="app-nav__actions">
          <NavLink className="app-nav__link" to="/partner">
            Partner
          </NavLink>
          <LogoutButton />
        </div>
      </header>
      <div className="learner-shell__content">{children}</div>
    </div>
  );
}
