import * as React from 'react'

type HashMap = { [key: string]: any }

const isFunction = (x: any) =>
  'Function' == Object.prototype.toString.call(x).slice(8, -1)

const omit = (attrs: string[], obj: HashMap) => {
  if (attrs.length == 0) {
    return obj
  }
  const result: HashMap = {}
  const index: HashMap = {}
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

interface BasicProps {
  className: string
  children: React.ReactNode
}

function dye<P extends BasicProps>(
  cssClasses: string | ((props: any) => string),
  Component: string | React.ComponentType<P> = 'div',
  ...styleProps: string[]
): React.ComponentType<any> {
  const StyledComponent = React.forwardRef((props: P, ref) => {
    let newClassName: string = isFunction(cssClasses) ? (cssClasses as Function)(props) : cssClasses
    if (props.className) newClassName += ` ${props.className}`
    const newProps = {
      ref,
      ...omit(['children', ...styleProps], props) as P,
      className: newClassName
    }
    return React.createElement(Component, newProps, props.children)
  })
  return StyledComponent
}

export default dye
