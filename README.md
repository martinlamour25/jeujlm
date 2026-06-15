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

## 🎬 Nouveautés (édition « cinématique »)

- **Cinématique d'ouverture** : le chaos du bilan Macron (hôpitaux à l'os, 49.3,
  « pognon de dingue »…), le peuple qui se lève, puis la **victoire de la France
  insoumise au second tour 2027** — avant de prendre les rênes.
- **Le bon choix alterne** désormais entre la gauche et la droite (fini le
  « toujours à droite ») — il faut vraiment lire la carte.
- **Anti-doublons** : plus de cartes répétées dans une même partie.
- **Dirigeants du monde à étriller** : Trump (Groenland & tarifs), Netanyahou
  (Gaza), Poutine (Ukraine), Elon Musk (X & désinformation) — répliques
  sarcastiques inspirées de l'actu.
- **Musique qui monte en pression** : tempo et rythme s'intensifient à chaque acte.
- **Mélenchon plus réaliste** (nouvel avatar) et style graphique **« blocs 3D »**
  inspiré des affiches de la campagne Mélenchon 2027.

## 🆕 Édition « Fun »

- **Adversaires politiques caricaturés** : affronte Manu Macron (« en même temps »),
  Marinette Le Pen, Jordy Bardella, Flamby Hollande, Gégé Darmanin, Brunito
  Retailleau, Gaby Attal, Edmond Philippe, Raph Glucksmann, Frankie Ruffin, Érik
  Zemmour — chacun avec son avatar et ses répliques inspirées de l'actualité.
- **Jean-Luc Mélenchon** intervient en mentor (avatar dédié) pour relancer la
  marée populaire (« On ne lâche rien ! »).
- **Élan populaire 🔥** : enchaîne les décisions conformes au programme pour des
  combos et des **voix**.
- **Aperçu d'impact** au glissement de la carte (flèches sur les jauges).
- **4 niveaux de difficulté** (Découverte → Hardcore).
- **Punchlines** satiriques + **« La Une du Peuple »** générée en fin de partie.
- **Image de bilan partageable** (PNG) aux couleurs de la campagne.
- **Plus de jus** : secousses d'écran, particules ✊/💸, pile de cartes, et
  **musique adaptative** (monte en tension) + nouveaux effets sonores.
- Le **SMIC est porté à 1 800 € nets dès 2027** (programme actualisé).
- **50 cartes**, 28 portraits, 17 décors, arcs narratifs et fins multiples.

> Voir aussi `docs/SPECS-FUN.md` pour la feuille de route complète.

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
