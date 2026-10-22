import { useState, useEffect } from "react";

function Jeu({ pseudo }) {
const [mot, setMot] = useState("");
const [motMystere, setMotMystere] = useState("");

  return (
    <>
      <h1>Bienvenue {pseudo} !</h1>

      <p>Devine le mot mystère de 5 lettres.</p>

      <p>Il te reste 6 tentatives.</p>
      <form onSubmit={(e) => {
  e.preventDefault();
  console.log(mot);
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
              <div className="case" key={colonne}></div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default Jeu;