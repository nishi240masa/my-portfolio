import { render, screen } from '@testing-library/react'
import WafuuButton from '../WafuuButton'
import { ThemeProvider, createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#c93a52',
    },
  },
})

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>)
}

describe('WafuuButton Component', () => {
  it('should render the button with correct text', () => {
    renderWithTheme(<WafuuButton />)
    const button = screen.getByRole('button', { name: /和風ボタン/i })
    expect(button).toBeInTheDocument()
  })

  it('should have the button element', () => {
    const { container } = renderWithTheme(<WafuuButton />)
    const button = container.querySelector('button')
    expect(button).toBeInTheDocument()
  })

  it('should render as a button element', () => {
    renderWithTheme(<WafuuButton />)
    const button = screen.getByText('和風ボタン')
    expect(button.tagName).toBe('BUTTON')
  })
})
