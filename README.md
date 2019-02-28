# React Dye

[![Build Status](https://travis-ci.org/webNeat/react-dye.svg?branch=master)](https://travis-ci.org/webNeat/react-dye)

A simple way to add CSS classes to React components.

- This **is not** a CSS framework!
- This **is not** a way to generate CSS by writing JS code!
- This **is** a simple function to avoid writing `className` in JSX.

## Installation

```
npm i react-dye
// or
yarn add react-dye
```

## Usage examples

### Replacing simple tags with custom components

**Before**

```jsx
const MyComponent = () => (
  <div className="container centered">
    <form className="inline-form with-border">
      <input className="large-input rounded" type="text" name="username" />
      <input className="large-input rounded" type="password" name="password" />
      <button className="button primary-button">Sign in</button>
    </form>
  </div>
)
```

**After**

```jsx
import dye from 'react-dye'

const MyComponent = () => (
  <Container>
    <InlineForm>
      <LargeInput type="text" name="username" />
      <LargeInput type="password" name="password" />
      <PrimaryButton>Sign in</PrimaryButton>
    </InlineForm>
  </Container>
)

const Container = dye('container centered')
const InlineForm = dye('inline-form with-border', 'form')
const LargeInput = dye('large-input rounded', 'input')
const PrimaryButton = dye('button primary-button', 'button')
```

### Composing CSS classes

**Before**

```jsx
const MyComponent = () => (
  <Fragment>
    <button className="button with-padding with-margin rounded default-button">
      Cancel
    </button>
    <button className="button with-padding with-margin rounded primary-button">
      Confirm
    </button>
  </Fragment>
)
```

**After**

```jsx
import dye from 'react-dye'

const MyComponent = () => (
  <Fragment>
    <DefaultButton>Cancel</DefaultButton>
    <PrimaryButton>Confirm</PrimaryButton>
  </Fragment>
)

const Button = dye('button with-padding with-margin rounded', 'button')
const DefaultButton = dye('default-button', Button)
const PrimaryButton = dye('primary-button', Button)
```

### Dynamic CSS classes

**Before**

```jsx
import classnames from 'classnames'

const MyComponent = () => (
  <Fragment>
    <Button>Enabled</Button>
    <Button disabled>Disabled</Button>
    <Button beta>Beta Button</Button>
  </Fragment>
)

const Button = ({beta, disabled, ...props}) => (
  <button
    className={classnames('button with-padding with-margin rounded', {
      'beta-button': beta,
      'disabled-button': disabled
    })}
    disabled={disabled}
    {...props}
  />
)
```

**After**

```jsx
import classnames from 'classnames'
import dye from 'react-dye'

const MyComponent = () => (
  <Fragment>
    <Button>Enabled</Button>
    <Button disabled>Disabled</Button>
    <Button beta>Beta Button</Button>
  </Fragment>
)

const Button = dye(
  ({disabled, beta}) =>
    classnames('button with-padding with-margin rounded', {
      'beta-button': beta,
      'disabled-button': disabled
    }),
  'button',
  'beta' // this prop is not passed to 'button'
)
```

## API Reference

```js
function dye(cssClasses, [Component, [...styleProps]])
```

**cssClasses**: specifies the css classes to use. If it's a function, it will be called with the component's props and should return the css classes.

**Component**: the component can be a string (like `'input'`) or a React component. The default value is `'div'`.

**styleProps**: the props which are only used to generate the css classes. They will not be passed to the component.

## Contributing

Feel free to open issues or submit Pull requests :D
