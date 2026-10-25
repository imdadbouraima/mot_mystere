function Formulaire({
  mot,
  setMot,
  onValider,
  termine,
  verificationEnCours,
  longueur
}) {
  return (
    <form className="guess-form" onSubmit={onValider}>
      <input
        type="text"
        aria-label={`Proposition de ${longueur} lettres`}
        placeholder={"_".repeat(longueur)}
        value={mot}
        onChange={(e) => setMot(e.target.value)}
        maxLength={longueur}
        minLength={longueur}
        required
        disabled={termine || verificationEnCours}
      />

      <button
        className="button button-primary"
        type="submit"
        disabled={termine || verificationEnCours}
      >
        {verificationEnCours ? "Vérification..." : "Valider"}
      </button>
    </form>
  );
}

export default Formulaire;