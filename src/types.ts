import React from 'react'

export type TagName = keyof JSX.IntrinsicElements
export type Component<P> = React.FC<P> | React.ComponentClass<P> | TagName

export type Props<C extends Component<any>> = C extends TagName
  ? JSX.IntrinsicElements[C]
  : C extends React.FC<infer P>
  ? P
  : C extends React.ComponentClass<infer P>
  ? P
  : never

export type DefaultProps = {className?: string; children?: any}

export interface DyeComponent<C extends Component<DefaultProps>, Variants extends Record<string, string>>
  extends React.FC<Props<C> & {variant?: keyof Variants}> {
  as<D extends Component<DefaultProps>>(x: D): DyeComponent<D, Variants>
}
