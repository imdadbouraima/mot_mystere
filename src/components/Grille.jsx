import Ligne from "./Ligne";

function Grille({ tentatives, motRefuse, longueur = 5, nombreEssaisMax = 6, refusNumero = 0, motEnCours = "" }) {
  return (
    <div className="grille" aria-label="Grille des tentatives">
      {Array.from({ length: nombreEssaisMax }, (_, ligne) => (
        <Ligne
          key={ligne === tentatives.length && motRefuse ? `refus-${refusNumero}` : ligne}
          tentative={tentatives[ligne]}
          longueur={longueur}
          motEnCours={ligne === tentatives.length ? motEnCours : ""}
          motRefuse={
            ligne === tentatives.length ? motRefuse : ""
          }
        />
      ))}
    </div>
  );
}

export default Grille;