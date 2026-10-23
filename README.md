# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
## Vérification des mots

Les propositions sont vérifiées à l'aide de l'API du Wiktionnaire français.

- Les mots reconnus comme des entrées françaises sont acceptés.
- Un mot refusé ne consomme pas de tentative.
- Pendant la vérification, le bouton de validation est désactivé pour éviter les doubles soumissions.
- Si l'API est indisponible ou si la requête échoue, un message d'erreur est affiché et aucune tentative n'est comptabilisée. Le joueur peut réessayer lorsque le service fonctionne à nouveau.
