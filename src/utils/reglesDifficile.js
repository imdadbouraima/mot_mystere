export function verifierReglesDifficile(tentatives, proposition) {
  for (const tentative of tentatives) {
    for (let index = 0; index < tentative.mot.length; index++) {
      const couleur = tentative.couleurs[index];
      const lettre = tentative.mot[index];

      if (couleur === "vert" && proposition[index] !== lettre) {
        return `La lettre ${lettre} révélée en vert doit rester en position ${index + 1}.`;
      }

      if (couleur === "jaune" && proposition[index] === lettre) {
        return `La lettre ${lettre} révélée en jaune ne peut pas rester en position ${index + 1}.`;
      }
    }
  }

  const lettresConnues = new Map();
  for (const tentative of tentatives) {
    const nombreParTentative = new Map();
    tentative.mot.split("").forEach((lettre, index) => {
      if (tentative.couleurs[index] === "vert" || tentative.couleurs[index] === "jaune") {
        nombreParTentative.set(lettre, (nombreParTentative.get(lettre) || 0) + 1);
      }
    });
    for (const [lettre, nombre] of nombreParTentative) {
      lettresConnues.set(lettre, Math.max(lettresConnues.get(lettre) || 0, nombre));
    }
  }

  for (const [lettre, nombreRequis] of lettresConnues) {
    const nombrePropose = proposition.split("").filter((candidate) => candidate === lettre).length;
    if (nombrePropose < nombreRequis) {
      return `La lettre ${lettre}, déjà révélée, doit apparaître au moins ${nombreRequis} fois dans la proposition.`;
    }
  }

  return "";
}
