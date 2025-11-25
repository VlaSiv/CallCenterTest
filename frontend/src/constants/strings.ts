export const UI_TEXT = {
  SEARCH_PLACEHOLDER: 'Search contacts...',
  LOADING: 'Loading...',
  TOTAL_PREFIX: 'Total: ',
  ERROR_LOADING: 'Error loading contacts...',
  NO_RESULTS: 'No results found.',
  PAGE: 'Page',
  OF: ' of ',
  SHOW_PREFIX: 'Show ',
  SORT_ASC_ICON: ' 🔼',
  SORT_DESC_ICON: ' 🔽',
  PAGINATION: {
    FIRST: '<<',
    PREV: '<',
    NEXT: '>',
    LAST: '>>',
  }
} as const;

export const COLUMNS = {
  ID: { KEY: 'id', HEADER: 'ID' },
  FIRST_NAME: { KEY: 'firstName', HEADER: 'First Name' },
  LAST_NAME: { KEY: 'lastName', HEADER: 'Last Name' },
  EMAIL: { KEY: 'email', HEADER: 'Email' },
  PHONE: { KEY: 'phone', HEADER: 'Phone' },
  CITY: { KEY: 'city', HEADER: 'City' },
  STATE: { KEY: 'state', HEADER: 'State' },
  STATUS: { KEY: 'status', HEADER: 'Status' },
} as const;
