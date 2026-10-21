
import { useState } from "react";

function Accueil() {
  const [pseudo, setPseudo] = useState("");

  function envoyer(e) {
    e.preventDefault();
    console.log(`Pseudo envoyé : ${pseudo}`);
  }

  return (
    <>
      <h1>Entrer votre pseudo</h1>

      <form onSubmit={envoyer}>
        <p>
          <label htmlFor="pseudo">Pseudo</label>{" "}
          <input
            id="pseudo"
            type="text"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
          />
        </p>

        <button type="submit">Lancer la partie</button>
      </form>
    </>
  );
}

export default Accueil;
