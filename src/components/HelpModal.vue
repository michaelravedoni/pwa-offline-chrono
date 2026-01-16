<script setup>
import { X, Play, Square, Flag, RotateCcw, Save, Smartphone, Download, WifiOff, ChevronsUp, GripHorizontal } from 'lucide-vue-next'

defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close'])

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
</script>

<template>
  <Transition name="fade">
    <div class="help-overlay" v-if="isOpen" @click.self="emit('close')">
      <div class="help-card">
        <header class="modal-header">
          <h2>Guide & Info</h2>
          <button class="close-btn" @click="emit('close')">
            <X :size="24" />
          </button>
        </header>

        <div class="scroll-content">
          <!-- Usage Section -->
          <section class="section">
            <h3 class="section-title">
              <span class="icon-box primary"><Play :size="18" /></span>
              Utilisation
            </h3>
            <ul class="feature-list">
              <li>
                <div class="command-icon"><Play :size="16" /></div>
                <span><strong>Start/Stop</strong> : Touchez la grande zone colorée.</span>
              </li>
              <li>
                <div class="command-icon"><Flag :size="16" /></div>
                <span><strong>Lap</strong> : Bouton "Lap" (gauche) pour les temps intermédiaires.</span>
              </li>
              <li>
                <div class="command-icon"><RotateCcw :size="16" /></div>
                <span><strong>Reset</strong> : Bouton "Reset" (droite) à l'arrêt.</span>
              </li>
              <li>
                <div class="command-icon"><Save :size="16" /></div>
                <span><strong>Sauvegarder</strong> : Stockez vos temps dans l'historique local.</span>
              </li>
              <li>
                <div class="command-icon"><GripHorizontal :size="16" /></div>
                <span><strong>Navigation</strong> : Swipez ou utilisez la barre du bas pour changer de chrono.</span>
              </li>
            </ul>
          </section>

          <!-- Installation Section -->
          <section class="section">
            <h3 class="section-title">
              <span class="icon-box azure"><Download :size="18" /></span>
              Installation App
            </h3>
            <p class="section-desc">Installez l'application pour profiter du plein écran et d'un confort optimal.</p>
            
            <div v-if="isIOS" class="install-guide ios">
              <div class="guide-header">
                <Smartphone :size="18" /> <span>iOS (Safari)</span>
              </div>
              <ol>
                <li>Appuyez sur <strong>Partager</strong> <span class="ios-share-icon"><ChevronsUp :size="14" /></span></li>
                <li>Cherchez <strong>"Sur l'écran d'accueil"</strong></li>
                <li>Confirmez avec <strong>Ajouter</strong></li>
              </ol>
            </div>
            
            <div v-else class="install-guide android">
              <div class="guide-header">
                <Smartphone :size="18" /> <span>Android (Chrome)</span>
              </div>
              <ol>
                <li>Ouvrez le menu <strong>(⋮)</strong></li>
                <li>Sélectionnez <strong>"Installer l'application"</strong></li>
              </ol>
            </div>
          </section>

          <!-- Offline Section -->
          <section class="section">
            <h3 class="section-title">
              <span class="icon-box neutral"><WifiOff :size="18" /></span>
              Mode Hors-Ligne
            </h3>
            <p class="section-desc">
              Cette application est une <strong>PWA</strong>. Une fois chargée, elle fonctionne totalement sans internet (avion, zone blanche, etc.). Vos données restent sur votre appareil.
            </p>
          </section>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.help-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
}

.help-card {
  background: var(--color-surface);
  width: 100%;
  max-width: 480px;
  max-height: 85vh;
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.modal-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.02);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: -0.5px;
}

.close-btn {
  background: transparent;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-main);
}

.scroll-content {
  padding: 0 1.5rem 1.5rem;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.section {
  margin-top: 1.5rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text-main);
}

.icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
}

.icon-box.primary { color: var(--color-primary); background: rgba(0, 255, 136, 0.1); }
.icon-box.azure { color: #3b82f6; background: rgba(59, 130, 246, 0.1); }
.icon-box.neutral { color: var(--color-text-muted); }

.section-desc {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  line-height: 1.5;
  margin: 0 0 1rem 0;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.feature-list li {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: var(--color-text-dim);
  line-height: 1.4;
}

.feature-list strong {
  color: var(--color-text-main);
}

.command-icon {
  min-width: 20px;
  color: var(--color-text-muted);
  display: flex;
  padding-top: 2px;
}

.install-guide {
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-sm);
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.guide-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--color-text-main);
}

.install-guide ol {
  margin: 0;
  padding-left: 1.25rem;
  color: var(--color-text-dim);
  font-size: 0.9rem;
}

.install-guide li {
  margin-bottom: 0.4rem;
}

.ios-share-icon {
  display: inline-block;
  transform: translateY(2px);
}

/* Animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active .help-card,
.fade-leave-active .help-card {
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fade-enter-from .help-card,
.fade-leave-to .help-card {
  transform: scale(0.95);
}
</style>
