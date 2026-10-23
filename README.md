# THE SKYLINE PENTHOUSE

An immersive first-person 3D walkthrough of an ultra-luxury penthouse (~280 m², ceiling 3.4m) in a major city, running entirely in the browser like a high-end architectural game.

Built with **Next.js App Router**, **TypeScript**, **Tailwind CSS**, and **Three.js** via **@react-three/fiber**, **@react-three/drei**, and **@react-three/rapier**.

---

## Aesthetic & Architecture

- **Theme**: Bright, airy white and cream — ivory microcement, warm white plaster, champagne, beige, light travertine stone tiles, pale Scandinavian oak, brushed brass accents, and soft sage plants.
- **Procedural Purity**: 100% procedural code execution — zero external GLB, HDR, image, or audio files required. Instant load, zero external asset bandwidth, no external API keys or backend dependencies.
- **Physical Penthouse Shell (~280 m² + 105 m² Sky Terrace)**:
  1. **Grand Living Gallery (Main Hall)** (11m x 8m, 88 m²): Panoramic city-facing glass wall and sliding terrace access.
  2. **Kitchen & Dining Pavilion** (6.5m x 8m, 52 m²): Open entertaining layout adjacent to living room.
  3. **Private Sky Terrace & Jacuzzi** (17.5m x 6m, 105 m²): Open-air terrace with 1.2m glass railing and recessed jacuzzi/pool basin.
  4. **Gallery Hallway** (3m x 8m, 24 m²): Central connecting corridor with architectural archways.
  5. **Master Bedroom Suite** (8m x 6m, 48 m²): Far-west sanctuary with floor-to-ceiling skyline windows.
  6. **Walk-in Dressing Wardrobe** (4m x 5m, 20 m²): Dedicated dressing gallery connecting to master bath.
  7. **Master Bath & Spa** (4m x 5m, 20 m²): Luxury ensuite with travertine finishes and tub alcove.
  8. **Guest Powder Room** (3m x 3m, 9 m²): Intimate guest powder room with brass trim.
  9. **Grand Entrance Foyer** (6m x 4.5m, 27 m²): Private high-speed elevator arrival vestibule.
  10. **Guest Bedroom Suite** (7m x 4.5m, 31.5 m²): Private suite on the southeastern wing.
- **Ceiling Height**: 3.4m across all interior zones with continuous baseboards and crown molding.
- **Polished Floor Reflections**: Real-time planar floor reflections via `@react-three/drei`'s `MeshReflectorMaterial`, capturing mirrors of furniture, lighting, and panoramic windows.
- **Public Area Furnishings (Phase 3)**:
  - **Foyer**: Honed Calacatta marble console table with fluted oak base, 1.2m round brass bevel wall mirror, fluted shoe cabinet credenza with potted plant, and modernist bronze ribbon sculpture on a fluted travertine pedestal.
  - **Living Room**: Large ivory bouclé L-shaped sectional sofa with scatter pillows and cashmere blanket, nested travertine and brass coffee table with art monographs and floral vase, two curved bouclé accent armchairs, 85" OLED TV feature wall with floating media console and glowing linear fireplace, white lacquer grand piano, plush textured area rug, 5-tier brass & oak bookshelves with detailed books and ceramic vessels, indoor potted tree, and arched brass floor lamp.
  - **Kitchen & Dining**: 3.6m Calacatta Gold waterfall marble island with undermount sink, brass gooseneck faucet, flush induction cooktop, 4 bouclé bar stools, trio of brass pendant globes, full-height pale oak cabinetry with built-in oven and fridge, grand 8-seater travertine dining table with full luxury place settings (gold chargers, porcelain dinnerware, linen napkins, crystal stemware, cutlery), centerpiece fruit bowl, and backlit glass-front wine display wall.
- **Interactive Door System**:
  - Reusable `<Door>` component supporting hinged swing doors and sliding glass doors.
  - Rapier kinematic colliders that update seamlessly when doors open or close.
  - Camera center raycast detection (2.4m range): crosshair expands with prompt `"[E] Open door"`.
- **Navigation & Teleportation**:
  - Tactical SVG **Mini-Map** in the bottom-left with player position dot and real-time vision cone.
  - **Room Banner** that fades in smoothly upon entering new rooms.
  - **Directory / Fast Travel** with smooth cinematic fade-to-black transitions.
  - Default spawn in the Grand Living Gallery facing the skyline windows.

---

## Getting Started Locally

### 1. Prerequisites
- **Node.js**: `v18.18+` or `v20+` / `v22+` / `v24+`
- **npm**: `v9+` or `v10+` / `v11+`

### 2. Installation
```bash
git clone https://github.com/satetapongsa/penthouse.git
cd penthouse
npm install
```

