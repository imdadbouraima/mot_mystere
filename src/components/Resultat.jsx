import { motsAvecAccents } from "../services/motsService";

function Resultat({ message, termine, motFinal }) {
  const motAffiche =
    motsAvecAccents[motFinal.toLowerCase()] || motFinal;

  return (
    <>
      {message && (
        <p className="message-box" role="status">
          {message}
        </p>
      )}

      {termine && motFinal && (
        <p className="word-reveal">
          Mot mystère :{" "}
          <a
            href={`https://fr.wiktionary.org/wiki/${encodeURIComponent(
              motAffiche
            )}`}
            target="_blank"
            rel="noreferrer"
          >
            {motAffiche}
          </a>
        </p>
      )}
    </>
  );
}

export default Resultat;