import { Link } from "react-router-dom";

function Navigation() {
  return (
    <header className="page-header">
      <Link className="brand" to="/">
        <span className="brand-mark" aria-hidden="true">M</span>
        <span>Mot mystère</span>
      </Link>
      <nav className="site-nav" aria-label="Navigation principale">
        <Link to="/scores">Scores</Link>
        <Link to="/statistiques">Statistiques</Link>
        <Link to="/regles">Règles</Link>
      </nav>
    </header>
  );
}

export default Navigation;
