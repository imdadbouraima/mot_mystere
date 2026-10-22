import { useState, useEffect } from "react";

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


function Jeu({ pseudo }) {
const [mot, setMot] = useState("");
const [motMystere, setMotMystere] = useState("");
const [tentatives, setTentatives] = useState([]);
const [termine, setTermine] = useState(false);
const [message, setMessage] = useState("");
useEffect(() => {
  fetch("/mots_solutions.json")
    .then((reponse) => reponse.json())
    .then((listeMots) => {
const indexAleatoire = Math.floor(Math.random() * listeMots.length);
setMotMystere(listeMots[indexAleatoire]);    });
}, []);

  return (
    <>
      <h1>Bienvenue {pseudo} !</h1>

      <p>Devine le mot mystère de 5 lettres.</p>

      <p>Il te reste 6 tentatives.</p>
      <form  onSubmit={(e) => {
  e.preventDefault();

  const proposition = mot.toUpperCase();
const couleurs = comparerMots(motMystere.toUpperCase(), proposition);

setTentatives([...tentatives, { mot: proposition, couleurs }]);
setMot("");
}}>
  <input
    type="text"
    value={mot}
    onChange={(e) => setMot(e.target.value)}
    maxLength={5}
    minLength={5}
    required
  />

  <button type="submit">Valider</button>
</form>

      <div className="grille">
  {Array.from({ length: 6 }, (_, ligne) => (
    <div className="ligne" key={ligne}>
      {Array.from({ length: 5 }, (_, colonne) => (
        <div
  className={`case ${tentatives[ligne]?.couleurs[colonne] || ""}`}
  key={colonne}
>
  {tentatives[ligne]?.mot[colonne] || ""}
</div>
      ))}
    </div>
  ))}
</div>
    </>
  );
}

export default Jeu;