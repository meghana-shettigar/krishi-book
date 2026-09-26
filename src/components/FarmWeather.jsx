import {
  useEffect,
  useState,
} from 'react'

import {
  ArrowLeft,
  CheckCircle2,
  CloudRain,
  Droplets,
  Info,
  MapPin,
  RefreshCw,
  Thermometer,
  TriangleAlert,
  Wind,
  XCircle,
} from 'lucide-react'

import WeatherIcon from './WeatherIcon'

import {
  buildFarmAdvice,
  formatForecastDate,
  formatWeatherUpdatedTime,
  getDailyForecast,
  getFarmWeather,
  getRainWindows,
  getRemainingRainMetrics,
  getTodayMetrics,
  getWeatherBarSummary,
  getWeatherDescriptor,
} from '../utils/weather'

function AdviceSection({
  title,
  items,
  tone,
}) {
  if (!items?.length) {
    return null
  }

  const styles = {
    good: {
      wrapper:
        'border-[#D9E8D5] bg-[#F1F7EE]',

      icon:
        'text-[#4D7650]',

      Icon:
        CheckCircle2,
    },

    avoid: {
      wrapper:
        'border-[#F0D6D1] bg-[#FCF2F0]',

      icon:
        'text-[#A64B3F]',

      Icon:
        XCircle,
    },

    caution: {
      wrapper:
        'border-[#E8DFC0] bg-[#FBF7E8]',

      icon:
        'text-[#8B732D]',

      Icon:
        TriangleAlert,
    },
  }

  const style =
    styles[tone]

  const Icon =
    style.Icon

  return (
    <section
      className={`rounded-2xl border p-5 ${style.wrapper}`}
    >

      <div className="mb-4 flex items-center gap-2">

        <Icon
          size={20}
          className={
            style.icon
          }
        />

        <h3 className="text-base font-semibold text-gray-900">
          {title}
        </h3>

      </div>

      <div className="space-y-4">

        {items.map(
          (item) => (
            <div
              key={
                item.title
              }
            >

              <p className="text-sm font-semibold text-gray-900">
                {item.title}
              </p>

              <p className="mt-1 text-sm leading-5 text-gray-600">
                {item.detail}
              </p>

            </div>
          )
        )}

      </div>

    </section>
  )
}

function FarmWeather({
  onBack,
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
    refreshing,
    setRefreshing,
  ] = useState(false)

  const [
    error,
    setError,
  ] = useState('')

  const loadWeather =
    async (
      force = false
    ) => {
      try {
        if (force) {
          setRefreshing(true)
        } else {
          setLoading(true)
        }

        setError('')

        const result =
          await getFarmWeather({
            force,
          })

        setWeather(
          result
        )
      } catch (loadError) {
        console.error(
          'Unable to load weather:',
          loadError
        )

        setError(
          'Unable to get the farm weather right now.'
        )
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    }

  useEffect(() => {
    loadWeather()
  }, [])

  /*
   * Loading
   */
  if (
    loading &&
    !weather
  ) {
    return (
      <div className="min-h-screen bg-[#F7F5EF]">

        <main className="mx-auto min-h-screen w-full max-w-md px-5 py-6">

          <header className="mb-8 flex items-center gap-3">

            <button
              type="button"
              onClick={onBack}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
            >
              <ArrowLeft
                size={20}
              />
            </button>

            <div>

              <h1 className="text-2xl font-bold text-gray-900">
                Farm Weather
              </h1>

              <p className="text-sm text-gray-500">
                Checking today's conditions...
              </p>

            </div>

          </header>

          <section className="rounded-2xl bg-white p-8 text-center shadow-sm">

            <RefreshCw
              size={28}
              className="mx-auto animate-spin text-gray-400"
            />

            <p className="mt-4 text-sm text-gray-500">
              Getting farm weather...
            </p>

          </section>

        </main>

      </div>
    )
  }

  /*
   * Nothing available
   */
  if (
    !weather
  ) {
    return (
      <div className="min-h-screen bg-[#F7F5EF]">

        <main className="mx-auto min-h-screen w-full max-w-md px-5 py-6">

          <header className="mb-8 flex items-center gap-3">

            <button
              type="button"
              onClick={onBack}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
            >
              <ArrowLeft
                size={20}
              />
            </button>

            <div>

              <h1 className="text-2xl font-bold text-gray-900">
                Farm Weather
              </h1>

              <p className="text-sm text-gray-500">
                Should we do farm work today?
              </p>

            </div>

          </header>

          <section className="rounded-2xl bg-white p-7 text-center shadow-sm">

            <CloudRain
              size={32}
              className="mx-auto text-gray-400"
            />

            <p className="mt-4 font-semibold text-gray-900">
              Weather unavailable
            </p>

            <p className="mt-2 text-sm leading-5 text-gray-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                loadWeather(
                  true
                )
              }
              className="mt-5 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white"
            >
              Try Again
            </button>

          </section>

        </main>

      </div>
    )
  }

  const summary =
    getWeatherBarSummary(
      weather
    )

