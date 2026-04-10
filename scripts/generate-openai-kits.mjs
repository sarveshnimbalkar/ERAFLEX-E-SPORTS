import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Load env explicitly
const envPath = path.join(rootDir, '.env.local');
if (!fs.existsSync(envPath)) {
  console.error("Missing .env.local file");
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf-8');
const keyMatch = envContent.match(/OPENAI_API_KEY="?([^"\n]+)"?/);
const apiKey = keyMatch ? keyMatch[1].trim() : null;

if (!apiKey) {
  console.error("No OPENAI_API_KEY found in .env.local");
  process.exit(1);
}

// Read products.ts
const productsPath = path.join(rootDir, 'src', 'lib', 'data', 'products.ts');
const productsCode = fs.readFileSync(productsPath, 'utf-8');

const products = [];
const regex = /id:\s*"([^"]+)",[\s\S]*?team:\s*"([^"]+)",[\s\S]*?image:\s*"([^"]+)",[\s\S]*?sport:\s*"([^"]+)"/g;
let match;
while ((match = regex.exec(productsCode)) !== null) {
  products.push({
    id: match[1],
    team: match[2],
    image: match[3],
    sport: match[4]
  });
}

console.log(`Ready to finish remaining final 27 images using OpenAI (DALL-E 3).`);

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function processAll() {
  // Start from bk-24 (index 48) where Stability AI failed
  for (let i = 48; i < products.length; i++) {
    const product = products[i];
    console.log(`[${i + 1}/${products.length}] Generating via OpenAI for ${product.id}: ${product.team} (${product.sport})...`);

    // Exact prompt style logic matching what we used in the CSS framework
    const prompt = `A highly detailed, photorealistic e-commerce product photograph of the 2024 ${product.team} ${product.sport} jersey. The jersey is photographed perfectly straight and centered, cleanly hanging from a premium wooden clothes hanger with a small round black tag on the metal hook. The background is a perfectly flat, completely solid dark studio grey. Professional studio softbox lighting, highly detailed fabric texture, masterpiece, sharp focus, neutral background, centered framing.`;

    try {
      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: "1024x1024",
          response_format: "b64_json"
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const base64Data = data.data[0].b64_json;

        // Write the new image over the old one
        const outputPath = path.join(rootDir, 'public', product.image.replace(/^\//, ''));
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });

        fs.writeFileSync(outputPath, Buffer.from(base64Data, 'base64'));
        console.log(`  ✓ Saved to ${product.image}`);
      } else {
        const errText = await response.text();
        console.error(`  X Failed: ${response.status} ${errText}`);
      }

      // Prevent hitting OpenAI rate limits
      await delay(12000); // 12 seconds per image to safely stay under DALL-E 3 Tier 1 limits

    } catch (error) {
      console.error(`  X Error:`, error.message);
      await delay(12000);
    }
  }
  console.log("OpenAI Generation sweep completed!");
}

processAll();
