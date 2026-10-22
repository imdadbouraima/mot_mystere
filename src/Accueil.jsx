
import { useState } from "react";
import Jeu from "./Jeu";

function Accueil() {
  const [pseudo, setPseudo] = useState("");
  const [partieCommencee, setPartieCommencee] = useState(false);

  function envoyer(e) {
    e.preventDefault();
    console.log(`Pseudo envoyé : ${pseudo}`);
    setPartieCommencee(true);
  }

  return (
    <>
      {partieCommencee ? (
  <Jeu pseudo={pseudo} />
) : (
        <>
          <h1>Bienvenue dans le jeu de mot mystère</h1>

          <p>
            L'objectif du jeu est de deviner un mot mystère de 5 lettres en six
            tentatives. À chaque tentative, la lettre change de couleur.
            Au vert, la lettre est dans le mot et à la bonne place.
            Au jaune, la lettre est dans le mot mais à la mauvaise place.
            Au gris, la lettre n'est pas dans le mot ou pas autant de fois
            que proposé. Chaque partie gagnée vous rapporte des points.
            Bonne chance !
          </p>

          <h2>Entrer votre pseudo</h2>

          <form onSubmit={envoyer}>
            <p>
              <label htmlFor="pseudo">Pseudo</label>{" "}
              <input
                id="pseudo"
                type="text"
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                required
              />
            </p>

            <button type="submit">Lancer la partie</button>
          </form>
        </>
      )}
    </>
  );
}

export default Accueil;
