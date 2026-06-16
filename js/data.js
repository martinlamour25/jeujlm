/*
 * data.js — « Président·e du Peuple » (édition narrative)
 * ------------------------------------------------------
 * Jeu de décision en soutien à la campagne 2027 de Jean-Luc Mélenchon,
 * basé sur le programme « L'Avenir en commun » de la France insoumise.
 * Jeu citoyen NON officiel, à but pédagogique.
 *
 * Les crises et rebondissements s'inspirent de l'actualité 2025-2026
 * (tarifs douaniers et crise du Groenland, budget d'austérité et 49.3,
 * crise énergétique du détroit d'Ormuz, canicules record et échec de la
 * COP30, trêves fragiles en Ukraine, Gaza, AI Act européen…).
 *
 * fx = effets sur les 4 piliers :  p=Peuple/Démocratie  s=Social
 *      e=Écologie  v=Souveraineté.   Un pilier à 0 = chute de la présidence.
 * Mécaniques narratives : set (drapeaux), cond (condition d'apparition),
 * then (carte déclenchée plus tard = arc / rebondissement), texte réactif.
 */

const GAUGES = {
  p: { name: "Peuple", short: "Démocratie & soutien populaire", color: "#ff2b46", icon: "fist" },
  s: { name: "Social", short: "Partage des richesses & services publics", color: "#ffd166", icon: "social" },
  e: { name: "Planète", short: "Planification écologique", color: "#2bd97a", icon: "leaf" },
  v: { name: "Souverain", short: "Indépendance, paix & démocratie internationale", color: "#3f7fe0", icon: "globe" }
};

const DEFEATS = {
  p: { title: "Destitué·e par le peuple", text: "Coupé·e des citoyens, une motion de censure puis un RIC révocatoire t'emportent. Le pouvoir appartient au peuple." },
  s: { title: "La révolte sociale", text: "La misère et les inégalités ont explosé. Le pays se soulève : sans justice sociale, pas de République." },
  e: { title: "L'effondrement écologique", text: "Canicules, incendies, inondations : la nature est saccagée. Sans planification, il n'y a pas d'avenir." },
  v: { title: "La France sous tutelle", text: "Soumise aux marchés et aux puissances étrangères, la France a perdu son indépendance." }
};

// Personnages (certains reviennent et réagissent à tes choix passés).
const CHARACTERS = {
  lobby: "Victor Saint-Clair · lobbyiste",
  medef: "La présidente du MEDEF",
  youth: "Inès · lycéenne",
  worker: "Karim · syndicaliste",
  nurse: "Fatou · infirmière",
  farmer: "Étienne · agriculteur",
  scientist: "Dʳ Lévêque · GIEC",
  general: "Le général Marchand",
  eu: "La commissaire européenne",
  trump: "Le président américain",
  banker: "Le gouverneur de la BCE",
  citizen: "Une citoyenne",
  pm: "Ton Premier ministre",
  tech: "PDG d'une multinationale de l'IA",
  diplomat: "L'envoyé·e de l'ONU",
  judge: "La magistrate anticorruption",
  // --- Adversaires politiques (caricatures satiriques, prénoms détournés) ---
  macron: "Manu Macron · « en même temps »",
  lepen: "Marinette Le Pen · l'extrême droite",
  bardella: "Jordy Bardella · l'influenceur",
  hollande: "Flamby Hollande · l'ex-Président",
  darmanin: "Gégé Darmanin · l'ordre à tout prix",
  retailleau: "Brunito Retailleau · la droite dure",
  attal: "Gaby Attal · le jeune premier",
  philippe: "Edmond Philippe · le maître des horloges",
  glucksmann: "Raph Glucksmann · le centre mou",
  ruffin: "Frankie Ruffin · le dissident",
  zemmour: "Érik Zemmour · le pamphlétaire",
  // --- Scène internationale ---
  trumpworld: "Donald Trump · le bully en chef",
  netanyahou: "Benyamin Netanyahou · la guerre sans fin",
  poutine: "Vladimir Poutine · l'autocrate",
  musk: "Elon Musk · le milliardaire de X",
  // --- Médias & oligarques ---
  bollore: "Vincent Bolloré · l'empire médiatique",
  hanouna: "L'animateur de la télé-poubelle",
  cnews: "L'éditorialiste qui hurle",
  // --- Le héros ---
  jlm: "Jean-Luc Mélenchon"
};

/* =========================================================
   BANQUE DE CARTES (objet indexé par id)
   ========================================================= */
