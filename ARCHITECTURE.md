# 360TuongTac System Architecture

## 1. ARCHITECTURE & TECH STACK

### Core Infrastructure
* **Frontend Framework:** Next.js 15 (App Router), React 19, TypeScript (Strict Mode).
* **Styling & Kinetic Motion:** Tailwind CSS v4, Framer Motion.
* **Asset Optimization:** Next.js intrinsic `<Image>` core paired with local WebP buffers.

### Architecture Model
**Option A: Modular Monolith + Queue (Recommended for high-scale startups)**
* The frontend acts as a resilient, static-first edge cache. Components are aggressively server-side rendered (`"use server"`) or statically generated.
* Boundless scale capabilities during traffic spikes (virality logic) by delegating background processing/analytics to asynchronous queues.

### Data Management
* **Database Strategy:** Headless Git-based JSON/TS structuring. Data objects are statically typed in `data/blog/*.ts` with Entity-First Metadata.
* **Component Fetching:** No direct database connections on the critical rendering path. Data fetches are immediate, eliminating runtime latency and resulting in instantaneous Time to First Byte (TTFB).

## 2. THE "360 VIBE" DESIGN SYSTEM (UI/UX)
* **Visual Identity:** 3D Isometric / Cyber-Clean Minimalism.
* **Color Palette:**
  * Background: Deep Navy (`#0a0a0f`) to pitch black (`#13121b`).
  * Signature Gradients: Electric Orange (`#FF8C00`) to Neon Pink (`#FF2E63`) to Deep Violet (`#8B5CF6`).
* **Core Mechanisms:** Glassmorphism containers (`bg-white/[0.03] backdrop-blur-xl border border-white/10`) coupled with interactive Neon Glow Shadows. 

## 3. SCALING & NEXT PHASES
How to leverage the Modular Monolith for the next phase of TechSignal VN:
* **Asynchronous Webhooks:** When expanding SaaS features, handle heavy tasks (order processing, growth calculations) via independent queue workers and signal the monolithic edge via webhooks.
* **Domain Driven Design (DDD):** Isolate modules like `auth/`, `billing/`, and `orders/` inside the monolithic repo workspace to allow for seamless microservice extraction if load outgrows the monolith CPU constraints.
