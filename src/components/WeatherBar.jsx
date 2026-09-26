import {
  useEffect,
  useState,
} from 'react'

import {
  ChevronRight,
} from 'lucide-react'

import WeatherIcon from './WeatherIcon'

import {
  FARM_LOCATION,
} from '../config/farmLocation'

import {
  getFarmWeather,
  getWeatherBarSummary,
} from '../utils/weather'

function WeatherBar({
  onOpen,
}) {
  const [
    weather,
    setWeather,
  ] = useState(null)

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    error,
    setError,
  ] = useState(false)

  useEffect(() => {
    let cancelled = false

    const loadWeather =
      async () => {
        try {
          const result =
            await getFarmWeather()

          if (!cancelled) {
            setWeather(
              result
            )

            setError(false)
          }
        } catch (loadError) {
          console.error(
            'Unable to load farm weather:',
            loadError
          )

          if (!cancelled) {
            setError(true)
          }
        } finally {
          if (!cancelled) {
            setLoading(false)
          }
        }
      }

    loadWeather()

    return () => {
      cancelled = true
    }
  }, [])

  /*
   * Loading
   */
  if (loading) {
    return (
      <button
        type="button"
        onClick={onOpen}
        className="mb-6 flex w-full items-center gap-4 rounded-2xl bg-white p-4 text-left shadow-sm transition active:scale-[0.99]"
      >

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EEF3E8]">

          <WeatherIcon
            kind="partly-cloudy"
            size={25}
            className="text-gray-600"
          />

        </div>

        <div className="min-w-0 flex-1">

          <p className="text-xs font-medium text-gray-500">
            {
              FARM_LOCATION
                .displayName
            }
          </p>

          <p className="mt-1 text-sm font-semibold text-gray-900">
            Checking farm weather...
          </p>

        </div>

        <ChevronRight
          size={19}
          className="shrink-0 text-gray-400"
        />

      </button>
    )
  }

  /*
   * No weather available
   */
  if (
    error ||
    !weather
  ) {
    return (
      <button
        type="button"
        onClick={onOpen}
        className="mb-6 flex w-full items-center gap-4 rounded-2xl bg-white p-4 text-left shadow-sm transition active:scale-[0.99]"
      >

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EEF3E8]">

          <WeatherIcon
            kind="cloudy"
            size={25}
            className="text-gray-600"
          />

        </div>

        <div className="min-w-0 flex-1">

          <p className="text-xs font-medium text-gray-500">
            {
              FARM_LOCATION
                .displayName
            }
          </p>

          <p className="mt-1 text-sm font-semibold text-gray-900">
            Weather unavailable
          </p>

          <p className="mt-0.5 text-xs text-gray-500">
            Tap to try again
          </p>

        </div>

        <ChevronRight
          size={19}
          className="shrink-0 text-gray-400"
        />

      </button>
    )
  }

  const summary =
    getWeatherBarSummary(
      weather
    )

  return (
    <button
      type="button"
      onClick={onOpen}
      className="mb-6 flex w-full items-center gap-4 rounded-2xl border border-[#E2E8DC] bg-[#F3F7EF] p-4 text-left shadow-sm transition active:scale-[0.99]"
    >

      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white">

        <WeatherIcon
          kind={
            summary
              .descriptor
              .kind
          }
          size={27}
          className="text-gray-800"
        />

      </div>

      <div className="min-w-0 flex-1">

        <p className="truncate text-xs font-medium text-gray-500">
          {
            weather.location
              .displayName
          }
        </p>

        <p className="mt-0.5 text-base font-semibold text-gray-900">
          {summary.title}
        </p>

        <p className="mt-0.5 truncate text-xs text-gray-600">

          {weather.isStale
            ? 'Last saved forecast · '
            : ''}

          {summary.detail}

        </p>

      </div>

      <ChevronRight
        size={20}
        className="shrink-0 text-gray-400"
      />

    </button>
  )
}

export default WeatherBar