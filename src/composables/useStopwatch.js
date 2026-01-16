import { ref, computed, onUnmounted } from 'vue'

export function useStopwatch() {
  const startTime = ref(null)
  const accumulatedTime = ref(0)
  const isRunning = ref(false)
  const animationFrameId = ref(null)
  const now = ref(Date.now())
  const sessionStartTime = ref(null)

  const updateNow = () => {
    now.value = Date.now()
    if (isRunning.value) {
      animationFrameId.value = requestAnimationFrame(updateNow)
    }
  }

  const start = () => {
    if (isRunning.value) return
    
    if (accumulatedTime.value === 0 && !sessionStartTime.value) {
        sessionStartTime.value = Date.now()
    }
    
    startTime.value = Date.now()
    isRunning.value = true
    updateNow()
  }

  const stop = () => {
    if (!isRunning.value) return
    if (startTime.value) {
        accumulatedTime.value += Date.now() - startTime.value
    }
    startTime.value = null
    isRunning.value = false
    if (animationFrameId.value) {
      cancelAnimationFrame(animationFrameId.value)
    }
  }

  const reset = () => {
    stop()
    startTime.value = null
    accumulatedTime.value = 0
    laps.value = []
    sessionStartTime.value = null
  }

  const elapsedTime = computed(() => {
    if (isRunning.value && startTime.value) {
      return accumulatedTime.value + (now.value - startTime.value)
    }
    return accumulatedTime.value
  })

  // Laps logic
  const laps = ref([])
  
  const addLap = (label = '') => {
      const current = elapsedTime.value
      // Calculate lap duration (current time - sum of previous laps? or just split time?)
      // User requirement says "lap/interval". Usually lap is time since last lap.
      // Split is total time.
      // Let's store both absolute time and lap duration.
      
      const lastLapEndTime = laps.value.length > 0 ? laps.value[laps.value.length - 1].totalTime : 0
      const lapDuration = current - lastLapEndTime
      
      laps.value.push({
          id: crypto.randomUUID(),
          totalTime: current,
          lapTime: lapDuration,
          label: label || `Tour ${laps.value.length + 1}`
      })
  }

  const deleteLap = (index) => {
      laps.value.splice(index, 1)
      // Recalculate logic might be needed if we delete a lap in the middle? 
      // It's complex. If we just want to remove a record, simple splice is fine.
  }

//   onUnmounted(() => {
//     if (animationFrameId.value) {
//       cancelAnimationFrame(animationFrameId.value)
//     }
//   })

  return {
    start,
    stop,
    reset,
    addLap,
    elapsedTime,
    isRunning,
    laps,
    deleteLap,
    startTime,
    sessionStartTime
  }
}
