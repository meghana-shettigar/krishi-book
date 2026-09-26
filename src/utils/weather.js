import {
  FARM_LOCATION,
} from '../config/farmLocation'

const WEATHER_CACHE_KEY =
  'krishiBookFarmWeatherV1'

const WEATHER_CACHE_MS =
  20 * 60 * 1000

const RAIN_PROBABILITY_THRESHOLD =
  50

/*
 * --------------------------------
 * CACHE
 * --------------------------------
 */

function readWeatherCache() {
  try {
    const raw =
      localStorage.getItem(
        WEATHER_CACHE_KEY
      )

    if (!raw) {
      return null
    }

    return JSON.parse(raw)
  } catch (error) {
    console.error(
      'Unable to read weather cache:',
      error
    )

    return null
  }
}

function saveWeatherCache(data) {
  try {
    localStorage.setItem(
      WEATHER_CACHE_KEY,
      JSON.stringify({
        savedAt: Date.now(),
        data,
      })
    )
  } catch (error) {
    console.error(
      'Unable to save weather cache:',
      error
    )
  }
}

/*
 * --------------------------------
 * OPEN-METEO REQUEST
 * --------------------------------
 */

function buildWeatherUrl() {
  const url = new URL(
    'https://api.open-meteo.com/v1/forecast'
  )

  url.searchParams.set(
    'latitude',
    String(
      FARM_LOCATION.latitude
    )
  )

  url.searchParams.set(
    'longitude',
    String(
      FARM_LOCATION.longitude
    )
  )

  url.searchParams.set(
    'timezone',
    FARM_LOCATION.timezone
  )

  url.searchParams.set(
    'forecast_days',
    '4'
  )

  /*
   * Current weather
   */
  url.searchParams.set(
    'current',
    [
      'temperature_2m',
      'apparent_temperature',
      'relative_humidity_2m',
      'precipitation',
      'rain',
      'weather_code',
      'cloud_cover',
      'wind_speed_10m',
      'wind_gusts_10m',
      'is_day',
    ].join(',')
  )

  /*
   * Hourly weather
   *
   * Used mainly for rain timing
   * and farming recommendations.
   */
  url.searchParams.set(
    'hourly',
    [
      'temperature_2m',
      'relative_humidity_2m',
      'precipitation_probability',
      'precipitation',
      'rain',
      'weather_code',
      'wind_speed_10m',
      'wind_gusts_10m',
      'cloud_cover',
    ].join(',')
  )

  /*
   * Daily weather
   */
  url.searchParams.set(
    'daily',
    [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_sum',
      'precipitation_probability_max',
      'wind_speed_10m_max',
      'wind_gusts_10m_max',
      'sunrise',
      'sunset',
      'uv_index_max',
      'et0_fao_evapotranspiration',
      'sunshine_duration',
    ].join(',')
  )

  return url.toString()
}

/*
 * --------------------------------
 * GET WEATHER
 * --------------------------------
 */

export async function getFarmWeather({
  force = false,
} = {}) {
  const cached =
    readWeatherCache()

  /*
   * Reuse a recent forecast.
   */
  if (
    !force &&
    cached?.data &&
    Date.now() - cached.savedAt <
      WEATHER_CACHE_MS
  ) {
    return {
      ...cached.data,

      fromCache: true,
      isStale: false,
    }
  }

  try {
    const response =
      await fetch(
        buildWeatherUrl()
      )

    if (!response.ok) {
      throw new Error(
        `Weather request failed: ${response.status}`
      )
    }

    const forecast =
      await response.json()

    const weather = {
      location:
        FARM_LOCATION,

      fetchedAt:
        Date.now(),

      timezone:
        forecast.timezone ||
        FARM_LOCATION.timezone,

      current:
        forecast.current,

      hourly:
        forecast.hourly,

      daily:
        forecast.daily,
    }

    saveWeatherCache(
      weather
    )

    return {
      ...weather,

      fromCache: false,
      isStale: false,
    }
  } catch (error) {
    /*
     * If internet/weather API fails,
     * still show the last forecast.
     */
    if (cached?.data) {
      return {
        ...cached.data,

        fromCache: true,
        isStale: true,
        fetchError: true,
      }
    }

    throw error
  }
}

