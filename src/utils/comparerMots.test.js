import test from "node:test";
import assert from "node:assert/strict";
import { comparerMots } from "./comparerMots.js";
import { verifierReglesDifficile } from "./reglesDifficile.js";

test("compare une proposition entièrement correcte", () => {
  assert.deepEqual(comparerMots("POMME", "POMME"), ["vert", "vert", "vert", "vert", "vert"]);
});

test("n'attribue qu'un jaune pour la lettre supplémentaire", () => {
  assert.deepEqual(comparerMots("POMME", "MAMMA"), ["gris", "gris", "vert", "vert", "gris"]);
});

test("gère les lettres répétées dans le mot cible", () => {
  assert.deepEqual(comparerMots("PAPAL", "PAAPA"), ["vert", "vert", "jaune", "jaune", "gris"]);
});

test("gère les lettres répétées dans la proposition sans dépasser leur nombre cible", () => {
  assert.deepEqual(comparerMots("POMME", "MMMMM"), ["gris", "gris", "vert", "vert", "gris"]);
});

test("compare des mots de six lettres", () => {
  assert.deepEqual(comparerMots("BANANE", "BANANE"), Array(6).fill("vert"));
});

test("le mode difficile impose les verts, les jaunes et leur quantité", () => {
  const tentatives = [{ mot: "POMME", couleurs: ["vert", "jaune", "gris", "gris", "gris"] }];
  assert.match(verifierReglesDifficile(tentatives, "POMPA"), /vert/);
  assert.match(verifierReglesDifficile(tentatives, "POMME"), /jaune/);
  assert.equal(verifierReglesDifficile(tentatives, "PEMOP"), "");
});
