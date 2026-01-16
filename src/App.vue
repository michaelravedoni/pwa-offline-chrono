<script setup>
import { ref } from 'vue'
import StopwatchView from './components/StopwatchView.vue'
import HistoryView from './components/HistoryView.vue'
import HelpModal from './components/HelpModal.vue'
import { useChronosStore } from './stores/chronos'

const activeTab = ref(0)
const tabs = [0, 1, 2, 3]
const HISTORY_TAB = 4

const showHelp = ref(false)

const { instances: chronos } = useChronosStore()
</script>

<template>
  <main class="app-container">
    <!-- Help Button (Fixed Top Right) -->
    <button class="help-trigger" @click="showHelp = true">?</button>

    <!-- Help Modal -->
    <HelpModal :is-open="showHelp" @close="showHelp = false" />

    <!-- Tab Content -->
    <div class="content-area">
      <div 
        v-if="activeTab !== HISTORY_TAB"
        class="tab-content"
      >
        <StopwatchView 
          :key="activeTab"
          :id="`chrono-${activeTab}`" 
          :label="`Chrono ${activeTab + 1}`" 
          :stopwatch="chronos[activeTab]"
        />
      </div>
      
      <!-- History Tab -->
      <div v-if="activeTab === HISTORY_TAB" class="tab-content">
          <HistoryView />
      </div>
    </div>

    <!-- Navigation Tabs -->
    <nav class="tab-bar">
      <button 
        v-for="index in tabs" 
        :key="index"
        class="tab-btn"
        :class="{ active: activeTab === index }"
        @click="activeTab = index"
      >
        <span>⏱ {{ index + 1 }}</span>
      </button>

      <button 
        class="tab-btn"
        :class="{ active: activeTab === HISTORY_TAB }"
        @click="activeTab = HISTORY_TAB"
      >
        <span>📜 Historique</span>
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