const metrics =
  getTodayMetrics(
    weather
  )

const remainingRain =
  getRemainingRainMetrics(
    weather
  )

const rainWindows =
  getRainWindows(
    weather
  )

  const advice =
    buildFarmAdvice(
      weather
    )

  const forecast =
    getDailyForecast(
      weather
    )

const current =
  weather.current || {}

const currentDescriptor =
  getWeatherDescriptor(
    Number(
      current.weather_code ||
        0
    ),

    Number(
      current.is_day ?? 1
    )
  )

const isRainingNow =
  currentDescriptor.kind ===
    'rain' ||
  currentDescriptor.kind ===
    'drizzle' ||
  currentDescriptor.kind ===
    'storm'

const feelsLike =
  Math.round(
    Number(
      current
        .apparent_temperature ||
        0
    )
  )

  const statusClasses = {
    good:
      'border-[#D9E8D5] bg-[#F1F7EE]',

    mixed:
      'border-[#E8DFC0] bg-[#FBF7E8]',

    poor:
      'border-[#F0D6D1] bg-[#FCF2F0]',
  }

  return (
    <div className="min-h-screen bg-[#F7F5EF]">

      <main className="mx-auto min-h-screen w-full max-w-md px-5 py-6">

        {/* Header */}
        <header className="mb-6 flex items-center gap-3">

          <button
            type="button"
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
          >
            <ArrowLeft
              size={20}
            />
          </button>

          <div className="min-w-0 flex-1">

            <h1 className="text-2xl font-bold text-gray-900">
              Farm Weather
            </h1>

            <p className="text-sm text-gray-500">
              Should we do farm work today?
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              loadWeather(
                true
              )
            }
            disabled={
              refreshing
            }
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm disabled:opacity-50"
            aria-label="Refresh weather"
          >
            <RefreshCw
              size={18}
              className={
                refreshing
                  ? 'animate-spin'
                  : ''
              }
            />
          </button>

        </header>

        {/* Location */}
        <div className="mb-3 flex items-center gap-1.5 px-1 text-sm text-gray-500">

          <MapPin
            size={15}
          />

          <span>
            {
              weather
                .location
                .displayName
            }
          </span>

        </div>

        {/* Main weather */}
        <section className="mb-4 rounded-3xl bg-white p-6 shadow-sm">

          <div className="flex items-center gap-5">

            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#F1F6EC]">

              <WeatherIcon
                kind={
                  currentDescriptor
                    .kind
                }
                size={44}
                className="text-gray-800"
              />

            </div>

            <div>

              <p className="text-4xl font-bold text-gray-900">
                {
                  summary
                    .temperature
                }
                °C
              </p>

              <p className="mt-1 text-base font-semibold text-gray-700">
                {
                  currentDescriptor
                    .label
                }
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Feels like{' '}
                {feelsLike}°C
              </p>

            </div>

          </div>

          <div className="mt-5 border-t border-gray-100 pt-4">

            <p className="text-sm font-medium text-gray-700">
              {summary.detail}
            </p>

          </div>

        </section>

        {/* Stale weather notice */}
        {weather.isStale && (
          <section className="mb-4 rounded-xl bg-[#FBF7E8] px-4 py-3">

            <p className="text-sm text-gray-700">
              Internet weather update is unavailable. Showing the last saved forecast.
            </p>

          </section>
        )}

        {/* Overall farm status */}
        <section
          className={`mb-5 rounded-2xl border p-5 ${
            statusClasses[
              advice
                .dayStatus
                .level
            ]
          }`}
        >

          <p className="text-lg font-semibold text-gray-900">
            {
              advice
                .dayStatus
                .title
            }
          </p>

          <p className="mt-1 text-sm leading-5 text-gray-600">
            {
              advice
                .dayStatus
                .detail
            }
          </p>

        </section>

        {/* Today's weather details */}
        <section className="mb-5">

          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            Today
          </h2>

          <div className="grid grid-cols-2 gap-3">

            {/* High / low */}
            <div className="rounded-2xl bg-white p-4 shadow-sm">

              <Thermometer
                size={20}
                className="text-gray-500"
              />

              <p className="mt-3 text-xs font-medium text-gray-500">
                High / Low
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {
                  metrics
                    .maxTemp
                }
                ° /{' '}
                {
                  metrics
                    .minTemp
                }
                °
              </p>

            </div>

           {/* Rain remaining */}
