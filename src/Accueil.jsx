
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Accueil() {
  const [pseudo, setPseudo] = useState(
    localStorage.getItem("pseudo") || ""
  );

  const navigate = useNavigate();

  function envoyer(e) {
    e.preventDefault();

    const pseudoEnregistre = pseudo.trim();

    if (!pseudoEnregistre) return;

    localStorage.setItem("pseudo", pseudoEnregistre);

    navigate("/jeu", {
      state: { pseudo: pseudoEnregistre }
    });
  }

  return (
    <main className="page accueil-page">
      <header className="page-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">M</span>
          <span>Mot mystère</span>
        </div>
      </header>

      <section className="card accueil-card">
        <p className="eyebrow">Le défi du jour</p>
        <h1>Un mot, six essais. À toi de jouer.</h1>

        <p className="intro-copy">
          Devine un mot mystère de 5 lettres en six tentatives. Le vert indique
          une lettre bien placée, le jaune une lettre présente ailleurs et le
          gris une lettre absente. Chaque partie gagnée te rapporte des points.
          Bonne chance !
        </p>

        <h2 className="section-heading">Prêt à jouer ?</h2>

        <form className="pseudo-form" onSubmit={envoyer}>
          <label htmlFor="pseudo">Ton pseudo</label>
          <input
            id="pseudo"
            type="text"
            placeholder="Comment t'appelle-t-on ?"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            required
          />
          <button className="button button-primary" type="submit">
            Lancer la partie
          </button>
        </form>
      </section>
    </main>
  );
}

export default Accueil;
