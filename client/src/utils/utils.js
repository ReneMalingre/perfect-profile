// get a value from a nested object in a profile
function getValueFromProfile(field, profile) {
  console.log('field', field)
  console.log('profile', profile)
  if (!field || !profile) {
    return null
  }
  return field.split('.').reduce((acc, part) => acc && acc[part], profile)
}

export { getValueFromProfile }
