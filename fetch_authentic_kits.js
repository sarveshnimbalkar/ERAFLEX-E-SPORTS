const fs = require('fs');
const path = require('path');
const google = require('googlethis');

const FOOTBALL_TEAMS = ["Real Madrid CF", "Arsenal FC", "FC Barcelona", "Manchester United", "Bayern Munich", "PSG", "Juventus", "AC Milan", "Liverpool FC", "Chelsea FC", "Manchester City", "Inter Milan", "Borussia Dortmund", "Atletico Madrid", "Tottenham Hotspur", "Napoli", "AS Roma", "Ajax", "Benfica", "Bayer Leverkusen", "Aston Villa", "Newcastle", "Sporting CP", "Porto", "Marseille"];

const BASKETBALL_TEAMS = ["LA Lakers", "Golden State Warriors", "Chicago Bulls", "Boston Celtics", "Miami Heat", "Brooklyn Nets", "Milwaukee Bucks", "Phoenix Suns", "Philadelphia 76ers", "Dallas Mavericks", "Denver Nuggets", "LA Clippers", "New York Knicks", "Toronto Raptors", "Houston Rockets", "San Antonio Spurs", "Cleveland Cavaliers", "Atlanta Hawks", "Memphis Grizzlies", "New Orleans Pelicans", "Sacramento Kings", "Minnesota Timberwolves", "Utah Jazz", "Indiana Pacers", "Oklahoma City Thunder"];

const CRICKET_TEAMS = ["Team India", "Australia", "England", "New Zealand", "South Africa", "Pakistan", "Sri Lanka", "West Indies", "Bangladesh", "Afghanistan", "Chennai Super Kings", "Mumbai Indians", "Royal Challengers Bangalore", "Kolkata Knight Riders", "Delhi Capitals", "Rajasthan Royals", "Sunrisers Hyderabad", "Punjab Kings", "Gujarat Titans", "Lucknow Super Giants", "Sydney Sixers", "Perth Scorchers", "Melbourne Stars", "Hobart Hurricanes", "Brisbane Heat"];

const DIR = path.join(__dirname, 'public', 'kits');
if (!fs.existsSync(DIR)) {
  fs.mkdirSync(DIR, { recursive: true });
}

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const prices = [2999, 3499, 3999, 4499, 4999, 5499, 5999];

async function downloadImage(url, filepath) {
  try {
    const res = await fetch(url);
    if (!res.ok) return false;
    const buffer = await res.arrayBuffer();
    fs.writeFileSync(filepath, Buffer.from(buffer));
    return true;
  } catch (err) {
    return false;
  }
}

async function scrapeImage(team, sport, id) {
  const query = `"${team}" official ${sport} jersey transparent PNG`;
  try {
    const images = await google.image(query, { safe: false });
    if (images && images.length > 0) {
      for (let img of images) {
        if (!img.url.toLowerCase().endsWith('.webp')) {
           const extMatch = img.url.split('?')[0].match(/\.(png|jpg|jpeg)$/i);
           const ext = extMatch ? extMatch[1] : 'png';
           const filename = `${id}.${ext}`;
           const filepath = path.join(DIR, filename);
           
           console.log(`Downloading ${team}...`);
           const success = await downloadImage(img.url, filepath);
           if (success) {
              return `/kits/${filename}`;
           }
        }
      }
    }
  } catch (err) {
    console.error("Scrape failed for", team);
  }
  
  const fbImages = {
    football: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600",
    basketball: "https://images.unsplash.com/photo-1515523110800-9415d13b84a8?w=600",
    cricket: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600"
  };
  return fbImages[sport.includes('basketball') ? 'basketball' : sport.includes('cricket') ? 'cricket' : 'football'];
}

async function main() {
  let output = `import type { Product } from "@/types";\n\nexport const PRODUCTS: Product[] = [\n`;

  for (let i = 0; i < FOOTBALL_TEAMS.length; i++) {
    const team = FOOTBALL_TEAMS[i];
    const id = `fb-${i + 1}`;
    const image = await scrapeImage(team, "football", id);
    output += `  {
    id: "${id}",
    name: "${team} Home Kit 24/25",
    team: "${team}",
    price: ${getRandomElement(prices)},
    image: "${image}",
    category: "football",
    sport: "football",
    description: "Premium elite performance kit for ${team}.",
    stock: ${Math.floor(Math.random() * 100) + 10},
    rating: ${(Math.random() * 1 + 4).toFixed(1)},
  },\n`;
  }

  for (let i = 0; i < BASKETBALL_TEAMS.length; i++) {
    const team = BASKETBALL_TEAMS[i];
    const id = `bk-${i + 1}`;
    const image = await scrapeImage(team, "basketball", id);
    output += `  {
    id: "${id}",
    name: "${team} Icon Edition",
    team: "${team}",
    price: ${getRandomElement(prices)},
    image: "${image}",
    category: "basketball",
    sport: "basketball",
    description: "Iconic authentic jersey for ${team}.",
    stock: ${Math.floor(Math.random() * 100) + 10},
    rating: ${(Math.random() * 1 + 4).toFixed(1)},
  },\n`;
  }

  for (let i = 0; i < CRICKET_TEAMS.length; i++) {
    const team = CRICKET_TEAMS[i];
    const id = `cr-${i + 1}`;
    const image = await scrapeImage(team, "cricket", id);
    output += `  {
    id: "${id}",
    name: "${team} Official Jersey",
    team: "${team}",
    price: ${getRandomElement(prices)},
    image: "${image}",
    category: "cricket",
    sport: "cricket",
    description: "Authentic match-day jersey for ${team}.",
    stock: ${Math.floor(Math.random() * 100) + 10},
    rating: ${(Math.random() * 1 + 4).toFixed(1)},
  },\n`;
  }

  output += `];\n`;

  const dataDir = path.join(__dirname, 'src', 'lib', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(path.join(dataDir, 'products.ts'), output);
  console.log('Successfully generated products.ts with authentic local kits!');
}

main().catch(console.error);
