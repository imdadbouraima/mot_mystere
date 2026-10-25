import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { chargerReglages, sauvegarderPseudo, sauvegarderReglages } from "./services/donneesService";
import { obtenirDateUTC } from "./services/motsService";

function creerIdentifiant() {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function Accueil() {
  const [pseudo, setPseudo] = useState(localStorage.getItem("pseudo") || "");
  const [reglages, setReglages] = useState(chargerReglages);
  const [erreur, setErreur] = useState("");
  const navigate = useNavigate();

  function mettreAJourReglages(nouveauxReglages) {
    setReglages(nouveauxReglages);
    sauvegarderReglages(nouveauxReglages);
  }

  function envoyer(e) {
    e.preventDefault();
    const nom = pseudo.trim().slice(0, 24);
    if (!nom) return;
    try {
      localStorage.setItem("pseudo", nom);
      sauvegarderPseudo(nom);
      setErreur("");
      navigate(`/jeu/${reglages.longueur}/${reglages.difficile ? "difficile" : "normal"}/libre?partie=${encodeURIComponent(creerIdentifiant())}`);
    } catch (exception) {
      setErreur(exception.message || "Impossible d'enregistrer le pseudo sur cet appareil.");
    }
  }

  function lancerMotDuJour() {
    const nom = pseudo.trim().slice(0, 24);
    if (!nom) {
      setErreur("Saisis un pseudo avant de commencer.");
      return;
    }
    try {
      localStorage.setItem("pseudo", nom);
      sauvegarderPseudo(nom);
      navigate(`/jeu/5/normal/jour/${obtenirDateUTC()}`);
    } catch (exception) {
      setErreur(exception.message || "Impossible d'enregistrer le pseudo sur cet appareil.");
    }
  }

  return (
    <main className="page accueil-page">
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
      <section className="card accueil-card">
        <p className="eyebrow">Le défi du jour</p>
        <h1>Un mot, six essais. À toi de jouer.</h1>
        <p className="intro-copy">
          Devine un mot en six tentatives. Le vert indique une lettre bien placée,
          le jaune une lettre présente ailleurs et le gris une lettre absente.
          Tes parties et tes réglages sont conservés sur cet appareil.
        </p>
        <label className="pseudo-label" htmlFor="pseudo">Ton pseudo</label>
        <input
          id="pseudo"
          className="pseudo-input"
          type="text"
          maxLength={24}
          placeholder="Comment t'appelle-t-on ?"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
        />
        <section className="daily-card" aria-labelledby="daily-title">
          <div>
            <p className="eyebrow">Même mot pour tout le monde</p>
            <h2 id="daily-title">Le mot du jour</h2>
            <p>Un nouveau défi chaque jour à minuit UTC.</p>
          </div>
          <button className="button button-primary" type="button" onClick={lancerMotDuJour}>Jouer le mot du jour</button>
        </section>
        <form className="settings-panel" onSubmit={envoyer}>
          <h2>Partie libre</h2>
          <div className="settings-row">
            <label htmlFor="longueur">Longueur du mot</label>
            <select
              id="longueur"
              value={reglages.longueur}
              onChange={(e) => mettreAJourReglages({ ...reglages, longueur: Number(e.target.value) })}
            >
              <option value="5">5 lettres</option>
              <option value="6">6 lettres</option>
              <option value="7">7 lettres</option>
            </select>
          </div>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={reglages.difficile}
              onChange={(e) => mettreAJourReglages({ ...reglages, difficile: e.target.checked })}
            />
            Mode difficile : respecter les indices révélés
          </label>
          <button className="button button-primary" type="submit">Lancer une partie libre</button>
        </form>
        {erreur && <p className="message-box" role="alert">{erreur}</p>}
      </section>
    </main>
  );
}

export default Accueil;
