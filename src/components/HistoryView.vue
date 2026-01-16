<script setup>
import { ref, nextTick } from 'vue'
import { useHistory } from '../composables/useHistory'
import { formatTime } from '../utils/time'

const { sessions, deleteSession, deleteSessionLap, updateSessionLabel, updateSessionLapLabel } = useHistory()

const editingSessionId = ref(null)
const editingLapId = ref(null) // format: "sessionId-lapId" to be unique across sessions if needed, or just unique enough.
// Actually lap IDs are UUIDs, so they should be unique globally. 
// But wait, "editingLapId" could just be the lap ID.

const editSessionName = ref('')
const editLapName = ref('')

const startEditSession = async (session) => {
  editingSessionId.value = session.id
  editSessionName.value = session.label || ''
  await nextTick()
  const input = document.querySelector(`.session-edit-input[data-id="${session.id}"]`)
  if (input) input.focus()
}

const saveSessionLabel = (session) => {
  if (editingSessionId.value === session.id) {
    updateSessionLabel(session.id, editSessionName.value)
    editingSessionId.value = null
  }
}

const cancelEditSession = () => {
  editingSessionId.value = null
}

const startEditLap = async (session, lap) => {
  editingLapId.value = lap.id
  editLapName.value = lap.label || ''
  await nextTick()
  const input = document.querySelector(`.lap-edit-input[data-id="${lap.id}"]`)
  if (input) input.focus()
}

const saveLapLabel = (sessionId, lap) => {
  if (editingLapId.value === lap.id) {
    updateSessionLapLabel(sessionId, lap.id, editLapName.value)
    editingLapId.value = null
  }
}

const cancelEditLap = () => {
    editingLapId.value = null
}

const formatDate = (ts) => {
  return new Date(ts).toLocaleString()
}

const getGap = (session, index) => {
  if (index === 0) return null
  const currentLap = session.laps[index]
  const prevLap = session.laps[index - 1]
  const diff = currentLap.lapTime - prevLap.lapTime
  
  const absDiff = Math.abs(diff)
  const formatted = formatTime(absDiff)
  
  // Reuse formatTime but specifically we want SS.cc
  // formatTime returns hours, minutes, seconds, centiseconds
  // Let's construct a string manually for the gap to ensure it's compact? 
  // Actually formatTime's formattedMain is MM:SS or HH:MM:SS. 
  // For gap we probably want just S.cc or SS.cc if < 1 min.
  
  // Let's keep it simple: Use formatTime components
  const sign = diff > 0 ? '+' : '-'
  
  // formatted.formattedSub is already padded to 2 digits (centiseconds)
  // formatted.seconds is unpadded integer? No, wait. 
  
  // Let's manually construct to be safe and ensure 2 decimals.
  // We want to show seconds and centiseconds.
  // If > 60s, we might want minutes? "Gap" is usually small.
  // User said "Trop de décimales (deux suffisent)".
  
  // Re-calculate simpler:
  const totalSeconds = absDiff / 1000
  const totalSecondsFixed = totalSeconds.toFixed(2)
  
  return {
      text: `${sign}${totalSecondsFixed}`,
      isSlower: diff > 0,
      isFaster: diff < 0
  }
}
</script>

