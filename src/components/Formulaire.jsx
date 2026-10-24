function Formulaire({
  mot,
  setMot,
  onValider,
  termine,
  verificationEnCours
}) {
  return (
    <form className="guess-form" onSubmit={onValider}>
      <input
        type="text"
        aria-label="Proposition de cinq lettres"
        placeholder="ABCDE"
        value={mot}
        onChange={(e) => setMot(e.target.value)}
        maxLength={5}
        minLength={5}
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