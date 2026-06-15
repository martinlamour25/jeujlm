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
  judge: "La magistrate anticorruption"
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
    char: "worker", scene: "usine", tag: "s",
    text: "« Le SMIC ne suffit plus pour vivre. Vous l'augmentez, oui ou non ? »",
    left: { label: "Geler", fx: { s: -14, p: -10 },
      result: "Salaires gelés « pour la compétitivité ». La pauvreté laborieuse grimpe.",
      note: "Personne ne doit travailler à plein temps et rester pauvre." },
    right: { label: "1 400 € nets", fx: { s: 14, p: 8, v: -5 }, set: ["raised_smic"],
      result: "Le SMIC passe immédiatement à 1 400 € nets. Le pouvoir d'achat repart, le patronat fulmine.",
      note: "SMIC à 1 400 € nets pour vivre dignement de son travail.",
      measure: "SMIC à 1 400 € nets" }
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
    char: "lobby", scene: "ville", tag: "p",
    text: "« Soutenez-moi et mes dix chaînes d'info vanteront votre bilan. »",
    left: { label: "Pactiser", fx: { p: -14, v: -4 },
      result: "Tu t'achètes une couverture médiatique… au prix de la démocratie.",
      note: "La concentration des médias est un poison pour le débat public." },
    right: { label: "Briser les monopoles", fx: { p: 12, v: -3 }, set: ["free_media"],
      result: "Tu garanties l'indépendance des médias et brises les concentrations.",
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
    left: { label: "S'écraser", fx: { v: -14, p: -8, s: -4 }, set: ["submit_trump"],
      result: "Tu cèdes et achètes des armes américaines pour calmer Washington. La souveraineté s'efface.",
      note: "Une France vassale n'est plus une France indépendante." },
    right: { label: "Riposter", fx: { v: 12, p: 8, s: -5 }, set: ["defy_trump"],
      result: "Tu actives la riposte douanière européenne et défends le droit international au Groenland.",
      note: "La France indépendante ne se range derrière aucune puissance.",
      measure: "Riposte souveraine aux tarifs", then: { id: "trump_retaliation", in: 2 } }
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
    left: { label: "Tout climatiser", fx: { e: -14, p: -3 },
      result: "On climatise à tout-va. La facture énergétique et carbone explose, fuite en avant.",
      note: "Sans planification, chaque crise en aggrave une autre." },
    right: { label: "Plan climat d'urgence", fx: { e: 14, s: 6, v: -4 }, set: ["climate_plan"],
      result: "Règle verte constitutionnelle, rénovation thermique massive, forêts et eau protégées.",
      note: "Ne pas prélever ni produire plus que ce que la nature peut reconstituer.",
      measure: "Règle verte constitutionnelle" }
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
    char: "diplomat", scene: "monde", tag: "v", topical: true,
    text: "« La trêve en Ukraine est fragile et sans cesse violée. Quelle position pour la France ? »",
    left: { label: "Escalade militaire", fx: { v: -8, p: -6, s: -4 },
      result: "Tu t'engages dans une logique d'escalade et de course aux armements.",
      note: "Le programme défend la paix par le droit, pas la surenchère." },
    right: { label: "Diplomatie & ONU", fx: { v: 12, p: 6 }, set: ["peace_un"],
      result: "Tu pousses une conférence de paix sous mandat de l'ONU, seul cadre légitime.",
      note: "La France au service de la paix : la sécurité collective passe par l'ONU.",
      measure: "Conférence de paix sous l'ONU" }
  },
  gaza: {
    char: "diplomat", scene: "monde", tag: "v", topical: true,
    text: "« À Gaza, le cessez-le-feu vacille et les morts s'accumulent. La France se tait ou agit ? »",
    left: { label: "Se taire", fx: { v: -8, p: -8 },
      result: "Le silence diplomatique de la France choque une partie de l'opinion.",
      note: "Le programme défend le droit international partout, sans deux poids deux mesures." },
    right: { label: "Reconnaître & sanctionner", fx: { v: 10, p: 8, s: -3 }, set: ["intl_law"],
      result: "Tu agis pour le respect du droit international et la protection des civils.",
      note: "Faire respecter le droit international et la Charte de l'ONU.",
      measure: "Défense du droit international" }
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
      result: "Tu garanties le droit de manifester. Le dialogue prime sur la matraque.",
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
  { act: "ACTE I", title: "2027 — La prise du pouvoir", year: 2027, scene: "palais" },
  "invest", "smic", "medef_tax", "capital_flight", "vote16", "media",
  { act: "ACTE II", title: "2028-2029 — Les fronts s'ouvrent", year: 2028, scene: "ue" },
  "eu_austerity", "trump_tariffs", "trump_retaliation", "ormuz", "retraite",
  "hopital", "mercosur", "farmers_revolt", "energy_common",
  { act: "ACTE III", title: "2030-2031 — Tempêtes", year: 2030, scene: "canicule" },
  "canicule", "cop30", "nuclear", "censure", "krach", "ukraine", "gaza", "ai_act", "outremer",
  { act: "ACTE IV", title: "2032 — Le bilan", year: 2032, scene: "palais" },
  "corruption", "bilan"
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
  "traite_ref", "recherche", "ess"
];

const SLOGANS = [
  "Place au peuple !", "L'avenir en commun.", "Le pouvoir au peuple.",
  "On ne lâche rien.", "Un autre monde est possible.", "Résistance et alternative."
];
