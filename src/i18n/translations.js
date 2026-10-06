/*
 * Krishi Book translations
 *
 * IMPORTANT:
 *
 * Firestore continues to store
 * canonical English values.
 *
 * Translation happens only when
 * displaying information to users.
 */

export const SUPPORTED_LANGUAGES = [
  'en',
  'kn',
]

export function normalizeLanguage(
  language
) {
  return SUPPORTED_LANGUAGES.includes(
    language
  )
    ? language
    : 'en'
}

/*
 * --------------------------------
 * NORMAL UI TEXT
 * --------------------------------
 */

const KANNADA_UI = {
  'Krishi Book':
    'ಕೃಷಿ ಬುಕ್',

  'Your farm ledger':
    'ನಿಮ್ಮ ಕೃಷಿ ಲೆಕ್ಕ ಪುಸ್ತಕ',

  'Opening Krishi Book...':
    'ಕೃಷಿ ಬುಕ್ ತೆರೆಯಲಾಗುತ್ತಿದೆ...',

  Profile:
    'ಪ್ರೊಫೈಲ್',

  'Move existing records to cloud':
    'ಹಳೆಯ ದಾಖಲೆಗಳನ್ನು ಕ್ಲೌಡ್‌ಗೆ ಸಾಗಿಸಿ',

  'Your existing farm records are still stored on this device. Move them to Krishi Book Cloud so they can appear on your other phones too.':
    'ನಿಮ್ಮ ಹಳೆಯ ಕೃಷಿ ದಾಖಲೆಗಳು ಇನ್ನೂ ಈ ಫೋನ್‌ನಲ್ಲಿ ಇವೆ. ಅವುಗಳನ್ನು ಕೃಷಿ ಬುಕ್ ಕ್ಲೌಡ್‌ಗೆ ಸಾಗಿಸಿದರೆ ನಿಮ್ಮ ಇತರೆ ಫೋನ್‌ಗಳಲ್ಲೂ ನೋಡಬಹುದು.',

  'Move My Records':
    'ನನ್ನ ದಾಖಲೆಗಳನ್ನು ಸಾಗಿಸಿ',

  'Moving records...':
    'ದಾಖಲೆಗಳನ್ನು ಸಾಗಿಸಲಾಗುತ್ತಿದೆ...',

  'Move the existing records on this device to Krishi Book Cloud?\n\nNothing will be deleted from this device.':
    'ಈ ಫೋನ್‌ನಲ್ಲಿರುವ ಹಳೆಯ ದಾಖಲೆಗಳನ್ನು ಕೃಷಿ ಬುಕ್ ಕ್ಲೌಡ್‌ಗೆ ಸಾಗಿಸಬೇಕೇ?\n\nಈ ಫೋನ್‌ನಿಂದ ಯಾವುದೇ ದಾಖಲೆ ಅಳಿಸಲಾಗುವುದಿಲ್ಲ.',

  '{count} records moved to Krishi Book Cloud successfully.':
    '{count} ದಾಖಲೆಗಳನ್ನು ಕೃಷಿ ಬುಕ್ ಕ್ಲೌಡ್‌ಗೆ ಯಶಸ್ವಿಯಾಗಿ ಸಾಗಿಸಲಾಗಿದೆ.',

  'Unable to move your records to the cloud. Please try again.':
    'ದಾಖಲೆಗಳನ್ನು ಕ್ಲೌಡ್‌ಗೆ ಸಾಗಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',

  View:
    'ನೋಡಿ',

  Today:
    'ಇಂದು',

  'This Month':
    'ಈ ತಿಂಗಳು',

  'This Year':
    'ಈ ವರ್ಷ',

  Custom:
    'ಆಯ್ಕೆ ಮಾಡಿದ ಅವಧಿ',

  'Custom Range':
    'ಆಯ್ಕೆ ಮಾಡಿದ ಅವಧಿ',

  'Select date range':
    'ದಿನಾಂಕದ ಅವಧಿ ಆಯ್ಕೆಮಾಡಿ',

  Reset:
    'ಮರುಹೊಂದಿಸಿ',

  From:
    'ಇಂದ',

  To:
    'ವರೆಗೆ',

  'From {date}':
    '{date} ರಿಂದ',

  'Up to {date}':
    '{date} ವರೆಗೆ',

  'To date cannot be earlier than From date.':
    'ಕೊನೆಯ ದಿನಾಂಕವು ಆರಂಭದ ದಿನಾಂಕಕ್ಕಿಂತ ಮುಂಚೆ ಇರಬಾರದು.',

  'Profit / Loss':
    'ಲಾಭ / ನಷ್ಟ',

  Income:
    'ಆದಾಯ',

  Expense:
    'ಖರ್ಚು',

  Expenses:
    'ಖರ್ಚುಗಳು',

  'View Details':
    'ವಿವರಗಳನ್ನು ನೋಡಿ',

  'Record Expense':
    'ಖರ್ಚು ದಾಖಲಿಸಿ',

  'Add money spent on the farm':
    'ಕೃಷಿಗೆ ಮಾಡಿದ ಖರ್ಚು ಸೇರಿಸಿ',

  'Record Income':
    'ಆದಾಯ ದಾಖಲಿಸಿ',

  'Add money made from the farm':
    'ಕೃಷಿಯಿಂದ ಬಂದ ಆದಾಯ ಸೇರಿಸಿ',

  'Farm Contacts':
    'ಕೃಷಿ ಸಂಪರ್ಕಗಳು',

  'Labour, buyers and farm services':
    'ಕಾರ್ಮಿಕರು, ಖರೀದಿದಾರರು ಮತ್ತು ಕೃಷಿ ಸೇವೆಗಳು',

  Trends:
    'ಲೆಕ್ಕದ ನೋಟ',

  'See how your farm is doing':
    'ನಿಮ್ಮ ಕೃಷಿಯ ಲೆಕ್ಕ ಹೇಗಿದೆ ನೋಡಿ',

  'Synced with Krishi Book Cloud':
    'ಕೃಷಿ ಬುಕ್ ಕ್ಲೌಡ್‌ನೊಂದಿಗೆ ಸಿಂಕ್ ಆಗಿದೆ',

  'Krishi Book · Farm Ledger':
    'ಕೃಷಿ ಬುಕ್ · ಕೃಷಿ ಲೆಕ್ಕ ಪುಸ್ತಕ',

  /*
   * Expense
   */

  'What did you spend on?':
    'ಯಾವುದಕ್ಕೆ ಖರ್ಚು ಮಾಡಿದ್ದೀರಿ?',

  Category:
    'ವರ್ಗ',

  'Choose category':
    'ವರ್ಗ ಆಯ್ಕೆಮಾಡಿ',

  'Choose expense':
    'ಖರ್ಚಿನ ವಿಧ ಆಯ್ಕೆಮಾಡಿ',

  'Please choose what you spent on.':
    'ಯಾವುದಕ್ಕೆ ಖರ್ಚು ಮಾಡಿದ್ದೀರಿ ಎಂದು ಆಯ್ಕೆಮಾಡಿ.',

  'Please choose the expense type.':
    'ಖರ್ಚಿನ ವಿಧ ಆಯ್ಕೆಮಾಡಿ.',

  'Please enter the amount.':
    'ಮೊತ್ತವನ್ನು ನಮೂದಿಸಿ.',

  'Expense updated successfully!':
    'ಖರ್ಚಿನ ದಾಖಲೆ ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ!',

  'Expense saved successfully!':
    'ಖರ್ಚಿನ ದಾಖಲೆ ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ!',

  'Labour details':
    'ಕೂಲಿ ಕೆಲಸದ ವಿವರಗಳು',

  Men:
    'ಪುರುಷರು',

  Women:
    'ಮಹಿಳೆಯರು',

  'Number of men':
    'ಪುರುಷರ ಸಂಖ್ಯೆ',

  'Number of women':
    'ಮಹಿಳೆಯರ ಸಂಖ್ಯೆ',

  'Daily rate':
    'ದಿನದ ಕೂಲಿ',

  'Total labour cost':
    'ಒಟ್ಟು ಕೂಲಿ ಖರ್ಚು',

  Amount:
    'ಮೊತ್ತ',

  Date:
    'ದಿನಾಂಕ',

  Notes:
    'ಟಿಪ್ಪಣಿ',

  Note:
    'ಟಿಪ್ಪಣಿ',

  Optional:
    'ಐಚ್ಛಿಕ',

  'Save Expense':
    'ಖರ್ಚು ಉಳಿಸಿ',

  'Update Expense':
    'ಖರ್ಚು ನವೀಕರಿಸಿ',

  /*
   * Income
   */

  'What money did you receive?':
    'ಯಾವ ಆದಾಯ ಬಂದಿದೆ?',

  'Income Type':
    'ಆದಾಯದ ವಿಧ',

  'Choose income type':
    'ಆದಾಯದ ವಿಧ ಆಯ್ಕೆಮಾಡಿ',

  'Please choose the income type.':
    'ಆದಾಯದ ವಿಧ ಆಯ್ಕೆಮಾಡಿ.',

  'What did you sell?':
    'ಏನು ಮಾರಿದ್ದೀರಿ?',

  Choose:
    'ಆಯ್ಕೆಮಾಡಿ',

  'Please choose what you sold.':
    'ಏನು ಮಾರಿದ್ದೀರಿ ಎಂದು ಆಯ್ಕೆಮಾಡಿ.',

  'Sale details':
    'ಮಾರಾಟದ ವಿವರಗಳು',

  'Number of coconuts':
    'ತೆಂಗಿನಕಾಯಿಗಳ ಸಂಖ್ಯೆ',

  'Quantity (kg)':
    'ತೂಕ (ಕೆಜಿ)',

  coconuts:
    'ತೆಂಗಿನಕಾಯಿಗಳು',

  coconut:
    'ತೆಂಗಿನಕಾಯಿ',

  kg:
    'ಕೆಜಿ',

  '/ coconut':
    '/ ತೆಂಗಿನಕಾಯಿ',

  '/ kg':
    '/ ಕೆಜಿ',

  'Rate per coconut':
    'ಒಂದು ತೆಂಗಿನಕಾಯಿಗೆ ದರ',

  'Rate per kg':
    'ಪ್ರತಿ ಕೆಜಿಗೆ ದರ',

  'Total sale':
    'ಒಟ್ಟು ಮಾರಾಟ',

  'Save Income':
    'ಆದಾಯ ಉಳಿಸಿ',

  'Update Income':
    'ಆದಾಯ ನವೀಕರಿಸಿ',

  'Income updated successfully!':
    'ಆದಾಯದ ದಾಖಲೆ ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ!',

  'Income saved successfully!':
    'ಆದಾಯದ ದಾಖಲೆ ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ!',

  /*
   * Details / trends
   */

  Details:
    'ವಿವರಗಳು',

  Transactions:
    'ದಾಖಲೆಗಳು',

  'Are you sure you want to delete this transaction?':
    'ಈ ದಾಖಲೆಯನ್ನು ಅಳಿಸಬೇಕೇ?',

  'No matching transactions found':
    'ಹೊಂದುವ ದಾಖಲೆಗಳು ಸಿಗಲಿಲ್ಲ',

  'No transactions for this period':
    'ಈ ಅವಧಿಯಲ್ಲಿ ಯಾವುದೇ ದಾಖಲೆಗಳಿಲ್ಲ',

  'Try another word or use the spelling suggestion above.':
    'ಬೇರೆ ಇಂಗ್ಲಿಷ್ ಪದವನ್ನು ಹುಡುಕಿ ಅಥವಾ ಮೇಲಿನ ಸೂಚನೆಯನ್ನು ಬಳಸಿ.',

  Edit:
    'ತಿದ್ದು',

  Delete:
    'ಅಳಿಸಿ',

  people:
    'ಜನ',

  'Understand how your farm is doing':
    'ನಿಮ್ಮ ಕೃಷಿಯ ಆದಾಯ ಮತ್ತು ಖರ್ಚನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ',

  'Choose a view':
    'ನೋಟ ಆಯ್ಕೆಮಾಡಿ',

  'List View':
    'ಪಟ್ಟಿ ನೋಟ',

  'See detailed income and expense records':
    'ಆದಾಯ ಮತ್ತು ಖರ್ಚಿನ ವಿವರವಾದ ದಾಖಲೆಗಳನ್ನು ನೋಡಿ',

  'More visualisations will be added here':
    'ಮುಂದೆ ಇನ್ನಷ್ಟು ನೋಟಗಳನ್ನು ಇಲ್ಲಿ ಸೇರಿಸಲಾಗುತ್ತದೆ',

  'Income and expense records':
    'ಆದಾಯ ಮತ್ತು ಖರ್ಚಿನ ದಾಖಲೆಗಳು',

  record:
    'ದಾಖಲೆ',

  records:
    'ದಾಖಲೆಗಳು',

  'No matching records found':
    'ಹೊಂದುವ ದಾಖಲೆಗಳು ಸಿಗಲಿಲ್ಲ',

  'No expenses found':
    'ಖರ್ಚಿನ ದಾಖಲೆಗಳು ಸಿಗಲಿಲ್ಲ',

  'No income found':
    'ಆದಾಯದ ದಾಖಲೆಗಳು ಸಿಗಲಿಲ್ಲ',

  'Try another word or check the suggested spelling.':
    'ಬೇರೆ ಇಂಗ್ಲಿಷ್ ಪದವನ್ನು ಹುಡುಕಿ ಅಥವಾ ಸೂಚಿಸಿದ ಪದವನ್ನು ಪರಿಶೀಲಿಸಿ.',

  'There are no records for this period.':
    'ಈ ಅವಧಿಯಲ್ಲಿ ಯಾವುದೇ ದಾಖಲೆಗಳಿಲ್ಲ.',

  /*
   * Search
   */

  'Search records':
    'ದಾಖಲೆಗಳನ್ನು ಹುಡುಕಿ',

  'Search...':
    'ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಹುಡುಕಿ...',

  'Clear search':
    'ಹುಡುಕಾಟ ತೆರವುಗೊಳಿಸಿ',

  'Did you mean':
    'ನೀವು ಇದನ್ನು ಹುಡುಕುತ್ತಿದ್ದೀರಾ',

  /*
   * Contacts
   */

  'People who can help with the farm':
    'ಕೃಷಿಗೆ ಸಹಾಯ ಮಾಡುವ ಜನರು ಮತ್ತು ಸೇವೆಗಳು',

  'Add Contact':
    'ಸಂಪರ್ಕ ಸೇರಿಸಿ',

  'Add Farm Contact':
    'ಕೃಷಿ ಸಂಪರ್ಕ ಸೇರಿಸಿ',

  'Edit Contact':
    'ಸಂಪರ್ಕ ತಿದ್ದು',

  'Only the basics':
    'ಅಗತ್ಯ ಮಾಹಿತಿಯಷ್ಟೇ',

  Name:
    'ಹೆಸರು',

  'Name (English)':
    'ಹೆಸರು (ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ)',

  'Enter the name using English letters.':
    'ಹೆಸರನ್ನು ಇಂಗ್ಲಿಷ್ ಅಕ್ಷರಗಳಲ್ಲಿ ನಮೂದಿಸಿ.',

  'Example: Ramesh':
    'ಉದಾಹರಣೆ: Ramesh',

  'Phone number':
    'ಫೋನ್ ಸಂಖ್ಯೆ',

  '(optional for private contacts)':
    '(ಖಾಸಗಿ ಸಂಪರ್ಕಕ್ಕೆ ಐಚ್ಛಿಕ)',

  'Example: 9876543210':
    'ಉದಾಹರಣೆ: 9876543210',

  'What do they help with?':
    'ಅವರು ಯಾವ ಕೆಲಸಕ್ಕೆ ಸಹಾಯ ಮಾಡುತ್ತಾರೆ?',

  'Please enter the person or business name.':
    'ವ್ಯಕ್ತಿ ಅಥವಾ ವ್ಯವಹಾರದ ಹೆಸರನ್ನು ನಮೂದಿಸಿ.',

  'Please enter the contact name using English letters only.':
    'ಸಂಪರ್ಕದ ಹೆಸರನ್ನು ಇಂಗ್ಲಿಷ್ ಅಕ್ಷರಗಳಲ್ಲಿ ಮಾತ್ರ ನಮೂದಿಸಿ.',

  'Please choose what this contact helps with.':
    'ಈ ಸಂಪರ್ಕ ಯಾವ ಕೆಲಸಕ್ಕೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ ಎಂದು ಆಯ್ಕೆಮಾಡಿ.',

  'Please add a phone number before sharing this contact with nearby farmers.':
    'ಹತ್ತಿರದ ರೈತರೊಂದಿಗೆ ಹಂಚಿಕೊಳ್ಳುವ ಮೊದಲು ಫೋನ್ ಸಂಖ್ಯೆ ಸೇರಿಸಿ.',

  'Please set your farm location before sharing contacts with nearby farmers.':
    'ಹತ್ತಿರದ ರೈತರೊಂದಿಗೆ ಸಂಪರ್ಕ ಹಂಚಿಕೊಳ್ಳುವ ಮೊದಲು ನಿಮ್ಮ ಕೃಷಿ ಸ್ಥಳವನ್ನು ಹೊಂದಿಸಿ.',

  'Unable to save the contact. Please check your internet connection and try again.':
    'ಸಂಪರ್ಕವನ್ನು ಉಳಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕ ಪರಿಶೀಲಿಸಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',

  'Unable to delete the contact. Please try again.':
    'ಸಂಪರ್ಕವನ್ನು ಅಳಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',

  'Farm location is not available.':
    'ಕೃಷಿ ಸ್ಥಳ ಲಭ್ಯವಿಲ್ಲ.',

  'Unable to load nearby contacts right now.':
    'ಈಗ ಹತ್ತಿರದ ಸಂಪರ್ಕಗಳನ್ನು ಪಡೆಯಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ.',

  'Example: Available mornings':
    'ಉದಾಹರಣೆ: ಬೆಳಿಗ್ಗೆ ಲಭ್ಯ',

  '(optional)':
    '(ಐಚ್ಛಿಕ)',

  'Notes stay private even if you share the contact.':
    'ಸಂಪರ್ಕವನ್ನು ಹಂಚಿಕೊಂಡರೂ ಈ ಟಿಪ್ಪಣಿ ಖಾಸಗಿಯಾಗಿರುತ್ತದೆ.',

  'Share with nearby farmers':
    'ಹತ್ತಿರದ ರೈತರೊಂದಿಗೆ ಹಂಚಿಕೊಳ್ಳಿ',

  "Their name and phone number will be visible to signed-in Krishi Book users near this contact's area.":
    'ಈ ಸಂಪರ್ಕದ ಪ್ರದೇಶದ ಹತ್ತಿರ ಇರುವ ಕೃಷಿ ಬುಕ್ ಬಳಕೆದಾರರಿಗೆ ಹೆಸರು ಮತ್ತು ಫೋನ್ ಸಂಖ್ಯೆ ಕಾಣುತ್ತದೆ.',

  'Krishi Book automatically works out the nearby area for this type of contact. You do not need to choose a distance.':
    'ಈ ರೀತಿಯ ಸಂಪರ್ಕ ಸಾಮಾನ್ಯವಾಗಿ ಸೇವೆ ನೀಡುವ ಹತ್ತಿರದ ಪ್ರದೇಶವನ್ನು ಕೃಷಿ ಬುಕ್ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ನಿರ್ಧರಿಸುತ್ತದೆ. ನೀವು ದೂರವನ್ನು ಆಯ್ಕೆಮಾಡಬೇಕಿಲ್ಲ.',

  Saving:
    'ಉಳಿಸಲಾಗುತ್ತಿದೆ',

  'Saving...':
    'ಉಳಿಸಲಾಗುತ್ತಿದೆ...',

  'Save Changes':
    'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ',

  'Save Contact':
    'ಸಂಪರ್ಕ ಉಳಿಸಿ',

  'My Contacts':
    'ನನ್ನ ಸಂಪರ್ಕಗಳು',

  Nearby:
    'ಹತ್ತಿರದವು',

  'Search my contacts...':
    'ನನ್ನ ಸಂಪರ್ಕಗಳನ್ನು ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಹುಡುಕಿ...',

  'Search nearby contacts...':
    'ಹತ್ತಿರದ ಸಂಪರ್ಕಗಳನ್ನು ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಹುಡುಕಿ...',

  'No farm contacts yet':
    'ಇನ್ನೂ ಕೃಷಿ ಸಂಪರ್ಕಗಳಿಲ್ಲ',

  'Add labourers, buyers, suppliers and other people who help with the farm.':
    'ಕಾರ್ಮಿಕರು, ಖರೀದಿದಾರರು, ಪೂರೈಕೆದಾರರು ಮತ್ತು ಕೃಷಿಗೆ ಸಹಾಯ ಮಾಡುವವರನ್ನು ಸೇರಿಸಿ.',

  'No matching contacts':
    'ಹೊಂದುವ ಸಂಪರ್ಕಗಳು ಸಿಗಲಿಲ್ಲ',

  'Shared with nearby farmers':
    'ಹತ್ತಿರದ ರೈತರೊಂದಿಗೆ ಹಂಚಲಾಗಿದೆ',

  Call:
    'ಕರೆ ಮಾಡಿ',

  'Contacts near your farm':
    'ನಿಮ್ಮ ಕೃಷಿಯ ಹತ್ತಿರದ ಸಂಪರ್ಕಗಳು',

  'Showing people and services that are likely to work around':
    'ಈ ಪ್ರದೇಶದ ಸುತ್ತ ಕೆಲಸ ಮಾಡುವ ಸಾಧ್ಯತೆಯಿರುವ ಜನರು ಮತ್ತು ಸೇವೆಗಳು',

  'your farm':
    'ನಿಮ್ಮ ಕೃಷಿ',

  'Finding contacts near your farm...':
    'ನಿಮ್ಮ ಕೃಷಿಯ ಹತ್ತಿರದ ಸಂಪರ್ಕಗಳನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ...',

  'Try Again':
    'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ',

  'No shared contacts nearby yet':
    'ಹತ್ತಿರದಲ್ಲಿ ಇನ್ನೂ ಹಂಚಿಕೊಂಡ ಸಂಪರ್ಕಗಳಿಲ್ಲ',

  'As farmers around your area share useful contacts, they will appear here.':
    'ನಿಮ್ಮ ಪ್ರದೇಶದ ರೈತರು ಉಪಯುಕ್ತ ಸಂಪರ್ಕಗಳನ್ನು ಹಂಚಿಕೊಂಡಾಗ ಅವು ಇಲ್ಲಿ ಕಾಣುತ್ತವೆ.',

  'No matching nearby contacts':
    'ಹೊಂದುವ ಹತ್ತಿರದ ಸಂಪರ್ಕಗಳು ಸಿಗಲಿಲ್ಲ',

  Around:
    'ಸುತ್ತಮುತ್ತ',

  'Shared by you':
    'ನೀವು ಹಂಚಿಕೊಂಡದ್ದು',

  'Refresh Nearby Contacts':
    'ಹತ್ತಿರದ ಸಂಪರ್ಕಗಳನ್ನು ಮತ್ತೆ ಪರಿಶೀಲಿಸಿ',

  'Krishi Book · Farm Contacts':
    'ಕೃಷಿ ಬುಕ್ · ಕೃಷಿ ಸಂಪರ್ಕಗಳು',

  'Delete {name} from Farm Contacts?':
    'ಕೃಷಿ ಸಂಪರ್ಕಗಳಿಂದ {name} ಅನ್ನು ಅಳಿಸಬೇಕೇ?',

  'Call {name}':
    '{name} ಅವರಿಗೆ ಕರೆ ಮಾಡಿ',

  /*
   * Profile
   */

  'Your Krishi Book settings':
    'ನಿಮ್ಮ ಕೃಷಿ ಬುಕ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳು',

  'Krishi Book User':
    'ಕೃಷಿ ಬುಕ್ ಬಳಕೆದಾರ',

  'Farm location':
    'ಕೃಷಿ ಸ್ಥಳ',

  'Not set':
    'ಹೊಂದಿಸಲಾಗಿಲ್ಲ',

  'Change Location':
    'ಸ್ಥಳ ಬದಲಿಸಿ',

  'Change farm location':
    'ಕೃಷಿ ಸ್ಥಳ ಬದಲಿಸಿ',

  Language:
    'ಭಾಷೆ',

  English:
    'ಇಂಗ್ಲಿಷ್',

  Kannada:
    'ಕನ್ನಡ',

  Current:
    'ಆಯ್ಕೆ ಮಾಡಲಾಗಿದೆ',

  'Unable to change language. Please try again.':
    'ಭಾಷೆಯನ್ನು ಬದಲಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',

  Password:
    'ಪಾಸ್‌ವರ್ಡ್',

  'We will email you a secure link to change it.':
    'ಪಾಸ್‌ವರ್ಡ್ ಬದಲಿಸಲು ಸುರಕ್ಷಿತ ಲಿಂಕ್ ಅನ್ನು ನಿಮ್ಮ ಇಮೇಲ್‌ಗೆ ಕಳುಹಿಸುತ್ತೇವೆ.',

  'Change Password':
    'ಪಾಸ್‌ವರ್ಡ್ ಬದಲಿಸಿ',

  Sending:
    'ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ',

  'Sending...':
    'ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ...',

  'Password reset email sent. Please check your email.':
    'ಪಾಸ್‌ವರ್ಡ್ ಬದಲಿಸುವ ಇಮೇಲ್ ಕಳುಹಿಸಲಾಗಿದೆ. ನಿಮ್ಮ ಇಮೇಲ್ ಪರಿಶೀಲಿಸಿ.',

  'Unable to send the reset email. Please try again.':
    'ಪಾಸ್‌ವರ್ಡ್ ಬದಲಿಸುವ ಇಮೇಲ್ ಕಳುಹಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',

  'Log Out':
    'ಲಾಗ್ ಔಟ್',

  'Log out of Krishi Book on this phone?':
    'ಈ ಫೋನ್‌ನಲ್ಲಿ ಕೃಷಿ ಬುಕ್‌ನಿಂದ ಲಾಗ್ ಔಟ್ ಮಾಡಬೇಕೇ?',

  'Unable to log out. Please try again.':
    'ಲಾಗ್ ಔಟ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',

  'Krishi Book · Profile':
    'ಕೃಷಿ ಬುಕ್ · ಪ್ರೊಫೈಲ್',

  /*
   * Login
   */

  'Your simple farm companion':
    'ನಿಮ್ಮ ಸರಳ ಕೃಷಿ ಸಹಾಯಕ',

  'Sign In':
    'ಲಾಗಿನ್',

  'Signing in...':
    'ಲಾಗಿನ್ ಆಗುತ್ತಿದೆ...',

  'Create Account':
    'ಖಾತೆ ತೆರೆಯಿರಿ',

  'Creating account...':
    'ಖಾತೆ ತೆರೆಯಲಾಗುತ್ತಿದೆ...',

  'Your name':
    'ನಿಮ್ಮ ಹೆಸರು',

  Email:
    'ಇಮೇಲ್',

  'Confirm password':
    'ಪಾಸ್‌ವರ್ಡ್ ಖಚಿತಪಡಿಸಿ',

  'At least 6 characters':
    'ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳು',

  'Forgot password?':
    'ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿರಾ?',

  Back:
    'ಹಿಂದೆ',

  'Enter your email and we will send you a link to choose a new password.':
    'ನಿಮ್ಮ ಇಮೇಲ್ ನಮೂದಿಸಿ. ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ಆಯ್ಕೆಮಾಡಲು ಲಿಂಕ್ ಕಳುಹಿಸುತ್ತೇವೆ.',

  'Send Reset Email':
    'ಪಾಸ್‌ವರ್ಡ್ ಬದಲಿಸುವ ಇಮೇಲ್ ಕಳುಹಿಸಿ',

  'Please enter your email and password.':
    'ನಿಮ್ಮ ಇಮೇಲ್ ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ.',

  'Please enter your name.':
    'ನಿಮ್ಮ ಹೆಸರನ್ನು ನಮೂದಿಸಿ.',

  'Please enter your email.':
    'ನಿಮ್ಮ ಇಮೇಲ್ ನಮೂದಿಸಿ.',

  'Please enter your email address.':
    'ನಿಮ್ಮ ಇಮೇಲ್ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ.',

  'Please choose a password with at least 6 characters.':
    'ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳ ಪಾಸ್‌ವರ್ಡ್ ಆಯ್ಕೆಮಾಡಿ.',

  'The two passwords do not match.':
    'ಎರಡು ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ.',

  'An account already exists with this email.':
    'ಈ ಇಮೇಲ್‌ನೊಂದಿಗೆ ಈಗಾಗಲೇ ಖಾತೆ ಇದೆ.',

  'Please enter a valid email address.':
    'ಸರಿಯಾದ ಇಮೇಲ್ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ.',

  'The email or password is incorrect.':
    'ಇಮೇಲ್ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್ ತಪ್ಪಾಗಿದೆ.',

  'Too many attempts. Please wait a little and try again.':
    'ಹಲವಾರು ಬಾರಿ ಪ್ರಯತ್ನಿಸಲಾಗಿದೆ. ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',

  'Something went wrong. Please try again.':
    'ಏನೋ ಸಮಸ್ಯೆಯಾಗಿದೆ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',

  'Krishi Book keeps you signed in on this phone until you log out.':
    'ನೀವು ಲಾಗ್ ಔಟ್ ಮಾಡುವವರೆಗೆ ಈ ಫೋನ್‌ನಲ್ಲಿ ಕೃಷಿ ಬುಕ್ ಲಾಗಿನ್ ಆಗಿಯೇ ಇರುತ್ತದೆ.',

  /*
   * Farm location
   */

  'Set your farm location':
    'ನಿಮ್ಮ ಕೃಷಿ ಸ್ಥಳ ಹೊಂದಿಸಿ',

  'Please do this while you are at or near your farm.':
    'ನೀವು ಕೃಷಿ ಜಾಗದಲ್ಲಿರುವಾಗ ಅಥವಾ ಅದರ ಹತ್ತಿರಿರುವಾಗ ಇದನ್ನು ಮಾಡಿ.',

  'Find your farm':
    'ನಿಮ್ಮ ಕೃಷಿ ಸ್ಥಳ ಹುಡುಕಿ',

  'Krishi Book will use your phone to find the farm location for weather information.':
    'ಹವಾಮಾನ ಮಾಹಿತಿಗಾಗಿ ಕೃಷಿ ಸ್ಥಳವನ್ನು ಕಂಡುಹಿಡಿಯಲು ಕೃಷಿ ಬುಕ್ ನಿಮ್ಮ ಫೋನ್‌ನ ಸ್ಥಳವನ್ನು ಬಳಸುತ್ತದೆ.',

  'Finding your farm...':
    'ನಿಮ್ಮ ಕೃಷಿ ಸ್ಥಳ ಹುಡುಕಲಾಗುತ್ತಿದೆ...',

  'Use My Location':
    'ನನ್ನ ಸ್ಥಳ ಬಳಸಿ',

  Cancel:
    'ರದ್ದುಮಾಡಿ',

  'We found:':
    'ನಾವು ಕಂಡ ಸ್ಥಳ:',

  'Is this your farm?':
    'ಇದು ನಿಮ್ಮ ಕೃಷಿ ಸ್ಥಳವೇ?',

  'Yes, Save':
    'ಹೌದು, ಉಳಿಸಿ',

  'Signed in as':
    'ಲಾಗಿನ್ ಆಗಿರುವ ಖಾತೆ',

  'Use Another Account':
    'ಬೇರೆ ಖಾತೆ ಬಳಸಿ',

  'Use another Krishi Book account on this phone?':
    'ಈ ಫೋನ್‌ನಲ್ಲಿ ಬೇರೆ ಕೃಷಿ ಬುಕ್ ಖಾತೆ ಬಳಸಬೇಕೇ?',

  'Krishi Book user':
    'ಕೃಷಿ ಬುಕ್ ಬಳಕೆದಾರ',

  'Place names provided using OpenStreetMap data':
    'ಸ್ಥಳದ ಹೆಸರುಗಳಿಗೆ OpenStreetMap ಮಾಹಿತಿಯನ್ನು ಬಳಸಲಾಗಿದೆ',

  'Location is not supported on this device.':
    'ಈ ಸಾಧನದಲ್ಲಿ ಸ್ಥಳ ಸೇವೆ ಲಭ್ಯವಿಲ್ಲ.',

  'Location permission is turned off. Please allow location access and try again.':
    'ಸ್ಥಳ ಅನುಮತಿ ಆಫ್ ಆಗಿದೆ. ಸ್ಥಳ ಪ್ರವೇಶಕ್ಕೆ ಅನುಮತಿ ನೀಡಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',

  'Your phone could not find the location. Please move somewhere with a better signal and try again.':
    'ನಿಮ್ಮ ಫೋನ್ ಸ್ಥಳವನ್ನು ಕಂಡುಹಿಡಿಯಲಿಲ್ಲ. ಉತ್ತಮ ಸಿಗ್ನಲ್ ಇರುವ ಜಾಗಕ್ಕೆ ಹೋಗಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',

  'Finding the location took too long. Please try again.':
    'ಸ್ಥಳ ಕಂಡುಹಿಡಿಯಲು ಹೆಚ್ಚು ಸಮಯ ತೆಗೆದುಕೊಂಡಿತು. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',

  'Unable to find your location. Please try again.':
    'ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಕಂಡುಹಿಡಿಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',

  'Unable to find the place name.':
    'ಸ್ಥಳದ ಹೆಸರನ್ನು ಕಂಡುಹಿಡಿಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.',

  'Unable to save your farm location. Please try again.':
    'ಕೃಷಿ ಸ್ಥಳವನ್ನು ಉಳಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',

  'Unable to change account. Please try again.':
    'ಖಾತೆ ಬದಲಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',

  /*
   * Weather UI
   */

  'Checking farm weather...':
    'ಕೃಷಿ ಹವಾಮಾನ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...',

  'Weather unavailable':
    'ಹವಾಮಾನ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ',

  'Tap to try again':
    'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಲು ಒತ್ತಿರಿ',

  'Last saved forecast · ':
    'ಕೊನೆಯದಾಗಿ ಉಳಿಸಿದ ಮುನ್ಸೂಚನೆ · ',

  'Farm Weather':
    'ಕೃಷಿ ಹವಾಮಾನ',

  "Checking today's conditions...":
    'ಇಂದಿನ ಹವಾಮಾನ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...',

  'Getting farm weather...':
    'ಕೃಷಿ ಹವಾಮಾನ ಪಡೆಯಲಾಗುತ್ತಿದೆ...',

  'Should we do farm work today?':
    'ಇಂದು ಕೃಷಿ ಕೆಲಸ ಮಾಡಬಹುದೇ?',

  'Unable to get the farm weather right now.':
    'ಈಗ ಕೃಷಿ ಹವಾಮಾನ ಮಾಹಿತಿ ಪಡೆಯಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ.',

  'Refresh weather':
    'ಹವಾಮಾನ ಮತ್ತೆ ಪರಿಶೀಲಿಸಿ',

  'Feels like':
    'ಅನುಭವವಾಗುವ ತಾಪಮಾನ',

  'Internet weather update is unavailable. Showing the last saved forecast.':
    'ಇಂಟರ್ನೆಟ್ ಹವಾಮಾನ ನವೀಕರಣ ಲಭ್ಯವಿಲ್ಲ. ಕೊನೆಯದಾಗಿ ಉಳಿಸಿದ ಮುನ್ಸೂಚನೆಯನ್ನು ತೋರಿಸಲಾಗುತ್ತಿದೆ.',

  'High / Low':
    'ಗರಿಷ್ಠ / ಕನಿಷ್ಠ',

  'Rain from now':
    'ಇಂದಿನಿಂದ ಮಳೆ',

  'Rain later':
    'ಮುಂದೆ ಮಳೆ',

  'mm remaining':
    'ಮಿಮೀ ಉಳಿದಿದೆ',

  mm:
    'ಮಿಮೀ',

  'Humidity now':
    'ಈಗಿನ ತೇವಾಂಶ',

  'Max wind':
    'ಗರಿಷ್ಠ ಗಾಳಿ',

  Gust:
    'ಗಾಳಿಯ ಹೊಡೆತ',

  'km/h':
    'ಕಿಮೀ/ಗಂ',

  'Rain timing':
    'ಮಳೆಯ ಸಮಯ',

  'No more rain expected today':
    'ಇಂದು ಮುಂದೆ ಮಳೆಯ ನಿರೀಕ್ಷೆಯಿಲ್ಲ',

  'No rain expected today':
    'ಇಂದು ಮಳೆಯ ನಿರೀಕ್ಷೆಯಿಲ್ಲ',

  'The forecast from now until tonight is mostly dry. Local showers can still develop, so check the sky before weather-sensitive work.':
    'ಈಗಿನಿಂದ ರಾತ್ರಿ ವರೆಗೆ ಬಹುತೇಕ ಒಣ ಹವಾಮಾನ ನಿರೀಕ್ಷೆಯಿದೆ. ಸ್ಥಳೀಯ ಮಳೆ ಬರಬಹುದಾದ್ದರಿಂದ ಹವಾಮಾನಕ್ಕೆ ಸೂಕ್ಷ್ಮವಾದ ಕೆಲಸ ಮಾಡುವ ಮೊದಲು ಆಕಾಶವನ್ನು ಪರಿಶೀಲಿಸಿ.',

  'Up to {chance}% chance':
    'ಗರಿಷ್ಠ {chance}% ಸಾಧ್ಯತೆ',

  'Farm plan for today':
    'ಇಂದಿನ ಕೃಷಿ ಯೋಜನೆ',

  "Suggestions based on today's weather at the farm.":
    'ಕೃಷಿ ಸ್ಥಳದ ಇಂದಿನ ಹವಾಮಾನ ಆಧಾರಿತ ಸಲಹೆಗಳು.',

  'Good to do':
    'ಮಾಡಲು ಸೂಕ್ತ',

  'Avoid / postpone':
    'ತಪ್ಪಿಸಿ / ಮುಂದೂಡಿ',

  'Be careful':
    'ಎಚ್ಚರಿಕೆಯಿಂದ ಮಾಡಿ',

  'Next few days':
    'ಮುಂದಿನ ಕೆಲವು ದಿನಗಳು',

  'Rain {chance}%':
    'ಮಳೆ {chance}%',

  'Weather guide':
    'ಹವಾಮಾನ ಮಾರ್ಗದರ್ಶಿ',

  'Farm suggestions use weather only. They do not know the exact soil condition, crop stage or chemical being used. Always check actual farm conditions and follow pesticide or fertiliser product instructions.':
    'ಕೃಷಿ ಸಲಹೆಗಳು ಹವಾಮಾನ ಮಾಹಿತಿಯನ್ನು ಮಾತ್ರ ಬಳಸುತ್ತವೆ. ಮಣ್ಣಿನ ನೈಜ ಸ್ಥಿತಿ, ಬೆಳೆಯ ಹಂತ ಅಥವಾ ಬಳಸುವ ರಾಸಾಯನಿಕದ ಮಾಹಿತಿ ಇದಕ್ಕೆ ತಿಳಿದಿರುವುದಿಲ್ಲ. ಕೃಷಿ ಸ್ಥಳದ ನೈಜ ಪರಿಸ್ಥಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಕೀಟನಾಶಕ ಅಥವಾ ಗೊಬ್ಬರದ ಸೂಚನೆಗಳನ್ನು ಪಾಲಿಸಿ.',

  Updated:
    'ನವೀಕರಿಸಲಾಗಿದೆ',

  'Weather data by Open-Meteo':
    'ಹವಾಮಾನ ಮಾಹಿತಿ: Open-Meteo',

  'Krishi Book · Farm Assistant':
    'ಕೃಷಿ ಬುಕ್ · ಕೃಷಿ ಸಹಾಯಕ',

  /*
   * Weather descriptions
   */

  Sunny:
    'ಬಿಸಿಲು',

  Clear:
    'ನಿರ್ಮಲ ಆಕಾಶ',

  'Mostly clear':
    'ಬಹುತೇಕ ನಿರ್ಮಲ',

  'Partly cloudy':
    'ಭಾಗಶಃ ಮೋಡ',

  Cloudy:
    'ಮೋಡ ಕವಿದಿದೆ',

  Foggy:
    'ಮಂಜು',

  Drizzle:
    'ತುಂತುರು ಮಳೆ',

  Rain:
    'ಮಳೆ',

  'Rain showers':
    'ಚದುರಿದ ಮಳೆ',

  Snow:
    'ಹಿಮಪಾತ',

  Thunderstorm:
    'ಗುಡುಗು ಸಹಿತ ಮಳೆ',

  Weather:
    'ಹವಾಮಾನ',

  /*
   * Farm weather advice
   */

  'Dry coconut / arecanut outdoors':
    'ತೆಂಗಿನಕಾಯಿ / ಅಡಿಕೆಯನ್ನು ಹೊರಗೆ ಒಣಗಿಸಬಹುದು',

  'A relatively dry and sunny day is forecast. Keep checking the sky because local showers can still develop.':
    'ಇಂದು ಹೋಲಿಸಿದರೆ ಒಣ ಮತ್ತು ಬಿಸಿಲಿನ ಹವಾಮಾನ ನಿರೀಕ್ಷೆಯಿದೆ. ಸ್ಥಳೀಯ ಮಳೆ ಬರಬಹುದಾದ್ದರಿಂದ ಆಕಾಶವನ್ನು ಗಮನಿಸುತ್ತಿರಿ.',

  'Drying may be possible for part of the day':
    'ದಿನದ ಕೆಲವು ಸಮಯದಲ್ಲಿ ಒಣಗಿಸಲು ಸಾಧ್ಯವಾಗಬಹುದು',

  'Cloud or limited sunshine may slow drying even though significant rain is not expected.':
    'ಹೆಚ್ಚಿನ ಮಳೆ ನಿರೀಕ್ಷೆಯಿಲ್ಲದಿದ್ದರೂ ಮೋಡ ಅಥವಾ ಕಡಿಮೆ ಬಿಸಿಲಿನಿಂದ ಒಣಗುವಿಕೆ ನಿಧಾನವಾಗಬಹುದು.',

  'Avoid outdoor drying':
    'ಹೊರಗೆ ಒಣಗಿಸುವುದನ್ನು ತಪ್ಪಿಸಿ',

  'Today does not look suitable for reliable outdoor drying.':
    'ಇಂದು ಹೊರಗೆ ವಿಶ್ವಾಸಾರ್ಹವಾಗಿ ಒಣಗಿಸಲು ಸೂಕ್ತ ದಿನವಾಗಿ ಕಾಣುತ್ತಿಲ್ಲ.',

  'Avoid coconut / arecanut tree climbing':
    'ತೆಂಗಿನ / ಅಡಿಕೆ ಮರ ಏರುವುದನ್ನು ತಪ್ಪಿಸಿ',

  'Thunderstorms or strong gusts can make tree work dangerous. Wait for calmer, dry conditions.':
    'ಗುಡುಗು ಮಳೆ ಅಥವಾ ಬಲವಾದ ಗಾಳಿಯ ಹೊಡೆತ ಮರದ ಕೆಲಸವನ್ನು ಅಪಾಯಕಾರಿಯಾಗಿಸಬಹುದು. ಹವಾಮಾನ ಶಾಂತ ಮತ್ತು ಒಣಗುವವರೆಗೆ ಕಾಯಿರಿ.',

  'Tree work only in a dry, calm window':
    'ಮಳೆ ಇಲ್ಲದ, ಗಾಳಿ ಕಡಿಮೆ ಇರುವ ಸಮಯದಲ್ಲಷ್ಟೇ ಮರದ ಕೆಲಸ ಮಾಡಿ',

  'Check rain, wind and the actual condition at the farm before climbing or harvesting.':
    'ಮರ ಏರುವ ಅಥವಾ ಕೊಯ್ಲು ಮಾಡುವ ಮೊದಲು ಮಳೆ, ಗಾಳಿ ಮತ್ತು ಕೃಷಿ ಸ್ಥಳದ ನೈಜ ಪರಿಸ್ಥಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ.',

  'Harvesting / tree work looks more suitable':
    'ಕೊಯ್ಲು / ಮರದ ಕೆಲಸಕ್ಕೆ ಪರಿಸ್ಥಿತಿ ಹೆಚ್ಚು ಸೂಕ್ತವಾಗಿದೆ',

  'The forecast is relatively dry and calm. Still check conditions at the farm before climbing.':
    'ಹವಾಮಾನ ಹೋಲಿಸಿದರೆ ಒಣ ಮತ್ತು ಶಾಂತವಾಗಿದೆ. ಆದರೂ ಮರ ಏರುವ ಮೊದಲು ಕೃಷಿ ಸ್ಥಳದ ಪರಿಸ್ಥಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ.',

  'Do covered farm work instead':
    'ಬದಲಿಗೆ ಛಾವಣಿಯೊಳಗಿನ ಕೃಷಿ ಕೆಲಸ ಮಾಡಿ',

  'Clean tools, organise supplies, sort produce under cover, or update farm records.':
    'ಉಪಕರಣಗಳನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಿ, ಸಾಮಗ್ರಿಗಳನ್ನು ಸರಿಪಡಿಸಿ, ಉತ್ಪನ್ನಗಳನ್ನು ಛಾವಣಿಯಡಿ ವಿಂಗಡಿಸಿ ಅಥವಾ ಕೃಷಿ ದಾಖಲೆಗಳನ್ನು ನವೀಕರಿಸಿ.',

  'Farm cleaning under cover':
    'ಛಾವಣಿಯಡಿ ಕೃಷಿ ಸ್ವಚ್ಛತಾ ಕೆಲಸ',

  'Cleaning tools, sheds and covered work areas can still be useful when outdoor work is interrupted by rain.':
    'ಮಳೆ ಹೊರಾಂಗಣ ಕೆಲಸಕ್ಕೆ ಅಡ್ಡಿಯಾದಾಗ ಉಪಕರಣಗಳು, ಶೆಡ್ ಮತ್ತು ಛಾವಣಿಯಿರುವ ಕೆಲಸದ ಸ್ಥಳಗಳನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಬಹುದು.',

  'Farm cleaning / light weeding':
    'ಕೃಷಿ ಸ್ವಚ್ಛತೆ / ಹಗುರ ಕಳೆ ತೆಗೆಯುವ ಕೆಲಸ',

  'Weather looks suitable for general cleaning and lighter outdoor work.':
    'ಸಾಮಾನ್ಯ ಸ್ವಚ್ಛತೆ ಮತ್ತು ಹಗುರ ಹೊರಾಂಗಣ ಕೆಲಸಕ್ಕೆ ಹವಾಮಾನ ಸೂಕ್ತವಾಗಿದೆ.',

  'Check and clear drainage before rain':
    'ಮಳೆಯ ಮೊದಲು ನೀರು ಹರಿಯುವ ದಾರಿಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ಸ್ವಚ್ಛಗೊಳಿಸಿ',

  'Keep drainage paths clear before heavier rain develops.':
    'ಹೆಚ್ಚಿನ ಮಳೆಯ ಮೊದಲು ನೀರು ಹರಿಯುವ ದಾರಿಗಳಲ್ಲಿನ ಅಡಚಣೆಗಳನ್ನು ತೆರವುಗೊಳಿಸಿ.',

  'Planting / new plants may suit the moisture':
    'ನೆಡುವುದು / ಹೊಸ ಸಸಿಗಳಿಗೆ ಈ ತೇವಾಂಶ ಸೂಕ್ತವಾಗಬಹುದು',

  'Light rain can help soil moisture. Avoid planting in waterlogged or poorly drained spots.':
    'ಸಣ್ಣ ಮಳೆ ಮಣ್ಣಿನ ತೇವಾಂಶಕ್ಕೆ ಸಹಾಯ ಮಾಡಬಹುದು. ನೀರು ನಿಲ್ಲುವ ಅಥವಾ ನೀರು ಸರಿಯಾಗಿ ಹರಿಯದ ಜಾಗದಲ್ಲಿ ನೆಡುವುದನ್ನು ತಪ್ಪಿಸಿ.',

  'Pesticide spraying':
    'ಕೀಟನಾಶಕ ಸಿಂಪಡಣೆ',

  'Rain or wind can reduce spray effectiveness and increase drift. Follow the product label and spray only when local conditions are suitable.':
    'ಮಳೆ ಅಥವಾ ಗಾಳಿ ಸಿಂಪಡಣೆಯ ಪರಿಣಾಮಕಾರಿತ್ವವನ್ನು ಕಡಿಮೆ ಮಾಡಬಹುದು. ಉತ್ಪನ್ನದ ಲೇಬಲ್ ಸೂಚನೆಗಳನ್ನು ಪಾಲಿಸಿ ಮತ್ತು ಸ್ಥಳೀಯ ಪರಿಸ್ಥಿತಿ ಸೂಕ್ತವಾಗಿದ್ದಾಗ ಮಾತ್ರ ಸಿಂಪಡಿಸಿ.',

  'Spraying may be possible':
    'ಸಿಂಪಡಣೆ ಮಾಡಲು ಸಾಧ್ಯವಾಗಬಹುದು',

  'The next few hours look drier and calmer, but check the pesticide label and the wind at the field before spraying.':
    'ಮುಂದಿನ ಕೆಲವು ಗಂಟೆಗಳು ಒಣ ಮತ್ತು ಗಾಳಿ ಕಡಿಮೆ ಇರುವಂತೆ ಕಾಣುತ್ತಿವೆ. ಆದರೂ ಸಿಂಪಡಿಸುವ ಮೊದಲು ಕೀಟನಾಶಕದ ಲೇಬಲ್ ಮತ್ತು ಕೃಷಿ ಸ್ಥಳದ ಗಾಳಿಯನ್ನು ಪರಿಶೀಲಿಸಿ.',

  'Fertiliser / compost application before heavy rain':
    'ಭಾರೀ ಮಳೆಯ ಮೊದಲು ಗೊಬ್ಬರ / ಕಾಂಪೋಸ್ಟ್ ಹಾಕುವುದನ್ನು ತಪ್ಪಿಸಿ',

  'Heavy rain can wash nutrients away or cause runoff. Wait for a more suitable window and follow the product guidance.':
    'ಭಾರೀ ಮಳೆ ಪೋಷಕಾಂಶಗಳನ್ನು ತೊಳೆದು ಕೊಂಡು ಹೋಗಬಹುದು. ಉತ್ತಮ ಸಮಯಕ್ಕಾಗಿ ಕಾಯಿರಿ ಮತ್ತು ಉತ್ಪನ್ನದ ಸೂಚನೆಗಳನ್ನು ಪಾಲಿಸಿ.',

  'Check fertiliser timing':
    'ಗೊಬ್ಬರ ಹಾಕುವ ಸಮಯವನ್ನು ಪರಿಶೀಲಿಸಿ',

  'Rain timing matters. Avoid application immediately before heavy rain and follow the product instructions.':
    'ಮಳೆ ಬರುವ ಸಮಯ ಮುಖ್ಯ. ಭಾರೀ ಮಳೆಯ ತಕ್ಷಣ ಮೊದಲು ಗೊಬ್ಬರ ಹಾಕುವುದನ್ನು ತಪ್ಪಿಸಿ ಮತ್ತು ಉತ್ಪನ್ನದ ಸೂಚನೆಗಳನ್ನು ಪಾಲಿಸಿ.',

  'Routine irrigation may not be needed':
    'ಸಾಮಾನ್ಯ ನೀರಾವರಿ ಅಗತ್ಯವಿಲ್ಲದಿರಬಹುದು',

  'Rain is expected. Check actual soil moisture before watering.':
    'ಮಳೆ ನಿರೀಕ್ಷೆಯಿದೆ. ನೀರು ಹಾಕುವ ಮೊದಲು ಮಣ್ಣಿನ ನೈಜ ತೇವಾಂಶವನ್ನು ಪರಿಶೀಲಿಸಿ.',

  'Check soil moisture for irrigation':
    'ನೀರಾವರಿಗಾಗಿ ಮಣ್ಣಿನ ತೇವಾಂಶ ಪರಿಶೀಲಿಸಿ',

  'The day may be relatively drying. Water only if the crop and soil actually need it.':
    'ದಿನವು ತುಸು ಒಣಗುವ ಸ್ವಭಾವದಿರಬಹುದು. ಬೆಳೆ ಮತ್ತು ಮಣ್ಣಿಗೆ ನಿಜವಾಗಿಯೂ ಅಗತ್ಯವಿದ್ದರೆ ಮಾತ್ರ ನೀರು ಹಾಕಿ.',

  'Reduce heavy work around midday':
    'ಮಧ್ಯಾಹ್ನದ ಸಮಯದಲ್ಲಿ ಭಾರವಾದ ಕೆಲಸ ಕಡಿಮೆ ಮಾಡಿ',

  'High daytime temperature is expected. Prefer cooler morning or late-afternoon work where possible.':
    'ಹಗಲಿನಲ್ಲಿ ಹೆಚ್ಚಿನ ತಾಪಮಾನ ನಿರೀಕ್ಷೆಯಿದೆ. ಸಾಧ್ಯವಾದರೆ ತಂಪಾದ ಬೆಳಿಗ್ಗೆ ಅಥವಾ ಸಂಜೆ ಸಮಯದಲ್ಲಿ ಕೆಲಸ ಮಾಡಿ.',

  'Outdoor work during thunder':
    'ಗುಡುಗಿನ ಸಮಯದಲ್ಲಿ ಹೊರಾಂಗಣ ಕೆಲಸ ಮಾಡಬೇಡಿ',

  'Stop exposed outdoor work if thunder or lightning develops and move to a safe shelter.':
    'ಗುಡುಗು ಅಥವಾ ಮಿಂಚು ಶುರುವಾದರೆ ತೆರೆದ ಜಾಗದ ಕೆಲಸ ನಿಲ್ಲಿಸಿ ಮತ್ತು ಸುರಕ್ಷಿತ ಆಶ್ರಯಕ್ಕೆ ಹೋಗಿ.',

  'Good day for farm work':
    'ಕೃಷಿ ಕೆಲಸಕ್ಕೆ ಒಳ್ಳೆಯ ದಿನ',

  'Most routine outdoor work looks possible, with normal on-site checks.':
    'ಹೆಚ್ಚಿನ ಸಾಮಾನ್ಯ ಹೊರಾಂಗಣ ಕೃಷಿ ಕೆಲಸಗಳನ್ನು ಮಾಡಬಹುದು. ಕೃಷಿ ಸ್ಥಳದ ಪರಿಸ್ಥಿತಿಯನ್ನು ಎಂದಿನಂತೆ ಪರಿಶೀಲಿಸಿ.',

  'Plan farm work around the weather':
    'ಹವಾಮಾನಕ್ಕೆ ಅನುಗುಣವಾಗಿ ಕೃಷಿ ಕೆಲಸ ಯೋಜಿಸಿ',

  'Some rain or stronger wind may interrupt outdoor work.':
    'ಕೆಲವು ಮಳೆ ಅಥವಾ ಹೆಚ್ಚು ಗಾಳಿ ಹೊರಾಂಗಣ ಕೆಲಸಕ್ಕೆ ಅಡ್ಡಿಯಾಗಬಹುದು.',

  'Outdoor work may be disrupted today':
    'ಇಂದು ಹೊರಾಂಗಣ ಕೆಲಸಕ್ಕೆ ಅಡ್ಡಿಯಾಗಬಹುದು',

  'Thunderstorms are possible. Prioritise safety and covered work.':
    'ಗುಡುಗು ಮಳೆಯ ಸಾಧ್ಯತೆ ಇದೆ. ಸುರಕ್ಷತೆ ಮತ್ತು ಛಾವಣಿಯೊಳಗಿನ ಕೆಲಸಕ್ಕೆ ಆದ್ಯತೆ ನೀಡಿ.',

  'Heavy rain or strong wind is expected. Prefer safer or covered tasks.':
    'ಭಾರೀ ಮಳೆ ಅಥವಾ ಬಲವಾದ ಗಾಳಿ ನಿರೀಕ್ಷೆಯಿದೆ. ಸುರಕ್ಷಿತ ಅಥವಾ ಛಾವಣಿಯೊಳಗಿನ ಕೆಲಸಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
}

