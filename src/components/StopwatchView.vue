<script setup>
import { computed, ref, nextTick, toRefs } from 'vue'
import { useHistory } from '../composables/useHistory'
import { formatTime } from '../utils/time'
import { Save, X, Play, Square, Flag, RotateCcw } from 'lucide-vue-next'
import { triggerHaptic } from '../utils/haptics'

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
  deleteLap
} = props.stopwatch

const {
  elapsedTime, 
  isRunning, 
  laps,
  startTime,
  sessionStartTime
} = toRefs(props.stopwatch)
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
    sessionLabel.value = `Session ${new Date(sessionStartTime.value || Date.now()).toLocaleString('fr-CH', {timeStyle: "short"})}`
    showSaveDialog.value = true
    nextTick(() => {
        nameInput.value?.focus()
    })
}

const confirmSave = () => {
    const lapsToSave = JSON.parse(JSON.stringify(laps.value)) // Deep copy
    const currentTotal = elapsedTime.value
    
    // Check if we need a final lap
    // Logic: if totalTime of last lap < currentTotal, we have a remainder.
    const lastLapTotal = lapsToSave.length > 0 ? lapsToSave[lapsToSave.length - 1].totalTime : 0
    
    if (lapsToSave.length === 0 || currentTotal > lastLapTotal) {
        const diff = currentTotal - lastLapTotal
        // Only add if diff is significant (e.g. > 10ms) to avoid rounding jitter? 
        // Or just add it.
        if (diff > 0) {
            lapsToSave.push({
                id: crypto.randomUUID(),
                totalTime: currentTotal,
                lapTime: diff,
                label: 'Final'
            })
        }
    }

    saveSession({
        label: sessionLabel.value,
        totalTime: currentTotal,
        laps: lapsToSave,
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
    // Haptic feedback
    triggerHaptic()
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

    // Haptic feedback
    triggerHaptic()
    
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

    <!-- Save Button Overlay (Absolute) -->
    <button v-if="!isRunning && elapsedTime > 0 && !showSaveDialog" class="save-overlay-btn" @click="openSaveDialog">
        <Save :size="16" style="margin-right:4px;" /> Enregistrer
    </button>

    <!-- Laps List (Scrollable area) -->
    <div class="laps-container" v-if="laps.length > 0">
        <div v-for="(lap, index) in laps.slice().reverse()" :key="lap.id" class="lap-item">
            <span class="lap-number">T{{ laps.length - index }}</span>
            <span class="lap-time">{{ formatTime(lap.lapTime).formattedMain }}.{{ formatTime(lap.lapTime).formattedSub }}</span>
            <span class="total-time">{{ formatTime(lap.totalTime).formattedMain }}.{{ formatTime(lap.totalTime).formattedSub }}</span>
            <button @click="deleteLap(laps.length - 1 - index)" class="delete-lap">
                <X :size="18" />
            </button>
        </div>
        
        <div style="height: 1rem;"></div> 
    </div>
    
    <!-- Empty filler if no laps -->
    <div class="laps-container" v-else></div>

    <!-- Removed old actions-bar -->

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
        aria-label="Lap or Reset"
      >
        <Flag v-if="isRunning" :size="48" stroke-width="2" />
        <RotateCcw v-else :size="48" stroke-width="2" />
      </button>

      <!-- Main Button (Start/Stop) -->
      <button 
        class="btn primary" 
        :class="{ running: isRunning, active: activeButtons.main }"
        @pointerdown="handlePointerDown('main')"
        @pointerup="handlePointerUp('main')"
        @pointerleave="handlePointerLeave('main')"
        aria-label="Start or Stop"
      >
        <Square v-if="isRunning" :size="48" fill="currentColor" stroke-width="0" />
        <Play v-else :size="64" fill="currentColor" stroke-width="0" style="margin-left:8px;" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.stopwatch-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  background-color: var(--color-bg);
  position: relative;
  overflow: hidden; 
}

/* 1. Time Display */
.time-display {
  flex: 0 0 30%; 
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-feature-settings: "tnum";
  font-variant-numeric: tabular-nums;
  z-index: 10;
  border-bottom: 1px solid var(--color-surface-highlight);
  position: relative;
}

.main-time {
  font-family: var(--font-nums);
  font-size: 18vw;
  font-weight: 700;
  line-height: 1;
  color: var(--color-text-main);
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
}

.sub-time {
  font-family: var(--font-nums);
  font-size: 6vw;
  color: var(--color-primary); 
  align-self: flex-end;
  margin-right: 1rem;
  opacity: 0.8;
  font-weight: 400;
}

/* 2. Laps Container */
.laps-container {
  flex: 1; 
  min-height: 0; /* Crucial for scrolling */
  overflow-y: auto;
  background: var(--color-surface);
  width: 100%;
  position: relative;
}

/* Compact Lap Item */
.lap-item {
  display: flex;
  justify-content: space-between;
  padding: 0rem 0.5rem; /* Tighter padding */
  border-bottom: 1px solid rgba(255,255,255,0.05);
  font-size: 0.9rem;
  color: var(--color-text-muted);
  font-family: var(--font-nums);
  align-items: center;
  height: 36px; /* Fixed compact height */
}

/* 3. Controls */
.controls {
  flex: 0 0 45%; /* Substantial height */
  display: flex;
  flex-direction: row; 
  width: 100%;
  padding: 0;
  gap: 0;
  border-top: 1px solid var(--color-surface-highlight);
}

.btn {
  flex: 1;
  border: none;
  border-radius: 0; 
  font-size: 2.5rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.1s ease-out;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  position: relative;
  height: 100%;
}

/* Divider between buttons */
.btn:first-child {
  border-right: 1px solid rgba(255,255,255,0.05);
}

.btn:active {
  background-color: var(--color-surface-hover); 
  /* Visual feedback on touch */
}

.primary {
  background-color: var(--color-primary);
  color: #000;
}

.primary:active {
  background-color: var(--color-primary-dim);
}

.primary.running {
  background-color: var(--color-danger); 
  color: #fff;
}

.btn.primary.running:active {
  background-color: var(--color-danger-dim); 
}

.secondary {
  background-color: var(--color-surface-active);
  color: var(--color-text-main);
}

.secondary.active {
  background-color: var(--color-surface-highlight);
}

/* Save Button - Positioned Absolute Top Right (below header) */
.save-overlay-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 50;
    
    background: var(--color-accent);
    border: none;
    padding: 0.3rem 0.8rem;
    border-radius: 4px; /* Slightly rounded, utilitarian */
    font-size: 0.8rem;
    color: #000;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    opacity: 0.9;
}

/* Modal Styles SAME */
.modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.85);
    backdrop-filter: blur(5px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
}

