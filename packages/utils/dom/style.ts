import { isNumber, isObject, isString } from '../types'

const SCOPE = 'utils/dom/style'

export function addUnit(value?: string | number, defaultUnit = 'px') {
  if (!value) return ''
  if (isString(value)) {
    return value
  } else if (isNumber(value)) {
    return `${value}${defaultUnit}`
  }
}
