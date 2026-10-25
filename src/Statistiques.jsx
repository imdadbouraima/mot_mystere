import { useMemo, useState } from "react";
import Navigation from "./components/Navigation";
import { chargerParties, chargerPseudos, creerStatistiques } from "./services/donneesService";

function Statistiques() {
  const [parties] = useState(chargerParties);
  const pseudosEnregistres = useMemo(() => [...new Set([
    ...chargerPseudos(),
    ...parties.map((partie) => partie.pseudo)
  ])], [parties]);
  const [pseudo, setPseudo] = useState(localStorage.getItem("pseudo") || pseudosEnregistres[0] || "");
  const statistiques = useMemo(() => creerStatistiques(parties, pseudo), [parties, pseudo]);
  const maximum = Math.max(1, ...statistiques.repartition);

  return (
    <main className="page content-page">
      <Navigation />
      <section className="card">
        <p className="eyebrow">Ton historique</p>
        <h1>Statistiques du joueur</h1>
        <label className="player-select">Joueur
          <select value={pseudo} onChange={(e) => setPseudo(e.target.value)}>
            {!pseudosEnregistres.length && <option value="">Aucun joueur enregistré</option>}
            {pseudosEnregistres.map((nom) => <option key={nom} value={nom}>{nom}</option>)}
          </select>
        </label>
        <div className="stats stats-page">
          <div className="stat-card"><span className="stat-label">Parties jouées</span><span className="stat-value">{statistiques.partiesJouees}</span></div>
          <div className="stat-card"><span className="stat-label">Victoires</span><span className="stat-value">{statistiques.pourcentageVictoires}%</span></div>
          <div className="stat-card"><span className="stat-label">Série actuelle</span><span className="stat-value">{statistiques.serieActuelle}</span></div>
          <div className="stat-card"><span className="stat-label">Meilleure série</span><span className="stat-value">{statistiques.meilleureSerie}</span></div>
          <div className="stat-card"><span className="stat-label">Total des points</span><span className="stat-value">{statistiques.totalPoints}</span></div>
        </div>
        <h2 className="section-heading">Répartition des victoires selon les essais</h2>
        <div className="distribution" aria-label="Répartition des victoires par nombre d'essais">
          {statistiques.repartition.map((nombre, index) => (
            <div className="distribution-row" key={index}>
              <span>{index + 1} {index === 0 ? "essai" : "essais"}</span>
              <div className="distribution-track"><span style={{ width: `${(nombre / maximum) * 100}%` }} /></div>
              <strong>{nombre}</strong>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Statistiques;