const CARDS = {

  /* ---------- ACTE I — 2027 : la prise du pouvoir ---------- */
  invest: {
    char: "pm", scene: "palais", tag: "p",
    text: "« Vous voilà élu·e Président·e. Premier acte du quinquennat : par quoi commence-t-on ? »",
    left: { label: "Stabiliser d'abord", fx: { p: -4, s: 4, v: 2 },
      result: "Tu temporises pour rassurer les institutions. Le peuple attend du concret.",
      note: "Le programme veut au contraire engager vite la rupture démocratique." },
    right: { label: "Lancer la Constituante", fx: { p: 12, v: 3, s: -4 }, set: ["constituante"],
      result: "Tu annonces la convocation d'une Assemblée constituante. La 6ᵉ République est en marche.",
      note: "Convoquer une Assemblée constituante pour que le peuple écrive sa Constitution.",
      measure: "Processus constituant lancé" }
  },
  smic: {
    char: "worker", scene: "usine", tag: "s", rarity: "common",
    text: "« Le SMIC ne suffit plus pour vivre. Vous l'augmentez, oui ou non ? »",
    left: { label: "Geler", fx: { s: -14, p: -10 }, betray: true, rep: { worker: -1, lobby: 1 },
      result: "Salaires gelés « pour la compétitivité ». La pauvreté laborieuse grimpe.",
      note: "Personne ne doit travailler à plein temps et rester pauvre.",
      quip: "Le patronat applaudit. Ton caddie, lui, reste vide.", head: "SALAIRES GELÉS : LE PEUPLE TRINQUE" },
    right: { label: "1 800 € nets", fx: { s: 14, p: 8, v: -5 }, set: ["raised_smic"], rep: { worker: 1, lobby: -1 },
      result: "Le SMIC passe immédiatement à 1 800 € nets. Le pouvoir d'achat repart, le patronat fulmine.",
      note: "SMIC à 1 800 € nets dès 2027 pour vivre dignement de son travail.",
      measure: "SMIC à 1 800 € nets", quip: "Le CAC 40 a fait un malaise. Les caissières respirent.",
      head: "SMIC À 1 800 € : LE TRAVAIL ENFIN PAYÉ" }
  },
  medef_tax: {
    char: "lobby", scene: "bourse", tag: "s",
    text: function (f) {
      return f.raised_smic
        ? "« Vous avez déjà augmenté le SMIC ! Encore une taxe et on délocalise pour de bon. »"
        : "« Baissez nos impôts, sinon nous délocalisons. C'est ça ou le chômage. »";
    },
    left: { label: "Céder", fx: { s: -14, p: -10, v: 4 }, set: ["caved_finance"],
      result: "Nouveaux cadeaux fiscaux aux actionnaires. Les services publics trinquent.",
      note: "Le programme refuse la course au moins-disant fiscal." },
    right: { label: "Tenir tête", fx: { s: 12, p: 8, v: -6 }, set: ["taxed_rich"],
      result: "Tu instaures un revenu maximum et taxes les superprofits. La finance prépare sa riposte…",
      note: "Revenu maximum autorisé : partager les richesses plutôt que les concentrer.",
      measure: "Taxe sur les superprofits", then: { id: "capital_flight", in: 2 } }
  },
  capital_flight: {
    char: "banker", scene: "bourse", tag: "v", crisis: true,
    cond: function (f) { return f.taxed_rich; },
    text: "« Comme prévu, les capitaux fuient et les marchés attaquent. Cédez, ou contrôlez. »",
    left: { label: "Rassurer les marchés", fx: { s: -12, p: -8, v: -4 },
      result: "Tu recules sur la fiscalité pour calmer la Bourse. Trahison ressentie côté peuple.",
      note: "Sans contrôle des capitaux, la finance dicte sa loi." },
    right: { label: "Contrôle des capitaux", fx: { v: 12, s: 6, p: 4 }, set: ["capital_control"],
      result: "Contrôle des capitaux aux frontières : la spéculation et l'évasion fiscale sont bloquées.",
      note: "Protéger l'économie réelle des attaques spéculatives.",
      measure: "Contrôle des capitaux" }
  },
  vote16: {
    char: "youth", scene: "manif", tag: "p",
    text: "« On veut décider de notre avenir : donnez-nous le droit de vote à 16 ans ! »",
    left: { label: "Refuser", fx: { p: -10 },
      result: "La jeunesse se sent méprisée et se détourne.",
      note: "Faire confiance aux citoyen·nes, c'est élargir leur pouvoir." },
    right: { label: "Accorder", fx: { p: 12, s: 2 }, set: ["vote16"],
      result: "Vote à 16 ans, reconnaissance du vote blanc : la jeunesse entre en politique.",
      note: "Droit de vote à 16 ans et proportionnelle pour une démocratie vivante.",
      measure: "Droit de vote à 16 ans" }
  },
  media: {
    char: "bollore", scene: "studio_tv", tag: "p",
    text: "« Soutenez-moi et mes dix chaînes d'info vanteront votre bilan. »",
    left: { label: "Pactiser", fx: { p: -14, v: -4 },
      result: "Tu t'achètes une couverture médiatique… au prix de la démocratie.",
      note: "La concentration des médias est un poison pour le débat public." },
    right: { label: "Briser les monopoles", fx: { p: 12, v: -3 }, set: ["free_media"],
      result: "Tu garantis l'indépendance des médias et brises les concentrations.",
      note: "Libérer l'information de la mainmise des milliardaires.",
      measure: "Indépendance des médias" }
  },

  /* ---------- ACTE II — 2028-2029 : les fronts s'ouvrent ---------- */
  eu_austerity: {
    char: "eu", scene: "ue", tag: "v", topical: true,
    text: "« Votre déficit dépasse les règles. Coupez 30 milliards, comme l'a fait le budget d'austérité. »",
    left: { label: "Obéir (49.3)", fx: { s: -14, p: -12, v: -8 }, set: ["austerity"],
      result: "Cure d'austérité au 49.3. Hôpitaux et écoles à l'os, la rue gronde.",
      note: "Les traités imposent l'austérité : le programme propose d'en sortir." },
    right: { label: "Plan B : désobéir", fx: { v: 10, p: 8, s: 8, e: -4 }, set: ["defy_eu"],
      result: "Tu actives le « Plan B » et désobéis aux traités. Bruxelles s'étrangle, le pays investit.",
      note: "Plan A : renégocier. Plan B : désobéir unilatéralement pour protéger le peuple.",
      measure: "Désobéissance aux traités (Plan B)" }
  },
  trump_tariffs: {
    char: "trump", scene: "monde", tag: "v", topical: true, crisis: true,
    text: "« La France a osé envoyer des troupes au Groenland. Je vous colle 25 % de droits de douane. »",
    left: { label: "S'écraser", fx: { v: -14, p: -8, s: -4 }, set: ["submit_trump"], betray: true,
      result: "Tu cèdes et achètes des armes américaines pour calmer Washington. La souveraineté s'efface.",
      note: "Une France vassale n'est plus une France indépendante.",
      quip: "Le golfeur en chef encaisse ton honneur avec le sourire.", head: "LA FRANCE PAIE LA RANÇON" },
    right: { label: "Riposter", fx: { v: 12, p: 8, s: -5 }, set: ["defy_trump"],
      result: "Tu actives la riposte douanière européenne et défends le droit international au Groenland.",
      note: "La France indépendante ne se range derrière aucune puissance.",
      measure: "Riposte souveraine aux tarifs", then: { id: "trump_retaliation", in: 2 },
      quip: "« America first » ? Ici, c'est le peuple d'abord.", head: "L'EUROPE RIPOSTE" }
  },
  trump_retaliation: {
    char: "general", scene: "otan", tag: "v", crisis: true,
    cond: function (f) { return f.defy_trump; },
    text: "« Washington nous menace de quitter l'OTAN si on ne plie pas. Quelle posture ? »",
    left: { label: "Rester sous l'OTAN", fx: { v: -10, p: -4 },
      result: "Tu rentres dans le rang atlantiste pour éviter la rupture.",
      note: "L'OTAN aligne les Européens derrière Washington." },
    right: { label: "Sortir de l'OTAN", fx: { v: 14, p: 6, s: -4 }, set: ["exit_nato"],
      result: "La France sort du commandement de l'OTAN et bâtit une défense indépendante.",
      note: "L'OTAN, héritée de la guerre froide, n'a plus lieu d'être.",
      measure: "Sortie de l'OTAN" }
  },
  ormuz: {
    char: "pm", scene: "monde", tag: "v", topical: true, crisis: true,
    text: "« Le détroit d'Ormuz est fermé, le pétrole flambe : crise énergétique à 4 milliards. On fait quoi ? »",
    left: { label: "Subventionner le fossile", fx: { e: -12, s: 4, v: -4 },
      result: "Tu rouvres les vannes du fossile en urgence. Le climat trinque, la dépendance demeure.",
      note: "Chaque crise fossile rappelle l'urgence de la sortie des énergies importées." },
    right: { label: "Accélérer le renouvelable", fx: { e: 12, v: 8, s: -5 }, set: ["energy_indep"],
      result: "Tu lances un plan d'urgence sobriété + renouvelables : moins dépendant des pétromonarchies.",
      note: "100 % renouvelables en 2050 : l'indépendance énergétique, c'est la souveraineté.",
      measure: "Plan d'indépendance énergétique" }
  },
  retraite: {
    char: "worker", scene: "manif", tag: "s",
    text: "« On nous a volé nos retraites. Rendez-nous le droit de partir à 60 ans ! »",
    left: { label: "Reculer l'âge", fx: { s: -12, p: -14 },
      result: "L'âge de départ recule encore. La rue est noire de monde.",
      note: "Le programme rétablit la retraite à 60 ans." },
    right: { label: "Retraite à 60 ans", fx: { s: 12, p: 10, v: -5 }, set: ["retraite60"],
      result: "Retour de la retraite à 60 ans à taux plein et hausse des petites pensions.",
      note: "Le droit au repos après une vie de travail, reconquis.",
      measure: "Retraite à 60 ans" }
  },
  hopital: {
    char: "nurse", scene: "hopital", tag: "s",
    text: "« L'hôpital craque. Des lits ferment, on n'en peut plus. Vous agissez ? »",
    left: { label: "Économiser", fx: { s: -14, p: -12 },
      result: "Nouvelles fermetures de lits. Les urgences débordent.",
      note: "Vingt ans de fermetures ont mis l'hôpital à genoux." },
    right: { label: "Plan d'urgence santé", fx: { s: 14, p: 8, v: -3 },
      result: "Plan pour l'hôpital public et remboursement à 100 % des soins prescrits.",
      note: "La santé ne se marchande pas : reconstruire le service public hospitalier.",
      measure: "Remboursement à 100 % des soins" }
  },
  mercosur: {
    char: "eu", scene: "champ", tag: "v", topical: true,
    text: "« Signez l'accord de libre-échange : les multinationales en rêvent, vos paysans le redoutent. »",
    left: { label: "Signer le Mercosur", fx: { e: -10, s: -8, v: -6, p: -4 }, set: ["signed_mercosur"],
      result: "Accord signé : la viande et le soja low-cost déferlent. Colère paysanne en vue…",
      note: "Le programme refuse les accords climaticides comme le Mercosur.",
      then: { id: "farmers_revolt", in: 2 } },
    right: { label: "Protectionnisme solidaire", fx: { v: 8, e: 8, s: 6 }, set: ["protectionism"],
      result: "Tu bloques l'accord et instaures une taxe carbone aux frontières de l'UE.",
      note: "Taxer ce qui ne respecte pas les normes sociales et écologiques.",
      measure: "Protectionnisme solidaire" }
  },
  farmers_revolt: {
    char: "farmer", scene: "champ", tag: "s", crisis: true,
    cond: function (f) { return f.signed_mercosur; },
    text: "« Vous nous avez vendus ! Les tracteurs bloquent Paris. Réprimer ou négocier ? »",
    left: { label: "Réprimer", fx: { p: -14, s: -6 },
      result: "La répression du blocus paysan fait scandale. Le pays se braque.",
      note: "Le programme dialogue avec le monde paysan, il ne le matraque pas." },
    right: { label: "Prix planchers garantis", fx: { s: 10, e: 6, p: 6, v: -4 },
      result: "Tu instaures des prix planchers et relocalises l'agriculture paysanne.",
      note: "Garantir un revenu digne aux paysans et l'autosuffisance alimentaire.",
      measure: "Prix planchers agricoles" }
  },
  energy_common: {
    char: "lobby", scene: "usine", tag: "e",
    text: "« Privatisons les barrages et le nucléaire : c'est très rentable pour mes clients. »",
    left: { label: "Privatiser", fx: { e: -10, s: -10 },
      result: "L'énergie part au privé, les prix s'envolent.",
      note: "L'eau, l'air, l'énergie ne sont pas des marchandises." },
    right: { label: "Bien commun", fx: { e: 10, s: 8, p: 6 }, set: ["energy_public"],
      result: "L'énergie reste un bien commun, gérée pour l'intérêt général.",
      note: "Protéger les biens communs du marché.",
      measure: "Énergie en bien commun" }
  },

  /* ---------- ACTE III — 2030-2031 : tempêtes ---------- */
  canicule: {
    char: "scientist", scene: "canicule", tag: "e", topical: true, crisis: true,
    text: "« Canicule record : plus de 46 °C, des milliers de morts, des incendies géants. Réponse d'urgence ? »",
    left: { label: "Tout climatiser", fx: { e: -14, p: -3 }, betray: true,
      result: "On climatise à tout-va. La facture énergétique et carbone explose, fuite en avant.",
      note: "Sans planification, chaque crise en aggrave une autre.",
      quip: "On éteint l'incendie à l'essence. Brillant.", head: "LA FRANCE SUFFOQUE" },
    right: { label: "Plan climat d'urgence", fx: { e: 14, s: 6, v: -4 }, set: ["climate_plan"],
      result: "Règle verte constitutionnelle, rénovation thermique massive, forêts et eau protégées.",
      note: "Ne pas prélever ni produire plus que ce que la nature peut reconstituer.",
      measure: "Règle verte constitutionnelle",
      quip: "Les climatosceptiques ouvrent enfin la fenêtre.", head: "LA RÈGLE VERTE DANS LA CONSTITUTION" }
  },
  cop30: {
    char: "diplomat", scene: "monde", tag: "e", topical: true,
    text: "« La COP a encore échoué à acter la sortie des fossiles. La France suit ou montre l'exemple ? »",
    left: { label: "Suivre le troupeau", fx: { e: -10, v: -4 },
      result: "La France s'aligne sur le plus petit dénominateur commun. L'inaction continue.",
      note: "Le programme veut une Organisation mondiale de l'environnement à l'ONU." },
    right: { label: "Montrer l'exemple", fx: { e: 12, v: 6, s: -4 }, set: ["climate_leader"],
      result: "La France planifie sa bifurcation et entraîne une coalition de pays.",
      note: "Planification écologique : fixer un cap et financer la transition.",
      measure: "Leadership écologique mondial" }
  },
  nuclear: {
    char: "scientist", scene: "usine", tag: "e",
    text: "« Faut-il construire 14 réacteurs EPR, ou planifier la sortie du nucléaire ? »",
    left: { label: "Tout nucléaire", fx: { e: -8, p: -4 },
      result: "On mise tout sur le nucléaire : déchets et risques pour des décennies.",
      note: "Le programme préfère une trajectoire 100 % renouvelables maîtrisée." },
    right: { label: "Sortie programmée", fx: { e: 9, v: 4, s: -5 }, set: ["nuclear_exit"],
      result: "Sortie progressive du nucléaire et grand plan renouvelables.",
      note: "Sortir du nucléaire de façon planifiée, sans casse sociale.",
      measure: "Sortie programmée du nucléaire" }
  },
  ukraine: {
    char: "poutine", scene: "warzone", tag: "v", topical: true, crisis: true,
    text: "« La trêve, je la respecte… quand ça m'arrange. Alors, la France se couche ou s'aligne sur Washington ? »",
    left: { label: "Escalade / alignement", fx: { v: -8, p: -6, s: -4 }, betray: true,
      result: "Tu choisis la surenchère militaire dans le sillage des grandes puissances.",
      note: "Le programme défend la paix par le droit, pas la course aux armements.",
      quip: "Poutine sourit : la guerre, c'est bon pour ses affaires. Washington aussi.",
      head: "LA FRANCE DANS L'ENGRENAGE" },
    right: { label: "Paix par l'ONU", fx: { v: 12, p: 6 }, set: ["peace_un"],
      result: "Ni soumission ni va-t-en-guerre : tu pousses une conférence de paix sous mandat de l'ONU.",
      note: "Non-alignement : la sécurité collective passe par l'ONU, pas par les blocs.",
      measure: "Conférence de paix sous l'ONU",
      quip: "L'autocrate déteste les médiateurs indépendants.", head: "LA FRANCE POUR LA PAIX" }
  },
  gaza: {
    char: "netanyahou", scene: "warzone", tag: "v", topical: true, crisis: true,
    text: "« Mon offensive continue, cessez-le-feu ou pas. La France va-t-elle encore me vendre des armes ? »",
    left: { label: "Vendre les armes", fx: { v: -10, p: -10 }, betray: true,
      result: "La France continue ses livraisons et son silence. L'opinion est scandalisée.",
      note: "Le droit international vaut partout, sans deux poids deux mesures.",
      quip: "Les marchands d'armes trinquent au champagne.", head: "LA FRANCE COMPLICE" },
    right: { label: "Embargo & droit international", fx: { v: 10, p: 8, s: -3 }, set: ["intl_law"],
      result: "Embargo sur les armes, reconnaissance de l'État de Palestine, protection des civils.",
      note: "Faire respecter le droit international et la Charte de l'ONU, sans exception.",
      measure: "Défense du droit international",
      quip: "Netanyahou fulmine : la France n'est plus son fournisseur.", head: "LA FRANCE FAIT RESPECTER LE DROIT" }
  },
  musk_x: {
    char: "musk", scene: "numerique", tag: "v", topical: true,
    text: "« Je possède X, des fusées, et bientôt votre débat public. Laissez mes algorithmes faire la 'liberté d'expression'. »",
    left: { label: "Le laisser faire", fx: { v: -10, p: -8 }, betray: true,
      result: "Désinformation, ingérence, manipulation : un milliardaire étranger pèse sur ta démocratie.",
      note: "La révolution numérique est d'intérêt général, pas la propriété d'un oligarque.",
      quip: "Le tech-bro tweete sa victoire en majuscules.", head: "LA DÉMOCRATIE LIVRÉE AUX ALGORITHMES" },
    right: { label: "Réguler les réseaux", fx: { v: 10, p: 8, s: -2 }, set: ["ai_reg"],
      result: "Régulation des plateformes, transparence des algorithmes, neutralité du net, logiciels libres.",
      note: "Reprendre la maîtrise publique des infrastructures et des données.",
      measure: "Régulation des réseaux & des algorithmes",
      quip: "Elon menace de partir sur Mars. Promis ?", head: "LES RÉSEAUX REMIS AU PAS" }
  },
  trump_greenland: {
    char: "trumpworld", scene: "monde", tag: "v", topical: true, crisis: true,
    text: "« Je veux le Groenland, et l'Europe paiera l'OTAN à 5 % du PIB. Sinon : tarifs ! Deal ? »",
    left: { label: "Dire amen", fx: { v: -14, p: -6, s: -4 }, betray: true,
      result: "Tu cèdes au chantage : achats d'armes US et budgets militaires gonflés sur le dos du social.",
      note: "Une France vassale n'est plus indépendante.",
      quip: "Trump te tape dans le dos. Ça fait toujours un peu mal.", head: "LA FRANCE À GENOUX" },
    right: { label: "Tenir tête", fx: { v: 13, p: 8, s: -3 }, set: ["defy_trump"],
      result: "Tu défends le droit international, la souveraineté du Groenland et une riposte européenne unie.",
      note: "Indépendance et non-alignement : la France ne se soumet à aucune puissance.",
      measure: "Front commun face au chantage",
      quip: "« Qu'il vienne la chercher, ma souveraineté. »", head: "L'EUROPE TIENT TÊTE AU BULLY" }
  },
  ai_act: {
    char: "tech", scene: "numerique", tag: "v", topical: true,
    text: "« Allégez la régulation de l'IA et laissez-nous vos données : c'est le progrès, voyons. »",
    left: { label: "Déréguler", fx: { v: -10, p: -6, s: -4 }, set: ["ai_dereg"],
      result: "Tu cèdes au lobby tech : surveillance et exploitation des données s'étendent.",
      note: "Le programme défend la neutralité du net et les communs numériques." },
    right: { label: "Souveraineté numérique", fx: { v: 10, p: 6, s: -3 }, set: ["ai_reg"],
      result: "IA encadrée, neutralité du net garantie, logiciels libres dans l'administration.",
      note: "La révolution numérique est d'intérêt général : on en reprend la maîtrise.",
      measure: "Souveraineté numérique & IA encadrée" }
  },
  censure: {
    char: "pm", scene: "assemblee", tag: "p", crisis: true,
    cond: function (f) { return !f.censure_done; },
    text: function (f) {
      return (f.austerity || f.caved_finance)
        ? "« L'opposition dépose une motion de censure et le peuple ne vous défend plus guère… »"
        : "« L'opposition dépose une motion de censure. Comment répondez-vous ? »";
    },
    left: { label: "Coup de force (49.3)", fx: { p: -14, v: -4 }, set: ["censure_done"],
      result: "Tu passes en force au 49.3 contre l'avis du Parlement. La défiance grimpe.",
      note: "Abolir la monarchie présidentielle, pas la prolonger." },
    right: { label: "Dissoudre & consulter", fx: { p: 12, v: 2, s: -3 }, set: ["censure_done", "trust_people"],
      result: "Tu fais confiance au peuple : référendum et nouvelles élections valident ton cap.",
      note: "Le peuple souverain tranche : c'est l'esprit de la 6ᵉ République.",
      measure: "Recours au peuple souverain" }
  },
  krach: {
    char: "banker", scene: "bourse", tag: "s", crisis: true,
    text: "« Une banque géante s'effondre et menace toute l'économie. On renfloue sans conditions ? »",
    left: { label: "Renflouer à l'aveugle", fx: { s: -14, p: -12 },
      result: "Des milliards publics sauvent les banquiers, sans aucune contrepartie.",
      note: "Le programme refuse de socialiser les pertes et privatiser les profits." },
    right: { label: "Pôle bancaire public", fx: { s: 10, p: 8, v: 6 }, set: ["public_bank"],
      result: "Création d'un pôle bancaire public : on socialise plutôt que de payer pour rien.",
      note: "Mettre la finance au service de l'intérêt général.",
      measure: "Pôle bancaire public" }
  },
  outremer: {
    char: "citizen", scene: "mer", tag: "s",
    text: "« L'égalité réelle pour les Outre-mer, c'est pour quand ? L'eau, la vie chère, l'abandon… »",
    left: { label: "Reporter", fx: { s: -8, p: -8 },
      result: "Encore des promesses repoussées. Le sentiment d'abandon grandit.",
      note: "L'égalité réelle est un engagement central du programme." },
    right: { label: "Plan d'égalité réelle", fx: { s: 10, p: 8, e: 4 },
      result: "Plan d'égalité réelle : les Outre-mer, pointes avancées du progrès humain.",
      note: "Les Outre-mer, chance de la France : développement endogène et écologique.",
      measure: "Égalité réelle Outre-mer" }
  },

  /* ---------- Cartes « tout-terrain » (mode infini + remplissage) ---------- */
  jeunesse: {
    char: "youth", scene: "ville", tag: "s",
    text: "« J'ai 22 ans et pas un euro pour étudier. Comment je fais ? »",
    left: { label: "Rien", fx: { s: -10, p: -8 },
      result: "La jeunesse jongle entre petits boulots et études.",
      note: "Le programme garantit l'autonomie matérielle des jeunes." },
    right: { label: "Allocation autonomie", fx: { s: 12, p: 8, v: -3 },
      result: "Allocation d'autonomie pour les 18-25 ans détaché·es du foyer fiscal.",
      note: "Émanciper la jeunesse de la précarité.",
      measure: "Allocation d'autonomie jeunesse" }
  },
  corruption: {
    char: "judge", scene: "palais", tag: "p",
    text: "« Des élus sont mouillés dans des affaires. Vous couvrez ou vous agissez ? »",
    left: { label: "Étouffer", fx: { p: -16, v: -4 },
      result: "L'affaire est enterrée. La défiance envers les élus explose.",
      note: "Une République exemplaire, contrôlée par le peuple." },
    right: { label: "Inéligibilité à vie", fx: { p: 14, v: -2 },
      result: "Inéligibilité à vie pour corruption et RIC révocatoire instauré.",
      note: "La vertu au centre de l'action publique : balayer les privilèges.",
      measure: "Inéligibilité à vie pour corruption" }
  },
  manif_repression: {
    char: "general", scene: "manif", tag: "p",
    text: "« Des milliers de gens manifestent. On donne l'ordre de réprimer ? »",
    left: { label: "Réprimer", fx: { p: -16, v: -4 }, set: ["repressed"],
      result: "La répression fait des blessés. La colère monte d'un cran.",
      note: "Rompre avec la doctrine du maintien de l'ordre violent." },
    right: { label: "Garantir le droit", fx: { p: 12, v: -2 },
      result: "Tu garantis le droit de manifester. Le dialogue prime sur la matraque.",
      note: "L'intervention populaire doit être accueillie, pas réprimée.",
      measure: "Droit de manifester garanti" }
  },
  ecole: {
    char: "citizen", scene: "ville", tag: "s",
    text: "« Mes enfants sont dans des classes surchargées, l'école publique se délite. »",
    left: { label: "Supprimer des postes", fx: { s: -10, p: -8 },
      result: "Nouvelles suppressions de postes. Les conditions se dégradent.",
      note: "Une école de l'égalité, pas du tri social." },
    right: { label: "Plan école publique", fx: { s: 10, p: 8, v: -3 },
      result: "École publique, laïque et gratuite : recrutements et baisse des effectifs.",
      note: "L'instruction émancipe : on réinvestit massivement dans l'école.",
      measure: "Plan pour l'école publique" }
  },
  pesticides: {
    char: "farmer", scene: "champ", tag: "e",
    text: "« Le lobby de l'agrochimie exige qu'on ne touche pas aux pesticides. »",
    left: { label: "Laisser faire", fx: { e: -12, p: -4 },
      result: "Les pesticides continuent d'empoisonner sols, eaux et paysans.",
      note: "La santé environnementale, une priorité du programme." },
    right: { label: "Interdire", fx: { e: 12, s: 6, v: -3 },
      result: "Plan de santé environnementale : interdiction des pesticides dangereux.",
      note: "Protéger la santé et le vivant, soutenir l'agriculture paysanne.",
      measure: "Interdiction des pesticides" }
  },
  conges: {
    char: "worker", scene: "usine", tag: "s",
    text: "« Je bosse à plein temps et je n'arrive plus à souffler. »",
    left: { label: "Travailler plus", fx: { s: -10, p: -8 },
      result: "« Travailler plus » sans gagner plus. L'épuisement s'installe.",
      note: "Le progrès, c'est aussi plus de temps pour vivre." },
    right: { label: "Partager le temps", fx: { s: 12, p: 6, v: -4 },
      result: "6ᵉ semaine de congés payés et cap vers la semaine de quatre jours.",
      note: "Mieux répartir le travail et le temps libre, créer de l'emploi.",
      measure: "6ᵉ semaine de congés payés" }
  },
  feminisme: {
    char: "citizen", scene: "manif", tag: "s",
    text: "« L'égalité salariale femmes-hommes, on l'applique enfin ? »",
    left: { label: "Laisser le marché", fx: { s: -8, p: -8 },
      result: "On compte sur la « bonne volonté » des entreprises. Les écarts perdurent.",
      note: "L'égalité ne se quémande pas, elle s'impose." },
    right: { label: "Imposer l'égalité", fx: { s: 10, p: 10 },
      result: "Égalité salariale réelle imposée et sanctionnée.",
      note: "L'émancipation passe par l'égalité concrète.",
      measure: "Égalité salariale femmes-hommes" }
  },
  monnaie: {
    char: "banker", scene: "bourse", tag: "v",
    text: "« Laissez la Banque centrale indépendante gérer la monnaie, c'est plus sage. »",
    left: { label: "Laisser faire", fx: { s: -8, p: -6, v: -6 },
      result: "La BCE garde la main et impose ses dogmes austéritaires.",
      note: "Le programme veut sortir de l'euro-austérité." },
    right: { label: "Reprendre la main", fx: { v: 9, s: 8, p: 5 },
      result: "Contrôle démocratique de la monnaie et financement direct des États.",
      note: "Mettre la monnaie au service des peuples.",
      measure: "Contrôle démocratique de la monnaie" }
  },
  traite_ref: {
    char: "eu", scene: "ue", tag: "p",
    text: "« Ratifions ce nouveau traité européen, sans déranger les électeurs. »",
    left: { label: "Ratifier en douce", fx: { p: -12, v: -6, e: -4 },
      result: "Traité ratifié sans débat. Le sentiment de dépossession s'aggrave.",
      note: "Référendum obligatoire pour ratifier tout nouveau traité." },
    right: { label: "Référendum", fx: { p: 10, v: 8, e: 3 },
      result: "Tout nouveau traité est soumis au référendum : le peuple tranche.",
      note: "Le peuple est souverain : aucun traité majeur sans son accord.",
      measure: "Référendum sur les traités" }
  },
  recherche: {
    char: "scientist", scene: "espace", tag: "v",
    text: "« La mer, l'espace, le numérique : ce sont nos frontières d'avenir. On y investit ? »",
    left: { label: "Privatiser", fx: { v: -8, s: -4 },
      result: "On brade la recherche et la filière spatiale au privé.",
      note: "Une recherche publique ambitieuse et souveraine." },
    right: { label: "Réinvestir", fx: { v: 8, e: 6, s: 4 },
      result: "Réinvestissement dans la recherche publique, Arianespace et l'économie de la mer.",
      note: "La France aux frontières de l'Humanité.",
      measure: "Recherche publique & nouvelles frontières" }
  },
  ess: {
    char: "worker", scene: "usine", tag: "s",
    text: "« Donnez des droits aux salariés et soutenez les coopératives. »",
    left: { label: "Multinationales d'abord", fx: { s: -8, v: -4 },
      result: "Tapis rouge aux multinationales, au détriment des coopératives.",
      note: "Le programme renforce le pouvoir des salariés et l'ESS." },
    right: { label: "Droits nouveaux", fx: { s: 10, p: 6, e: 4 },
      result: "Droit de veto suspensif des salariés sur les licenciements boursiers.",
      note: "La citoyenneté dans l'entreprise.",
      measure: "Droits nouveaux des salariés" }
  },

  /* ---------- ADVERSAIRES POLITIQUES (caricatures satiriques) ---------- */
  macron_emt: {
    char: "macron", scene: "plateau", tag: "p", rarity: "topical",
    text: "« Taxez les riches… mais rassurez les marchés. En même temps, voyons ! »",
    left: { label: "En même temps", fx: { s: -8, p: -8, v: -2 }, betray: true,
      result: "Le « en même temps » accouche d'un compromis mou qui ne change rien.",
      note: "Gouverner, c'est choisir un camp : celui du peuple.",
      quip: "Le « en même temps » a encore accouché de rien.", head: "LE CENTRISME PATAUGE ENCORE" },
    right: { label: "Trancher", fx: { s: 8, p: 8 }, rep: { macron: -1 },
      result: "Tu refuses le « en même temps » : un cap clair pour les classes populaires.",
      note: "Le programme tranche net : partage des richesses, services publics.",
      quip: "Jupiter est redescendu de l'Olympe, dépité.", head: "FINI LE « EN MÊME TEMPS »" }
  },
  lepen_recup: {
    char: "lepen", scene: "meeting", tag: "p", rarity: "topical",
    text: "« La colère sociale ? Je vais la récupérer et la retourner contre les étrangers. »",
    left: { label: "La laisser prospérer", fx: { p: -10, s: -4 }, betray: true,
      result: "L'extrême droite prospère sur le désespoir que tu n'as pas soigné.",
      note: "On combat l'extrême droite par la justice sociale, jamais en l'imitant.",
      quip: "Marinette se frotte les mains.", head: "LE RN EN EMBUSCADE" },
    right: { label: "Répondre par le social", fx: { s: 8, p: 8 }, rep: { lepen: -1 },
      result: "Du concret social et la fraternité contre la haine : tu coupes l'herbe sous le pied du RN.",
      note: "La fraternité et l'égalité contre la division identitaire.",
      quip: "Marinette range ses pancartes.", head: "LE PEUPLE CHOISIT LA FRATERNITÉ" }
  },
  bardella_tiktok: {
    char: "bardella", scene: "numerique", tag: "s", rarity: "topical",
    text: "« Sur TikTok, j'ai déjà séduit la jeunesse. Bonne chance pour me rattraper 😎 »",
    left: { label: "Ignorer les jeunes", fx: { p: -8, s: -4 }, betray: true,
      result: "Pendant ce temps, Jordy fait deux millions de vues sur ton inaction.",
      note: "Émanciper la jeunesse vaut mieux que la séduire à coups de filtres.",
      quip: "Le gendre idéal engrange les likes.", head: "LA JEUNESSE DÉLAISSÉE" },
    right: { label: "Du concret pour les jeunes", fx: { s: 8, p: 8 }, rep: { bardella: -1 },
      result: "Allocation d'autonomie, transports gratuits, avenir : mieux qu'un filtre TikTok.",
      note: "Donner un avenir matériel à la jeunesse, pas du vent.",
      measure: "Gratuité des transports pour les jeunes",
      quip: "Jordy n'a plus que ses likes.", head: "LA JEUNESSE REPREND LA MAIN" }
  },
  hollande_flamby: {
    char: "hollande", scene: "palais", tag: "s", rarity: "rare",
    text: "« Moi aussi j'avais dit 'mon ennemi, c'est la finance'… puis j'ai fait l'inverse. Ça va mieux ? »",
    left: { label: "Suivre son exemple", fx: { s: -12, p: -12 }, betray: true,
      result: "Tu enfiles le casque de scooter, direction le renoncement.",
      note: "Mettre la finance au pas : pour de vrai, pas en discours.",
      quip: "Flamby fond à vue d'œil.", head: "LE GRAND RENONCEMENT, SAISON 2" },
    right: { label: "Ne pas trahir, cette fois", fx: { s: 8, p: 10 }, rep: { hollande: -1 },
      result: "Cette fois, l'« ennemi finance » est vraiment mis au pas. Pas de Flamby.",
      note: "Séparer les banques, taxer la spéculation, contrôler les capitaux.",
      quip: "Le scooter restera au garage.", head: "LA FINANCE ENFIN MISE AU PAS" }
  },
  darmanin_ordre: {
    char: "darmanin", scene: "manif", tag: "p", rarity: "topical", crisis: true,
    text: "« Du désordre dans la rue ! Donnez-moi les pleins pouvoirs pour 'rétablir l'ordre'. »",
    left: { label: "Pleins pouvoirs", fx: { p: -14, v: -4 }, betray: true, set: ["repressed"],
      result: "L'ordre règne… comme dans un commissariat. Les libertés reculent.",
      note: "Rompre avec la doctrine du maintien de l'ordre violent.",
      quip: "L'ordre règne, la démocratie trinque.", head: "DÉRIVE AUTORITAIRE" },
    right: { label: "Garantir les libertés", fx: { p: 12 }, rep: { darmanin: -1 },
      result: "Droit de manifester garanti, police au service des citoyens : l'ordre juste.",
      note: "L'intervention populaire s'accueille, elle ne se réprime pas.",
      quip: "Gégé remballe ses LBD.", head: "LES LIBERTÉS PROTÉGÉES" }
  },
  retailleau_bouc: {
    char: "retailleau", scene: "plateau", tag: "p", rarity: "topical",
    text: "« Tous vos problèmes viennent de l'immigration. Durcissons, encore et encore ! »",
    left: { label: "Surenchérir", fx: { p: -8, s: -6, v: -2 }, betray: true,
      result: "On désigne des boucs émissaires ; pendant ce temps, les milliardaires prospèrent.",
      note: "Le vrai clivage est social, pas identitaire.",
      quip: "Les puissants adorent quand on regarde ailleurs.", head: "LA DROITE DURE DICTE L'AGENDA" },
    right: { label: "Refuser la division", fx: { p: 8, s: 6 }, rep: { retailleau: -1 },
      result: "Services publics partout, dignité pour toutes et tous : tu refuses les divisions.",
      note: "Répondre à la peur par l'égalité réelle et la fraternité.",
      quip: "Brunito ravale son discours.", head: "LE PEUPLE REFUSE LA DIVISION" }
  },
  attal_ecole: {
    char: "attal", scene: "ville", tag: "s", rarity: "topical",
    text: "« Uniforme, 'choc des savoirs', tri des élèves : voilà MA réforme de l'école. »",
    left: { label: "Trier les élèves", fx: { s: -8, p: -6 }, betray: true,
      result: "L'école du tri social, en uniforme. Les inégalités se reproduisent.",
      note: "L'instruction émancipe, elle ne trie pas.",
      quip: "L'uniforme ne cache pas les inégalités.", head: "L'ÉCOLE DU TRI" },
    right: { label: "École émancipatrice", fx: { s: 10, p: 8 }, rep: { attal: -1 },
      result: "École publique, gratuite, émancipatrice : on instruit, on n'aligne pas.",
      note: "Une école de l'égalité, gratuite et ambitieuse pour tous.",
      measure: "École publique émancipatrice",
      quip: "Gaby range ses uniformes.", head: "L'ÉCOLE DE L'ÉGALITÉ" }
  },
  philippe_horloges: {
    char: "philippe", scene: "bourse", tag: "s", rarity: "topical",
    text: "« En 'maître des horloges', je vous le dis : l'heure est à l'austérité. Coupez ! »",
    left: { label: "Couper les budgets", fx: { s: -12, p: -8, v: -4 }, betray: true, set: ["austerity"],
      result: "La barbe approuve. Les services publics, beaucoup moins.",
      note: "L'austérité tue les services publics : le programme bifurque.",
      quip: "Le maître des horloges a sonné l'austérité.", head: "L'AUSTÉRITÉ REVIENT" },
    right: { label: "Refuser l'austérité", fx: { s: 8, p: 6, v: 4 }, rep: { philippe: -1 },
      result: "Tu remets les horloges à l'heure du peuple : investissement, pas saignée.",
      note: "Investir dans l'humain et la transition plutôt que couper.",
      quip: "Edmond a perdu le fil du temps.", head: "STOP À L'AUSTÉRITÉ" }
  },
  glucksmann_centre: {
    char: "glucksmann", scene: "ue", tag: "p", rarity: "common",
    text: "« Unissons la gauche… mais au centre. Et surtout, pas de vagues avec Bruxelles. »",
    left: { label: "Se diluer au centre", fx: { p: -8, v: -6 }, betray: true,
      result: "La « gauche raisonnable » : raisonnablement inutile. L'espoir s'éteint.",
      note: "Ni austérité ni demi-mesures : la rupture démocratique et sociale.",
      quip: "Une gauche tiède refroidit le peuple.", head: "LA GAUCHE SE DILUE" },
    right: { label: "Rupture, pas accompagnement", fx: { p: 8, v: 6 }, rep: { glucksmann: -1 },
      result: "Une gauche de rupture, claire et populaire, qui ne gère pas le système mais le change.",
      note: "Désobéir aux traités et rompre avec l'ordre libéral.",
      quip: "Raph rajuste son écharpe européenne, vexé.", head: "CAP À GAUCHE TOUTE" }
  },
  ruffin_ego: {
    char: "ruffin", scene: "usine", tag: "s", rarity: "common",
    text: "« Je me suis émancipé de votre mouvement. Le peuple, c'est MOI qui le comprends ! »",
    left: { label: "Polémiquer", fx: { p: -6 }, betray: true,
      result: "La gauche se divise en querelles d'ego. La droite jubile.",
      note: "L'union populaire se construit sur le contenu, pas sur les personnes.",
      quip: "La division : le meilleur allié des puissants.", head: "LA GAUCHE SE CHAMAILLE" },
    right: { label: "L'union sur le programme", fx: { p: 8, s: 6 },
      result: "Plutôt que la guerre d'ego, tu tends la main : l'union se fait sur L'Avenir en commun.",
      note: "Rassembler le grand nombre autour d'un programme partagé.",
      quip: "Frankie remballe sa chemise à carreaux.", head: "L'UNION SUR LE PROGRAMME" }
  },
  zemmour_declin: {
    char: "zemmour", scene: "plateau", tag: "p", rarity: "common",
    text: "« La France décline, la civilisation s'effondre, et c'est la faute des autres ! »",
    left: { label: "Entrer dans son jeu", fx: { p: -8, s: -4 }, betray: true,
      result: "Tu joues sa partition du déclin et de la peur. Le pamphlétaire exulte.",
      note: "Face au déclinisme, porter la France aux frontières de l'Humanité.",
      quip: "Le poison du déclinisme se répand.", head: "LE POISON DU DÉCLINISME" },
    right: { label: "Opposer l'avenir", fx: { p: 8, e: 4 }, rep: { zemmour: -1 },
      result: "Au déclin, tu opposes le progrès humain : la mer, l'espace, le numérique, la fraternité.",
      note: "Le déclinisme est un renoncement : nous, nous voyons grand.",
      quip: "Érik retourne à ses pamphlets poussiéreux.", head: "L'AVENIR CONTRE LE DÉCLIN" }
  },

  /* ---------- JEAN-LUC MÉLENCHON (allié / mentor) ---------- */
  jlm_pep: {
    char: "jlm", scene: "meeting", tag: "p", rarity: "rare", hero: true,
    text: "« Alors, on lâche rien ? Le peuple est là, derrière toi. Allez, on y va ! »",
    left: { label: "Souffler un peu", fx: { p: -3 },
      result: "Tu lèves le pied. La dynamique retombe un peu.",
      note: "Une campagne populaire se nourrit du mouvement permanent.",
      quip: "Le doute n'a jamais soulevé une marée.", head: "TEMPS MORT" },
    right: { label: "On ne lâche rien !", fx: { p: 12, s: 4 },
      result: "La marée populaire se lève : meetings pleins, élan retrouvé, militants gonflés à bloc.",
      note: "La force, c'est le nombre et la conviction. Place au peuple !",
      quip: "« Qu'ils s'en aillent tous ! »", head: "MARÉE POPULAIRE" }
  },
  jlm_planif: {
    char: "jlm", scene: "usine", tag: "e", rarity: "rare", hero: true,
    text: "« La planification écologique, c'est le projet du siècle. On accélère, camarade ? »",
    left: { label: "Temporiser", fx: { e: -4 },
      result: "Tu temporises. Chaque mois perdu, la planète le paie.",
      note: "Planifier, c'est anticiper : le temps perdu ne se rattrape pas.",
      quip: "Le climat n'attend pas les hésitants.", head: "L'ÉCOLOGIE EN PAUSE" },
    right: { label: "Accélérer la bifurcation", fx: { e: 12, s: 2 },
      result: "Grand plan de bifurcation : industrie verte, emplois, sobriété choisie.",
      note: "Fixer le cap, mobiliser l'État et financer la transition, secteur par secteur.",
      measure: "Grand plan de bifurcation écologique",
      quip: "« Place au peuple, et à la planète ! »", head: "LA BIFURCATION EN MARCHE" }
  },
  jlm_energie: {
    char: "jlm", scene: "meeting", tag: "p", rarity: "rare", hero: true, topical: true,
    text: "« Les éditorialistes répètent : 'mais où trouve-t-il toute cette énergie ?'. Montre-leur. »",
    left: { label: "Lever le pied", fx: { p: -3 },
      result: "Tu ralentis la campagne. Les plateaux télé reprennent la main.",
      note: "Le terrain et la conviction font gagner les campagnes populaires.",
      quip: "Les éditorialistes respirent.", head: "LA CAMPAGNE RALENTIT" },
    right: { label: "Sillonner le pays", fx: { p: 11 },
      result: "Meetings, terrain, vidéos : la campagne est partout. L'énergie, c'est celle du peuple.",
      note: "Une campagne se gagne sur le terrain et dans les têtes, pas dans les studios.",
      quip: "« Où trouve-t-il cette énergie ? » Dans le peuple, pardi.", head: "L'ÉNERGIE DU PEUPLE" }
  },

  /* ---------- MÉDIAS & OLIGARQUES ---------- */
  bollore_rachat: {
    char: "bollore", scene: "studio_tv", tag: "p", rarity: "topical",
    text: "« Je rachète le dernier média indépendant. Bientôt, toute la presse pensera… comme moi. »",
    left: { label: "Laisser faire", fx: { p: -12, v: -4 }, betray: true,
      result: "Un seul milliardaire tient désormais journaux, chaînes et maisons d'édition. Le pluralisme s'éteint.",
      note: "La concentration des médias est un poison pour la démocratie.",
      quip: "La « liberté de la presse », version actionnaire unique.", head: "L'EMPIRE AVALE LA PRESSE" },
    right: { label: "Loi anti-concentration", fx: { p: 14, s: 2 },
      result: "Loi anti-concentration, soutien aux médias indépendants et coopératifs : on libère l'info.",
      note: "Garantir le pluralisme et l'indépendance des médias face aux milliardaires.",
      measure: "Loi anti-concentration des médias",
      quip: "Bolloré ravale son chéquier.", head: "LA PRESSE LIBÉRÉE DES MILLIARDAIRES" }
  },
  hanouna_show: {
    char: "hanouna", scene: "studio_tv", tag: "p", rarity: "topical",
    text: "« Viens dans mon émission ! On va « débattre » : 12 chroniqueurs qui hurlent et toi au milieu. »",
    left: { label: "Jouer le cirque", fx: { p: -10 }, betray: true,
      result: "Tu te fais ridiculiser dans un brouhaha de prime time. Le fond ? On s'en fiche, place au clash.",
      note: "La télé-poubelle transforme le débat en spectacle vide.",
      quip: "Standing ovation du public chauffé à blanc. Bravo.", head: "LE GRAND N'IMPORTE QUOI" },
    right: { label: "Refuser le cirque", fx: { p: 12, s: 2 },
      result: "Tu boudes le clash et finances un audiovisuel public indépendant et de qualité.",
      note: "Un service public de l'information fort, libéré de l'audimat et des annonceurs.",
      measure: "Audiovisuel public renforcé",
      quip: "L'animateur reste seul avec ses 12 chroniqueurs.", head: "LE SERVICE PUBLIC PLUTÔT QUE LE CIRQUE" }
  },
  cnews_propagande: {
    char: "cnews", scene: "studio_tv", tag: "p", rarity: "topical",
    text: "« Notre chaîne d'info répète ta « menace » en boucle, 24h/24, sur fond de musique anxiogène. »",
    left: { label: "Se justifier chez eux", fx: { p: -8, v: -2 }, betray: true,
      result: "Tu joues sur leur terrain : panique, peur, division. Tu as déjà perdu le match.",
      note: "Ne pas laisser des chaînes d'opinion dicter l'agenda et le vocabulaire.",
      quip: "Le bandeau rouge clignote : « TOUT VA MAL ». Comme d'habitude.", head: "LE MATRAQUAGE CONTINUE" },
    right: { label: "Garantir le pluralisme", fx: { p: 12 },
      result: "Conseil de déontologie des médias, respect du pluralisme, fin des chaînes mono-opinion.",
      note: "Un vrai contre-pouvoir citoyen sur les médias pour garantir l'honnêteté de l'info.",
      measure: "Conseil de déontologie des médias",
      quip: "Le doigt levé de l'éditorialiste retombe, tout penaud.", head: "LE PLURALISME L'EMPORTE" }
  },

  /* ---------- ÉVÉNEMENTS SUBIS (crise imprévue : tu choisis comment réagir) ---------- */
  ev_cnews: {
    event: true, hits: "p", char: "cnews", scene: "studio_tv", tag: "p",
    text: "⚡ IMPRÉVU. Une chaîne d'info matraque ton nom en boucle, 24h/24, sur fond de musique anxiogène.",
    left: { label: "Laisser dire", fx: { p: -12 },
      result: "Tu ne réponds pas. Le matraquage s'installe et ta cote dégringole.",
      note: "Sans riposte ni pluralisme garanti, l'opinion se fabrique sans toi.",
      quip: "« Débat » du jour : toi, en pire.", head: "MATRAQUAGE MÉDIATIQUE" },
    right: { label: "Contre-offensive terrain", fx: { p: -4, s: -4 },
      result: "Tu désertes les studios pour le réel : réunions publiques, vidéos, porte-à-porte. Ça coûte des moyens, mais ça limite la casse.",
      note: "La bataille culturelle se mène au contact, pas sur leur plateau.",
      quip: "Pendant qu'ils hurlent en boucle, toi tu es sur le terrain.", head: "RIPOSTE POPULAIRE" }
  },
  ev_hanouna: {
    event: true, hits: "p", char: "hanouna", scene: "studio_tv", tag: "p",
    text: "⚡ IMPRÉVU. On te tourne en ridicule en prime time devant deux millions de téléspectateurs.",
    left: { label: "Encaisser", fx: { p: -11 },
      result: "Le clash fait de l'audience, ton image trinque. Du fond ? Aucun.",
      note: "La télé-poubelle transforme le débat en spectacle.",
      quip: "Standing ovation du public chauffé à blanc.", head: "PRIME TIME ASSASSIN" },
    right: { label: "Boycott + service public", fx: { p: -4, e: -3 },
      result: "Tu refuses le cirque et mises sur un audiovisuel public de qualité. Long à payer, mais digne.",
      note: "Financer une information libre plutôt que nourrir l'audimat du clash.",
      quip: "L'animateur reste seul avec ses douze chroniqueurs.", head: "ON COUPE LE CIRQUE" }
  },
  ev_bollore: {
    event: true, hits: "p", char: "bollore", scene: "studio_tv", tag: "p",
    text: "⚡ IMPRÉVU. L'empire Bolloré rachète trois titres de plus et oriente toutes les « Unes » contre toi.",
    left: { label: "Subir l'empire", fx: { p: -10, v: -3 },
      result: "Un seul milliardaire décide de ce que lisent des millions de gens. La démocratie vacille.",
      note: "Briser les monopoles médiatiques est vital pour la souveraineté populaire.",
      quip: "La pluralité d'opinions ? Réservée à l'actionnaire.", head: "L'EMPIRE CONTRE-ATTAQUE" },
    right: { label: "Loi d'urgence anti-monopole", fx: { p: -3, s: -4 },
      result: "Tu dégaines une loi anti-concentration en urgence. Bras de fer juridique coûteux, mais l'info respire.",
      note: "Garantir le pluralisme face aux milliardaires des médias.",
      quip: "Bolloré range son chéquier en grimaçant.", head: "L'INFO RÉSISTE" }
  },
  ev_extreme_droite: {
    event: true, hits: "p", char: "lepen", scene: "manif", tag: "p",
    text: "⚡ IMPRÉVU. L'extrême droite organise des manifestations monstres en récupérant la colère sociale.",
    left: { label: "Ignorer", fx: { p: -12, s: -3 },
      result: "Faute de réponse visible, la rue est captée par les marchands de haine.",
      note: "On combat l'extrême droite par la justice sociale, vite et fort.",
      quip: "Pas de solution, mais beaucoup de mégaphones.", head: "LA RUE RÉCUPÉRÉE" },
    right: { label: "Riposte sociale immédiate", fx: { p: -4, s: -5 },
      result: "Tu réponds par du concret : pouvoir d'achat, services publics, fraternité. Ça pèse sur le budget, mais coupe l'herbe sous le pied du RN.",
      note: "La meilleure digue contre l'extrême droite, c'est l'égalité réelle.",
      quip: "Marinette range ses pancartes.", head: "LE SOCIAL CONTRE LA HAINE" }
  },
  ev_notation: {
    event: true, hits: "v", char: "banker", scene: "bourse", tag: "v",
    text: "⚡ IMPRÉVU. Les agences de notation dégradent la France. Les marchés s'affolent, les taux montent.",
    left: { label: "Plier aux marchés", fx: { v: -12, s: -3 },
      result: "Tu cèdes à la « pression des marchés » : le chantage de la dette dicte ta politique.",
      note: "Reprendre le contrôle démocratique de la monnaie et de la dette.",
      quip: "Trois lettres pour faire trembler tout un pays.", head: "LA FRANCE DÉGRADÉE" },
    right: { label: "Tenir + contrôle des capitaux", fx: { v: -5, s: -4 },
      result: "Tu ignores les agences et bloques la fuite des capitaux. Tension immédiate, mais tu gardes la main.",
      note: "Protéger l'économie réelle des attaques spéculatives.",
      quip: "Les agences notent. Le peuple, lui, vote.", head: "LA FINANCE NE DICTE PAS" }
  },
  ev_speculation: {
    event: true, hits: "v", char: "lobby", scene: "bourse", tag: "v",
    text: "⚡ IMPRÉVU. Vague de spéculation contre la dette française : les marchés testent ta détermination.",
    left: { label: "Rassurer les marchés", fx: { v: -10, s: -2 },
      result: "Tu fais des gestes pour calmer la Bourse… qui en redemandera.",
      note: "Céder à la spéculation, c'est l'encourager.",
      quip: "Les vautours sentent le sang.", head: "ATTAQUE SPÉCULATIVE" },
    right: { label: "Pôle bancaire public", fx: { v: -4, s: -5 },
      result: "Tu actives un pôle public pour soutenir l'économie réelle. Coûteux à lancer, mais tu reprends la main.",
      note: "Mettre la finance au service de l'intérêt général.",
      quip: "Mauvais calcul, messieurs les spéculateurs.", head: "LA RIPOSTE PUBLIQUE" }
  },
  ev_canicule: {
    event: true, hits: "e", char: "scientist", scene: "canicule", tag: "e",
    text: "⚡ IMPRÉVU. Canicule record et méga-incendies ravagent le Sud du pays.",
    left: { label: "Gérer dans l'urgence", fx: { e: -12, s: -2 },
      result: "On éteint les feux sans rien changer. La prochaine canicule sera pire.",
      note: "Sans planification, chaque crise climatique en aggrave une autre.",
      quip: "L'été dure désormais six mois.", head: "LE SUD EN FEU" },
    right: { label: "Plan d'adaptation choc", fx: { e: -5, s: -4 },
      result: "Tu lances en urgence rénovation, reforestation, gestion de l'eau. Facture immédiate, résilience durable.",
      note: "Anticiper et planifier protège les plus fragiles.",
      quip: "Mieux vaut un plan qu'un climatiseur géant.", head: "LA FRANCE S'ADAPTE" }
  },
  ev_secheresse: {
    event: true, hits: "e", char: "farmer", scene: "champ", tag: "e",
    text: "⚡ IMPRÉVU. Sécheresse historique : nappes à sec, récoltes perdues, paysans en détresse.",
    left: { label: "Laisser faire le marché", fx: { e: -10, s: -3 },
      result: "Les conflits d'usage de l'eau explosent. Le productivisme montre ses limites.",
      note: "Faire de l'eau un bien commun et planifier son partage.",
      quip: "Les méga-bassines n'ont rempli que les profits.", head: "LA TERRE A SOIF" },
    right: { label: "Eau bien commun + soutien", fx: { e: -4, s: -5 },
      result: "Tu rationnes équitablement et soutiens les paysans. Cher pour les caisses, juste pour le pays.",
      note: "L'eau, l'air, l'énergie : des biens communs, pas des marchandises.",
      quip: "L'eau au peuple, pas aux profiteurs.", head: "L'EAU PARTAGÉE" }
  },
  ev_greve_patronale: {
    event: true, hits: "s", char: "medef", scene: "usine", tag: "s",
    text: "⚡ IMPRÉVU. Le patronat orchestre un « mur de l'investissement » : grève des embauches pour te punir.",
    left: { label: "Reculer", fx: { s: -10 },
      result: "Tu lâches du lest sur tes réformes pour amadouer le grand capital. Il en redemandera.",
      note: "Céder au chantage à l'emploi, c'est s'y soumettre.",
      quip: "Les milliardaires font la grève… du partage.", head: "CHANTAGE À L'EMPLOI" },
    right: { label: "Tenir + relance publique", fx: { s: -4, v: -4 },
      result: "Tu réponds par l'investissement public et le pouvoir des salariés. Effort budgétaire, mais tu ne plies pas.",
      note: "Répondre au chantage par la maîtrise publique et les droits des salariés.",
      quip: "Pas d'investissement privé ? L'État s'en charge.", head: "L'ÉTAT NE PLIE PAS" }
  },
  ev_marronnier: {
    event: true, hits: "p", char: "cnews", scene: "studio_tv", tag: "p",
    text: "⚡ IMPRÉVU. Marronnier de l'« insécurité » monté en boucle pour faire oublier le social.",
    left: { label: "Suivre l'agenda", fx: { p: -8, s: -2 },
      result: "Tu cours derrière le fait divers. On oublie le partage des richesses. Recette éculée.",
      note: "Ne pas laisser les chaînes d'opinion fixer l'agenda.",
      quip: "Le fait divers du jour cache le milliard du jour.", head: "DIVERSION GÉNÉRALE" },
    right: { label: "Recentrer sur le réel", fx: { p: -3, s: -3 },
      result: "Tu ramènes le débat sur le concret : salaires, services publics, sécurité sociale. Moins spectaculaire, plus utile.",
      note: "Répondre par le concret social et les services publics partout.",
      quip: "La meilleure sécurité, c'est l'égalité.", head: "RETOUR AU RÉEL" }
  },

  /* ---------- ACTE IV — 2032 : le bilan ---------- */
  bilan: {
    char: "citizen", scene: "palais", tag: "p", finale: true,
    text: "« 2032. Fin du mandat. Soumettez-vous votre bilan au peuple par référendum ? »",
    left: { label: "M'accrocher au pouvoir", fx: { p: -16 },
      result: "Tu cherches à te maintenir. Le peuple n'aime pas qu'on s'accroche.",
      note: "Le pouvoir au peuple, jusqu'au bout." },
    right: { label: "Proclamer la 6ᵉ République", fx: { p: 14, v: 4 }, set: ["sixth_republic"],
      result: "La nouvelle Constitution est adoptée par référendum : la 6ᵉ République est proclamée !",
      note: "Le peuple devient le seul souverain. L'avenir s'écrit en commun.",
      measure: "6ᵉ République proclamée" }
  }
};

