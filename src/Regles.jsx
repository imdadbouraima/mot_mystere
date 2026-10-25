import Navigation from "./components/Navigation";

function Regles() {
  return (
    <main className="page content-page">
      <Navigation />
      <section className="card rules-page">
        <p className="eyebrow">Comment jouer</p>
        <h1>Les règles</h1>
        <p>Devine le mot secret en six essais. Chaque proposition doit être un mot français de la longueur choisie. Le clavier à l’écran et le clavier de ton appareil sont utilisables.</p>
        <h2 className="section-heading">Comprendre les couleurs</h2>
        <div className="example-word" aria-label="Exemple de couleurs">
          <span className="case gris">C</span><span className="case jaune">H</span><span className="case vert">A</span><span className="case gris">T</span><span className="case gris">S</span>
        </div>
        <ul className="rules-list">
          <li><span className="legend-swatch vert" /> <strong>Vert</strong> : la lettre est dans le mot et à la bonne place.</li>
          <li><span className="legend-swatch jaune" /> <strong>Jaune</strong> : la lettre est dans le mot, mais à une autre place.</li>
          <li><span className="legend-swatch gris" /> <strong>Gris</strong> : la lettre n’est pas présente (ou toutes ses occurrences ont déjà été trouvées).</li>
        </ul>
        <h2 className="section-heading">Modes et points</h2>
        <p>En partie libre, choisis un mot de 5, 6 ou 7 lettres. Les points de base dépendent du nombre d’essais utilisés : 6 points au premier essai, jusqu’à 1 point au sixième. La longueur applique un multiplicateur de ×1,5 pour 6 lettres et ×2 pour 7 lettres. Le mode difficile ajoute un multiplicateur ×1,5.</p>
        <p>En mode difficile, les lettres vertes restent à la même place. Les lettres jaunes doivent être réutilisées et déplacées. Les lettres répétées doivent être conservées en quantité au moins égale aux indices révélés.</p>
        <p>Le mot du jour est identique pour tous les joueurs et change à minuit UTC. Il ne peut être joué qu’une seule fois par pseudo et par jour sur cet appareil.</p>
      </section>
    </main>
  );
}

export default Regles;
