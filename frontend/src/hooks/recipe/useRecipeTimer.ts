import { useEffect, useRef, useState, useCallback } from 'react'
import * as Notifications from 'expo-notifications'
import { useTranslation } from 'react-i18next'

interface NotificationPermissionsResult {
  granted: boolean
  canAskAgain: boolean
  expires: string
  status: string
  ios?: {
    status: number
    allowsSound: boolean
    allowsAlert: boolean
    allowsBadge: boolean
  }
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

export function parseTimeToSeconds(time: string): number {
  const hoursMin = time.match(/(\d+)\s*h\s*(\d+)?/)
  if (hoursMin) {
    const h = parseInt(hoursMin[1]) * 3600
    const m = parseInt(hoursMin[2] ?? '0') * 60
    return h + m
  }
  const colonMatch = time.match(/(\d+):(\d+)/)
  if (colonMatch) {
    return parseInt(colonMatch[1]) * 3600 + parseInt(colonMatch[2]) * 60
  }
  const digits = time.match(/\d+/)
  return digits ? parseInt(digits[0]) * 60 : 0
}

async function requestNotificationPermission(): Promise<boolean> {
  const result = await Notifications.requestPermissionsAsync() as unknown as NotificationPermissionsResult
  return result.granted
}

export function useRecipeTimer(recipeTime: string, recipeTitle: string) {
  const { t } = useTranslation()
  const totalSeconds = parseTimeToSeconds(recipeTime)

  const [secondsLeft, setSecondsLeft] = useState(totalSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const notificationIdRef = useRef<string | null>(null)

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const scheduleNotification = useCallback(async (seconds: number) => {
    const granted = await requestNotificationPermission()
    if (!granted) return

    if (notificationIdRef.current) {
      await Notifications.cancelScheduledNotificationAsync(notificationIdRef.current)
    }

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: t('recipeTimer.notificationTitle'),
        body: t('recipeTimer.notificationBody', { title: recipeTitle }),
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds,
        channelId: 'timer',
      },
    })
    notificationIdRef.current = id
  }, [recipeTitle, t])

  const cancelNotification = useCallback(async () => {
    if (notificationIdRef.current) {
      await Notifications.cancelScheduledNotificationAsync(notificationIdRef.current)
      notificationIdRef.current = null
    }
  }, [])

  const start = useCallback(async () => {
    if (secondsLeft <= 0) return
    await scheduleNotification(secondsLeft)
    setIsRunning(true)
  }, [secondsLeft, scheduleNotification])

  const pause = useCallback(async () => {
    clear()
    await cancelNotification()
    setIsRunning(false)
  }, [clear, cancelNotification])

  const reset = useCallback(async () => {
    clear()
    await cancelNotification()
    setIsRunning(false)
    setIsFinished(false)
    setSecondsLeft(totalSeconds)
  }, [clear, cancelNotification, totalSeconds])

  useEffect(() => {
    if (!isRunning) return

    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!)
          setIsRunning(false)
          setIsFinished(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return clear
  }, [isRunning, clear])

  useEffect(() => {
    return () => {
      clear()
    }
  }, [clear])

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  const progress = totalSeconds > 0 ? secondsLeft / totalSeconds : 0

  return {
    formatted,
    progress,
    secondsLeft,
    isRunning,
    isFinished,
    totalSeconds,
    start,
    pause,
    reset,
  }
}