/* =========================================================
   MODE HISTOIRE — déroulé en actes (les cartes conditionnelles
   sont sautées si leur cond() est fausse).
   ========================================================= */
const STORY = [
  { act: "ACTE I", title: "2027 · La prise du pouvoir", year: 2027, scene: "palais" },
  "invest", "smic", "medef_tax", "capital_flight", "macron_emt", "vote16", "jlm_pep", "media",
  { act: "ACTE II", title: "2028-2029 · Les fronts s'ouvrent", year: 2028, scene: "ue" },
  "eu_austerity", "philippe_horloges", "trump_tariffs", "trump_retaliation", "trump_greenland", "ormuz", "retraite",
  "hopital", "bardella_tiktok", "mercosur", "farmers_revolt", "energy_common", "lepen_recup",
  { act: "ACTE III", title: "2030-2031 · Tempêtes", year: 2030, scene: "canicule" },
  "canicule", "jlm_planif", "cop30", "nuclear", "darmanin_ordre", "censure", "krach",
  "retailleau_bouc", "ukraine", "gaza", "cnews_propagande", "bollore_rachat", "attal_ecole", "ai_act", "musk_x", "hanouna_show", "glucksmann_centre", "outremer", "zemmour_declin",
  { act: "ACTE IV", title: "2032 · Le bilan", year: 2032, scene: "palais" },
  "hollande_flamby", "ruffin_ego", "jlm_energie", "corruption", "bilan"
];

