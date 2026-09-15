// Données initiales authentiques de Madame Marie-Thérèse Affoué
// "Les Perles et Moi" & "Voyages et Découvertes"

export const INITIAL_JEWELRY = [
  {
    id: "bijou-1",
    title: "Parure Océan Azur & Or Solaire",
    subtitle: "Collier et bracelet en cubes de cristal d'azur et perles d'or texturées",
    category: "parure",
    type: "Collier & Bracelet",
    status: "in_stock", // En stock
    stockCount: 1,
    priceCFA: 30000,
    priceEUR: 46,
    image: "assets/images/bijoux/parure-cristal-azur-or.jpeg",
    description: "Une composition lumineuse aux reflets marins associant des cubes géométriques de cristal bleu céleste taillé, des perles de quartz limpide à facettes et de délicates sphères baignées d'or texturées artisanalement. Fermoir crochet en vermeil.",
    stones: ["Cristal facetté bleu azur", "Perles de quartz limpides", "Perles ciselées dorées à l'or"],
    symbolism: "L'eau vive, la clarté d'esprit et l'abondance. Confectionnée avec passion à la main.",
    materials: "Cristaux taillés, apprêts dorés à l'or fin, fil haute résistance",
    dimensions: "Collier 46 cm • Bracelet ajustable 18-20 cm"
  },
  {
    id: "bijou-2",
    title: "Parure Reine Pokou en Corail & Médaillons Akan",
    subtitle: "Collier prestige et duo de bracelets en corail rouge sculpté et poids royaux",
    category: "parure",
    type: "Collier & 2 Bracelets",
    status: "in_stock",
    stockCount: 1,
    priceCFA: 40000,
    priceEUR: 61,
    image: "assets/images/bijoux/parure-corail-rouge-poids-akan.jpeg",
    description: "Pièce d'exception composée d'éclats polis de véritable corail rouge et de médaillons traditionnels Akan gravés de spirales solaires dorées. Symbole intemporel de dignité, de force et de noblesse ivoirienne.",
    stones: ["Éclats de corail rouge poli", "Médaillons Akan à spirales dorées à l'or"],
    symbolism: "Le prestige et l'héritage royal des peuples de la lagune et du centre ivoirien.",
    materials: "Corail naturel de haute sélection, poids baoulé dorés à l'or fin, fermoir s-hook doré",
    dimensions: "Collier 52 cm • 2 Bracelets 19 cm"
  },
  {
    id: "bijou-3",
    title: "Duo de Boucles d'Oreilles Baroques & Nuit d'Ébène",
    subtitle: "Orbes filigranés en or et cascade géométrique en onyx facetté",
    category: "boucles",
    type: "Boucles d'oreilles pendantes",
    status: "in_stock",
    stockCount: 2,
    priceCFA: 20000,
    priceEUR: 31,
    image: "assets/images/bijoux/boucles-filigrane-or-onyx.jpeg",
    description: "Deux paires de caractère : d'un côté, la dentelle aérienne de deux œufs d'or filigranés rehaussés de cristaux étincelants ; de l'autre, une chute graphique de trois sphères d'onyx noir facetté captant chaque rayon de lumière. Attaches dormeuses sécurisées.",
    stones: ["Onyx noir facetté", "Perles filigranes dorées", "Gouttes de cristal"],
    symbolism: "L'harmonie entre mystère et éclat, le jour et la nuit en équilibre parfait.",
    materials: "Pierres d'onyx véritable, laiton doré à l'or fin, apprêts anti-allergiques",
    dimensions: "Longueur paire or : 5 cm • Longueur paire onyx : 6.5 cm"
  },
  {
    id: "bijou-4",
    title: "Parure Unakite Royale & Orfèvrerie Baoulé",
    subtitle: "Collier et bracelet en éclats d'unakite vert mousse et rose terre avec barrettes royales",
    category: "parure",
    type: "Collier & Bracelet",
    status: "in_stock",
    stockCount: 1,
    priceCFA: 35000,
    priceEUR: 53,
    image: "assets/images/bijoux/parure-unakite-royale.jpeg",
    description: "L'harmonie rare de la pierre d'unakite aux nuances végétales vert pistache et rose saumon, sublimée par d'authentiques barrettes d'orfèvrerie africaine dorées reproduisant les lingots et motifs de pesage traditionnels Akan.",
    stones: ["Pierres naturelles d'unakite", "Barrettes ornementales dorées Akan"],
    symbolism: "L'ancrage dans la terre fertile, la sérénité du cœur et la bienveillance.",
    materials: "Unakite naturelle du continent, dorure fine, fermoir sécurisé artisanal",
    dimensions: "Collier 48 cm • Bracelet 19 cm"
  },
  {
    id: "bijou-5",
    title: "Parure Solaire en Jaspe Dalmatien",
    subtitle: "Collier ras-du-cou et boucles d'oreilles assorties en jaspe moucheté et soleils rayonnants",
    category: "parure",
    type: "Collier & Boucles",
    status: "in_stock",
    stockCount: 1,
    priceCFA: 32000,
    priceEUR: 49,
    image: "assets/images/bijoux/parure-jaspe-dalmatien.jpeg",
    description: "Un graphisme saisissant et contemporain : fragments de jaspe dalmatien naturel blanc et noir contrastés par des médaillons solaires en or ouvragé. Une allure moderne qui sublime les tenues citadines comme traditionnelles.",
    stones: ["Jaspe dalmatien véritable", "Sceaux solaires dorés à l'or fin"],
    symbolism: "La joie spontanée, l'énergie positive et la protection au quotidien.",
    materials: "Jaspe dalmatien taillé, alliage doré à l'or fin, crochets hypoallergéniques",
    dimensions: "Collier 45 cm • Boucles 4 cm"
  },
  {
    id: "bijou-6",
    title: "Parure Cannelée Marbre & Caramel",
    subtitle: "Collier généreux et bracelet en perles d'agate flûtées et perles d'or texturées",
    category: "parure",
    type: "Collier & Bracelet",
    status: "on_order", // Sur commande / Archive
    stockCount: 0,
    priceCFA: 38000,
    priceEUR: 58,
    image: "assets/images/bijoux/parure-agate-caramel-or.jpeg",
    description: "Spectaculaire parure aux perles ovales cannelées dévoilant des volutes d'ivoire, de miel et de moka. Chaque perle est séparée par une bille d'or scintillante. Pièce unique créée et vendue lors d'une précédente exposition, re-confectionnée sur mesure d'après commande.",
    stones: ["Perles d'agate flûtées marbrées", "Billes d'or texturées scintillantes"],
    symbolism: "La douceur réconfortante, la douceur des terres chaudes et la générosité.",
    materials: "Agates sculptées, perles de finition dorées à l'or fin",
    dimensions: "Collier 50 cm • Bracelet élastique haute tenue 19 cm"
  },
  {
    id: "bijou-7",
    title: "Pendants d'Agates Rubanées Lagune & Ambre",
    subtitle: "Deux paires de créoles dorées ornées de galets d'agate naturelle polie",
    category: "boucles",
    type: "Boucles d'oreilles",
    status: "on_order",
    stockCount: 0,
    priceCFA: 18000,
    priceEUR: 27,
    image: "assets/images/bijoux/boucles-agates-rubanees.jpeg",
    description: "Élégantes tranches de gemmes d'agate polies en forme de goutte : l'une aux strates marines rappelant les vagues du Golfe de Guinée, l'autre aux reflets flamboyants d'un coucher de soleil sur la lagune d'Assinie. Montées sur anneaux articulés en or.",
    stones: ["Agate rubanée bleue d'eau", "Agate rubanée cornaline ambrée"],
    symbolism: "L'apaisement des émotions et l'éclat du regard.",
    materials: "Agates fines polies main, créoles plaquées or hypoallergéniques",
    dimensions: "Longueur totale : 4.2 cm"
  }
];

