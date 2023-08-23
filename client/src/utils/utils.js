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
export {
  getValueFromProfile,
  validateUserData,
  setValueInProfile,
  omitTypename,
}
