import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  ArrowLeft,
  ChevronDown,
  Pencil,
  Phone,
  Plus,
  Save,
  Search,
  Trash2,
  Users,
  X,
} from 'lucide-react'

import {
  CONTACT_CATEGORIES,
  getContactCategory,
} from '../data/contactCategories'

import {
  deleteContact,
  getContacts,
  loadCloudContacts,
  saveContact,
  subscribeToCloudContacts,
  updateContact,
} from '../utils/contactsStorage'

function Contacts({
  onBack,
}) {
  const [screen, setScreen] =
    useState('list')

  const [
    editingContact,
    setEditingContact,
  ] = useState(null)

  const [
    searchQuery,
    setSearchQuery,
  ] = useState('')

  const [
    dataVersion,
    setDataVersion,
  ] = useState(0)

  const [name, setName] =
    useState('')

  const [phone, setPhone] =
    useState('')

  const [roleId, setRoleId] =
    useState('')

  const [notes, setNotes] =
    useState('')

  const [
    makePublic,
    setMakePublic,
  ] = useState(false)

  /*
   * Load contacts from Firebase
   * and listen for changes from
   * another phone.
   */
  useEffect(() => {
    let unsubscribe =
      () => {}

    const startSync =
      async () => {
        try {
          await loadCloudContacts()

          setDataVersion(
            (version) =>
              version + 1
          )

          unsubscribe =
            subscribeToCloudContacts(
              () => {
                setDataVersion(
                  (version) =>
                    version + 1
                )
              }
            )
        } catch (error) {
          console.error(
            'Unable to start contact sync:',
            error
          )
        }
      }

    startSync()

    return () => {
      unsubscribe()
    }
  }, [])

  void dataVersion

  const contacts =
    getContacts()

  /*
   * Live contact search
   */
  const visibleContacts =
    useMemo(() => {
      const query =
        searchQuery
          .trim()
          .toLowerCase()

      const result =
        contacts.filter(
          (contact) => {
            if (!query) {
              return true
            }

            const category =
              getContactCategory(
                contact.roleId
              )

            const searchableText = [
              contact.name,
              contact.phone,
              category.label,
              category.description,
              contact.notes,
            ]
              .filter(Boolean)
              .join(' ')
              .toLowerCase()

            return searchableText.includes(
              query
            )
          }
        )

      return result.sort(
        (first, second) =>
          String(
            first.name
          ).localeCompare(
            String(
              second.name
            )
          )
      )
    }, [
      contacts,
      searchQuery,
    ])

  const clearForm = () => {
    setName('')
    setPhone('')
    setRoleId('')
    setNotes('')
    setMakePublic(false)
    setEditingContact(null)
  }

  const openAddContact =
    () => {
      clearForm()
      setScreen('form')
    }

  const openEditContact =
    (contact) => {
      setEditingContact(
        contact
      )

      setName(
        contact.name || ''
      )

      setPhone(
        contact.phone || ''
      )

      setRoleId(
        contact.roleId || ''
      )

      setNotes(
        contact.notes || ''
      )

      setMakePublic(
        Boolean(
          contact.makePublic
        )
      )

      setScreen('form')
    }

  const closeForm = () => {
    clearForm()
    setScreen('list')
  }

  const handleSave = () => {
    if (!name.trim()) {
      alert(
        'Please enter the person or business name.'
      )

      return
    }

    if (!roleId) {
      alert(
        'Please choose what this contact helps with.'
      )

      return
    }

    const now =
      new Date().toISOString()

    const contact = {
      id:
        editingContact?.id ||
        Date.now(),

      name:
        name.trim(),

      phone:
        phone.trim(),

      roleId,

      notes:
        notes.trim(),

      makePublic,

      createdAt:
        editingContact
          ?.createdAt ||
        now,

      updatedAt:
        now,
    }

    if (editingContact) {
      updateContact(
        contact
      )
    } else {
      saveContact(
        contact
      )
    }

    setDataVersion(
      (version) =>
        version + 1
    )

    closeForm()
  }

  const handleDelete =
    (contact) => {
      const confirmed =
        window.confirm(
          `Delete ${contact.name} from Farm Contacts?`
        )

      if (!confirmed) {
        return
      }

      deleteContact(
        contact.id
      )

      setDataVersion(
        (version) =>
          version + 1
      )
    }

  /*
   * ADD / EDIT CONTACT SCREEN
   */
  if (screen === 'form') {
    return (
      <div className="min-h-screen bg-[#F7F5EF]">

        <main className="mx-auto min-h-screen w-full max-w-md px-5 py-6">

          {/* Header */}
          <header className="mb-8 flex items-center gap-3">

            <button
              type="button"
              onClick={
                closeForm
              }
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
            >
              <ArrowLeft
                size={20}
              />
            </button>

            <div>

              <h1 className="text-2xl font-bold text-gray-900">
                {editingContact
                  ? 'Edit Contact'
                  : 'Add Farm Contact'}
              </h1>

              <p className="text-sm text-gray-500">
                Only the basics
              </p>

            </div>

          </header>

          {/* Name */}
          <section className="mb-5">

            <label
              htmlFor="contactName"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              Name
            </label>

            <input
              id="contactName"
              type="text"
              value={name}
              autoComplete="name"
              placeholder="Example: Ramesh"
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
              className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-4 text-base outline-none"
            />

          </section>

          {/* Phone */}
          <section className="mb-5">

            <label
              htmlFor="contactPhone"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              Phone number
              <span className="ml-1 font-normal text-gray-400">
                (optional)
              </span>
            </label>

            <input
              id="contactPhone"
              type="tel"
              inputMode="tel"
              value={phone}
              autoComplete="tel"
              placeholder="Example: 9876543210"
              onChange={(event) =>
                setPhone(
                  event.target.value
                )
              }
              className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-4 text-base outline-none"
            />

          </section>

          {/* Role */}
          <section className="mb-5">

            <label
              htmlFor="contactRole"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              What do they help with?
            </label>

            <div className="relative">

              <select
                id="contactRole"
                value={roleId}
                onChange={(
                  event
                ) =>
                  setRoleId(
                    event.target
                      .value
                  )
                }
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-4 pr-10 text-base font-medium text-gray-900 outline-none"
              >

                <option value="">
                  Choose category
                </option>

                {CONTACT_CATEGORIES.map(
                  (
                    category
                  ) => (
                    <option
                      key={
                        category.id
                      }
                      value={
                        category.id
                      }
                    >
                      {
                        category.icon
                      }{' '}
                      {
                        category.label
                      }
                    </option>
                  )
                )}

              </select>

              <ChevronDown
                size={20}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

            </div>

            {roleId && (
              <p className="mt-2 px-1 text-sm text-gray-500">

                {
                  getContactCategory(
                    roleId
                  ).description
                }

              </p>
            )}

          </section>

          {/* Notes */}
          <section className="mb-5">

            <label
              htmlFor="contactNotes"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              Note
              <span className="ml-1 font-normal text-gray-400">
                (optional)
              </span>
            </label>

            <input
              id="contactNotes"
              type="text"
              value={notes}
              placeholder="Example: Available mornings"
              onChange={(event) =>
                setNotes(
                  event.target.value
                )
              }
              className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-4 text-base outline-none"
            />

          </section>

          {/* Public preference */}
          <section className="mb-6 rounded-2xl bg-white p-4 shadow-sm">

            <label className="flex cursor-pointer items-start gap-3">

              <input
                type="checkbox"
                checked={
                  makePublic
                }
                onChange={(
                  event
                ) =>
                  setMakePublic(
                    event.target
                      .checked
                  )
                }
                className="mt-1 h-5 w-5 shrink-0"
              />

              <div>

                <p className="font-medium text-gray-900">
                  Make public
                </p>

                <p className="mt-1 text-sm leading-5 text-gray-500">
                  Remember that this contact can be shared in the farm community directory later.
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-400">
                  Nothing is publicly visible yet. We will build the shared directory separately.
                </p>

              </div>

            </label>

          </section>

          {/* Save */}
          <button
            type="button"
            onClick={
              handleSave
            }
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-5 py-4 text-base font-semibold text-white active:scale-[0.98]"
          >
            <Save size={20} />

            {editingContact
              ? 'Save Changes'
              : 'Save Contact'}
          </button>

        </main>

      </div>
    )
  }

  /*
   * CONTACT LIST SCREEN
   */
  return (
    <div className="min-h-screen bg-[#F7F5EF]">

      <main className="mx-auto min-h-screen w-full max-w-md px-5 py-6">

        {/* Header */}
        <header className="mb-7 flex items-center gap-3">

          <button
            type="button"
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex-1">

            <h1 className="text-2xl font-bold text-gray-900">
              Farm Contacts
            </h1>

            <p className="text-sm text-gray-500">
              People who help with the farm
            </p>

          </div>

        </header>

        {/* Add Contact */}
        <button
          type="button"
          onClick={
            openAddContact
          }
          className="mb-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-5 py-4 text-base font-semibold text-white active:scale-[0.98]"
        >
          <Plus size={20} />
          Add Contact
        </button>

        {/* Search */}
        {contacts.length > 0 && (
          <section className="mb-5">

            <div className="relative">

              <Search
                size={19}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="search"
                value={
                  searchQuery
                }
                placeholder="Search contacts..."
                onChange={(
                  event
                ) =>
                  setSearchQuery(
                    event.target
                      .value
                  )
                }
                className="block w-full rounded-xl border border-gray-200 bg-white py-4 pl-11 pr-11 text-base outline-none"
              />

              {searchQuery && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() =>
                    setSearchQuery(
                      ''
                    )
                  }
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-gray-400"
                >
                  <X
                    size={18}
                  />
                </button>
              )}

            </div>

          </section>
        )}

        {/* Empty */}
        {contacts.length === 0 ? (
          <section className="rounded-2xl bg-white p-8 text-center shadow-sm">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E4EFD9]">
              <Users
                size={27}
              />
            </div>

            <p className="mt-4 text-base font-semibold text-gray-900">
              No farm contacts yet
            </p>

            <p className="mt-2 text-sm leading-5 text-gray-500">
              Add labourers, buyers, suppliers and other people who help with the farm.
            </p>

          </section>
        ) : visibleContacts.length ===
          0 ? (
          <section className="rounded-2xl bg-white p-7 text-center shadow-sm">

            <p className="text-sm font-medium text-gray-700">
              No matching contacts
            </p>

          </section>
        ) : (
          <section className="space-y-3">

            {visibleContacts.map(
              (contact) => {
                const category =
                  getContactCategory(
                    contact.roleId
                  )

                return (
                  <div
                    key={
                      contact.id
                    }
                    className="rounded-2xl bg-white p-4 shadow-sm"
                  >

                    <div className="flex items-start gap-3">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F7F5EF] text-2xl">
                        {
                          category.icon
                        }
                      </div>

                      <div className="min-w-0 flex-1">

                        <p className="text-base font-semibold text-gray-900">
                          {
                            contact.name
                          }
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {
                            category.label
                          }
                        </p>

                        {contact.phone && (
                          <p className="mt-1 text-sm text-gray-500">
                            {
                              contact.phone
                            }
                          </p>
                        )}

                        {contact.notes && (
                          <p className="mt-2 text-sm leading-5 text-gray-600">
                            {
                              contact.notes
                            }
                          </p>
                        )}

                        {contact.makePublic && (
                          <p className="mt-2 text-xs font-medium text-gray-400">
                            🌐 Public directory preference
                          </p>
                        )}

                      </div>

                    </div>

                    <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3">

                      {contact.phone && (
                        <a
                          href={`tel:${contact.phone}`}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#E4F1E7] px-3 py-3 text-sm font-semibold text-gray-800"
                        >
                          <Phone
                            size={
                              17
                            }
                          />
                          Call
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          openEditContact(
                            contact
                          )
                        }
                        className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-600"
                        aria-label={`Edit ${contact.name}`}
                      >
                        <Pencil
                          size={17}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            contact
                          )
                        }
                        className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600"
                        aria-label={`Delete ${contact.name}`}
                      >
                        <Trash2
                          size={17}
                        />
                      </button>

                    </div>

                  </div>
                )
              }
            )}

          </section>
        )}

        <p className="mt-8 pb-4 text-center text-xs text-gray-400">
          Krishi Book · Farm Contacts
        </p>

      </main>

    </div>
  )
}

export default Contacts