/*
 * --------------------------------
 * CANONICAL DATABASE VALUES
 * --------------------------------
 *
 * Keys are exactly what remains
 * stored in Firestore.
 */

const VALUE_LABELS = {
  Labour: {
    en: 'Labour',
    kn: 'ಕೂಲಿ ಕೆಲಸ',
  },

  'Manual Labour': {
    en: 'Labour',
    kn: 'ಕೂಲಿ ಕೆಲಸ',
  },

  Cleaning: {
    en: 'Cleaning',
    kn: 'ಸ್ವಚ್ಛತಾ ಕೆಲಸ',
  },

  Planting: {
    en: 'Planting',
    kn: 'ನೆಡುವ ಕೆಲಸ',
  },

  'General / Other Work': {
    en: 'General / Other Work',
    kn: 'ಸಾಮಾನ್ಯ / ಇತರೆ ಕೆಲಸ',
  },

  'General farm work': {
    en: 'General farm work',
    kn: 'ಸಾಮಾನ್ಯ ಕೃಷಿ ಕೆಲಸ',
  },

  Harvesting: {
    en: 'Harvesting',
    kn: 'ಕೊಯ್ಲು',
  },

  Crop: {
    en: 'Crop',
    kn: 'ಬೆಳೆ',
  },

  'Fertilizer / Chunna / Compost': {
    en: 'Fertilizer / Chunna / Compost',
    kn: 'ಗೊಬ್ಬರ / ಸುಣ್ಣ / ಕಾಂಪೋಸ್ಟ್',
  },

  Fertilizer: {
    en: 'Fertilizer',
    kn: 'ಗೊಬ್ಬರ',
  },

  Chunna: {
    en: 'Chunna',
    kn: 'ಸುಣ್ಣ',
  },

  Compost: {
    en: 'Compost',
    kn: 'ಕಾಂಪೋಸ್ಟ್',
  },

  Pesticide: {
    en: 'Pesticide',
    kn: 'ಕೀಟನಾಶಕ',
  },

  'New Plants / Seeds': {
    en: 'New Plants / Seeds',
    kn: 'ಹೊಸ ಸಸಿಗಳು / ಬೀಜಗಳು',
  },

  'New Plant': {
    en: 'New Plant',
    kn: 'ಹೊಸ ಸಸಿ',
  },

  'New Seeds': {
    en: 'New Seeds',
    kn: 'ಹೊಸ ಬೀಜಗಳು',
  },

  'Other Crop Expense': {
    en: 'Other Crop Expense',
    kn: 'ಇತರೆ ಬೆಳೆ ಖರ್ಚು',
  },

  'Water / Pipe / Sprinkler / Borewell': {
    en: 'Water / Pipe / Sprinkler / Borewell',
    kn: 'ನೀರು / ಪೈಪ್ / ಸ್ಪ್ರಿಂಕ್ಲರ್ / ಬೋರ್‌ವೆಲ್',
  },

  'Machine / Transport / Tools': {
    en: 'Machine / Transport / Tools',
    kn: 'ಯಂತ್ರ / ಸಾರಿಗೆ / ಉಪಕರಣಗಳು',
  },

  'Land / Boundary / Levelling': {
    en: 'Land / Boundary / Levelling',
    kn: 'ಜಮೀನು / ಗಡಿ / ಸಮತಟ್ಟು ಕೆಲಸ',
  },

  'Other Expense': {
    en: 'Other Expense',
    kn: 'ಇತರೆ ಖರ್ಚು',
  },

  Water: {
    en: 'Water',
    kn: 'ನೀರು',
  },

  Equipment: {
    en: 'Equipment',
    kn: 'ಉಪಕರಣಗಳು',
  },

  Land: {
    en: 'Land',
    kn: 'ಜಮೀನು',
  },

  Others: {
    en: 'Other',
    kn: 'ಇತರೆ',
  },

  Sold: {
    en: 'Sold',
    kn: 'ಮಾರಾಟ',
  },

  'Agricultural benefit': {
    en: 'Agricultural benefit',
    kn: 'ಕೃಷಿ ಸಹಾಯಧನ',
  },

  Other: {
    en: 'Other',
    kn: 'ಇತರೆ',
  },

  Coconut: {
    en: 'Coconut',
    kn: 'ತೆಂಗಿನಕಾಯಿ',
  },

  Supari: {
    en: 'Supari / Arecanut',
    kn: 'ಅಡಿಕೆ',
  },

  /*
   * IMPORTANT:
   *
   * Firestore still stores:
   * Pepper
   *
   * Only the display label changes.
   */
  Pepper: {
    en: 'Black Pepper',
    kn: 'ಕರಿ ಮೆಣಸು',
  },

  Vegetable: {
    en: 'Vegetable',
    kn: 'ತರಕಾರಿ',
  },
}

