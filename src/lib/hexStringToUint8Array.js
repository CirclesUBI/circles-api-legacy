function addSlice (array) {
  if (array.slice) {
    return array
  }
  array.slice = function () {
    const args = Array.prototype.slice.call(arguments)
    return addSlice(new Uint8Array(Array.prototype.slice.apply(array, args)))
  }
  return array
}

const hexStringToUint8Array = value => {
  const match = value.match(/^(0x)?[0-9a-fA-F]*$/)
  if (!match) {
    throw ('invalid hexidecimal string',
    errors.INVALID_ARGUMENT,
    { arg: 'value', value: value })
  }
  if (match[1] !== '0x') {
    throw ('hex string must have 0x prefix',
    errors.INVALID_ARGUMENT,
    { arg: 'value', value: value })
  }
  value = value.substring(2)
  if (value.length % 2) {
    value = '0' + value
  }
  const result = []
  for (let i = 0; i < value.length; i += 2) {
    result.push(parseInt(value.substr(i, 2), 16))
  }
  const sliced = addSlice(new Uint8Array(result))
  return sliced
}

module.exports = hexStringToUint8Array
