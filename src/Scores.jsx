import { useMemo, useState } from "react";
import Navigation from "./components/Navigation";
import { chargerParties } from "./services/donneesService";

function Scores() {
  const [parties] = useState(chargerParties);
  const [type, setType] = useState("general");
  const [longueur, setLongueur] = useState("toutes");
  const [difficulte, setDifficulte] = useState("tous");
  const aujourdhui = new Date().toISOString().slice(0, 10);
  const classement = useMemo(() => parties
    .filter((partie) => partie.terminee && partie.gagnee && (type === "general" || (partie.type === "jour" && partie.date === aujourdhui)))
    .filter((partie) => longueur === "toutes" || partie.longueur === Number(longueur))
    .filter((partie) => difficulte === "tous" || partie.difficile === (difficulte === "difficile"))
    .sort((a, b) => b.points - a.points || (type === "jour" ? a.dureeMs - b.dureeMs : b.termineeLe - a.termineeLe))
    .slice(0, 10), [parties, type, longueur, difficulte, aujourdhui]);

  return (
    <main className="page content-page">
      <Navigation />
      <section className="card">
        <p className="eyebrow">Les meilleurs résultats</p>
        <h1>Tableau des scores</h1>
        <div className="filter-row">
          <label>Classement
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="general">Général</option>
              <option value="jour">Mot du jour</option>
            </select>
          </label>
          <label>Longueur
            <select value={longueur} onChange={(e) => setLongueur(e.target.value)}>
              <option value="toutes">Toutes</option><option value="5">5 lettres</option>
              <option value="6">6 lettres</option><option value="7">7 lettres</option>
            </select>
          </label>
          <label>Mode
            <select value={difficulte} onChange={(e) => setDifficulte(e.target.value)}>
              <option value="tous">Tous</option><option value="normal">Normal</option><option value="difficile">Difficile</option>
            </select>
          </label>
        </div>
        <div className="table-scroll">
          <table>
            <thead><tr><th>#</th><th>Pseudo</th><th>Mot</th><th>Essais</th><th>Points</th><th>Longueur / mode</th><th>Date</th></tr></thead>
            <tbody>
              {classement.map((partie, index) => (
                <tr key={partie.id}>
                  <td>{index + 1}</td><td>{partie.pseudo}</td><td>{partie.motMystere.toLocaleUpperCase("fr")}</td>
                  <td>{partie.essais}/6</td><td>{partie.points}</td>
                  <td>{partie.longueur} lettres · {partie.difficile ? "Difficile" : "Normal"}</td>
                  <td>{new Date(`${partie.date}T00:00:00`).toLocaleDateString("fr-FR")}</td>
                </tr>
              ))}
              {!classement.length && <tr><td colSpan="7" className="empty-state">Aucun score ne correspond à ces filtres pour le moment.</td></tr>}
            </tbody>
          </table>
        </div>
        <p className="storage-note">Le classement est conservé dans le navigateur de cet appareil. Pour partager un classement entre ordinateurs, il faut le connecter à un service de base de données.</p>
      </section>
    </main>
  );
}

export default Scores;
