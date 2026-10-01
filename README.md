# Collector — Frontend

Interface web de Collector, marketplace d'objets de collection entre particuliers.
POC : afficher les annonces et déposer une nouvelle annonce.

Backend associé (API REST) : [collector-backend](https://github.com/AlexiiisFer/collector-backend)

## Stack

React 19 + TypeScript, Vite, Tailwind CSS, shadcn/ui (composants Radix).

```
src/
├── api/annonces.ts     Types + appels REST (seul point de contact avec le backend)
├── components/         Composants métier (AnnonceCard, DeposerAnnonceDialog)
├── components/ui/      Composants shadcn/ui (code copié dans le projet, modifiable)
└── App.tsx             Page principale
```

## Lancer le projet

Prérequis : Node.js 20.19+ et le [backend](https://github.com/AlexiiisFer/collector-backend) démarré sur `http://localhost:8080`.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # build de production dans dist/
```

L'URL du backend est définie dans `.env` (`VITE_API_URL`) et peut être surchargée dans un `.env.local`.

## Choix techniques

- **React + Vite** : écosystème standard, build rapide, typage TypeScript aligné sur les DTO du backend.
- **Tailwind + shadcn/ui** : composants accessibles sans dépendre d'une librairie figée — leur code vit dans le projet.
- Pas de librairie de formulaires ni de gestion d'état : inutiles à ce stade.
