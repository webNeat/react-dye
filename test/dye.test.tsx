import * as React from 'react';
// import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent, cleanup } from '@testing-library/react'
import dye from '../src'

afterEach(cleanup)

const html = (ui: JSX.Element) => render(ui).container.innerHTML
const Foo = (props: any) => <div {...props}>Foo</div>

const compare = (a: JSX.Element, b: JSX.Element) => expect(html(a)).toEqual(html(b))

test('adds classNames to component', () => {
  const Styled = dye('foo', Foo)
  compare(<Styled />, <Foo className="foo" />)
  compare(<Styled color="red" />, <Foo color="red" className="foo" />)
  compare(
    <Styled color="red" className="bar" />,
    <Foo color="red" className="foo bar" />
  )
})

test('renders children', () => {
  const Styled = dye('foo')
  compare(<Styled><p>Yo</p></Styled>, <div className="foo"><p>Yo</p></div>)
})

test('uses div as default component', () => {
  const Styled = dye('foo bar')
  compare(<Styled color="red" />, <div color="red" className="foo bar" />)
})

test('generates classNames based on props', () => {
  const Styled = dye(({ color }: any) => `foo ${color || 'blue'}`)
  compare(<Styled color="red" />, <div color="red" className="foo red" />)
  compare(<Styled />, <div className="foo blue" />)
  compare(<Styled id="test" />, <div id="test" className="foo blue" />)
})

test('can omit some props', () => {
  const Styled = dye(({ color }: any) => `foo ${color || 'blue'}`, 'button', 'color')
  compare(<Styled color="red" />, <button className="foo red" />)
  compare(<Styled />, <button className="foo blue" />)
  compare(
    <Styled color="green" id="test" />,
    <button id="test" className="foo green" />
  )
})

test('can be composed', () => {
  const Link = dye(({ size }: any) => `no-underline text-${size || 'md'}`, 'a', 'size')
  const BoxLink = dye(
    ({ color }: any) => `inline-block bg-${color || 'blue'}`,
    Link,
    'color'
  )
  compare(
    <BoxLink size="sm" color="green" href="#" />,
    <a
      href="#"
      className="no-underline text-sm inline-block bg-green"
    />
  )
  compare(
    <BoxLink href="#" />,
    <a href="#" className="no-underline text-md inline-block bg-blue" />
  )
})

test('forwards ref', async () => {
  const Input = dye('fancy', 'input')
  const ref = React.createRef()
  const { getByTestId } = render(<Input data-testid="input" ref={ref} />)
  fireEvent.change(getByTestId('input'), { target: { value: 'some text' } })
  expect(ref.current).not.toBe(null)
  expect((ref.current as HTMLInputElement).value).toBe('some text')
})