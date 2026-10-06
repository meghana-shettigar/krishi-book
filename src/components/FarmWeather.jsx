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
  getDailyForecast,
  getFarmWeather,
  getRainWindows,
  getRemainingRainMetrics,
  getTodayMetrics,
  getWeatherBarSummary,
  getWeatherDescriptor,
} from '../utils/weather'

import {
  useLanguage,
} from '../i18n/LanguageContext'

function AdviceSection({
  title,
  items,
  tone,
  t,
  generatedText,
}) {
  if (
    !items?.length
  ) {
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
    styles[
      tone
    ]

  const Icon =
    style.Icon

  return (
    <section
      className={`rounded-2xl border p-5 ${style.wrapper}`}
    >

      <div className="mb-4 flex items-center gap-2">

        <Icon
          size={
            20
          }
          className={
            style.icon
          }
        />

        <h3 className="text-base font-semibold text-gray-900">
          {t(
            title
          )}
        </h3>

      </div>

      <div className="space-y-4">

        {items.map(
          (
            item
          ) => (
            <div
              key={
                item.title
              }
            >

              <p className="text-sm font-semibold text-gray-900">
                {generatedText(
                  item.title
                )}
              </p>

              <p className="mt-1 text-sm leading-5 text-gray-600">
                {generatedText(
                  item.detail
                )}
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
  farmLocation,
}) {
  const {
    t,
    generatedText,
    localizeTime,
    formatTime,
    formatForecastDate,
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
    refreshing,
    setRefreshing,
  ] =
    useState(false)

  const [
    error,
    setError,
  ] =
    useState('')

  const loadWeather =
    async (
      force =
        false
    ) => {
      try {
        if (
          force
        ) {
          setRefreshing(
            true
          )
        } else {
          setLoading(
            true
          )
        }

        setError('')

        const result =
          await getFarmWeather({
            force,

            location:
              farmLocation,
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
        setLoading(
          false
        )

        setRefreshing(
          false
        )
      }
    }

  useEffect(() => {
    loadWeather()
  }, [
    farmLocation?.latitude,
    farmLocation?.longitude,
  ])

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
              onClick={
                onBack
              }
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
            >
              <ArrowLeft
                size={
                  20
                }
              />
            </button>

            <div>

              <h1 className="text-2xl font-bold">
                {t(
                  'Farm Weather'
                )}
              </h1>

              <p className="text-sm text-gray-500">
                {t(
                  "Checking today's conditions..."
                )}
              </p>

            </div>

          </header>

          <section className="rounded-2xl bg-white p-8 text-center shadow-sm">

            <RefreshCw
              size={
                28
              }
              className="mx-auto animate-spin"
            />

            <p className="mt-4 text-sm text-gray-500">
              {t(
                'Getting farm weather...'
              )}
            </p>

          </section>

        </main>

      </div>
    )
  }

  if (
    !weather
  ) {
    return (
      <div className="min-h-screen bg-[#F7F5EF]">

        <main className="mx-auto min-h-screen w-full max-w-md px-5 py-6">

          <header className="mb-8 flex items-center gap-3">

            <button
              type="button"
              onClick={
                onBack
              }
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
            >
              <ArrowLeft
                size={
                  20
                }
              />
            </button>

            <div>

              <h1 className="text-2xl font-bold">
                {t(
                  'Farm Weather'
                )}
              </h1>

              <p className="text-sm text-gray-500">
                {t(
                  'Should we do farm work today?'
                )}
              </p>

            </div>

          </header>

          <section className="rounded-2xl bg-white p-7 text-center shadow-sm">

            <CloudRain
              size={
                32
              }
              className="mx-auto text-gray-400"
            />

            <p className="mt-4 font-semibold">
              {t(
                'Weather unavailable'
              )}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              {t(
                error
              )}
            </p>

            <button
              type="button"
              onClick={() =>
                loadWeather(
                  true
                )
              }
              className="mt-5 rounded-xl bg-gray-900 px-5 py-3 text-white"
            >
              {t(
                'Try Again'
              )}
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
    weather.current ||
    {}

  const currentDescriptor =
    getWeatherDescriptor(
      Number(
        current
          .weather_code ||
        0
      ),
      Number(
        current
          .is_day ??
        1
      )
    )

  const isRainingNow =
    currentDescriptor
      .kind ===
      'rain' ||
    currentDescriptor
      .kind ===
      'drizzle' ||
    currentDescriptor
      .kind ===
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

        <header className="mb-6 flex items-center gap-3">

          <button
            type="button"
            onClick={
              onBack
            }
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
          >
            <ArrowLeft
              size={
                20
              }
            />
          </button>

          <div className="min-w-0 flex-1">

            <h1 className="text-2xl font-bold">
              {t(
                'Farm Weather'
              )}
            </h1>

            <p className="text-sm text-gray-500">
              {t(
                'Should we do farm work today?'
              )}
            </p>

          </div>

          <button
            type="button"
            aria-label={
              t(
                'Refresh weather'
              )
            }
            onClick={() =>
              loadWeather(
                true
              )
            }
            disabled={
              refreshing
            }
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
          >
            <RefreshCw
              size={
                18
              }
              className={
                refreshing
                  ? 'animate-spin'
                  : ''
              }
            />
          </button>

        </header>

        <div className="mb-3 flex items-center gap-1.5 px-1 text-sm text-gray-500">

          <MapPin
            size={
              15
            }
          />

          <span>
            {
              weather
                .location
                .displayName
            }
          </span>

        </div>

        <section className="mb-4 rounded-3xl bg-white p-6 shadow-sm">

          <div className="flex items-center gap-5">

            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#F1F6EC]">

              <WeatherIcon
                kind={
                  currentDescriptor
                    .kind
                }
                size={
                  44
                }
              />

            </div>

            <div>

              <p className="text-4xl font-bold">
                {
                  summary
                    .temperature
                }
                °C
              </p>

              <p className="mt-1 font-semibold text-gray-700">
                {generatedText(
                  currentDescriptor
                    .label
                )}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {t(
                  'Feels like'
                )}{' '}
                {feelsLike}
                °C
              </p>

            </div>

          </div>

          <div className="mt-5 border-t pt-4">

            <p className="text-sm font-medium text-gray-700">
              {generatedText(
                summary.detail
              )}
            </p>

          </div>

        </section>

        {weather.isStale && (
          <section className="mb-4 rounded-xl bg-[#FBF7E8] px-4 py-3">
            {t(
              'Internet weather update is unavailable. Showing the last saved forecast.'
            )}
          </section>
        )}

        <section
          className={`mb-5 rounded-2xl border p-5 ${
            statusClasses[
              advice
                .dayStatus
                .level
            ]
          }`}
        >

          <p className="text-lg font-semibold">
            {generatedText(
              advice
                .dayStatus
                .title
            )}
          </p>

          <p className="mt-1 text-sm text-gray-600">
            {generatedText(
              advice
                .dayStatus
                .detail
            )}
          </p>

        </section>

        <section className="mb-5">

          <h2 className="mb-3 text-lg font-semibold">
            {t(
              'Today'
            )}
          </h2>

          <div className="grid grid-cols-2 gap-3">

            <div className="rounded-2xl bg-white p-4 shadow-sm">

              <Thermometer
                size={
                  20
                }
              />

              <p className="mt-3 text-xs text-gray-500">
                {t(
                  'High / Low'
                )}
              </p>

              <p className="mt-1 font-semibold">
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

            <div className="rounded-2xl bg-white p-4 shadow-sm">

              <CloudRain
                size={
                  20
                }
              />

              <p className="mt-3 text-xs text-gray-500">
                {isRainingNow
                  ? t(
                      'Rain from now'
                    )
                  : t(
                      'Rain later'
                    )}
              </p>

              <p className="mt-1 font-semibold">
                {
                  remainingRain
                    .rainChance
                }
                %
              </p>

              <p className="text-xs text-gray-500">
                {
                  remainingRain
                    .rainMm
                    .toFixed(
                      1
                    )
                }{' '}
                {t(
                  'mm remaining'
                )}
              </p>

            </div>

            <div className="rounded-2xl bg-white p-4 shadow-sm">

              <Droplets
                size={
                  20
                }
              />

              <p className="mt-3 text-xs text-gray-500">
                {t(
                  'Humidity now'
                )}
              </p>

              <p className="mt-1 font-semibold">
                {
                  metrics
                    .humidity
                }
                %
              </p>

            </div>

            <div className="rounded-2xl bg-white p-4 shadow-sm">

              <Wind
                size={
                  20
                }
              />

              <p className="mt-3 text-xs text-gray-500">
                {t(
                  'Max wind'
                )}
              </p>

              <p className="mt-1 font-semibold">
                {
                  metrics
                    .maxWind
                }{' '}
                {t(
                  'km/h'
                )}
              </p>

              <p className="text-xs text-gray-500">
                {t(
                  'Gust'
                )}{' '}
                {
                  metrics
                    .maxGust
                }{' '}
                {t(
                  'km/h'
                )}
              </p>

            </div>

          </div>

        </section>

        <section className="mb-5 rounded-2xl bg-white p-5 shadow-sm">

          <div className="mb-4 flex items-center gap-2">

            <CloudRain
              size={
                20
              }
            />

            <h2 className="text-lg font-semibold">
              {t(
                'Rain timing'
              )}
            </h2>

          </div>

          {rainWindows
            .length ===
          0 ? (
            <>
              <p className="font-medium">
                {t(
                  'No more rain expected today'
                )}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {t(
                  'The forecast from now until tonight is mostly dry. Local showers can still develop, so check the sky before weather-sensitive work.'
                )}
              </p>
            </>
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
                      className="flex items-center justify-between rounded-xl bg-[#F7F5EF] px-4 py-3"
                    >

                      <div>

                        <p className="font-semibold">
                          {localizeTime(
                            window.label
                          )}
                        </p>

                        <p className="text-xs text-gray-500">
                          {t(
                            'Up to {chance}% chance',
                            {
                              chance:
                                window
                                  .maxProbability,
                            }
                          )}
                        </p>

                      </div>

                      <p className="text-sm text-gray-600">
                        {
                          window
                            .rainMm
                            .toFixed(
                              1
                            )
                        }{' '}
                        {t(
                          'mm'
                        )}
                      </p>

                    </div>
                  )
                )}

            </div>
          )}

        </section>

        <section className="mb-5">

          <h2 className="text-xl font-bold">
            {t(
              'Farm plan for today'
            )}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {t(
              "Suggestions based on today's weather at the farm."
            )}
          </p>

        </section>

        <div className="space-y-4">

          <AdviceSection
            title="Good to do"
            items={
              advice.good
            }
            tone="good"
            t={
              t
            }
            generatedText={
              generatedText
            }
          />

          <AdviceSection
            title="Avoid / postpone"
            items={
              advice.avoid
            }
            tone="avoid"
            t={
              t
            }
            generatedText={
              generatedText
            }
          />

          <AdviceSection
            title="Be careful"
            items={
              advice.caution
            }
            tone="caution"
            t={
              t
            }
            generatedText={
              generatedText
            }
          />

        </div>

        <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm">

          <h2 className="mb-4 text-lg font-semibold">
            {t(
              'Next few days'
            )}
          </h2>

          <div className="divide-y">

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
                    className="flex items-center gap-3 py-3"
                  >

                    <div className="w-24 shrink-0 text-sm">
                      {formatForecastDate(
                        day.date,
                        index,
                        weather.timezone
                      )}
                    </div>

                    <WeatherIcon
                      kind={
                        descriptor
                          .kind
                      }
                      size={
                        20
                      }
                    />

                    <div className="min-w-0 flex-1 text-sm text-gray-600">
                      {generatedText(
                        descriptor.label
                      )}
                    </div>

                    <div className="text-right">

                      <p className="text-sm font-semibold">
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

                      <p className="text-xs text-gray-500">
                        {t(
                          'Rain {chance}%',
                          {
                            chance:
                              day
                                .rainChance,
                          }
                        )}
                      </p>

                    </div>

                  </div>
                )
              }
            )}

          </div>

        </section>

        <section className="mt-5 rounded-2xl bg-white p-4 shadow-sm">

          <div className="flex items-start gap-3">

            <Info
              size={
                19
              }
            />

            <div>

              <p className="text-sm font-medium">
                {t(
                  'Weather guide'
                )}
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                {t(
                  'Farm suggestions use weather only. They do not know the exact soil condition, crop stage or chemical being used. Always check actual farm conditions and follow pesticide or fertiliser product instructions.'
                )}
              </p>

            </div>

          </div>

        </section>

        <p className="mt-5 text-center text-xs text-gray-400">

          {t(
            'Updated'
          )}{' '}

          {formatTime(
            weather.fetchedAt,
            weather.timezone
          )}

          {' · '}

          {t(
            'Weather data by Open-Meteo'
          )}

        </p>

        <p className="mt-2 pb-4 text-center text-xs text-gray-400">
          {t(
            'Krishi Book · Farm Assistant'
          )}
        </p>

      </main>

    </div>
  )
}

export default FarmWeather