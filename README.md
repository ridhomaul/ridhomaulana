# Ridho Maulana - Premium Digital Portfolio

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)
![GSAP](https://img.shields.io/badge/GSAP-Animation-88CE02?style=for-the-badge&logo=greensock)
![Anime.js](https://img.shields.io/badge/Anime.js-Micro_Interaction-FF4B4B?style=for-the-badge)

Welcome to the repository of my personal portfolio. This project is meticulously crafted to demonstrate a high-end, production-ready web experience blending strong technical architecture with premium digital aesthetics.

## 🌟 Highlights & Features

This portfolio isn't just a static page; it's engineered with a dual-engine animation approach to ensure smooth 60fps performance and stunning interactions:

- **Apple-Grade Liquid Glass Navbar**: A custom-engineered SVG filter (`feDisplacementMap` & `feTurbulence`) creates a real refraction effect, distorting the background in real-time.
- **GSAP Macro-Animations**: Handles heavy lifting for scroll triggers, section reveals, cinematic hero timelines, and complex parallax layouts.
- **Anime.js Micro-Interactions**: Dedicated to high-performance user interactions without causing React re-renders, including:
  - Magnetic buttons with elastic bounce and ripple effects.
  - 3D tilting project cards with radial dynamic lighting that follows the cursor.
  - A subtle global cursor reflection/ambient light system.
- **Fully Accessible**: Implements `prefers-reduced-motion` to automatically pause intense animations and SVG filters for users who prefer minimal motion.
- **Dark Mode Ready**: Flawless integration with `next-themes` for seamless light and dark mode switching.

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS v4
- **Animation (Macro)**: GSAP + `@gsap/react`
- **Animation (Micro)**: Anime.js
- **Icons**: `lucide-react` & `react-icons`

## 🛠 Getting Started

First, clone the repository and install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

- `app/page.tsx`: The main landing page orchestrating the GSAP timelines.
- `app/components/Navbar.tsx`: The highly complex Liquid Glass navigation component.
- `app/hooks/`: Contains modular Anime.js micro-interaction hooks:
  - `useNavbarGlass.ts`
  - `useButtonInteraction.ts`
  - `useCardInteraction.ts`
  - `useCursorReflection.ts`
  - `useSvgFilter.ts`

## 📬 Let's Connect

Interested in discussing web architecture, digital media strategies, or collaboration? 
Feel free to reach out via the contact form on the live site or connect with me on [LinkedIn](https://www.linkedin.com/in/ridho-maulana-073aaa386/).

---
*Designed and engineered by Ridho Maulana. © 2026 All Rights Reserved.*