<template>
  <div class="history-container">
    <h2>Historique</h2>

    <div v-if="!Array.isArray(sessions) || sessions.length === 0" class="empty-state">
      Aucune session enregistrée.
    </div>

    <div class="sessions-list" v-if="Array.isArray(sessions)">
      <div v-for="session in sessions" :key="session.id" class="session-card">
        <div class="session-header">
          <div class="session-info">
            <div v-if="editingSessionId === session.id" class="edit-container">
              <input 
                v-model="editSessionName" 
                class="session-edit-input"
                :data-id="session.id"
                @blur="saveSessionLabel(session)"
                @keyup.enter="saveSessionLabel(session)"
                @keyup.esc="cancelEditSession"
              />
            </div>
            <div v-else class="title-container">
               <h3>{{ session.label || 'Session sans nom' }}</h3>
               <button class="edit-btn" @click="startEditSession(session)">✎</button>
            </div>
            <span class="session-date">{{ formatDate(session.timestamp) }}</span>
          </div>
          <div class="session-total">
            {{ formatTime(session.totalTime).formattedMain }}.{{ formatTime(session.totalTime).formattedSub }}
          </div>
          <button class="delete-btn" @click="deleteSession(session.id)">🗑</button>
        </div>

        <div class="session-laps" v-if="session.laps && session.laps.length > 0">
          <div v-for="(lap, idx) in session.laps" :key="lap.id" class="lap-row">
            <div v-if="editingLapId === lap.id" class="lap-edit-container">
                 <input 
                    v-model="editLapName"
                    class="lap-edit-input"
                    :data-id="lap.id"
                    @blur="saveLapLabel(session.id, lap)"
                    @keyup.enter="saveLapLabel(session.id, lap)"
                    @keyup.esc="cancelEditLap"
                 />
            </div>
            <div v-else class="lap-label-container">
                <span class="lap-label">{{ lap.label }}</span>
                <button class="edit-btn-small" @click="startEditLap(session, lap)">✎</button>
            </div>
            
            <div class="lap-metrics">
                <span class="lap-total-time">
                    {{ formatTime(lap.totalTime).formattedMain }}<small>.{{ formatTime(lap.totalTime).formattedSub }}</small>
                </span>

                <span class="lap-gap" :class="{ 'gap-slower': getGap(session, idx)?.isSlower, 'gap-faster': getGap(session, idx)?.isFaster }">
                    <template v-if="idx > 0">{{ getGap(session, idx)?.text }}</template>
                    <template v-else>-</template>
                </span>
                
                <span class="lap-val">
                    {{ formatTime(lap.lapTime).formattedMain }}<small>.{{ formatTime(lap.lapTime).formattedSub }}</small>
                </span>
            </div>
            
            <button class="delete-lap-btn" @click="deleteSessionLap(session.id, lap.id)">×</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.history-container {
  padding: 1rem;
  height: 100%;
  overflow-y: auto;
  padding-bottom: 5rem; /* Space for tab bar */
}

.empty-state {
  text-align: center;
  color: #666;
  margin-top: 50px;
}

.session-card {
  background-color: #1a1a1a;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #333;
}

.session-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.session-info h3 {
  margin: 0;
  font-size: 1.1rem;
  margin-right: 0.5rem;
}

.title-container {
    display: flex;
    align-items: center;
}

.edit-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #888;
    font-size: 1rem;
    padding: 0;
}
.edit-btn:hover {
    color: #fff;
}

.session-edit-input {
    background: #333;
    border: 1px solid #555;
    color: white;
    padding: 2px 5px;
    border-radius: 4px;
    font-size: 1rem;
    width: 200px;
}

.session-date {
  font-size: 0.8rem;
  color: #888;
}

.session-total {
  font-size: 1.5rem;
  font-weight: bold;
  color: #3498db;
}

.delete-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #e74c3c;
}

.session-laps {
  border-top: 1px solid #333;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
}

.lap-row {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  font-size: 0.9rem;
  color: #ccc;
}

.delete-lap-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
}

.lap-label-container {
    display: flex;
    align-items: center;
    flex-grow: 1;
    margin-left: 10px;
}

.edit-btn-small {
    background: none;
    border: none;
    cursor: pointer;
    color: #666;
    font-size: 0.8rem;
    margin-left: 5px;
    opacity: 0; /* Hidden by default, shown on hover */
    transition: opacity 0.2s;
}

.lap-row:hover .edit-btn-small {
    opacity: 1;
}

.edit-btn-small:hover {
    color: #fff;
}

.lap-edit-container {
    flex-grow: 1;
    margin-left: 10px;
}

.lap-edit-input {
    background: #333;
    border: 1px solid #555;
    color: white;
    padding: 2px 5px;
    border-radius: 4px;
    font-size: 0.8rem;
    width: 100%;
    max-width: 200px;
}

.lap-metrics {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    font-variant-numeric: tabular-nums;
}

.lap-val small,
.lap-total-time small {
    font-size: 0.7em;
    opacity: 0.8;
}

.lap-total-time {
    color: #888;
    font-size: 0.9rem;
    min-width: 60px;
    text-align: right;
     border-right: 1px solid #333;
    padding-right: 0.8rem;
}

.lap-gap {
    font-size: 0.8rem;
    color: #666;
    width: 50px; /* fixed width for alignment */
    text-align: right;
}

.lap-val {
    min-width: 60px;
    text-align: right;
    font-weight: bold;
}

.gap-slower {
    color: #e74c3c;
}

.gap-faster {
    color: #2ecc71;
}
</style>
