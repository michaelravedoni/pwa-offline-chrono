import { reactive } from 'vue'
import { useStopwatch } from '../composables/useStopwatch'

// Create 4 persistent stopwatch instances
// We use a reactive array to hold the state objects returned by useStopwatch
const instances = []

for (let i = 0; i < 4; i++) {
    instances.push(useStopwatch())
}

export const useChronosStore = () => {
    return {
        instances
    }
}