/*
 * --------------------------------
 * CONTACT CATEGORY DISPLAY
 * --------------------------------
 *
 * Firestore continues storing the
 * existing role IDs.
 */

const CONTACT_CATEGORY_TEXT = {
  'farm-labour': {
    en: {
      label:
        'Farm Labour',

      description:
        'Workers, cleaning, planting and other farm work',
    },

    kn: {
      label:
        'ಕೃಷಿ ಕೂಲಿ ಕಾರ್ಮಿಕರು',

      description:
        'ಸ್ವಚ್ಛತೆ, ನೆಡುವುದು ಮತ್ತು ಇತರೆ ಕೃಷಿ ಕೆಲಸಗಳಿಗೆ ಕಾರ್ಮಿಕರು',
    },
  },

  'coconut-buyer': {
    en: {
      label:
        'Coconut Buyer',

      description:
        'Person who buys coconuts',
    },

    kn: {
      label:
        'ತೆಂಗಿನಕಾಯಿ ಖರೀದಿದಾರ',

      description:
        'ತೆಂಗಿನಕಾಯಿ ಖರೀದಿಸುವ ವ್ಯಕ್ತಿ',
    },
  },

  'supari-buyer': {
    en: {
      label:
        'Supari / Arecanut Buyer',

      description:
        'Person who buys supari / arecanut',
    },

    kn: {
      label:
        'ಅಡಿಕೆ ಖರೀದಿದಾರ',

      description:
        'ಅಡಿಕೆ ಖರೀದಿಸುವ ವ್ಯಕ್ತಿ',
    },
  },

  'pepper-buyer': {
    en: {
      label:
        'Black Pepper Buyer',

      description:
        'Person who buys black pepper',
    },

    kn: {
      label:
        'ಕರಿ ಮೆಣಸು ಖರೀದಿದಾರ',

      description:
        'ಕರಿ ಮೆಣಸು ಖರೀದಿಸುವ ವ್ಯಕ್ತಿ',
    },
  },

  'vegetable-buyer': {
    en: {
      label:
        'Vegetable Buyer',

      description:
        'Person who buys vegetables',
    },

    kn: {
      label:
        'ತರಕಾರಿ ಖರೀದಿದಾರ',

      description:
        'ತರಕಾರಿ ಖರೀದಿಸುವ ವ್ಯಕ್ತಿ',
    },
  },

  'crop-supplies': {
    en: {
      label:
        'Fertiliser / Chunna / Compost / Pesticide',

      description:
        'Fertiliser, chunna, compost and pesticide supplier',
    },

    kn: {
      label:
        'ಗೊಬ್ಬರ / ಸುಣ್ಣ / ಕಾಂಪೋಸ್ಟ್ / ಕೀಟನಾಶಕ',

      description:
        'ಗೊಬ್ಬರ, ಸುಣ್ಣ, ಕಾಂಪೋಸ್ಟ್ ಮತ್ತು ಕೀಟನಾಶಕ ಪೂರೈಕೆದಾರ',
    },
  },

  nursery: {
    en: {
      label:
        'Nursery',

      description:
        'New plants, saplings and seeds',
    },

    kn: {
      label:
        'ನರ್ಸರಿ',

      description:
        'ಹೊಸ ಸಸಿಗಳು ಮತ್ತು ಬೀಜಗಳು',
    },
  },

  'water-service': {
    en: {
      label:
        'Pipe / Sprinkler / Water',

      description:
        'Pipe, sprinkler, pump, tank and other water work',
    },

    kn: {
      label:
        'ಪೈಪ್ / ಸ್ಪ್ರಿಂಕ್ಲರ್ / ನೀರು',

      description:
        'ಪೈಪ್, ಸ್ಪ್ರಿಂಕ್ಲರ್, ಪಂಪ್, ಟ್ಯಾಂಕ್ ಮತ್ತು ನೀರಿನ ಕೆಲಸ',
    },
  },

  'borewell-service': {
    en: {
      label:
        'Borewell',

      description:
        'Borewell drilling or borewell service',
    },

    kn: {
      label:
        'ಬೋರ್‌ವೆಲ್',

      description:
        'ಬೋರ್‌ವೆಲ್ ಕೊರೆತ ಅಥವಾ ಬೋರ್‌ವೆಲ್ ಸೇವೆ',
    },
  },

  'equipment-service': {
    en: {
      label:
        'Machine / Transport / Tools',

      description:
        'Tractor, machine, vehicle, transport or tools',
    },

    kn: {
      label:
        'ಯಂತ್ರ / ಸಾರಿಗೆ / ಉಪಕರಣಗಳು',

      description:
        'ಟ್ರಾಕ್ಟರ್, ಯಂತ್ರ, ವಾಹನ, ಸಾರಿಗೆ ಅಥವಾ ಉಪಕರಣಗಳು',
    },
  },

  'land-service': {
    en: {
      label:
        'Land / Boundary / Levelling',

      description:
        'Land work, fencing, boundary, road or drainage',
    },

    kn: {
      label:
        'ಜಮೀನು / ಗಡಿ / ಸಮತಟ್ಟು',

      description:
        'ಜಮೀನು, ಬೇಲಿ, ಗಡಿ, ರಸ್ತೆ ಅಥವಾ ನೀರು ಹರಿಸುವ ಕೆಲಸ',
    },
  },

  'government-agriculture': {
    en: {
      label:
        'Government / Agriculture Office',

      description:
        'Agriculture, horticulture or government benefit contact',
    },

    kn: {
      label:
        'ಸರ್ಕಾರಿ / ಕೃಷಿ ಕಚೇರಿ',

      description:
        'ಕೃಷಿ, ತೋಟಗಾರಿಕೆ ಅಥವಾ ಸರ್ಕಾರಿ ಸಹಾಯದ ಸಂಪರ್ಕ',
    },
  },

  other: {
    en: {
      label:
        'Other Farm Contact',

      description:
        'Any other farm-related person or service',
    },

    kn: {
      label:
        'ಇತರೆ ಕೃಷಿ ಸಂಪರ್ಕ',

      description:
        'ಇತರೆ ಕೃಷಿ ಸಂಬಂಧಿತ ವ್ಯಕ್ತಿ ಅಥವಾ ಸೇವೆ',
    },
  },
}

