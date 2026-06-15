/*
 * data.js — « Président·e du Peuple »
 * ----------------------------------
 * Jeu de décision (style « swipe ») en soutien à la campagne 2027 de
 * Jean-Luc Mélenchon. Tout le contenu s'appuie sur le programme
 * « L'Avenir en commun » (version actualisée) de la France insoumise.
 * Jeu citoyen non officiel, à but pédagogique.
 *
 * fx = effets sur les 4 piliers :
 *   p = Peuple / Démocratie     s = Social
 *   e = Écologie / Planète       v = Souveraineté / Paix
 */

// Les 4 piliers à maintenir en vie (0 = chute de la présidence).
const GAUGES = {
  p: { name: "Peuple", short: "Démocratie & soutien populaire", color: "#ff2b46", icon: "fist" },
  s: { name: "Social", short: "Partage des richesses & services publics", color: "#ffd166", icon: "social" },
  e: { name: "Planète", short: "Planification écologique", color: "#2bd97a", icon: "leaf" },
  v: { name: "Souverain", short: "Indépendance, paix & démocratie internationale", color: "#3f7fe0", icon: "globe" }
};

// Écrans de défaite quand un pilier tombe à 0.
const DEFEATS = {
  p: { title: "Destitué·e par le peuple", text: "Coupé·e des citoyens, tu es révoqué·e par référendum. Le pouvoir, c'est au peuple qu'il appartient." },
  s: { title: "La révolte sociale", text: "La misère et les inégalités ont explosé, le pays se soulève. Sans justice sociale, pas de République." },
  e: { title: "L'effondrement écologique", text: "Le climat s'est emballé, la nature est saccagée. Sans planification écologique, il n'y a pas d'avenir." },
  v: { title: "La France sous tutelle", text: "Soumise aux marchés et aux puissances étrangères, la France a perdu son indépendance." }
};

/* Banque de cartes. Chaque carte : un personnage, un dilemme, deux choix.
   theme sert à la couleur/au chip. avatar = archétype graphique. */
