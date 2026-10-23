import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";


function comparerMots(motMystere, proposition) {
  const couleurs = Array(5).fill("gris");
  const lettresRestantes = motMystere.split("");


  // 1. Repérer les lettres bien placées
  for (let i = 0; i < 5; i++) {
    if (proposition[i] === lettresRestantes[i]) {
      couleurs[i] = "vert";
      lettresRestantes[i] = null;
    }
  }

  // 2. Repérer les lettres présentes mais mal placées
  for (let i = 0; i < 5; i++) {
    if (couleurs[i] === "vert") continue;

    const index = lettresRestantes.indexOf(proposition[i]);

    if (index !== -1) {
      couleurs[i] = "jaune";
      lettresRestantes[index] = null;
    }
  }

  return couleurs;
}

async function verifierMot(proposition) {
  const url = new URL("https://fr.wiktionary.org/w/api.php");

  url.search = new URLSearchParams({
    action: "parse",
    page: proposition.toLowerCase(),
    prop: "sections",
    format: "json",
    origin: "*"
  });

  const reponse = await fetch(url);

  if (!reponse.ok) {
    throw new Error("API indisponible");
  }

  const donnees = await reponse.json();

  if (donnees.error) {
    if (donnees.error.code === "missingtitle") {
      return false;
    }

    throw new Error("Erreur du Wiktionnaire");
  }

  const sections = donnees.parse?.sections;

  if (!sections) {
    throw new Error("Réponse du Wiktionnaire invalide");
  }

  console.log(sections.map((section) => section.line));

return sections.some((section) =>
  section.line.replace(/<[^>]*>/g, "").trim().toLowerCase() === "français"
);
}
const motsAvecAccents = {
  cable: "câble",
  coeur: "cœur",
  grace: "grâce",
  scene: "scène",
  ecran: "écran"
};

function Jeu() {
  const location = useLocation();
  const navigate = useNavigate();

  const pseudo = location.state?.pseudo || localStorage.getItem("pseudo") || "";
const [mot, setMot] = useState("");
const [verificationEnCours, setVerificationEnCours] = useState(false);
const [motRefuse, setMotRefuse] = useState("");
const [motMystere, setMotMystere] = useState("");
const [tentatives, setTentatives] = useState([]);
const [termine, setTermine] = useState(false);
const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [motFinal, setMotFinal] = useState("");
useEffect(() => {
  fetch("/mots_solutions.json")
    .then((reponse) => reponse.json())
    .then((listeMots) => {
const indexAleatoire = Math.floor(Math.random() * listeMots.length);
setMotMystere(listeMots[indexAleatoire]);    });
}, []);

function recommencer() {
  setMot("");
  setMotRefuse("");
  setMotFinal("");
  setTentatives([]);
  setTermine(false);
  setMessage("");
  setScore(0);

  fetch("/mots_solutions.json")
    .then((reponse) => reponse.json())
    .then((listeMots) => {
      const indexAleatoire = Math.floor(
        Math.random() * listeMots.length
      );
      setMotMystere(listeMots[indexAleatoire]);
    });
}

  return (
    <>
      <h1>Bienvenue {pseudo} !</h1>

      <p>Devine le mot mystère de 5 lettres.</p>
      <p>Score : {score}</p>
      

<p>Il te reste {6 - tentatives.length} tentatives.</p>

{message && <p>{message}</p>}

{termine && motFinal && (
  <p>
    Mot mystère :{" "}
    <a
      href={`https://fr.wiktionary.org/wiki/${encodeURIComponent(
        motsAvecAccents[motFinal.toLowerCase()] || motFinal
      )}`}
      target="_blank"
      rel="noreferrer"
    >
      {motsAvecAccents[motFinal.toLowerCase()] || motFinal}
    </a>
  </p>
)}

<form 
onSubmit={async (e) => {
  e.preventDefault();

  if (verificationEnCours || termine || !motMystere) return;

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

    if (proposition === motMystere.toUpperCase()) {
      const points = 7 - nouvellesTentatives.length;
      setScore(score + points);
      setMessage(`Bravo ! Tu gagnes ${points} points !`);
      setMotFinal(motMystere);
      setTermine(true);
    } else if (nouvellesTentatives.length === 6) {
      const motAffiche =
  motsAvecAccents[motMystere.toLowerCase()] || motMystere;

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
}}
>



  <input
    type="text"
    value={mot}
    onChange={(e) => setMot(e.target.value)}
    maxLength={5}
    minLength={5}
    required
disabled={termine || verificationEnCours}  />
  <button type="submit" disabled={termine || verificationEnCours}>
  {verificationEnCours ? "Vérification..." : "Valider"}
</button>
<button type="button" onClick={() => navigate("/")}>
  Retour à l'accueil
</button>
</form>
 

{termine && (
  <button type="button" onClick={recommencer}>
    Recommencer
  </button>
  
)}

      <div className="grille">
  {Array.from({ length: 6 }, (_, ligne) => (
    <div className="ligne" key={ligne}>
      {Array.from({ length: 5 }, (_, colonne) => (
        <div
  className={`case ${
  tentatives[ligne]?.couleurs[colonne] ||
  (ligne === tentatives.length && motRefuse ? "refuse" : "")
}`}
  key={colonne}
>
  {tentatives[ligne]?.mot[colonne] ||
  (ligne === tentatives.length ? motRefuse[colonne] || "" : "")}
</div>
      ))}
    </div>
  ))}
</div>
    </>
  );
}

export default Jeu;