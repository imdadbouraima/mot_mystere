export function comparerMots(motMystere, proposition) {
  const couleurs = Array(5).fill("gris");
  const lettresRestantes = motMystere.split("");

  // Lettres bien placées : vert
  for (let i = 0; i < 5; i++) {
    if (proposition[i] === lettresRestantes[i]) {
      couleurs[i] = "vert";
      lettresRestantes[i] = null;
    }
  }

  // Lettres présentes mais mal placées : jaune
  for (let i = 0; i < 5; i++) {
    if (couleurs[i] === "vert") continue;

    const index = lettresRestantes.indexOf(proposition[i]);

    if (index !== -1) {
      couleurs[i] = "jaune";
      lettresRestantes[index] = null;
    }
  }

  return couleurs;
}