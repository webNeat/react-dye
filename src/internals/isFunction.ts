export function isFunction<T>(fn: T): T extends (...args: any[]) => any ? true : false
export function isFunction<T extends any>(x: T) {
  return x && {}.toString.call(x) === '[object Function]'
}
