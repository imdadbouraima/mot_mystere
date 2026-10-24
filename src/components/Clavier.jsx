function Clavier({
  onTouche,
  termine,
  verificationEnCours,
  couleursLettres
}) {
  const lignes = [
    ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["Q", "S", "D", "F", "G", "H", "J", "K", "L", "M"],
    ["W", "X", "C", "V", "B", "N"]
  ];

  return (
    <div className="clavier">
      {lignes.map((ligne, index) => (
        <div className="clavier-ligne" key={index}>
          {ligne.map((lettre) => (
            <button
              key={lettre}
              type="button"
              className={couleursLettres[lettre] || ""}
              onClick={() => onTouche(lettre)}
              disabled={termine || verificationEnCours}
            >
              {lettre}
            </button>
          ))}
        </div>
      ))}

      <div className="clavier-ligne">
        <button
          type="button"
          onClick={() => onTouche("EFFACER")}
          disabled={termine || verificationEnCours}
        >
          Retour arrière
        </button>

        <button
          type="button"
          onClick={() => onTouche("ENTRÉE")}
          disabled={termine || verificationEnCours}
        >
          Entrée
        </button>
      </div>
    </div>
  );
}

export default Clavier;