import * as React from 'react';
import { create } from 'react-test-renderer'
import dye from '../src'

const html = (ui: JSX.Element) => create(ui).toJSON()
const Foo = (props: any) => <div {...props}>Foo</div>

const compare = (a: any, b: any) => expect(html(a)).toEqual(html(b))

test('adds classNames to component', () => {
  const Styled = dye('foo', Foo)
  compare(<Styled />, <Foo className="foo" />)
  compare(<Styled color="red" />, <Foo color="red" className="foo" />)
  compare(
    <Styled color="red" className="bar" />,
    <Foo color="red" className="foo bar" />
  )
})

// test('uses div as default component', () => {
//   const Styled = dye('foo bar')
//   compare(<Styled color="red" />, <div color="red" className="foo bar" />)
// })

// test('generates classNames based on props', () => {
//   const Styled = dye(({ color }: { color: string }) => `foo ${color || 'blue'}`)
//   compare(<Styled color="red" />, <div color="red" className="foo red" />)
//   compare(<Styled />, <div className="foo blue" />)
//   compare(<Styled id="test" />, <div id="test" className="foo blue" />)
// })

// test('can omit some props', () => {
//   const Styled = dye(({ color }: { color: string }) => `foo ${color || 'blue'}`, 'button', 'color')
//   compare(<Styled color="red" />, <button className="foo red" />)
//   compare(<Styled />, <button className="foo blue" />)
//   compare(
//     <Styled color="green" id="test" />,
//     <button id="test" className="foo green" />
//   )
// })

// test('can be composed', () => {
//   const Link = dye(({ size }: { size: string }) => `no-underline text-${size || 'md'}`, 'a', 'size')
//   const BoxLink = dye(
//     ({ color }: { color: string }) => `inline-block bg-${color || 'blue'}`,
//     Link,
//     'color'
//   )
//   compare(
//     <BoxLink size="sm" color="green" href="#" alt="..." />,
//     <a
//       href="#"
//       className="no-underline text-sm inline-block bg-green"
//     />
//   )
//   compare(
//     <BoxLink href="#" />,
//     <a href="#" className="no-underline text-md inline-block bg-blue" />
//   )
// })