/*
 * --------------------------------
 * WEATHER CODE
 * --------------------------------
 */

export function getWeatherDescriptor(
  code,
  isDay = 1
) {
  if (code === 0) {
    return {
      label:
        isDay
          ? 'Sunny'
          : 'Clear',

      kind: 'clear',
    }
  }

  if (code === 1) {
    return {
      label:
        'Mostly clear',

      kind:
        'partly-cloudy',
    }
  }

  if (code === 2) {
    return {
      label:
        'Partly cloudy',

      kind:
        'partly-cloudy',
    }
  }

  if (code === 3) {
    return {
      label: 'Cloudy',
      kind: 'cloudy',
    }
  }

  if (
    code === 45 ||
    code === 48
  ) {
    return {
      label: 'Foggy',
      kind: 'fog',
    }
  }

  if (
    [
      51,
      53,
      55,
      56,
      57,
    ].includes(code)
  ) {
    return {
      label: 'Drizzle',
      kind: 'drizzle',
    }
  }

  if (
    [
      61,
      63,
      65,
      66,
      67,
    ].includes(code)
  ) {
    return {
      label: 'Rain',
      kind: 'rain',
    }
  }

  if (
    [
      80,
      81,
      82,
    ].includes(code)
  ) {
    return {
      label:
        'Rain showers',

      kind: 'rain',
    }
  }

  if (
    [
      71,
      73,
      75,
      77,
      85,
      86,
    ].includes(code)
  ) {
    return {
      label: 'Snow',
      kind: 'snow',
    }
  }

  if (
    [
      95,
      96,
      99,
    ].includes(code)
  ) {
    return {
      label:
        'Thunderstorm',

      kind: 'storm',
    }
  }

  return {
    label: 'Weather',
    kind: 'cloudy',
  }
}

/*
 * --------------------------------
 * TIME HELPERS
 * --------------------------------
 */

function getHourNumber(
  localIso
) {
  if (!localIso) {
    return 0
  }

  const timePart =
    localIso.split('T')[1] ||
    '00:00'

  return Number(
    timePart.split(':')[0] ||
      0
  )
}

function formatHourNumber(
  hour
) {
  const normalized =
    ((hour % 24) + 24) %
    24

  const suffix =
    normalized >= 12
      ? 'PM'
      : 'AM'

  const displayHour =
    normalized % 12 ||
    12

  return `${displayHour} ${suffix}`
}

export function formatForecastHour(
  localIso
) {
  return formatHourNumber(
    getHourNumber(
      localIso
    )
  )
}

function getTodayDate(
  weather
) {
  return (
    weather?.daily
      ?.time?.[0] ||
    weather?.current
      ?.time?.slice(
        0,
        10
      ) ||
    ''
  )
}

function getCurrentHourIso(
  weather
) {
  const currentTime =
    weather?.current?.time

  if (!currentTime) {
    return ''
  }

  return `${currentTime.slice(
    0,
    13
  )}:00`
}

/*
 * --------------------------------
 * RAIN WINDOWS
 * --------------------------------
 */

function isRainHour(
  probability,
  precipitation,
  weatherCode
) {
  const descriptor =
    getWeatherDescriptor(
      weatherCode,
      1
    )

  return (
    Number(
      precipitation || 0
    ) >= 0.1 ||

    Number(
      probability || 0
    ) >=
      RAIN_PROBABILITY_THRESHOLD ||

    descriptor.kind ===
      'rain' ||

    descriptor.kind ===
      'drizzle' ||

    descriptor.kind ===
      'storm'
  )
}

/*
 * Converts individual hourly rain
 * forecasts into useful windows such
 * as "2 PM–5 PM".
 */
