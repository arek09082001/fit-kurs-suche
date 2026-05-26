/** All FitX studios, sorted alphabetically by name. */
export interface Studio {
  id: number;
  name: string;
  colorHex: string;
}

// 12-colour palette – deterministic: colorHex = PALETTE[id % PALETTE.length]
const PALETTE = [
  "#3B82F6", // blue
  "#10B981", // emerald
  "#F59E0B", // amber
  "#8B5CF6", // violet
  "#F43F5E", // rose
  "#F97316", // orange
  "#06B6D4", // cyan
  "#EC4899", // pink
  "#84CC16", // lime
  "#14B8A6", // teal
  "#A855F7", // purple
  "#EF4444", // red
];

function color(id: number): string {
  return PALETTE[id % PALETTE.length];
}

/** The default Ruhrgebiet studio IDs pre-selected on first launch */
export const DEFAULT_STUDIO_IDS: number[] = [27, 111, 90, 88, 125, 32, 17, 78];

export const ALL_STUDIOS: Studio[] = [
  { id: 38,  name: "Aachen-Europaplatz",          colorHex: color(38)  },
  { id: 106, name: "Arnsberg",                     colorHex: color(106) },
  { id: 98,  name: "Augsburg-Lechhausen",          colorHex: color(98)  },
  { id: 37,  name: "Berlin-Alexanderplatz",        colorHex: color(37)  },
  { id: 100, name: "Berlin-Biesdorf",              colorHex: color(100) },
  { id: 82,  name: "Berlin-East Side Mall",        colorHex: color(82)  },
  { id: 61,  name: "Berlin-Hellersdorf",           colorHex: color(61)  },
  { id: 24,  name: "Berlin-Ku'damm",               colorHex: color(24)  },
  { id: 89,  name: "Berlin-Landsberger Allee",     colorHex: color(89)  },
  { id: 91,  name: "Berlin-Moabit",                colorHex: color(91)  },
  { id: 57,  name: "Berlin-Schöneberg",            colorHex: color(57)  },
  { id: 132, name: "Berlin-Spandau",               colorHex: color(132) },
  { id: 48,  name: "Berlin-Südkreuz",              colorHex: color(48)  },
  { id: 56,  name: "Berlin-Tempelhof",             colorHex: color(56)  },
  { id: 135, name: "Berlin-Tierpark",              colorHex: color(135) },
  { id: 29,  name: "Berlin-Waidmannslust",         colorHex: color(29)  },
  { id: 102, name: "Bielefeld-Mitte",              colorHex: color(102) },
  { id: 26,  name: "Bielefeld-Sieker",             colorHex: color(26)  },
  { id: 141, name: "Böblingen-Zentrum",            colorHex: color(141) },
  { id: 66,  name: "Bochum-Harpen",               colorHex: color(66)  },
  { id: 34,  name: "Bochum-Innenstadt",            colorHex: color(34)  },
  { id: 32,  name: "Bochum-Riemke",               colorHex: color(32)  },
  { id: 17,  name: "Bochum-Wattenscheid",          colorHex: color(17)  },
  { id: 94,  name: "Bonn-Duisdorf",               colorHex: color(94)  },
  { id: 78,  name: "Bottrop-Stadtmitte",           colorHex: color(78)  },
  { id: 51,  name: "Bremen-Mitte",                 colorHex: color(51)  },
  { id: 54,  name: "Bremen-Oslebshausen",          colorHex: color(54)  },
  { id: 74,  name: "Bremen-Walle",                 colorHex: color(74)  },
  { id: 75,  name: "Bremerhaven-Geestemünde",      colorHex: color(75)  },
  { id: 69,  name: "Chemnitz-Kaßberg",             colorHex: color(69)  },
  { id: 122, name: "Dorsten",                      colorHex: color(122) },
  { id: 40,  name: "Dortmund-Kley",               colorHex: color(40)  },
  { id: 13,  name: "Dortmund-Nordstadt",           colorHex: color(13)  },
  { id: 25,  name: "Dortmund-Phoenix See",         colorHex: color(25)  },
  { id: 101, name: "Dresden-Freiberger Straße",    colorHex: color(101) },
  { id: 129, name: "Duisburg-Hafen",              colorHex: color(129) },
  { id: 84,  name: "Duisburg-Hamborn",            colorHex: color(84)  },
  { id: 60,  name: "Duisburg-Rheinhausen",         colorHex: color(60)  },
  { id: 39,  name: "Düren-Birkesdorf",             colorHex: color(39)  },
  { id: 15,  name: "Düsseldorf-Derendorf",         colorHex: color(15)  },
  { id: 16,  name: "Düsseldorf-Flingern",          colorHex: color(16)  },
  { id: 47,  name: "Düsseldorf-Holthausen",        colorHex: color(47)  },
  { id: 33,  name: "Düsseldorf-Lörick",            colorHex: color(33)  },
  { id: 116, name: "Erfurt-Daberstedt",            colorHex: color(116) },
  { id: 19,  name: "Essen-Bergerhausen",           colorHex: color(19)  },
  { id: 70,  name: "Essen-Limbecker Platz",        colorHex: color(70)  },
  { id: 11,  name: "Essen-Nordviertel",            colorHex: color(11)  },
  { id: 76,  name: "Fürth-Hardhöhe",              colorHex: color(76)  },
  { id: 111, name: "Gelsenkirchen-Erle",           colorHex: color(111) },
  { id: 27,  name: "Gelsenkirchen-Heßler",         colorHex: color(27)  },
  { id: 105, name: "Gelsenkirchen-Mitte",          colorHex: color(105) },
  { id: 90,  name: "Gießen-Innenstadt",            colorHex: color(90)  },
  { id: 88,  name: "Gladbeck-Mitte",              colorHex: color(88)  },
  { id: 118, name: "Grevenbroich",                 colorHex: color(118) },
  { id: 71,  name: "Gütersloh-Innenstadt",         colorHex: color(71)  },
  { id: 62,  name: "Hagen-Mitte",                 colorHex: color(62)  },
  { id: 46,  name: "Hamburg-Airport",             colorHex: color(46)  },
  { id: 134, name: "Hamburg-Altona",              colorHex: color(134) },
  { id: 80,  name: "Hamburg-Bahrenfeld",           colorHex: color(80)  },
  { id: 45,  name: "Hamburg-Steilshoop",           colorHex: color(45)  },
  { id: 14,  name: "Hamm-Mitte",                  colorHex: color(14)  },
  { id: 22,  name: "Hannover-Vahrenheide",         colorHex: color(22)  },
  { id: 125, name: "Herten",                       colorHex: color(125) },
  { id: 123, name: "Hilden",                       colorHex: color(123) },
  { id: 42,  name: "Iserlohn-Seilersee",           colorHex: color(42)  },
  { id: 81,  name: "Jena-Burgau",                 colorHex: color(81)  },
  { id: 128, name: "Kaiserslautern-Innenstadt",    colorHex: color(128) },
  { id: 126, name: "Karlsruhe-Oststadt",           colorHex: color(126) },
  { id: 31,  name: "Kiel Gaarden-Süd",            colorHex: color(31)  },
  { id: 124, name: "Koblenz-Lützel",              colorHex: color(124) },
  { id: 112, name: "Krefeld-Inrath",              colorHex: color(112) },
  { id: 30,  name: "Krefeld-Oppum",               colorHex: color(30)  },
  { id: 41,  name: "Leipzig Mockau-Süd",           colorHex: color(41)  },
  { id: 103, name: "Leipzig-Neulindenau",          colorHex: color(103) },
  { id: 43,  name: "Lübeck-St. Lorenz Nord",       colorHex: color(43)  },
  { id: 44,  name: "Ludwigshafen-Nord",            colorHex: color(44)  },
  { id: 49,  name: "Magdeburg-Sudenburg",          colorHex: color(49)  },
  { id: 99,  name: "Mainz-Hechtsheim",             colorHex: color(99)  },
  { id: 136, name: "Mannheim-Almenhof",            colorHex: color(136) },
  { id: 97,  name: "Minden-Innenstadt",            colorHex: color(97)  },
  { id: 67,  name: "Mönchengladbach-Rheydt",       colorHex: color(67)  },
  { id: 21,  name: "Mönchengladbach-Waldhausen",   colorHex: color(21)  },
  { id: 77,  name: "Mülheim-Stadtmitte",           colorHex: color(77)  },
  { id: 35,  name: "München Schwabing-Freimann",   colorHex: color(35)  },
  { id: 53,  name: "München Sendling-Westpark",    colorHex: color(53)  },
  { id: 108, name: "München-Lenbachplatz",         colorHex: color(108) },
  { id: 65,  name: "München-Neuperlach",           colorHex: color(65)  },
  { id: 12,  name: "Münster-Berg Fidel",           colorHex: color(12)  },
  { id: 64,  name: "Münster-Kinderhaus",           colorHex: color(64)  },
  { id: 110, name: "Neuss-Innenstadt",             colorHex: color(110) },
  { id: 127, name: "Nürnberg-Maxfeld",             colorHex: color(127) },
  { id: 55,  name: "Nürnberg-Zabo",               colorHex: color(55)  },
  { id: 20,  name: "Oberhausen-Marienviertel",     colorHex: color(20)  },
  { id: 18,  name: "Osnabrück-Fledder",            colorHex: color(18)  },
  { id: 130, name: "Paderborn-Südring",            colorHex: color(130) },
  { id: 50,  name: "Ratingen-West",               colorHex: color(50)  },
  { id: 131, name: "Regensburg-Reinhausen",        colorHex: color(131) },
  { id: 104, name: "Remscheid-Süd",               colorHex: color(104) },
  { id: 58,  name: "Rostock-Südstadt",             colorHex: color(58)  },
  { id: 87,  name: "Saarbrücken-St. Johann",       colorHex: color(87)  },
  { id: 28,  name: "Siegen-Mitte",                colorHex: color(28)  },
  { id: 96,  name: "Troisdorf-Mitte",             colorHex: color(96)  },
  { id: 133, name: "Ulm",                          colorHex: color(133) },
  { id: 117, name: "Unna",                         colorHex: color(117) },
  { id: 121, name: "Viersen",                      colorHex: color(121) },
  { id: 107, name: "Wetzlar",                      colorHex: color(107) },
  { id: 86,  name: "Witten-Mitte",               colorHex: color(86)  },
  { id: 52,  name: "Worms-Innenstadt Süd",         colorHex: color(52)  },
  { id: 36,  name: "Wuppertal-Barmen",            colorHex: color(36)  },
  { id: 137, name: "Wuppertal-Elberfeld",          colorHex: color(137) },
  { id: 23,  name: "Wuppertal-Langerfeld",         colorHex: color(23)  },
  { id: 114, name: "Wuppertal-Vohwinkel",          colorHex: color(114) },
].sort((a, b) => a.name.localeCompare(b.name, "de"));

/** Lookup map by studio ID */
export const STUDIO_BY_ID: Record<number, Studio> = Object.fromEntries(
  ALL_STUDIOS.map((s) => [s.id, s])
);
