import type React from 'react'

export type ClassValue = string | undefined | null | false

export type Config = {
  mergeClasses: (classes: ClassValue[]) => string
}

export type HtmlComponent = React.ElementType<{ className?: string }>

export interface Dye<Variants extends string = never> {
  <Component extends HtmlComponent>(classes: string, Component?: Component): DyeComponent<Component, Variants>
  <Component extends HtmlComponent, AdditionalVariants extends string = never>(
    classes: string,
    variants?: Record<AdditionalVariants, string>,
    Component?: Component,
  ): DyeComponent<Component, Variants | AdditionalVariants>
}

export type DyeComponent<Component extends HtmlComponent, Variants extends string = never> = React.ComponentType<
  { variant?: Variants } & React.ComponentProps<Component>
> & {
  as: <NewComponent extends HtmlComponent>(Component: NewComponent) => DyeComponent<NewComponent, Variants>
  extend: <AdditionalVariants extends string = never>(
    additional_classes: string,
    additional_variants?: Record<AdditionalVariants, string>,
  ) => DyeComponent<Component, Variants | AdditionalVariants>
}