function interpolate(
  text,
  variables = {}
) {
  return String(text).replace(
    /\{(\w+)\}/g,
    (
      match,
      key
    ) => {
      const value =
        variables[key]

      return value ===
          undefined ||
        value === null
        ? match
        : String(value)
    }
  )
}

export function translateUi(
  text,
  language = 'en',
  variables = {}
) {
  const normalized =
    normalizeLanguage(
      language
    )

  const source =
    String(
      text ?? ''
    )

  const translated =
    normalized === 'kn'
      ? KANNADA_UI[source] ||
        source
      : source

  return interpolate(
    translated,
    variables
  )
}

export function getValueLabel(
  value,
  language = 'en'
) {
  if (
    value === null ||
    value === undefined
  ) {
    return ''
  }

  const definition =
    VALUE_LABELS[
      String(value)
    ]

  if (!definition) {
    return String(value)
  }

  return (
    definition[
      normalizeLanguage(
        language
      )
    ] ||
    definition.en ||
    String(value)
  )
}

/*
 * English search remains based on
 * canonical values.
 *
 * We include the improved English
 * display wording as an alias, so:
 *
 * "black pepper"
 *
 * can find records stored as:
 *
 * "Pepper".
 */
export function getValueSearchTerms(
  value
) {
  if (!value) {
    return []
  }

  const definition =
    VALUE_LABELS[
      String(value)
    ]

  return [
    String(value),

    definition?.en,
  ].filter(Boolean)
}

