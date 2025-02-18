import React from 'react'
import { default_config } from './default_config'
import type { Config, Dye, DyeComponent } from './types'

export function create_dye(config: Partial<Config> = {}): Dye {
  return (classes: string, ...args: any[]) => dye({ ...default_config, ...config }, classes, ...args)
}

function dye(config: Config, classes: string, ...args: any[]): DyeComponent<any, string> {
  const variants = args.length < 2 ? {} : args[0] || {}
  const tag = args.length < 2 ? args[0] || 'div' : args[1] || 'div'
  const Component = create_compoenent(config, classes, variants, tag) as DyeComponent<any, string>
  Component.as = (new_tag) => dye(config, classes, variants, new_tag)
  Component.extend = (additional_classes, additional_variants) => {
    const new_classes = config.mergeClasses([classes, additional_classes])
    const new_variants: Record<string, string> = {}
    const keys = new Set([...Object.keys(variants || {}), ...Object.keys(additional_variants || {})])
    for (const key of keys) {
      new_variants[key] = config.mergeClasses([variants?.[key] || '', (additional_variants as any)?.[key] || ''])
    }
    return dye(config, new_classes, new_variants, tag)
  }
  return Component
}

function create_compoenent(config: Config, classes: string, variants: Record<string, string>, tag: React.ElementType) {
  return ({ variant, ...props }: any) => {
    variant = variant || 'default'
    const variant_classes = variants ? variants[variant] || '' : ''
    const className = config.mergeClasses([classes, variant_classes, props.className])
    return React.createElement(tag, { ...props, className })
  }
}

if (import.meta.vitest) {
  const { describe, it, expect } = await import('vitest')
  const { render } = await import('@testing-library/react')

  describe('styling html elements with default config', () => {
    const dye = create_dye({})

    it('adds css classes to a simple element', () => {
      const Title = dye('text-3xl font-bold', 'h1')
      expect_html(<Title>Hi!</Title>, '<h1 class="text-3xl font-bold">Hi!</h1>')
    })

    it('defaults to a div', () => {
      const Title = dye('text-3xl font-bold')
      expect_html(<Title>Hi!</Title>, '<div class="text-3xl font-bold">Hi!</div>')
    })

    it('merges base classes with className property', () => {
      const Title = dye('text-3xl font-bold').as('h1')
      expect_html(<Title className="text-xl">Hi!</Title>, '<h1 class="text-3xl font-bold text-xl">Hi!</h1>')
    })

    it('passes props to the underlying component', () => {
      const Link = dye('text-blue-500', 'a')
      expect_html(<Link href="https://example.com">Click me!</Link>, '<a href="https://example.com" class="text-blue-500">Click me!</a>')
    })

    it('forwards ref to the underlying component', () => {
      const Button = dye('bg-blue-500 text-white rounded', 'button')
      const ref = React.createRef<HTMLButtonElement>()
      render(<Button ref={ref}>Click me!</Button>)
      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    })

    it('adds default variant classes if present', () => {
      const Button = dye('text-white rounded', { default: 'bg-blue-600 hover:bg-blue-500', danger: 'bg-red-600 hover:bg-red-500' }, 'button')
      expect_html(<Button>Click me!</Button>, '<button class="text-white rounded bg-blue-600 hover:bg-blue-500">Click me!</button>')
    })

    it('applies other variants', () => {
      const Button = dye('text-white rounded', { default: 'bg-blue-600 hover:bg-blue-500', danger: 'bg-red-600 hover:bg-red-500' }, 'button')
      expect_html(<Button variant="danger">Click me!</Button>, '<button class="text-white rounded bg-red-600 hover:bg-red-500">Click me!</button>')
    })

    it('handles non-existent variants gracefully', () => {
      const Button = dye('text-white rounded', { default: 'bg-blue-600' }, 'button')
      expect_html(<Button variant={'missing' as any}>Click me!</Button>, '<button class="text-white rounded">Click me!</button>')
    })

    it('extends base styles correctly', () => {
      const BaseButton = dye('text-white rounded', { default: 'bg-blue-600', danger: 'bg-red-600' }, 'button')
      const LargeButton = BaseButton.extend('px-6 py-3', { default: 'text-lg', danger: 'font-bold', success: 'bg-green-600' })
      expect_html(<LargeButton>Click me!</LargeButton>, '<button class="text-white rounded px-6 py-3 bg-blue-600 text-lg">Click me!</button>')
      expect_html(
        <LargeButton variant="danger">Click me!</LargeButton>,
        '<button class="text-white rounded px-6 py-3 bg-red-600 font-bold">Click me!</button>',
      )
      expect_html(<LargeButton variant="success">Click me!</LargeButton>, '<button class="text-white rounded px-6 py-3 bg-green-600">Click me!</button>')
    })

    it('handles empty variants in extend', () => {
      const BaseButton = dye('text-white', { default: 'bg-blue-600' }, 'button')
      const ExtendedButton = BaseButton.extend('rounded')
      expect_html(<ExtendedButton>Click me!</ExtendedButton>, '<button class="text-white rounded bg-blue-600">Click me!</button>')
    })
  })

  function expect_html(ui: React.ReactNode, html: string) {
    expect(render(ui).container.innerHTML).toBe(html)
  }
}
