/**
 * Trigger haptic feedback if supported.
 * @param {number|number[]} pattern - Vibration pattern (ms). Default is 15ms for a light "click".
 * @returns {boolean} - True if vibration was attempted, false if not supported.
 */
export const triggerHaptic = (pattern = 15) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
            return navigator.vibrate(pattern);
        } catch (e) {
            console.warn('Vibration failed', e);
            return false;
        }
    }
    return false;
}
