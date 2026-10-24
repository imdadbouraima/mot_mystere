import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Grille from "./components/Grille";
import Formulaire from "./components/Formulaire";
import Resultat from "./components/Resultat";

import {
  chargerMotMystere,
  verifierMot,
  motsAvecAccents
} from "./services/motsService";

import { comparerMots } from "./utils/comparerMots";

function Jeu() {
  const location = useLocation();
  const navigate = useNavigate();

  const pseudo =
    location.state?.pseudo ||
    localStorage.getItem("pseudo") ||
    "";

  const [mot, setMot] = useState("");
  const [verificationEnCours, setVerificationEnCours] =
    useState(false);
  const [motRefuse, setMotRefuse] = useState("");
  const [motMystere, setMotMystere] = useState("");
  const [tentatives, setTentatives] = useState([]);
  const [termine, setTermine] = useState(false);
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [motFinal, setMotFinal] = useState("");

  // Chargement du mot au démarrage
  useEffect(() => {
    chargerMotMystere()
      .then((motAleatoire) => {
        setMotMystere(motAleatoire);
      })
      .catch(() => {
        setMessage("Impossible de charger le mot mystère.");
      });
  }, []);

  // Validation d'une proposition
  async function validerProposition(e) {
    e.preventDefault();

    if (verificationEnCours || termine || !motMystere) {
      return;
    }

    const proposition = mot.trim().toUpperCase();

    setVerificationEnCours(true);
    setMessage("");

    try {
      const motValide = await verifierMot(proposition);

      if (!motValide) {
        setMotRefuse(proposition);
        setMessage(
          "Ce mot n'est pas reconnu comme un mot français. Il ne compte pas comme une tentative."
        );
        return;
      }

      setMotRefuse("");

      const couleurs = comparerMots(
        motMystere.toUpperCase(),
        proposition
      );

      const nouvellesTentatives = [
        ...tentatives,
        { mot: proposition, couleurs }
      ];

      setTentatives(nouvellesTentatives);
      setMot("");

      // Victoire
      if (proposition === motMystere.toUpperCase()) {
        const points = 7 - nouvellesTentatives.length;

        setScore((ancienScore) => ancienScore + points);
        setMessage(`Bravo ! Tu gagnes ${points} points !`);
        setMotFinal(motMystere);
        setTermine(true);
      }

      // Défaite après six tentatives
      else if (nouvellesTentatives.length === 6) {
        const motAffiche =
          motsAvecAccents[motMystere.toLowerCase()] ||
          motMystere;

        setMessage(`Perdu ! Le mot mystère était ${motAffiche}.`);
        setMotFinal(motMystere);
        setTermine(true);
      }
    } catch (erreur) {
      setMessage(
        "Impossible de vérifier le mot auprès du Wiktionnaire. Réessaie : aucune tentative n'a été comptée."
      );
    } finally {
      setVerificationEnCours(false);
    }
  }

  // Nouvelle partie
  async function recommencer() {
    setMot("");
    setMotRefuse("");
    setMotFinal("");
    setTentatives([]);
    setTermine(false);
    setMessage("");
    setScore(0);

    try {
      const nouveauMot = await chargerMotMystere();
      setMotMystere(nouveauMot);
    } catch (erreur) {
      setMessage("Impossible de charger un nouveau mot mystère.");
    }
  }

  return (
    <main className="page jeu-page">
      <header className="page-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            M
          </span>
          <span>Mot mystère</span>
        </div>
      </header>

      <section className="card game-card">
        <div className="game-heading">
          <p className="eyebrow">À toi de jouer</p>
          <h1>Bonjour {pseudo} !</h1>
          <p className="game-subtitle">
            Devine le mot mystère de 5 lettres.
          </p>
        </div>

        <div className="stats" aria-label="Statistiques de la partie">
          <div className="stat-card">
            <span className="stat-label">Score</span>
            <span className="stat-value">{score}</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Essais restants</span>
            <span className="stat-value">
              {6 - tentatives.length}
            </span>
          </div>
        </div>

        <Resultat
          message={message}
          termine={termine}
          motFinal={motFinal}
        />

        <Formulaire
          mot={mot}
          setMot={setMot}
          onValider={validerProposition}
          termine={termine}
          verificationEnCours={verificationEnCours}
        />

        <div className="game-actions">
          <button
            className="button button-secondary"
            type="button"
            onClick={() => navigate("/")}
          >
            Retour à l'accueil
          </button>

          {termine && (
            <button
              className="button button-secondary"
              type="button"
              onClick={recommencer}
            >
              Recommencer
            </button>
          )}
        </div>

        <Grille
          tentatives={tentatives}
          motRefuse={motRefuse}
        />
      </section>
    </main>
  );
}

export default Jeu;