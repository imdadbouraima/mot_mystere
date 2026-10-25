
import Case from "./Case";

function Ligne({ tentative, motRefuse }) {
  return (
    <div className={`ligne ${motRefuse ? "ligne-refuse" : ""}`}>
      {Array.from({ length: 5 }, (_, colonne) => {
        const lettre =
          tentative?.mot[colonne] ||
          motRefuse?.[colonne] ||
          "";

        const couleur =
          tentative?.couleurs[colonne] ||
          (motRefuse?.[colonne] ? "refuse" : "");

        return (
          <Case
            key={colonne}
            lettre={lettre}
            couleur={couleur}
            delai={colonne * 200}
            animationActive={Boolean(tentative)}
          />
        );
      })}
    </div>
  );
}

export default Ligne;
