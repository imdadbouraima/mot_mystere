export const motsAvecAccents = {
  cable: "câble",
  coeur: "cœur",
  grace: "grâce",
  scene: "scène",
  ecran: "écran"
};

export async function chargerMotMystere() {
  const reponse = await fetch("/mots_solutions.json");

  if (!reponse.ok) {
    throw new Error("Impossible de charger les mots");
  }

  const listeMots = await reponse.json();

  if (!listeMots.length) {
    throw new Error("La liste des mots est vide");
  }

  const indexAleatoire = Math.floor(
    Math.random() * listeMots.length
  );

  return listeMots[indexAleatoire];
}

export async function verifierMot(proposition) {
  const url = new URL("https://fr.wiktionary.org/w/api.php");

  url.search = new URLSearchParams({
    action: "parse",
    page: proposition.toLowerCase(),
    prop: "sections",
    format: "json",
    origin: "*"
  });

  const reponse = await fetch(url);

  if (!reponse.ok) {
    throw new Error("API indisponible");
  }

  const donnees = await reponse.json();

  if (donnees.error) {
    if (donnees.error.code === "missingtitle") {
      return false;
    }

    throw new Error("Erreur du Wiktionnaire");
  }

  const sections = donnees.parse?.sections;

  if (!sections) {
    throw new Error("Réponse du Wiktionnaire invalide");
  }

  return sections.some((section) =>
    section.line
      .replace(/<[^>]*>/g, "")
      .trim()
      .toLowerCase() === "français"
  );
}