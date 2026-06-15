# ✊ Place au Peuple 2027

**Le jeu web citoyen pour découvrir le programme _L'Avenir en commun_ et soutenir la campagne de Jean-Luc Mélenchon en 2027.**

Un jeu mobile-first, beau, complet et **instructif** : on apprend le programme en menant une campagne, étape par étape, jusqu'à la victoire de l'élection présidentielle.

> Jeu **non officiel**, à but pédagogique. Tout le contenu s'appuie sur le programme _L'Avenir en commun_ (version actualisée) et les documents de campagne de la France insoumise fournis.

---

## 🎮 Le concept

Tu mènes une **campagne citoyenne en 7 étapes** — une par chapitre du programme :

| # | Étape | Chapitre du programme |
|---|-------|------------------------|
| 1 | 6ᵉ République | Face à la crise démocratique |
| 2 | Partager les richesses | Face à l'urgence sociale |
| 3 | Planification écologique | Face à la crise climatique |
| 4 | Sortir des traités | Face à la crise européenne |
| 5 | Indépendance & paix | Face à la guerre |
| 6 | Progrès humain | Face à la grande régression |
| 7 | Frontières de l'Humanité | Face au déclinisme |

À chaque étape, tu réponds à des questions (QCM et Vrai/Faux) tirées du programme :

- **Vite et juste** → plus de **voix** (bonus de rapidité).
- **Enchaîne les bonnes réponses** → **combos 🔥** qui multiplient le score.
- Chaque étape rapporte des **étoiles** (jusqu'à 3) et fait monter la **jauge de soutien populaire**.
- **Franchis les 50 %** → tu gagnes l'élection 2027 et tu convoques la 6ᵉ République ! 🎉
- Bonne ou mauvaise réponse, **une explication s'affiche** : on retient le programme.

La progression et le meilleur score sont sauvegardés **localement** sur l'appareil (aucune donnée collectée).

## ✨ Caractéristiques

- 📱 **Mobile-first** : conçu pour le pouce, plein écran, zones de tap larges, safe-areas iOS.
- 🎨 **Soigné graphiquement** : identité aubergine → rouge insoumis, logo φ, illustrations SVG, fond animé, confettis de victoire.
- 🧠 **Instructif** : ~35 questions sourcées, avec explication « 📖 L'Avenir en commun ».
- ⚡ **Léger & sans dépendance** : HTML/CSS/JS pur, aucun framework, aucun build.
- 🔌 **Installable (PWA)** : fonctionne hors-ligne une fois ouvert (manifest + service worker).
- ♿ **Accessible** : respecte `prefers-reduced-motion`, contrastes élevés.

## 🚀 Lancer le jeu

Comme le jeu utilise un service worker, sers-le via un petit serveur local (le double-clic `file://` fonctionne aussi, sans le mode hors-ligne) :

```bash
# Python
python3 -m http.server 8000
# puis ouvrir http://localhost:8000  (idéalement en vue mobile dans les devtools)
```

```bash
# ou Node
npx serve .
```

## 📁 Structure

```
.
├── index.html              # structure des écrans
├── styles.css              # design system mobile-first
├── js/
│   ├── data.js             # contenu : 7 thèmes + questions (issu du programme)
│   └── game.js             # moteur : navigation, quiz, score, carte, confettis
├── icons/icon.svg          # icône / logo φ
├── manifest.webmanifest    # PWA
├── sw.js                   # cache hors-ligne
└── README.md
```

## 🛠️ Étendre le jeu

Tout le contenu est dans `js/data.js`. Pour ajouter une question, complète le tableau `questions` d'un thème :

```js
{ type: "qcm", q: "…", options: ["…", "…"], answer: 0, why: "Explication." }
{ type: "vf",  q: "…", answer: true, why: "Explication." }
```

---

_« Place au peuple ! » — L'Avenir en commun._
