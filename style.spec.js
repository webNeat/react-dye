import React from 'react'
import {render} from 'react-testing-library'
import style from './'

const html = ui => render(ui).container.innerHTML
const Foo = props => <div {...props}>Foo</div>
const Bar = props => <div {...props}>Bar</div>

const compare = (a, b) => expect(html(a)).toEqual(html(b))

test('adds classNames to component', () => {
  const Styled = style('foo', Foo)
  compare(<Styled />, <Foo className="foo" />)
  compare(<Styled color="red" />, <Foo color="red" className="foo" />)
  compare(
    <Styled color="red" className="bar" />,
    <Foo color="red" className="foo bar" />
  )
})

test('uses div as default component', () => {
  const Styled = style('foo bar')
  compare(<Styled color="red" />, <div color="red" className="foo bar" />)
})

test('generates classNames based on props', () => {
  const Styled = style(({color}) => `foo ${color || 'blue'}`)
  compare(<Styled color="red" />, <div color="red" className="foo red" />)
  compare(<Styled />, <div className="foo blue" />)
  compare(<Styled id="test" />, <div id="test" className="foo blue" />)
})

test('can omit some props', () => {
  const Styled = style(({color}) => `foo ${color || 'blue'}`, 'button', 'color')
  compare(<Styled color="red" />, <button className="foo red" />)
  compare(<Styled />, <button className="foo blue" />)
  compare(
    <Styled color="green" id="test" />,
    <button id="test" className="foo green" />
  )
})

test('can be composed', () => {
  const Link = style(
    ({size}) => `no-underline text-${size || 'md'}`,
    'a',
    'size'
  )
  const BoxLink = style(
    ({color}) => `inline-block bg-${color || 'blue'}`,
    Link,
    'color'
  )
  compare(
    <BoxLink size="sm" color="green" href="#" alt="..." />,
    <a
      href="#"
      alt="..."
      className="no-underline text-sm inline-block bg-green"
    />
  )
  compare(
    <BoxLink href="#" />,
    <a href="#" className="no-underline text-md inline-block bg-blue" />
  )
})
