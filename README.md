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

### Testing Offline Mode

To properly test PWA offline capabilities (Service Worker), you need to build the app, as Service Workers are typically not enabled in development mode by default.

1.  Build the app:
    ```bash
    npm run build
    ```
2.  Preview the production build locally:
    ```bash
    npm run preview
    ```
3.  Open the URL provided (usually http://localhost:4173/).
4.  In Chrome DevTools > Application > Service Workers, verify the SW is registered.
5.  Check "Offline" in the Network tab or turn off your WiFi to verify the app acts as expected.


### Deployment to GitHub Pages

This project is configured for automated deployment via GitHub Actions.

1.  **Push your changes**: Ensure the latest code (including `.github/workflows/deploy.yml` and updated `vite.config.js`) is pushed to GitHub.
2.  **Configure GitHub Pages**:
    - Go to your repository on GitHub.
    - Click on **Settings** > **Pages** (in the sidebar).
    - Under **Build and deployment** > **Source**, select **GitHub Actions**.
    - The deployment workflow will trigger automatically on your next push.
3.  **Visit your App**: Once the workflow completes, your app will be live at `https://michaelravedoni.github.io/pwa-offline-chrono/`.

## 📄 License

MIT