/* =========================================================
   MODE INFINI — pioche (cartes evergreen + crises topicales),
   tirées au hasard, difficulté croissante gérée par le moteur.
   ========================================================= */
const POOL = [
  "smic", "medef_tax", "vote16", "media", "eu_austerity", "trump_tariffs", "ormuz",
  "retraite", "hopital", "mercosur", "energy_common", "canicule", "cop30", "nuclear",
  "ukraine", "gaza", "ai_act", "krach", "outremer", "jeunesse", "corruption",
  "manif_repression", "ecole", "pesticides", "conges", "feminisme", "monnaie",
  "traite_ref", "recherche", "ess",
  // Adversaires + Mélenchon (mode Survie)
  "macron_emt", "lepen_recup", "bardella_tiktok", "hollande_flamby", "darmanin_ordre",
  "retailleau_bouc", "attal_ecole", "philippe_horloges", "glucksmann_centre", "ruffin_ego",
  "zemmour_declin", "jlm_pep", "jlm_planif", "jlm_energie",
  "trump_greenland", "musk_x", "bollore_rachat", "hanouna_show", "cnews_propagande"
];

const SLOGANS = [
  "Place au peuple !", "L'avenir en commun.", "Le pouvoir au peuple.",
  "On ne lâche rien.", "Un autre monde est possible.", "Résistance et alternative."
];

/* Événements subis : crises imprévues, mais avec deux vraies options de réponse. */
const EVENTS = [
  "ev_cnews", "ev_hanouna", "ev_bollore", "ev_extreme_droite", "ev_notation",
  "ev_speculation", "ev_canicule", "ev_secheresse", "ev_greve_patronale", "ev_marronnier"
];
EVENTS.forEach(function (id) { var c = CARDS[id]; if (c) { c.event = true; } });
