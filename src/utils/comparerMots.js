export function comparerMots(motMystere, proposition) {
  const cible = motMystere.toUpperCase();
  const essai = proposition.toUpperCase();
  const couleurs = Array(cible.length).fill("gris");
  const lettresRestantes = cible.split("");

  for (let i = 0; i < cible.length; i++) {
    if (essai[i] === lettresRestantes[i]) {
      couleurs[i] = "vert";
      lettresRestantes[i] = null;
    }
  }

  for (let i = 0; i < cible.length; i++) {
    if (couleurs[i] === "vert") continue;

    const index = lettresRestantes.indexOf(essai[i]);

    if (index !== -1) {
      couleurs[i] = "jaune";
      lettresRestantes[index] = null;
    }
  }

  return couleurs;
}