export function getRainWindows(
  weather,
  date =
    getTodayDate(weather)
) {
  const hourly =
    weather?.hourly

  if (
    !hourly?.time?.length
  ) {
    return []
  }

  const currentHour =
    getCurrentHourIso(
      weather
    )

  const onlyFuture =
    date ===
    getTodayDate(
      weather
    )

  const matchingHours = []

  hourly.time.forEach(
    (time, index) => {
      if (
        !time.startsWith(
          date
        )
      ) {
        return
      }

      /*
       * For today, don't show
       * rain windows that already
       * passed.
       */
      if (
        onlyFuture &&
        currentHour &&
        time < currentHour
      ) {
        return
      }

      const probability =
        Number(
          hourly
            .precipitation_probability?.[
            index
          ] || 0
        )

      const precipitation =
        Number(
          hourly
            .precipitation?.[
            index
          ] || 0
        )

      const weatherCode =
        Number(
          hourly
            .weather_code?.[
            index
          ] || 0
        )

      if (
        isRainHour(
          probability,
          precipitation,
          weatherCode
        )
      ) {
        matchingHours.push({
          index,
          time,
          probability,
          precipitation,
          weatherCode,
        })
      }
    }
  )

  if (
    matchingHours.length ===
    0
  ) {
    return []
  }

  const windows = []

  let currentWindow =
    null

  matchingHours.forEach(
    (hour) => {
      /*
       * Start first window
       */
      if (!currentWindow) {
        currentWindow = {
          start:
            hour.time,

          end:
            hour.time,

          startIndex:
            hour.index,

          endIndex:
            hour.index,

          maxProbability:
            hour.probability,

          rainMm:
            hour.precipitation,

          hasStorm:
            getWeatherDescriptor(
              hour.weatherCode,
              1
            ).kind ===
            'storm',
        }

        return
      }

      /*
       * Continue same window
       */
      if (
        hour.index ===
        currentWindow
          .endIndex +
          1
      ) {
        currentWindow.end =
          hour.time

        currentWindow.endIndex =
          hour.index

        currentWindow
          .maxProbability =
          Math.max(
            currentWindow
              .maxProbability,

            hour.probability
          )

        currentWindow.rainMm +=
          hour.precipitation

        currentWindow.hasStorm =
          currentWindow
            .hasStorm ||

          getWeatherDescriptor(
            hour.weatherCode,
            1
          ).kind ===
            'storm'

        return
      }

      /*
       * Close previous window
       */
      windows.push(
        currentWindow
      )

      currentWindow = {
        start:
          hour.time,

        end:
          hour.time,

        startIndex:
          hour.index,

        endIndex:
          hour.index,

        maxProbability:
          hour.probability,

        rainMm:
          hour.precipitation,

        hasStorm:
          getWeatherDescriptor(
            hour.weatherCode,
            1
          ).kind ===
          'storm',
      }
    }
  )

  if (currentWindow) {
    windows.push(
      currentWindow
    )
  }

  /*
   * Convert:
   *
   * 14:00, 15:00, 16:00
   *
   * to:
   *
   * 2 PM–5 PM
   */
  return windows.map(
    (window) => ({
      ...window,

      label:
        `${formatForecastHour(
          window.start
        )}–${formatHourNumber(
          getHourNumber(
            window.end
          ) + 1
        )}`,
    })
  )
}

/*
 * --------------------------------
 * NEXT HOURS
 * --------------------------------
 */

function getFutureHours(
  weather,
  count = 6
) {
  const hourly =
    weather?.hourly

  const currentHour =
    getCurrentHourIso(
      weather
    )

  if (
    !hourly?.time?.length ||
    !currentHour
  ) {
    return []
  }

  const output = []

  hourly.time.forEach(
    (time, index) => {
      if (
        time < currentHour ||
        output.length >=
          count
      ) {
        return
      }

      output.push({
        time,

        precipitationProbability:
          Number(
            hourly
              .precipitation_probability?.[
              index
            ] || 0
          ),

        precipitation:
          Number(
            hourly
              .precipitation?.[
              index
            ] || 0
          ),

        weatherCode:
          Number(
            hourly
              .weather_code?.[
              index
            ] || 0
          ),

        windSpeed:
          Number(
            hourly
              .wind_speed_10m?.[
              index
            ] || 0
          ),

        windGust:
          Number(
            hourly
              .wind_gusts_10m?.[
              index
            ] || 0
          ),
      })
    }
  )

  return output
}