export function getContactCategoryLabel(
  roleId,
  language = 'en'
) {
  const definition =
    CONTACT_CATEGORY_TEXT[
      roleId
    ]

  if (!definition) {
    return roleId || ''
  }

  const normalized =
    normalizeLanguage(
      language
    )

  return (
    definition[
      normalized
    ]?.label ||
    definition.en.label
  )
}

export function getContactCategoryDescription(
  roleId,
  language = 'en'
) {
  const definition =
    CONTACT_CATEGORY_TEXT[
      roleId
    ]

  if (!definition) {
    return ''
  }

  const normalized =
    normalizeLanguage(
      language
    )

  return (
    definition[
      normalized
    ]?.description ||
    definition.en.description
  )
}

export function getContactCategorySearchTerms(
  roleId
) {
  const definition =
    CONTACT_CATEGORY_TEXT[
      roleId
    ]

  if (!definition) {
    return []
  }

  /*
   * Search stays English as agreed.
   */
  return [
    definition.en.label,
    definition.en.description,
  ]
}

/*
 * Contact names are deliberately
 * kept in English / Latin script.
 */
export function isLatinContactName(
  value
) {
  const cleaned =
    String(
      value || ''
    ).trim()

  if (!cleaned) {
    return false
  }

  return /^[A-Za-z0-9 .,'’&()\/+\-]+$/.test(
    cleaned
  )
}

