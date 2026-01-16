<script setup>
import { computed, ref, nextTick } from 'vue'
import { useHistory } from '../composables/useHistory'
import { formatTime } from '../utils/time'

const props = defineProps({
  id: String,
  label: String,
  stopwatch: Object // Receive the instance
})

const { 
  start, 
  stop, 
  reset, 
  addLap, 
  deleteLap,
  elapsedTime, 
  isRunning, 
  laps,
  startTime,
  sessionStartTime
} = props.stopwatch // Destructure from prop instead of calling hook
// startTime needed to check if reset? actually elapsedTime is enough.

const { saveSession } = useHistory()

const showSaveDialog = ref(false)
const sessionLabel = ref('')
const nameInput = ref(null)

const formatted = computed(() => formatTime(elapsedTime.value))

const handleMainAction = () => {
  if (isRunning.value) {
    stop()
  } else {
    start()
  }
}

const handleLapAction = () => {
    if (isRunning.value) {
        addLap()
    } else {
        reset()
    }
}

const openSaveDialog = () => {
    sessionLabel.value = `Session ${new Date(sessionStartTime.value || Date.now()).toLocaleString()}`
    showSaveDialog.value = true
    nextTick(() => {
        nameInput.value?.focus()
    })
}

const confirmSave = () => {
    saveSession({
        label: sessionLabel.value,
        totalTime: elapsedTime.value,
        laps: JSON.parse(JSON.stringify(laps.value)), // Deep copy
        startTime: sessionStartTime.value || Date.now() 
    })
    showSaveDialog.value = false
    // Optionally reset?
    // reset() 
}

// Smart Trigger Logic
const pressStartTimes = {
    main: null,
    secondary: null
}

const activeButtons = ref({
    main: false,
    secondary: false
})

const handlePointerDown = (action) => {
    pressStartTimes[action] = Date.now()
    activeButtons.value[action] = true
}

const handlePointerUp = (action) => {
    // Visual feedback off
    activeButtons.value[action] = false
    
    const pressStart = pressStartTimes[action]
    if (!pressStart) return // Should not happen if flow is correct

    const now = Date.now()
    const duration = now - pressStart
    
    // Threshold for "Long Press" vs "Short Tap"
    const LONG_PRESS_THRESHOLD = 200 
    
    // If Short Tap (< 200ms), we use the PRESS START time (retroactive)
    // If Long Press (>= 200ms), we use the RELEASE time (now)
    const effectiveTimestamp = (duration < LONG_PRESS_THRESHOLD) ? pressStart : now

    if (action === 'main') {
        if (isRunning.value) {
            stop(effectiveTimestamp)
        } else {
            start(effectiveTimestamp)
        }
    } else if (action === 'secondary') {
        if (isRunning.value) {
            addLap('', effectiveTimestamp)
        } else {
            reset()
        }
    }
    
    // Cleanup
    pressStartTimes[action] = null
}

const handlePointerLeave = (action) => {
    // If finger slides off button, cancel action
    if (activeButtons.value[action]) {
        activeButtons.value[action] = false
        pressStartTimes[action] = null
    }
}
</script>

<template>
  <div class="stopwatch-container">
    <!-- Time Display -->
    <div class="time-display">
      <div class="main-time">{{ formatted.formattedMain }}</div>
      <div class="sub-time">.{{ formatted.formattedSub }}</div>
    </div>

    <!-- Laps List (Scrollable area) -->
    <div class="laps-container" v-if="laps.length > 0">
        <div v-for="(lap, index) in laps.slice().reverse()" :key="lap.id" class="lap-item">
            <span class="lap-number">#{{ laps.length - index }}</span>
            <span class="lap-time">{{ formatTime(lap.lapTime).formattedMain }}.{{ formatTime(lap.lapTime).formattedSub }}</span>
            <span class="total-time">{{ formatTime(lap.totalTime).formattedMain }}</span>
            <button @click="deleteLap(laps.length - 1 - index)" class="delete-lap">×</button>
        </div>
    </div>

    <!-- Save Dialog / Button -->
    <div class="actions-bar" v-if="!isRunning && elapsedTime > 0 && !showSaveDialog">
        <button class="save-btn" @click="openSaveDialog">💾 Enregistrer</button>
    </div>

    <!-- Save Modal Overlay -->
    <div class="modal-overlay" v-if="showSaveDialog">
        <div class="modal-content">
            <h3>Enregistrer la session</h3>
            <input 
                ref="nameInput"
                v-model="sessionLabel" 
                placeholder="Nom de la session"
                @keyup.enter="confirmSave"
            />
            <div class="modal-actions">
                <button @click="showSaveDialog = false" class="cancel-btn">Annuler</button>
                <button @click="confirmSave" class="confirm-btn">Enregistrer</button>
            </div>
        </div>
    </div>

    <!-- Controls (Bottom) -->
    <div class="controls">
      <!-- Secondary Button (Lap/Reset) -->
      <button 
        class="btn secondary" 
        :class="{ active: activeButtons.secondary }"
        @pointerdown="handlePointerDown('secondary')"
        @pointerup="handlePointerUp('secondary')"
        @pointerleave="handlePointerLeave('secondary')"
      >
        {{ isRunning ? 'LAP' : 'RESET' }}
      </button>

      <!-- Main Button (Start/Stop) -->
      <button 
        class="btn primary" 
        :class="{ running: isRunning, active: activeButtons.main }"
        @pointerdown="handlePointerDown('main')"
        @pointerup="handlePointerUp('main')"
        @pointerleave="handlePointerLeave('main')"
      >
        {{ isRunning ? 'STOP' : 'START' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.stopwatch-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1rem;
  box-sizing: border-box;
  background-color: #000;
}

.time-display {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-feature-settings: "tnum";
  font-variant-numeric: tabular-nums;
}

.main-time {
  font-size: 20vw;
  font-weight: 700;
  line-height: 1;
}

.sub-time {
  font-size: 8vw;
  color: #888;
  align-self: flex-end;
  margin-right: 1rem;
}

.laps-container {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 1rem;
  border-top: 1px solid #333;
}

.lap-item {
  display: flex;
  justify-content: space-between;
  padding: 0.8rem 0;
  border-bottom: 1px solid #222;
  font-size: 1.2rem;
}

.controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  height: 30vh; /* Big buttons */
}

.btn {
  border: none;
  border-radius: 12px;
  font-size: 2rem;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.1s;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.btn:active, .btn.active {
  opacity: 0.7;
  transform: scale(0.98);
}

.primary {
  background-color: #2ecc71; /* Green */
  color: #000;
}

.primary.running {
  background-color: #e74c3c; /* Red */
}

.secondary {
  background-color: #34495e;
  color: #ecf0f1;
}

.actions-bar {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
}

.save-btn {
    background: #3498db;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 1rem;
    color: white;
    cursor: pointer;
}

.modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
}

.modal-content {
    background: #222;
    padding: 2rem;
    border-radius: 12px;
    width: 80%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.modal-content input {
    padding: 0.8rem;
    font-size: 1.1rem;
    border-radius: 6px;
    border: 1px solid #444;
    background: #111;
    color: white;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
}

.modal-actions button {
    padding: 0.6rem 1.2rem;
    border-radius: 6px;
    border: none;
    font-size: 1rem;
    cursor: pointer;
}

.confirm-btn {
    background: #2ecc71;
    color: black;
}

.cancel-btn {
    background: #e74c3c;
    color: white;
}
</style>
