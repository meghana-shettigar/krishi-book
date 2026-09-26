import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  Snowflake,
  Sun,
} from 'lucide-react'

function WeatherIcon({
  kind,
  size = 28,
  className = '',
}) {
  const props = {
    size,
    className,
  }

  switch (kind) {
    case 'clear':
      return (
        <Sun {...props} />
      )

    case 'partly-cloudy':
      return (
        <CloudSun {...props} />
      )

    case 'cloudy':
      return (
        <Cloud {...props} />
      )

    case 'fog':
      return (
        <CloudFog {...props} />
      )

    case 'drizzle':
      return (
        <CloudDrizzle
          {...props}
        />
      )

    case 'rain':
      return (
        <CloudRain
          {...props}
        />
      )

    case 'storm':
      return (
        <CloudLightning
          {...props}
        />
      )

    case 'snow':
      return (
        <Snowflake
          {...props}
        />
      )

    default:
      return (
        <Cloud {...props} />
      )
  }
}

export default WeatherIcon