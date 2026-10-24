import { CAPITALS } from './capitals.mjs';
import { PAIR_INDEXES } from './questions.mjs';
// English versions keyed by the stable French question ID. Option order is identical.
// Server only: explanations are never sent before the answer is revealed.
const originalEnglish = {
  "1": {
    "text": "Which strait separates Europe from Africa between Spain and Morocco?",
    "options": [
      "Gibraltar",
      "Bering",
      "Bosphorus",
      "Malacca"
    ],
    "explanation": "The Strait of Gibraltar connects the Atlantic to the Mediterranean."
  },
  "2": {
    "text": "Which landlocked country is completely surrounded by South Africa?",
    "options": [
      "Lesotho",
      "Botswana",
      "Eswatini",
      "Namibia"
    ],
    "explanation": "Lesotho is an enclave within South Africa."
  },
  "3": {
    "text": "Which city is the capital of New Zealand?",
    "options": [
      "Wellington",
      "Auckland",
      "Christchurch",
      "Dunedin"
    ],
    "explanation": "Wellington is the capital; Auckland has a larger population."
  },
  "4": {
    "text": "In which country is the region of Cappadocia?",
    "options": [
      "Turkey",
      "Georgia",
      "Greece",
      "Armenia"
    ],
    "explanation": "Cappadocia is in central Anatolia, in Turkey."
  },
  "5": {
    "text": "Which river flows through Budapest?",
    "options": [
      "Danube",
      "Rhine",
      "Elbe",
      "Vistula"
    ],
    "explanation": "The Danube historically separates Buda and Pest."
  },
  "6": {
    "text": "Which is the deepest lake in the world?",
    "options": [
      "Lake Baikal",
      "Lake Tanganyika",
      "Lake Superior",
      "Lake Victoria"
    ],
    "explanation": "Lake Baikal in Siberia is more than 1,600 metres deep."
  },
  "7": {
    "text": "Which country owns the Galápagos Islands?",
    "options": [
      "Ecuador",
      "Peru",
      "Colombia",
      "Costa Rica"
    ],
    "explanation": "The Galápagos are an Ecuadorian archipelago in the Pacific."
  },
  "8": {
    "text": "Which capital stands on the River Tagus?",
    "options": [
      "Lisbon",
      "Madrid",
      "Seville",
      "Porto"
    ],
    "explanation": "Lisbon is near the mouth of the Tagus."
  },
  "9": {
    "text": "Which desert extends mainly across Mongolia and China?",
    "options": [
      "Gobi",
      "Kalahari",
      "Atacama",
      "Namib"
    ],
    "explanation": "The Gobi Desert is in East Asia."
  },
  "10": {
    "text": "Into which sea does the River Jordan flow?",
    "options": [
      "Dead Sea",
      "Caspian Sea",
      "Red Sea",
      "Aral Sea"
    ],
    "explanation": "The Jordan flows into the Dead Sea."
  },
  "11": {
    "text": "Which country has Ljubljana as its capital?",
    "options": [
      "Slovenia",
      "Slovakia",
      "Croatia",
      "Serbia"
    ],
    "explanation": "Ljubljana is Slovenia's capital; Bratislava is Slovakia's."
  },
  "12": {
    "text": "Which mountain range contains Aconcagua?",
    "options": [
      "Andes",
      "Rocky Mountains",
      "Himalayas",
      "Caucasus"
    ],
    "explanation": "Aconcagua is in Argentina, in the Andes."
  },
  "13": {
    "text": "Which strait separates Asia from North America?",
    "options": [
      "Bering",
      "Hormuz",
      "Magellan",
      "Dover"
    ],
    "explanation": "The Bering Strait separates Russia from Alaska."
  },
  "14": {
    "text": "On which island is Mount Etna?",
    "options": [
      "Sicily",
      "Sardinia",
      "Corsica",
      "Crete"
    ],
    "explanation": "Etna is a volcano on Sicily, Italy."
  },
  "15": {
    "text": "Which capital does the Vltava flow through?",
    "options": [
      "Prague",
      "Warsaw",
      "Vienna",
      "Zagreb"
    ],
    "explanation": "The Vltava flows through Prague before joining the Elbe."
  },
  "16": {
    "text": "Which country shares Patagonia with Argentina?",
    "options": [
      "Chile",
      "Peru",
      "Uruguay",
      "Bolivia"
    ],
    "explanation": "Patagonia extends across southern Chile and Argentina."
  },
  "17": {
    "text": "Which map projection preserves local angles but exaggerates areas near the poles?",
    "options": [
      "Mercator",
      "Peters",
      "Mollweide",
      "Sinusoidal"
    ],
    "explanation": "The Mercator projection is conformal: it preserves local angles."
  },
  "18": {
    "text": "Which parallel lies at zero degrees of latitude?",
    "options": [
      "Equator",
      "Tropic of Cancer",
      "Arctic Circle",
      "Tropic of Capricorn"
    ],
    "explanation": "The equator is the reference for latitude; Greenwich is the reference for longitude."
  },
  "19": {
    "text": "In which year did the Battle of Waterloo take place?",
    "options": [
      "1815",
      "1805",
      "1789",
      "1848"
    ],
    "explanation": "Napoleon's defeat at Waterloo was on 18 June 1815."
  },
  "20": {
    "text": "Which 1919 treaty imposed peace terms on Germany after World War I?",
    "options": [
      "Treaty of Versailles",
      "Treaty of Vienna",
      "Treaty of Tordesillas",
      "Treaty of Utrecht"
    ],
    "explanation": "The Treaty of Versailles was signed on 28 June 1919."
  },
  "21": {
    "text": "Which empire had Constantinople as its capital?",
    "options": [
      "Byzantine Empire",
      "Carolingian Empire",
      "Inca Empire",
      "Aztec Empire"
    ],
    "explanation": "Constantinople was the capital of the Eastern Roman, or Byzantine, Empire."
  },
  "22": {
    "text": "Which event is associated with the year 1453?",
    "options": [
      "Fall of Constantinople",
      "Battle of Marignano",
      "Luther's Reformation",
      "Coronation of Charlemagne"
    ],
    "explanation": "Constantinople fell to the Ottomans in 1453."
  },
  "23": {
    "text": "Which ruler was crowned emperor in Rome in the year 800?",
    "options": [
      "Charlemagne",
      "Clovis",
      "Charles Martel",
      "Hugh Capet"
    ],
    "explanation": "Pope Leo III crowned Charlemagne emperor."
  },
  "24": {
    "text": "Which English document of 1215 limited royal power?",
    "options": [
      "Magna Carta",
      "Bill of Rights",
      "Habeas Corpus Act",
      "Act of Union"
    ],
    "explanation": "Magna Carta was granted in 1215 under King John."
  },
  "25": {
    "text": "Who led the expedition completed by Elcano, the first voyage around the world?",
    "options": [
      "Ferdinand Magellan",
      "Vasco da Gama",
      "Jacques Cartier",
      "Amerigo Vespucci"
    ],
    "explanation": "Magellan died during the voyage; Elcano completed it in 1522."
  },
  "26": {
    "text": "In which year was the Edict of Nantes signed?",
    "options": [
      "1598",
      "1515",
      "1685",
      "1789"
    ],
    "explanation": "Henry IV signed the Edict of Nantes in 1598; it was revoked in 1685."
  },
  "27": {
    "text": "Which Chinese dynasty built much of the Great Wall visible today?",
    "options": [
      "Ming",
      "Tang",
      "Song",
      "Han"
    ],
    "explanation": "Many surviving sections date from the Ming dynasty."
  },
  "28": {
    "text": "Which civilisation used quipus to record information?",
    "options": [
      "Incas",
      "Etruscans",
      "Phoenicians",
      "Sumerians"
    ],
    "explanation": "Inca quipus consist of knotted cords."
  },
  "29": {
    "text": "Which country was the birthplace of the Industrial Revolution in the 18th century?",
    "options": [
      "Great Britain",
      "Italy",
      "Russia",
      "Spain"
    ],
    "explanation": "The Industrial Revolution began in Great Britain."
  },
  "30": {
    "text": "Which Soviet leader is associated with perestroika?",
    "options": [
      "Mikhail Gorbachev",
      "Joseph Stalin",
      "Vladimir Lenin",
      "Leonid Brezhnev"
    ],
    "explanation": "Gorbachev introduced perestroika, a policy of restructuring."
  },
  "31": {
    "text": "In which city did the first trials of major Nazi leaders begin in 1945?",
    "options": [
      "Nuremberg",
      "Munich",
      "Bonn",
      "Hamburg"
    ],
    "explanation": "The Nuremberg trials began in November 1945."
  },
  "32": {
    "text": "Which 1957 treaty created the European Economic Community?",
    "options": [
      "Treaty of Rome",
      "Treaty of Maastricht",
      "Treaty of Lisbon",
      "Treaty of Nice"
    ],
    "explanation": "The Treaty of Rome established the EEC."
  },
  "33": {
    "text": "Which ancient people founded Carthage?",
    "options": [
      "Phoenicians",
      "Persians",
      "Celts",
      "Hittites"
    ],
    "explanation": "Carthage was a Phoenician settlement in North Africa."
  },
  "34": {
    "text": "Which conflict mainly pitted Athens against Sparta in the 5th century BCE?",
    "options": [
      "Peloponnesian War",
      "First Punic War",
      "Hundred Years' War",
      "War of the Spanish Succession"
    ],
    "explanation": "The Peloponnesian War opposed the alliances led by Athens and Sparta."
  },
  "35": {
    "text": "Which scientist is associated with the discovery of penicillin in 1928?",
    "options": [
      "Alexander Fleming",
      "Robert Koch",
      "Louis Pasteur",
      "Edward Jenner"
    ],
    "explanation": "Fleming observed the antibacterial action of a mould in 1928."
  },
  "36": {
    "text": "Which script appears on the Rosetta Stone alongside Greek and hieroglyphs?",
    "options": [
      "Demotic",
      "Cuneiform",
      "Linear B",
      "Sanskrit"
    ],
    "explanation": "The stone contains hieroglyphic, demotic and Greek scripts."
  },
  "37": {
    "text": "Which particle has a negative electric charge?",
    "options": [
      "Electron",
      "Proton",
      "Neutron",
      "Photon"
    ],
    "explanation": "Electrons have negative charge; protons have positive charge."
  },
  "38": {
    "text": "Which chemical element has the symbol W?",
    "options": [
      "Tungsten",
      "Titanium",
      "Tellurium",
      "Tantalum"
    ],
    "explanation": "W comes from wolfram, another name for tungsten."
  },
  "39": {
    "text": "Which quantity is measured in pascals?",
    "options": [
      "Pressure",
      "Energy",
      "Power",
      "Electric charge"
    ],
    "explanation": "One pascal equals one newton per square metre."
  },
  "40": {
    "text": "Which quantity is measured in joules?",
    "options": [
      "Energy",
      "Power",
      "Frequency",
      "Electric current"
    ],
    "explanation": "The joule is the SI unit of energy and work."
  },
  "41": {
    "text": "What is the chemical formula of table salt?",
    "options": [
      "NaCl",
      "KOH",
      "CaCO₃",
      "NaHCO₃"
    ],
    "explanation": "Table salt is mainly sodium chloride, NaCl."
  },
  "42": {
    "text": "Which noble gas is the lightest?",
    "options": [
      "Helium",
      "Neon",
      "Argon",
      "Krypton"
    ],
    "explanation": "Helium has the lowest atomic number of the noble gases."
  },
  "43": {
    "text": "What does an element's atomic number represent?",
    "options": [
      "Its number of protons",
      "Its number of neutrons",
      "The sum of protons and neutrons",
      "Its mass in grams"
    ],
    "explanation": "The atomic number is the number of protons in the nucleus."
  },
  "44": {
    "text": "What is the direct transition from solid to gas called?",
    "options": [
      "Sublimation",
      "Melting",
      "Liquefaction",
      "Solidification"
    ],
    "explanation": "Sublimation occurs without passing through the liquid state."
  },
  "45": {
    "text": "Which phenomenon explains a light ray bending when it enters water?",
    "options": [
      "Refraction",
      "Nuclear scattering",
      "Convection",
      "Electrolysis"
    ],
    "explanation": "Refraction is a change in direction as light passes between media."
  },
  "46": {
    "text": "Which type of wave cannot travel through a vacuum?",
    "options": [
      "Sound wave",
      "Radio wave",
      "Visible light",
      "X-ray"
    ],
    "explanation": "Sound is a mechanical wave that needs a material medium."
  },
  "47": {
    "text": "Which isotope is used to date ancient organic material?",
    "options": [
      "Carbon-14",
      "Oxygen-16",
      "Helium-4",
      "Sodium-23"
    ],
    "explanation": "Carbon-14 dating uses its radioactive decay."
  },
  "48": {
    "text": "Which scientist formulated the uncertainty principle?",
    "options": [
      "Werner Heisenberg",
      "Isaac Newton",
      "Michael Faraday",
      "Blaise Pascal"
    ],
    "explanation": "Heisenberg's uncertainty principle concerns, among other things, position and momentum."
  },
  "49": {
    "text": "At 25 °C, an aqueous solution with pH 3 is…?",
    "options": [
      "Acidic",
      "Alkaline",
      "Neutral",
      "Necessarily salty"
    ],
    "explanation": "A pH below 7 indicates an acidic solution at 25 °C."
  },
  "50": {
    "text": "Which metal is liquid at 20 °C and atmospheric pressure?",
    "options": [
      "Mercury",
      "Gallium",
      "Aluminium",
      "Tin"
    ],
    "explanation": "Mercury is liquid at 20 °C; gallium melts at about 30 °C."
  },
  "51": {
    "text": "Which instrument measures a potential difference in a circuit?",
    "options": [
      "Voltmeter",
      "Ammeter",
      "Barometer",
      "Calorimeter"
    ],
    "explanation": "A voltmeter measures voltage, expressed in volts."
  },
  "52": {
    "text": "Which equation expresses Ohm's law for a resistor?",
    "options": [
      "U = R × I",
      "U = R / I",
      "R = U × I",
      "I = U × R"
    ],
    "explanation": "Voltage U equals resistance R multiplied by current I."
  },
  "53": {
    "text": "Which part accounts for most of an atom's mass?",
    "options": [
      "Its nucleus",
      "Its electron cloud",
      "Its photons",
      "Its empty volume"
    ],
    "explanation": "Protons and neutrons account for almost all of an atom's mass."
  },
  "54": {
    "text": "What is the SI unit of frequency?",
    "options": [
      "Hertz",
      "Tesla",
      "Lumen",
      "Coulomb"
    ],
    "explanation": "One hertz is one cycle per second."
  },
  "55": {
    "text": "What is the derivative of x³?",
    "options": [
      "3x²",
      "x²",
      "3x",
      "x⁴ / 4"
    ],
    "explanation": "The derivative of x to the power n is n times x to the power n − 1."
  },
  "56": {
    "text": "What is the sum of a triangle's angles in Euclidean geometry?",
    "options": [
      "180°",
      "90°",
      "270°",
      "360°"
    ],
    "explanation": "The three angles of a Euclidean triangle add up to 180 degrees."
  },
  "57": {
    "text": "A price rises by 20%, then falls by 20%. What is the overall change?",
    "options": [
      "A 4% decrease",
      "No change",
      "A 4% increase",
      "A 20% decrease"
    ],
    "explanation": "The combined multiplier is 1.2 × 0.8 = 0.96."
  },
  "58": {
    "text": "What is the probability of two heads in two independent tosses of a fair coin?",
    "options": [
      "1/4",
      "1/2",
      "1/3",
      "3/4"
    ],
    "explanation": "Each toss has probability 1/2; their product is 1/4."
  },
  "59": {
    "text": "What is 2 to the power 10?",
    "options": [
      "1,024",
      "512",
      "2,048",
      "100"
    ],
    "explanation": "Multiplying by 2 ten times gives 1,024."
  },
  "60": {
    "text": "Which number is prime?",
    "options": [
      "97",
      "91",
      "93",
      "99"
    ],
    "explanation": "91 = 7 × 13, 93 = 3 × 31 and 99 = 9 × 11; 97 is prime."
  },
  "61": {
    "text": "What is the median of 2, 4, 9, 11 and 30?",
    "options": [
      "9",
      "11.2",
      "4",
      "15"
    ],
    "explanation": "The median is the middle value in the sorted list: 9."
  },
  "62": {
    "text": "What is the sum of the integers from 1 to 100?",
    "options": [
      "5,050",
      "5,000",
      "10,000",
      "4,950"
    ],
    "explanation": "The sum is 100 × 101 / 2."
  },
  "63": {
    "text": "A right triangle has perpendicular sides of 6 and 8. What is its hypotenuse?",
    "options": [
      "10",
      "12",
      "14",
      "7"
    ],
    "explanation": "Pythagoras' theorem gives √(36 + 64) = 10."
  },
  "64": {
    "text": "What is the binary representation of decimal 13?",
    "options": [
      "1101",
      "1011",
      "1110",
      "1001"
    ],
    "explanation": "13 = 8 + 4 + 1, which is 1101 in binary."
  },
  "65": {
    "text": "How many diagonals does a convex pentagon have?",
    "options": [
      "5",
      "4",
      "6",
      "10"
    ],
    "explanation": "A polygon with n vertices has n(n − 3)/2 diagonals."
  },
  "66": {
    "text": "If all A are B and no B is C, which conclusion must be true?",
    "options": [
      "No A is C",
      "All C are A",
      "All B are A",
      "Some A are C"
    ],
    "explanation": "Since all A are included in B, they are also excluded from C."
  },
  "67": {
    "text": "What is the value of 5!?",
    "options": [
      "120",
      "25",
      "60",
      "720"
    ],
    "explanation": "5! = 5 × 4 × 3 × 2 × 1 = 120."
  },
  "68": {
    "text": "What is the probability of rolling at least one six with two independent fair dice?",
    "options": [
      "11/36",
      "1/3",
      "1/6",
      "5/36"
    ],
    "explanation": "Subtract the probability of no sixes: 1 − (5/6)²."
  },
  "69": {
    "text": "What is the greatest common divisor of 48 and 18?",
    "options": [
      "6",
      "3",
      "9",
      "12"
    ],
    "explanation": "48 and 18 are both divisible by 6, their greatest common divisor."
  },
  "70": {
    "text": "What is the least common multiple of 8 and 12?",
    "options": [
      "24",
      "96",
      "16",
      "48"
    ],
    "explanation": "24 is the smallest positive multiple of both 8 and 12."
  },
  "71": {
    "text": "How many edges does a cube have?",
    "options": [
      "12",
      "6",
      "8",
      "16"
    ],
    "explanation": "A cube has 6 faces, 8 vertices and 12 edges."
  },
  "72": {
    "text": "What is the negation of “all players have answered”?",
    "options": [
      "At least one player has not answered",
      "No player has answered",
      "All players are wrong",
      "Only one player has answered"
    ],
    "explanation": "Negating a universal statement asserts that a counterexample exists."
  },
  "73": {
    "text": "Who wrote One Hundred Years of Solitude?",
    "options": [
      "Gabriel García Márquez",
      "Jorge Luis Borges",
      "Mario Vargas Llosa",
      "Julio Cortázar"
    ],
    "explanation": "One Hundred Years of Solitude is a novel by Gabriel García Márquez."
  },
  "74": {
    "text": "Who wrote The Trial?",
    "options": [
      "Franz Kafka",
      "Thomas Mann",
      "Hermann Hesse",
      "Stefan Zweig"
    ],
    "explanation": "The Trial is a novel by Franz Kafka, published after his death."
  },
  "75": {
    "text": "Which character narrates Camus' The Stranger?",
    "options": [
      "Meursault",
      "Rieux",
      "Rastignac",
      "Julien Sorel"
    ],
    "explanation": "Meursault narrates The Stranger in the first person."
  },
  "76": {
    "text": "Who wrote The Red and the Black?",
    "options": [
      "Stendhal",
      "Balzac",
      "Flaubert",
      "Zola"
    ],
    "explanation": "Stendhal wrote The Red and the Black, whose protagonist is Julien Sorel."
  },
  "77": {
    "text": "Which author created Raskolnikov?",
    "options": [
      "Fyodor Dostoevsky",
      "Leo Tolstoy",
      "Anton Chekhov",
      "Nikolai Gogol"
    ],
    "explanation": "Raskolnikov is the protagonist of Crime and Punishment."
  },
  "78": {
    "text": "To whom are the Iliad and the Odyssey attributed?",
    "options": [
      "Homer",
      "Virgil",
      "Sophocles",
      "Euripides"
    ],
    "explanation": "These two Greek epics are traditionally attributed to Homer."
  },
  "79": {
    "text": "Which poet published Les Fleurs du mal (The Flowers of Evil)?",
    "options": [
      "Charles Baudelaire",
      "Arthur Rimbaud",
      "Paul Verlaine",
      "Stéphane Mallarmé"
    ],
    "explanation": "Baudelaire's Les Fleurs du mal was published in 1857."
  },
  "80": {
    "text": "Which figure of speech combines contradictory words, such as “dark brightness”?",
    "options": [
      "Oxymoron",
      "Anaphora",
      "Metonymy",
      "Litotes"
    ],
    "explanation": "An oxymoron combines terms with opposite meanings in one expression."
  },
  "81": {
    "text": "What is a word or phrase that reads the same forwards and backwards called?",
    "options": [
      "Palindrome",
      "Homonym",
      "Synonym",
      "Acronym"
    ],
    "explanation": "A palindrome, such as “radar”, reads the same in both directions."
  },
  "82": {
    "text": "Who wrote Pride and Prejudice?",
    "options": [
      "Jane Austen",
      "Charlotte Brontë",
      "Virginia Woolf",
      "Mary Shelley"
    ],
    "explanation": "Pride and Prejudice is a novel by Jane Austen."
  },
  "83": {
    "text": "Which author wrote The Metamorphosis?",
    "options": [
      "Franz Kafka",
      "Albert Camus",
      "Samuel Beckett",
      "Milan Kundera"
    ],
    "explanation": "Gregor Samsa is the central character in Kafka's The Metamorphosis."
  },
  "84": {
    "text": "Who wrote the novel Frankenstein?",
    "options": [
      "Mary Shelley",
      "Bram Stoker",
      "Edgar Allan Poe",
      "Robert Louis Stevenson"
    ],
    "explanation": "Mary Shelley published Frankenstein in 1818."
  },
  "85": {
    "text": "Which author created Don Quixote?",
    "options": [
      "Miguel de Cervantes",
      "Federico García Lorca",
      "Lope de Vega",
      "Calderón de la Barca"
    ],
    "explanation": "Cervantes tells the adventures of Don Quixote and Sancho Panza."
  },
  "86": {
    "text": "Which novel begins “For a long time I used to go to bed early”?",
    "options": [
      "Swann's Way",
      "Madame Bovary",
      "The Plague",
      "Bel-Ami"
    ],
    "explanation": "This opens Swann's Way, the first volume of Proust's In Search of Lost Time."
  },
  "87": {
    "text": "Which type of French verse has twelve syllables?",
    "options": [
      "Alexandrine",
      "Decasyllable",
      "Octosyllable",
      "Hexasyllable"
    ],
    "explanation": "A French alexandrine has twelve syllables."
  },
  "88": {
    "text": "In which language did Dante write the Divine Comedy?",
    "options": [
      "Italian",
      "Latin",
      "Greek",
      "Spanish"
    ],
    "explanation": "Dante wrote the Divine Comedy in vernacular Italian."
  },
  "89": {
    "text": "Which figure of speech repeats a word at the beginning of successive sentences?",
    "options": [
      "Anaphora",
      "Hyperbole",
      "Periphrasis",
      "Ellipsis"
    ],
    "explanation": "Anaphora repeats the same beginning for rhythm and emphasis."
  },
  "90": {
    "text": "Who wrote Waiting for Godot?",
    "options": [
      "Samuel Beckett",
      "Eugène Ionesco",
      "Jean-Paul Sartre",
      "Bertolt Brecht"
    ],
    "explanation": "Waiting for Godot is a play by Samuel Beckett."
  },
  "91": {
    "text": "Who painted Guernica?",
    "options": [
      "Pablo Picasso",
      "Joan Miró",
      "Salvador Dalí",
      "Diego Rivera"
    ],
    "explanation": "Picasso painted Guernica in 1937."
  },
  "92": {
    "text": "Who painted The Persistence of Memory, famous for its melting clocks?",
    "options": [
      "Salvador Dalí",
      "René Magritte",
      "Max Ernst",
      "Paul Klee"
    ],
    "explanation": "The melting clocks are associated with Dalí's painting."
  },
  "93": {
    "text": "Which artist painted The Scream?",
    "options": [
      "Edvard Munch",
      "Gustav Klimt",
      "Egon Schiele",
      "Wassily Kandinsky"
    ],
    "explanation": "The Scream is a work by Edvard Munch."
  },
  "94": {
    "text": "Which composer wrote the opera The Magic Flute?",
    "options": [
      "Mozart",
      "Verdi",
      "Puccini",
      "Bizet"
    ],
    "explanation": "The Magic Flute is an opera by Wolfgang Amadeus Mozart."
  },
  "95": {
    "text": "Which composer wrote the ballet The Rite of Spring?",
    "options": [
      "Igor Stravinsky",
      "Claude Debussy",
      "Maurice Ravel",
      "Erik Satie"
    ],
    "explanation": "Stravinsky's The Rite of Spring premiered in 1913."
  },
  "96": {
    "text": "Which architect designed the Villa Savoye?",
    "options": [
      "Le Corbusier",
      "Frank Lloyd Wright",
      "Antoni Gaudí",
      "Gustave Eiffel"
    ],
    "explanation": "The Villa Savoye in Poissy was designed by Le Corbusier with Pierre Jeanneret."
  },
  "97": {
    "text": "Which artistic movement is associated with Monet and Renoir?",
    "options": [
      "Impressionism",
      "Cubism",
      "Surrealism",
      "Futurism"
    ],
    "explanation": "Monet and Renoir are leading figures of Impressionism."
  },
  "98": {
    "text": "Which instrument uses a double reed?",
    "options": [
      "Oboe",
      "Transverse flute",
      "Trumpet",
      "Saxophone"
    ],
    "explanation": "The oboe uses two pieces of cane forming a double reed."
  },
  "99": {
    "text": "How many semitones are in an octave in Western equal temperament?",
    "options": [
      "12",
      "7",
      "8",
      "10"
    ],
    "explanation": "The octave is divided into twelve equal semitones."
  },
  "100": {
    "text": "Which Dutch painter created Girl with a Pearl Earring?",
    "options": [
      "Johannes Vermeer",
      "Rembrandt",
      "Vincent van Gogh",
      "Piet Mondrian"
    ],
    "explanation": "Girl with a Pearl Earring is a painting by Vermeer."
  },
  "101": {
    "text": "Who composed Boléro?",
    "options": [
      "Maurice Ravel",
      "Claude Debussy",
      "Camille Saint-Saëns",
      "Gabriel Fauré"
    ],
    "explanation": "Boléro is an orchestral work by Maurice Ravel."
  },
  "102": {
    "text": "Who directed Modern Times?",
    "options": [
      "Charlie Chaplin",
      "Buster Keaton",
      "Fritz Lang",
      "Orson Welles"
    ],
    "explanation": "Charlie Chaplin directed and starred in Modern Times."
  },
  "103": {
    "text": "Who directed A Trip to the Moon in 1902?",
    "options": [
      "Georges Méliès",
      "Louis Lumière",
      "Abel Gance",
      "Jean Renoir"
    ],
    "explanation": "Georges Méliès pioneered special effects in cinema."
  },
  "104": {
    "text": "Which sculptor created The Thinker?",
    "options": [
      "Auguste Rodin",
      "Camille Claudel",
      "Constantin Brancusi",
      "Alberto Giacometti"
    ],
    "explanation": "The Thinker is a sculpture by Auguste Rodin."
  },
  "105": {
    "text": "Which artist is associated with paintings of Campbell's soup cans?",
    "options": [
      "Andy Warhol",
      "Jackson Pollock",
      "Edward Hopper",
      "Mark Rothko"
    ],
    "explanation": "Andy Warhol is a major figure of Pop Art."
  },
  "106": {
    "text": "Which movement uses adjacent dots of colour, notably in Seurat's work?",
    "options": [
      "Pointillism",
      "Fauvism",
      "Realism",
      "Romanticism"
    ],
    "explanation": "Pointillism builds an image from small dots of colour."
  },
  "107": {
    "text": "Which composer wrote Carmen?",
    "options": [
      "Georges Bizet",
      "Giuseppe Verdi",
      "Richard Wagner",
      "Giacomo Puccini"
    ],
    "explanation": "Carmen is an opera by Georges Bizet."
  },
  "108": {
    "text": "Which architect is associated with Barcelona's Sagrada Família?",
    "options": [
      "Antoni Gaudí",
      "Oscar Niemeyer",
      "Renzo Piano",
      "Walter Gropius"
    ],
    "explanation": "Antoni Gaudí profoundly shaped the design of the Sagrada Família."
  },
  "109": {
    "text": "What does CPU stand for in computing?",
    "options": [
      "Central Processing Unit",
      "Computer Power Utility",
      "Central Program Upload",
      "Control Peripheral Unit"
    ],
    "explanation": "CPU means a computer's central processor."
  },
  "110": {
    "text": "Which component generally keeps its data without electrical power?",
    "options": [
      "SSD",
      "RAM",
      "Processor register",
      "SRAM cache"
    ],
    "explanation": "An SSD uses non-volatile memory."
  },
  "111": {
    "text": "How many distinct values can one byte represent?",
    "options": [
      "256",
      "8",
      "128",
      "1,024"
    ],
    "explanation": "A byte contains 8 bits, giving 2⁸ possible values."
  },
  "112": {
    "text": "Which protocol resolves domain names to IP addresses, among other records?",
    "options": [
      "DNS",
      "FTP",
      "SMTP",
      "SSH"
    ],
    "explanation": "DNS associates domain names with records, including IP addresses."
  },
  "113": {
    "text": "Which language is mainly used to query relational databases?",
    "options": [
      "SQL",
      "HTML",
      "CSS",
      "SVG"
    ],
    "explanation": "SQL defines, queries and modifies relational data."
  },
  "114": {
    "text": "What does HTTP error 404 mean?",
    "options": [
      "Resource not found",
      "Authentication successful",
      "Permanent redirect",
      "Server ready"
    ],
    "explanation": "Status 404 means the requested resource was not found."
  },
  "115": {
    "text": "Which data structure follows “first in, first out”?",
    "options": [
      "Queue",
      "Stack",
      "Tree",
      "Set"
    ],
    "explanation": "A queue follows FIFO: First In, First Out."
  },
  "116": {
    "text": "Which data structure follows “last in, first out”?",
    "options": [
      "Stack",
      "Queue",
      "Relational table",
      "Complete graph"
    ],
    "explanation": "A stack follows LIFO: Last In, First Out."
  },
  "117": {
    "text": "What does binary search generally require of a list?",
    "options": [
      "It must be sorted",
      "It must have an even number of elements",
      "It must contain only text",
      "It must be empty"
    ],
    "explanation": "Binary search uses the order of elements to divide the search area."
  },
  "118": {
    "text": "What is the time complexity of binary search on n sorted elements?",
    "options": [
      "O(log n)",
      "O(n²)",
      "O(n!)",
      "O(2ⁿ)"
    ],
    "explanation": "Each step roughly halves the search area."
  },
  "119": {
    "text": "Which numeral system uses digits 0 to 9 and letters A to F?",
    "options": [
      "Hexadecimal",
      "Binary",
      "Octal",
      "Decimal"
    ],
    "explanation": "Hexadecimal is a base-16 numeral system."
  },
  "120": {
    "text": "What does a compiler primarily do?",
    "options": [
      "Translates source code into another language, often machine code",
      "Increases physical memory",
      "Cools the processor",
      "Assigns IP addresses"
    ],
    "explanation": "A compiler translates a program from a source language into a target language."
  },
  "121": {
    "text": "Which mechanism adds protection beyond a password alone?",
    "options": [
      "Multi-factor authentication",
      "ZIP compression",
      "Full-screen mode",
      "Alphabetical sorting"
    ],
    "explanation": "Multi-factor authentication combines different categories of identity evidence."
  },
  "122": {
    "text": "What is Git mainly used for?",
    "options": [
      "Tracking file versions",
      "Drawing vector images",
      "Running SQL",
      "Assigning domain names"
    ],
    "explanation": "Git is a distributed version control system."
  },
  "123": {
    "text": "Which logical operation is true only when both inputs are true?",
    "options": [
      "AND",
      "OR",
      "Exclusive OR",
      "NOT"
    ],
    "explanation": "Logical conjunction AND requires both statements to be true."
  },
  "124": {
    "text": "Which type of encryption uses a public key and a private key?",
    "options": [
      "Asymmetric encryption",
      "Symmetric encryption",
      "ASCII encoding",
      "Lossless compression"
    ],
    "explanation": "Asymmetric encryption uses a related pair of keys."
  },
  "125": {
    "text": "Which language primarily describes a page's visual presentation in a browser?",
    "options": [
      "CSS",
      "SQL",
      "C",
      "Bash"
    ],
    "explanation": "CSS defines colours, spacing and layout, among other things."
  },
  "126": {
    "text": "What is a recursive function?",
    "options": [
      "A function that calls itself",
      "A function with no result",
      "A browser-only function",
      "A function that always sorts numbers"
    ],
    "explanation": "Recursion solves a problem through calls to the same function."
  },
  "127": {
    "text": "Which organelle mainly carries out photosynthesis in plants?",
    "options": [
      "Chloroplast",
      "Mitochondrion",
      "Ribosome",
      "Lysosome"
    ],
    "explanation": "Chloroplasts contain the pigments needed for photosynthesis."
  },
  "128": {
    "text": "Which RNA base replaces thymine in DNA?",
    "options": [
      "Uracil",
      "Guanine",
      "Cytosine",
      "Adenine"
    ],
    "explanation": "RNA uses uracil where DNA uses thymine."
  },
  "129": {
    "text": "Which process produces human gametes?",
    "options": [
      "Meiosis",
      "Mitosis alone",
      "Photosynthesis",
      "Fermentation"
    ],
    "explanation": "Meiosis halves the number of chromosomes."
  },
  "130": {
    "text": "Which ABO blood group has neither A nor B antigens on its red blood cells?",
    "options": [
      "O",
      "A",
      "B",
      "AB"
    ],
    "explanation": "Group O red blood cells carry neither A nor B antigens."
  },
  "131": {
    "text": "What type of organism is yeast?",
    "options": [
      "Fungus",
      "Bacterium",
      "Flowering plant",
      "Virus"
    ],
    "explanation": "Yeasts are single-celled fungi."
  },
  "132": {
    "text": "Which relationship benefits both participating species?",
    "options": [
      "Mutualism",
      "Parasitism",
      "Predation",
      "Competition"
    ],
    "explanation": "In mutualism, both partners benefit from the relationship."
  },
  "133": {
    "text": "Which phenomenon describes the movement of lithospheric plates?",
    "options": [
      "Plate tectonics",
      "Capillary action",
      "Atmospheric convection alone",
      "Precession"
    ],
    "explanation": "Plate tectonics explains many earthquakes and landforms."
  },
  "134": {
    "text": "Which type of rock forms when magma cools?",
    "options": [
      "Igneous rock",
      "Sedimentary rock",
      "Only metamorphic rock",
      "Only clastic rock"
    ],
    "explanation": "Igneous rocks form when magma or lava solidifies."
  },
  "135": {
    "text": "Which planet has the moon Titan?",
    "options": [
      "Saturn",
      "Mars",
      "Uranus",
      "Neptune"
    ],
    "explanation": "Titan is Saturn's largest moon."
  },
  "136": {
    "text": "What is Jupiter's largest natural satellite?",
    "options": [
      "Ganymede",
      "Europa",
      "Io",
      "Callisto"
    ],
    "explanation": "Ganymede is also the largest natural satellite in the Solar System."
  },
  "137": {
    "text": "Which planet has the moons Phobos and Deimos?",
    "options": [
      "Mars",
      "Venus",
      "Mercury",
      "Neptune"
    ],
    "explanation": "Phobos and Deimos are Mars' two natural satellites."
  },
  "138": {
    "text": "What is a light-year?",
    "options": [
      "A distance",
      "A duration",
      "A speed",
      "A luminosity"
    ],
    "explanation": "It is the distance light travels through a vacuum in one year."
  },
  "139": {
    "text": "Which process produces the Sun's energy?",
    "options": [
      "Nuclear fusion",
      "Uranium fission",
      "Burning coal",
      "Friction in its atmosphere"
    ],
    "explanation": "Fusion mainly converts hydrogen into helium in the Sun's core."
  },
  "140": {
    "text": "Which atmospheric layer contains most of the ozone layer?",
    "options": [
      "Stratosphere",
      "Troposphere",
      "Thermosphere",
      "Exosphere"
    ],
    "explanation": "The ozone layer lies mainly in the stratosphere."
  },
  "141": {
    "text": "Which boundary separates Earth's crust from its mantle?",
    "options": [
      "Mohorovičić discontinuity",
      "Kármán line",
      "Tropopause",
      "Magnetic equator"
    ],
    "explanation": "The Moho marks the boundary between crust and mantle."
  },
  "142": {
    "text": "What happens during a lunar eclipse?",
    "options": [
      "The Moon passes through Earth's shadow",
      "The Moon passes in front of the Sun",
      "The Sun passes through Mars' shadow",
      "Earth stops rotating"
    ],
    "explanation": "During a lunar eclipse, Earth is between the Sun and the Moon."
  },
  "143": {
    "text": "Which animal is a monotreme, a mammal that lays eggs?",
    "options": [
      "Platypus",
      "Koala",
      "Wombat",
      "Kangaroo"
    ],
    "explanation": "Platypuses and echidnas are egg-laying mammals."
  },
  "144": {
    "text": "Which pigment mainly gives leaves their green colour?",
    "options": [
      "Chlorophyll",
      "Melanin",
      "Haemoglobin",
      "Keratin"
    ],
    "explanation": "Chlorophyll mainly absorbs blue and red light, making leaves appear green."
  },
  "145": {
    "text": "In which country is the ancient city of Petra located?",
    "options": [
      "Jordan",
      "Lebanon",
      "Syria",
      "Oman"
    ],
    "explanation": "This place is located in Jordan."
  },
  "146": {
    "text": "In which country is Angkor located?",
    "options": [
      "Cambodia",
      "Thailand",
      "Laos",
      "Vietnam"
    ],
    "explanation": "This place is located in Cambodia."
  },
  "147": {
    "text": "In which country is Machu Picchu located?",
    "options": [
      "Peru",
      "Bolivia",
      "Ecuador",
      "Colombia"
    ],
    "explanation": "This place is located in Peru."
  },
  "148": {
    "text": "In which country is the Namib Desert located?",
    "options": [
      "Namibia",
      "Mali",
      "Chad",
      "Egypt"
    ],
    "explanation": "This place is located in Namibia."
  },
  "149": {
    "text": "In which country is Mount Fuji located?",
    "options": [
      "Japan",
      "China",
      "South Korea",
      "Nepal"
    ],
    "explanation": "This place is located in Japan."
  },
  "150": {
    "text": "In which country is the city of Samarkand located?",
    "options": [
      "Uzbekistan",
      "Kazakhstan",
      "Iran",
      "Pakistan"
    ],
    "explanation": "This place is located in Uzbekistan."
  },
  "151": {
    "text": "In which country is Chichen Itza located?",
    "options": [
      "Mexico",
      "Guatemala",
      "Honduras",
      "Panama"
    ],
    "explanation": "This place is located in Mexico."
  },
  "152": {
    "text": "In which country is the city of Dubrovnik located?",
    "options": [
      "Croatia",
      "Montenegro",
      "Albania",
      "Slovenia"
    ],
    "explanation": "This place is located in Croatia."
  },
  "153": {
    "text": "In which country is the Alhambra palace located?",
    "options": [
      "Spain",
      "Portugal",
      "Morocco",
      "Italy"
    ],
    "explanation": "This place is located in Spain."
  },
  "154": {
    "text": "In which country is Transylvania located?",
    "options": [
      "Romania",
      "Bulgaria",
      "Hungary",
      "Serbia"
    ],
    "explanation": "This place is located in Romania."
  },
  "155": {
    "text": "In which country is the city of Timbuktu located?",
    "options": [
      "Mali",
      "Niger",
      "Senegal",
      "Mauritania"
    ],
    "explanation": "This place is located in Mali."
  },
  "156": {
    "text": "In which country is Mount Kilimanjaro located?",
    "options": [
      "Tanzania",
      "Kenya",
      "Uganda",
      "Ethiopia"
    ],
    "explanation": "This place is located in Tanzania."
  },
  "157": {
    "text": "In which country is Yellowstone National Park located?",
    "options": [
      "United States",
      "Canada",
      "Iceland",
      "New Zealand"
    ],
    "explanation": "This place is located in United States."
  },
  "158": {
    "text": "In which country is Lake Bled located?",
    "options": [
      "Slovenia",
      "Slovakia",
      "Austria",
      "Switzerland"
    ],
    "explanation": "This place is located in Slovenia."
  },
  "159": {
    "text": "In which country is the city of Bergen located?",
    "options": [
      "Norway",
      "Sweden",
      "Finland",
      "Denmark"
    ],
    "explanation": "This place is located in Norway."
  },
  "160": {
    "text": "Which river flows through Cairo?",
    "options": [
      "The Nile",
      "The Niger",
      "The Congo",
      "The Zambezi"
    ],
    "explanation": "Cairo lies on the banks of the Nile."
  },
  "161": {
    "text": "Which capital stands on the River Spree?",
    "options": [
      "Berlin",
      "Amsterdam",
      "Copenhagen",
      "Stockholm"
    ],
    "explanation": "The Spree flows through Berlin."
  },
  "162": {
    "text": "Which river flows through Baghdad?",
    "options": [
      "The Tigris",
      "The Euphrates",
      "The Jordan",
      "The Indus"
    ],
    "explanation": "Baghdad stands on the Tigris in Mesopotamia."
  },
  "163": {
    "text": "Which river flows through Rome?",
    "options": [
      "The Tiber",
      "The Po",
      "The Arno",
      "The Adige"
    ],
    "explanation": "The Tiber flows through Rome before reaching the Tyrrhenian Sea."
  },
  "164": {
    "text": "Which river flows through Cologne?",
    "options": [
      "The Rhine",
      "The Danube",
      "The Oder",
      "The Seine"
    ],
    "explanation": "Cologne is a German city on the Rhine."
  },
  "165": {
    "text": "Which ocean borders Mozambique’s eastern coast?",
    "options": [
      "The Indian Ocean",
      "The Atlantic Ocean",
      "The Pacific Ocean",
      "The Arctic Ocean"
    ],
    "explanation": "Mozambique faces Madagascar in the Indian Ocean."
  },
  "166": {
    "text": "Which island is shared by Haiti and the Dominican Republic?",
    "options": [
      "Hispaniola",
      "Jamaica",
      "Cuba",
      "Puerto Rico"
    ],
    "explanation": "Both countries occupy Hispaniola in the Caribbean."
  },
  "167": {
    "text": "Which island is shared by Indonesia, Malaysia and Brunei?",
    "options": [
      "Borneo",
      "Sumatra",
      "Java",
      "Sulawesi"
    ],
    "explanation": "Borneo is divided between these three states."
  },
  "168": {
    "text": "Which mountain range forms a natural border between France and Spain?",
    "options": [
      "The Pyrenees",
      "The Alps",
      "The Carpathians",
      "The Apennines"
    ],
    "explanation": "The Pyrenees stretch between the Atlantic and the Mediterranean."
  },
  "169": {
    "text": "In which mountain range is Mont Blanc?",
    "options": [
      "The Alps",
      "The Jura",
      "The Vosges",
      "Only the Dolomites"
    ],
    "explanation": "The Mont Blanc massif is part of the Alps."
  },
  "170": {
    "text": "Which sea mainly separates Italy from the Croatian coast?",
    "options": [
      "The Adriatic",
      "The Baltic",
      "The Aegean",
      "The Black Sea"
    ],
    "explanation": "The Adriatic lies between the Italian and Balkan peninsulas."
  },
  "171": {
    "text": "Which strait connects the Black Sea to the Sea of Marmara?",
    "options": [
      "The Bosporus",
      "The Dardanelles",
      "Hormuz",
      "Malacca"
    ],
    "explanation": "The Bosporus runs through Istanbul and connects these two seas."
  },
  "172": {
    "text": "Which canal links the Mediterranean to the Red Sea?",
    "options": [
      "Suez",
      "Panama",
      "Kiel",
      "Corinth"
    ],
    "explanation": "The Suez Canal crosses the Isthmus of Suez in Egypt."
  },
  "173": {
    "text": "Which country contains the Cape of Good Hope?",
    "options": [
      "South Africa",
      "Namibia",
      "Angola",
      "Mozambique"
    ],
    "explanation": "This cape is located near Cape Town in South Africa."
  },
  "174": {
    "text": "Which country has Tallinn as its capital?",
    "options": [
      "Estonia",
      "Latvia",
      "Lithuania",
      "Finland"
    ],
    "explanation": "Tallinn is Estonia’s capital on the Baltic Sea."
  },
  "175": {
    "text": "Which city is the capital of Canada?",
    "options": [
      "Ottawa",
      "Toronto",
      "Montreal",
      "Vancouver"
    ],
    "explanation": "Ottawa is Canada’s federal capital."
  },
  "176": {
    "text": "Which country has Montevideo as its capital?",
    "options": [
      "Uruguay",
      "Paraguay",
      "Bolivia",
      "Venezuela"
    ],
    "explanation": "Montevideo is Uruguay’s capital."
  },
  "177": {
    "text": "Which country has Kathmandu as its capital?",
    "options": [
      "Nepal",
      "Bhutan",
      "Bangladesh",
      "Sri Lanka"
    ],
    "explanation": "Kathmandu is Nepal’s capital in the Himalayas."
  },
  "178": {
    "text": "Which continent has no sovereign countries?",
    "options": [
      "Antarctica",
      "Oceania",
      "South America",
      "Europe"
    ],
    "explanation": "Antarctica contains no sovereign state."
  },
  "179": {
    "text": "Which sea borders Sweden, Poland and Finland?",
    "options": [
      "The Baltic Sea",
      "The North Sea",
      "The Black Sea",
      "The Caspian Sea"
    ],
    "explanation": "All three countries have coastlines on the Baltic Sea."
  },
  "180": {
    "text": "What is a river mouth divided into several distributary channels called?",
    "options": [
      "A delta",
      "A fjord",
      "A mountain pass",
      "A plateau"
    ],
    "explanation": "A delta forms through sediment accumulation at a river mouth."
  },
  "181": {
    "text": "Which feature is a glacial valley flooded by the sea?",
    "options": [
      "A fjord",
      "An atoll",
      "A dune",
      "An isthmus"
    ],
    "explanation": "Fjords are valleys carved by glaciers and later flooded."
  },
  "182": {
    "text": "What is a narrow strip of land joining two larger land areas called?",
    "options": [
      "An isthmus",
      "A strait",
      "A gulf",
      "An archipelago"
    ],
    "explanation": "An isthmus connects land areas; a strait connects bodies of water."
  },
  "183": {
    "text": "On a 1:50,000 map, what distance does 2 cm represent?",
    "options": [
      "1 km",
      "100 m",
      "10 km",
      "500 m"
    ],
    "explanation": "2 × 50,000 cm equals 100,000 cm, or 1 km."
  },
  "184": {
    "text": "Which coordinate measures position east or west of Greenwich?",
    "options": [
      "Longitude",
      "Latitude",
      "Altitude",
      "Depth"
    ],
    "explanation": "Longitude is measured relative to the Greenwich meridian."
  },
  "185": {
    "text": "Which country lies on the equator and has Quito as its capital?",
    "options": [
      "Ecuador",
      "Costa Rica",
      "Chile",
      "El Salvador"
    ],
    "explanation": "Ecuador’s name refers to its position on the equator."
  },
  "186": {
    "text": "Which ocean borders Peru’s western coast?",
    "options": [
      "The Pacific",
      "The Atlantic",
      "The Indian",
      "The Arctic"
    ],
    "explanation": "Peru has a coastline on the Pacific Ocean."
  },
  "187": {
    "text": "Which country is separated from India by the Palk Strait?",
    "options": [
      "Sri Lanka",
      "The Maldives",
      "Indonesia",
      "Bangladesh"
    ],
    "explanation": "The Palk Strait lies between southern India and Sri Lanka."
  },
  "188": {
    "text": "Which country mainly consists of the North and South Islands?",
    "options": [
      "New Zealand",
      "Japan",
      "The Philippines",
      "The United Kingdom"
    ],
    "explanation": "These two islands form most of New Zealand’s land area."
  },
  "189": {
    "text": "Which French region borders both the English Channel and the Atlantic?",
    "options": [
      "Brittany",
      "Alsace",
      "Burgundy",
      "Auvergne"
    ],
    "explanation": "The Breton peninsula lies between the English Channel and the Atlantic Ocean."
  },
  "190": {
    "text": "In which year did the storming of the Bastille take place?",
    "options": [
      "1789",
      "1792",
      "1804",
      "1848"
    ],
    "explanation": "This event took place in 1789."
  },
  "191": {
    "text": "In which year did the fall of the Berlin Wall take place?",
    "options": [
      "1989",
      "1979",
      "1991",
      "1961"
    ],
    "explanation": "This event took place in 1989."
  },
  "192": {
    "text": "In which year did the United States Declaration of Independence take place?",
    "options": [
      "1776",
      "1789",
      "1812",
      "1756"
    ],
    "explanation": "This event took place in 1776."
  },
  "193": {
    "text": "In which year did the first human Moon landing take place?",
    "options": [
      "1969",
      "1957",
      "1961",
      "1972"
    ],
    "explanation": "This event took place in 1969."
  },
  "194": {
    "text": "In which year did the start of the First World War take place?",
    "options": [
      "1914",
      "1918",
      "1905",
      "1939"
    ],
    "explanation": "This event took place in 1914."
  },
  "195": {
    "text": "In which year did the end of the Second World War take place?",
    "options": [
      "1945",
      "1944",
      "1940",
      "1950"
    ],
    "explanation": "This event took place in 1945."
  },
  "196": {
    "text": "In which year did the Battle of Hastings take place?",
    "options": [
      "1066",
      "1215",
      "987",
      "1453"
    ],
    "explanation": "This event took place in 1066."
  },
  "197": {
    "text": "In which year did the Battle of Marignano take place?",
    "options": [
      "1515",
      "1492",
      "1598",
      "1415"
    ],
    "explanation": "This event took place in 1515."
  },
  "198": {
    "text": "In which year did Christopher Columbus’s arrival in the Caribbean take place?",
    "options": [
      "1492",
      "1453",
      "1522",
      "1488"
    ],
    "explanation": "This event took place in 1492."
  },
  "199": {
    "text": "In which year did Napoleon I’s coronation as emperor take place?",
    "options": [
      "1804",
      "1799",
      "1815",
      "1789"
    ],
    "explanation": "This event took place in 1804."
  },
  "200": {
    "text": "In which year did the opening of the Suez Canal take place?",
    "options": [
      "1869",
      "1815",
      "1914",
      "1889"
    ],
    "explanation": "This event took place in 1869."
  },
  "201": {
    "text": "In which year did the start of the Reformation associated with Luther’s 95 Theses take place?",
    "options": [
      "1517",
      "1455",
      "1598",
      "1648"
    ],
    "explanation": "This event took place in 1517."
  },
  "202": {
    "text": "In which year did the signing of the Peace of Westphalia take place?",
    "options": [
      "1648",
      "1618",
      "1713",
      "1815"
    ],
    "explanation": "This event took place in 1648."
  },
  "203": {
    "text": "In which year did India’s independence take place?",
    "options": [
      "1947",
      "1930",
      "1956",
      "1962"
    ],
    "explanation": "This event took place in 1947."
  },
  "204": {
    "text": "In which year did the proclamation of the People’s Republic of China take place?",
    "options": [
      "1949",
      "1911",
      "1937",
      "1976"
    ],
    "explanation": "This event took place in 1949."
  },
  "205": {
    "text": "In which year did the definitive abolition of slavery in the French colonies take place?",
    "options": [
      "1848",
      "1789",
      "1802",
      "1871"
    ],
    "explanation": "This event took place in 1848."
  },
  "206": {
    "text": "In which year did the start of Nelson Mandela’s presidency of South Africa take place?",
    "options": [
      "1994",
      "1990",
      "1984",
      "2004"
    ],
    "explanation": "This event took place in 1994."
  },
  "207": {
    "text": "In which year did the founding of the United Nations take place?",
    "options": [
      "1945",
      "1919",
      "1939",
      "1957"
    ],
    "explanation": "This event took place in 1945."
  },
  "208": {
    "text": "In which year did the launch of Sputnik 1 take place?",
    "options": [
      "1957",
      "1961",
      "1969",
      "1945"
    ],
    "explanation": "This event took place in 1957."
  },
  "209": {
    "text": "In which year did the signing of the Maastricht Treaty take place?",
    "options": [
      "1992",
      "1957",
      "1986",
      "2007"
    ],
    "explanation": "This event took place in 1992."
  },
  "210": {
    "text": "Which French king is known as the Sun King?",
    "options": [
      "Louis XIV",
      "Louis XVI",
      "Francis I",
      "Henry II"
    ],
    "explanation": "Louis XIV used the sun as a symbol of his power."
  },
  "211": {
    "text": "Which French ruler revoked the Edict of Nantes in 1685?",
    "options": [
      "Louis XIV",
      "Henry IV",
      "Louis XIII",
      "Louis XV"
    ],
    "explanation": "Louis XIV revoked the Edict of Nantes through the Edict of Fontainebleau."
  },
  "212": {
    "text": "Who became the first Roman emperor?",
    "options": [
      "Augustus",
      "Julius Caesar",
      "Nero",
      "Trajan"
    ],
    "explanation": "Octavian received the title Augustus in 27 BCE."
  },
  "213": {
    "text": "Which Carthaginian general crossed the Alps with elephants?",
    "options": [
      "Hannibal",
      "Scipio",
      "Pericles",
      "Leonidas"
    ],
    "explanation": "Hannibal crossed the Alps during the Second Punic War."
  },
  "214": {
    "text": "Which Egyptian queen is associated with Julius Caesar and Mark Antony?",
    "options": [
      "Cleopatra VII",
      "Hatshepsut",
      "Nefertiti",
      "Boudicca"
    ],
    "explanation": "Cleopatra VII ruled Egypt in the first century BCE."
  },
  "215": {
    "text": "Which Roman city was buried by Vesuvius in 79 CE?",
    "options": [
      "Pompeii",
      "Ostia",
      "Ravenna",
      "Capua"
    ],
    "explanation": "The eruption of 79 CE buried Pompeii and Herculaneum."
  },
  "216": {
    "text": "Which people used cuneiform writing in ancient Mesopotamia?",
    "options": [
      "The Sumerians",
      "The Incas",
      "The Vikings",
      "The Aztecs"
    ],
    "explanation": "The Sumerians developed writing on clay tablets."
  },
  "217": {
    "text": "Which navigator reached India by sailing around Africa in 1498?",
    "options": [
      "Vasco da Gama",
      "Christopher Columbus",
      "James Cook",
      "Jacques Cartier"
    ],
    "explanation": "Vasco da Gama reached India via the Cape of Good Hope."
  },
  "218": {
    "text": "Which Mongol leader founded a vast empire in the early 13th century?",
    "options": [
      "Genghis Khan",
      "Timur",
      "Attila",
      "Saladin"
    ],
    "explanation": "Genghis Khan united the Mongol tribes in the early 13th century."
  },
  "219": {
    "text": "Which leader led the Huns in the fifth century?",
    "options": [
      "Attila",
      "Alaric",
      "Clovis",
      "Charlemagne"
    ],
    "explanation": "Attila ruled the Huns in the mid-fifth century."
  },
  "220": {
    "text": "Which French heroine helped lift the siege of Orléans in 1429?",
    "options": [
      "Joan of Arc",
      "Eleanor of Aquitaine",
      "Anne of Brittany",
      "Olympe de Gouges"
    ],
    "explanation": "Joan of Arc helped relieve Orléans during the Hundred Years’ War."
  },
  "221": {
    "text": "Which thinker wrote The Social Contract?",
    "options": [
      "Jean-Jacques Rousseau",
      "Montesquieu",
      "Voltaire",
      "Denis Diderot"
    ],
    "explanation": "Rousseau published The Social Contract in 1762."
  },
  "222": {
    "text": "Who led the Soviet Union during most of the Second World War?",
    "options": [
      "Joseph Stalin",
      "Nikita Khrushchev",
      "Vladimir Lenin",
      "Mikhail Gorbachev"
    ],
    "explanation": "Stalin led the USSR during the war."
  },
  "223": {
    "text": "Which British leader delivered the “Iron Curtain” speech in 1946?",
    "options": [
      "Winston Churchill",
      "Clement Attlee",
      "Neville Chamberlain",
      "Harold Wilson"
    ],
    "explanation": "Churchill delivered the speech in Fulton, in the United States."
  },
  "224": {
    "text": "Who was the first president of the United States?",
    "options": [
      "George Washington",
      "Thomas Jefferson",
      "John Adams",
      "Abraham Lincoln"
    ],
    "explanation": "George Washington took office in 1789."
  },
  "225": {
    "text": "Which US president is associated with the Emancipation Proclamation of 1863?",
    "options": [
      "Abraham Lincoln",
      "Andrew Jackson",
      "Theodore Roosevelt",
      "Woodrow Wilson"
    ],
    "explanation": "Lincoln issued this proclamation during the American Civil War."
  },
  "226": {
    "text": "Which Indian movement is associated with Gandhi and nonviolence?",
    "options": [
      "The independence movement",
      "The Industrial Revolution",
      "The Protestant Reformation",
      "The Japanese imperial restoration"
    ],
    "explanation": "Gandhi used civil disobedience against British rule."
  },
  "227": {
    "text": "Which event in 1929 marked the start of a severe global economic crisis?",
    "options": [
      "The Wall Street Crash",
      "The Suez Crisis",
      "The oil shock",
      "The collapse of Bretton Woods"
    ],
    "explanation": "The 1929 stock market crash preceded the Great Depression."
  },
  "228": {
    "text": "In which war did the armistice of 11 November 1918 end fighting on the Western Front?",
    "options": [
      "The First World War",
      "The Crimean War",
      "The Franco-Prussian War",
      "The Second World War"
    ],
    "explanation": "The armistice ended fighting on the Western Front of the First World War."
  },
  "229": {
    "text": "Which series of wars was fought between Rome and Carthage?",
    "options": [
      "The Punic Wars",
      "The Greco-Persian Wars",
      "The Crusades",
      "The Napoleonic Wars"
    ],
    "explanation": "Rome and Carthage fought three Punic Wars."
  },
  "230": {
    "text": "Which Greek city is associated with Pericles’s democracy?",
    "options": [
      "Athens",
      "Sparta",
      "Corinth",
      "Thebes"
    ],
    "explanation": "Pericles was a leading figure in fifth-century BCE Athenian democracy."
  },
  "231": {
    "text": "Which country gave the Statue of Liberty to the United States?",
    "options": [
      "France",
      "The United Kingdom",
      "Italy",
      "Germany"
    ],
    "explanation": "The statue, designed by Bartholdi, was a French gift dedicated in 1886."
  },
  "232": {
    "text": "Which European war lasted from 1618 to 1648?",
    "options": [
      "The Thirty Years’ War",
      "The Hundred Years’ War",
      "The Seven Years’ War",
      "The Crimean War"
    ],
    "explanation": "The Thirty Years’ War ended with the Peace of Westphalia."
  },
  "233": {
    "text": "What is the Japanese period of modernisation beginning in 1868 called?",
    "options": [
      "The Meiji era",
      "The Edo period",
      "The Heian period",
      "The Nara period"
    ],
    "explanation": "The Meiji Restoration began a period of major changes in Japan."
  },
  "234": {
    "text": "Which city was the political centre of the Aztec Empire before the Spanish conquest?",
    "options": [
      "Tenochtitlan",
      "Cusco",
      "Machu Picchu",
      "Carthage"
    ],
    "explanation": "Tenochtitlan stood on the site of present-day Mexico City."
  },
  "235": {
    "text": "Which chemical element has the symbol Ag?",
    "options": [
      "Silver",
      "Gold",
      "Argon",
      "Aluminium"
    ],
    "explanation": "Ag is the chemical symbol for silver."
  },
  "236": {
    "text": "Which chemical element has the symbol Au?",
    "options": [
      "Gold",
      "Silver",
      "Copper",
      "Uranium"
    ],
    "explanation": "Au is the chemical symbol for gold."
  },
  "237": {
    "text": "Which chemical element has the symbol Fe?",
    "options": [
      "Iron",
      "Fluorine",
      "Francium",
      "Fermium"
    ],
    "explanation": "Fe is the chemical symbol for iron."
  },
  "238": {
    "text": "Which chemical element has the symbol K?",
    "options": [
      "Potassium",
      "Krypton",
      "Calcium",
      "Cobalt"
    ],
    "explanation": "K is the chemical symbol for potassium."
  },
  "239": {
    "text": "Which chemical element has the symbol Na?",
    "options": [
      "Sodium",
      "Nitrogen",
      "Neon",
      "Nickel"
    ],
    "explanation": "Na is the chemical symbol for sodium."
  },
  "240": {
    "text": "Which chemical element has the symbol Pb?",
    "options": [
      "Lead",
      "Phosphorus",
      "Platinum",
      "Palladium"
    ],
    "explanation": "Pb is the chemical symbol for lead."
  },
  "241": {
    "text": "Which chemical element has the symbol Sn?",
    "options": [
      "Tin",
      "Silicon",
      "Sulfur",
      "Selenium"
    ],
    "explanation": "Sn is the chemical symbol for tin."
  },
  "242": {
    "text": "Which chemical element has the symbol Cu?",
    "options": [
      "Copper",
      "Calcium",
      "Carbon",
      "Chromium"
    ],
    "explanation": "Cu is the chemical symbol for copper."
  },
  "243": {
    "text": "Which chemical element has the symbol Hg?",
    "options": [
      "Mercury",
      "Helium",
      "Hydrogen",
      "Hafnium"
    ],
    "explanation": "Hg is the chemical symbol for mercury."
  },
  "244": {
    "text": "Which chemical element has the symbol Si?",
    "options": [
      "Silicon",
      "Sulfur",
      "Silver",
      "Sodium"
    ],
    "explanation": "Si is the chemical symbol for silicon."
  },
  "245": {
    "text": "Which quantity is measured in watts?",
    "options": [
      "Power",
      "Energy",
      "Resistance",
      "Pressure"
    ],
    "explanation": "One watt is an energy transfer of one joule per second."
  },
  "246": {
    "text": "Which quantity is measured in coulombs?",
    "options": [
      "Electric charge",
      "Temperature",
      "Speed",
      "Force"
    ],
    "explanation": "The coulomb is the SI unit of electric charge."
  },
  "247": {
    "text": "What is the SI unit of force?",
    "options": [
      "The newton",
      "The watt",
      "The volt",
      "The kelvin"
    ],
    "explanation": "One newton equals one kilogram metre per second squared."
  },
  "248": {
    "text": "What is the SI unit of thermodynamic temperature?",
    "options": [
      "The kelvin",
      "The degree Celsius",
      "The joule",
      "The degree Fahrenheit"
    ],
    "explanation": "The Kelvin scale starts at absolute zero."
  },
  "249": {
    "text": "Which component stores energy in an electric field?",
    "options": [
      "A capacitor",
      "An ideal resistor",
      "An open switch alone",
      "A fuse"
    ],
    "explanation": "A capacitor stores charge on two separated conductors."
  },
  "250": {
    "text": "Which instrument measures atmospheric pressure?",
    "options": [
      "A barometer",
      "A hygrometer",
      "An anemometer",
      "An ammeter"
    ],
    "explanation": "A barometer measures pressure exerted by the atmosphere."
  },
  "251": {
    "text": "Which instrument measures electric current?",
    "options": [
      "An ammeter",
      "A voltmeter",
      "A barometer",
      "A light meter"
    ],
    "explanation": "An ammeter measures current in amperes."
  },
  "252": {
    "text": "Which particle in the nucleus has no electric charge?",
    "options": [
      "The neutron",
      "The proton",
      "The electron",
      "The positron"
    ],
    "explanation": "A neutron is electrically neutral."
  },
  "253": {
    "text": "Two isotopes of an element differ in their number of…",
    "options": [
      "Neutrons",
      "Protons",
      "Nuclei",
      "Chemical elements"
    ],
    "explanation": "Isotopes have the same proton count but different neutron counts."
  },
  "254": {
    "text": "What does an atom become when it loses an electron?",
    "options": [
      "A positive ion",
      "A negative ion",
      "A neutron",
      "Necessarily a different isotope"
    ],
    "explanation": "Losing a negative charge leaves a net positive charge."
  },
  "255": {
    "text": "Which formula represents carbon dioxide?",
    "options": [
      "CO₂",
      "CO",
      "CH₄",
      "CaO"
    ],
    "explanation": "A CO₂ molecule contains one carbon atom and two oxygen atoms."
  },
  "256": {
    "text": "Which formula represents methane?",
    "options": [
      "CH₄",
      "NH₃",
      "C₂H₆",
      "H₂O"
    ],
    "explanation": "Methane has one carbon atom bonded to four hydrogen atoms."
  },
  "257": {
    "text": "Which formula represents ammonia?",
    "options": [
      "NH₃",
      "NO₂",
      "N₂",
      "HNO₃"
    ],
    "explanation": "Ammonia contains one nitrogen atom and three hydrogen atoms."
  },
  "258": {
    "text": "Which gas makes up about 78% of Earth’s dry air?",
    "options": [
      "Nitrogen",
      "Oxygen",
      "Carbon dioxide",
      "Argon"
    ],
    "explanation": "Nitrogen is the main constituent of dry air."
  },
  "259": {
    "text": "What is the change from liquid to solid called?",
    "options": [
      "Freezing",
      "Vaporisation",
      "Sublimation",
      "Melting"
    ],
    "explanation": "Freezing changes a liquid into a solid."
  },
  "260": {
    "text": "What is the change from liquid to gas called?",
    "options": [
      "Vaporisation",
      "Melting",
      "Freezing",
      "Deposition"
    ],
    "explanation": "Vaporisation includes evaporation and boiling."
  },
  "261": {
    "text": "At standard atmospheric pressure, at approximately what temperature does pure water boil?",
    "options": [
      "100 °C",
      "0 °C",
      "50 °C",
      "150 °C"
    ],
    "explanation": "Water’s boiling point depends on pressure and is about 100 °C at one atmosphere."
  },
  "262": {
    "text": "Which technique separates liquids using their different boiling points?",
    "options": [
      "Distillation",
      "Simple filtration",
      "Sieving",
      "Magnetic separation"
    ],
    "explanation": "Distillation vaporises and then condenses components."
  },
  "263": {
    "text": "Which process separates an insoluble solid from a liquid through a porous material?",
    "options": [
      "Filtration",
      "Melting",
      "Electrolysis",
      "Sublimation"
    ],
    "explanation": "The filter retains sufficiently large solid particles."
  },
  "264": {
    "text": "What does a catalyst do in a reaction?",
    "options": [
      "It speeds up the reaction without being consumed overall",
      "It turns elements into gold",
      "It removes all activation energy",
      "It always becomes the main product"
    ],
    "explanation": "A catalyst provides a reaction pathway with lower activation energy."
  },
  "265": {
    "text": "A reaction that releases heat is described as…",
    "options": [
      "Exothermic",
      "Endothermic",
      "Necessarily isothermal",
      "Necessarily radioactive"
    ],
    "explanation": "An exothermic reaction transfers heat to its surroundings."
  },
  "266": {
    "text": "Which process transfers heat through the movement of a fluid?",
    "options": [
      "Convection",
      "Conduction alone",
      "Refraction",
      "Diffraction"
    ],
    "explanation": "Convection involves movement of matter in a liquid or gas."
  },
  "267": {
    "text": "Which property explains an object’s resistance to a change in velocity?",
    "options": [
      "Inertia",
      "Refraction",
      "Solubility",
      "Polarisation"
    ],
    "explanation": "Inertia is the tendency to maintain a state of motion."
  },
  "268": {
    "text": "If an object’s speed doubles at constant mass, its kinetic energy is…",
    "options": [
      "Multiplied by four",
      "Multiplied by two",
      "Unchanged",
      "Divided by two"
    ],
    "explanation": "Kinetic energy equals half the mass times the square of speed."
  },
  "269": {
    "text": "Which relation defines density?",
    "options": [
      "Mass divided by volume",
      "Volume divided by mass",
      "Mass times speed",
      "Force divided by time"
    ],
    "explanation": "Density expresses mass per unit volume."
  },
  "270": {
    "text": "In a vacuum, two objects released from rest at the same height near the ground fall…",
    "options": [
      "With the same acceleration",
      "Faster if their mass is greater",
      "Faster if their volume is greater",
      "Without experiencing gravity"
    ],
    "explanation": "Without air resistance, falling acceleration does not depend on their mass."
  },
  "271": {
    "text": "Which effect explains the changing pitch of a siren as it passes us?",
    "options": [
      "The Doppler effect",
      "The photoelectric effect",
      "The Joule effect",
      "The greenhouse effect"
    ],
    "explanation": "Relative motion changes the observed frequency of a wave."
  },
  "272": {
    "text": "Which of these visible colours has the shortest wavelength?",
    "options": [
      "Violet",
      "Blue",
      "Green",
      "Red"
    ],
    "explanation": "Violet corresponds to the shortest wavelengths in the visible spectrum."
  },
  "273": {
    "text": "Which optical object converges parallel rays in air?",
    "options": [
      "A converging lens",
      "A diverging lens",
      "A plane mirror",
      "A parallel-sided glass pane"
    ],
    "explanation": "A converging lens brings parallel rays together at its focal point."
  },
  "274": {
    "text": "Which phenomenon separates white light into colours in a prism?",
    "options": [
      "Dispersion",
      "Conduction",
      "Gravitation",
      "Freezing"
    ],
    "explanation": "Refractive index depends on wavelength, separating the colours."
  },
  "275": {
    "text": "Two north poles of magnets brought close together…",
    "options": [
      "Repel each other",
      "Attract each other",
      "Permanently cancel each other",
      "Turn into south poles"
    ],
    "explanation": "Like magnetic poles repel each other."
  },
  "276": {
    "text": "Which effect converts electrical energy into heat in a resistor?",
    "options": [
      "The Joule effect",
      "The Doppler effect",
      "Refraction",
      "Sublimation"
    ],
    "explanation": "Current flowing through a resistor dissipates thermal energy."
  },
  "277": {
    "text": "What voltage is across a 10 Ω resistor carrying 2 A?",
    "options": [
      "20 V",
      "5 V",
      "12 V",
      "0.2 V"
    ],
    "explanation": "Ohm’s law gives V = 10 × 2 = 20 V."
  },
  "278": {
    "text": "After two half-lives, what fraction of the initial radioactive nuclei remains undecayed?",
    "options": [
      "1/4",
      "1/2",
      "1/8",
      "3/4"
    ],
    "explanation": "The remaining amount is halved with each half-life."
  },
  "279": {
    "text": "Which material is mainly made from melted silica for ordinary windows?",
    "options": [
      "Glass",
      "Rubber",
      "Paper",
      "Steel"
    ],
    "explanation": "Silica is the main constituent of ordinary glass."
  },
  "280": {
    "text": "What is the sum of the interior angles of a convex hexagon?",
    "options": [
      "720°",
      "540°",
      "900°",
      "360°"
    ],
    "explanation": "The formula (n − 2) × 180° gives 720° for six sides."
  },
  "281": {
    "text": "How many diagonals does a convex octagon have?",
    "options": [
      "20",
      "16",
      "24",
      "28"
    ],
    "explanation": "The formula n(n − 3)/2 gives 8 × 5 / 2 = 20."
  },
  "282": {
    "text": "What is the volume of a cube with side length 4 cm?",
    "options": [
      "64 cm³",
      "16 cm³",
      "48 cm³",
      "12 cm³"
    ],
    "explanation": "A cube’s volume is its side length cubed: 4³ = 64."
  },
  "283": {
    "text": "What is the area of a disk of radius 3?",
    "options": [
      "9π",
      "6π",
      "3π",
      "18π"
    ],
    "explanation": "Area equals πr², giving 9π."
  },
  "284": {
    "text": "What is the circumference of a circle with diameter 10?",
    "options": [
      "10π",
      "20π",
      "100π",
      "5π"
    ],
    "explanation": "Circumference equals π times the diameter."
  },
  "285": {
    "text": "What is the area of a triangle with base 12 and corresponding height 5?",
    "options": [
      "30",
      "60",
      "17",
      "120"
    ],
    "explanation": "Area equals base × height / 2, giving 30."
  },
  "286": {
    "text": "In a right triangle, one acute angle is 35°. What is the other?",
    "options": [
      "55°",
      "65°",
      "145°",
      "35°"
    ],
    "explanation": "The two acute angles of a right triangle total 90°."
  },
  "287": {
    "text": "Which solid has four triangular faces?",
    "options": [
      "A tetrahedron",
      "A cube",
      "An octahedron",
      "A dodecahedron"
    ],
    "explanation": "A tetrahedron has four faces, six edges and four vertices."
  },
  "288": {
    "text": "What is the reflection of (3, −2) through the origin?",
    "options": [
      "(-3, 2)",
      "(3, 2)",
      "(-3, -2)",
      "(2, -3)"
    ],
    "explanation": "Reflection through the origin changes the sign of both coordinates."
  },
  "289": {
    "text": "What is the distance between (0, 0) and (5, 12)?",
    "options": [
      "13",
      "17",
      "7",
      "60"
    ],
    "explanation": "Pythagoras gives √(25 + 144) = 13."
  },
  "290": {
    "text": "Which value of x satisfies 3x + 7 = 22?",
    "options": [
      "5",
      "7",
      "9",
      "15"
    ],
    "explanation": "Subtract 7, then divide by 3."
  },
  "291": {
    "text": "What are the real solutions of x² = 49?",
    "options": [
      "−7 and 7",
      "Only 7",
      "Only −7",
      "0 and 49"
    ],
    "explanation": "Both 7 and −7 have square 49."
  },
  "292": {
    "text": "Which identity is correct?",
    "options": [
      "(a + b)² = a² + 2ab + b²",
      "(a + b)² = a² + b²",
      "(a + b)² = a² − b²",
      "(a + b)² = 2a + 2b"
    ],
    "explanation": "The expansion includes the cross term 2ab."
  },
  "293": {
    "text": "What is the factorisation of x² − 9?",
    "options": [
      "(x − 3)(x + 3)",
      "(x − 9)(x + 9)",
      "(x − 3)²",
      "x(x − 9)"
    ],
    "explanation": "Use the difference of squares: a² − b² = (a − b)(a + b)."
  },
  "294": {
    "text": "What is 3⁴?",
    "options": [
      "81",
      "12",
      "64",
      "27"
    ],
    "explanation": "3⁴ = 3 × 3 × 3 × 3 = 81."
  },
  "295": {
    "text": "What is 10⁻³?",
    "options": [
      "0.001",
      "0.01",
      "−1000",
      "0.1"
    ],
    "explanation": "A negative exponent gives the reciprocal: 10⁻³ = 1/1000."
  },
  "296": {
    "text": "What is log₁₀(1000)?",
    "options": [
      "3",
      "10",
      "100",
      "30"
    ],
    "explanation": "10³ equals 1000, so its base-10 logarithm is 3."
  },
  "297": {
    "text": "What is the derivative of 5x² + 3x?",
    "options": [
      "10x + 3",
      "5x + 3",
      "10x² + 3",
      "5x³ + 3x²"
    ],
    "explanation": "The derivative of 5x² is 10x, and that of 3x is 3."
  },
  "298": {
    "text": "Which function is an antiderivative of 2x over the reals?",
    "options": [
      "x²",
      "2",
      "2x²",
      "x³"
    ],
    "explanation": "The derivative of x² is 2x."
  },
  "299": {
    "text": "What is the slope of the line y = −3x + 8?",
    "options": [
      "−3",
      "8",
      "3",
      "−8"
    ],
    "explanation": "In y = ax + b, the slope is a."
  },
  "300": {
    "text": "A car travels 150 km in 2 hours 30 minutes. What is its average speed?",
    "options": [
      "60 km/h",
      "75 km/h",
      "50 km/h",
      "90 km/h"
    ],
    "explanation": "2 hours 30 minutes is 2.5 hours; 150 / 2.5 = 60."
  },
  "301": {
    "text": "An €80 item is discounted by 15%. What is its new price?",
    "options": [
      "€68",
      "€65",
      "€72",
      "€60"
    ],
    "explanation": "The discount is €12, leaving a price of €68."
  },
  "302": {
    "text": "After a 25% increase, a price reaches €100. What was the original price?",
    "options": [
      "€80",
      "€75",
      "€125",
      "€90"
    ],
    "explanation": "Divide 100 by 1.25 to recover 80."
  },
  "303": {
    "text": "Which fraction equals 0.375?",
    "options": [
      "3/8",
      "3/4",
      "5/8",
      "1/3"
    ],
    "explanation": "3 divided by 8 equals 0.375."
  },
  "304": {
    "text": "What is 2/3 + 1/4?",
    "options": [
      "11/12",
      "3/7",
      "5/12",
      "7/12"
    ],
    "explanation": "Using denominator 12: 8/12 + 3/12 = 11/12."
  },
  "305": {
    "text": "What is the reciprocal of 5/7?",
    "options": [
      "7/5",
      "−5/7",
      "2/7",
      "5/12"
    ],
    "explanation": "A fraction multiplied by its reciprocal equals 1."
  },
  "306": {
    "text": "What is the mean of 6, 10, 14 and 18?",
    "options": [
      "12",
      "10",
      "14",
      "48"
    ],
    "explanation": "The sum is 48; dividing by 4 gives 12."
  },
  "307": {
    "text": "What is the range of 3, 7, 8, 12, 19?",
    "options": [
      "16",
      "19",
      "8",
      "12"
    ],
    "explanation": "The range is the maximum minus the minimum: 19 − 3."
  },
  "308": {
    "text": "What is the mode of 2, 3, 3, 5, 8?",
    "options": [
      "3",
      "2",
      "5",
      "8"
    ],
    "explanation": "The mode is the most frequent value."
  },
  "309": {
    "text": "What is the probability of rolling a total of 7 with two fair dice?",
    "options": [
      "1/6",
      "1/12",
      "7/36",
      "1/3"
    ],
    "explanation": "Six of the 36 ordered outcomes total 7."
  },
  "310": {
    "text": "One card is drawn from a 52-card deck without jokers. What is the probability of an ace?",
    "options": [
      "1/13",
      "1/4",
      "1/26",
      "4/13"
    ],
    "explanation": "The deck contains four aces: 4/52 = 1/13."
  },
  "311": {
    "text": "A bag contains 3 red balls and 2 blue balls. What is the probability of drawing a blue one?",
    "options": [
      "2/5",
      "3/5",
      "1/2",
      "2/3"
    ],
    "explanation": "Two of the five balls are blue."
  },
  "312": {
    "text": "In how many ways can three distinct people be arranged in a line?",
    "options": [
      "6",
      "3",
      "9",
      "12"
    ],
    "explanation": "There are 3! = 3 × 2 × 1 = 6 permutations."
  },
  "313": {
    "text": "How many distinct unordered pairs can be chosen from five people?",
    "options": [
      "10",
      "20",
      "5",
      "25"
    ],
    "explanation": "The number of combinations is 5 × 4 / 2 = 10."
  },
  "314": {
    "text": "Which number follows 2, 6, 18, 54 in a geometric sequence?",
    "options": [
      "162",
      "108",
      "72",
      "216"
    ],
    "explanation": "Each term is multiplied by 3."
  },
  "315": {
    "text": "In an arithmetic sequence starting at 4 with common difference 3, what is the fifth term?",
    "options": [
      "16",
      "19",
      "12",
      "15"
    ],
    "explanation": "The first five terms are 4, 7, 10, 13 and 16."
  },
  "316": {
    "text": "What is the remainder when 47 is divided by 6?",
    "options": [
      "5",
      "1",
      "7",
      "3"
    ],
    "explanation": "47 = 6 × 7 + 5."
  },
  "317": {
    "text": "Which number is divisible by 9?",
    "options": [
      "729",
      "731",
      "734",
      "737"
    ],
    "explanation": "7 + 2 + 9 = 18, which is divisible by 9."
  },
  "318": {
    "text": "What is the prime factorisation of 60?",
    "options": [
      "2² × 3 × 5",
      "2 × 3² × 5",
      "2² × 3²",
      "3 × 5²"
    ],
    "explanation": "4 × 3 × 5 = 60."
  },
  "319": {
    "text": "If P implies Q and Q is false, what can be concluded?",
    "options": [
      "P is false",
      "P is true",
      "Q is true",
      "Nothing about P"
    ],
    "explanation": "This is reasoning by contraposition, called modus tollens."
  },
  "320": {
    "text": "Which statement negates “P and Q”?",
    "options": [
      "Not P or not Q",
      "Not P and not Q",
      "P or Q",
      "P and not Q"
    ],
    "explanation": "De Morgan’s law turns the negation of a conjunction into a disjunction of negations."
  },
  "321": {
    "text": "An inclusive “P or Q” statement is false when…",
    "options": [
      "Both P and Q are false",
      "Only P is true",
      "Only Q is true",
      "Both P and Q are true"
    ],
    "explanation": "Inclusive OR is true when at least one proposition is true."
  },
  "322": {
    "text": "What is the absolute value of −8?",
    "options": [
      "8",
      "−8",
      "0",
      "64"
    ],
    "explanation": "Absolute value measures distance from zero."
  },
  "323": {
    "text": "What is √144?",
    "options": [
      "12",
      "−12",
      "14",
      "72"
    ],
    "explanation": "The principal square root is nonnegative: 12² = 144."
  },
  "324": {
    "text": "Two quantities are inversely proportional. If one triples, the other…",
    "options": [
      "Is divided by three",
      "Triples",
      "Doubles",
      "Does not change"
    ],
    "explanation": "The product of two inversely proportional quantities remains constant."
  },
  "325": {
    "text": "Who wrote Les Misérables?",
    "options": [
      "Victor Hugo",
      "Émile Zola",
      "Honoré de Balzac",
      "Gustave Flaubert"
    ],
    "explanation": "Les Misérables is a novel by Victor Hugo."
  },
  "326": {
    "text": "Who wrote Madame Bovary?",
    "options": [
      "Gustave Flaubert",
      "Stendhal",
      "Victor Hugo",
      "Guy de Maupassant"
    ],
    "explanation": "Madame Bovary is a novel by Gustave Flaubert."
  },
  "327": {
    "text": "Who wrote Germinal?",
    "options": [
      "Émile Zola",
      "Alphonse Daudet",
      "Honoré de Balzac",
      "Marcel Proust"
    ],
    "explanation": "Germinal is a novel by Émile Zola."
  },
  "328": {
    "text": "Who wrote Father Goriot?",
    "options": [
      "Honoré de Balzac",
      "Émile Zola",
      "Stendhal",
      "Alexandre Dumas"
    ],
    "explanation": "Father Goriot is a novel by Honoré de Balzac."
  },
  "329": {
    "text": "Who wrote Bel-Ami?",
    "options": [
      "Guy de Maupassant",
      "Gustave Flaubert",
      "Émile Zola",
      "Victor Hugo"
    ],
    "explanation": "Bel-Ami is a novel by Guy de Maupassant."
  },
  "330": {
    "text": "Who wrote The Three Musketeers?",
    "options": [
      "Alexandre Dumas",
      "Victor Hugo",
      "Jules Verne",
      "Honoré de Balzac"
    ],
    "explanation": "The Three Musketeers is a novel by Alexandre Dumas."
  },
  "331": {
    "text": "Who wrote Twenty Thousand Leagues Under the Seas?",
    "options": [
      "Jules Verne",
      "H. G. Wells",
      "Robert Louis Stevenson",
      "Daniel Defoe"
    ],
    "explanation": "Twenty Thousand Leagues Under the Seas is a novel by Jules Verne."
  },
  "332": {
    "text": "Who wrote The Little Prince?",
    "options": [
      "Antoine de Saint-Exupéry",
      "Jean Giono",
      "Albert Camus",
      "Marcel Pagnol"
    ],
    "explanation": "The Little Prince is a tale by Antoine de Saint-Exupéry."
  },
  "333": {
    "text": "Who wrote The Plague?",
    "options": [
      "Albert Camus",
      "Jean-Paul Sartre",
      "André Malraux",
      "Boris Vian"
    ],
    "explanation": "The Plague is a novel by Albert Camus."
  },
  "334": {
    "text": "Who wrote Froth on the Daydream?",
    "options": [
      "Boris Vian",
      "Raymond Queneau",
      "Jacques Prévert",
      "André Breton"
    ],
    "explanation": "Froth on the Daydream is a novel by Boris Vian."
  },
  "335": {
    "text": "Who wrote Nineteen Eighty-Four?",
    "options": [
      "George Orwell",
      "Aldous Huxley",
      "Ray Bradbury",
      "H. G. Wells"
    ],
    "explanation": "Nineteen Eighty-Four is a novel by George Orwell."
  },
  "336": {
    "text": "Who wrote Brave New World?",
    "options": [
      "Aldous Huxley",
      "George Orwell",
      "Isaac Asimov",
      "Philip K. Dick"
    ],
    "explanation": "Brave New World is a novel by Aldous Huxley."
  },
  "337": {
    "text": "Who wrote Fahrenheit 451?",
    "options": [
      "Ray Bradbury",
      "George Orwell",
      "H. G. Wells",
      "Arthur C. Clarke"
    ],
    "explanation": "Fahrenheit 451 is a novel by Ray Bradbury."
  },
  "338": {
    "text": "Who wrote Dracula?",
    "options": [
      "Bram Stoker",
      "Mary Shelley",
      "Oscar Wilde",
      "Edgar Allan Poe"
    ],
    "explanation": "Dracula is a novel by Bram Stoker."
  },
  "339": {
    "text": "Who wrote The Picture of Dorian Gray?",
    "options": [
      "Oscar Wilde",
      "Charles Dickens",
      "Bram Stoker",
      "Henry James"
    ],
    "explanation": "The Picture of Dorian Gray is a novel by Oscar Wilde."
  },
  "340": {
    "text": "Who wrote Jane Eyre?",
    "options": [
      "Charlotte Brontë",
      "Emily Brontë",
      "Jane Austen",
      "Virginia Woolf"
    ],
    "explanation": "Jane Eyre is a novel by Charlotte Brontë."
  },
  "341": {
    "text": "Who wrote Wuthering Heights?",
    "options": [
      "Emily Brontë",
      "Charlotte Brontë",
      "Mary Shelley",
      "George Eliot"
    ],
    "explanation": "Wuthering Heights is a novel by Emily Brontë."
  },
  "342": {
    "text": "Who wrote Moby-Dick?",
    "options": [
      "Herman Melville",
      "Mark Twain",
      "Jack London",
      "Ernest Hemingway"
    ],
    "explanation": "Moby-Dick is a novel by Herman Melville."
  },
  "343": {
    "text": "Who wrote The Old Man and the Sea?",
    "options": [
      "Ernest Hemingway",
      "John Steinbeck",
      "William Faulkner",
      "F. Scott Fitzgerald"
    ],
    "explanation": "The Old Man and the Sea is a novel by Ernest Hemingway."
  },
  "344": {
    "text": "Who wrote The Great Gatsby?",
    "options": [
      "F. Scott Fitzgerald",
      "Ernest Hemingway",
      "John Steinbeck",
      "Truman Capote"
    ],
    "explanation": "The Great Gatsby is a novel by F. Scott Fitzgerald."
  },
  "345": {
    "text": "Who wrote The Grapes of Wrath?",
    "options": [
      "John Steinbeck",
      "Jack London",
      "William Faulkner",
      "Herman Melville"
    ],
    "explanation": "The Grapes of Wrath is a novel by John Steinbeck."
  },
  "346": {
    "text": "Who wrote War and Peace?",
    "options": [
      "Leo Tolstoy",
      "Fyodor Dostoevsky",
      "Anton Chekhov",
      "Ivan Turgenev"
    ],
    "explanation": "War and Peace is a novel by Leo Tolstoy."
  },
  "347": {
    "text": "Who wrote The Name of the Rose?",
    "options": [
      "Umberto Eco",
      "Italo Calvino",
      "Primo Levi",
      "Alberto Moravia"
    ],
    "explanation": "The Name of the Rose is a novel by Umberto Eco."
  },
  "348": {
    "text": "Who wrote The Alchemist?",
    "options": [
      "Paulo Coelho",
      "José Saramago",
      "Jorge Amado",
      "Fernando Pessoa"
    ],
    "explanation": "The Alchemist is a novel by Paulo Coelho."
  },
  "349": {
    "text": "Which playwright wrote Hamlet?",
    "options": [
      "William Shakespeare",
      "Christopher Marlowe",
      "Ben Jonson",
      "Oscar Wilde"
    ],
    "explanation": "Hamlet is a Shakespeare tragedy set in Denmark."
  },
  "350": {
    "text": "Which French playwright wrote Le Cid?",
    "options": [
      "Pierre Corneille",
      "Jean Racine",
      "Molière",
      "Beaumarchais"
    ],
    "explanation": "Le Cid is a play by Pierre Corneille first performed in 1637."
  },
  "351": {
    "text": "Which French playwright wrote Phèdre?",
    "options": [
      "Jean Racine",
      "Pierre Corneille",
      "Molière",
      "Alfred de Musset"
    ],
    "explanation": "Phèdre is a tragedy by Jean Racine."
  },
  "352": {
    "text": "Which French author was born Jean-Baptiste Poquelin?",
    "options": [
      "Molière",
      "Voltaire",
      "Stendhal",
      "Beaumarchais"
    ],
    "explanation": "Molière was the stage name of Jean-Baptiste Poquelin."
  },
  "353": {
    "text": "Which writer created Sherlock Holmes?",
    "options": [
      "Arthur Conan Doyle",
      "Agatha Christie",
      "Wilkie Collins",
      "Edgar Allan Poe"
    ],
    "explanation": "Conan Doyle wrote about Holmes and his companion Watson."
  },
  "354": {
    "text": "Which writer created Hercule Poirot?",
    "options": [
      "Agatha Christie",
      "Dorothy L. Sayers",
      "Patricia Highsmith",
      "P. D. James"
    ],
    "explanation": "The Belgian detective Hercule Poirot was created by Agatha Christie."
  },
  "355": {
    "text": "How many lines does a traditional sonnet contain?",
    "options": [
      "14",
      "12",
      "16",
      "10"
    ],
    "explanation": "A sonnet contains fourteen lines."
  },
  "356": {
    "text": "Which term describes deliberate expressive exaggeration?",
    "options": [
      "Hyperbole",
      "Litotes",
      "Ellipsis",
      "Metonymy"
    ],
    "explanation": "Hyperbole exaggerates an idea for effect."
  },
  "357": {
    "text": "Which figure of speech gives human characteristics to an object?",
    "options": [
      "Personification",
      "Anagram",
      "Antithesis",
      "Assonance"
    ],
    "explanation": "Personification gives human traits to nonhuman things."
  },
  "358": {
    "text": "Which figure replaces a term with a related one, as in “the crown” for the monarchy?",
    "options": [
      "Metonymy",
      "Oxymoron",
      "Hyperbole",
      "Anaphora"
    ],
    "explanation": "Metonymy relies on a relationship of association or closeness."
  },
  "359": {
    "text": "What is the repetition of the same consonant sound called?",
    "options": [
      "Alliteration",
      "Assonance",
      "Anaphora",
      "Ellipsis"
    ],
    "explanation": "Alliteration repeats consonant sounds; assonance repeats vowel sounds."
  },
  "360": {
    "text": "What is the repetition of the same vowel sound called?",
    "options": [
      "Assonance",
      "Alliteration",
      "Antonomasia",
      "Periphrasis"
    ],
    "explanation": "Assonance is the recurrence of a vowel sound."
  },
  "361": {
    "text": "What is a word formed by rearranging the letters of another called?",
    "options": [
      "An anagram",
      "An antonym",
      "A homophone",
      "An acronym"
    ],
    "explanation": "An anagram uses the same letters in a different order."
  },
  "362": {
    "text": "What are two words with opposite meanings called?",
    "options": [
      "Antonyms",
      "Synonyms",
      "Homonyms",
      "Paronyms"
    ],
    "explanation": "Antonyms have opposite meanings, such as hot and cold."
  },
  "363": {
    "text": "What are two words with the same pronunciation but different meanings called?",
    "options": [
      "Homophones",
      "Antonyms",
      "Acronyms",
      "Diminutives"
    ],
    "explanation": "Homophones sound the same."
  },
  "364": {
    "text": "Which language family includes Spanish, Italian and Portuguese?",
    "options": [
      "Romance languages",
      "Germanic languages",
      "Slavic languages",
      "Semitic languages"
    ],
    "explanation": "Romance languages descend from Latin."
  },
  "365": {
    "text": "Which alphabet is used to write Russian?",
    "options": [
      "Cyrillic",
      "Greek",
      "Hebrew",
      "Armenian"
    ],
    "explanation": "Russian uses a version of the Cyrillic alphabet."
  },
  "366": {
    "text": "What are instructions for acting and staging in a play called?",
    "options": [
      "Stage directions",
      "Rhymes",
      "Stanzas",
      "Epigraphs"
    ],
    "explanation": "Stage directions guide gestures, movement and staging."
  },
  "367": {
    "text": "Which type of narrator knows every character’s thoughts?",
    "options": [
      "Omniscient",
      "Strictly external",
      "Always a minor character",
      "Necessarily unreliable"
    ],
    "explanation": "An omniscient narrator has knowledge beyond any individual character."
  },
  "368": {
    "text": "Which genre depicts an imaginary society presented as ideal?",
    "options": [
      "Utopia",
      "Dystopia",
      "Only satire",
      "Autobiography"
    ],
    "explanation": "A utopia describes an ideal social order, in contrast to a dystopia."
  },
  "369": {
    "text": "Who painted The Starry Night?",
    "options": [
      "Vincent van Gogh",
      "Paul Gauguin",
      "Claude Monet",
      "Paul Cézanne"
    ],
    "explanation": "This work is by Vincent van Gogh."
  },
  "370": {
    "text": "Who painted the Mona Lisa?",
    "options": [
      "Leonardo da Vinci",
      "Michelangelo",
      "Raphael",
      "Titian"
    ],
    "explanation": "This work is by Leonardo da Vinci."
  },
  "371": {
    "text": "Who painted The Birth of Venus?",
    "options": [
      "Sandro Botticelli",
      "Raphael",
      "Caravaggio",
      "Tintoretto"
    ],
    "explanation": "This work is by Sandro Botticelli."
  },
  "372": {
    "text": "Who painted The Night Watch?",
    "options": [
      "Rembrandt",
      "Johannes Vermeer",
      "Frans Hals",
      "Pieter Bruegel"
    ],
    "explanation": "This work is by Rembrandt."
  },
  "373": {
    "text": "Who painted Las Meninas?",
    "options": [
      "Diego Velázquez",
      "Francisco de Goya",
      "El Greco",
      "Pablo Picasso"
    ],
    "explanation": "This work is by Diego Velázquez."
  },
  "374": {
    "text": "Who painted The Kiss, with its golden decoration?",
    "options": [
      "Gustav Klimt",
      "Egon Schiele",
      "Edvard Munch",
      "Oskar Kokoschka"
    ],
    "explanation": "This work is by Gustav Klimt."
  },
  "375": {
    "text": "Who painted The Treachery of Images, depicting a pipe?",
    "options": [
      "René Magritte",
      "Salvador Dalí",
      "Max Ernst",
      "Joan Miró"
    ],
    "explanation": "This work is by René Magritte."
  },
  "376": {
    "text": "Who painted Les Demoiselles d’Avignon?",
    "options": [
      "Pablo Picasso",
      "Henri Matisse",
      "Georges Braque",
      "Fernand Léger"
    ],
    "explanation": "This work is by Pablo Picasso."
  },
  "377": {
    "text": "Who painted Liberty Leading the People?",
    "options": [
      "Eugène Delacroix",
      "Jacques-Louis David",
      "Théodore Géricault",
      "Jean-Auguste-Dominique Ingres"
    ],
    "explanation": "This work is by Eugène Delacroix."
  },
  "378": {
    "text": "Who painted The Raft of the Medusa?",
    "options": [
      "Théodore Géricault",
      "Eugène Delacroix",
      "Gustave Courbet",
      "Édouard Manet"
    ],
    "explanation": "This work is by Théodore Géricault."
  },
  "379": {
    "text": "Who painted Le Déjeuner sur l’herbe, exhibited in 1863?",
    "options": [
      "Édouard Manet",
      "Claude Monet",
      "Auguste Renoir",
      "Edgar Degas"
    ],
    "explanation": "This work is by Édouard Manet."
  },
  "380": {
    "text": "Who painted The Card Players, a late-19th-century series?",
    "options": [
      "Paul Cézanne",
      "Paul Signac",
      "Georges Seurat",
      "Henri Rousseau"
    ],
    "explanation": "This work is by Paul Cézanne."
  },
  "381": {
    "text": "Who painted American Gothic?",
    "options": [
      "Grant Wood",
      "Edward Hopper",
      "Norman Rockwell",
      "Jackson Pollock"
    ],
    "explanation": "This work is by Grant Wood."
  },
  "382": {
    "text": "Who painted Nighthawks, showing a diner at night?",
    "options": [
      "Edward Hopper",
      "Andy Warhol",
      "Mark Rothko",
      "Grant Wood"
    ],
    "explanation": "This work is by Edward Hopper."
  },
  "383": {
    "text": "Who composed The Four Seasons?",
    "options": [
      "Antonio Vivaldi",
      "Johann Sebastian Bach",
      "George Frideric Handel",
      "Joseph Haydn"
    ],
    "explanation": "This work was composed by Antonio Vivaldi."
  },
  "384": {
    "text": "Who composed Swan Lake?",
    "options": [
      "Pyotr Ilyich Tchaikovsky",
      "Sergei Prokofiev",
      "Igor Stravinsky",
      "Nikolai Rimsky-Korsakov"
    ],
    "explanation": "This work was composed by Pyotr Ilyich Tchaikovsky."
  },
  "385": {
    "text": "Who composed the New World Symphony?",
    "options": [
      "Antonín Dvořák",
      "Gustav Mahler",
      "Johannes Brahms",
      "Franz Schubert"
    ],
    "explanation": "This work was composed by Antonín Dvořák."
  },
  "386": {
    "text": "Who composed the Symphonie fantastique?",
    "options": [
      "Hector Berlioz",
      "Georges Bizet",
      "Gabriel Fauré",
      "Camille Saint-Saëns"
    ],
    "explanation": "This work was composed by Hector Berlioz."
  },
  "387": {
    "text": "Who composed the Ninth Symphony featuring the Ode to Joy?",
    "options": [
      "Ludwig van Beethoven",
      "Wolfgang Amadeus Mozart",
      "Joseph Haydn",
      "Robert Schumann"
    ],
    "explanation": "This work was composed by Ludwig van Beethoven."
  },
  "388": {
    "text": "Who composed Clair de lune from the Suite bergamasque?",
    "options": [
      "Claude Debussy",
      "Maurice Ravel",
      "Erik Satie",
      "Frédéric Chopin"
    ],
    "explanation": "This work was composed by Claude Debussy."
  },
  "389": {
    "text": "Which instrument family does the cello belong to?",
    "options": [
      "Bowed strings",
      "Brass",
      "Woodwinds",
      "Membrane percussion"
    ],
    "explanation": "The cello is mainly played with a bow."
  },
  "390": {
    "text": "Which instrument usually has a keyboard and strings struck by hammers?",
    "options": [
      "The piano",
      "The organ",
      "The harpsichord",
      "The accordion"
    ],
    "explanation": "Piano hammers strike strings when keys are pressed."
  },
  "391": {
    "text": "Which keyboard instrument produces sound by plucking its strings?",
    "options": [
      "The harpsichord",
      "The piano",
      "The organ",
      "The celesta"
    ],
    "explanation": "Harpsichord strings are plucked by plectra."
  },
  "392": {
    "text": "What is the speed at which a piece is performed called?",
    "options": [
      "Tempo",
      "Timbre",
      "Key",
      "Range"
    ],
    "explanation": "Tempo indicates the speed of the musical beat."
  },
  "393": {
    "text": "What does “crescendo” mean in music?",
    "options": [
      "Gradually louder",
      "Gradually slower",
      "Gradually higher in pitch",
      "Gradually shorter"
    ],
    "explanation": "A crescendo gradually increases loudness."
  },
  "394": {
    "text": "Which of these is the highest female voice category?",
    "options": [
      "Soprano",
      "Contralto",
      "Baritone",
      "Bass"
    ],
    "explanation": "Soprano is the highest female category among these voices."
  },
  "395": {
    "text": "Which musical sign raises a note by one semitone?",
    "options": [
      "A sharp",
      "A flat",
      "Always a natural",
      "A fermata"
    ],
    "explanation": "A sharp raises a note by one semitone."
  },
  "396": {
    "text": "How many lines are on a standard musical staff?",
    "options": [
      "5",
      "4",
      "6",
      "7"
    ],
    "explanation": "A standard staff has five lines and four spaces."
  },
  "397": {
    "text": "In 4/4 time, how many quarter notes fill one bar?",
    "options": [
      "4",
      "2",
      "8",
      "3"
    ],
    "explanation": "The upper 4 indicates four beats, each worth a quarter note."
  },
  "398": {
    "text": "Which term describes singing without instrumental accompaniment?",
    "options": [
      "A cappella",
      "Pizzicato",
      "Staccato",
      "Glissando"
    ],
    "explanation": "A cappella describes a vocal-only performance."
  },
  "399": {
    "text": "Who directed Citizen Kane?",
    "options": [
      "Orson Welles",
      "Alfred Hitchcock",
      "John Ford",
      "Billy Wilder"
    ],
    "explanation": "Citizen Kane was directed by Orson Welles, who also starred in it."
  },
  "400": {
    "text": "Who directed Seven Samurai?",
    "options": [
      "Akira Kurosawa",
      "Yasujirō Ozu",
      "Hayao Miyazaki",
      "Kenji Mizoguchi"
    ],
    "explanation": "Seven Samurai is a film by Akira Kurosawa."
  },
  "401": {
    "text": "Who directed Psycho in 1960?",
    "options": [
      "Alfred Hitchcock",
      "Stanley Kubrick",
      "Orson Welles",
      "Fritz Lang"
    ],
    "explanation": "Psycho is a thriller directed by Alfred Hitchcock."
  },
  "402": {
    "text": "Who directed 2001: A Space Odyssey?",
    "options": [
      "Stanley Kubrick",
      "Ridley Scott",
      "Steven Spielberg",
      "George Lucas"
    ],
    "explanation": "Stanley Kubrick directed this science-fiction film released in 1968."
  },
  "403": {
    "text": "Who directed Spirited Away?",
    "options": [
      "Hayao Miyazaki",
      "Isao Takahata",
      "Satoshi Kon",
      "Mamoru Hosoda"
    ],
    "explanation": "Spirited Away was directed by Hayao Miyazaki at Studio Ghibli."
  },
  "404": {
    "text": "Who directed The Godfather in 1972?",
    "options": [
      "Francis Ford Coppola",
      "Martin Scorsese",
      "Sergio Leone",
      "Brian De Palma"
    ],
    "explanation": "Francis Ford Coppola directed the adaptation of Mario Puzo’s novel."
  },
  "405": {
    "text": "Which technique applies pigments to plaster while it is still wet?",
    "options": [
      "Fresco",
      "Woodcut",
      "Collage",
      "Mosaic"
    ],
    "explanation": "Fresco fixes pigments into fresh plaster."
  },
  "406": {
    "text": "Which technique assembles small coloured pieces into an image?",
    "options": [
      "Mosaic",
      "Lithography",
      "Watercolour",
      "Screen printing"
    ],
    "explanation": "The pieces in a mosaic are called tesserae."
  },
  "407": {
    "text": "Which art movement is associated with Henri Matisse and intense colours?",
    "options": [
      "Fauvism",
      "Neoclassicism",
      "Socialist realism",
      "Minimalism"
    ],
    "explanation": "Fauvism notably uses vivid, expressive colours."
  },
  "408": {
    "text": "Which movement breaks forms into geometric volumes in works by Picasso and Braque?",
    "options": [
      "Cubism",
      "Romanticism",
      "Rococo",
      "Impressionism"
    ],
    "explanation": "Picasso and Braque were founding figures of Cubism."
  },
  "409": {
    "text": "Which art movement explores dreams and the unconscious?",
    "options": [
      "Surrealism",
      "Neoclassicism",
      "Academic realism",
      "Only Constructivism"
    ],
    "explanation": "Surrealism explores free association and the world of dreams."
  },
  "410": {
    "text": "Which architect designed Fallingwater, a house above a waterfall?",
    "options": [
      "Frank Lloyd Wright",
      "Le Corbusier",
      "Ludwig Mies van der Rohe",
      "Walter Gropius"
    ],
    "explanation": "Fallingwater is a work by Frank Lloyd Wright in Pennsylvania."
  },
  "411": {
    "text": "Which medieval architectural style is associated with pointed arches and flying buttresses?",
    "options": [
      "Gothic",
      "Romanesque",
      "Baroque",
      "Neoclassical"
    ],
    "explanation": "These features are characteristic of Gothic architecture."
  },
  "412": {
    "text": "What is a sculpture that projects only slightly from its background called?",
    "options": [
      "A low relief",
      "A sculpture in the round",
      "A fresco",
      "A stained-glass window"
    ],
    "explanation": "Low relief remains attached to its background with little projection."
  },
  "413": {
    "text": "How many bits are in an IPv4 address?",
    "options": [
      "32",
      "16",
      "64",
      "128"
    ],
    "explanation": "An IPv4 address contains four bytes, or 32 bits."
  },
  "414": {
    "text": "How many bits are in an IPv6 address?",
    "options": [
      "128",
      "32",
      "64",
      "256"
    ],
    "explanation": "IPv6 uses 128-bit addresses."
  },
  "415": {
    "text": "Which port does HTTPS use by default?",
    "options": [
      "443",
      "80",
      "22",
      "25"
    ],
    "explanation": "HTTPS uses port 443 by default."
  },
  "416": {
    "text": "Which protocol is used to send email between servers?",
    "options": [
      "SMTP",
      "IMAP",
      "DNS",
      "DHCP"
    ],
    "explanation": "SMTP transports email between mail servers."
  },
  "417": {
    "text": "Which protocol commonly synchronises a mailbox with a server?",
    "options": [
      "IMAP",
      "SMTP",
      "ARP",
      "NTP"
    ],
    "explanation": "IMAP lets clients read and manage messages stored on the server."
  },
  "418": {
    "text": "Which protocol automatically assigns IP configuration on a network?",
    "options": [
      "DHCP",
      "FTP",
      "SSH",
      "HTTP"
    ],
    "explanation": "DHCP provides an IP address and other network settings."
  },
  "419": {
    "text": "Which protocol is designed to synchronise clocks over a network?",
    "options": [
      "NTP",
      "DNS",
      "SMTP",
      "FTP"
    ],
    "explanation": "NTP stands for Network Time Protocol."
  },
  "420": {
    "text": "Which device connects different IP networks?",
    "options": [
      "A router",
      "A keyboard",
      "A monitor",
      "A RAM module"
    ],
    "explanation": "A router forwards packets between networks."
  },
  "421": {
    "text": "Which HTTP status code indicates that a resource was created?",
    "options": [
      "201",
      "301",
      "401",
      "500"
    ],
    "explanation": "201 Created indicates successful creation of a resource."
  },
  "422": {
    "text": "Which HTTP status code represents a standard permanent redirect?",
    "options": [
      "301",
      "200",
      "404",
      "503"
    ],
    "explanation": "301 Moved Permanently indicates a new permanent address."
  },
  "423": {
    "text": "Which HTTP status code indicates an internal server error?",
    "options": [
      "500",
      "204",
      "302",
      "403"
    ],
    "explanation": "500 Internal Server Error indicates an unexpected server error."
  },
  "424": {
    "text": "Which language structures a web page’s content?",
    "options": [
      "HTML",
      "CSS",
      "SQL",
      "Bash"
    ],
    "explanation": "HTML describes the structure and semantics of web content."
  },
  "425": {
    "text": "On a web page, what does the DOM represent?",
    "options": [
      "A tree representation of the document",
      "An IP address",
      "An encryption protocol",
      "A storage unit"
    ],
    "explanation": "The Document Object Model represents elements and their organisation."
  },
  "426": {
    "text": "Which data format uses objects, arrays and textual or numeric values?",
    "options": [
      "JSON",
      "JPEG",
      "MP3",
      "ZIP"
    ],
    "explanation": "JSON is a text format for representing structured data."
  },
  "427": {
    "text": "Which SQL statement is mainly used to read data?",
    "options": [
      "SELECT",
      "INSERT",
      "UPDATE",
      "DELETE"
    ],
    "explanation": "SELECT retrieves data from a relational database."
  },
  "428": {
    "text": "Which SQL clause filters rows before grouping?",
    "options": [
      "WHERE",
      "ORDER BY",
      "LIMIT",
      "HAVING"
    ],
    "explanation": "WHERE filters rows; HAVING filters groups."
  },
  "429": {
    "text": "Which SQL clause sorts query results?",
    "options": [
      "ORDER BY",
      "GROUP BY",
      "WHERE",
      "JOIN"
    ],
    "explanation": "ORDER BY defines the order of returned rows."
  },
  "430": {
    "text": "What is the role of a primary key in a relational table?",
    "options": [
      "Uniquely identify each row",
      "Compress all columns",
      "Always sort by date",
      "Encrypt the disk"
    ],
    "explanation": "A primary key is unique and cannot be null."
  },
  "431": {
    "text": "What is a foreign key mainly used for?",
    "options": [
      "Maintain a reference to a table’s key",
      "Increase CPU frequency",
      "Replace all joins",
      "Automatically back up the server"
    ],
    "explanation": "A foreign key enforces consistency between related data."
  },
  "432": {
    "text": "What does transaction atomicity guarantee?",
    "options": [
      "All its operations succeed together or are rolled back",
      "Every row is public",
      "Data is always compressed",
      "All queries are instant"
    ],
    "explanation": "Atomicity prevents a partially applied transaction from being retained."
  },
  "433": {
    "text": "Which term describes concurrent operations whose outcome depends on their execution order?",
    "options": [
      "A race condition",
      "Lossless compression",
      "A type conversion",
      "A binary search"
    ],
    "explanation": "A race condition occurs when timing changes the expected outcome."
  },
  "434": {
    "text": "Which tool can temporarily prevent concurrent access to a shared resource?",
    "options": [
      "A lock",
      "A keyboard shortcut",
      "A pixel",
      "An audio codec"
    ],
    "explanation": "A lock coordinates access by concurrent operations."
  },
  "435": {
    "text": "In Git, what is a commit?",
    "options": [
      "A record of a project state",
      "A mandatory deletion of history",
      "A network password",
      "A web server"
    ],
    "explanation": "A commit records a project state with metadata."
  },
  "436": {
    "text": "In Git, what does a branch enable?",
    "options": [
      "Develop a separate line of work",
      "Increase RAM",
      "Encrypt an image",
      "Install a processor"
    ],
    "explanation": "A branch allows a line of development to evolve separately."
  },
  "437": {
    "text": "Which Git file specifies files that should not be tracked automatically?",
    "options": [
      ".gitignore",
      "package.json",
      "index.html",
      "README.md"
    ],
    "explanation": ".gitignore defines patterns for untracked files to ignore."
  },
  "438": {
    "text": "What is the result of “true XOR true”?",
    "options": [
      "False",
      "True",
      "Always null",
      "Undefined"
    ],
    "explanation": "Exclusive OR is true when exactly one input is true."
  },
  "439": {
    "text": "What is hexadecimal FF in decimal?",
    "options": [
      "255",
      "256",
      "128",
      "240"
    ],
    "explanation": "F is 15; FF equals 15 × 16 + 15 = 255."
  },
  "440": {
    "text": "How many bytes are in one kibibyte (KiB)?",
    "options": [
      "1024",
      "1000",
      "8",
      "256"
    ],
    "explanation": "The prefix kibi means 2¹⁰, or 1024."
  },
  "441": {
    "text": "Which numeral system uses only 0 and 1?",
    "options": [
      "Binary",
      "Octal",
      "Hexadecimal",
      "Decimal"
    ],
    "explanation": "The binary system uses base 2."
  },
  "442": {
    "text": "Which image type can be enlarged without pixelating its geometric shapes?",
    "options": [
      "A vector image",
      "A JPEG photograph",
      "A raster PNG screenshot",
      "A low-resolution bitmap"
    ],
    "explanation": "Vector images describe shapes rather than a fixed grid of pixels."
  },
  "443": {
    "text": "Which format is designed to describe vector graphics on the web?",
    "options": [
      "SVG",
      "JPEG",
      "MP3",
      "WAV"
    ],
    "explanation": "SVG stands for Scalable Vector Graphics."
  },
  "444": {
    "text": "Lossless compression allows you to…",
    "options": [
      "Recover the exact original data",
      "Permanently remove fine details",
      "Double the original quality",
      "Automatically encrypt the data"
    ],
    "explanation": "Decompression restores the original data exactly."
  },
  "445": {
    "text": "Which function turns data into a fixed-size digest?",
    "options": [
      "A hash function",
      "A sorting function",
      "A video decoder",
      "A router"
    ],
    "explanation": "A hash function produces a digest from input data."
  },
  "446": {
    "text": "Which principle recommends granting only the permissions needed for a task?",
    "options": [
      "Least privilege",
      "Maximum duplication",
      "Universal access",
      "Adaptive compression"
    ],
    "explanation": "Least privilege limits permissions to actual needs."
  },
  "447": {
    "text": "Which term describes a deceptive message intended to steal login details?",
    "options": [
      "Phishing",
      "Defragmentation",
      "Virtualisation",
      "Rendering"
    ],
    "explanation": "Phishing often impersonates a trusted service to deceive a victim."
  },
  "448": {
    "text": "Which mechanism limits the number of requests accepted over a period?",
    "options": [
      "Rate limiting",
      "Quicksort",
      "Image rotation",
      "Vector rendering"
    ],
    "explanation": "Rate limiting controls request frequency."
  },
  "449": {
    "text": "What is a computing cache?",
    "options": [
      "A copy of data kept to speed up access",
      "A type of cable",
      "A syntax error",
      "A programming language"
    ],
    "explanation": "A cache avoids recomputing or reloading some data."
  },
  "450": {
    "text": "What does O(n) complexity mean for a loop scanning a list?",
    "options": [
      "Work grows in proportion to the number of elements",
      "Work is always constant",
      "Work grows with n squared",
      "The list must be empty"
    ],
    "explanation": "O(n) describes work growing linearly with input size."
  },
  "451": {
    "text": "In a graph, what does an edge connect?",
    "options": [
      "Two vertices",
      "Necessarily two pixels",
      "Only two files",
      "Only two bytes"
    ],
    "explanation": "Edges represent relationships between vertices."
  },
  "452": {
    "text": "Which algorithm explores a vertex’s immediate neighbours first?",
    "options": [
      "Breadth-first search",
      "Insertion sort",
      "Binary search",
      "Merge sort"
    ],
    "explanation": "Breadth-first search explores a graph level by level."
  },
  "453": {
    "text": "What does a “return” statement do in a conventional function?",
    "options": [
      "It ends the call, optionally returning a value",
      "It restarts the computer",
      "It always repeats the loop",
      "It erases the program"
    ],
    "explanation": "Return gives control back to the calling code."
  },
  "454": {
    "text": "Which operation checks whether two values are equal without changing them?",
    "options": [
      "A comparison",
      "An assignment",
      "Concatenation",
      "Incrementing"
    ],
    "explanation": "A comparison evaluates a relationship between values."
  },
  "455": {
    "text": "What is an exception in programming?",
    "options": [
      "A signal interrupting normal flow that can be handled",
      "A variable always equal to zero",
      "A vector image",
      "A mandatory sorting instruction"
    ],
    "explanation": "Exceptions signal and handle unusual situations or errors."
  },
  "456": {
    "text": "What is the role of an operating system?",
    "options": [
      "Manage hardware resources and program execution",
      "Physically replace the CPU",
      "Guarantee the absence of every bug",
      "Only produce images"
    ],
    "explanation": "The operating system coordinates memory, processes and devices."
  },
  "457": {
    "text": "Which planet is closest to the Sun?",
    "options": [
      "Mercury",
      "Venus",
      "Earth",
      "Mars"
    ],
    "explanation": "Mercury has the closest planetary orbit to the Sun."
  },
  "458": {
    "text": "Which planet has the highest average surface temperature?",
    "options": [
      "Venus",
      "Mercury",
      "Mars",
      "Jupiter"
    ],
    "explanation": "Venus’s thick atmosphere produces a strong greenhouse effect."
  },
  "459": {
    "text": "Which planet rotates with a highly tilted axis, as if lying on its side?",
    "options": [
      "Uranus",
      "Mars",
      "Mercury",
      "Jupiter"
    ],
    "explanation": "Uranus’s rotation axis is tilted by about 98 degrees."
  },
  "460": {
    "text": "Which planet has the moon Triton?",
    "options": [
      "Neptune",
      "Saturn",
      "Mars",
      "Uranus"
    ],
    "explanation": "Triton is Neptune’s largest natural satellite."
  },
  "461": {
    "text": "Between which planets is the main asteroid belt?",
    "options": [
      "Mars and Jupiter",
      "Earth and Mars",
      "Jupiter and Saturn",
      "Venus and Earth"
    ],
    "explanation": "The main asteroid belt occupies the region between Mars and Jupiter."
  },
  "462": {
    "text": "What is our galaxy called?",
    "options": [
      "The Milky Way",
      "Andromeda",
      "The Large Magellanic Cloud",
      "The Triangulum Galaxy"
    ],
    "explanation": "The Solar System belongs to the Milky Way."
  },
  "463": {
    "text": "Which neighbouring spiral galaxy is known as M31?",
    "options": [
      "Andromeda",
      "The Milky Way",
      "The Small Magellanic Cloud",
      "The Sombrero Galaxy"
    ],
    "explanation": "M31 designates the Andromeda Galaxy."
  },
  "464": {
    "text": "Which body causes a solar eclipse as seen from Earth?",
    "options": [
      "The Moon passing in front of the Sun",
      "Mars passing in front of the Moon",
      "Jupiter passing in front of Earth",
      "The Sun passing in front of Saturn"
    ],
    "explanation": "During a solar eclipse, the Moon lies between Earth and the Sun."
  },
  "465": {
    "text": "What primarily explains Earth’s seasons?",
    "options": [
      "The tilt of Earth’s axis",
      "Daily changes in the Sun’s mass",
      "The Moon’s phases",
      "An annual halt in rotation"
    ],
    "explanation": "Earth’s axial tilt changes the sunlight received throughout the year."
  },
  "466": {
    "text": "Which phenomenon produces polar auroras?",
    "options": [
      "Charged particles interacting with the atmosphere",
      "Cities reflecting off the Moon",
      "Clouds burning",
      "Stars melting"
    ],
    "explanation": "Particles guided by the magnetic field excite atmospheric gases."
  },
  "467": {
    "text": "What is a space rock that reaches Earth’s surface called?",
    "options": [
      "A meteorite",
      "Only a meteor",
      "A nebula",
      "A constellation"
    ],
    "explanation": "A meteorite is a fragment that survives passage through the atmosphere."
  },
  "468": {
    "text": "What is a vast cloud of gas and dust in space called?",
    "options": [
      "A nebula",
      "A tide",
      "A tectonic plate",
      "An eclipse"
    ],
    "explanation": "Some nebulae are regions where stars form."
  },
  "469": {
    "text": "What is the boundary beyond which nothing can escape a black hole called?",
    "options": [
      "The event horizon",
      "The photosphere",
      "The Kuiper belt",
      "The magnetopause"
    ],
    "explanation": "The event horizon bounds the region from which even light cannot return."
  },
  "470": {
    "text": "Which mission enabled Neil Armstrong to walk on the Moon?",
    "options": [
      "Apollo 11",
      "Apollo 8",
      "Gemini 4",
      "Voyager 1"
    ],
    "explanation": "Apollo 11 achieved the first crewed Moon landing in 1969."
  },
  "471": {
    "text": "Which organelle produces much of the ATP during cellular respiration?",
    "options": [
      "The mitochondrion",
      "The nucleus",
      "The Golgi apparatus",
      "The lysosome"
    ],
    "explanation": "Mitochondria help produce ATP through respiration."
  },
  "472": {
    "text": "Which cellular structure assembles proteins from amino acids?",
    "options": [
      "The ribosome",
      "The chloroplast",
      "The nuclear membrane",
      "The vacuole"
    ],
    "explanation": "Ribosomes translate messenger RNA."
  },
  "473": {
    "text": "In DNA, which base normally pairs with adenine?",
    "options": [
      "Thymine",
      "Guanine",
      "Cytosine",
      "Uracil"
    ],
    "explanation": "In DNA, A pairs with T and C with G."
  },
  "474": {
    "text": "What is a change in a DNA sequence called?",
    "options": [
      "A mutation",
      "Digestion",
      "Evaporation",
      "Pollination"
    ],
    "explanation": "A mutation changes the information carried by a DNA sequence."
  },
  "475": {
    "text": "Which structure usually contains most of an animal cell’s DNA?",
    "options": [
      "The nucleus",
      "The ribosome",
      "The cell membrane",
      "The lysosome"
    ],
    "explanation": "The nucleus contains the animal cell’s chromosomes."
  },
  "476": {
    "text": "Which group includes animals with an internal skeleton and backbone?",
    "options": [
      "Vertebrates",
      "Arthropods",
      "Molluscs",
      "Annelids"
    ],
    "explanation": "Vertebrates have a backbone."
  },
  "477": {
    "text": "How many legs does a typical adult insect have?",
    "options": [
      "6",
      "8",
      "10",
      "4"
    ],
    "explanation": "Insects have three pairs of legs."
  },
  "478": {
    "text": "Which group does a spider belong to?",
    "options": [
      "Arachnids",
      "Insects",
      "Crustaceans",
      "Molluscs"
    ],
    "explanation": "Spiders are arachnids with four pairs of legs."
  },
  "479": {
    "text": "Which animal is a cephalopod?",
    "options": [
      "The octopus",
      "The jellyfish",
      "The starfish",
      "The crab"
    ],
    "explanation": "Cephalopods include octopuses, squid and cuttlefish."
  },
  "480": {
    "text": "Which animal class includes frogs and salamanders?",
    "options": [
      "Amphibians",
      "Reptiles",
      "Mammals",
      "Cartilaginous fish"
    ],
    "explanation": "Frogs and salamanders belong to the amphibians."
  },
  "481": {
    "text": "Which process transfers pollen to the female part of a flower?",
    "options": [
      "Pollination",
      "Germination",
      "Transpiration",
      "Fermentation"
    ],
    "explanation": "Pollination can be carried out by wind or animals."
  },
  "482": {
    "text": "Which plant tissue mainly transports water from roots to leaves?",
    "options": [
      "Xylem",
      "Phloem",
      "Only the epidermis",
      "Cork"
    ],
    "explanation": "Xylem transports water and dissolved minerals."
  },
  "483": {
    "text": "What are the small leaf pores that allow gas exchange called?",
    "options": [
      "Stomata",
      "Neurons",
      "Alveoli",
      "Villi"
    ],
    "explanation": "Stomata regulate gas exchange and some water loss."
  },
  "484": {
    "text": "Which gas is absorbed by a plant during photosynthetic carbon fixation?",
    "options": [
      "Carbon dioxide",
      "Helium",
      "Methane",
      "Neon"
    ],
    "explanation": "The carbon in the organic matter produced comes from CO₂."
  },
  "485": {
    "text": "What term describes living organisms and their environment interacting together?",
    "options": [
      "An ecosystem",
      "An organ",
      "A chromosome",
      "Only a species"
    ],
    "explanation": "An ecosystem combines a living community and its environment."
  },
  "486": {
    "text": "In a food chain, which organism is a primary producer?",
    "options": [
      "A photosynthetic alga",
      "A wolf",
      "A decomposer fungus",
      "An earthworm"
    ],
    "explanation": "Primary producers make organic matter from inorganic substances."
  },
  "487": {
    "text": "Which term describes a relationship in which an organism benefits at its host’s expense?",
    "options": [
      "Parasitism",
      "Mutualism",
      "Cooperation",
      "Only pollination"
    ],
    "explanation": "The parasite benefits while the host incurs a cost."
  },
  "488": {
    "text": "Which mechanism favours inherited traits that improve reproduction in an environment?",
    "options": [
      "Natural selection",
      "Sublimation",
      "Refraction",
      "Crystallisation"
    ],
    "explanation": "Traits that improve reproductive success can become more common."
  },
  "489": {
    "text": "Which rock mainly forms from the accumulation and consolidation of sand grains?",
    "options": [
      "Sandstone",
      "Granite",
      "Basalt",
      "Marble"
    ],
    "explanation": "Sandstone is a sedimentary rock made of cemented sand grains."
  },
  "490": {
    "text": "Marble generally results from the metamorphism of which rock?",
    "options": [
      "Limestone",
      "Granite",
      "Basalt",
      "Obsidian"
    ],
    "explanation": "Limestone recrystallises under heat and pressure."
  },
  "491": {
    "text": "Which volcanic rock is often black and glassy?",
    "options": [
      "Obsidian",
      "Chalk",
      "Sandstone",
      "Marble"
    ],
    "explanation": "Obsidian is volcanic glass formed by rapid cooling."
  },
  "492": {
    "text": "Which mineral defines hardness 10 on the Mohs scale?",
    "options": [
      "Diamond",
      "Quartz",
      "Talc",
      "Calcite"
    ],
    "explanation": "Diamond is the hardest reference mineral on this scale."
  },
  "493": {
    "text": "What is the sinking of one tectonic plate beneath another called?",
    "options": [
      "Subduction",
      "Sedimentation",
      "Sublimation",
      "Condensation"
    ],
    "explanation": "Subduction occurs at some convergent plate boundaries."
  },
  "494": {
    "text": "What is the point on the surface directly above an earthquake’s focus called?",
    "options": [
      "The epicentre",
      "Magma",
      "The ridge",
      "The mantle"
    ],
    "explanation": "The epicentre is the surface projection of the earthquake’s focus."
  },
  "495": {
    "text": "Which layer of Earth is mainly composed of iron and nickel?",
    "options": [
      "The core",
      "The continental crust",
      "The atmosphere",
      "The hydrosphere"
    ],
    "explanation": "Earth’s core is mainly metallic."
  },
  "496": {
    "text": "In which atmospheric layer does most weather occur?",
    "options": [
      "The troposphere",
      "The stratosphere",
      "The mesosphere",
      "The exosphere"
    ],
    "explanation": "The troposphere is the lowest layer and contains most atmospheric water vapour."
  },
  "497": {
    "text": "Which instrument measures wind speed?",
    "options": [
      "An anemometer",
      "A barometer",
      "A seismograph",
      "A rain gauge"
    ],
    "explanation": "An anemometer measures wind speed."
  },
  "498": {
    "text": "Which instrument measures the amount of rainfall?",
    "options": [
      "A rain gauge",
      "A hygrometer",
      "A thermometer",
      "An altimeter"
    ],
    "explanation": "A rain gauge collects precipitation to measure its depth."
  },
  "499": {
    "text": "In the water cycle, what is the change from water vapour to droplets called?",
    "options": [
      "Condensation",
      "Evaporation",
      "Melting",
      "Infiltration"
    ],
    "explanation": "Condensation forms liquid droplets from vapour."
  },
  "500": {
    "text": "Which warm ocean current follows the eastern US coast before crossing the North Atlantic?",
    "options": [
      "The Gulf Stream",
      "The Humboldt Current",
      "The Benguela Current",
      "The Labrador Current"
    ],
    "explanation": "The Gulf Stream carries warm water towards the North Atlantic."
  }
};

