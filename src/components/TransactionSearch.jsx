import {
  Search,
  X,
} from 'lucide-react'

function TransactionSearch({
  query,
  onChange,
  suggestion,
}) {
  return (
    <section className="mb-5">

      <label
        htmlFor="transactionSearch"
        className="mb-2 block text-sm font-medium text-gray-600"
      >
        Search records
      </label>

      <div className="relative">

        <Search
          size={19}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          id="transactionSearch"
          type="search"
          value={query}
          placeholder="Search..."
          autoComplete="off"
          autoCorrect="on"
          spellCheck={true}
          enterKeyHint="search"
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          className="block w-full min-w-0 rounded-xl border border-gray-200 bg-white py-4 pl-11 pr-11 text-base text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-400"
        />

        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() =>
              onChange('')
            }
            className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 active:bg-gray-100"
          >
            <X size={18} />
          </button>
        )}

      </div>

      {/* Optional spelling suggestion */}
      {suggestion && (
        <div className="mt-2 px-1">

          <span className="text-sm text-gray-500">
            Did you mean{' '}
          </span>

          <button
            type="button"
            onClick={() =>
              onChange(
                suggestion.query
              )
            }
            className="text-sm font-semibold text-gray-900 underline decoration-gray-300 underline-offset-2"
          >
            {suggestion.word}
          </button>

          <span className="text-sm text-gray-500">
            ?
          </span>

        </div>
      )}

    </section>
  )
}

export default TransactionSearch