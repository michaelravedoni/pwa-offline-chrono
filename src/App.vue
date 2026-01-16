<script setup>
import { ref } from 'vue'
import StopwatchView from './components/StopwatchView.vue'
import HistoryView from './components/HistoryView.vue'
import HelpModal from './components/HelpModal.vue'
import { useChronosStore } from './stores/chronos'
import { Plus, History, HelpCircle } from 'lucide-vue-next'
import ReloadPrompt from './components/ReloadPrompt.vue'

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
    <!-- Top Navigation Bar -->
    <nav class="tab-bar">
      <!-- Dynamic Chrono Tabs -->
      <button 
        v-for="i in activeChronosCount" 
        :key="i - 1"
        class="tab-btn"
        :class="{ active: activeTab === i - 1 }"
        @click="activeTab = i - 1"
      >
        <span class="tab-time">{{ formatTabLabel(chronos[i-1].elapsedTime) }}</span>
      </button>

      <!-- Add Button -->
      <button 
        v-if="activeChronosCount < 4" 
        class="tab-btn add-btn"
        @click="addChrono"
        title="Ajouter un chrono"
      >
        <Plus :size="24" />
      </button>

      <!-- History Tab -->
      <button 
        class="tab-btn history-btn"
        :class="{ active: activeTab === HISTORY_TAB }"
        @click="activeTab = HISTORY_TAB"
      >
        <History :size="20" />
      </button>

      <!-- Help Button (Integrated in Nav) -->
      <button class="help-trigger-nav" @click="showHelp = true">
          <HelpCircle :size="20" />
      </button>
    </nav>

    <!-- Help Modal -->
    <HelpModal :is-open="showHelp" @close="showHelp = false" />

    <!-- Main Content Area -->
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
      <div v-show="activeTab === HISTORY_TAB" class="tab-content history-wrapper">
          <HistoryView />
      </div>
    </div>

    <!-- PWA Update Prompt -->
    <ReloadPrompt />
  </main>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh; /* Mobile viewport fix */
  background-color: var(--color-bg);
  color: var(--color-text-main);
  overflow: hidden; /* Prevent body scroll propagation */
}

/* Fixed Top Navigation */
.tab-bar {
  flex: 0 0 60px; /* Fixed height, non-shrinkable */
  display: flex;
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-surface-highlight);
  padding-top: env(safe-area-inset-top);
  padding-bottom: 0; 
  justify-content: flex-start;
  align-items: center;
  z-index: 50;
  width: 100%;
}

/* Content Area fills the rest */
.content-area {
  flex: 1;
  position: relative;
  overflow: hidden; /* Crucial: contain child scrolls */
  display: flex;
  flex-direction: column;
  height: 100%; /* Explicit height for children */
}

.tab-content {
  flex: 1;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Prevent spillover */
}

.history-wrapper {
  flex: 1;
  height: 100%;
  overflow: hidden;
}

.tab-btn {
  flex: 1;
  background: none;
  border: none;
  color: var(--color-text-muted);
  padding: 0 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
  min-width: 60px;
}

.tab-time {
  font-family: var(--font-nums);
  font-size: 0.9rem;
  font-weight: 500;
}

.tab-btn.active {
  color: var(--color-primary);
  background-color: rgba(0, 255, 136, 0.05);
  border-bottom-color: var(--color-primary);
}

.add-btn span {
  font-size: 1.5rem;
  line-height: 1;
  font-weight: 300;
}

.history-btn span {
  font-weight: 500;
}

/* Integrated Help Button */
.help-trigger-nav {
  width: 40px;
  background: none;
  border: none;
  color: var(--color-text-muted);
  font-family: var(--font-nums);
  font-weight: bold;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: 1px solid var(--color-surface-highlight);
  height: 60%;
  margin-left: 5px;
}

.help-trigger-nav:active {
  color: var(--color-text-main);
}
</style>