.modal-content {
    background: var(--color-surface);
    padding: 2rem;
    border-radius: var(--radius-lg);
    width: 85%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    border: 1px solid var(--color-surface-highlight);
    box-shadow: 0 20px 40px rgba(0,0,0,0.5);
}

.modal-content h3 {
    margin: 0;
    color: var(--color-text-main);
    font-size: 1.2rem;
}

.modal-content input {
    padding: 1rem;
    font-size: 1.1rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--color-surface-highlight);
    background: var(--color-bg);
    color: var(--color-text-main);
    outline: none;
    transition: border-color 0.2s;
}

.modal-content input:focus {
    border-color: var(--color-accent);
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
}

.modal-actions button {
    padding: 0.8rem 1.5rem;
    border-radius: var(--radius-sm);
    border: none;
    font-size: 1rem;
    cursor: pointer;
    font-weight: 500;
}

.confirm-btn {
    background: var(--color-primary);
    color: #000;
}

.cancel-btn {
    background: transparent;
    color: var(--color-danger);
    border: 1px solid var(--color-danger-dim) !important;
}

/* Specific Utilities */
.delete-lap {
  background: none;
  border: none;
  color: var(--color-danger);
  cursor: pointer;
  opacity: 0.5;
  padding: 0 0.5rem;
  font-size: 1.2rem;
  line-height: 1;
}
.lap-number {
  color: var(--color-text-dim);
  font-size: 0.9em;
  width: 30px;
}
.lap-time {
  color: var(--color-text-muted);
}
.total-time {
  color: var(--color-text-main);
  font-size: 0.9em;
  font-weight: 600;
}
</style>
