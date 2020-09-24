import React from 'react'
import {render, fireEvent, cleanup} from '@testing-library/react'
import dye from '.'

describe('dye', () => {
  afterEach(cleanup)

  type Props = {
    color?: string
    className?: string
    children?: React.ReactNode
  }
  const Foo = (props: Props) => <div {...props}>Foo</div>

  const html = (ui: JSX.Element) => render(ui).container.innerHTML
  const compare = (a: JSX.Element, b: JSX.Element) => expect(html(a)).toEqual(html(b))

  it('adds classNames to component', () => {
    const Styled = dye('foo', Foo)
    compare(<Styled />, <Foo className="foo" />)
    compare(<Styled />, <Foo color="red" className="foo" />)
    compare(<Styled color="red" className="bar" />, <Foo color="red" className="foo bar" />)
  })

  it('renders children', () => {
    const Styled = dye('foo')
    compare(
      <Styled>
        <p>Yo</p>
      </Styled>,
      <div className="foo">
        <p>Yo</p>
      </div>
    )
  })

  it('uses div as default component', () => {
    const Styled = dye('foo bar')
    compare(<Styled color="red" />, <div color="red" className="foo bar" />)
  })

  it('generates classNames based on props', () => {
    const Styled = dye(({color}: any) => `foo ${color || 'blue'}`)
    compare(<Styled color="red" />, <div color="red" className="foo red" />)
    compare(<Styled />, <div className="foo blue" />)
    compare(<Styled id="test" />, <div id="test" className="foo blue" />)
  })

  it('can omit some props', () => {
    const Styled = dye(({color}: any) => `foo ${color || 'blue'}`, 'button', 'color')
    compare(<Styled color="red" />, <button className="foo red" />)
    compare(<Styled />, <button className="foo blue" />)
    compare(<Styled color="green" id="test" />, <button id="test" className="foo green" />)
  })

  it('can be composed', () => {
    const Link = dye(({size}: any) => `no-underline text-${size || 'md'}`, 'a', 'size')
    const BoxLink = dye(({color}: any) => `inline-block bg-${color || 'blue'}`, Link, 'color')
    compare(
      <BoxLink size="sm" color="green" href="#" />,
      <a href="#" className="no-underline text-sm inline-block bg-green" />
    )
    compare(<BoxLink href="#" />, <a href="#" className="no-underline text-md inline-block bg-blue" />)
  })

  it('forwards ref', async () => {
    const Input = dye('fancy', 'input')
    const ref = React.createRef()
    const {getByTestId} = render(<Input data-testid="input" ref={ref} />)
    fireEvent.change(getByTestId('input'), {target: {value: 'some text'}})
    expect(ref.current).not.toBe(null)
    expect((ref.current as HTMLInputElement).value).toBe('some text')
  })
})