const additionalCapitals = Object.fromEntries(CAPITALS.map(([ , country, , city, region], index) => {
  const peers = CAPITALS.filter((fact, i) => i !== index && fact[4] === region);
  const choices = peers.length >= 3 ? peers : CAPITALS.filter((_, i) => i !== index);
  const offsets = [0, Math.floor(choices.length / 3), Math.floor(2 * choices.length / 3)];
  return [501 + index, { text: `Which of these cities is the capital of ${country}?`,
    options: [city, ...offsets.map(offset => choices[(index + offset) % choices.length][3])],
    explanation: `${city} is the capital of ${country}.` }];
}));
const additionalPairs = Object.fromEntries(PAIR_INDEXES.map(([first, second], index) => {
  const a = originalEnglish[first + 1], b = originalEnglish[second + 1];
  // The original bank stores its correct answer at index zero before shuffling.
  const answerA = a.options[0], answerB = b.options[0], wrongA = a.options[1], wrongB = b.options[1];
  return [626 + index, { text: `Two questions: 1) ${a.text} 2) ${b.text} Which answers go together, in that order?`,
    options: [`1) ${answerA} · 2) ${answerB}`, `1) ${answerA} · 2) ${wrongB}`, `1) ${wrongA} · 2) ${answerB}`, `1) ${wrongA} · 2) ${wrongB}`],
    explanation: `1) ${a.explanation} 2) ${b.explanation}` }];
}));
export const ENGLISH_QUESTIONS = { ...originalEnglish, ...additionalCapitals, ...additionalPairs };
