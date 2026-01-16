<script setup>
import { useHistory } from '../composables/useHistory'
import { formatTime } from '../utils/time'

const { sessions, deleteSession, deleteSessionLap } = useHistory()

const formatDate = (ts) => {
  return new Date(ts).toLocaleString()
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
            <h3>{{ session.label || 'Session sans nom' }}</h3>
            <span class="session-date">{{ formatDate(session.timestamp) }}</span>
          </div>
          <div class="session-total">
            {{ formatTime(session.totalTime).formattedMain }}.{{ formatTime(session.totalTime).formattedSub }}
          </div>
          <button class="delete-btn" @click="deleteSession(session.id)">🗑</button>
        </div>

        <div class="session-laps" v-if="session.laps && session.laps.length > 0">
          <div v-for="(lap, idx) in session.laps" :key="lap.id" class="lap-row">
            <span class="lap-idx">#{{ idx + 1 }}</span>
            <span class="lap-label">{{ lap.label }}</span>
            <span class="lap-val">{{ formatTime(lap.lapTime).formattedMain }}</span>
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
</style>
