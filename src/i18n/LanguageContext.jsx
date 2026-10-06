import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  formatAppDate,
  formatAppTime,
  formatForecastDisplayDate,
  getContactCategoryDescription,
  getContactCategoryLabel,
  getValueLabel,
  localizeTimeLabel,
  normalizeLanguage,
  translateGeneratedText,
  translateUi,
} from './translations'

const LANGUAGE_STORAGE_KEY =
  'krishiBookLanguage'

const LanguageContext =
  createContext(null)

export function LanguageProvider({
  children,
}) {
  const [
    language,
    setLanguageState,
  ] = useState(() => {
    try {
      return normalizeLanguage(
        localStorage.getItem(
          LANGUAGE_STORAGE_KEY
        )
      )
    } catch {
      return 'en'
    }
  })

  const setLanguage =
    useCallback(
      (
        nextLanguage
      ) => {
        const normalized =
          normalizeLanguage(
            nextLanguage
          )

        setLanguageState(
          normalized
        )

        try {
          localStorage.setItem(
            LANGUAGE_STORAGE_KEY,
            normalized
          )
        } catch {
          /*
           * Language still works for
           * the current session even if
           * Local Storage is unavailable.
           */
        }
      },
      []
    )

  useEffect(() => {
    document.documentElement.lang =
      language === 'kn'
        ? 'kn'
        : 'en'
  }, [
    language,
  ])

  const value =
    useMemo(
      () => ({
        language,

        setLanguage,

        t: (
          text,
          variables
        ) =>
          translateUi(
            text,
            language,
            variables
          ),

        valueLabel:
          (
            storedValue
          ) =>
            getValueLabel(
              storedValue,
              language
            ),

        contactCategoryLabel:
          (
            roleId
          ) =>
            getContactCategoryLabel(
              roleId,
              language
            ),

        contactCategoryDescription:
          (
            roleId
          ) =>
            getContactCategoryDescription(
              roleId,
              language
            ),

        generatedText:
          (
            text
          ) =>
            translateGeneratedText(
              text,
              language
            ),

        localizeTime:
          (
            text
          ) =>
            localizeTimeLabel(
              text,
              language
            ),

        formatDate:
          (
            date,
            options
          ) =>
            formatAppDate(
              date,
              language,
              options
            ),

        formatTime:
          (
            timestamp,
            timezone
          ) =>
            formatAppTime(
              timestamp,
              language,
              timezone
            ),

        formatForecastDate:
          (
            date,
            index,
            timezone
          ) =>
            formatForecastDisplayDate(
              date,
              index,
              language,
              timezone
            ),
      }),
      [
        language,
        setLanguage,
      ]
    )

  return (
    <LanguageContext.Provider
      value={
        value
      }
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context =
    useContext(
      LanguageContext
    )

  if (!context) {
    throw new Error(
      'useLanguage must be used inside LanguageProvider.'
    )
  }

  return context
}