/*
 * --------------------------------
 * HOME WEATHER BAR
 * --------------------------------
 */

export function getWeatherBarSummary(
  weather
) {
  const current =
    weather?.current

  const descriptor =
    getWeatherDescriptor(
      Number(
        current
          ?.weather_code ||
          0
      ),

      Number(
        current?.is_day ??
          1
      )
    )

  const temperature =
    Math.round(
      Number(
        current
          ?.temperature_2m ||
          0
      )
    )

  /*
   * Rain windows contain only
   * current/future hours today.
   */
  const rainWindows =
    getRainWindows(
      weather
    )

  const firstWindow =
    rainWindows[0]

  /*
   * Whole-day forecast.
   *
   * We use this only to decide
   * whether "no MORE rain" is
   * clearer than "no rain".
   */
  const today =
    getTodayMetrics(
      weather
    )

  /*
   * Weather remaining from now.
   */
  const remainingRain =
    getRemainingRainMetrics(
      weather
    )

  const isRainingNow =
    descriptor.kind ===
      'rain' ||
    descriptor.kind ===
      'drizzle' ||
    descriptor.kind ===
      'storm'

  const hadRainRiskToday =
    today.rainMm >= 0.1 ||
    today.rainChance >= 30

  let detail = ''

  /*
   * Raining right now.
   */
  if (isRainingNow) {
    if (firstWindow) {
      const parts =
        firstWindow.label.split(
          '–'
        )

      const endTime =
        parts[1]

      detail =
        endTime
          ? `Rain now · likely until ${endTime}`
          : 'Rain now'
    } else {
      detail =
        'Rain now'
    }
  }

  /*
   * Not raining now but rain
   * is forecast later.
   */
  else if (
    firstWindow
  ) {
    detail =
      `Rain likely ${firstWindow.label}`
  }

  /*
   * No rain left today, but the
   * full-day forecast contained
   * rain earlier.
   */
  else if (
    hadRainRiskToday
  ) {
    detail =
      'No more rain expected today'
  }

  /*
   * Dry whole day.
   */
  else {
    detail =
      'No rain expected today'
  }

  return {
    descriptor,

    temperature,

    remainingRain,

    title:
      `${descriptor.label} · ${temperature}°C`,

    detail,
  }
}

/*
 * --------------------------------
 * TODAY'S METRICS
 * --------------------------------
 */

export function getTodayMetrics(
  weather
) {
  const daily =
    weather?.daily || {}

  const current =
    weather?.current || {}

  return {
    maxTemp:
      Math.round(
        Number(
          daily
            .temperature_2m_max?.[
            0
          ] || 0
        )
      ),

    minTemp:
      Math.round(
        Number(
          daily
            .temperature_2m_min?.[
            0
          ] || 0
        )
      ),

    rainChance:
      Math.round(
        Number(
          daily
            .precipitation_probability_max?.[
            0
          ] || 0
        )
      ),

    rainMm:
      Number(
        daily
          .precipitation_sum?.[
          0
        ] || 0
      ),

    maxWind:
      Math.round(
        Number(
          daily
            .wind_speed_10m_max?.[
            0
          ] || 0
        )
      ),

    maxGust:
      Math.round(
        Number(
          daily
            .wind_gusts_10m_max?.[
            0
          ] || 0
        )
      ),

    humidity:
      Math.round(
        Number(
          current
            .relative_humidity_2m ||
            0
        )
      ),

    uvIndex:
      Number(
        daily
          .uv_index_max?.[
          0
        ] || 0
      ),

    et0:
      Number(
        daily
          .et0_fao_evapotranspiration?.[
          0
        ] || 0
      ),

    sunshineHours:
      Number(
        daily
          .sunshine_duration?.[
          0
        ] || 0
      ) / 3600,
  }
}

