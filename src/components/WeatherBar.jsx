import {
  useEffect,
  useState,
} from 'react'

import {
  ChevronRight,
} from 'lucide-react'

import WeatherIcon from './WeatherIcon'

import {
  getFarmWeather,
  getWeatherBarSummary,
} from '../utils/weather'

import {
  useLanguage,
} from '../i18n/LanguageContext'

function WeatherBar({
  onOpen,
  farmLocation,
}) {
  const {
    t,
    generatedText,
  } =
    useLanguage()

  const [
    weather,
    setWeather,
  ] =
    useState(null)

  const [
    loading,
    setLoading,
  ] =
    useState(true)

  const [
    error,
    setError,
  ] =
    useState(false)

  useEffect(() => {
    let cancelled =
      false

    const loadWeather =
      async () => {
        try {
          setLoading(
            true
          )

          const result =
            await getFarmWeather({
              location:
                farmLocation,
            })

          if (
            !cancelled
          ) {
            setWeather(
              result
            )

            setError(
              false
            )
          }
        } catch (loadError) {
          console.error(
            'Unable to load farm weather:',
            loadError
          )

          if (
            !cancelled
          ) {
            setError(
              true
            )
          }
        } finally {
          if (
            !cancelled
          ) {
            setLoading(
              false
            )
          }
        }
      }

    loadWeather()

    return () => {
      cancelled =
        true
    }
  }, [
    farmLocation?.latitude,
    farmLocation?.longitude,
  ])

  const placeName =
    farmLocation
      ?.placeName ||
    t(
      'Farm location'
    )

  if (
    loading
  ) {
    return (
      <button
        type="button"
        onClick={
          onOpen
        }
        className="mb-6 flex w-full items-center gap-4 rounded-2xl bg-white p-4 text-left shadow-sm"
      >

        <WeatherIcon
          kind="partly-cloudy"
          size={
            25
          }
          className="text-gray-600"
        />

        <div className="min-w-0 flex-1">

          <p className="truncate text-xs text-gray-500">
            {
              placeName
            }
          </p>

          <p className="mt-1 text-sm font-semibold">
            {t(
              'Checking farm weather...'
            )}
          </p>

        </div>

        <ChevronRight
          size={
            19
          }
        />

      </button>
    )
  }

  if (
    error ||
    !weather
  ) {
    return (
      <button
        type="button"
        onClick={
          onOpen
        }
        className="mb-6 flex w-full items-center gap-4 rounded-2xl bg-white p-4 text-left shadow-sm"
      >

        <WeatherIcon
          kind="cloudy"
          size={
            25
          }
        />

        <div className="min-w-0 flex-1">

          <p className="truncate text-xs text-gray-500">
            {
              placeName
            }
          </p>

          <p className="mt-1 text-sm font-semibold">
            {t(
              'Weather unavailable'
            )}
          </p>

          <p className="text-xs text-gray-500">
            {t(
              'Tap to try again'
            )}
          </p>

        </div>

        <ChevronRight
          size={
            19
          }
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
      onClick={
        onOpen
      }
      className="mb-6 flex w-full items-center gap-4 rounded-2xl border border-[#E2E8DC] bg-[#F3F7EF] p-4 text-left shadow-sm"
    >

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white">

        <WeatherIcon
          kind={
            summary
              .descriptor
              .kind
          }
          size={
            27
          }
        />

      </div>

      <div className="min-w-0 flex-1">

        <p className="truncate text-xs text-gray-500">
          {
            weather
              .location
              .displayName
          }
        </p>

        <p className="mt-0.5 text-base font-semibold">

          {generatedText(
            summary
              .descriptor
              .label
          )}

          {' · '}

          {
            summary
              .temperature
          }
          °C

        </p>

        <p className="mt-0.5 truncate text-xs text-gray-600">

          {weather.isStale
            ? t(
                'Last saved forecast · '
              )
            : ''}

          {generatedText(
            summary.detail
          )}

        </p>

      </div>

      <ChevronRight
        size={
          20
        }
      />

    </button>
  )
}

export default WeatherBar