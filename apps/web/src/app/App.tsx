import { appRoutes, layoutShells } from "./routes.js";

export function App(): React.JSX.Element {
  return (
    <main className="app-shell" aria-labelledby="app-shell-title">
      <section className="app-shell__panel">
        <p className="app-shell__eyebrow">Foundation</p>
        <h1 id="app-shell-title">SkillTogether</h1>
        <p>Workspace shell ready.</p>
        <dl className="app-shell__grid" aria-label="Configured workspace shells">
          <div>
            <dt>Layouts</dt>
            <dd>{layoutShells.length} configured</dd>
          </div>
          <div>
            <dt>Routes</dt>
            <dd>{appRoutes.length} configured</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