export const INITIAL_TRIPS = [
  {
    id: "trip-1",
    title: "Escapade Sérénité sur la Lagune d'Assinie",
    subtitle: "Journée détente exclusive en pirogue royale, ponton privé & déjeuner aux saveurs ivoiriennes",
    destination: "Assinie-Mafia, Côte d'Ivoire",
    image: "assets/images/trips/assinie-lagune.jpg",
    date: "Samedi 10 Octobre 2026",
    duration: "1 Journée (07h30 - 18h30)",
    priceCFA: 35000,
    priceEUR: 53,
    maxCapacity: 15,
    bookedSeats: 11,
    minAge: 10,
    highlights: [
      "Traversée paisible en bateau traditionnel sur la lagune Aby",
      "Déjeuner gastronomique au bord de l'eau (Kédjenou de poulet, poisson braisé, alloco)",
      "Baignade sécurisée, repos sous les cocotiers et échanges conviviaux",
      "Atelier découverte des perles traditionnelles avec Madame Affoué"
    ],
    schedule: [
      { time: "07h30", activity: "Rassemblement et départ depuis Abidjan (Cocody / Plateau)" },
      { time: "09h15", activity: "Arrivée à Assinie, accueil chaleureux avec jus locaux et fruits frais" },
      { time: "10h00", activity: "Balade guidée en bateau vers les îlots préservés" },
      { time: "12h30", activity: "Grand repas partagé au ponton ombragé" },
      { time: "14h30", activity: "Temps libre, baignade, lecture et causerie bien-être" },
      { time: "17h00", activity: "Départ retour pour Abidjan" }
    ],
    included: [
      "Transport climatisé aller-retour depuis Abidjan",
      "Traversée en bateau et gilets de sauvetage certifiés",
      "Repas complet, boissons locales et collations",
      "Animation conviviale et encadrement attentif"
    ]
  },
  {
    id: "trip-2",
    title: "Immersion Historique & Brise Marine à Grand-Bassam",
    subtitle: "Déambulation dans le quartier France (UNESCO), plage dorée et rencontre avec les artisans",
    destination: "Grand-Bassam, Ville Historique",
    image: "assets/images/trips/grand-bassam.jpg",
    date: "Dimanche 8 Novembre 2026",
    duration: "1 Journée (08h00 - 18h00)",
    priceCFA: 25000,
    priceEUR: 38,
    maxCapacity: 15,
    bookedSeats: 8,
    minAge: 10,
    highlights: [
      "Visite guidée exclusive des bâtisses coloniales et de l'histoire du costume",
      "Arrêt au marché artisanal de poterie et orfèvrerie Akan",
      "Déjeuner en bord de mer les pieds dans le sable blanc",
      "Partage d'histoires et contes du terroir avec Madame Affoué"
    ],
    schedule: [
      { time: "08h00", activity: "Départ d'Abidjan en navette tout confort" },
      { time: "08h45", activity: "Arrivée à Bassam, promenade guidée dans les ruelles fleuries de bougainvilliers" },
      { time: "11h00", activity: "Rencontre avec les maîtres artisans bijoutiers et tisserands" },
      { time: "13h00", activity: "Déjeuner face aux vagues de l'Océan Atlantique" },
      { time: "15h30", activity: "Détente sur la plage privée, jeux conviviaux" },
      { time: "17h15", activity: "Retour doux vers Abidjan" }
    ],
    included: [
      "Transport sécurisé aller-retour",
      "Visites guidées et droits d'accès",
      "Déjeuner complet en bord de mer",
      "Accompagnement et animation personnalisée"
    ]
  },
  {
    id: "trip-3",
    title: "Voyage Grandeur & Mystère à Yamoussoukro",
    subtitle: "Week-end découverte de la capitale politique : Basilique Notre-Dame, lac aux caïmans et artisanat Baoulé",
    destination: "Yamoussoukro, Côte d'Ivoire",
    image: "assets/images/trips/grand-bassam.jpg", // ou paysage baoulé
    date: "Du 5 au 6 Décembre 2026",
    duration: "2 Jours / 1 Nuit",
    priceCFA: 85000,
    priceEUR: 130,
    maxCapacity: 8, // Voyage long : 8 personnes max selon l'enregistrement
    bookedSeats: 5,
    minAge: 10,
    highlights: [
      "Groupe très intime de 8 personnes pour un confort absolu",
      "Visite de la majestueuse Basilique Notre-Dame de la Paix",
      "Nuitée dans un hôtel de charme avec piscine",
      "Découverte des villages de tisserands de pagne baoulé d'Oress-Krobou"
    ],
    schedule: [
      { time: "Jour 1 - 07h00", activity: "Départ matinal d'Abidjan via l'autoroute du Nord" },
      { time: "Jour 1 - 10h30", activity: "Arrivée à Yamoussoukro, installation à l'hôtel" },
      { time: "Jour 1 - 11h30", activity: "Visite guidée de la Basilique et des jardins" },
      { time: "Jour 1 - 13h30", activity: "Déjeuner baoulé authentique" },
      { time: "Jour 1 - 16h00", activity: "Passage au lac aux caïmans et coucher de soleil" },
      { time: "Jour 2 - 09h00", activity: "Circuit des tisserands traditionnels et sculpteurs" },
      { time: "Jour 2 - 15h00", activity: "Retour sur Abidjan dans la sérénité" }
    ],
    included: [
      "Transport tout confort VIP",
      "Hébergement 1 nuit en chambre individuelle/double",
      "Tous les repas et rafraîchissements",
      "Toutes les entrées sur sites"
    ]
  }
];

export const CLIENT_INFO = {
  name: "Madame Marie-Thérèse Affoué",
  alias: "Marithé Affoué",
  title: "Créatrice de Bijoux d'Exception & Fondatrice de Voyages et Découvertes",
  location: "Abidjan, Côte d'Ivoire",
  phone: "+225 07 00 00 00 00", // Modifiable dans le studio admin
  whatsapp: "+2250700000000",
  waveNumber: "07 00 00 00 00",
  deliveryPartners: ["Yango Delivery", "Livreur Privé Abidjan", "Expédition Régionale"],
  bio: "Passionnée depuis toujours par la richesse de notre patrimoine et la beauté des gemmes naturelles, je sélectionne personnellement chaque perle rare pour la marier à la noblesse des poids africains dorés à l'or. Chaque pièce que je façonne porte une histoire, une âme et une énergie bienveillante. Parallèlement, parce que le quotidien peut être pesant et qu'on ne sait pas toujours où s'évader le week-end, j'ai créé 'Voyages et Découvertes' : des échappées en petits groupes chaleureux pour se ressourcer, faire le plein de soleil et redécouvrir les trésors de notre beau pays."
};
