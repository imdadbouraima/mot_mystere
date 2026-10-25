import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import Grille from "./components/Grille";
import Formulaire from "./components/Formulaire";
import Resultat from "./components/Resultat";
import Clavier from "./components/Clavier";
import Navigation from "./components/Navigation";
import { chargerMotDuJour, chargerMotMystere, obtenirDateUTC, obtenirTempsAvantMinuitUTC, verifierMot, motsAvecAccents } from "./services/motsService";
import { chargerParties, sauvegarderPartie, sauvegarderPseudo } from "./services/donneesService";
import { comparerMots } from "./utils/comparerMots";
import { verifierReglesDifficile } from "./utils/reglesDifficile";
import { calculerPoints } from "./utils/score";

function normaliserMot(texte) {
  return texte.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleUpperCase("fr");
}

function creerPartie({ id, pseudo, longueur, difficile, type, date, motMystere = "", existante = null }) {
  return existante || {
    id, pseudo, longueur, difficile, type, date, motMystere,
    tentatives: [], terminee: false, gagnee: false, points: 0,
    startedAt: Date.now(), termineeLe: 0, dureeMs: 0, motEnCours: ""
  };
}

function Jeu() {
  const { longueur: longueurUrl, difficulte: difficulteUrl, type, date: dateUrl } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const longueur = Number(longueurUrl);
  const difficile = difficulteUrl === "difficile";
  const pseudo = localStorage.getItem("pseudo") || "";
  const dateDuJour = obtenirDateUTC();
  const date = type === "jour" ? (dateUrl || dateDuJour) : dateDuJour;
  const id = type === "jour"
    ? `jour-${date}-${pseudo.toLocaleLowerCase("fr")}`
    : searchParams.get("partie");
  const nombreEssaisMax = 6;
  const [partie, setPartie] = useState(null);
  const [message, setMessage] = useState("");
  const [motRefuse, setMotRefuse] = useState("");
  const [refusNumero, setRefusNumero] = useState(0);
  const [verificationEnCours, setVerificationEnCours] = useState(false);
  const [tempsRestant, setTempsRestant] = useState(obtenirTempsAvantMinuitUTC());
  const [copiee, setCopiee] = useState(false);

  useEffect(() => {
    let annule = false;
    async function initialiser() {
      if (!pseudo) {
        navigate("/", { replace: true });
        return;
      }
      if (![5, 6, 7].includes(longueur) || !id || !["jour", "libre"].includes(type)) {
        setMessage("Cette adresse de partie n'est pas valide.");
        return;
      }
      try {
        const existante = chargerParties().find((element) => element.id === id);
        if (existante) {
          setPartie(existante);
          return;
        }
        if (type === "jour" && date !== dateDuJour) {
          setMessage("Ce défi quotidien est terminé ou n'est plus disponible.");
          return;
        }
        const motMystere = type === "jour"
          ? await chargerMotDuJour(new Date(`${date}T12:00:00Z`))
          : await chargerMotMystere(longueur);
        if (!annule) {
          const nouvellePartie = creerPartie({ id, pseudo, longueur, difficile, type, date, motMystere });
          sauvegarderPartie(nouvellePartie);
          setPartie(nouvellePartie);
        }
      } catch (erreur) {
        if (!annule) setMessage(erreur.message || "Impossible de charger le mot mystère.");
      }
    }
    initialiser();
    return () => { annule = true; };
  }, [date, dateDuJour, difficile, id, longueur, navigate, pseudo, type]);

  useEffect(() => {
    if (type !== "jour") return undefined;
    const intervalle = window.setInterval(() => setTempsRestant(obtenirTempsAvantMinuitUTC()), 1000);
    return () => window.clearInterval(intervalle);
  }, [type]);

  useEffect(() => {
    if (!partie?.motMystere) return;
    try {
      sauvegarderPartie(partie);
    } catch (erreur) {
      setMessage(erreur.message || "Impossible de sauvegarder la partie sur cet appareil.");
    }
  }, [partie]);

  const couleursLettres = useMemo(() => {
    const couleurs = {};
    const priorite = { gris: 1, jaune: 2, vert: 3 };
    for (const tentative of partie?.tentatives || []) {
      tentative.mot.split("").forEach((lettre, index) => {
        const couleur = tentative.couleurs[index];
        if (!couleurs[lettre] || priorite[couleur] > priorite[couleurs[lettre]]) couleurs[lettre] = couleur;
      });
    }
    return couleurs;
  }, [partie?.tentatives]);

  const validerProposition = useCallback(async (event) => {
    event?.preventDefault();
    if (!partie || partie.terminee || verificationEnCours || !partie.motMystere) return;
    const proposition = normaliserMot(partie.motEnCours.trim());
    if (proposition.length !== longueur || !/^[A-Z]+$/.test(proposition)) {
      setMessage(`Entre un mot composé de ${longueur} lettres.`);
      return;
    }
    if (difficile) {
      const erreurRegle = verifierReglesDifficile(partie.tentatives, proposition);
      if (erreurRegle) {
        setMessage(erreurRegle);
        setMotRefuse(proposition);
        setRefusNumero((numero) => numero + 1);
        return;
      }
    }
    setVerificationEnCours(true);
    setMessage("");
    try {
      const motValide = await verifierMot(proposition);
      if (!motValide) {
        setMotRefuse(proposition);
        setRefusNumero((numero) => numero + 1);
        setMessage("Ce mot n'est pas reconnu comme un mot français. Il ne compte pas comme une tentative.");
        return;
      }
      setMotRefuse("");
      const couleurs = comparerMots(partie.motMystere, proposition);
      const tentatives = [...partie.tentatives, { mot: proposition, couleurs }];
      const gagnee = proposition === normaliserMot(partie.motMystere);
      const terminee = gagnee || tentatives.length >= nombreEssaisMax;
      const termineeLe = terminee ? Date.now() : 0;
      const points = gagnee ? calculerPoints(tentatives.length, longueur, difficile) : 0;
      const prochainePartie = {
        ...partie,
        tentatives,
        motEnCours: "",
        gagnee,
        terminee,
        points,
        termineeLe,
        dureeMs: termineeLe ? termineeLe - partie.startedAt : 0,
        essais: tentatives.length
      };
      setPartie(prochainePartie);
      if (gagnee) setMessage(`Bravo ${pseudo} ! Tu gagnes ${points} points.`);
      else if (terminee) {
        const motAffiche = motsAvecAccents[partie.motMystere.toLowerCase()] || partie.motMystere;
        setMessage(`Perdu ! Le mot mystère était ${motAffiche}.`);
      }
    } catch {
      setMessage("Impossible de vérifier le mot auprès du Wiktionnaire. Réessaie : aucune tentative n'a été comptée.");
    } finally {
      setVerificationEnCours(false);
    }
  }, [difficile, longueur, nombreEssaisMax, partie, pseudo, verificationEnCours]);

  function gererTouche(touche) {
    if (!partie || partie.terminee || verificationEnCours) return;
    if (touche === "ENTRÉE") {
      validerProposition();
    } else if (touche === "EFFACER") {
      setPartie((ancienne) => ({ ...ancienne, motEnCours: ancienne.motEnCours.slice(0, -1) }));
    } else {
      setPartie((ancienne) => ancienne.motEnCours.length >= longueur
        ? ancienne
        : { ...ancienne, motEnCours: ancienne.motEnCours + touche });
    }
  }

  function modifierProposition(valeur) {
    if (!partie) return;
    const proposition = normaliserMot(valeur).replace(/[^A-Z]/g, "").slice(0, longueur);
    setPartie((ancienne) => ({ ...ancienne, motEnCours: proposition }));
  }

  useEffect(() => {
    function gererClavier(event) {
      const element = event.target;
      if (element instanceof HTMLElement && ["INPUT", "TEXTAREA", "SELECT"].includes(element.tagName)) return;
      if (event.key === "Enter") {
        event.preventDefault();
        gererTouche("ENTRÉE");
      } else if (event.key === "Backspace") gererTouche("EFFACER");
      else if (/^[a-zA-ZÀ-ÿ]$/.test(event.key)) gererTouche(normaliserMot(event.key));
    }
    window.addEventListener("keydown", gererClavier);
    return () => window.removeEventListener("keydown", gererClavier);
  });

  async function partagerResultat() {
    if (!partie?.terminee) return;
    const lignes = partie.tentatives.map((tentative) => tentative.couleurs
      .map((couleur) => couleur === "vert" ? "🟩" : couleur === "jaune" ? "🟨" : "⬛")
      .join(""));
    const texte = `Le Mot Mystère ${new Date(`${partie.date}T00:00:00`).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })} · ${partie.gagnee ? `${partie.essais}/${nombreEssaisMax}` : "X/" + nombreEssaisMax}\n${lignes.join("\n")}`;
    try {
      await navigator.clipboard.writeText(texte);
      setCopiee(true);
      window.setTimeout(() => setCopiee(false), 2000);
    } catch {
      setMessage("La copie du résultat a échoué. Vérifie les autorisations du presse-papiers de ton navigateur.");
    }
  }

  const heure = Math.floor(tempsRestant / 3600000);
  const minutes = Math.floor((tempsRestant % 3600000) / 60000);
  const secondes = Math.floor((tempsRestant % 60000) / 1000);

  if (message && !partie) {
    return <main className="page content-page"><Navigation /><section className="card"><p className="message-box" role="alert">{message}</p><Link className="button button-secondary" to="/">Retour à l'accueil</Link></section></main>;
  }

  return (
    <main className="page jeu-page">
      <Navigation />
      <section className="card game-card">
        {!partie && <p role="status">Chargement du mot mystère…</p>}
        {partie && <>
          <div className="game-heading">
            <p className="eyebrow">{type === "jour" ? "Le mot du jour" : "Partie libre"}{difficile ? " · Mode difficile" : ""}</p>
            <h1>Bonjour {pseudo} !</h1>
            <p className="game-subtitle">
              Devine un mot de {longueur} lettres en {nombreEssaisMax} essais.
              {type === "jour" && <span className="countdown"> Nouveau mot dans {String(heure).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:{String(secondes).padStart(2, "0")}</span>}
            </p>
          </div>
          <div className="stats" aria-label="Statistiques de la partie">
            <div className="stat-card"><span className="stat-label">Points</span><span className="stat-value">{partie.points}</span></div>
            <div className="stat-card"><span className="stat-label">Essais restants</span><span className="stat-value">{Math.max(0, nombreEssaisMax - partie.tentatives.length)}</span></div>
          </div>
          <Resultat message={message} termine={partie.terminee} motFinal={partie.terminee ? partie.motMystere : ""} />
          <Formulaire
            mot={partie.motEnCours || ""}
            setMot={modifierProposition}
            onValider={validerProposition}
            termine={partie.terminee}
            verificationEnCours={verificationEnCours}
            longueur={longueur}
          />
          <Clavier onTouche={gererTouche} termine={partie.terminee} verificationEnCours={verificationEnCours} couleursLettres={couleursLettres} />
          <Grille tentatives={partie.tentatives} motRefuse={motRefuse} longueur={longueur} nombreEssaisMax={nombreEssaisMax} refusNumero={refusNumero} motEnCours={partie.motEnCours} />
          <div className="game-actions">
            <Link className="button button-secondary" to="/">Retour à l'accueil</Link>
            {partie.terminee && <button className="button button-secondary" type="button" onClick={partagerResultat}>{copiee ? "Résultat copié !" : "Partager le résultat"}</button>}
            {partie.terminee && <Link className="button button-secondary" to="/scores">Voir les scores</Link>}
          </div>
        </>}
      </section>
    </main>
  );
}

export default Jeu;
