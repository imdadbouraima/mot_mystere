export const motsAvecAccents = {
  cable: "câble",
  coeur: "cœur",
  grace: "grâce",
  scene: "scène",
  ecran: "écran"
};

export async function chargerMotMystere(longueur = 5) {
  const fichier = longueur === 5 ? "mots_solutions.json" : `mots_solutions_${longueur}.json`;
  const reponse = await fetch(`/${fichier}`);

  if (!reponse.ok) {
    throw new Error("Impossible de charger les mots");
  }

  const listeMots = await reponse.json();

  if (!Array.isArray(listeMots) || !listeMots.length) {
    throw new Error("La liste des mots est vide");
  }

  const motsValides = listeMots.filter((mot) => typeof mot === "string" && mot.length === longueur);
  if (!motsValides.length) throw new Error(`Aucun mot de ${longueur} lettres disponible.`);
  const indexAleatoire = Math.floor(Math.random() * motsValides.length);

  return motsValides[indexAleatoire];
}

export async function chargerMotDuJour(date = new Date()) {
  const liste = await chargerListeMots(5);
  const jour = date.toISOString().slice(0, 10);
  const hash = [...jour].reduce((total, caractere) => (total * 31 + caractere.charCodeAt(0)) >>> 0, 0);
  return liste[hash % liste.length];
}

async function chargerListeMots(longueur) {
  const fichier = longueur === 5 ? "mots_solutions.json" : `mots_solutions_${longueur}.json`;
  const reponse = await fetch(`/${fichier}`);
  if (!reponse.ok) throw new Error("Impossible de charger les mots");
  const liste = await reponse.json();
  if (!Array.isArray(liste)) throw new Error("La liste de mots est invalide");
  return liste.filter((mot) => typeof mot === "string" && mot.length === longueur);
}

export function obtenirDateUTC(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function obtenirTempsAvantMinuitUTC(date = new Date()) {
  const prochainMinuit = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1);
  return Math.max(0, prochainMinuit - date.getTime());
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