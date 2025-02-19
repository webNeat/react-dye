# react-dye

A simple way to style React components.

[![Bundle size](https://img.shields.io/bundlephobia/minzip/react-dye?style=flat-square)](https://bundlephobia.com/result?p=react-dye)
[![Version](https://img.shields.io/npm/v/react-dye?style=flat-square)](https://www.npmjs.com/package/react-dye)
[![Tests Status](https://img.shields.io/github/actions/workflow/status/webneat/react-dye/ci.yml?branch=main&style=flat-square)](https://github.com/webneat/react-dye/actions?query=branch%3Amain)
[![MIT](https://img.shields.io/npm/l/react-dye?style=flat-square)](LICENSE)

## Contents
- [Quick Usage](#quick-usage)
- [Features](#features)
- [Documentation](#documentation)
  - [Using `dye` to style HTML elements](#using-dye-to-style-html-elements)
  - [Defining variants](#defining-variants)
  - [Applying the same styles to a different HTML element](#applying-the-same-styles-to-a-different-html-element)
  - [Extending classes and variants of a component](#extending-classes-and-variants-of-a-component)
  - [Creating a new `dye` function with custom config](#creating-a-new-dye-function-with-custom-config)
- [Merging TailwindCSS classes without conflict](#merging-tailwindcss-classes-without-conflict)
- [Contributing](#contributing)
- [Changelog](#changelog)

## Quick Usage

```bash
npm install react-dye
```

```tsx
import { dye } from 'react-dye'

// Create a styled button with a danger variant
const Button = dye('px-4 py-2 rounded font-medium', {
  default: 'bg-blue-500 hover:bg-blue-600',
  danger: 'bg-red-500 hover:bg-red-600'
}, 'button')

// Apply the same styles to a link
const ButtonLink = Button.as('a')

// Extend with additional classes and variants
const BigButton = Button.extend('text-3xl', {
  success: 'bg-green-500 hover:bg-green-600',
})

// Use as normal component
function App() {
  return (
    <div>
      <Button>Primary Action</Button> {/* applies `default` variant by default */}
      <Button variant="danger">Danger Action</Button>
      <BigButton variant="danger">Big Danger!</BigButton>
      <ButtonLink href="#">Link</ButtonLink> {/* has the same props as the base element */}
    </div>
  )
}
```

## Features

- Zero dependencies.
- Lightweight (about **0.5kb** gzipped).
- Create styled components with CSS classes (ideal when using TailwindCSS or similar).
- Use variants to create different styles for the same component.
- Extend existing components with additional classes/variants.
- Clone components with different element.
- Returns fully typed components.

## Documentation

This library exports two functions:
- `dye`: creates a styled component with CSS classes and variants.
- `create_dye`: creates a new `dye` function with custom config.

### Using `dye` to style HTML elements

In its simplest form, `dye` takes some CSS classes and an HTML tag, and returns a component that applies the CSS classes to the element.

```tsx
import { dye } from 'react-dye'
const Title = dye('mb-2 text-2xl', 'h1')

<Title>content</Title>
```
will render
```html
<h1 className="mb-2 text-2xl">content</h1>
```

<hr>

The `tag` is optional, and it defaults to `div`.

```tsx
const Section = dye('p-3 mb-4')
<Section>content</Section>
```
will render
```html
<div className="p-3 mb-4">content</div>
```

<hr>

You can pass additional CSS classes to the component using `className` and they will be added
```tsx
const Section = dye('p-3 mb-4')
<Section className="font-bold">content</Section>
```
will render
```html
<div className="p-3 mb-4 font-bold">content</div>
```

**Note that by default `dye` will simply concatenate classes, if you are using TailwindCSS then check the [Merging TailwindCSS classes without conflict](#merging-tailwindcss-classes-without-conflict) guide below.**

### Defining variants

Sometimes you need to style a component differently depending on the state of the component. You can achieve this by passing an object as the second argument to `dye`, where the keys are the variants and the values are the CSS classes.

```tsx
const Button = dye('px-4 py-2 rounded', {
  default: 'bg-blue-500 hover:bg-blue-600',
  success: 'bg-green-500 hover:bg-green-600',
  danger: 'bg-red-500 hover:bg-red-600',
}, 'button')

<Button>Default Button</Button>
<Button variant="success">Success Button</Button>
<Button variant="danger">Danger Button</Button>
```
will render
```html
<button className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600">Default Button</button>
<button className="px-4 py-2 rounded bg-green-500 hover:bg-green-600">Success Button</button>
<button className="px-4 py-2 rounded bg-red-500 hover:bg-red-600">Danger Button</button>
```

When the `variant` property is passed to the component, the corresponding classes are added to the element.

Note that the `default` variant is applied by default if defined.

### Applying the same styles to a different HTML element

What if you styled an elememt, like the `Button` above, and you want to apply the same styles to a different element? instead of duplicating the code, all components created by `dye` have a method `as()` that you can use to clone the component with a different tag.

```tsx
import {dye} from 'react-dye'

const Button = dye('px-4 py-2 rounded', {
  default: 'bg-blue-500 hover:bg-blue-600',
  success: 'bg-green-500 hover:bg-green-600',
  danger: 'bg-red-500 hover:bg-red-600',
}, 'button')

const ButtonLink = Button.as('a') // returns a new component that renders `a` instead of `button`
<ButtonLink variant="success" href="#">Link</ButtonLink>
```
will render
```html
<a className="px-4 py-2 rounded bg-green-500 hover:bg-green-600" href="#">Link</a>
```

### Extending classes and variants of a component

Same as `.as()`, you may need to clone a styled component but with additional classes and/or variants. You can do that with the `.extend()` method.

```tsx
import {dye} from 'react-dye'

const Button = dye('px-4 py-2 rounded', {
  default: 'bg-blue-500 hover:bg-blue-600',
  success: 'bg-green-500 hover:bg-green-600',
  danger: 'bg-red-500 hover:bg-red-600',
}, 'button')

const BigButton = Button.extend('text-3xl font-semibold') // adds new classes
const SpecialButton = Button.extend('', {
  bonus: 'bg-orange-500 hover:bg-orange-600', // adds new variant
  success: 'border-2 border-green-300', // adds classes to existing variant
})

<BigButton variant="danger">Stop</BigButton>
<SpecialButton variant="bonus">Bonus</SpecialButton>
<SpecialButton variant="success">Congratulations</SpecialButton>
```
will render
```html
<button className="px-4 py-2 rounded text-3xl font-semibold bg-red-500 hover:bg-red-600">Stop</button>
<button className="px-4 py-2 rounded bg-orange-500 hover:bg-orange-600">Bonus</button>
<button className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 border-2 border-green-300">Congratulations</button>
```

**Note that:**
- The additional classes are added to the existing classes.
- When extending an existing variant, the additional classes are added to the old ones.

if you are using TailwindCSS and want to avoid class conflicts then check the [Merging TailwindCSS classes without conflict](#merging-tailwindcss-classes-without-conflict) guide below.

### Creating a new `dye` function with custom config

if you don't like some default behavior of `dye` and want to customize things, you can use the `create_dye` function. This function takes a config object and returns a new `dye` function that you can use like the default one.

The config has the following type:
```ts
type Config = {
  mergeClasses: (classes: ClassValue[]) => string
}

type ClassValue = string | undefined | null | false
```
- `mergeClasses` the function to use to filter out falsy classnames and merge the rest. The default implementation just joins the classes with a space.

That's all it's on the config now, if you see other behaviors/flags to add, please let me know :)

Check a pratical example of using `create_dye` in the [Merging TailwindCSS classes without conflict](#merging-tailwindcss-classes-without-conflict) guide below.

## Merging TailwindCSS classes without conflict

When using TailwindCSS, you probably want to avoid conflicts, simply concatenating classenames will not work. So follow the next steps:

1. Add [tailwind-merge](https://github.com/tailwindlabs/tailwind-merge) to your project
```
npm install tailwind-merge
```

2. Create a custom `dye` function that uses `twMerge` from `tailwind-merge`:
```ts
import { create_dye } from 'react-dye'
import { twMerge } from 'tailwind-merge'

export const dye = create_dye({ mergeClasses: twMerge })
```

3. Use the `dye` function exported above instead of the default one.

That's all.

Now you may have the following question: _Why not just include `tailwind-merge` as a dependency and use `twMerge` by default?_

I decided not to include it because:
- I would like this library to be generic, works with any collection of CSS classes. I don't want to tie it to TailwindCSS.
- `tailwind-merge` is great, but it would multiply the bundle size by **16**! (8kb vs 0.5kb).

## Contributing

You can contribute to this library in many ways, including:

- **Reporting bugs**: Simply open an issue and describe the bug. Please include a code snippet to reproduce the bug, it really helps to solve the problem quickly.
- **Suggesting new features**: If you have a common use case that you think worth adding to the library, open an issue and we will discuss it. Do you already have an implementation for it? Great, make a pull request and I will review it.

Those are just examples, any issue or pull request is welcome :)

## Changelog

Check out the [changelog](https://github.com/webneat/react-dye/blob/main/CHANGELOG.md) for more information.