<div className="rounded-2xl bg-white p-4 shadow-sm">

  <CloudRain
    size={20}
    className="text-gray-500"
  />

  <p className="mt-3 text-xs font-medium text-gray-500">
    {isRainingNow
      ? 'Rain from now'
      : 'Rain later'}
  </p>

  <p className="mt-1 font-semibold text-gray-900">
    {
      remainingRain
        .rainChance
    }
    %
  </p>

  <p className="mt-0.5 text-xs text-gray-500">
    {
      remainingRain
        .rainMm
        .toFixed(1)
    }{' '}
    mm remaining
  </p>

</div>

            {/* Humidity */}
            <div className="rounded-2xl bg-white p-4 shadow-sm">

              <Droplets
                size={20}
                className="text-gray-500"
              />

              <p className="mt-3 text-xs font-medium text-gray-500">
                Humidity now
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {
                  metrics
                    .humidity
                }
                %
              </p>

            </div>

            {/* Wind */}
            <div className="rounded-2xl bg-white p-4 shadow-sm">

              <Wind
                size={20}
                className="text-gray-500"
              />

              <p className="mt-3 text-xs font-medium text-gray-500">
                Max wind
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {
                  metrics
                    .maxWind
                }{' '}
                km/h
              </p>

              <p className="mt-0.5 text-xs text-gray-500">
                Gust{' '}
                {
                  metrics
                    .maxGust
                }{' '}
                km/h
              </p>

            </div>

          </div>

        </section>

        {/* Rain timing */}
        <section className="mb-5 rounded-2xl bg-white p-5 shadow-sm">

          <div className="mb-4 flex items-center gap-2">

            <CloudRain
              size={20}
            />

            <h2 className="text-lg font-semibold text-gray-900">
              Rain timing
            </h2>

          </div>

          {rainWindows.length ===
0 ? (
  <div>

    <p className="font-medium text-gray-800">
      No more rain expected today
    </p>

    <p className="mt-1 text-sm leading-5 text-gray-500">
      The forecast from now until tonight is mostly dry. Local showers can still develop, so check the sky before weather-sensitive work.
    </p>

  </div>
          ) : (
            <div className="space-y-3">

              {rainWindows
                .slice(
                  0,
                  3
                )
                .map(
                  (
                    window,
                    index
                  ) => (
                    <div
                      key={`${window.start}-${index}`}
                      className="flex items-center justify-between gap-4 rounded-xl bg-[#F7F5EF] px-4 py-3"
                    >

                      <div>

                        <p className="font-semibold text-gray-900">
                          {
                            window
                              .label
                          }
                        </p>

                        <p className="mt-0.5 text-xs text-gray-500">
                          Up to{' '}
                          {
                            window
                              .maxProbability
                          }
                          % chance
                        </p>

                      </div>

                      <p className="shrink-0 text-sm font-medium text-gray-600">
                        {
                          window
                            .rainMm
                            .toFixed(
                              1
                            )
                        }{' '}
                        mm
                      </p>

                    </div>
                  )
                )}

            </div>
          )}

        </section>

        {/* Farm plan */}
        <section className="mb-5">

          <h2 className="text-xl font-bold text-gray-900">
            Farm plan for today
          </h2>

          <p className="mt-1 text-sm leading-5 text-gray-500">
            Suggestions based on today's weather at the farm.
          </p>

        </section>

        <div className="space-y-4">

          <AdviceSection
            title="Good to do"
            items={
              advice.good
            }
            tone="good"
          />

          <AdviceSection
            title="Avoid / postpone"
            items={
              advice.avoid
            }
            tone="avoid"
          />

          <AdviceSection
            title="Be careful"
            items={
              advice.caution
            }
            tone="caution"
          />

        </div>

        {/* Next days */}
        <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm">

          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Next few days
          </h2>

          <div className="divide-y divide-gray-100">

            {forecast.map(
              (
                day,
                index
              ) => {
                const descriptor =
                  getWeatherDescriptor(
                    day
                      .weatherCode,
                    1
                  )

                return (
                  <div
                    key={
                      day.date
                    }
                    className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                  >

                    <div className="w-20 shrink-0">

                      <p className="text-sm font-medium text-gray-700">
                        {formatForecastDate(
                          day.date,
                          index
                        )}
                      </p>

                    </div>

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F7F5EF]">

                      <WeatherIcon
                        kind={
                          descriptor
                            .kind
                        }
                        size={20}
                        className="text-gray-700"
                      />

                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="truncate text-sm text-gray-600">
                        {
                          descriptor
                            .label
                        }
                      </p>

                    </div>

                    <div className="shrink-0 text-right">

                      <p className="text-sm font-semibold text-gray-900">
                        {
                          day
                            .maxTemp
                        }
                        ° /{' '}
                        {
                          day
                            .minTemp
                        }
                        °
                      </p>

                      <p className="mt-0.5 text-xs text-gray-500">
                        Rain{' '}
                        {
                          day
                            .rainChance
                        }
                        %
                      </p>

                    </div>

                  </div>
                )
              }
            )}

          </div>

        </section>

        {/* Guidance note */}
        <section className="mt-5 rounded-2xl bg-white p-4 shadow-sm">

          <div className="flex items-start gap-3">

            <Info
              size={19}
              className="mt-0.5 shrink-0 text-gray-500"
            />

            <div>

              <p className="text-sm font-medium text-gray-800">
                Weather guide
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                Farm suggestions use weather only. They do not know the exact soil condition, crop stage or chemical being used. Always check actual farm conditions and follow pesticide or fertiliser product instructions.
              </p>

            </div>

          </div>

        </section>

        {/* Updated */}
        <p className="mt-5 text-center text-xs text-gray-400">

          Updated{' '}
          {formatWeatherUpdatedTime(
            weather.fetchedAt
          )}

          {' · '}

          Weather data by Open-Meteo

        </p>

        <p className="mt-2 pb-4 text-center text-xs text-gray-400">
          Krishi Book · Farm Assistant
        </p>

      </main>

    </div>
  )
}

export default FarmWeather