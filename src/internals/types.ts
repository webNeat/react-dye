export type StrMap<T = any> = {
  [key: string]: T
}

export type ValueOf<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<infer E> ? E : never
