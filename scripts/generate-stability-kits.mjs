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
const keyMatch = envContent.match(/STABILITY_API_KEY="?([^"\n]+)"?/);
const apiKey = keyMatch ? keyMatch[1].trim() : null;

if (!apiKey) {
  console.error("No STABILITY_API_KEY found in .env.local");
  process.exit(1);
}

// Read products.ts
const productsPath = path.join(rootDir, 'src', 'lib', 'data', 'products.ts');
const productsCode = fs.readFileSync(productsPath, 'utf-8');

const products = [];
// Regex to extract id, team, sport, image
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

console.log(`Ready to generate images for ${products.length} products.`);

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function processAll() {
  // Resuming from [53/75] where the previous key failed
  for (let i = 52; i < products.length; i++) {
    const product = products[i];
    console.log(`[${i + 1}/${products.length}] Generating image for ${product.id}: ${product.team} (${product.sport})...`);
    
    // Custom prompt to match the AC Milan "jersey on hanger" reference style exactly
    const prompt = `A highly detailed, photorealistic e-commerce product photograph of the 2024 ${product.team} ${product.sport} jersey. The jersey is photographed perfectly straight and centered, cleanly hanging from a premium wooden clothes hanger with a small round black tag on the metal hook. The background is a perfectly flat, completely solid dark studio grey. Professional studio softbox lighting, highly detailed fabric texture, masterpiece, sharp focus, neutral background, centered framing.`;

    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('negative_prompt', 'human, person, limbs, face, mannequin, body, text, watermark, messy, uneven, cropped, cutoff, blurry, wrinkled, sloppy');
    
    // Set output format based on the database filename
    const ext = product.image.endsWith('.jpg') ? 'jpeg' : 'png';
    formData.append('output_format', ext);
    formData.append('aspect_ratio', '4:5'); // Match the new CSS!

    try {
      const response = await fetch("https://api.stability.ai/v2beta/stable-image/generate/core", {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "image/*"
        },
        body: formData,
      });

      if (response.ok) {
        const buffer = await response.arrayBuffer();
        
        // Write the new image over the old one
        const outputPath = path.join(rootDir, 'public', product.image.replace(/^\//, ''));
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        
        fs.writeFileSync(outputPath, Buffer.from(buffer));
        console.log(`  ✓ Saved to ${product.image}`);
      } else {
        const errText = await response.text();
        console.error(`  X Failed: ${response.status} ${errText}`);
      }
      
      // Prevent hitting rate limits (Stability core usually allows decent concurrency, but 1s delay is safe)
      await delay(1500);
      
    } catch (error) {
       console.error(`  X Error:`, error.message);
       await delay(2000);
    }
  }
  console.log("Generation sweep completed!");
}

processAll();