const CARDS = [
  {
    theme: "s", avatar: "suit", who: "Un lobbyiste du CAC 40",
    text: "« Baissez l'impôt des grandes entreprises, sinon nous délocalisons. »",
    right: { label: "Tenir tête", fx: { s: 14, p: 8, v: -5 },
      result: "Tu instaures un revenu maximum et tu taxes les superprofits. Le patronat fulmine, le peuple respire.",
      note: "Revenu maximum autorisé et fin des cadeaux fiscaux : partager les richesses plutôt que les concentrer.",
      measure: "Taxe sur les superprofits" },
    left: { label: "Céder", fx: { s: -14, p: -10, v: 4 },
      result: "Nouveaux cadeaux fiscaux aux actionnaires. Les services publics trinquent.",
      note: "Le programme refuse l'austérité et la course au moins-disant fiscal." }
  },
  {
    theme: "p", avatar: "youth", who: "Une lycéenne mobilisée",
    text: "« On veut décider de notre avenir : donnez-nous le droit de vote à 16 ans ! »",
    right: { label: "Accorder", fx: { p: 14, s: 3 },
      result: "Vote à 16 ans, reconnaissance du vote blanc : la jeunesse entre en politique.",
      note: "Droit de vote à 16 ans et généralisation de la proportionnelle pour une démocratie vivante.",
      measure: "Droit de vote à 16 ans" },
    left: { label: "Refuser", fx: { p: -12 },
      result: "La jeunesse se sent méprisée et se détourne des urnes.",
      note: "Faire confiance aux citoyen·nes, c'est élargir leur pouvoir, pas le restreindre." }
  },
  {
    theme: "v", avatar: "eu", who: "La Commission européenne",
    text: "« Votre déficit dépasse les 3 % autorisés. Coupez dans les dépenses publiques ! »",
    right: { label: "Désobéir", fx: { v: 10, p: 8, s: 8, e: -4 },
      result: "Tu actives le « Plan B » et désobéis aux traités d'austérité. Bruxelles s'étrangle, le pays investit.",
      note: "Plan A : renégocier les traités. Plan B : désobéir unilatéralement pour protéger le peuple.",
      measure: "Désobéissance aux traités (Plan B)" },
    left: { label: "Obéir", fx: { s: -14, p: -10, v: -8 },
      result: "Cure d'austérité imposée par Bruxelles. Hôpitaux et écoles à l'os.",
      note: "Les traités européens imposent l'austérité : le programme propose d'en sortir." }
  },
  {
    theme: "e", avatar: "scientist", who: "Une climatologue du GIEC",
    text: "« Il reste très peu de temps. Allez-vous planifier la sortie des énergies fossiles ? »",
    right: { label: "Planifier", fx: { e: 16, p: 4, s: -6 },
      result: "Tu lances la planification écologique : cap sur 100 % d'énergies renouvelables en 2050.",
      note: "Le marché ne sauvera pas le climat : on anticipe, on organise, on finance la bifurcation.",
      measure: "100 % renouvelables en 2050" },
    left: { label: "Laisser faire", fx: { e: -16, p: -6 },
      result: "On laisse le marché décider. Les émissions repartent à la hausse.",
      note: "La règle verte interdit de prélever plus que ce que la nature peut reconstituer." }
  },
  {
    theme: "v", avatar: "general", who: "Un général de l'OTAN",
    text: "« L'Alliance exige plus de troupes alignées sur Washington. »",
    right: { label: "Sortir de l'OTAN", fx: { v: 14, p: 6, s: -4 },
      result: "La France sort du commandement de l'OTAN et retrouve sa voix de non-alignée.",
      note: "L'OTAN, héritée de la guerre froide, n'a plus lieu d'être. La France se défend elle-même.",
      measure: "Sortie de l'OTAN" },
    left: { label: "S'aligner", fx: { v: -14, p: -6 },
      result: "La France s'aligne et perd son indépendance diplomatique.",
      note: "Une France indépendante parle à tous et ne se range derrière personne." }
  },
  {
    theme: "e", avatar: "suit", who: "Un grand groupe de l'énergie",
    text: "« Privatisons les barrages hydroélectriques : c'est très rentable. »",
    right: { label: "Refuser", fx: { e: 10, s: 8, p: 6 },
      result: "L'énergie reste un bien commun, gérée pour l'intérêt général.",
      note: "L'eau, l'air, l'énergie ne sont pas des marchandises : ce sont des biens communs.",
      measure: "Énergie en bien commun" },
    left: { label: "Privatiser", fx: { e: -10, s: -10 },
      result: "Les barrages partent au privé, les prix s'envolent.",
      note: "Le programme protège les biens communs du marché." }
  },
  {
    theme: "s", avatar: "worker", who: "Une infirmière des urgences",
    text: "« L'hôpital craque. Rouvrez des lits, embauchez des soignants ! »",
    right: { label: "Plan d'urgence", fx: { s: 14, p: 8, v: -3 },
      result: "Plan d'urgence pour l'hôpital public et remboursement à 100 % des soins prescrits.",
      note: "Reconstruire le service public hospitalier : la santé ne se marchande pas.",
      measure: "Remboursement à 100 % des soins" },
    left: { label: "Économiser", fx: { s: -14, p: -12 },
      result: "Nouvelles fermetures de lits. Les urgences débordent.",
      note: "Vingt ans de fermetures de lits ont mis l'hôpital à genoux." }
  },
  {
    theme: "v", avatar: "worker", who: "Un agriculteur en colère",
    text: "« On crève à cause des accords de libre-échange. Protégez-nous ! »",
    right: { label: "Protéger", fx: { v: 8, e: 8, s: 8 },
      result: "Protectionnisme solidaire et taxe carbone aux frontières de l'UE.",
      note: "Taxer ce qui ne respecte pas les normes sociales et écologiques, relocaliser l'agriculture paysanne.",
      measure: "Protectionnisme solidaire" },
    left: { label: "Signer le Mercosur", fx: { e: -10, s: -8, v: -6, p: -4 },
      result: "Un nouvel accord de libre-échange inonde le marché de produits low-cost.",
      note: "Le programme refuse les accords climaticides comme le Mercosur." }
  },
  {
    theme: "p", avatar: "scientist", who: "Une juriste constitutionnaliste",
    text: "« La V<sup>e</sup> République concentre tout sur le président. On fait quoi ? »",
    right: { label: "Constituante", fx: { p: 16, v: 3, s: -3 },
      result: "Tu convoques une Assemblée constituante : le peuple écrit la 6<sup>e</sup> République.",
      note: "Une Constitution écrite par les citoyen·nes, puis soumise au référendum.",
      measure: "Assemblée constituante (6ᵉ République)" },
    left: { label: "Ne rien changer", fx: { p: -14 },
      result: "La monarchie présidentielle continue. Le peuple reste spectateur.",
      note: "Abolir la monarchie présidentielle est au cœur du programme." }
  },
  {
    theme: "v", avatar: "suit", who: "Le gouverneur de la BCE",
    text: "« Laissez la Banque centrale indépendante gérer la monnaie. »",
    right: { label: "Reprendre la main", fx: { v: 9, s: 8, p: 5 },
      result: "Contrôle démocratique de la monnaie et financement direct des États.",
      note: "Mettre fin à l'indépendance de la BCE pour la mettre au service des peuples.",
      measure: "Contrôle démocratique de la monnaie" },
    left: { label: "Laisser faire", fx: { s: -8, p: -6, v: -6 },
      result: "La BCE garde la main et impose ses dogmes austéritaires.",
      note: "Le programme veut sortir de l'euro-austérité." }
  },
  {
    theme: "s", avatar: "worker", who: "Un délégué syndical",
    text: "« Le SMIC ne suffit plus pour vivre dignement. »",
    right: { label: "Augmenter", fx: { s: 14, p: 8, v: -4 },
      result: "Le SMIC passe immédiatement à 1 400 € nets. Le pouvoir d'achat repart.",
      note: "Vivre dignement de son travail : SMIC à 1 400 € nets pour 35 h.",
      measure: "SMIC à 1 400 € nets" },
    left: { label: "Geler", fx: { s: -14, p: -10 },
      result: "Salaires gelés « pour la compétitivité ». La pauvreté laborieuse grimpe.",
      note: "Personne ne doit travailler à temps plein et rester pauvre." }
  },
  {
    theme: "s", avatar: "citizen", who: "Un retraité",
    text: "« On nous a volé nos retraites. Rendez-nous le droit de partir à 60 ans ! »",
    right: { label: "Retraite à 60 ans", fx: { s: 12, p: 10, v: -4 },
      result: "Retour de la retraite à 60 ans à taux plein et revalorisation des petites pensions.",
      note: "Le travail use : le droit au repos après une vie de labeur est un acquis à reconquérir.",
      measure: "Retraite à 60 ans" },
    left: { label: "Reculer l'âge", fx: { s: -12, p: -14 },
      result: "L'âge de départ recule encore. La rue gronde.",
      note: "Le programme rétablit la retraite à 60 ans." }
  },
  {
    theme: "v", avatar: "suit", who: "Le patron d'une plateforme tech",
    text: "« Laissez-nous exploiter librement les données des Français, c'est le progrès. »",
    right: { label: "Souveraineté num.", fx: { v: 10, p: 6, s: -3 },
      result: "Neutralité du net garantie, logiciels libres dans l'administration.",
      note: "La révolution numérique est d'intérêt général : on en reprend la maîtrise publique.",
      measure: "Souveraineté numérique" },
    left: { label: "Tout privatiser", fx: { v: -10, p: -6, s: -4 },
      result: "Les données partent au plus offrant. La surveillance s'étend.",
      note: "Le programme défend la neutralité du net et les communs numériques." }
  },
  {
    theme: "p", avatar: "general", who: "Un préfet",
    text: "« Des milliers de gens manifestent dans la rue. On donne l'ordre de réprimer ? »",
    right: { label: "Garantir le droit", fx: { p: 12, v: -2 },
      result: "Tu garanties le droit de manifester. Le dialogue prime sur la matraque.",
      note: "L'intervention populaire doit être accueillie, pas réprimée avec violence.",
      measure: "Droit de manifester garanti" },
    left: { label: "Réprimer", fx: { p: -16, v: -4 },
      result: "La répression fait des blessés. La colère monte d'un cran.",
      note: "Le programme rompt avec la doctrine du maintien de l'ordre violent." }
  },
  {
    theme: "e", avatar: "suit", who: "Un major du pétrole",
    text: "« Autorisez de nouveaux forages : ça crée de l'emploi tout de suite. »",
    right: { label: "Règle verte", fx: { e: 14, p: 6, s: -5 },
      result: "Tu inscris la règle verte dans la Constitution. Pas de nouveaux fossiles.",
      note: "Ne pas prélever ni produire plus que ce que la nature peut supporter.",
      measure: "Règle verte constitutionnelle" },
    left: { label: "Autoriser", fx: { e: -16, p: -6, s: 4 },
      result: "Quelques emplois fossiles aujourd'hui, le climat ravagé demain.",
      note: "La bifurcation crée bien plus d'emplois durables que le fossile." }
  },
  {
    theme: "s", avatar: "citizen", who: "Une élue d'Outre-mer",
    text: "« L'égalité réelle pour les Outre-mer, c'est pour quand ? »",
    right: { label: "Égalité réelle", fx: { s: 10, p: 8, e: 4 },
      result: "Plan d'égalité réelle : les Outre-mer, pointes avancées du progrès humain.",
      note: "Les Outre-mer sont une chance : développement endogène et planification écologique.",
      measure: "Égalité réelle Outre-mer" },
    left: { label: "Reporter", fx: { s: -8, p: -8 },
      result: "Encore des promesses repoussées. Le sentiment d'abandon grandit.",
      note: "L'égalité réelle est un engagement central du programme." }
  },
  {
    theme: "p", avatar: "suit", who: "Un milliardaire des médias",
    text: "« Soutenez-moi et j'orienterai l'information en votre faveur. »",
    right: { label: "Refuser le pacte", fx: { p: 12, v: -3 },
      result: "Tu garanties l'indépendance des médias et brises les concentrations.",
      note: "Libérer l'information de la mainmise des milliardaires pour un vrai pluralisme.",
      measure: "Indépendance des médias" },
    left: { label: "Pactiser", fx: { p: -14, v: -4 },
      result: "Tu t'achètes une couverture médiatique… au prix de la démocratie.",
      note: "La concentration des médias est un poison pour le débat public." }
  },
  {
    theme: "v", avatar: "eu", who: "Un ambassadeur à l'ONU",
    text: "« Une coalition propose une intervention militaire, mais sans mandat de l'ONU. »",
    right: { label: "Exiger l'ONU", fx: { v: 12, p: 6 },
      result: "Pas d'intervention sans mandat de l'ONU, seul cadre légitime.",
      note: "La France n'est pas le gendarme du monde : la sécurité collective passe par l'ONU.",
      measure: "Respect du mandat de l'ONU" },
    left: { label: "Suivre la coalition", fx: { v: -12, p: -6 },
      result: "La France part en guerre dans le sillage des grandes puissances.",
      note: "Le programme refuse les aventures militaires hors du droit international." }
  },
  {
    theme: "s", avatar: "youth", who: "Un étudiant précaire",
    text: "« J'ai 22 ans et pas un euro pour étudier. Comment je fais ? »",
    right: { label: "Allocation autonomie", fx: { s: 12, p: 8, v: -3 },
      result: "Création d'une allocation d'autonomie pour les 18-25 ans.",
      note: "Émanciper la jeunesse de la précarité pour qu'elle étudie et s'engage librement.",
      measure: "Allocation d'autonomie jeunesse" },
    left: { label: "Rien", fx: { s: -10, p: -8 },
      result: "La jeunesse continue de jongler entre petits boulots et études.",
      note: "Le programme garantit l'autonomie matérielle des jeunes." }
  },
  {
    theme: "p", avatar: "citizen", who: "Une militante anticorruption",
    text: "« Des élus sont mouillés dans des affaires. Vous couvrez ou vous agissez ? »",
    right: { label: "Sévir", fx: { p: 14, v: -2 },
      result: "Inéligibilité à vie pour corruption et RIC révocatoire instauré.",
      note: "La vertu au centre de l'action publique : balayer les privilèges de la caste.",
      measure: "Inéligibilité à vie pour corruption" },
    left: { label: "Étouffer", fx: { p: -16, v: -4 },
      result: "L'affaire est enterrée. La défiance envers les élus explose.",
      note: "Le programme veut une République exemplaire et contrôlée par le peuple." }
  },
  {
    theme: "v", avatar: "suit", who: "Un spéculateur",
    text: "« Les marchés attaquent l'euro ! Rassurez-les vite. »",
    right: { label: "Contrôler les capitaux", fx: { v: 10, s: 6, p: 4 },
      result: "Contrôle des capitaux aux frontières contre la spéculation et l'évasion fiscale.",
      note: "Protéger l'économie réelle des attaques spéculatives et de la fuite des plus riches.",
      measure: "Contrôle des capitaux" },
    left: { label: "Rassurer par l'austérité", fx: { s: -12, p: -8 },
      result: "Tu sacrifies le social pour calmer les marchés. Ils en redemanderont.",
      note: "Le programme met la finance au pas, pas le peuple." }
  },
  {
    theme: "s", avatar: "worker", who: "Une enseignante",
    text: "« Mes classes sont surchargées, on manque de tout. »",
    right: { label: "Investir dans l'école", fx: { s: 10, p: 8, v: -3 },
      result: "École publique, laïque et gratuite : recrutements et baisse des effectifs par classe.",
      note: "L'instruction émancipe : on réinvestit massivement dans l'école publique.",
      measure: "Plan pour l'école publique" },
    left: { label: "Supprimer des postes", fx: { s: -10, p: -8 },
      result: "Nouvelles suppressions de postes. Les conditions se dégradent.",
      note: "Le programme défend une école de l'égalité, pas du tri social." }
  },
  {
    theme: "e", avatar: "suit", who: "Le lobby de l'agrochimie",
    text: "« Ne touchez surtout pas aux pesticides, notre modèle en dépend. »",
    right: { label: "Interdire", fx: { e: 12, s: 6, v: -3 },
      result: "Plan de santé environnementale : interdiction des pesticides dangereux.",
      note: "Protéger la santé et le vivant, soutenir l'agriculture écologique et paysanne.",
      measure: "Interdiction des pesticides" },
    left: { label: "Laisser faire", fx: { e: -12, p: -4 },
      result: "Les pesticides continuent d'empoisonner sols, eaux et paysans.",
      note: "Le programme fait de la santé environnementale une priorité." }
  },
  {
    theme: "e", avatar: "scientist", who: "Un ingénieur du nucléaire",
    text: "« Construisons quatorze nouveaux réacteurs EPR ! »",
    right: { label: "Sortie programmée", fx: { e: 9, v: 4, s: -5 },
      result: "Sortie progressive du nucléaire au profit d'un grand plan renouvelables.",
      note: "Sortir du nucléaire de façon planifiée tout en développant toutes les renouvelables.",
      measure: "Sortie programmée du nucléaire" },
    left: { label: "Tout nucléaire", fx: { e: -8, p: -4 },
      result: "On mise tout sur le nucléaire : déchets et risques pour des décennies.",
      note: "Le programme préfère une trajectoire 100 % renouvelables maîtrisée." }
  },
  {
    theme: "s", avatar: "citizen", who: "Une caissière",
    text: "« Je bosse à plein temps et je n'arrive pas à souffler. »",
    right: { label: "Partager le temps", fx: { s: 12, p: 6, v: -4 },
      result: "6<sup>e</sup> semaine de congés payés et cap vers la semaine de quatre jours.",
      note: "Mieux répartir le travail et le temps libre, créer de l'emploi.",
      measure: "6ᵉ semaine de congés payés" },
    left: { label: "Travailler plus", fx: { s: -10, p: -8 },
      result: "« Travailler plus » sans gagner plus. L'épuisement s'installe.",
      note: "Le progrès, c'est aussi plus de temps pour vivre." }
  },
  {
    theme: "p", avatar: "eu", who: "Un commissaire au commerce",
    text: "« Ratifions ce nouveau traité de libre-échange, sans déranger les électeurs. »",
    right: { label: "Référendum", fx: { p: 10, v: 8, e: 3 },
      result: "Tout nouveau traité est soumis au référendum : le peuple tranche.",
      note: "Le peuple est souverain : aucun traité majeur sans son accord direct.",
      measure: "Référendum sur les traités" },
    left: { label: "Ratifier en douce", fx: { p: -12, v: -6, e: -4 },
      result: "Traité ratifié sans débat. Le sentiment de dépossession s'aggrave.",
      note: "Rendre obligatoire le référendum pour ratifier un nouveau traité européen." }
  },
  {
    theme: "v", avatar: "scientist", who: "Une astrophysicienne",
    text: "« La mer, l'espace, le numérique : ce sont nos frontières d'avenir. »",
    right: { label: "Réinvestir", fx: { v: 8, e: 6, s: 4 },
      result: "Réinvestissement dans la recherche publique, Arianespace et l'économie de la mer.",
      note: "La France aux frontières de l'Humanité : la mer, l'espace, le numérique.",
      measure: "Recherche publique & nouvelles frontières" },
    left: { label: "Privatiser", fx: { v: -8, s: -4 },
      result: "On brade la recherche et la filière spatiale au privé.",
      note: "Le programme défend une recherche publique ambitieuse et souveraine." }
  },
  {
    theme: "s", avatar: "citizen", who: "Une militante féministe",
    text: "« L'égalité salariale femmes-hommes, on l'applique enfin ? »",
    right: { label: "Imposer l'égalité", fx: { s: 10, p: 10 },
      result: "Égalité salariale réelle imposée et sanctionnée. Un pas vers l'égalité réelle.",
      note: "L'émancipation passe par l'égalité concrète, dans la loi et dans les faits.",
      measure: "Égalité salariale femmes-hommes" },
    left: { label: "Laisser le marché", fx: { s: -8, p: -8 },
      result: "On compte sur la « bonne volonté » des entreprises. Les écarts perdurent.",
      note: "L'égalité ne se quémande pas, elle s'impose." }
  },
  // ---- Cartes « crise » (événements) ----
  {
    theme: "e", avatar: "scientist", who: "⚠️ Canicule record", crisis: true,
    text: "Le pays suffoque sous une canicule historique. Que décides-tu en urgence ?",
    right: { label: "Plan climat", fx: { e: 12, s: 6, v: -4 },
      result: "Plan d'urgence : rénovation thermique massive des logements, eau et forêts protégées.",
      note: "Adapter le pays et réduire les émissions : la planification protège les plus fragiles.",
      measure: "Plan de rénovation thermique" },
    left: { label: "Tout climatiser", fx: { e: -14, p: -3 },
      result: "On climatise à tout-va. La facture énergétique et carbone explose.",
      note: "Fuite en avant : sans planification, chaque crise en aggrave une autre." }
  },
  {
    theme: "s", avatar: "suit", who: "⚠️ Krach financier", crisis: true,
    text: "Une banque géante s'effondre et menace toute l'économie. Ta réponse ?",
    right: { label: "Pôle public", fx: { s: 10, p: 8, v: 6 },
      result: "Création d'un pôle bancaire public : on socialise plutôt que de payer sans contrepartie.",
      note: "Mettre la finance au service de l'intérêt général, pas l'inverse.",
      measure: "Pôle bancaire public" },
    left: { label: "Renflouer sans condition", fx: { s: -14, p: -12 },
      result: "Des milliards publics sauvent les banquiers, sans aucune contrepartie.",
      note: "Le programme refuse de socialiser les pertes et privatiser les profits." }
  },
  {
    theme: "v", avatar: "eu", who: "⚠️ Pression sur l'euro", crisis: true,
    text: "Bruxelles menace de couper les liquidités si tu n'obéis pas. Tu fais quoi ?",
    right: { label: "Tenir bon", fx: { v: 12, p: 6, s: 4 },
      result: "Tu tiens la ligne et prépares une monnaie commune plutôt qu'unique.",
      note: "Refuser le chantage aux liquidités : la démocratie ne se négocie pas.",
      measure: "Plan B monétaire" },
    left: { label: "Plier", fx: { v: -12, s: -8, p: -6 },
      result: "Tu cèdes : l'austérité revient par la fenêtre.",
      note: "Le programme prévoit un Plan B face au chantage des institutions." }
  },
  {
    theme: "s", avatar: "citizen", who: "Une cheffe d'entreprise de l'ESS",
    text: "« Soutenez l'économie sociale et solidaire et donnez des droits aux salariés. »",
    right: { label: "Donner des droits", fx: { s: 10, p: 6, e: 4 },
      result: "Droit de veto suspensif des salariés sur les licenciements boursiers, soutien aux coopératives.",
      note: "La citoyenneté dans l'entreprise : les salariés décident de leur outil de travail.",
      measure: "Droits nouveaux des salariés" },
    left: { label: "Favoriser les multinationales", fx: { s: -8, v: -4 },
      result: "On déroule le tapis rouge aux multinationales, au détriment des coopératives.",
      note: "Le programme renforce le pouvoir des salariés et l'ESS." }
  }
];

// Petites phrases d'ambiance.
const SLOGANS = [
  "Place au peuple !", "L'avenir en commun.", "Le pouvoir au peuple.",
  "On ne lâche rien.", "Un autre monde est possible.", "Résistance et alternative."
];
