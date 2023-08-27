import dayjs from 'dayjs'
require('dayjs/locale/en-au')
dayjs.locale('en-au')
var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

// get a value from a nested object in a profile
function getValueFromProfile(field, profile) {
  // console.log('field', field)
  // console.log('profile', profile)
  if (!field || !profile) {
    return null
  }
  return field.split('.').reduce((acc, part) => acc && acc[part], profile)
}

// set a value in a nested object in a profile
function setValueInProfile(field, value, profile) {
  if (!field || !profile) return

  const fields = field.split('.')
  fields.reduce((acc, part, index) => {
    if (index === fields.length - 1) {
      // Set the value when we are at the final part of the field
      acc[part] = value
    } else if (!acc[part]) {
      // If the part does not exist, create an empty object for the next iteration
      acc[part] = {}
    }
    return acc[part]
  }, profile)
}

function validateUserData(userData) {
  console.log('validateUserData', userData)
  if (!userData) {
    return false
  }
  return true
}

// strip __typename from the user data
function omitTypename(key, value) {
  return key === '__typename' ? undefined : value
}

// format an ISO date string to a locale date string
function formatDate(dateString) {
  if (!dateString) return ''

  const regex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateString.match(regex)) return ''

  const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
  return new Date(dateString).toLocaleDateString('en-AU', options)
}

function convertDateStringToISO(dateString) {
  dateString = dateString.trim()
  if (!dateString) return ''
  // Step 1: Try without explicit format
  let date = dayjs(dateString)

  // Step 2: Try with predefined formats if the above parsing is not valid
  if (!date.isValid()) {
    const formats = [
      'DD-MM-YY',
      'DD-MM-YYYY',
      'DD/MM/YY',
      'DD/MM/YYYY',
      'D-M-YY',
      'D-M-YYYY',
      'D M YY',
      'D MMM YYYY',
      'D MMM YY',
      'D MMMM YYYY',
      'DD MMM YYYY',
      'DD MMM YY',
      'D/M/YYYY',
      'D/M/YY',
    ]

    for (let format of formats) {
      if (dateString.length === format.length) {
        // console.log('trying format', dateString, format)
        date = dayjs(dateString, format, 'en-au')
        if (date.isValid()) {
          // console.log('date is valid', date)
          break
        }
      }
    }

    // Step 3: Return result
    if (date.isValid()) {
      return date.format('YYYY-MM-DD')
    } else {
      return ''
    }
  } else {
    return date.format('YYYY-MM-DD')
  }
}

const setNestedObjectValue = (obj, path, value) => {
  const keys = path.split('.')
  let current = obj

  for (let i = 0; i < keys.length - 1; i++) {
    current = current[keys[i]]
  }

  current[keys[keys.length - 1]] = value
}

function getFullName(nameDetails) {
  const fullNameParts = [
    nameDetails.title,
    nameDetails.firstName,
    nameDetails.preferredName ? `(${nameDetails.preferredFirstName})` : null,
    nameDetails.middleName,
    nameDetails.lastName,
  ].filter(Boolean) // Filter out any null, undefined, or empty strings
  return fullNameParts.join(' ').replace(/\s+/g, ' ').trim()
}

// compares two objects for equality
function deepEqual(objA, objB) {
  if (objA === objB) return true

  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false
  }

  let keysA = Object.keys(objA)
  let keysB = Object.keys(objB)

  if (keysA.length !== keysB.length) return false

  for (let key of keysA) {
    if (!keysB.includes(key) || !deepEqual(objA[key], objB[key])) return false
  }

  return true
}
function arraysOfObjectsAreEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false

  const sortedArr1 = arr1.map((item) => JSON.stringify(item)).sort()
  const sortedArr2 = arr2.map((item) => JSON.stringify(item)).sort()

  for (let i = 0; i < arr1.length; i++) {
    if (sortedArr1[i] !== sortedArr2[i]) return false
  }
  return true
}
function getFullAddress(addressDetails) {
  const fullAddressParts = [
    addressDetails.street1,
    addressDetails.street2,
    addressDetails.city,
    addressDetails.state,
    addressDetails.postalCode,
    addressDetails.country,
  ].filter(Boolean)
  return fullAddressParts.join(' ').replace(/\s+/g, ' ').trim()
}

export {
  getValueFromProfile,
  validateUserData,
  setValueInProfile,
  omitTypename,
  formatDate,
  setNestedObjectValue,
  getFullName,
  getFullAddress,
  deepEqual,
  convertDateStringToISO,
  arraysOfObjectsAreEqual,
}
