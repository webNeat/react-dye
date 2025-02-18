import type { Config } from './types'

export const default_config: Config = {
  mergeClasses: (classes) =>
    classes
      .map((x) => x && x?.trim())
      .filter((x) => !!x)
      .join(' '),
}