/*
 * --------------------------------
 * WEATHER REMAINING TODAY
 * --------------------------------
 *
 * Unlike daily forecast values,
 * this only looks at the current
 * hour and future hours today.
 *
 * This is what we should use for
 * decisions such as:
 *
 * - Can we dry produce now?
 * - Is rain still coming?
 * - Should we spray?
 * - Is irrigation needed?
 */

export function getRemainingRainMetrics(
  weather
) {
  const hourly =
    weather?.hourly

  if (
    !hourly?.time?.length
  ) {
    return {
      rainChance: 0,
      rainMm: 0,
      rainHours: 0,
    }
  }

  const today =
    getTodayDate(
      weather
    )

  const currentHour =
    getCurrentHourIso(
      weather
    )

  let rainChance = 0
  let rainMm = 0
  let rainHours = 0

  hourly.time.forEach(
    (time, index) => {
      /*
       * Only look at today.
       */
      if (
        !time.startsWith(
          today
        )
      ) {
        return
      }

      /*
       * Ignore hours that have
       * already passed.
       */
      if (
        currentHour &&
        time < currentHour
      ) {
        return
      }

      const probability =
        Number(
          hourly
            .precipitation_probability?.[
            index
          ] || 0
        )

      const precipitation =
        Number(
          hourly
            .precipitation?.[
            index
          ] || 0
        )

      const weatherCode =
        Number(
          hourly
            .weather_code?.[
            index
          ] || 0
        )

      rainChance =
        Math.max(
          rainChance,
          probability
        )

      rainMm +=
        precipitation

      if (
        isRainHour(
          probability,
          precipitation,
          weatherCode
        )
      ) {
        rainHours += 1
      }
    }
  )

  return {
    /*
     * Maximum probability during
     * the remaining hours.
     */
    rainChance:
      Math.round(
        rainChance
      ),

    /*
     * Expected precipitation from
     * now until midnight.
     */
    rainMm:
      Math.round(
        rainMm * 10
      ) / 10,

    rainHours,
  }
}

/*
 * --------------------------------
 * FARM ADVICE
 * --------------------------------
 *
 * This intentionally uses simple,
 * transparent weather rules.
 *
 * It does NOT attempt to diagnose
 * crop disease or replace local
 * agricultural/product guidance.
 */

