import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  ArrowLeft,
  ChevronDown,
  Globe2,
  MapPin,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
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

import {
  getUserProfile,
} from '../utils/profileStorage'

import {
  getNearbyPublicContacts,
  removePublicContact,
  savePublicContact,
} from '../utils/publicContactsStorage'

function Contacts({
  onBack,
}) {
  const [
    screen,
    setScreen,
  ] = useState('list')

  const [
    directoryView,
    setDirectoryView,
  ] = useState('mine')

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

  const [
    farmLocation,
    setFarmLocation,
  ] = useState(null)

  const [
    nearbyContacts,
    setNearbyContacts,
  ] = useState([])

  const [
    nearbyLoading,
    setNearbyLoading,
  ] = useState(false)

  const [
    nearbyLoaded,
    setNearbyLoaded,
  ] = useState(false)

  const [
    nearbyError,
    setNearbyError,
  ] = useState('')

  const [
    savingContact,
    setSavingContact,
  ] = useState(false)

  const [
    name,
    setName,
  ] = useState('')

  const [
    phone,
    setPhone,
  ] = useState('')

  const [
    roleId,
    setRoleId,
  ] = useState('')

  const [
    notes,
    setNotes,
  ] = useState('')

  const [
    makePublic,
    setMakePublic,
  ] = useState(false)

  /*
   * Load private contacts and
   * the user's CURRENT farm.
   */
  useEffect(() => {
    let unsubscribe =
      () => {}

    const startSync =
      async () => {
        try {
          const [
            profile,
          ] =
            await Promise.all([
              getUserProfile(),
              loadCloudContacts(),
            ])

          setFarmLocation(
            profile
              ?.farmLocation ||
            null
          )

          setDataVersion(
            (
              version
            ) =>
              version + 1
          )

          unsubscribe =
            subscribeToCloudContacts(
              () => {
                setDataVersion(
                  (
                    version
                  ) =>
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
   * --------------------------------
   * MY CONTACTS SEARCH
   * --------------------------------
   */

  const visibleContacts =
    useMemo(() => {
      const query =
        searchQuery
          .trim()
          .toLowerCase()

      const result =
        contacts.filter(
          (
            contact
          ) => {
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

              category
                .ledgerDefaults
                ?.type,

              category
                .ledgerDefaults
                ?.category,

              category
                .ledgerDefaults
                ?.expenseType,

              category
                .ledgerDefaults
                ?.incomeType,

              category
                .ledgerDefaults
                ?.crop,

              contact.notes,
            ]
              .filter(Boolean)
              .join(' ')
              .toLowerCase()

            return (
              searchableText
                .includes(
                  query
                )
            )
          }
        )

      return result.sort(
        (
          first,
          second
        ) =>
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

  /*
   * --------------------------------
   * NEARBY CONTACT SEARCH
   * --------------------------------
   */

  const visibleNearbyContacts =
    useMemo(() => {
      const query =
        searchQuery
          .trim()
          .toLowerCase()

      if (!query) {
        return nearbyContacts
      }

      return nearbyContacts.filter(
        (
          contact
        ) => {
          const category =
            getContactCategory(
              contact.roleId
            )

          const searchableText = [
            contact.name,
            contact.phone,

            category.label,
            category.description,

            contact
              .serviceArea
              ?.placeName,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()

          return (
            searchableText
              .includes(
                query
              )
          )
        }
      )
    }, [
      nearbyContacts,
      searchQuery,
    ])

  /*
   * --------------------------------
   * FORM
   * --------------------------------
   */

  const clearForm =
    () => {
      setName('')
      setPhone('')
      setRoleId('')
      setNotes('')
      setMakePublic(false)

      setEditingContact(
        null
      )
    }

  const openAddContact =
    () => {
      clearForm()
      setScreen('form')
    }

  const openEditContact =
    (
      contact
    ) => {
      setEditingContact(
        contact
      )

      setName(
        contact.name ||
        ''
      )

      setPhone(
        contact.phone ||
        ''
      )

      setRoleId(
        contact.roleId ||
        ''
      )

      setNotes(
        contact.notes ||
        ''
      )

      /*
       * Old Krishi Book contacts
       * may already have the old
       * makePublic preference.
       *
       * We do NOT automatically
       * treat that old preference
       * as consent for the new
       * public directory.
       *
       * Only contacts that have
       * actually been published
       * through this new system
       * open with sharing enabled.
       */
      setMakePublic(
        Boolean(
          contact
            .publicDirectorySharedAt
        ) &&
        Boolean(
          contact.makePublic
        )
      )

      setScreen('form')
    }

  const closeForm =
    () => {
      clearForm()
      setScreen('list')
    }

  /*
   * --------------------------------
   * LOAD NEARBY CONTACTS
   * --------------------------------
   */

  const loadNearbyContacts =
    async () => {
      if (
        !farmLocation
          ?.confirmed
      ) {
        setNearbyError(
          'Farm location is not available.'
        )

        return
      }

      try {
        setNearbyLoading(
          true
        )

        setNearbyError('')

        const result =
          await getNearbyPublicContacts(
            farmLocation
          )

        setNearbyContacts(
          result
        )

        setNearbyLoaded(
          true
        )
      } catch (error) {
        console.error(
          'Unable to load nearby contacts:',
          error
        )

        setNearbyError(
          'Unable to load nearby contacts right now.'
        )
      } finally {
        setNearbyLoading(
          false
        )
      }
    }

  const showMyContacts =
    () => {
      setDirectoryView(
        'mine'
      )

      setSearchQuery('')
    }

  const showNearbyContacts =
    async () => {
      setDirectoryView(
        'nearby'
      )

      setSearchQuery('')

      if (!nearbyLoaded) {
        await loadNearbyContacts()
      }
    }

  /*
   * --------------------------------
   * SAVE
   * --------------------------------
   */

  const handleSave =
    async () => {
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

      /*
       * Public contacts need a
       * telephone number because
       * another farmer needs a way
       * to contact them.
       */
      if (
        makePublic &&
        !phone.trim()
      ) {
        alert(
          'Please add a phone number before sharing this contact with nearby farmers.'
        )

        return
      }

      if (
        makePublic &&
        !farmLocation
          ?.confirmed
      ) {
        alert(
          'Please set your farm location before sharing contacts with nearby farmers.'
        )

        return
      }

      const now =
        new Date()
          .toISOString()

      /*
       * Preserve the original
       * service-area snapshot.
       *
       * This belongs to the CONTACT,
       * not to the user's current farm.
       */
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

        publicServiceArea:
          editingContact
            ?.publicServiceArea ||
          null,

        publicDirectorySharedAt:
          editingContact
            ?.publicDirectorySharedAt ||
          null,

        createdAt:
          editingContact
            ?.createdAt ||
          now,

        updatedAt:
          now,
      }

      try {
        setSavingContact(
          true
        )

        /*
         * If sharing is enabled,
         * create/update the separate
         * public directory record.
         */
        if (makePublic) {
          const publicContact =
            await savePublicContact(
              contact,
              farmLocation
            )

          /*
           * Remember where this
           * contact belongs inside
           * the PRIVATE contact too.
           *
           * This means that even if
           * sharing is disabled and
           * enabled again later, the
           * contact remains connected
           * to its original area.
           */
          contact.publicServiceArea =
            publicContact
              .serviceArea

          contact.publicDirectorySharedAt =
            contact
              .publicDirectorySharedAt ||
            now
        } else {
          /*
           * Remove the public copy,
           * but KEEP publicServiceArea
           * privately.
           *
           * This protects the original
           * service location in case
           * the contact is shared again.
           */
          await removePublicContact(
            contact.id
          )
        }

        /*
         * Save private contact.
         */
        if (
          editingContact
        ) {
          updateContact(
            contact
          )
        } else {
          saveContact(
            contact
          )
        }

        setDataVersion(
          (
            version
          ) =>
            version + 1
        )

        /*
         * Directory contents may
         * have changed.
         */
        setNearbyLoaded(
          false
        )

        closeForm()
      } catch (error) {
        console.error(
          'Unable to save contact:',
          error
        )

        alert(
          'Unable to save the contact. Please check your internet connection and try again.'
        )
      } finally {
        setSavingContact(
          false
        )
      }
    }

  /*
   * --------------------------------
   * DELETE
   * --------------------------------
   */

  const handleDelete =
    async (
      contact
    ) => {
      const confirmed =
        window.confirm(
          `Delete ${contact.name} from Farm Contacts?`
        )

      if (!confirmed) {
        return
      }

      try {
        /*
         * Always try to remove any
         * public directory copy.
         */
        await removePublicContact(
          contact.id
        )

        deleteContact(
          contact.id
        )

        setNearbyLoaded(
          false
        )

        setDataVersion(
          (
            version
          ) =>
            version + 1
        )
      } catch (error) {
        console.error(
          'Unable to delete contact:',
          error
        )

        alert(
          'Unable to delete the contact. Please try again.'
        )
      }
    }

  /*
   * --------------------------------
   * ADD / EDIT SCREEN
   * --------------------------------
   */

  if (
    screen === 'form'
  ) {
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
              value={
                name
              }
              autoComplete="name"
              placeholder="Example: Ramesh"
              onChange={(
                event
              ) =>
                setName(
                  event
                    .target
                    .value
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
                {' '}
                (optional for private contacts)
              </span>
            </label>

            <input
              id="contactPhone"
              type="tel"
              inputMode="tel"
              value={
                phone
              }
              autoComplete="tel"
              placeholder="Example: 9876543210"
              onChange={(
                event
              ) =>
                setPhone(
                  event
                    .target
                    .value
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
                value={
                  roleId
                }
                onChange={(
                  event
                ) =>
                  setRoleId(
                    event
                      .target
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
                {' '}
                (optional)
              </span>
            </label>

            <input
              id="contactNotes"
              type="text"
              value={
                notes
              }
              placeholder="Example: Available mornings"
              onChange={(
                event
              ) =>
                setNotes(
                  event
                    .target
                    .value
                )
              }
              className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-4 text-base outline-none"
            />

            <p className="mt-2 px-1 text-xs leading-5 text-gray-400">
              Notes stay private even if you share the contact.
            </p>

          </section>

          {/* Public directory */}
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
                    event
                      .target
                      .checked
                  )
                }
                className="mt-1 h-5 w-5 shrink-0"
              />

              <div>

                <p className="font-medium text-gray-900">
                  Share with nearby farmers
                </p>

                <p className="mt-1 text-sm leading-5 text-gray-500">
                  Their name and phone number will be visible to signed-in Krishi Book users near this contact's area.
                </p>

              </div>

            </label>

            {makePublic && (
              <div className="mt-4 rounded-xl bg-[#F3F7EF] p-3">

                <div className="flex items-start gap-2">

                  <MapPin
                    size={17}
                    className="mt-0.5 shrink-0 text-gray-500"
                  />

                  <p className="text-sm leading-5 text-gray-600">
                    Krishi Book automatically works out the nearby area for this type of contact. You do not need to choose a distance.
                  </p>

                </div>

              </div>
            )}

          </section>

          {/* Save */}
          <button
            type="button"
            onClick={
              handleSave
            }
            disabled={
              savingContact
            }
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-5 py-4 text-base font-semibold text-white active:scale-[0.98] disabled:opacity-50"
          >

            {savingContact ? (
              <RefreshCw
                size={20}
                className="animate-spin"
              />
            ) : (
              <Save
                size={20}
              />
            )}

            {savingContact
              ? 'Saving...'
              : editingContact
                ? 'Save Changes'
                : 'Save Contact'}

          </button>

        </main>

      </div>
    )
  }

  /*
   * --------------------------------
   * CONTACT BOOK
   * --------------------------------
   */

  return (
    <div className="min-h-screen bg-[#F7F5EF]">

      <main className="mx-auto min-h-screen w-full max-w-md px-5 py-6">

        {/* Header */}
        <header className="mb-6 flex items-center gap-3">

          <button
            type="button"
            onClick={
              onBack
            }
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
          >
            <ArrowLeft
              size={20}
            />
          </button>

          <div className="flex-1">

            <h1 className="text-2xl font-bold text-gray-900">
              Farm Contacts
            </h1>

            <p className="text-sm text-gray-500">
              People who can help with the farm
            </p>

          </div>

        </header>

        {/* Tabs */}
        <div className="mb-5 grid grid-cols-2 gap-1 rounded-2xl bg-white p-1.5 shadow-sm">

          <button
            type="button"
            onClick={
              showMyContacts
            }
            className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold ${
              directoryView ===
              'mine'
                ? 'bg-gray-900 text-white'
                : 'text-gray-500'
            }`}
          >

            <Users
              size={18}
            />

            My Contacts

          </button>

          <button
            type="button"
            onClick={
              showNearbyContacts
            }
            className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold ${
              directoryView ===
              'nearby'
                ? 'bg-gray-900 text-white'
                : 'text-gray-500'
            }`}
          >

            <Globe2
              size={18}
            />

            Nearby

          </button>

        </div>

        {directoryView ===
          'mine' ? (
          <>
            {/* Add */}
            <button
              type="button"
              onClick={
                openAddContact
              }
              className="mb-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-5 py-4 text-base font-semibold text-white active:scale-[0.98]"
            >

              <Plus
                size={20}
              />

              Add Contact

            </button>

            {/* Search */}
            {contacts.length >
              0 && (
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
                    placeholder="Search my contacts..."
                    onChange={(
                      event
                    ) =>
                      setSearchQuery(
                        event
                          .target
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

            {/* No contacts */}
            {contacts.length ===
            0 ? (
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
            ) : visibleContacts
                .length ===
              0 ? (
              <section className="rounded-2xl bg-white p-7 text-center shadow-sm">

                <p className="text-sm font-medium text-gray-700">
                  No matching contacts
                </p>

              </section>
            ) : (
              <section className="space-y-3">

                {visibleContacts.map(
                  (
                    contact
                  ) => {
                    const category =
                      getContactCategory(
                        contact.roleId
                      )

                    const isActuallyShared =
                      Boolean(
                        contact
                          .makePublic
                      ) &&
                      Boolean(
                        contact
                          .publicDirectorySharedAt
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

                            {isActuallyShared && (
                              <p className="mt-2 text-xs font-medium text-[#4D7650]">
                                🌐 Shared with nearby farmers
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
                                size={17}
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
          </>
        ) : (
          <>
            {/* Nearby explanation */}
            <section className="mb-5 rounded-2xl bg-[#F3F7EF] p-4">

              <div className="flex items-start gap-3">

                <MapPin
                  size={20}
                  className="mt-0.5 shrink-0 text-gray-600"
                />

                <div className="min-w-0">

                  <p className="font-semibold text-gray-900">
                    Contacts near your farm
                  </p>

                  <p className="mt-1 text-sm leading-5 text-gray-600">
                    Showing people and services that are likely to work around{' '}
                    <span className="font-medium">
                      {farmLocation
                        ?.placeName ||
                        'your farm'}
                    </span>
                    .
                  </p>

                </div>

              </div>

            </section>

            {/* Search */}
            {!nearbyLoading &&
              nearbyContacts
                .length >
                0 && (
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
                    placeholder="Search nearby contacts..."
                    onChange={(
                      event
                    ) =>
                      setSearchQuery(
                        event
                          .target
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

            {/* Loading */}
            {nearbyLoading && (
              <section className="rounded-2xl bg-white p-8 text-center shadow-sm">

                <RefreshCw
                  size={26}
                  className="mx-auto animate-spin text-gray-400"
                />

                <p className="mt-4 text-sm text-gray-500">
                  Finding contacts near your farm...
                </p>

              </section>
            )}

            {/* Error */}
            {!nearbyLoading &&
              nearbyError && (
              <section className="rounded-2xl bg-white p-6 text-center shadow-sm">

                <p className="text-sm text-gray-600">
                  {
                    nearbyError
                  }
                </p>

                <button
                  type="button"
                  onClick={
                    loadNearbyContacts
                  }
                  className="mt-4 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white"
                >
                  Try Again
                </button>

              </section>
            )}

            {/* Empty */}
            {!nearbyLoading &&
              !nearbyError &&
              nearbyLoaded &&
              nearbyContacts
                .length ===
                0 && (
              <section className="rounded-2xl bg-white p-8 text-center shadow-sm">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E4EFD9]">

                  <Globe2
                    size={27}
                  />

                </div>

                <p className="mt-4 text-base font-semibold text-gray-900">
                  No shared contacts nearby yet
                </p>

                <p className="mt-2 text-sm leading-5 text-gray-500">
                  As farmers around your area share useful contacts, they will appear here.
                </p>

              </section>
            )}

            {/* Search empty */}
            {!nearbyLoading &&
              !nearbyError &&
              nearbyContacts
                .length >
                0 &&
              visibleNearbyContacts
                .length ===
                0 && (
              <section className="rounded-2xl bg-white p-7 text-center shadow-sm">

                <p className="text-sm font-medium text-gray-700">
                  No matching nearby contacts
                </p>

              </section>
            )}

            {/* Nearby list */}
            {!nearbyLoading &&
              !nearbyError &&
              visibleNearbyContacts
                .length >
                0 && (
              <section className="space-y-3">

                {visibleNearbyContacts.map(
                  (
                    contact
                  ) => {
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

                            {contact
                              .serviceArea
                              ?.placeName && (
                              <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">

                                <MapPin
                                  size={14}
                                />

                                <span>
                                  Around{' '}
                                  {
                                    contact
                                      .serviceArea
                                      .placeName
                                  }
                                </span>

                              </div>
                            )}

                            {contact.isMine && (
                              <p className="mt-2 text-xs font-medium text-[#4D7650]">
                                Shared by you
                              </p>
                            )}

                          </div>

                        </div>

                        {contact.phone && (
                          <a
                            href={`tel:${contact.phone}`}
                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#E4F1E7] px-3 py-3 text-sm font-semibold text-gray-800"
                          >

                            <Phone
                              size={17}
                            />

                            Call{' '}
                            {
                              contact.name
                            }

                          </a>
                        )}

                      </div>
                    )
                  }
                )}

              </section>
            )}

            {/* Refresh */}
            {nearbyLoaded &&
              !nearbyLoading && (
              <button
                type="button"
                onClick={
                  loadNearbyContacts
                }
                className="mt-5 flex w-full items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-gray-500"
              >

                <RefreshCw
                  size={16}
                />

                Refresh Nearby Contacts

              </button>
            )}
          </>
        )}

        <p className="mt-8 pb-4 text-center text-xs text-gray-400">
          Krishi Book · Farm Contacts
        </p>

      </main>

    </div>
  )
}

export default Contacts