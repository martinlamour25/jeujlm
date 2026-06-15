# ✊ Président·e du Peuple

**Le jeu de décision mobile pour gouverner selon _L'Avenir en commun_ — en soutien à la campagne de Jean-Luc Mélenchon en 2027.**

Pas un quiz : un **jeu de choix à la "swipe"** (dans l'esprit de _Reigns_), tendu, captivant et instructif. Tu viens d'être élu·e Président·e de la République. Des personnages viennent te soumettre un dilemme — à toi de **glisser la carte à gauche ou à droite** pour décider, et de **tenir ton mandat jusqu'en 2032**.

> Jeu **non officiel**, à but pédagogique. Tout le contenu s'appuie sur le programme _L'Avenir en commun_ (version actualisée) et les documents de campagne de la France insoumise.

---

## 🎴 Le concept

- À chaque carte, un personnage (le **MEDEF**, une **lycéenne**, la **Commission européenne**, le **GIEC**, un **général de l'OTAN**, un **syndicaliste**, un **spéculateur**…) te pose un dilemme bien réel.
- Tu **glisses** la carte **◀ à gauche** ou **▶ à droite** (ou tu utilises les deux boutons) pour trancher.
- Chaque décision fait évoluer **4 piliers** :

  | Pilier | Ce qu'il représente |
  |--------|---------------------|
  | ✊ **Peuple** | Démocratie & soutien populaire (6ᵉ République, RIC…) |
  | ⚖️ **Social** | Partage des richesses & services publics |
  | 🌍 **Planète** | Planification écologique |
  | 🕊️ **Souveraineté** | Indépendance, paix & démocratie internationale |

- **Gouverner, c'est arbitrer.** Appliquer le programme renforce le peuple, mais chaque choix a un coût : il faut tenir l'**équilibre** des quatre piliers.
- ⚠️ **Si un pilier tombe à zéro, ta présidence chute** : révocation par RIC, révolte sociale, effondrement écologique ou mise sous tutelle.
- 🎯 **Objectif** : survivre les 5 ans du mandat (**2027 → 2032**) en adoptant un maximum de **mesures phares** de _L'Avenir en commun_.

Chaque décision dévoile sa **conséquence** et une note **« 📖 L'Avenir en commun »** : on apprend le programme en gouvernant. Cartes tirées au hasard, **fins multiples**, rejouabilité → l'effet « encore une carte ».

## ✨ Caractéristiques

- 📱 **Natif mobile** : mécanique de **swipe** au pouce, une seule main, plein écran, safe-areas iOS, vibrations.
- 🎨 **Soigné** : identité aubergine → rouge insoumis, logo φ, avatars & jauges en SVG, cartes animées, confettis de victoire.
- 🧠 **Instructif** : **32 dilemmes** sourcés et **32 mesures** réelles du programme, chacune expliquée.
- ⚖️ **Stratégique** : système de 4 jauges équilibrées, difficulté réelle (jouer le programme de façon cohérente = victoire).
- ⚡ **Léger & sans dépendance** : HTML/CSS/JS pur, aucun framework, aucun build.
- 🔌 **PWA installable** : fonctionne hors-ligne (manifest + service worker). Record sauvegardé localement, **aucune donnée collectée**.

## 🚀 Lancer le jeu

Le jeu utilise un service worker : sers-le via un petit serveur local (le double-clic `file://` marche aussi, sans le mode hors-ligne).

```bash
python3 -m http.server 8000   # puis http://localhost:8000 (vue mobile dans les DevTools)
# ou
npx serve .
```

## 📁 Structure

```
.
├── index.html              # écrans : accueil · jeu · fin
├── styles.css              # design system mobile-first (jauges, cartes, swipe)
├── js/
│   ├── data.js             # 4 piliers + 32 cartes/dilemmes (issus du programme)
│   └── game.js             # moteur : swipe, jauges, mandat, conséquences, confettis
├── icons/icon.svg          # icône / logo φ
├── manifest.webmanifest    # PWA
├── sw.js                   # cache hors-ligne
└── README.md
```

## 🛠️ Ajouter une carte

Tout le contenu est dans `js/data.js`. Une carte = un personnage + deux choix, avec leurs effets sur les piliers (`p`, `s`, `e`, `v`) :

```js
{
  theme: "s", avatar: "worker", who: "Un délégué syndical",
  text: "« Le SMIC ne suffit plus pour vivre. »",
  right: { label: "Augmenter", fx: { s: 14, p: 8, v: -4 },
    result: "Le SMIC passe à 1 400 € nets.",
    note: "Vivre dignement de son travail.",
    measure: "SMIC à 1 400 € nets" },
  left:  { label: "Geler", fx: { s: -14, p: -10 },
    result: "Salaires gelés, la pauvreté grimpe.",
    note: "Le programme refuse les salaires de misère." }
}
```

`right` = choix conforme au programme · `left` = statu quo / option libérale. Avatars : `suit`, `worker`, `youth`, `scientist`, `general`, `eu`, `citizen`.

---

_« Place au peuple ! » — L'Avenir en commun._