export function buildFarmAdvice(
  weather
) {
const metrics =
  getTodayMetrics(
    weather
  )

/*
 * Rain from NOW until the end
 * of today.
 */
const remainingRain =
  getRemainingRainMetrics(
    weather
  )

const rainWindows =
  getRainWindows(
    weather
  )

  const nextSixHours =
    getFutureHours(
      weather,
      6
    )

  const rainNextSixHours =
    nextSixHours.some(
      (hour) =>
        isRainHour(
          hour
            .precipitationProbability,

          hour
            .precipitation,

          hour
            .weatherCode
        )
    )

  const thunderToday =
    nextSixHours.some(
      (hour) =>
        getWeatherDescriptor(
          hour.weatherCode,
          1
        ).kind ===
        'storm'
    ) ||

    rainWindows.some(
      (window) =>
        window.hasStorm
    )

  /*
   * These are deliberately broad
   * app heuristics, not official
   * agronomic thresholds.
   */
const heavyRain =
  remainingRain.rainMm >=
    15 ||

  (
    remainingRain
      .rainChance >= 80 &&

    remainingRain
      .rainMm >= 8
  )

const wetDay =
  remainingRain.rainMm >=
    2 ||

  remainingRain
    .rainChance >= 50

  const strongWind =
    metrics.maxWind >= 20 ||

    metrics.maxGust >= 30

  const veryWindy =
    metrics.maxWind >= 30 ||

    metrics.maxGust >= 40

  /*
   * Separate, more conservative
   * threshold for spray advice.
   */
  const sprayWindRisk =
    metrics.maxWind >= 15 ||

    metrics.maxGust >= 25

  const veryHot =
    metrics.maxTemp >= 35

const goodDrying =
  remainingRain.rainMm <
    0.5 &&

  remainingRain
    .rainChance < 25 &&

  metrics.sunshineHours >=
    5

const possibleDrying =
  remainingRain.rainMm <
    1 &&

  remainingRain
    .rainChance < 40 &&

  metrics.sunshineHours >=
    3

  const firstRain =
    rainWindows[0]

  const good = []
  const avoid = []
  const caution = []

  /*
   * DRYING
   */
  if (goodDrying) {
    good.push({
      title:
        'Dry coconut / arecanut outdoors',

      detail:
        'A relatively dry and sunny day is forecast. Keep checking the sky because local showers can still develop.',
    })
  } else if (
    possibleDrying
  ) {
    caution.push({
      title:
        'Drying may be possible for part of the day',

      detail:
        firstRain
          ? `Keep produce ready to cover or move before the likely rain window ${firstRain.label}.`
          : 'Cloud or limited sunshine may slow drying even though significant rain is not expected.',
    })
  } else {
    avoid.push({
      title:
        'Avoid outdoor drying',

      detail:
        firstRain
          ? `Rain is possible around ${firstRain.label}. Keep coconut, arecanut and other produce covered.`
          : 'Today does not look suitable for reliable outdoor drying.',
    })
  }

  /*
   * TREE / HARVEST WORK
   */
  if (
    thunderToday ||
    veryWindy
  ) {
    avoid.push({
      title:
        'Avoid coconut / arecanut tree climbing',

      detail:
        'Thunderstorms or strong gusts can make tree work dangerous. Wait for calmer, dry conditions.',
    })
  } else if (
    wetDay ||
    strongWind
  ) {
    caution.push({
      title:
        'Tree work only in a dry, calm window',

      detail:
        'Check rain, wind and the actual condition at the farm before climbing or harvesting.',
    })
  } else {
    good.push({
      title:
        'Harvesting / tree work looks more suitable',

      detail:
        'The forecast is relatively dry and calm. Still check conditions at the farm before climbing.',
    })
  }

  /*
   * GENERAL FARM CLEANING
   */
  if (
    thunderToday ||
    heavyRain
  ) {
    good.push({
      title:
        'Do covered farm work instead',

      detail:
        'Clean tools, organise supplies, sort produce under cover, or update farm records.',
    })
  } else if (wetDay) {
    good.push({
      title:
        'Farm cleaning under cover',

      detail:
        'Cleaning tools, sheds and covered work areas can still be useful when outdoor work is interrupted by rain.',
    })
  } else {
    good.push({
      title:
        'Farm cleaning / light weeding',

      detail:
        'Weather looks suitable for general cleaning and lighter outdoor work.',
    })
  }

  /*
   * DRAINAGE
   */
if (
  heavyRain ||
  remainingRain
    .rainChance >= 70
) {
    good.push({
      title:
        'Check and clear drainage before rain',

      detail:
        firstRain
          ? `If safe, clear blocked drains before the likely rain window ${firstRain.label}.`
          : 'Keep drainage paths clear before heavier rain develops.',
    })
  }

  /*
   * PLANTING
   */
  if (
    wetDay &&
    !heavyRain &&
    !thunderToday
  ) {
    good.push({
      title:
        'Planting / new plants may suit the moisture',

      detail:
        'Light rain can help soil moisture. Avoid planting in waterlogged or poorly drained spots.',
    })
  }

  /*
   * PESTICIDE SPRAYING
   */
  if (
    rainNextSixHours ||
    sprayWindRisk ||
    thunderToday
  ) {
    avoid.push({
      title:
        'Pesticide spraying',

      detail:
        'Rain or wind can reduce spray effectiveness and increase drift. Follow the product label and spray only when local conditions are suitable.',
    })
  } else {
    caution.push({
      title:
        'Spraying may be possible',

      detail:
        'The next few hours look drier and calmer, but check the pesticide label and the wind at the field before spraying.',
    })
  }

  /*
   * FERTILISER / COMPOST
   */
  if (heavyRain) {
    avoid.push({
      title:
        'Fertiliser / compost application before heavy rain',

      detail:
        'Heavy rain can wash nutrients away or cause runoff. Wait for a more suitable window and follow the product guidance.',
    })
  } else if (wetDay) {
    caution.push({
      title:
        'Check fertiliser timing',

      detail:
        'Rain timing matters. Avoid application immediately before heavy rain and follow the product instructions.',
    })
  }

  /*
   * IRRIGATION
   */
if (
  remainingRain.rainMm >=
    5 ||

  remainingRain
    .rainChance >= 70
) {
    avoid.push({
      title:
        'Routine irrigation may not be needed',

      detail:
        'Rain is expected. Check actual soil moisture before watering.',
    })
} else if (
  metrics.et0 >= 4 &&
  remainingRain.rainMm <
    1
) {
    caution.push({
      title:
        'Check soil moisture for irrigation',

      detail:
        'The day may be relatively drying. Water only if the crop and soil actually need it.',
    })
  }

  /*
   * HEAT
   */
  if (veryHot) {
    caution.push({
      title:
        'Reduce heavy work around midday',

      detail:
        'High daytime temperature is expected. Prefer cooler morning or late-afternoon work where possible.',
    })
  }

  /*
   * THUNDERSTORM SAFETY
   */
  if (thunderToday) {
    avoid.unshift({
      title:
        'Outdoor work during thunder',

      detail:
        'Stop exposed outdoor work if thunder or lightning develops and move to a safe shelter.',
    })
  }

  /*
   * OVERALL DAY STATUS
   */
  let dayStatus = {
    level: 'good',

    title:
      'Good day for farm work',

    detail:
      'Most routine outdoor work looks possible, with normal on-site checks.',
  }

  if (
    wetDay ||
    strongWind
  ) {
    dayStatus = {
      level: 'mixed',

      title:
        'Plan farm work around the weather',

      detail:
        firstRain
          ? `A likely rain window is ${firstRain.label}. Use the drier periods for outdoor work.`
          : 'Some rain or stronger wind may interrupt outdoor work.',
    }
  }

  if (
    heavyRain ||
    thunderToday ||
    veryWindy
  ) {
    dayStatus = {
      level: 'poor',

      title:
        'Outdoor work may be disrupted today',

      detail:
        thunderToday
          ? 'Thunderstorms are possible. Prioritise safety and covered work.'
          : 'Heavy rain or strong wind is expected. Prefer safer or covered tasks.',
    }
  }

  return {
    dayStatus,

    good:
      good.slice(
        0,
        5
      ),

    avoid:
      avoid.slice(
        0,
        5
      ),

    caution:
      caution.slice(
        0,
        5
      ),
  }
}