/*
 * Keep all displayed digits as
 * normal 0-9 even in Kannada.
 */
export function getLocale(
  language
) {
  return normalizeLanguage(
    language
  ) === 'kn'
    ? 'kn-IN-u-nu-latn'
    : 'en-IN-u-nu-latn'
}

function parseDateValue(
  value
) {
  if (value instanceof Date) {
    return value
  }

  const stringValue =
    String(value || '')

  if (
    /^\d{4}-\d{2}-\d{2}$/.test(
      stringValue
    )
  ) {
    const [
      year,
      month,
      day,
    ] =
      stringValue
        .split('-')
        .map(Number)

    return new Date(
      year,
      month - 1,
      day,
      12,
      0,
      0
    )
  }

  return new Date(value)
}

export function formatAppDate(
  value,
  language = 'en',
  options = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }
) {
  if (!value) {
    return ''
  }

  const parsed =
    parseDateValue(
      value
    )

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return ''
  }

  return parsed.toLocaleDateString(
    getLocale(
      language
    ),
    options
  )
}

export function formatAppTime(
  timestamp,
  language = 'en',
  timezone =
    'Asia/Kolkata'
) {
  if (!timestamp) {
    return ''
  }

  return new Date(
    timestamp
  ).toLocaleTimeString(
    getLocale(
      language
    ),
    {
      hour:
        'numeric',

      minute:
        '2-digit',

      timeZone:
        timezone,
    }
  )
}

