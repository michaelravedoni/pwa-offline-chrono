export function formatTime(ms) {
  if (ms < 0) ms = 0
  
  const date = new Date(ms)
  const m = date.getUTCHours() * 60 + date.getUTCMinutes()
  const s = date.getUTCSeconds()
  const msPart = Math.floor(date.getUTCMilliseconds() / 10) // Show centiseconds (2 digits) or milliseconds (3)?
  // User wants "Temps s'affiche toujours en grand".
  // Let's do MM:SS.ms (2 digits for ms usually means centiseconds in sports)
  
  // Format: HH:MM:SS.cc
  const hours = Math.floor(ms / 3600000)
  const minutes = Math.floor((ms % 3600000) / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  const centiseconds = Math.floor((ms % 1000) / 10)

  const pad = (n) => n.toString().padStart(2, '0')
  
  // If hours > 0, show hours? "4 maximum" chronos might mean long duration.
  // Standard chrono: MM:SS.cc. If hours, HH:MM:SS.
  
  let main = pad(seconds)
  
  if (minutes > 0 || hours > 0 || ms === 0) {
      main = `${pad(minutes)}:${main}`
  }
  
  if (hours > 0) {
      main = `${pad(hours)}:${main}`
  }
  
  return {
      hours,
      minutes,
      seconds,
      centiseconds,
      formattedMain: main,
      formattedSub: pad(centiseconds) 
  }
}
