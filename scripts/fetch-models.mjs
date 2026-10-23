// scripts/fetch-models.mjs
// Downloads CC0 3D models from Poly Haven at 1k texture resolution

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RAW_DIR = path.resolve(__dirname, 'raw-models');
const PUBLIC_MODELS_DIR = path.resolve(__dirname, '..', 'public', 'models');

// Curated luxury candidate models fitting the bright ivory, cream, travertine, and brass aesthetic
export const SELECTED_MODELS = [
  { id: 'modern_arm_chair_01', name: 'Modern Armchair 01', category: 'furniture', propType: 'furniture' },
  { id: 'modern_coffee_table_01', name: 'Modern Coffee Table 01', category: 'furniture', propType: 'furniture' },
  { id: 'side_table_01', name: 'Side Table 01', category: 'furniture', propType: 'furniture' },
  { id: 'dining_chair_02', name: 'Dining Chair 02', category: 'furniture', propType: 'furniture' },
  { id: 'bar_chair_round_01', name: 'Round Bar Chair 01', category: 'furniture', propType: 'furniture' },
  { id: 'modern_ceiling_lamp_01', name: 'Modern Ceiling Lamp 01', category: 'lighting', propType: 'prop' },
  { id: 'potted_plant_01', name: 'Potted Plant 01', category: 'plants', propType: 'prop' },
  { id: 'potted_plant_04', name: 'Potted Plant 04 (Succulent)', category: 'plants', propType: 'small_prop' },
  { id: 'ceramic_vase_01', name: 'Ceramic Vase 01', category: 'decor', propType: 'small_prop' },
  { id: 'brass_vase_01', name: 'Brass Vase 01', category: 'decor', propType: 'small_prop' },
  { id: 'marble_bust_01', name: 'Marble Bust 01', category: 'decor', propType: 'prop' },
  { id: 'book_encyclopedia_set_01', name: 'Encyclopedia Book Set 01', category: 'decor', propType: 'small_prop' },
  { id: 'food_apple_01', name: 'Apple 01', category: 'kitchen', propType: 'small_prop' },
  { id: 'food_pears_asian_01', name: 'Asian Pears 01', category: 'kitchen', propType: 'small_prop' },
  { id: 'wine_bottles_01', name: 'Wine Bottles 01', category: 'kitchen', propType: 'prop' },
  { id: 'brass_candleholders', name: 'Brass Candleholders', category: 'decor', propType: 'small_prop' },
  { id: 'ornate_mirror_01', name: 'Ornate Mirror 01', category: 'decor', propType: 'prop' },
  { id: 'brass_diya_lantern', name: 'Brass Diya Lantern', category: 'lighting', propType: 'small_prop' }
];

async function downloadFile(url, destPath) {
  const dir = path.dirname(destPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download ${url}: status ${res.status}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  fs.writeFileSync(destPath, Buffer.from(arrayBuffer));
}

async function fetchAsset(model) {
  const { id } = model;
  const assetDir = path.join(RAW_DIR, id);
  const gltfFile = path.join(assetDir, `${id}.gltf`);

  if (fs.existsSync(gltfFile)) {
    console.log(`[Cache] ${id} already downloaded`);
    return;
  }

  console.log(`[Fetching] Querying Poly Haven API for: ${id}...`);
  const apiUrl = `https://api.polyhaven.com/files/${id}`;
  const res = await fetch(apiUrl);
  if (!res.ok) {
    throw new Error(`API error fetching ${apiUrl}: ${res.status}`);
  }
  const data = await res.json();
  const gltfEntry = data?.gltf?.['1k']?.gltf;
  if (!gltfEntry || !gltfEntry.url) {
    throw new Error(`Model ${id} has no 1k glTF available!`);
  }

  fs.mkdirSync(assetDir, { recursive: true });

  // Download main .gltf
  console.log(`[Downloading] ${id}.gltf from ${gltfEntry.url}`);
  await downloadFile(gltfEntry.url, gltfFile);

  // Download included files (.bin and textures)
  const includes = gltfEntry.include || {};
  for (const [relPath, incMeta] of Object.entries(includes)) {
    const incUrl = typeof incMeta === 'string' ? incMeta : incMeta.url;
    if (incUrl) {
      const dest = path.join(assetDir, relPath);
      await downloadFile(incUrl, dest);
    }
  }

  console.log(`[Done] ${id} downloaded successfully`);
}

function generateCredits() {
  if (!fs.existsSync(PUBLIC_MODELS_DIR)) {
    fs.mkdirSync(PUBLIC_MODELS_DIR, { recursive: true });
  }

  const lines = [
    '# 3D Model Credits',
    '',
    'All 3D models used in "THE SKYLINE PENTHOUSE" are sourced from [Poly Haven](https://polyhaven.com/) and licensed under **Creative Commons 0 (CC0) / Public Domain**.',
    '',
    '| Model Name | Category | Poly Haven Asset URL | License |',
    '| :--- | :--- | :--- | :--- |'
  ];

  for (const m of SELECTED_MODELS) {
    lines.push(`| ${m.name} | ${m.category} | [https://polyhaven.com/a/${m.id}](https://polyhaven.com/a/${m.id}) | CC0 |`);
  }

  lines.push('');
  lines.push('Models have been optimized for real-time web performance using `@gltf-transform/cli` with WebP textures and `meshopt` geometry compression.');

  const creditsPath = path.join(PUBLIC_MODELS_DIR, 'CREDITS.md');
  fs.writeFileSync(creditsPath, lines.join('\n'), 'utf8');
  console.log(`[Credits] Written to ${creditsPath}`);
}

async function main() {
  console.log('=== THE SKYLINE PENTHOUSE - MODEL FETCHER ===');
  console.log(`Total models to fetch: ${SELECTED_MODELS.length}`);

  for (const model of SELECTED_MODELS) {
    try {
      await fetchAsset(model);
    } catch (err) {
      console.error(`Failed to fetch ${model.id}:`, err.message);
      process.exit(1);
    }
  }

  generateCredits();
  console.log('=== All models fetched and CREDITS.md generated ===');
}

main();
