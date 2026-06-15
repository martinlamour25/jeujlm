# 🎮 Président·e du Peuple — Spécifications « Fun & Amusant »

> Document de game design (GDD) v1.0 — feuille de route pour rendre le jeu plus
> fun, drôle, addictif et rejouable, **en partant de la base existante**
> (modes Histoire/Survie, 4 piliers `p/s/e/v`, cartes à `swipe`, drapeaux/arcs,
> illustrations SVG `CHAR_ART`/`SCENES`, audio Web Audio `SOUND`).
>
> Jeu citoyen **non officiel** en soutien à la campagne 2027, basé sur
> *L'Avenir en commun*. Toute mécanique reste au service de la pédagogie :
> on s'amuse **en apprenant le programme**.

---

## 0. Sommaire

1. [Vision & piliers du fun](#1-vision--piliers-du-fun)
2. [Boucles de jeu](#2-boucles-de-jeu)
3. [Nouvelles mécaniques de gameplay](#3-nouvelles-mécaniques-de-gameplay)
4. [Personnages récurrents & relations](#4-personnages-récurrents--relations)
5. [Humour, ton & écriture](#5-humour-ton--écriture)
6. [Arcs narratifs & contenu](#6-arcs-narratifs--contenu)
7. [Méta-progression & déblocables](#7-méta-progression--déblocables)
8. [Modes de jeu](#8-modes-de-jeu)
9. [Difficulté & équilibrage](#9-difficulté--équilibrage)
10. [Game feel / juice](#10-game-feel--juice)
11. [Audio adaptatif](#11-audio-adaptatif)
12. [Direction artistique](#12-direction-artistique)
13. [Onboarding & accessibilité](#13-onboarding--accessibilité)
14. [Partage social & viralité](#14-partage-social--viralité)
15. [Schémas de données (extensions)](#15-schémas-de-données-extensions)
16. [Architecture technique](#16-architecture-technique)
17. [Roadmap & priorisation](#17-roadmap--priorisation)
18. [KPIs du fun](#18-kpis-du-fun)
19. [Annexe — backlog de cartes & arcs](#19-annexe--backlog-de-cartes--arcs)

---

## 1. Vision & piliers du fun

**Pitch :** *« Tu es Président·e. Le peuple t'a confié les clés. Survis aux
crises, déjoue les pièges des puissants, et écris la 6ᵉ République — une carte
à la fois. »*

### Les 5 piliers du fun (boussole de toutes les décisions de design)

| Pilier | Ce que le joueur doit ressentir | Levier principal |
|--------|--------------------------------|------------------|
| **Tension** | « Je suis sur le fil, un mauvais choix et tout s'écroule » | Jauges, pression mensuelle, crises |
| **Conséquence** | « Mes choix comptent et reviennent me hanter » | Arcs, drapeaux, personnages récurrents |
| **Surprise** | « Je ne sais jamais qui va frapper à la porte » | Événements aléatoires, cartes rares, twists |
| **Maîtrise** | « Je progresse, je comprends le système, je deviens bon » | Méta-progression, combos, feedback clair |
| **Sourire** | « C'est mordant, satirique, ça me fait rire » | Écriture, caricatures, *Unes* de presse |

> **Règle d'or :** chaque nouvelle feature doit cocher **au moins 2 piliers**.
> Sinon, on coupe.

---

## 2. Boucles de jeu

### Boucle micro (≈10 s) — *la carte*
`Lire le dilemme` → `pressentir l'impact` → `swipe` → `conséquence + delta jauges`
→ `punchline / mesure adoptée` → carte suivante.
**Amélioration fun :** ajouter un *aperçu d'impact* au drag (cf. §3.1) pour
récompenser l'anticipation.

### Boucle méso (≈5 min) — *une partie*
`Choix du mode` → `enchaînement de cartes + crises` → `fin (victoire/chute)` →
`écran de bilan + Une de presse partageable` → `déblocages` → `rejouer`.
**Amélioration fun :** l'écran de fin doit **toujours** donner une raison de
rejouer (succès manqué de peu, mesure rare entrevue, meilleur score à battre).

### Boucle macro (jours/semaines) — *la collection*
`Débloquer des mesures/badges` → `monter en "Conscience politique"` →
`débloquer arcs, persos, mutateurs, skins` → `viser le 100 % de collection` →
`Défi quotidien` pour revenir chaque jour.

---

## 3. Nouvelles mécaniques de gameplay

### 3.1 Aperçu d'impact au drag *(Must)*
Au glissement de la carte, afficher **discrètement** les piliers qui vont monter
/ descendre **sans révéler les chiffres** (juste des flèches colorées ↑↓ qui
s'intensifient avec la distance de drag).
- **Fun :** récompense la lecture et l'anticipation (pilier *Maîtrise*).
- **Option difficulté :** désactivable en mode « Hardcore » (cf. §9).
- **Données :** lire `card[side].fx`, mapper en flèches sur les 4 jauges.
- **Acceptation :** au drag > 40 px, ≥1 flèche apparaît ; relâché sous le seuil,
  tout disparaît.

### 3.2 Élan populaire (combo) *(Must)*
Compteur d'**enchaînement** quand on prend plusieurs décisions conformes au
programme d'affilée (`measure` adoptée ou choix `right`).
- À x3, x5, x8 : **multiplicateur de "voix"** (score) et **bonus visuel/sonore**
  (« 🔥 Le peuple est avec toi ! »).
- Un choix « libéral » (option `left` marquée `betray:true`) **casse l'élan**.
- **Fun :** crée un rythme, une griserie, une prise de risque.
- **Données :** `state.combo`, `card[side].betray?`. Score `voix += base * mult`.
- **Acceptation :** l'UI montre le combo dès x2 ; reset visible à la casse.

### 3.3 Conseillers / Gouvernement *(Should)*
Avant la partie (Histoire) : **composer son gouvernement** en choisissant 2
conseillers parmi un panel (ex. *Ministre de la Planification*, *Ministre de
l'Éducation populaire*, *Cheffe de la diplomatie*).
- Chaque conseiller donne un **bonus passif** (ex. +2 récup/mois sur Planète) et
  **un pouvoir actif** utilisable 1×/partie (ex. « Réquisition » : annule la
  prochaine perte sur un pilier).
- **Fun :** personnalisation, builds, rejouabilité (piliers *Maîtrise/Surprise*).
- **Données :** `ADVISORS[]` (id, nom, portrait, passif, actif).
- **Acceptation :** bonus appliqués au calcul de `applyPressure`/`fx` ; pouvoir
  actif avec cooldown « 1 fois ».

### 3.4 Référendum / RIC interactif *(Should)*
Carte spéciale périodique : un **mini-jeu de jauge** où le joueur doit
« convaincre » en tapotant pour remplir une barre avant la fin du temps.
Réussite → gros bonus Peuple + mesure RIC ; échec → léger malus.
- **Fun :** rupture de rythme, mini-défi d'adresse (pilier *Surprise*).
- **Acceptation :** déclenché tous les ~8 tours ou via un arc ; skippable au tap.

### 3.5 Cartes rares & événements « breaking news » *(Must)*
Système de **rareté** : `common / topical / rare / legendary`.
- Les **rares/legendary** apparaissent peu (ex. « Le peuple manifeste sa joie :
  +festival », « Un lanceur d'alerte te confie un dossier explosif »).
- Bandeau **🔴 BREAKING** animé pour les crises d'actualité.
- **Fun :** la dopamine de la rencontre rare, collectionnable.
- **Données :** `card.rarity`, pondération dans `pickInfinite()`.
- **Acceptation :** distribution vérifiable (rare ≤ 8 %, legendary ≤ 2 %).

### 3.6 Ressources & jauge secrète « Trésor public » *(Could)*
Une 5ᵉ jauge **budget** (non létale) : certaines mesures coûtent, d'autres
rapportent (taxe superprofits). Budget négatif → événements d'austérité forcés.
- **Fun :** profondeur stratégique, arbitrages plus riches.
- **Risque :** complexité ; à tester en option avant généralisation.

### 3.7 Sondages & barre de popularité dynamique *(Should)*
Une **manchette de sondage** toutes les N cartes : « Vous êtes à 47 % ».
Reflète une moyenne pondérée des jauges. Sous 25 % → **risque de motion de
censure** (carte `censure` forcée). Au-dessus de 60 % → **carte bonus**.
- **Fun :** boucle de feedback lisible, tension politique réaliste.

### 3.8 « Carte à retardement » & dettes *(Could)*
Certains choix faciles posent une **bombe à retardement** : un `then` négatif
arrive 4-6 tours plus tard (ex. céder à la finance → krach différé). Visuel :
petite **icône ⏳** sur la jauge concernée.
- **Fun :** conséquences mémorables, « ahhh c'était donc ça ! ».

---

## 4. Personnages récurrents & relations

### 4.1 Système de réputation par personnage *(Must)*
Chaque personnage (`CHARACTERS`) a une **relation** `-3..+3` modifiée par tes
choix le concernant.
- La relation **change son dialogue, son portrait (expression) et ses offres** :
  un MEDEF à -3 te menace ; un syndicaliste à +3 mobilise pour te défendre lors
  d'une crise.
- **Retours scénarisés :** à relation extrême, un perso déclenche une **carte
  spéciale** (allié → coup de pouce ; ennemi → coup bas).
- **Données :** `state.rep[charId]`, `card[side].rep:{charId:+1}`,
  textes/portraits variant par seuil.
- **Acceptation :** au moins 6 persos avec ≥2 variantes de texte selon relation.

### 4.2 Galerie / « Carnet de bord » *(Should)*
Un écran **trombinoscope** débloqué au fil du jeu : chaque perso rencontré, sa
bio satirique, ta relation, les arcs vécus avec lui.
- **Fun :** collection, lore, attachement (pilier *Conséquence*).

### 4.3 Expressions animées *(Should)*
Variantes d'expression par portrait (neutre / colère / sourire / choc) via
**calques SVG** échangés selon le contexte (crise, bonne relation…). Micro-
animations (clignement, léger bob) en CSS.
- **Fun :** vie, personnalité, *game feel*.

---

## 5. Humour, ton & écriture

**Ton visé :** satire politique mordante mais bienveillante, façon *gazette
militante* — on se moque des puissants, jamais des plus faibles.

### 5.1 Punchlines de conséquence *(Must)*
Chaque résolution se termine par **une réplique courte et drôle** (séparée du
contenu pédagogique) : ex. *« Le CAC 40 a fait un malaise. Les urgences, elles,
fonctionnent. »*
- **Données :** `card[side].quip` (optionnel), affiché en gras coloré.

### 5.2 « La Une du Peuple » *(Must)*
Génération d'une **Une de journal** satirique à des moments clés et à l'écran de
fin : gros titre dynamique selon tes choix (« LE SÉNAT SUPPRIMÉ, LES LOBBYISTES
EN DEUIL »), sous-titres, faux édito.
- **Fun + viralité :** image partageable hilarante (cf. §14).
- **Données :** `HEADLINES[]` par drapeau/mesure, moteur de composition.

### 5.3 Easter eggs & cartes clins d'œil *(Could)*
Cartes rares humoristiques (le créateur de la tisane, le débat sur la pizza à
l'ananas version « bien commun »…), citations détournées, achievements rigolos
(« A osé pactiser avec un milliardaire : honte éternelle »).

### 5.4 Charte d'écriture *(Must)*
- Dilemme ≤ 240 caractères, voix du personnage (guillemets « »).
- `result` = conséquence concrète ; `note` = pédagogie *L'Avenir en commun* ;
  `quip` = la vanne. **Ne jamais mélanger les trois.**
- Pas d'attaque *ad hominem* gratuite ; satire des **fonctions/puissances**.

---

## 6. Arcs narratifs & contenu

### 6.1 Objectif de volume *(Must)*
- **Cartes :** 36 → **80+** (dont ≥ 25 topicales, ≥ 12 rares/legendary).
- **Arcs multi-cartes :** 5 → **15** (2 à 5 cartes chacun, à embranchements).
- **Fins :** ajouter des **fins variées** (5-7) selon drapeaux dominants
  (« France des communs », « République sociale », « Indépendance retrouvée »,
  « Mandat avorté », « Trahison libérale »…).

### 6.2 Structure d'arc *(Must)*
Un arc = `arcId` + cartes liées par `then`/`cond` + **résolution** qui pose un
drapeau de bilan (`arc_xxx_resolu`). Trois issues type : *triomphe / compromis /
échec*, chacune avec récompense narrative distincte.

### 6.3 Catalogue d'arcs prioritaires
Voir [Annexe §19](#19-annexe--backlog-de-cartes--arcs).

### 6.4 Chapitrage enrichi *(Should)*
Chaque acte ouvre par une **carte de contexte illustrée** (état du pays, mini
récap de tes choix : « Après ta taxe sur les superprofits, la Bourse boude… »).

---

## 7. Méta-progression & déblocables

### 7.1 Niveau de « Conscience politique » *(Must)*
XP gagnée par partie (mesures + survie + succès) → **niveaux** qui débloquent :
arcs, persos, mutateurs, skins de cartes, morceaux de musique.
- **Fun :** progression long terme, raison de revenir.
- **Données :** `meta.xp`, `meta.level`, table de paliers.

### 7.2 Collection de mesures *(Must)*
Album des **mesures du programme** (objectif 36 → 80) : chaque mesure adoptée se
débloque avec sa fiche pédagogique. **Compteur de complétion %.**
- **Fun :** collectionnite + valeur pédagogique forte.

### 7.3 Succès / Badges *(Should)*
~30 succès (sérieux et drôles) : « 6ᵉ République proclamée », « Zéro répression
sur tout un mandat », « Survie 60 mois », « A maté 3 motions de censure »…
- **Données :** `ACHIEVEMENTS[]` (id, titre, desc, condition, secret?).

### 7.4 Déblocables cosmétiques *(Could)*
- **Skins de jeu** (palette « Aubergine », « Rouge 1936 », « Vert planification »).
- **Avatars de président·e** (choix en début de partie, purement cosmétique).
- **Cartes dorées** pour les mesures legendary collectionnées.

---

## 8. Modes de jeu

| Mode | Statut | Description | Crochet fun |
|------|--------|-------------|-------------|
| **Histoire** | ✅ existe → enrichir | Quinquennat 4 actes, arcs, fins multiples | Narration, twists |
| **Survie** | ✅ existe → enrichir | Infini, difficulté croissante, score | Chasse au record |
| **Défi quotidien** | *Must* | **Seed du jour** identique pour tous, 1 essai, classement local + partage | Compétition, rituel quotidien |
| **Mutateurs / Modificateurs** | *Should* | Règles folles activables (ex. « Crise permanente », « Pression x2 », « Sans aperçu d'impact », « Que des cartes topicales ») → bonus de score | Rejouabilité, défis perso |
| **Duel hot-seat** | *Could* | 2 joueurs sur le même tél : chacun un mandat, score comparé | Convivialité, partage IRL |
| **Mode Histoire+** | *Could* | NG+ : après une victoire, mandat plus dur avec opposition renforcée | Maîtrise |

**Défi quotidien — détail technique :** seed = `YYYYMMDD` → PRNG déterministe
(mulberry32) pilotant le tirage. Stocke le meilleur résultat du jour + une
**carte de partage** (cf. §14).

---

## 9. Difficulté & équilibrage

### 9.1 Niveaux de difficulté *(Must)*
| Niveau | START | Pression/mois | Aperçu d'impact | Public |
|--------|-------|---------------|-----------------|--------|
| **Découverte** | 60 | 0-1 | Oui (chiffré) | Pédagogie, jeune public |
| **Normal** | 50 | 1-2 | Oui (flèches) | Défaut |
| **Insoumis·e** | 45 | 2-3 | Flèches faibles | Confirmés |
| **Hardcore** | 40 | 3+ | Aucun | Speedrun/score |

### 9.2 Courbe de tension *(Should)*
Alterner sciemment cartes « respiration » (gains francs) et « étau »
(arbitrages durs). Éviter > 2 crises d'affilée en Découverte/Normal.

### 9.3 Garde-fous *(Must)*
- Pas de défaite « injuste » au tout début (3 premières cartes sans pression).
- Toujours **au moins une option non catastrophique** par carte.
- Télémétrie locale (anonyme, opt-in) pour repérer les cartes « tueuses ».

### 9.4 Tuning data-driven *(Should)*
Extraire les constantes (`START`, drift, seuils combo, raretés) dans un objet
`BALANCE` unique pour itérer sans toucher au moteur.

---

## 10. Game feel / juice

> Le « jus » est **80 % du fun ressenti**. Priorité haute.

- **Swipe :** inertie, légère rotation 3D (`perspective`), ombre portée qui suit,
  *snap* élastique au retour. *(Must)*
- **Cartes empilées :** voir la **carte suivante** en dessous (effet deck). *(Should)*
- **Screenshake** léger sur crise/chute de pilier. *(Should)*
- **Particules :** ✊ qui jaillit sur mesure adoptée, 💸 qui s'envole sur cadeau
  fiscal, 🔥 sur combo. *(Should)*
- **Jauges :** *tween* fluide, **pulse rouge** + vibration sous 22 %, étincelle
  au passage de seuil. *(Must — partiellement fait)*
- **Compteur de score** qui *roule* (odometer). *(Could)*
- **Haptique** différenciée : tic léger (drag), double (bonne), buzz (mauvaise),
  longue (chute). *(Should)*
- **Transitions d'écran** thématiques (volet rouge, balayage). *(Could)*

**Acceptation game feel :** 60 fps sur mobile milieu de gamme ; aucune action
sans retour visuel **et** sonore **et** haptique.

---

## 11. Audio adaptatif

> Base actuelle : `SOUND` (musique synthé + SFX Web Audio). À enrichir.

- **Musique par couche (stems) selon la tension** : ajoute basse/percussions
  quand un pilier passe sous 30 % ; calme quand tout va bien. *(Should)*
- **Thème par acte** (variation harmonique) + **sting** d'ouverture d'acte. *(Should)*
- **Fanfare de victoire / glas de défaite** distincts par type de fin. *(Must)*
- **SFX à étoffer :** combo (montée), mesure rare (carillon), sondage (jingle
  télé), breaking news (alerte). *(Should)*
- **Voix off d'intro** optionnelle (1 phrase, « Place au peuple ! »). *(Could)*
- **Mixage :** ducking de la musique pendant les SFX importants ; respect du
  bouton mute persistant existant. *(Must)*

---

## 12. Direction artistique

- **Portraits animés** (cf. §4.3) : expressions + idle. *(Should)*
- **Scènes parallaxe** : 2-3 calques qui bougent légèrement au drag. *(Could)*
- **Palette par acte** : Acte I lumineux → Acte III orageux (canicule = teintes
  rouge/orange écrasantes). *(Should)*
- **Cartes d'événement spéciales** : cadre distinct (or pour legendary, rouge
  clignotant pour breaking). *(Must)*
- **Iconographie cohérente** des 4 piliers (déjà en place) + micro-logo φ animé. 
- **Mode sombre/clair** : le jeu est sombre par essence ; prévoir contraste AA.

---

## 13. Onboarding & accessibilité

- **Tuto interactif** (3 cartes scénarisées) au 1ᵉʳ lancement, *skippable*. *(Must)*
- **Tooltips** sur les 4 jauges au 1ᵉʳ affichage. *(Should)*
- **Accessibilité :** `prefers-reduced-motion` (déjà géré), tailles tap ≥ 44 px,
  contraste AA, navigation clavier (← → pour choisir), `aria-live` sur
  conséquences, sous-titres des SFX importants. *(Must)*
- **Lisibilité :** option « gros texte » ; police déjà lisible. *(Should)*
- **Langue :** structurer pour l'**i18n** (extraire les chaînes), prévoir FR/EN. *(Could)*

---

## 14. Partage social & viralité

### 14.1 Carte de bilan en image *(Must)*
À la fin, générer une **image** (Canvas → PNG) : portrait du mandat, score, top
3 mesures, badge de fin, mini-jauges, hashtag. Bouton **Partager** (Web Share
API niveau fichier) / **Télécharger**.
- **Fun + acquisition :** chaque partie peut devenir un post.

### 14.2 « La Une du Peuple » partageable *(Must)*
La Une satirique (§5.2) exportée en image. Format story (9:16) et carré (1:1).

### 14.3 Défi & classement *(Should)*
Partage du **résultat du Défi quotidien** avec son score et la **seed** pour
défier ses amis (« Bats mon 47 % du 15/06 »).

### 14.4 Texte de partage *(fait, à enrichir)*
Inclure un **lien vers le jeu** et le **résultat illustré** plutôt que du texte
seul.

---

## 15. Schémas de données (extensions)

> Rétro-compatibles avec `data.js` actuel. Les champs nouveaux sont **optionnels**.

### 15.1 Carte (extension)
```js
"medef_tax": {
  char: "lobby",
  scene: "bourse",
  tag: "s",
  rarity: "common",          // common|topical|rare|legendary   (NOUVEAU)
  arc: "finance",            // appartenance à un arc           (NOUVEAU)
  weight: 1.0,               // pondération de tirage            (NOUVEAU)
  cooldown: 6,               // tours avant réapparition         (NOUVEAU)
  cond: f => true,
  text: f => "…",            // déjà supporté (réactif)
  left:  {
    label: "Céder",
    fx: { s:-14, p:-10 },
    betray: true,            // casse le combo                   (NOUVEAU)
    rep: { lobby:+1, worker:-1 },   // réputation               (NOUVEAU)
    set: ["caved_finance"],
    then: { id:"krach", in:5 },     // déjà supporté
    result: "…",
    note: "…",
    quip: "Le CAC 40 jubile. Pas le peuple.",  // punchline      (NOUVEAU)
    head: "CADEAU AUX MILLIARDAIRES",          // titre de Une   (NOUVEAU)
    xp: 0
  },
  right: { /* … */ measure:"Taxe superprofits", quip:"…", head:"…", xp:15 }
}
```

### 15.2 Personnage (extension)
```js
CHARACTERS.lobby = {
  name: "Victor Saint-Clair · lobbyiste",
  bio: "Sait faire pleurer un bilan comptable.",   // carnet de bord
  color: "#ff2b46",
  art: { neutral:"lobby", angry:"lobby_angry", happy:"lobby_happy" } // calques
};
```

### 15.3 Conseiller
```js
ADVISORS = [{
  id:"planif", name:"Ministre de la Planification", portrait:"scientist",
  passive:{ e:+1 },                     // récup mensuelle
  active:{ id:"requisition", label:"Réquisition", uses:1,
           effect:"block_next_loss" }
}]
```

### 15.4 Succès
```js
ACHIEVEMENTS = [{
  id:"sixth_republic", title:"6ᵉ République",
  desc:"Proclamer la 6ᵉ République.", secret:false,
  test: g => g.flags.sixth_republic }]
```

### 15.5 Sauvegarde méta (localStorage)
```js
{ version:2, xp, level, unlocked:{arcs:[],advisors:[],skins:[]},
  collection:{measures:[]}, achievements:[], bestMeasures, bestSurvival,
  daily:{date,score}, settings:{difficulty,muted,reducedMotion,locale} }
```

---

## 16. Architecture technique

- **Découpage** proposé : `engine.js` (boucle/état pur, testable),
  `render.js` (DOM/anim), `audio.js` (✅), `art.js` (✅),
  `content/*.js` (cartes par thème), `meta.js` (progression), `share.js`.
- **Moteur pur & déterministe** : extraire la logique (sans DOM) pour permettre
  des **tests headless** (déjà fait en simulation) et le **Défi quotidien**
  (PRNG seedé `mulberry32`).
- **`BALANCE`** : centraliser toutes les constantes de tuning.
- **Schéma de save versionné** + migration douce.
- **Validation au build** : script `node` qui vérifie refs cartes/portraits/
  scènes/arcs, raretés, longueur des textes (déjà amorcé).
- **PWA** : conserver `sw` (bump de version), précache des nouveaux assets,
  écran « hors-ligne prêt ».
- **Perf** : limiter le DOM par carte ; recycler les nœuds ; `will-change` ciblé.

---

## 17. Roadmap & priorisation

Méthode **MoSCoW** + estimation grossière (S/M/L).

### 🟥 Phase 1 — « Plus de jus & de mordant » (impact max, effort court)
| Feature | Prio | Effort |
|---|---|---|
| Punchlines `quip` sur toutes les cartes | Must | M |
| Aperçu d'impact au drag (§3.1) | Must | S |
| Élan/combo + multiplicateur (§3.2) | Must | M |
| Juice swipe (rotation, deck, snap) (§10) | Must | M |
| Carte de bilan en image + partage (§14.1) | Must | M |
| Niveaux de difficulté + `BALANCE` (§9.1) | Must | S |

### 🟧 Phase 2 — « Conséquences & collection »
| Feature | Prio | Effort |
|---|---|---|
| Réputation des personnages (§4.1) | Must | M |
| Collection de mesures + album (§7.2) | Must | M |
| « La Une du Peuple » (§5.2 + §14.2) | Must | M |
| Succès/badges (§7.3) | Should | M |
| +30 cartes & +5 arcs (§6) | Must | L |
| Sondages & popularité (§3.7) | Should | M |

### 🟨 Phase 3 — « Rejouabilité & rituel »
| Feature | Prio | Effort |
|---|---|---|
| Défi quotidien seedé (§8) | Must | M |
| Mutateurs (§8) | Should | M |
| Conseillers/gouvernement (§3.3) | Should | L |
| Méta-progression XP/niveaux (§7.1) | Must | M |
| Audio adaptatif par tension (§11) | Should | L |
| Portraits animés/expressions (§4.3) | Should | L |

### 🟩 Phase 4 — « Profondeur & social »
| Feature | Prio | Effort |
|---|---|---|
| Jauge Budget optionnelle (§3.6) | Could | M |
| RIC mini-jeu (§3.4) | Should | M |
| Duel hot-seat (§8) | Could | M |
| i18n FR/EN (§13) | Could | L |
| NG+ / Histoire+ (§8) | Could | M |

---

## 18. KPIs du fun

Mesures **locales/anonymes** (opt-in) pour piloter l'amélioration :
- **Rétention** : % de joueurs qui relancent une 2ᵉ partie ; retours au Défi quotidien.
- **Durée de session** & nb de cartes/partie.
- **Taux de complétion** Histoire ; **taux de chute** par pilier (équilibrage).
- **Cartes « tueuses »** (defaite ≤ 2 tours après).
- **Partages** générés (Une / bilan).
- **Complétion de collection** moyenne.
- **Cible fun :** ≥ 60 % des parties suivies d'une relance ; durée médiane ≥ 4 min.

---

## 19. Annexe — backlog de cartes & arcs

> Toujours : `right` = ligne *L'Avenir en commun*, `left` = statu quo/libéral.
> Format minimal pour chaque idée : *Personnage — dilemme → enjeu programme*.

### 19.1 Arcs multi-cartes prioritaires
1. **« La finance contre-attaque »** *(existe, à étendre)* — taxe → fuite des
   capitaux → krach différé → pôle bancaire public. *3 issues.*
2. **« Bras de fer avec Washington »** *(amorcé)* — tarifs → OTAN → Groenland →
   indépendance militaire / vassalité. *Topical.*
3. **« L'été de tous les dangers »** — canicule → incendies → exode → plan climat
   d'urgence vs gestion court-termiste. *Topical, dramatique.*
4. **« Le procès des lobbies »** — révélations → enquête → loi anticorruption →
   tentative d'étouffement. *Avec la magistrate récurrente.*
5. **« La Constituante »** — convocation → sabotage médiatique → tirage au sort →
   référendum final (fin 6ᵉ République). *Fil rouge du mandat.*
6. **« Souveraineté énergétique »** — Ormuz → sobriété → renouvelables → sortie
   du nucléaire. *Arbitrages e/v/s.*
7. **« La jeunesse en mouvement »** — vote 16 ans → allocation autonomie →
   mobilisation lycéenne qui te défend en crise.
8. **« Paix et droit international »** — Ukraine/Gaza → ONU → conférence de paix
   vs escalade.

### 19.2 Idées de cartes rares / legendary
- *Legendary* : « Le peuple organise une fête de la planification » (gros bonus
  multi-piliers).
- *Legendary* : « Un milliardaire propose un chèque contre une faveur » (test
  d'intégrité ; refuser = badge).
- *Rare* : « Grève générale victorieuse » (si relation syndicats ≥ +2).
- *Rare* : « Cyberattaque sur les services publics » (souveraineté numérique).
- *Rare* : « Découverte scientifique majeure » (frontières de l'Humanité).

### 19.3 Idées de cartes topicales à ajouter
Logement/loyers, déserts médicaux, dette & agences de notation, IA & emploi,
eau (méga-bassines), industrie & relocalisation, féminicides & justice,
laïcité & écoles, outre-mer (vie chère), agriculture (revenu paysan),
liberté de la presse, services publics ruraux, dépendance/grand âge.

### 19.4 Idées de fins (selon drapeaux dominants)
- **« La France des communs »** (Planète + Social forts, biens communs).
- **« République sociale »** (Social max, mesures de partage).
- **« Indépendance retrouvée »** (Souveraineté max, sortie OTAN/traités).
- **« 6ᵉ République triomphante »** (Peuple max + sixth_republic).
- **« Mandat avorté »** (chute) — variantes par pilier.
- **« La tentation libérale »** (trop de `betray`) — fin amère, badge ironique.

---

*« On ne lâche rien. » — Place au peuple, l'avenir en commun. ✊*
