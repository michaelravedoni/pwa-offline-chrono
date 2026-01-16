# PWA Offline Chrono

<div align="center">
  <h3>⏱️ Mobile-First Multi-Stopwatch PWA</h3>
  <p>Offline-ready, precise, and designed for touch.</p>
</div>

## 🚀 Features

- **Multi-Stopwatch**: Manage up to 4 independent stopwatches simultaneously.
- **Mobile-First UX**: Massive touch targets for Start/Stop/Lap, optimized for mobile use.
- **Smart Trigger**: Intelligent button response distinguishing between taps (retroactive zero-latency) and long presses (release sync).
- **Offline Ready**: Fully functional PWA that works without an internet connection.
- **High Precision**: Drift-free timing using `Date.now()` differences, resilient to device sleep/backgrounding.
- **History & Persistence**: Save your sessions and laps locally.

## 🛠️ Tech Stack

- **Framework**: [Vue 3](https://vuejs.org/) (Composition API)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **PWA**: [vite-plugin-pwa](https://vite-plugin-pwa.netlify.app/)
- **Store**: [Pinia](https://pinia.vuejs.org/) (or Reactive State)

## 📦 Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Start-Z/pwa-offline-chrono.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## 📱 PWA Features

This app is installable! On mobile, use "Add to Home Screen" to install it as a standalone app.

## 📄 License

MIT

