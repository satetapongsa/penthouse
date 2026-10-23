# THE SKYLINE PENTHOUSE

An immersive first-person 3D walkthrough of an ultra-luxury penthouse (~280 m², ceiling 3.4m) in a major city, running entirely in the browser like a high-end architectural game.

Built with **Next.js App Router**, **TypeScript**, **Tailwind CSS**, and **Three.js** via **@react-three/fiber**, **@react-three/drei**, and **@react-three/rapier**.

---

## Aesthetic & Architecture

- **Theme**: Bright, airy white and cream — ivory microcement, warm white plaster, champagne, beige, light travertine stone tiles, pale Scandinavian oak, brushed brass accents, and soft sage plants.
- **Procedural Purity**: 100% procedural code execution — zero external GLB, HDR, image, or audio files required. Instant load, zero external asset bandwidth, no external API keys or backend dependencies.
- **Physics & Navigation**: First-person capsule collider powered by Rapier 3D WebAssembly physics, subtle organic head-bobbing, sprint FOV acceleration kick, smooth crouch height adjustment, step-up physics, and fall-safe boundaries.
- **Responsive Navigation**: Full desktop PointerLock mouse look + keyboard (WASD / Shift / Space / C / Esc) and automatic mobile touch detection with a custom floating virtual joystick, touch-drag look, jump, crouch, and action buttons.
- **Single Source of Truth**: All room dimensions, wall thicknesses, and door coordinates are unified in `/lib/config.ts`.

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
| **Shift** (Hold) | Sprint with dynamic FOV kick |
| **Spacebar** | Jump / Step-up |
| **C Key** | Crouch (lowers eye level to 1.0m) |
| **Esc Key** | Pause Walkthrough & open menu |

### Mobile Touch Controls
| Control | Action |
|---|---|
| **Left Half of Screen** | Floating Virtual Analog Joystick for movement |
| **Right Half of Screen** | Drag / Swipe to look around |
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
│   ├── intro/
│   │   └── IntroOverlay.tsx   # Cinematic title, loading bar & controls guide
│   ├── mobile/
│   │   └── MobileControls.tsx # Touch joystick, touch-drag look & action buttons
│   ├── player/
│   │   └── Player.tsx         # Rapier capsule physics, camera sync, head bob & crouch
│   ├── room/
│   │   └── TestRoom.tsx       # 3.4m ceiling room, travertine tiles, window wall & skyline
│   ├── ui/
│   │   └── HUD.tsx            # Crosshair dot, pause menu & WebGL fallback modal
│   └── PenthouseExperience.tsx# Dynamic client orchestrator (SSR: false)
├── hooks/
│   ├── useDeviceDetect.ts     # Touch device auto-detection hook
│   └── useKeyboardControls.ts # Desktop keyboard event listener & pause binder
├── lib/
│   └── config.ts              # Single source of truth for architectural dimensions
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