/*
 * --------------------------------
 * NEXT DAYS
 * --------------------------------
 */

export function getDailyForecast(
  weather
) {
  const daily =
    weather?.daily

  if (
    !daily?.time?.length
  ) {
    return []
  }

  return daily.time.map(
    (date, index) => ({
      date,

      weatherCode:
        Number(
          daily
            .weather_code?.[
            index
          ] || 0
        ),

      maxTemp:
        Math.round(
          Number(
            daily
              .temperature_2m_max?.[
              index
            ] || 0
          )
        ),

      minTemp:
        Math.round(
          Number(
            daily
              .temperature_2m_min?.[
              index
            ] || 0
          )
        ),

      rainChance:
        Math.round(
          Number(
            daily
              .precipitation_probability_max?.[
              index
            ] || 0
          )
        ),

      rainMm:
        Number(
          daily
            .precipitation_sum?.[
            index
          ] || 0
        ),
    })
  )
}

export function formatForecastDate(
  date,
  index = 0
) {
  if (index === 0) {
    return 'Today'
  }

  const parsed =
    new Date(
      `${date}T00:00:00+05:30`
    )

  return parsed.toLocaleDateString(
    'en-IN',
    {
      weekday: 'short',

      day: 'numeric',

      month: 'short',

      timeZone:
        FARM_LOCATION.timezone,
    }
  )
}

export function formatWeatherUpdatedTime(
  timestamp
) {
  if (!timestamp) {
    return ''
  }

  return new Date(
    timestamp
  ).toLocaleTimeString(
    'en-IN',
    {
      hour: 'numeric',

      minute: '2-digit',

      timeZone:
        FARM_LOCATION.timezone,
    }
  )
}