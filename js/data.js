/*
 * data.js — Contenu du jeu « Place au Peuple 2027 »
 * -------------------------------------------------
 * Toutes les questions sont tirées du programme « L'Avenir en commun »
 * (version actualisée — avril 2020) de la France insoumise et des
 * documents de campagne fournis. Jeu citoyen non officiel, à but
 * pédagogique, en soutien à la candidature de Jean-Luc Mélenchon en 2027.
 */

// Les 7 étapes de la campagne = les 7 chapitres de « L'Avenir en commun ».
const THEMES = [
  {
    id: 'republique',
    num: 1,
    title: '6ᵉ République',
    subtitle: 'Face à la crise démocratique',
    icon: 'republique',
    color: '#E4032E',
    intro:
      "La V<sup>e</sup> République est à bout de souffle. Le peuple n'est consulté qu'une fois tous les cinq ans. " +
      "L'Avenir en commun propose de convoquer une <strong>Assemblée constituante</strong> pour écrire, avec les citoyen·nes, une 6<sup>e</sup> République.",
    quote: "« Le pouvoir au peuple : qu'il décide, contrôle et révoque. »",
    questions: [
      {
        type: 'qcm',
        q: "Pour refonder les institutions de la République, le programme propose de réunir…",
        options: [
          "Une Assemblée constituante élue, sous contrôle des citoyen·nes",
          "Un comité d'experts nommés par le président",
          "Une simple réforme du règlement du Sénat",
          "Une commission parlementaire fermée"
        ],
        answer: 0,
        why: "Une Assemblée constituante rédige une nouvelle Constitution, ensuite soumise au référendum. Aucun ancien parlementaire de la V<sup>e</sup> n'y siège."
      },
      {
        type: 'qcm',
        q: "Quel outil permettrait aux citoyen·nes de proposer, abroger une loi ou révoquer un·e élu·e ?",
        options: [
          "Le 49.3",
          "Le RIC — référendum d'initiative citoyenne",
          "La motion de censure",
          "La question au gouvernement"
        ],
        answer: 1,
        why: "Le RIC est décliné en quatre formes : législatif, abrogatoire, constituant et révocatoire."
      },
      {
        type: 'qcm',
        q: "À quel âge le programme propose-t-il de fixer le droit de vote ?",
        options: ["18 ans", "21 ans", "16 ans", "15 ans"],
        answer: 2,
        why: "Droit de vote à 16 ans, reconnaissance du vote blanc comme suffrage exprimé et généralisation de la proportionnelle."
      },
      {
        type: 'vf',
        q: "Le programme prévoit de supprimer le Sénat.",
        answer: true,
        why: "Vrai : supprimer le Sénat et le Conseil économique, social et environnemental, et créer une chambre unique."
      },
      {
        type: 'qcm',
        q: "Pour rapprocher les élus du peuple, le programme crée…",
        options: [
          "Un mandat présidentiel à vie",
          "Le droit de révoquer un·e élu·e en cours de mandat",
          "Le cumul illimité des mandats",
          "Une rente à vie pour les ex-ministres"
        ],
        answer: 1,
        why: "Un droit de révocation citoyenne en cours de mandat, le non-cumul réel et l'inéligibilité à vie en cas de corruption."
      }
    ]
  },

  {
    id: 'richesses',
    num: 2,
    title: 'Partager les richesses',
    subtitle: "Face à l'urgence sociale",
    icon: 'richesses',
    color: '#F4503B',
    intro:
      "Pendant que les profits explosent, des millions de personnes vivent dans la précarité. " +
      "L'Avenir en commun veut <strong>partager les richesses</strong>, mettre la finance au pas et garantir une vie digne par le travail.",
    quote: "« Personne ne doit vivre dans la misère dans un pays aussi riche. »",
    questions: [
      {
        type: 'qcm',
        q: "À combien le programme propose-t-il de porter immédiatement le SMIC mensuel net ?",
        options: ["1 219 € (niveau de l'époque)", "1 400 € nets", "1 600 € nets", "2 000 € nets"],
        answer: 1,
        why: "Le SMIC est porté immédiatement à 1 400 € nets pour 35 h, pour vivre dignement de son travail."
      },
      {
        type: 'qcm',
        q: "À quel âge le programme rétablit-il le droit à la retraite à taux plein ?",
        options: ["64 ans", "62 ans", "60 ans", "65 ans"],
        answer: 2,
        why: "Retour du droit à la retraite à 60 ans à taux plein et revalorisation des petites pensions."
      },
      {
        type: 'vf',
        q: "Le programme propose d'instaurer un revenu maximum autorisé.",
        answer: true,
        why: "Vrai : un revenu maximum, avec une tranche d'impôt à 100 % au-delà d'un certain seuil, pour réduire les inégalités."
      },
      {
        type: 'qcm',
        q: "Pour mieux partager le temps de travail, le programme généralise…",
        options: [
          "La 6ᵉ semaine de congés payés",
          "La suppression des week-ends",
          "Le travail le dimanche obligatoire",
          "La retraite à 67 ans"
        ],
        answer: 0,
        why: "Une 6ᵉ semaine de congés payés pour tous, et l'objectif de la semaine de quatre jours."
      },
      {
        type: 'qcm',
        q: "Pour permettre aux jeunes de 18 à 25 ans de vivre et d'étudier, le programme crée…",
        options: [
          "Un prêt étudiant à rembourser",
          "Une allocation d'autonomie",
          "Un service militaire payant",
          "Un crédit d'impôt familial"
        ],
        answer: 1,
        why: "Une allocation d'autonomie pour les jeunes de 18 à 25 ans détaché·es du foyer fiscal de leurs parents."
      }
    ]
  },

  {
    id: 'ecologie',
    num: 3,
    title: 'Planification écologique',
    subtitle: 'Face à la crise climatique',
    icon: 'ecologie',
    color: '#2BB673',
    intro:
      "Le marché ne sauvera pas le climat. L'Avenir en commun propose la <strong>planification écologique</strong> : " +
      "anticiper, organiser et financer la bifurcation de toute la société pour respecter les limites de la nature.",
    quote: "« Ne prenons pas à la nature plus qu'elle ne peut reconstituer. »",
    questions: [
      {
        type: 'qcm',
        q: "En quoi consiste la « règle verte », inscrite dans la Constitution ?",
        options: [
          "Ne pas prélever sur la nature plus qu'elle ne peut reconstituer",
          "Planter un arbre par habitant chaque année",
          "Interdire totalement la voiture",
          "Taxer les ménages selon leur consommation d'eau"
        ],
        answer: 0,
        why: "La règle verte interdit de prélever ou produire davantage que ce que la nature peut supporter et reconstituer."
      },
      {
        type: 'qcm',
        q: "Quel est l'objectif énergétique du programme ?",
        options: [
          "50 % de nucléaire à l'horizon 2035",
          "100 % d'énergies renouvelables en 2050",
          "Relancer le charbon propre",
          "Le tout-pétrole national"
        ],
        answer: 1,
        why: "Un plan de transition vers 100 % d'énergies renouvelables en 2050 et la sortie programmée du nucléaire."
      },
      {
        type: 'vf',
        q: "Pour le programme, l'eau, l'air et l'énergie sont des marchandises comme les autres.",
        answer: false,
        why: "Faux : ce sont des biens communs. L'eau, l'air, l'alimentation, le vivant, la santé, l'énergie doivent être protégés du marché."
      },
      {
        type: 'qcm',
        q: "Face au nucléaire, le programme propose de…",
        options: [
          "Construire 20 nouveaux réacteurs",
          "En sortir progressivement",
          "Ne rien changer",
          "Privatiser EDF"
        ],
        answer: 1,
        why: "Une sortie progressive et planifiée du nucléaire, en développant massivement les énergies renouvelables."
      },
      {
        type: 'qcm',
        q: "La planification écologique, c'est avant tout…",
        options: [
          "Laisser le marché s'autoréguler",
          "Anticiper et organiser collectivement la transition",
          "Reporter l'action après 2050",
          "Compter sur les seules écogestes individuels"
        ],
        answer: 1,
        why: "Planifier, c'est fixer un cap, mobiliser l'État et les territoires et financer la bifurcation, secteur par secteur."
      }
    ]
  },

  {
    id: 'europe',
    num: 4,
    title: 'Sortir des traités',
    subtitle: 'Face à la crise européenne',
    icon: 'europe',
    color: '#3F7FE0',
    intro:
      "Les traités européens imposent l'austérité et la concurrence de tous contre tous. " +
      "L'Avenir en commun défend une stratégie en deux temps pour rendre la souveraineté au peuple : le <strong>Plan A</strong> et le <strong>Plan B</strong>.",
    quote: "« On ne se soumet pas : on désobéit aux traités qui asphyxient les peuples. »",
    questions: [
      {
        type: 'qcm',
        q: "Quelle est la stratégie européenne du programme ?",
        options: [
          "Accepter tous les traités tels quels",
          "Un Plan A (renégocier) et un Plan B (désobéir / sortir)",
          "Sortir de l'Europe sans condition dès le premier jour",
          "Confier la décision à la Commission européenne"
        ],
        answer: 1,
        why: "Plan A : renégocier les traités. Plan B : appliquer unilatéralement des mesures de désobéissance si la négociation échoue."
      },
      {
        type: 'vf',
        q: "Le programme défend le libre-échange sans limite.",
        answer: false,
        why: "Faux : il défend un protectionnisme solidaire, contre le dumping social, fiscal et écologique."
      },
      {
        type: 'qcm',
        q: "Le « protectionnisme solidaire » inclut notamment…",
        options: [
          "Une taxe carbone aux frontières de l'UE",
          "La fin de tout service public",
          "La privatisation du rail",
          "La baisse des salaires pour rester compétitif"
        ],
        answer: 0,
        why: "Taxe carbone aux frontières, surtaxe des produits ne respectant pas les normes de l'OIT, aides d'État aux secteurs stratégiques."
      },
      {
        type: 'qcm',
        q: "Concernant la Banque centrale européenne (BCE), le programme veut…",
        options: [
          "Renforcer son indépendance totale",
          "Mettre fin à son indépendance et financer directement les États",
          "La privatiser",
          "La supprimer purement et simplement"
        ],
        answer: 1,
        why: "Mettre fin à l'indépendance de la BCE, autoriser le rachat de dette publique aux États et abandonner le traité d'austérité."
      },
      {
        type: 'vf',
        q: "Tout nouveau traité européen devrait être soumis au référendum.",
        answer: true,
        why: "Vrai : le recours au référendum serait obligatoire pour réviser la Constitution ou ratifier tout nouveau traité."
      }
    ]
  },

  {
    id: 'paix',
    num: 5,
    title: 'Indépendance & paix',
    subtitle: 'Face à la guerre',
    icon: 'paix',
    color: '#7E5BD8',
    intro:
      "La France n'a pas à être le supplétif d'aucune puissance. L'Avenir en commun veut une France <strong>indépendante</strong>, " +
      "non alignée et au service de la <strong>paix</strong>, fidèle à la Charte des Nations unies.",
    quote: "« Indépendante, la France parle à tous et ne se range derrière personne. »",
    questions: [
      {
        type: 'qcm',
        q: "Vis-à-vis de l'OTAN, le programme propose de…",
        options: [
          "Y renforcer la présence française",
          "En sortir pour retrouver l'indépendance militaire",
          "En prendre le commandement",
          "Ne rien changer"
        ],
        answer: 1,
        why: "Sortir de l'OTAN, organisation héritée de la guerre froide, pour restaurer pleinement l'indépendance de la France."
      },
      {
        type: 'qcm',
        q: "Quel est, pour le programme, le seul organe légitime pour la sécurité collective ?",
        options: ["L'OTAN", "Le G7", "L'ONU", "L'Union européenne"],
        answer: 2,
        why: "L'ONU est le seul cadre légitime ; la France doit œuvrer à son retour en force et à sa démocratisation."
      },
      {
        type: 'vf',
        q: "La France devrait refuser toute intervention militaire sans mandat de l'ONU.",
        answer: true,
        why: "Vrai : aucune intervention militaire sans mandat de l'ONU ; la France n'a pas à être le gendarme du monde."
      },
      {
        type: 'qcm',
        q: "Pour la défense, le programme privilégie…",
        options: [
          "L'achat de matériel à l'étranger",
          "La privatisation des industries d'armement",
          "L'acquisition de matériel français et la reconquête publique de l'armement",
          "Le désarmement unilatéral immédiat"
        ],
        answer: 2,
        why: "Stopper les privatisations de l'armement et privilégier l'acquisition de matériel français par l'armée."
      },
      {
        type: 'qcm',
        q: "Quelle doctrine internationale défend le programme ?",
        options: [
          "L'alignement sur les États-Unis",
          "Le non-alignement et l'indépendance",
          "L'expansion coloniale",
          "Le repli total sur soi"
        ],
        answer: 1,
        why: "Le non-alignement : une France libre de ses choix, au service de la coopération et de la paix entre les peuples."
      }
    ]
  },

  {
    id: 'progres',
    num: 6,
    title: 'Progrès humain',
    subtitle: 'Face à la grande régression',
    icon: 'progres',
    color: '#F2A93B',
    intro:
      "Santé, école, services publics : le quotidien se dégrade. L'Avenir en commun choisit le <strong>progrès humain</strong> " +
      "comme boussole et l'égalité réelle, partout, y compris dans les Outre-mer.",
    quote: "« La santé et le savoir ne se marchandent pas : ils s'émancipent. »",
    questions: [
      {
        type: 'qcm',
        q: "Concernant la santé, le programme veut…",
        options: [
          "Rembourser à 100 % les soins de santé prescrits",
          "Augmenter les franchises médicales",
          "Privatiser les hôpitaux",
          "Réduire le nombre de soignants"
        ],
        answer: 0,
        why: "Remboursement à 100 % des soins prescrits, y compris dentaires, optiques et auditifs ; fin des dépassements d'honoraires."
      },
      {
        type: 'qcm',
        q: "Pour combler les déserts médicaux, le programme propose de…",
        options: [
          "Fermer les petits hôpitaux",
          "Créer des centres de santé et un corps de médecins fonctionnaires",
          "Laisser le marché s'en occuper",
          "Réserver les soins aux grandes villes"
        ],
        answer: 1,
        why: "Centres de santé pratiquant le tiers payant et médecins généralistes rémunérés pendant leurs études contre installation."
      },
      {
        type: 'vf',
        q: "Le programme défend l'égalité réelle pour les Outre-mer.",
        answer: true,
        why: "Vrai : les Outre-mer, « chance de la France », doivent devenir des pointes avancées de la planification écologique et du progrès humain."
      },
      {
        type: 'qcm',
        q: "En matière d'école et de culture, le programme défend…",
        options: [
          "La privatisation de l'école",
          "Une école publique, laïque et gratuite, et 1 % du PIB pour la culture",
          "La publicité commerciale dans les écoles",
          "La suppression de l'éducation artistique"
        ],
        answer: 1,
        why: "École publique, laïque et gratuite ; budget de la culture porté à 1 % du PIB et accès de toutes et tous aux pratiques culturelles."
      },
      {
        type: 'qcm',
        q: "Pour la santé environnementale, le programme prévoit notamment…",
        options: [
          "D'interdire les pesticides",
          "De développer la malbouffe industrielle",
          "De supprimer la médecine scolaire",
          "De réduire la prévention"
        ],
        answer: 0,
        why: "Un plan de santé environnementale : interdiction des pesticides, lutte contre les pollutions et la malbouffe."
      }
    ]
  },

  {
    id: 'frontieres',
    num: 7,
    title: "Frontières de l'Humanité",
    subtitle: 'Face au déclinisme',
    icon: 'frontieres',
    color: '#16B8C4',
    intro:
      "La France a un rôle à jouer aux avant-postes de la connaissance. L'Avenir en commun veut investir trois grandes " +
      "<strong>frontières de l'Humanité</strong> : la <strong>mer</strong>, l'<strong>espace</strong> et le <strong>numérique</strong>.",
    quote: "« La mer, l'espace, le numérique : engageons-nous dans ces nouvelles frontières. »",
    questions: [
      {
        type: 'vf',
        q: "Grâce à ses Outre-mer, la France dispose du 2ᵉ espace maritime mondial.",
        answer: true,
        why: "Vrai : un atout immense. Le programme veut connaître et gérer durablement cet espace maritime et former aux métiers de la mer."
      },
      {
        type: 'qcm',
        q: "Concernant la conquête spatiale, le programme propose de…",
        options: [
          "Privatiser Arianespace",
          "Revenir sur la privatisation d'Arianespace et renforcer le CNES",
          "Abandonner la fusée Ariane",
          "Confier l'espace aux seules entreprises américaines"
        ],
        answer: 1,
        why: "Revenir sur la privatisation d'Arianespace, renforcer le Centre national d'études spatiales et garder la maîtrise des lancements."
      },
      {
        type: 'qcm',
        q: "Pour le numérique, le programme veut garantir…",
        options: [
          "La fin de l'internet public",
          "La neutralité du net et les logiciels libres dans l'administration",
          "La vente des données personnelles",
          "La censure généralisée"
        ],
        answer: 1,
        why: "Garantir la neutralité du net, généraliser les logiciels libres dans les services publics et reconquérir la maîtrise des infrastructures."
      },
      {
        type: 'vf',
        q: "Le programme considère la révolution numérique comme une affaire d'intérêt général.",
        answer: true,
        why: "Vrai : la révolution numérique doit servir l'intérêt général, garantir l'égalité d'accès sur tout le territoire et l'inclusion."
      },
      {
        type: 'qcm',
        q: "Pour rester aux frontières de la connaissance, le programme mise sur…",
        options: [
          "La baisse du budget de la recherche",
          "Un réinvestissement dans la recherche publique",
          "La fuite des cerveaux",
          "La privatisation des universités"
        ],
        answer: 1,
        why: "Réinvestir massivement dans la recherche publique et l'enseignement supérieur, au service du progrès partagé."
      }
    ]
  }
];

// Bandeau de citations affiché entre les écrans (esprit de campagne).
const SLOGANS = [
  "Place au peuple !",
  "L'avenir en commun.",
  "Le pouvoir au peuple.",
  "On ne lâche rien.",
  "Un autre monde est possible.",
  "La France insoumise.",
  "Résistance et alternative."
];
