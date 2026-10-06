import {
  getValueSearchTerms,
} from '../i18n/translations'

const normalizeText =
  (
    value
  ) =>
    String(
      value ?? ''
    )
      .toLocaleLowerCase()
      .trim()

function expandSearchValues(
  values
) {
  return values.flatMap(
    (
      value
    ) => {
      if (
        value === null ||
        value === undefined
      ) {
        return []
      }

      return getValueSearchTerms(
        value
      )
    }
  )
}

const getTransactionText =
  (
    transaction
  ) => {
    const canonicalValues = [
      transaction.type,

      transaction.category,
      transaction.expenseType,

      transaction.legacyCategory,
      transaction.legacyExpenseType,

      transaction.incomeType,
      transaction.crop,

      transaction.notes,
      transaction.date,
      transaction.amount,

      transaction.quantity,
      transaction.rate,

      transaction.menCount,
      transaction.menDailyCharge,

      transaction.womenCount,
      transaction.womenDailyCharge,

      transaction.numberOfPeople,
      transaction.dailyCharge,
    ]

    const values = [
      ...canonicalValues,

      ...expandSearchValues(
        canonicalValues
      ),
    ]

    if (
      Number(
        transaction.menCount ||
        0
      ) > 0
    ) {
      values.push(
        'men'
      )
    }

    if (
      Number(
        transaction.womenCount ||
        0
      ) > 0
    ) {
      values.push(
        'women'
      )
    }

    if (
      transaction.category ===
        'Labour' ||
      transaction.category ===
        'Manual Labour'
    ) {
      values.push(
        'manual',
        'labour',
        'labor',
        'worker',
        'workers'
      )
    }

    if (
      transaction.crop ===
      'Coconut'
    ) {
      values.push(
        'coconut',
        'coconuts'
      )
    }

    if (
      transaction.crop ===
      'Pepper'
    ) {
      values.push(
        'pepper',
        'black pepper'
      )
    }

    return normalizeText(
      values
        .filter(
          (
            value
          ) =>
            value !==
              null &&
            value !==
              undefined
        )
        .join(' ')
    )
  }

export const transactionMatchesSearch =
  (
    transaction,
    query
  ) => {
    const cleanQuery =
      normalizeText(
        query
      )

    if (!cleanQuery) {
      return true
    }

    const transactionText =
      getTransactionText(
        transaction
      )

    const searchWords =
      cleanQuery
        .split(/\s+/)
        .filter(Boolean)

    return searchWords.every(
      (
        word
      ) =>
        transactionText.includes(
          word
        )
    )
  }

const getVocabulary =
  (
    transactions
  ) => {
    const vocabulary =
      new Map()

    transactions.forEach(
      (
        transaction
      ) => {
        const canonicalValues = [
          transaction.category,
          transaction.expenseType,
          transaction.incomeType,
          transaction.crop,
          transaction.notes,
        ]

        const values = [
          ...canonicalValues,

          ...expandSearchValues(
            canonicalValues
          ),
        ]

        values.forEach(
          (
            value
          ) => {
            if (!value) {
              return
            }

            const words =
              String(
                value
              ).match(
                /[\p{L}\p{N}]+/gu
              ) ||
              []

            words.forEach(
              (
                word
              ) => {
                if (
                  word.length <
                  3
                ) {
                  return
                }

                const normalized =
                  normalizeText(
                    word
                  )

                if (
                  !vocabulary.has(
                    normalized
                  )
                ) {
                  vocabulary.set(
                    normalized,
                    word
                  )
                }
              }
            )
          }
        )
      }
    )

    return vocabulary
  }

const levenshteinDistance =
  (
    first,
    second
  ) => {
    const a =
      normalizeText(
        first
      )

    const b =
      normalizeText(
        second
      )

    const matrix =
      Array.from(
        {
          length:
            b.length + 1,
        },
        () =>
          Array(
            a.length +
              1
          ).fill(0)
      )

    for (
      let i = 0;
      i <= a.length;
      i += 1
    ) {
      matrix[0][i] =
        i
    }

    for (
      let j = 0;
      j <= b.length;
      j += 1
    ) {
      matrix[j][0] =
        j
    }

    for (
      let j = 1;
      j <= b.length;
      j += 1
    ) {
      for (
        let i = 1;
        i <= a.length;
        i += 1
      ) {
        const cost =
          a[i - 1] ===
          b[j - 1]
            ? 0
            : 1

        matrix[j][i] =
          Math.min(
            matrix[
              j - 1
            ][i] + 1,

            matrix[j][
              i - 1
            ] + 1,

            matrix[
              j - 1
            ][
              i - 1
            ] + cost
          )
      }
    }

    return matrix[
      b.length
    ][a.length]
  }

export const getSearchSuggestion =
  (
    query,
    transactions
  ) => {
    const trimmed =
      String(
        query || ''
      ).trim()

    if (!trimmed) {
      return null
    }

    const queryParts =
      trimmed.split(
        /\s+/
      )

    const typedWord =
      normalizeText(
        queryParts[
          queryParts.length -
            1
        ]
      )

    if (
      typedWord.length <
      3
    ) {
      return null
    }

    const vocabulary =
      getVocabulary(
        transactions
      )

    const words = [
      ...vocabulary.keys(),
    ]

    if (
      words.length ===
      0
    ) {
      return null
    }

    if (
      vocabulary.has(
        typedWord
      )
    ) {
      return null
    }

    const isValidPartialWord =
      words.some(
        (
          word
        ) =>
          word.startsWith(
            typedWord
          )
      )

    if (
      isValidPartialWord
    ) {
      return null
    }

    let bestMatch =
      null

    let bestDistance =
      Infinity

    words.forEach(
      (
        candidate
      ) => {
        const distance =
          levenshteinDistance(
            typedWord,
            candidate
          )

        if (
          distance <
          bestDistance
        ) {
          bestDistance =
            distance

          bestMatch =
            candidate
        }
      }
    )

    if (!bestMatch) {
      return null
    }

    let maximumDistance =
      1

    if (
      typedWord.length >=
      5
    ) {
      maximumDistance =
        2
    }

    if (
      typedWord.length >=
      9
    ) {
      maximumDistance =
        3
    }

    if (
      bestDistance >
      maximumDistance
    ) {
      return null
    }

    const suggestedWord =
      vocabulary.get(
        bestMatch
      )

    const correctedQuery = [
      ...queryParts.slice(
        0,
        -1
      ),

      suggestedWord,
    ].join(' ')

    return {
      word:
        suggestedWord,

      query:
        correctedQuery,
    }
  }