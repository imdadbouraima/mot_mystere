import Ligne from "./Ligne";

function Grille({ tentatives, motRefuse }) {
  return (
    <div className="grille" aria-label="Grille des tentatives">
      {Array.from({ length: 6 }, (_, ligne) => (
        <Ligne
          key={ligne}
          tentative={tentatives[ligne]}
          motRefuse={
            ligne === tentatives.length ? motRefuse : ""
          }
        />
      ))}
    </div>
  );
}

export default Grille;