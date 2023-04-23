import React from 'react'
import type {Component, DefaultProps, DyeComponent} from './types'

function dye<C extends Component<{className?: string}>, Variants extends Record<string, string> = {}>(
  defaultClassName: string,
  DefaultComponent?: C,
  variants?: Variants
) {
  const Result: any = ({variant, className, ...props}: any) => {
    return React.createElement(DefaultComponent || 'div', {
      ...props,
      className: mergeClassNames(defaultClassName, getVariant(variants, variant), className),
    })
  }
  Result.as = <D extends Component<DefaultProps>>(OtherComponent: D) => dye(defaultClassName, OtherComponent, variants)
  return Result as DyeComponent<C, Variants>
}

function getVariant(variants?: Record<string, string>, variant?: string) {
  if (!variants) return ''
  if (!variant) return variants['default'] || ''
  return variants[variant] || ''
}

function mergeClassNames(...classNames: Array<string | undefined>) {
  // TODO: merge tailwind classes correctly
  return classNames.filter((x) => !!x).join(' ')
}

export default dye
