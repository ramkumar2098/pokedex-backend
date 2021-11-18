const canBe = (variable, possibleValues) =>
  possibleValues.includes(variable) ? variable : possibleValues[0]

const capitalize = word => word[0].toUpperCase() + word.slice(1).toLowerCase()

module.exports = {
  canBe,
  capitalize,
}
