const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('No .env.local found. Skipping env sync.');
  process.exit(0);
}

const envFile = fs.readFileSync(envPath, 'utf8');
const lines = envFile.split('\n');

console.log('Syncing .env.local values to Vercel Production Environment...');

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;

  // Split by first equals sign
  const idx = trimmed.indexOf('=');
  if (idx === -1) continue;

  const key = trimmed.slice(0, idx).trim();
  let value = trimmed.slice(idx + 1).trim();

  // Remove surrounding quotes if they exist
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }

  console.log(`Setting secret: ${key}`);
  try {
    // Vercel CLI removes secrets interactively or securely via stdin stream
    execSync(`npx vercel env add ${key} production`, {
      input: value,
      stdio: ['pipe', 'ignore', 'ignore'] // pipe input directly to stdin
    });
    console.log(` ✅ ${key} successfully mapped to exactly production environment.`);
  } catch (err) {
    console.log(` ⚠️ Failed to set ${key}. It may already exist or require confirmation.`);
  }
}

console.log('✅ Environment synchronization complete!');
