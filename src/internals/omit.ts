import {StrMap, ValueOf} from './types'

export function omit<T extends StrMap, Keys extends Array<keyof T>>(keys: Keys, obj: T): Omit<T, ValueOf<Keys>> {
  if (keys.length === 0) return obj

  const result = {...obj}
  for (const key of keys) {
    delete result[key]
  }
  return result
}