### 3. Development Server
Run the local Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your WebGL-capable browser.

### 4. Production Build & Verification
To test the production build locally:
```bash
npm run build
npm run start
```

---

## Controls

### Desktop Controls
| Input | Action |
|---|---|
| **W, A, S, D** / **Arrow Keys** | Walk / Move horizontally |
| **Mouse Look** | Rotate camera (Pointer Lock) |
| **E Key** / **Left Click** | Interact / Open & Close Doors |
| **Shift** (Hold) | Sprint with dynamic FOV kick |
| **Spacebar** | Jump / Step-up |
| **C Key** | Crouch (lowers eye level to 1.0m) |
| **Esc Key** | Pause Walkthrough & open menu |

### Mobile Touch Controls
| Control | Action |
|---|---|
| **Left Half of Screen** | Floating Virtual Analog Joystick for movement |
| **Right Half of Screen** | Drag / Swipe to look around |
| **Action Button** (Sparkles) | Open & Close Doors / Interact |
| **Jump Button** (Arrow Up) | Jump |
| **Crouch Button** (Arrow Down) | Toggle Crouch |
| **Sprint Button** (Flame) | Sprint |
| **Pause Button** (Top Right) | Open Pause & Settings Menu |

---

## Vercel Deployment

This project is built and optimized for seamless zero-configuration deployment on **Vercel**:

### Option A: Deploy via GitHub (Recommended)
1. Push this repository to GitHub:
   ```bash
   git push -u origin main
   ```
2. Go to the [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New Project"**.
3. Import the `penthouse` repository from your GitHub account.
4. Framework Preset will automatically detect **Next.js**.
5. Build Command: `npm run build`
6. Output Directory: `.next`
7. Click **"Deploy"**.

### Option B: Deploy via Vercel CLI
```bash
npm i -g vercel
vercel
```

---

## Project Structure

```
├── app/
│   ├── globals.css           # Global Tailwind CSS and luxury theme variables
│   ├── layout.tsx            # Root layout with Cormorant Garamond & Inter fonts
│   └── page.tsx              # Main entry page mounting PenthouseExperience
├── components/
│   ├── canvas/
│   │   └── PenthouseCanvas.tsx # WebGL R3F Canvas with Rapier physics engine
│   ├── doors/
│   │   └── Door.tsx           # Reusable hinged and sliding door with kinematic colliders
│   ├── furniture/
│   │   ├── foyer/
│   │   │   └── FoyerFurniture.tsx # Console table, brass mirror, shoe cabinet, art piece
│   │   ├── living/
│   │   │   └── LivingFurniture.tsx# Sectional sofa, coffee table, armchairs, TV wall, piano
│   │   └── kitchen/
│   │       └── KitchenDiningFurniture.tsx # Marble island, bar stools, dining set, wine wall
│   ├── interaction/
│   │   └── InteractionManager.tsx # Raycaster interaction detection system
│   ├── intro/
│   │   └── IntroOverlay.tsx   # Cinematic title, loading bar & controls guide
│   ├── mobile/
│   │   └── MobileControls.tsx # Touch joystick, touch-drag look & action buttons
│   ├── navigation/
│   │   ├── MiniMap.tsx        # Bottom-left SVG tactical floor plan & vision cone
│   │   ├── RoomBanner.tsx     # Top room label banner that fades in on entry
│   │   └── TeleportMenu.tsx   # Fast travel directory with fade-to-black overlay
│   ├── player/
│   │   └── Player.tsx         # Rapier capsule physics, camera sync, head bob & crouch
│   ├── room/
│   │   └── PenthouseShell.tsx # Full 10-room architectural layout, reflective floor, terrace
│   ├── ui/
│   │   └── HUD.tsx            # Dynamic crosshair dot, pause menu & WebGL fallback modal
│   └── PenthouseExperience.tsx# Dynamic client orchestrator (SSR: false)
├── hooks/
│   ├── useDeviceDetect.ts     # Touch device auto-detection hook
│   └── useKeyboardControls.ts # Desktop keyboard event listener & pause binder
├── lib/
│   ├── config.ts              # Single source of truth for architectural dimensions
│   └── materials.ts           # Procedural canvas textures (Calacatta, oak, bouclé, books)
├── store/
│   └── useGameStore.ts        # Zustand store for game state, device, and controls
├── next.config.mjs            # Next.js transpile packages configuration
├── tailwind.config.ts         # Tailwind CSS luxury theme palette configuration
├── tsconfig.json              # TypeScript compiler configuration
└── package.json               # Dependencies and build scripts
```

---

## License

Private & Proprietary — The Skyline Penthouse Architectural Walkthrough.
