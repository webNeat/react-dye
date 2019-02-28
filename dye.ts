import {ComponentType} from '@types/react'
import React from 'react'

const isFunction = x =>
  'Function' == Object.prototype.toString.call(x).slice(8, -1)

const omit = (attrs: string[], obj: object) => {
  if (attrs.length == 0) {
    return obj
  }
  const result = {}
  const index = {}
  for (const name of attrs) {
    index[name] = true
  }
  for (const name in obj) {
    if (!index[name]) {
      result[name] = obj[name]
    }
  }
  return result
}

const dye = (
  cssClasses: string | ((props: object) => string),
  Component: undefined | string | ComponentType,
  ...styleProps: string[]
): ComponentType => {
  Component = Component || 'div'
  const StyledComponent = ({className, children, ...props}) => {
    let newClassName = isFunction(cssClasses) ? cssClasses(props) : cssClasses
    if (className) newClassName += ` ${className}`
    props = {
      ...omit(styleProps, props),
      className: newClassName
    }
    return React.createElement(Component, props, children)
  }
  return StyledComponent
}

export default dye