export function formatForecastDisplayDate(
  date,
  index = 0,
  language = 'en',
  timezone =
    'Asia/Kolkata'
) {
  if (index === 0) {
    return translateUi(
      'Today',
      language
    )
  }

  const [
    year,
    month,
    day,
  ] =
    String(date)
      .split('-')
      .map(Number)

  const parsed =
    new Date(
      Date.UTC(
        year,
        month - 1,
        day,
        12
      )
    )

  return parsed.toLocaleDateString(
    getLocale(
      language
    ),
    {
      weekday:
        'short',

      day:
        'numeric',

      month:
        'short',

      timeZone:
        timezone,
    }
  )
}

export function localizeTimeLabel(
  value,
  language = 'en'
) {
  const text =
    String(
      value || ''
    )

  if (
    normalizeLanguage(
      language
    ) !== 'kn'
  ) {
    return text
  }

  return text
    .replace(
      /(\d+(?::\d+)?)\s*AM\b/g,
      'ಪೂರ್ವಾಹ್ನ $1'
    )
    .replace(
      /(\d+(?::\d+)?)\s*PM\b/g,
      'ಅಪರಾಹ್ನ $1'
    )
}

/*
 * Weather.js intentionally remains
 * language-independent.
 *
 * It returns canonical English
 * messages and this function converts
 * them only for presentation.
 */
