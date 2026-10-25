const CLE_PARTIES = "motMystere.parties.v1";
const CLE_REGLAGES = "motMystere.reglages.v1";
const CLE_PSEUDOS = "motMystere.pseudos.v1";

function lire(cle, valeurParDefaut) {
  const valeur = localStorage.getItem(cle);
  if (valeur === null) return valeurParDefaut;
  try {
    return JSON.parse(valeur);
  } catch {
    throw new Error(`Les données enregistrées pour « ${cle} » sont illisibles.`);
  }
}

function enregistrer(cle, valeur) {
  localStorage.setItem(cle, JSON.stringify(valeur));
}

export function chargerParties() {
  const parties = lire(CLE_PARTIES, []);
  if (!Array.isArray(parties)) throw new Error("L'historique des parties est invalide.");
  return parties;
}

export function sauvegarderPartie(partie) {
  const parties = chargerParties();
  const index = parties.findIndex((element) => element.id === partie.id);
  if (index === -1) parties.push(partie);
  else parties[index] = partie;
  enregistrer(CLE_PARTIES, parties);
}

export function chargerReglages() {
  const reglages = lire(CLE_REGLAGES, { longueur: 5, difficile: false });
  return {
    longueur: [5, 6, 7].includes(Number(reglages.longueur)) ? Number(reglages.longueur) : 5,
    difficile: Boolean(reglages.difficile)
  };
}

export function sauvegarderReglages(reglages) {
  enregistrer(CLE_REGLAGES, reglages);
}

export function chargerPseudos() {
  const pseudos = lire(CLE_PSEUDOS, []);
  return Array.isArray(pseudos) ? pseudos : [];
}

export function sauvegarderPseudo(pseudo) {
  const pseudos = chargerPseudos();
  if (!pseudos.some((element) => element.toLocaleLowerCase("fr") === pseudo.toLocaleLowerCase("fr"))) {
    pseudos.push(pseudo);
    enregistrer(CLE_PSEUDOS, pseudos);
  }
}

export function creerStatistiques(parties, pseudo) {
  const personnelles = parties
    .filter((partie) => partie.terminee && partie.pseudo.toLocaleLowerCase("fr") === pseudo.toLocaleLowerCase("fr"))
    .sort((a, b) => a.date.localeCompare(b.date) || a.termineeLe - b.termineeLe);
  const victoires = personnelles.filter((partie) => partie.gagnee);
  let serieActuelle = 0;
  for (const partie of [...personnelles].reverse()) {
    if (!partie.gagnee) break;
    serieActuelle++;
  }
  let meilleureSerie = 0;
  let serie = 0;
  for (const partie of personnelles) {
    serie = partie.gagnee ? serie + 1 : 0;
    meilleureSerie = Math.max(meilleureSerie, serie);
  }
  return {
    partiesJouees: personnelles.length,
    pourcentageVictoires: personnelles.length ? Math.round((victoires.length / personnelles.length) * 100) : 0,
    serieActuelle,
    meilleureSerie,
    totalPoints: personnelles.reduce((total, partie) => total + partie.points, 0),
    repartition: Array.from({ length: 6 }, (_, index) => victoires.filter((partie) => partie.essais === index + 1).length)
  };
}
