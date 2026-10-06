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

import {
  getContactCategorySearchTerms,
  isLatinContactName,
} from '../i18n/translations'

import {
  useLanguage,
} from '../i18n/LanguageContext'

function Contacts({
  onBack,
}) {
  const {
    t,
    contactCategoryLabel,
    contactCategoryDescription,
  } =
    useLanguage()

  const [
    screen,
    setScreen,
  ] =
    useState(
      'list'
    )

  const [
    directoryView,
    setDirectoryView,
  ] =
    useState(
      'mine'
    )

  const [
    editingContact,
    setEditingContact,
  ] =
    useState(null)

  const [
    searchQuery,
    setSearchQuery,
  ] =
    useState('')

  const [
    dataVersion,
    setDataVersion,
  ] =
    useState(0)

  const [
    farmLocation,
    setFarmLocation,
  ] =
    useState(null)

  const [
    nearbyContacts,
    setNearbyContacts,
  ] =
    useState([])

  const [
    nearbyLoading,
    setNearbyLoading,
  ] =
    useState(false)

  const [
    nearbyLoaded,
    setNearbyLoaded,
  ] =
    useState(false)

  const [
    nearbyError,
    setNearbyError,
  ] =
    useState('')

  const [
    savingContact,
    setSavingContact,
  ] =
    useState(false)

  const [
    name,
    setName,
  ] =
    useState('')

  const [
    phone,
    setPhone,
  ] =
    useState('')

  const [
    roleId,
    setRoleId,
  ] =
    useState('')

  const [
    notes,
    setNotes,
  ] =
    useState('')

  const [
    makePublic,
    setMakePublic,
  ] =
    useState(false)

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
              version +
              1
          )

          unsubscribe =
            subscribeToCloudContacts(
              () =>
                setDataVersion(
                  (
                    version
                  ) =>
                    version +
                    1
                )
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
            if (
              !query
            ) {
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

              ...getContactCategorySearchTerms(
                contact.roleId
              ),

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

            return searchableText.includes(
              query
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

  const visibleNearbyContacts =
    useMemo(() => {
      const query =
        searchQuery
          .trim()
          .toLowerCase()

      if (
        !query
      ) {
        return nearbyContacts
      }

      return nearbyContacts.filter(
        (
          contact
        ) => {
          const searchableText = [
            contact.name,
            contact.phone,

            ...getContactCategorySearchTerms(
              contact.roleId
            ),

            contact
              .serviceArea
              ?.placeName,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()

          return searchableText.includes(
            query
          )
        }
      )
    }, [
      nearbyContacts,
      searchQuery,
    ])

  const clearForm =
    () => {
      setName('')
      setPhone('')
      setRoleId('')
      setNotes('')
      setMakePublic(
        false
      )
      setEditingContact(
        null
      )
    }

  const openAddContact =
    () => {
      clearForm()

      setScreen(
        'form'
      )
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

      setMakePublic(
        Boolean(
          contact
            .publicDirectorySharedAt
        ) &&
        Boolean(
          contact
            .makePublic
        )
      )

      setScreen(
        'form'
      )
    }

  const closeForm =
    () => {
      clearForm()

      setScreen(
        'list'
      )
    }

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

      if (
        !nearbyLoaded
      ) {
        await loadNearbyContacts()
      }
    }

  const handleSave =
    async () => {
      if (
        !name.trim()
      ) {
        alert(
          t(
            'Please enter the person or business name.'
          )
        )

        return
      }

      /*
       * Contact names stay Latin /
       * English for consistent public
       * directory search.
       */
      if (
        !isLatinContactName(
          name
        )
      ) {
        alert(
          t(
            'Please enter the contact name using English letters only.'
          )
        )

        return
      }

      if (
        !roleId
      ) {
        alert(
          t(
            'Please choose what this contact helps with.'
          )
        )

        return
      }

      if (
        makePublic &&
        !phone.trim()
      ) {
        alert(
          t(
            'Please add a phone number before sharing this contact with nearby farmers.'
          )
        )

        return
      }

      if (
        makePublic &&
        !farmLocation
          ?.confirmed
      ) {
        alert(
          t(
            'Please set your farm location before sharing contacts with nearby farmers.'
          )
        )

        return
      }

      const now =
        new Date()
          .toISOString()

      const contact = {
        id:
          editingContact
            ?.id ||
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

        if (
          makePublic
        ) {
          const publicContact =
            await savePublicContact(
              contact,
              farmLocation
            )

          contact.publicServiceArea =
            publicContact
              .serviceArea

          contact.publicDirectorySharedAt =
            contact
              .publicDirectorySharedAt ||
            now
        } else {
          await removePublicContact(
            contact.id
          )
        }

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
            version +
            1
        )

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
          t(
            'Unable to save the contact. Please check your internet connection and try again.'
          )
        )
      } finally {
        setSavingContact(
          false
        )
      }
    }

  const handleDelete =
    async (
      contact
    ) => {
      const confirmed =
        window.confirm(
          t(
            'Delete {name} from Farm Contacts?',
            {
              name:
                contact.name,
            }
          )
        )

      if (
        !confirmed
      ) {
        return
      }

      try {
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
            version +
            1
        )
      } catch (error) {
        console.error(
          'Unable to delete contact:',
          error
        )

        alert(
          t(
            'Unable to delete the contact. Please try again.'
          )
        )
      }
    }

  if (
    screen ===
    'form'
  ) {
    return (
      <div className="min-h-screen bg-[#F7F5EF]">

        <main className="mx-auto min-h-screen w-full max-w-md px-5 py-6">

          <header className="mb-8 flex items-center gap-3">

            <button
              type="button"
              onClick={
                closeForm
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

              <h1 className="text-2xl font-bold text-gray-900">
                {editingContact
                  ? t(
                      'Edit Contact'
                    )
                  : t(
                      'Add Farm Contact'
                    )}
              </h1>



            </div>

          </header>

          <section className="mb-5">

            <label
              htmlFor="contactName"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              {t(
                'Name (English)'
              )}
            </label>

            <input
              id="contactName"
              type="text"
              lang="en"
              value={
                name
              }
              autoComplete="name"
              placeholder={
                t(
                  'Example: Ramesh'
                )
              }
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

            <p className="mt-2 px-1 text-xs text-gray-400">
              {t(
                'Enter the name using English letters.'
              )}
            </p>

          </section>

          <section className="mb-5">

            <label
              htmlFor="contactPhone"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              {t(
                'Phone number'
              )}

              <span className="ml-1 font-normal text-gray-400">
                {' '}
                {t(
                  '(optional for private contacts)'
                )}
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
              placeholder={
                t(
                  'Example: 9876543210'
                )
              }
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

          <section className="mb-5">

            <label
              htmlFor="contactRole"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              {t(
                'What do they help with?'
              )}
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
                  {t(
                    'Choose category'
                  )}
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
                      {contactCategoryLabel(
                        category.id
                      )}
                    </option>
                  )
                )}

              </select>

              <ChevronDown
                size={
                  20
                }
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

            </div>

            {roleId && (
              <p className="mt-2 px-1 text-sm text-gray-500">
                {contactCategoryDescription(
                  roleId
                )}
              </p>
            )}

          </section>

          <section className="mb-5">

            <label
              htmlFor="contactNotes"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              {t(
                'Note'
              )}

              <span className="ml-1 font-normal text-gray-400">
                {' '}
                {t(
                  '(optional)'
                )}
              </span>
            </label>

            <input
              id="contactNotes"
              type="text"
              value={
                notes
              }
              placeholder={
                t(
                  'Example: Available mornings'
                )
              }
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
              {t(
                'Notes stay private even if you share the contact.'
              )}
            </p>

          </section>

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
                  {t(
                    'Share with nearby farmers'
                  )}
                </p>

                <p className="mt-1 text-sm leading-5 text-gray-500">
                  {t(
                    "Their name and phone number will be visible to signed-in Krishi Book users near this contact's area."
                  )}
                </p>

              </div>

            </label>

            {makePublic && (
              <div className="mt-4 rounded-xl bg-[#F3F7EF] p-3">

                <div className="flex items-start gap-2">

                  <MapPin
                    size={
                      17
                    }
                    className="mt-0.5 shrink-0 text-gray-500"
                  />

                  <p className="text-sm leading-5 text-gray-600">
                    {t(
                      'Krishi Book automatically works out the nearby area for this type of contact. You do not need to choose a distance.'
                    )}
                  </p>

                </div>

              </div>
            )}

          </section>

          <button
            type="button"
            onClick={
              handleSave
            }
            disabled={
              savingContact
            }
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-5 py-4 text-base font-semibold text-white disabled:opacity-50"
          >

            {savingContact ? (
              <RefreshCw
                size={
                  20
                }
                className="animate-spin"
              />
            ) : (
              <Save
                size={
                  20
                }
              />
            )}

            {savingContact
              ? t(
                  'Saving...'
                )
              : editingContact
                ? t(
                    'Save Changes'
                  )
                : t(
                    'Save Contact'
                  )}

          </button>

        </main>

      </div>
    )
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

          <div className="flex-1">

            <h1 className="text-2xl font-bold text-gray-900">
              {t(
                'Farm Contacts'
              )}
            </h1>

            <p className="text-sm text-gray-500">
              {t(
                'People who can help with the farm'
              )}
            </p>

          </div>

        </header>

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
              size={
                18
              }
            />

            {t(
              'My Contacts'
            )}
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
              size={
                18
              }
            />

            {t(
              'Nearby'
            )}
          </button>

        </div>

        {directoryView ===
        'mine' ? (
          <>
            <button
              type="button"
              onClick={
                openAddContact
              }
              className="mb-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-5 py-4 text-base font-semibold text-white"
            >
              <Plus
                size={
                  20
                }
              />

              {t(
                'Add Contact'
              )}
            </button>

            {contacts.length >
              0 && (
              <section className="mb-5">

                <div className="relative">

                  <Search
                    size={
                      19
                    }
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="search"
                    value={
                      searchQuery
                    }
                    placeholder={
                      t(
                        'Search my contacts...'
                      )
                    }
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
                      aria-label={
                        t(
                          'Clear search'
                        )
                      }
                      onClick={() =>
                        setSearchQuery(
                          ''
                        )
                      }
                      className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-gray-400"
                    >
                      <X
                        size={
                          18
                        }
                      />
                    </button>
                  )}

                </div>

              </section>
            )}

            {contacts.length ===
            0 ? (
              <section className="rounded-2xl bg-white p-8 text-center shadow-sm">

                <Users
                  size={
                    27
                  }
                  className="mx-auto"
                />

                <p className="mt-4 font-semibold">
                  {t(
                    'No farm contacts yet'
                  )}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  {t(
                    'Add labourers, buyers, suppliers and other people who help with the farm.'
                  )}
                </p>

              </section>
            ) : visibleContacts
                .length ===
              0 ? (
              <section className="rounded-2xl bg-white p-7 text-center shadow-sm">
                {t(
                  'No matching contacts'
                )}
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

                    const shared =
                      Boolean(
                        contact.makePublic
                      ) &&
                      Boolean(
                        contact.publicDirectorySharedAt
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

                            <p className="font-semibold text-gray-900">
                              {
                                contact.name
                              }
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                              {contactCategoryLabel(
                                contact.roleId
                              )}
                            </p>

                            {contact.phone && (
                              <p className="mt-1 text-sm text-gray-500">
                                {
                                  contact.phone
                                }
                              </p>
                            )}

                            {contact.notes && (
                              <p className="mt-2 text-sm text-gray-600">
                                {
                                  contact.notes
                                }
                              </p>
                            )}

                            {shared && (
                              <p className="mt-2 text-xs font-medium text-[#4D7650]">
                                🌐{' '}
                                {t(
                                  'Shared with nearby farmers'
                                )}
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

                              {t(
                                'Call'
                              )}
                            </a>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              openEditContact(
                                contact
                              )
                            }
                            className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100"
                          >
                            <Pencil
                              size={
                                17
                              }
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
                          >
                            <Trash2
                              size={
                                17
                              }
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
            <section className="mb-5 rounded-2xl bg-[#F3F7EF] p-4">

              <div className="flex items-start gap-3">

                <MapPin
                  size={
                    20
                  }
                />

                <div>

                  <p className="font-semibold">
                    {t(
                      'Contacts near your farm'
                    )}
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    {t(
                      'Showing people and services that are likely to work around'
                    )}{' '}

                    <span className="font-medium">
                      {farmLocation
                        ?.placeName ||
                        t(
                          'your farm'
                        )}
                    </span>
                    .
                  </p>

                </div>

              </div>

            </section>

            {!nearbyLoading &&
              nearbyContacts
                .length >
                0 && (
              <section className="mb-5">

                <div className="relative">

                  <Search
                    size={
                      19
                    }
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="search"
                    value={
                      searchQuery
                    }
                    placeholder={
                      t(
                        'Search nearby contacts...'
                      )
                    }
                    onChange={(
                      event
                    ) =>
                      setSearchQuery(
                        event
                          .target
                          .value
                      )
                    }
                    className="block w-full rounded-xl border border-gray-200 bg-white py-4 pl-11 pr-11"
                  />

                </div>

              </section>
            )}

            {nearbyLoading && (
              <section className="rounded-2xl bg-white p-8 text-center shadow-sm">

                <RefreshCw
                  size={
                    26
                  }
                  className="mx-auto animate-spin"
                />

                <p className="mt-4 text-sm text-gray-500">
                  {t(
                    'Finding contacts near your farm...'
                  )}
                </p>

              </section>
            )}

            {!nearbyLoading &&
              nearbyError && (
              <section className="rounded-2xl bg-white p-6 text-center shadow-sm">

                <p className="text-sm text-gray-600">
                  {t(
                    nearbyError
                  )}
                </p>

                <button
                  type="button"
                  onClick={
                    loadNearbyContacts
                  }
                  className="mt-4 rounded-xl bg-gray-900 px-5 py-3 text-white"
                >
                  {t(
                    'Try Again'
                  )}
                </button>

              </section>
            )}

            {!nearbyLoading &&
              !nearbyError &&
              nearbyLoaded &&
              nearbyContacts
                .length ===
                0 && (
              <section className="rounded-2xl bg-white p-8 text-center shadow-sm">

                <Globe2
                  size={
                    27
                  }
                  className="mx-auto"
                />

                <p className="mt-4 font-semibold">
                  {t(
                    'No shared contacts nearby yet'
                  )}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  {t(
                    'As farmers around your area share useful contacts, they will appear here.'
                  )}
                </p>

              </section>
            )}

            {!nearbyLoading &&
              !nearbyError &&
              nearbyContacts
                .length >
                0 &&
              visibleNearbyContacts
                .length ===
                0 && (
              <section className="rounded-2xl bg-white p-7 text-center shadow-sm">
                {t(
                  'No matching nearby contacts'
                )}
              </section>
            )}

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

                            <p className="font-semibold">
                              {
                                contact.name
                              }
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                              {contactCategoryLabel(
                                contact.roleId
                              )}
                            </p>

                            {contact
                              .serviceArea
                              ?.placeName && (
                              <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">

                                <MapPin
                                  size={
                                    14
                                  }
                                />

                                <span>
                                  {t(
                                    'Around'
                                  )}{' '}
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
                                {t(
                                  'Shared by you'
                                )}
                              </p>
                            )}

                          </div>

                        </div>

                        {contact.phone && (
                          <a
                            href={`tel:${contact.phone}`}
                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#E4F1E7] px-3 py-3 text-sm font-semibold"
                          >
                            <Phone
                              size={
                                17
                              }
                            />

                            {t(
                              'Call {name}',
                              {
                                name:
                                  contact.name,
                              }
                            )}
                          </a>
                        )}

                      </div>
                    )
                  }
                )}

              </section>
            )}

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
                  size={
                    16
                  }
                />

                {t(
                  'Refresh Nearby Contacts'
                )}
              </button>
            )}
          </>
        )}

        <p className="mt-8 pb-4 text-center text-xs text-gray-400">
          {t(
            'Krishi Book · Farm Contacts'
          )}
        </p>

      </main>

    </div>
  )
}

export default Contacts