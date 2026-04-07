# Premium Interactive Wall Calendar

This is a modern, production-grade Interactive Wall Calendar web application built with a focus on polished UI, smooth physics-driven micro-interactions, and high-end aesthetics. It implements a fully responsive, custom-built date selection engine equipped to handle fluid motion dragging and cross-month state management without relying on heavy raw calendar libraries.

## ✨ Key Features & Technical Choices

- **Physics-Inspired Date Range Selection**: Built using explicit `onPointerDown`/`onPointerEnter` window listeners rather than basic CSS hovers. The highlight pill connecting the selected date range uses `framer-motion` layout animations, giving tactile, continuous spring-morphing background feedback.
- **Intelligent Notes Module**: Users can click or drag to select any date (or contiguous date ranges) and type notes that instantly sync to their local cache using debounced `localStorage` operations. The presence of a note is mapped back to the calendar grid via a context-aware scale-animated dot indicator.
- **Production-Grade Theming Engine**: Uses an advanced Glassmorphic UI with CSS Module isolation. Features a complete built-in dark/light mode `ThemeToggle` mechanism. The background utilizes a complex blend of layered graphical assets alongside repeating TUF watermark patterns and synthetic blur overlays.
- **Magnetic Parallax Depth**: The root Calendar wrapper possesses an event-driven `useMotionValue` tracking system for a 3D perspective magnetic tilt (noticeable on Desktop resolutions).
- **Responsive Mastery**: Utilizes fluid CSS grids and rem-based dimension tokens to guarantee a flawlessly scaled experience from a 4k monitor directly down to an iPhone SE viewport.

## 🚀 Getting Started Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation
1. Clone this repository (or extract the directory).
2. Install the necessary dependencies via npm:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser to the local URL (usually `http://localhost:5173`).

### Building for Production
To generate a production-ready optimized build:
```bash
npm run build
```
The optimized bundle will be generated in the `dist/` directory, ready to be deployed to Vercel, Netlify, or any static hosting service.

## 💻 Tech Stack
- **React 19**
- **TypeScript**
- **Vite**
- **Framer Motion** (for advanced layout morphing and 3D spring interactions)
- **date-fns** (for lightweight date arithmetic)
- **Lucide React** (for modern, crisp iconography)
- **CSS Modules** (for scalable, collision-free styling)

## 🎥 Demonstration Highlights

- Try seamlessly clicking and dragging across numbers backward or forward to lock a multi-day range.
- Try toggling between Light and Dark mode using the sun/moon dial.
- Try focusing on the Notes textbox to view the subtle input interactions and type out a reminder.
- Switch to a mobile viewport (DevTools) to witness the structural shift in the layout.
