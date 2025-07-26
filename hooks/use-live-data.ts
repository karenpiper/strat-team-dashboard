"use client"

import React, { useState, useEffect, useRef } from "react"

type FetchFunction<T> = () => Promise<T>

interface UseLiveDataOptions {
  interval?: number
  initialDelay?: number
  enabled?: boolean
}

export function useLiveData<T>(fetchFn: FetchFunction<T>, initialData: T, options: UseLiveDataOptions = {}) {
  const {
    interval = 10000, // Default polling interval: 10 seconds
    initialDelay = 0, // Default initial delay: 0 seconds
    enabled = true, // Default enabled: true
  } = options

  const [data, setData] = useState<T>(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [hasNewData, setHasNewData] = useState(false)

  const previousDataRef = useRef<T>(initialData)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Function to check if data has changed
  const hasDataChanged = (prevData: T, newData: T): boolean => {
    return JSON.stringify(prevData) !== JSON.stringify(newData)
  }

  // Function to fetch data
  const fetchData = async () => {
    if (!enabled) return

    setIsLoading(true)
    try {
      const newData = await fetchFn()
      setData(newData)

      // Check if data has changed
      if (hasDataChanged(previousDataRef.current, newData)) {
        setHasNewData(true)
        // Reset the "new data" indicator after 3 seconds
        setTimeout(() => setHasNewData(false), 3000)
      }

      previousDataRef.current = newData
      setLastUpdated(new Date())
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred"))
    } finally {
      setIsLoading(false)
    }
  }

  // Initial fetch and polling setup
  useEffect(() => {
    // Initial fetch after initialDelay
    const initialFetchTimer = setTimeout(() => {
      fetchData()
    }, initialDelay)

    // Set up polling interval
    if (enabled) {
      timerRef.current = setInterval(fetchData, interval)
    }

    // Cleanup
    return () => {
      clearTimeout(initialFetchTimer)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [enabled, interval, initialDelay])

  // Function to manually trigger a refresh
  const refresh = () => {
    fetchData()
  }

  return {
    data,
    isLoading,
    error,
    lastUpdated,
    hasNewData,
    refresh,
  }
}
