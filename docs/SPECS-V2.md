# 🎮 Président·e du Peuple — Specs v2 (retours communauté)

> Suite de `docs/SPECS-FUN.md`. Ce document part des **retours Discord** et fixe
> le cap pour rendre le jeu plus **fun, difficile, drôle et rejouable**, tout en
> gardant son rôle **pédagogique** (faire découvrir *L'Avenir en commun*).

---

## 1. Synthèse des retours reçus

| Retour | Source | Décision de design |
|--------|--------|--------------------|
| « Une bonne façon de réviser le programme » | So…FI | ✅ Garder l'ADN pédagogique |
| « Dilemmes parfois trop évidents, pas assez cornéliens » | bluemagick | Ajouter des **arbitrages** (2 bons choix qui s'excluent) + cartes à pièges |
| « Pas de conséquence à dépasser/maxer les jauges » | bibimemyi | **Difficulté = événements subis + pression**, pas pénaliser les bons choix |
| « Ajouter des évènements aléatoires négatifs, pires si on est haut » | bibimemyi | ✅ **Implémenté** (système d'événements ciblant la jauge la plus haute) |
| « Attaque ciblée des médias, manifs d'extrême droite (-20) » | bibimemyi | ✅ Événements `ev_cnews`, `ev_bollore`, `ev_extreme_droite`… |
| « Mettre de la difficulté pour la rejouabilité » | bibimemyi | ✅ 4 difficultés + events ; voir §3 |
| Demandes du porteur (Martinz) | toi | ✅ bons choix sans malus, humour réf. réelles (Bolloré/CNews/Hanouna), **tortue rose** |

---

## 2. Déjà livré dans cette itération

- ✅ **Les bons choix n'enlèvent plus jamais de points** (`effFx` retire tout malus
  des choix conformes au programme). *Prouvé : 0 malus résiduel sur 65 cartes.*
- ✅ **Événements subis** (10) : matraquage CNews, prime time Hanouna, rachats
  Bolloré, manifs d'extrême droite, dégradation des agences de notation,
  spéculation, canicule, sécheresse, grève patronale, marronnier sécuritaire.
  Probabilité croissante, **ciblent la jauge la plus haute**, un seul bouton
  « Encaisser ». *Prouvé : ~18 events / 78 tours.*
- ✅ **Médias & oligarques** jouables : Bolloré (rachat), Hanouna (télé-poubelle),
  CNews (propagande) — avec mesures (loi anti-concentration, audiovisuel public,
  conseil de déontologie).
- ✅ **Mascotte tortue rose** intégrée (accueil, fin, aide).
- ✅ Bon choix toujours à gauche **ou** à droite (alternance), anti-doublons,
  cinématique d'intro, musique par acte, dirigeants du monde (Trump, Netanyahou,
  Poutine, Musk), **SMIC à 1 800 €**.

---

## 3. Difficulté & cornélien (prochaines étapes)

### 3.1 Cartes « arbitrage » (cornéliennes, sans mauvais choix) — *Must*
Deux options **toutes deux conformes au programme** mais **exclusives** (budget/
temps politique limité). Aucune n'enlève de points, mais choisir l'une, c'est
renoncer (temporairement) à l'autre.
- Ex. : *« Budget arbitré : tu finances d'abord la santé OU l'école ? »* →
  les deux donnent +Social, mais l'autre pilier ne montera pas ce tour-ci.
- Schéma : `arbitrage: true` ; les deux côtés comptent comme « programme »
  (combo des deux côtés), pas de `betray`.
- **Fun :** vrais dilemmes de gauche, débat intérieur, rejouabilité.

### 3.2 Cartes « piège » (faux évidents) — *Should*
Une option qui **semble** de gauche mais cache un effet pervers (ex. « interdire
tout licenciement immédiatement » → fuite d'investissement). Apprend la nuance
du programme. À utiliser avec parcimonie (1 sur 8 cartes).

### 3.3 Courbe de difficulté — *Must*
- **Découverte** : 0-1 événement, pression faible (pédagogie).
- **Normal** : events modérés.
- **Insoumis·e / Hardcore** : events fréquents et cumulables, pression forte,
  **mode « tempête »** (2 events d'affilée possibles au-delà de 80 sur un pilier).
- Option **« seuils de crise »** : sous 25 % sur un pilier → carte de crise forcée
  liée (ex. Peuple <25 % → motion de censure).

### 3.4 Conséquence des jauges hautes — *Should* (alternative au game-over de Reigns)
On NE tue pas le joueur à 100 % (ce serait punir le succès). À la place :
**plus une jauge est haute, plus elle attire les coups** (events ciblés, déjà en
place) → un équilibre dynamique émerge sans pénaliser les bons choix.

---

## 4. Humour & références d'actualité — *Must continu*

**Ton :** satire mordante des puissants, jamais des faibles ; vraies références
populaires, détournées avec finesse.

### 4.1 Banque de références à exploiter
- **Médias :** Bolloré (✅), Hanouna/« TPMP » (✅), CNews (✅), Praud, éditorialistes,
  « le sondage du jour », BFM en boucle, Drahi.
- **Punchlines politiques :** « en même temps », « pognon de dingue », « qu'ils
  viennent me chercher », « Flamby », « maître des horloges », « traverser la rue »,
  « le déclin », « start-up nation », « there is no alternative ».
- **Vie quotidienne :** prix du caddie, carburant, « la fin du mois ET la fin du
  monde », méga-bassines, déserts médicaux, Parcoursup, AirBnB/loyers.
- **Internationale :** Trump & le Groenland, tarifs, Musk/X, Davos, agences de
  notation, FMI, COP « blabla ».

### 4.2 Règle d'écriture (rappel)
`result` = conséquence concrète · `note` = pédagogie L'AEC · `quip` = la vanne ·
`head` = titre de « La Une du Peuple ». Ne jamais mélanger. Dilemme ≤ 240 car.

### 4.3 Cartes à écrire (idées)
Logement/AirBnB, méga-bassines, Parcoursup, ubérisation, paradis fiscaux (CumEx),
Frontex, lobbying à Bruxelles, McKinsey/cabinets de conseil, JO & nettoyage social,
foot business vs sport populaire, IA & emploi, retraite des femmes.

---

## 5. La Tortue rose — mascotte & fil conducteur

La tortue (déjà intégrée) devient un **personnage-guide** récurrent et attachant.

- **Identité :** symbole de **patience + ténacité** (« lente mais on n'arrête pas
  le mouvement »), clin d'œil à la persévérance militante. Nom proposé : **« Lambda »**
  (la tortue lambda = le citoyen lambda) ou **« Phi »** (clin d'œil au logo).
- **Rôles :**
  - **Accueil :** mascotte au mégaphone (✅).
  - **Tutoriel/onboarding :** elle explique les 4 piliers et le swipe.
  - **Astuces inter-actes :** elle glisse un conseil ou une vanne entre deux actes.
  - **Fin :** mégaphone si victoire (✅), balai si défaite (« on nettoie et on
    recommence ») (✅).
  - **Réactions :** petites bulles (« Joli combo ! », « Aïe, le social… »).
- **Poses dispo :** mégaphone (meeting), tract (programme), tirelire/don (financement
  & partage), balai (nettoyer le bilan), scooter (action/clin d'œil Hollande).
- **Évolution possible :** la tortue **s'habille** selon le pilier dominant
  (écharpe verte si écologie forte, etc.) ; déblocable cosmétique.

---

## 6. Arc « Reconquête médiatique » (à étoffer)

Mini-campagne filée sur le mandat :
1. `media` / `bollore_rachat` (Acte I) → poser le problème de la concentration.
2. `cnews_propagande`, `hanouna_show` (Acte III) → la bataille culturelle.
3. **Résolution** : si tu as adopté loi anti-concentration **+** audiovisuel public
   **+** conseil de déontologie → **carte de triomphe** « L'info libérée » (gros
   bonus Peuple, badge), et les **événements médiatiques deviennent moins violents**
   (les `ev_cnews/ev_bollore` perdent en intensité). → récompense systémique.

---

## 7. Backlog priorisé (post-itération)

### 🟥 Court terme (impact immédiat)
1. Cartes **arbitrage** cornéliennes (§3.1) — *M*
2. 10-15 nouvelles cartes d'actualité humoristiques (§4.3) — *L*
3. **Seuils de crise** sous 25 % (§3.3) — *M*
4. Tutoriel mené par la **tortue** (§5) — *M*
5. Bulles de réaction de la tortue en jeu — *S*

### 🟧 Moyen terme
6. Arc médiatique avec résolution systémique (§6) — *M*
7. Réputation visible des personnages (récurrence + portraits qui changent) — *L*
8. Album de **collection des mesures** + succès/badges — *M*
9. Mode **Défi quotidien** (seed) + image de bilan enrichie — *M*

### 🟩 Long terme
10. Mutateurs (« crise permanente », « pression x2 »…) — *M*
11. Conseillers/gouvernement (builds) — *L*
12. Audio adaptatif multi-stems par acte — *L*
13. i18n FR/EN — *L*

---

## 8. Critères d'acceptation (pour cette philosophie)

- ✅ Aucun choix **conforme au programme** ne fait baisser une jauge.
- ✅ Au moins **1 événement subi** toutes les ~6-8 cartes en Normal (plus en haut).
- ✅ Les événements **ciblent la jauge la plus haute** (effet « grand écart »).
- Une partie « difficulté Insoumis·e » jouée **parfaitement** doit pouvoir être
  **perdue** par accumulation d'événements (rejouabilité) — sans jamais que le
  joueur ait l'impression d'être puni pour un bon choix.
- Chaque carte fait **sourire au moins une fois** (quip ou Une).

---

*« Lente mais déterminée, la tortue ne lâche rien. » 🐢✊*
