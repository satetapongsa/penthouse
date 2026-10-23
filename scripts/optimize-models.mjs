// scripts/optimize-models.mjs
// Optimizes downloaded GLTF models using @gltf-transform/cli
// Runs: dedup, prune, weld, simplify (<8k tris for furniture, <3k for props),
// texture resize (512-1024 for furniture, 256-512 for small props), convert to WebP, meshopt compress.
// Generates before/after comparison table of triangles and file sizes.

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { SELECTED_MODELS } from './fetch-models.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RAW_DIR = path.resolve(__dirname, 'raw-models');
const OUTPUT_DIR = path.resolve(__dirname, '..', 'public', 'models');

function getFileSizeKb(filePath) {
  if (!fs.existsSync(filePath)) return 0;
  return Math.round(fs.statSync(filePath).size / 1024);
}

function getRawFolderSizeKb(folderPath) {
  if (!fs.existsSync(folderPath)) return 0;
  let total = 0;
  function walk(p) {
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      for (const item of fs.readdirSync(p)) {
        walk(path.join(p, item));
      }
    } else {
      total += stat.size;
    }
  }
  walk(folderPath);
  return Math.round(total / 1024);
}

function getModelTriangles(modelPath) {
  try {
    const md = execSync(`npx gltf-transform inspect "${modelPath}" --format md`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    const match = md.match(/MESHES[\s\S]*?(\n\|[^\n]+\|\s*\n\|[^\n]+\|\s*\n([\s\S]*?))\n\s*\n/);
    let totalTris = 0;
    if (match && match[2]) {
      const rows = match[2].trim().split('\n');
      for (const row of rows) {
        const cols = row.split('|').map(c => c.trim()).filter(Boolean);
        const tris = parseInt((cols[4] || '0').replace(/,/g, ''), 10);
        if (!isNaN(tris)) totalTris += tris;
      }
    }
    return totalTris;
  } catch {
    return 0;
  }
}

// Tailored optimization parameters to strictly meet all budgets:
// - Furniture: < 8,000 tris, < 400 KB
// - Props / Small props: < 3,000 tris, < 150 KB
const OPT_CONFIG = {
  modern_arm_chair_01: { textureSize: 1024, simplifyRatio: 0.15, simplifyError: 0.005 },
  modern_coffee_table_01: { textureSize: 1024, simplifyRatio: 0.2, simplifyError: 0.005 },
  side_table_01: { textureSize: 1024, simplifyRatio: 0.25, simplifyError: 0.005 },
  dining_chair_02: { textureSize: 1024, simplifyRatio: 0.15, simplifyError: 0.005 },
  bar_chair_round_01: { textureSize: 512, simplifyRatio: 0.08, simplifyError: 0.005 },
  modern_ceiling_lamp_01: { textureSize: 512, simplifyRatio: 0.15, simplifyError: 0.005 },
  potted_plant_01: { textureSize: 512, simplifyRatio: 0.03, simplifyError: 0.01 },
  potted_plant_04: { textureSize: 256, simplifyRatio: 0.08, simplifyError: 0.005 },
  ceramic_vase_01: { textureSize: 512, simplifyRatio: 0.1, simplifyError: 0.005 },
  brass_vase_01: { textureSize: 256, simplifyRatio: 0.08, simplifyError: 0.005 },
  marble_bust_01: { textureSize: 1024, simplifyRatio: 0.12, simplifyError: 0.005 },
  book_encyclopedia_set_01: { textureSize: 256, simplifyRatio: 0.05, simplifyError: 0.005 },
  food_apple_01: { textureSize: 512, simplifyRatio: 0.08, simplifyError: 0.005 },
  food_pears_asian_01: { textureSize: 512, simplifyRatio: 0.08, simplifyError: 0.005 },
  wine_bottles_01: { textureSize: 512, simplifyRatio: 0.05, simplifyError: 0.005 },
  brass_candleholders: { textureSize: 256, simplifyRatio: 0.02, simplifyError: 0.008 },
  ornate_mirror_01: { textureSize: 1024, simplifyRatio: 0.15, simplifyError: 0.005 },
  brass_diya_lantern: { textureSize: 256, simplifyRatio: 0.08, simplifyError: 0.005 },
};

async function main() {
  console.log('=== THE SKYLINE PENTHOUSE - GLTF OPTIMIZATION PIPELINE ===\n');

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const results = [];

  for (const model of SELECTED_MODELS) {
    const { id, name, propType } = model;
    const inputGltf = path.join(RAW_DIR, id, `${id}.gltf`);
    const outputGlb = path.join(OUTPUT_DIR, `${id}.glb`);

    if (!fs.existsSync(inputGltf)) {
      console.warn(`[Skip] Raw file not found: ${inputGltf}`);
      continue;
    }

    console.log(`Optimizing: ${name} (${id}) [${propType}]...`);

    const rawFolder = path.join(RAW_DIR, id);
    const rawSizeKb = getRawFolderSizeKb(rawFolder);
    const rawTris = getModelTriangles(inputGltf);

    const cfg = OPT_CONFIG[id] || { textureSize: 512, simplifyRatio: 0.1, simplifyError: 0.005 };

    // Run gltf-transform optimize
    const optCmd = `npx gltf-transform optimize "${inputGltf}" "${outputGlb}" --texture-compress webp --texture-size ${cfg.textureSize} --compress meshopt --simplify-ratio ${cfg.simplifyRatio} --simplify-error ${cfg.simplifyError}`;
    try {
      execSync(optCmd, { stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8' });
    } catch (err) {
      console.error(`Error optimizing ${id}:`, err.message);
      continue;
    }

    const optSizeKb = getFileSizeKb(outputGlb);
    const optTris = getModelTriangles(outputGlb);

    console.log(`  ✓ Raw: ${rawTris} tris, ${rawSizeKb} KB  -->  Opt: ${optTris} tris, ${optSizeKb} KB`);

    results.push({
      id,
      name,
      propType,
      rawTris,
      optTris,
      rawSizeKb,
      optSizeKb
    });
  }

  console.log('\n=================== FINAL OPTIMIZATION TABLE ===================');
  console.log('| Model Name | Prop Type | Raw Tris | Opt Tris | Raw Size | Opt Size | Reduction |');
  console.log('| :--- | :--- | :--- | :--- | :--- | :--- | :--- |');

  let totalRawKb = 0;
  let totalOptKb = 0;

  for (const r of results) {
    totalRawKb += r.rawSizeKb;
    totalOptKb += r.optSizeKb;
    const ratio = Math.round((1 - r.optSizeKb / (r.rawSizeKb || 1)) * 100);
    console.log(`| ${r.name} | ${r.propType} | ${r.rawTris} | ${r.optTris} | ${r.rawSizeKb} KB | ${r.optSizeKb} KB | -${ratio}% |`);
  }

  const totalMb = (totalOptKb / 1024).toFixed(2);
  console.log('================================================================');
  console.log(`Total Models: ${results.length}`);
  console.log(`Total Bundle Size: ${totalOptKb} KB (~${totalMb} MB) [Target < 15 MB: ${totalOptKb < 15360 ? 'PASS' : 'FAIL'}]`);
  console.log('================================================================\n');
}

main();
