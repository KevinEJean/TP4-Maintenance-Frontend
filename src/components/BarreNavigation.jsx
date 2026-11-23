import { NavLink } from 'react-router-dom';

export default function BarreNavigation() {
  return (
    <header className="barre-navigation">
      <div className="barre-navigation__marque">
        <span className="barre-navigation__logo" aria-hidden="true">🖥️</span>
        <span>Suivi des incidents — Labos informatiques</span>
      </div>
      <nav>
        <NavLink to="/" end>
          Locaux
        </NavLink>
        <NavLink to="/incidents">Incidents</NavLink>
        <NavLink to="/incidents/nouveau">Signaler un incident</NavLink>
      </nav>
    </header>
  );
}
