<script setup>
import { ref } from 'vue'
import StopwatchView from './components/StopwatchView.vue'
import HistoryView from './components/HistoryView.vue'
import HelpModal from './components/HelpModal.vue'
import { useChronosStore } from './stores/chronos'

const activeTab = ref(0)
const activeChronosCount = ref(1)
const HISTORY_TAB = 4
const showHelp = ref(false)
const { instances: chronos } = useChronosStore()

const addChrono = () => {
  if (activeChronosCount.value < 4) {
    activeChronosCount.value++
    activeTab.value = activeChronosCount.value - 1
  }
}

// Fonction utilitaire pour formater le temps dans l'onglet (MM:SS ou HH:MM:SS)
const formatTabLabel = (ms) => {
  if (!ms) return '00:00'
  const seconds = Math.floor((ms / 1000) % 60)
  const minutes = Math.floor((ms / 60000) % 60)
  const hours = Math.floor(ms / 3600000)
  
  const pad = (n) => n.toString().padStart(2, '0')
  
  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  }
  return `${pad(minutes)}:${pad(seconds)}`
}
</script>

<template>
  <main class="app-container">
    <!-- Help Button (Fixed Top Right) -->
    <button class="help-trigger" @click="showHelp = true">?</button>

    <!-- Help Modal -->
    <HelpModal :is-open="showHelp" @close="showHelp = false" />

    <!-- Tab Content -->
    <div class="content-area">
      <!-- Dynamic Stopwatch Tabs -->
      <div 
        v-for="index in activeChronosCount"
        :key="index - 1"
        v-show="activeTab === index - 1"
        class="tab-content"
      >
        <StopwatchView 
          :id="`chrono-${index - 1}`" 
          :label="`Chrono ${index}`" 
          :stopwatch="chronos[index - 1]"
        />
      </div>
      
      <!-- History Tab -->
      <div v-show="activeTab === HISTORY_TAB" class="tab-content">
          <HistoryView />
      </div>
    </div>

    <!-- Navigation Tabs -->
    <nav class="tab-bar">
      <!-- Dynamic Chrono Tabs -->
      <button 
        v-for="i in activeChronosCount" 
        :key="i - 1"
        class="tab-btn"
        :class="{ active: activeTab === i - 1 }"
        @click="activeTab = i - 1"
      >
        <!-- Utilisation de la valeur 'elapsedTime' du chrono correspondant -->
        <span class="tab-time">{{ formatTabLabel(chronos[i-1].elapsedTime) }}</span>
      </button>

      <!-- Add Button -->
      <button 
        v-if="activeChronosCount < 4" 
        class="tab-btn add-btn"
        @click="addChrono"
        title="Ajouter un chrono"
      >
        <span>+</span>
      </button>

      <!-- History Tab -->
      <button 
        class="tab-btn history-btn"
        :class="{ active: activeTab === HISTORY_TAB }"
        @click="activeTab = HISTORY_TAB"
      >
        <span>Hist.</span>
      </button>
    </nav>
  </main>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh; /* fallback */
  height: 100dvh;
  background-color: #000;
  color: #fff;
  overflow: hidden;
}

.content-area {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.tab-content {
  height: 100%;
}

.tab-bar {
  display: flex;
  background-color: #111;
  border-top: 1px solid #333;
  padding-bottom: env(safe-area-inset-bottom);
}

.tab-btn {
  flex: 1;
  background: none;
  border: none;
  color: #666;
  padding: 1rem;
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.2s;
}

.tab-btn.active {
  color: #fff;
  border-bottom: 3px solid #3498db;
}

.help-trigger {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
  cursor: pointer;
  font-weight: bold;
}
</style>
