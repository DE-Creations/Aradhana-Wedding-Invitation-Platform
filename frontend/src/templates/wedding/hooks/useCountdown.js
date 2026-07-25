import { useEffect, useState } from 'react'

function calculate(target) {
  const now = Date.now()
  const distance = Math.max(0, target - now)

  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((distance % (1000 * 60)) / 1000),
    isComplete: distance === 0,
  }
}

/**
 * Countdown timer to a target date.
 *
 * @param {string|Date|number} targetDate
 * @returns {{days:number, hours:number, minutes:number, seconds:number, isComplete:boolean}}
 */
export function useCountdown(targetDate) {
  const target = targetDate ? new Date(targetDate).getTime() : Date.now()
  const [time, setTime] = useState(() => calculate(target))

  useEffect(() => {
    setTime(calculate(target))
    const interval = setInterval(() => {
      setTime(calculate(target))
    }, 1000)

    return () => clearInterval(interval)
  }, [target])

  return time
}
