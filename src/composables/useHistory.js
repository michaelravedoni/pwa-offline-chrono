import { useStorage } from '@vueuse/core'

const STORAGE_KEY = 'chrono_history'
const sessions = useStorage(STORAGE_KEY, [])

export function useHistory() {

  const saveSession = (sessionData) => {
    // sessionData: { startTime, endTime, totalTime, laps, label }
    const newSession = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      ...sessionData
    }
    sessions.value.unshift(newSession) // Add to top
  }

  const deleteSession = (sessionId) => {
    const index = sessions.value.findIndex(s => s.id === sessionId)
    if (index !== -1) {
      sessions.value.splice(index, 1)
    }
  }

  const deleteSessionLap = (sessionId, lapId) => {
    const session = sessions.value.find(s => s.id === sessionId)
    if (session && session.laps) {
      const idx = session.laps.findIndex(l => l.id === lapId)
      if (idx !== -1) {
        // We need to adjust the totalTime of the session?
        // Be careful. If we delete a lap, usually the session total time is sum of laps?
        // Or session total time was recorded separately?
        // If we delete a lap, we probably want to reduce the displayed total time if it's calculated from laps.
        // But here we stored totalTime. 
        // Let's just remove the lap for now. The requirement is "supprimer individuellement chaque lap".
        session.laps.splice(idx, 1)
      }
    }
  }

  return {
    sessions,
    saveSession,
    deleteSession,
    deleteSessionLap
  }
}
