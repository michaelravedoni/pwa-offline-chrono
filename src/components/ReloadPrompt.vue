<script setup>
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { RefreshCw, X } from 'lucide-vue-next'

const {
  offlineReady,
  needRefresh,
  updateServiceWorker,
} = useRegisterSW()

const close = () => {
  offlineReady.value = false
  needRefresh.value = false
}
</script>

<template>
  <div
    v-if="offlineReady || needRefresh"
    class="pwa-toast"
    role="alert"
    aria-labelledby="toast-desc"
  >
    <div class="pwa-toast-content">
      <div class="pwa-message">
        <span id="toast-desc">
          {{ offlineReady ? 'Application prête à être utilisée hors-ligne.' : 'Nouvelle version disponible !' }}
        </span>
      </div>
      
      <div class="pwa-actions">
        <button v-if="needRefresh" @click="updateServiceWorker()" class="btn-refresh">
          <RefreshCw :size="16" class="icon" />
          Mettre à jour
        </button>
        <button @click="close" class="btn-close" aria-label="Fermer">
          <X :size="20" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pwa-toast {
  position: fixed;
  right: 0;
  bottom: 0;
  margin: 1.5rem;
  padding: 1rem;
  border-radius: 16px;
  z-index: 1000;
  background: rgba(26, 26, 26, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--color-surface-highlight);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  max-width: 90vw;
}

@keyframes slide-up {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.pwa-toast-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 260px;
}

.pwa-message {
  font-size: 0.95rem;
  color: var(--color-text-main);
  font-weight: 500;
  line-height: 1.4;
}

.pwa-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn-refresh {
  background: var(--color-primary);
  color: #000;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: transform 0.2s ease, filter 0.2s ease;
}

.btn-refresh:active {
  transform: scale(0.95);
}

.btn-refresh .icon {
  animation: spin 3s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.btn-close {
  background: transparent;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.btn-close:hover {
  color: var(--color-text-main);
}

@media (max-width: 600px) {
  .pwa-toast {
    margin: 1rem;
    left: 0;
    right: 0;
    bottom: calc(env(safe-area-inset-bottom) + 1rem);
  }
}
</style>
