import { dye } from 'react-dye'

const Container = dye('mx-auto p-8')
const Section = dye('mb-8', 'section')
const Title = dye('text-3xl font-bold mb-6', 'h1')
const SectionTitle = dye('text-xl font-semibold mb-4', 'h2')

const Button = dye(
  'px-4 py-2 rounded transition-colors',
  {
    default: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    success: 'bg-green-500 hover:bg-green-600 text-white',
  },
  'button',
)

const BigButton = Button.extend('text-4xl')

function App() {
  return (
    <Container>
      <Title>React Dye Playground</Title>
      <Section>
        <SectionTitle>Buttons</SectionTitle>
        <div className="flex gap-4">
          <Button>Default Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="danger">Danger Button</Button>
          <Button variant="success">Success Button</Button>
        </div>
      </Section>
      <Section>
        <SectionTitle>Big Buttons</SectionTitle>
        <div className="flex gap-4">
          <BigButton>Big Button</BigButton>
          <BigButton variant="secondary">Secondary Big Button</BigButton>
          <BigButton variant="danger">Danger Big Button</BigButton>
          <BigButton variant="success">Success Big Button</BigButton>
        </div>
      </Section>
      <Section>
        <SectionTitle>Custom Classes</SectionTitle>
        <div className="flex gap-4">
          <Button className="italic">Italic Button</Button>
          <Button className="uppercase tracking-wider">Uppercase Button</Button>
          <Button className="shadow-lg">Shadow Button</Button>
        </div>
      </Section>
    </Container>
  )
}

export default App
