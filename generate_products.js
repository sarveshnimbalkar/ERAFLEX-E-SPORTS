const fs = require('fs');

const FOOTBALL_TEAMS = ["Real Madrid CF", "Arsenal FC", "FC Barcelona", "Manchester United", "Bayern Munich", "PSG", "Juventus", "AC Milan", "Liverpool FC", "Chelsea FC", "Manchester City", "Inter Milan", "Borussia Dortmund", "Atletico Madrid", "Tottenham Hotspur", "Napoli", "AS Roma", "Ajax", "Benfica", "Bayer Leverkusen", "Aston Villa", "Newcastle", "Sporting CP", "Porto", "Marseille"];

const BASKETBALL_TEAMS = ["LA Lakers", "Golden State Warriors", "Chicago Bulls", "Boston Celtics", "Miami Heat", "Brooklyn Nets", "Milwaukee Bucks", "Phoenix Suns", "Philadelphia 76ers", "Dallas Mavericks", "Denver Nuggets", "LA Clippers", "New York Knicks", "Toronto Raptors", "Houston Rockets", "San Antonio Spurs", "Cleveland Cavaliers", "Atlanta Hawks", "Memphis Grizzlies", "New Orleans Pelicans", "Sacramento Kings", "Minnesota Timberwolves", "Utah Jazz", "Indiana Pacers", "Oklahoma City Thunder"];

const CRICKET_TEAMS = ["Team India", "Australia", "England", "New Zealand", "South Africa", "Pakistan", "Sri Lanka", "West Indies", "Bangladesh", "Afghanistan", "Chennai Super Kings", "Mumbai Indians", "Royal Challengers Bangalore", "Kolkata Knight Riders", "Delhi Capitals", "Rajasthan Royals", "Sunrisers Hyderabad", "Punjab Kings", "Gujarat Titans", "Lucknow Super Giants", "Sydney Sixers", "Perth Scorchers", "Melbourne Stars", "Hobart Hurricanes", "Brisbane Heat"];

const FOOTBALL_IMAGES = [
  "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600",
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600",
  "https://images.unsplash.com/photo-1431324155629-1a6eda1eedfa?w=600",
  "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=600",
  "https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=600",
  "https://images.unsplash.com/photo-1541534741688-6078c64b5913?w=600"
];

const BASKETBALL_IMAGES = [
  "https://images.unsplash.com/photo-1515523110800-9415d13b84a8?w=600",
  "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600",
  "https://images.unsplash.com/photo-1627627256672-027a4613fffc?w=600",
  "https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?w=600",
  "https://images.unsplash.com/photo-1628891435222-06592e1bb3b5?w=600"
];

const CRICKET_IMAGES = [
  "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600",
  "https://images.unsplash.com/photo-1540126034813-121bf29033d2?w=600",
  "https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=600",
  "https://images.unsplash.com/photo-1624526267942-ab0f0b0ed2bc?w=600"
];

const prices = [2999, 3499, 3999, 4499, 4999, 5499, 5999];
let output = `import type { Product } from "@/types";\n\nexport const PRODUCTS: Product[] = [\n`;

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

FOOTBALL_TEAMS.forEach((team, index) => {
  output += `  {
    id: "fb-${index + 1}",
    name: "${team} Home Kit 24/25",
    team: "${team}",
    price: ${getRandomElement(prices)},
    image: "${getRandomElement(FOOTBALL_IMAGES)}",
    category: "football",
    sport: "football",
    description: "Premium elite performance kit for ${team}.",
    stock: ${Math.floor(Math.random() * 100) + 10},
    rating: ${(Math.random() * 1 + 4).toFixed(1)},
  },\n`;
});

BASKETBALL_TEAMS.forEach((team, index) => {
  output += `  {
    id: "bk-${index + 1}",
    name: "${team} Icon Edition",
    team: "${team}",
    price: ${getRandomElement(prices)},
    image: "${getRandomElement(BASKETBALL_IMAGES)}",
    category: "basketball",
    sport: "basketball",
    description: "Iconic authentic jersey for ${team}.",
    stock: ${Math.floor(Math.random() * 100) + 10},
    rating: ${(Math.random() * 1 + 4).toFixed(1)},
  },\n`;
});

CRICKET_TEAMS.forEach((team, index) => {
  output += `  {
    id: "cr-${index + 1}",
    name: "${team} Official Jersey",
    team: "${team}",
    price: ${getRandomElement(prices)},
    image: "${getRandomElement(CRICKET_IMAGES)}",
    category: "cricket",
    sport: "cricket",
    description: "Authentic match-day jersey for ${team}.",
    stock: ${Math.floor(Math.random() * 100) + 10},
    rating: ${(Math.random() * 1 + 4).toFixed(1)},
  },\n`;
});

output += `];\n`;

fs.mkdirSync('src/lib/data', { recursive: true });
fs.writeFileSync('src/lib/data/products.ts', output);
console.log('src/lib/data/products.ts created successfully.');
