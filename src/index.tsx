import React from 'react'
import {isFunction, omit, StrMap} from './internals'

type ComponentType<P> = keyof JSX.IntrinsicElements | React.ComponentType<P>
type PropsOf<T extends any> = T extends keyof JSX.IntrinsicElements
  ? JSX.IntrinsicElements[T]
  : T extends React.ComponentType<infer P>
  ? P
  : never

export default function dye<C extends ComponentType<{}> = 'div', SP extends StrMap = {}>(
  cssClasses: string | ((props: PropsOf<C> & SP) => string),
  Component?: C,
  ...styleProps: Array<keyof SP>
) {
  return React.forwardRef((props: PropsOf<C> & SP, ref) => {
    let newClassName: string = isFunction(cssClasses) ? (cssClasses as Function)(props) : cssClasses
    if (props.className) newClassName += ` ${props.className}`
    const newProps = {
      ...omit(['children', ...styleProps], props),
      ref,
      className: newClassName,
    }
    return React.createElement(Component || 'div', newProps as any, props.children)
  })
}