export function translateGeneratedText(
  value,
  language = 'en'
) {
  if (
    value === null ||
    value === undefined
  ) {
    return ''
  }

  const text =
    String(value)

  if (
    normalizeLanguage(
      language
    ) !== 'kn'
  ) {
    return text
  }

  const exact =
    KANNADA_UI[text]

  if (exact) {
    return exact
  }

  let match =
    text.match(
      /^Rain now · likely until (.+)$/
    )

  if (match) {
    return `ಈಗ ಮಳೆ · ಸುಮಾರು ${localizeTimeLabel(
      match[1],
      'kn'
    )} ವರೆಗೆ ಮುಂದುವರಿಯಬಹುದು`
  }

  match =
    text.match(
      /^Rain likely (.+)$/
    )

  if (match) {
    return `${localizeTimeLabel(
      match[1],
      'kn'
    )} ಸಮಯದಲ್ಲಿ ಮಳೆಯ ಸಾಧ್ಯತೆ ಇದೆ`
  }

  match =
    text.match(
      /^Keep produce ready to cover or move before the likely rain window (.+)\.$/
    )

  if (match) {
    return `${localizeTimeLabel(
      match[1],
      'kn'
    )} ಮಳೆಯ ಸಾಧ್ಯ ಸಮಯಕ್ಕಿಂತ ಮೊದಲು ಉತ್ಪನ್ನಗಳನ್ನು ಮುಚ್ಚಲು ಅಥವಾ ಒಳಗೆ ಸಾಗಿಸಲು ಸಿದ್ಧವಾಗಿರಿ.`
  }

  match =
    text.match(
      /^Rain is possible around (.+)\. Keep coconut, arecanut and other produce covered\.$/
    )

  if (match) {
    return `${localizeTimeLabel(
      match[1],
      'kn'
    )} ಸಮಯದಲ್ಲಿ ಮಳೆಯ ಸಾಧ್ಯತೆ ಇದೆ. ತೆಂಗಿನಕಾಯಿ, ಅಡಿಕೆ ಮತ್ತು ಇತರೆ ಉತ್ಪನ್ನಗಳನ್ನು ಮುಚ್ಚಿಡಿ.`
  }

  match =
    text.match(
      /^If safe, clear blocked drains before the likely rain window (.+)\.$/
    )

  if (match) {
    return `ಸುರಕ್ಷಿತವಾಗಿದ್ದರೆ ${localizeTimeLabel(
      match[1],
      'kn'
    )} ಮಳೆಯ ಸಾಧ್ಯ ಸಮಯಕ್ಕಿಂತ ಮೊದಲು ಮುಚ್ಚಿಕೊಂಡಿರುವ ನೀರು ಹರಿಯುವ ದಾರಿಗಳನ್ನು ತೆರವುಗೊಳಿಸಿ.`
  }

  match =
    text.match(
      /^A likely rain window is (.+)\. Use the drier periods for outdoor work\.$/
    )

  if (match) {
    return `${localizeTimeLabel(
      match[1],
      'kn'
    )} ಸಮಯದಲ್ಲಿ ಮಳೆಯ ಸಾಧ್ಯತೆ ಇದೆ. ಹೊರಾಂಗಣ ಕೆಲಸಕ್ಕೆ ಮಳೆ ಇಲ್ಲದ ಸಮಯವನ್ನು ಬಳಸಿ.`
  }

  return localizeTimeLabel(
    text,
    language
  )
}