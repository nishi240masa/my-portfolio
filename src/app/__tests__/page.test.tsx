import { render, screen } from '@testing-library/react'
import Home from '../page'

// Mock the TopPage component
jest.mock('../_components/View/Page', () => {
  return function MockTopPage() {
    return <div data-testid="top-page">Top Page</div>
  }
})

describe('Home Page', () => {
  it('should render the home page', () => {
    render(<Home />)
    const topPage = screen.getByTestId('top-page')
    expect(topPage).toBeInTheDocument()
  })

  it('should render TopPage component', () => {
    const { container } = render(<Home />)
    expect(container.querySelector('[data-testid="top-page"]')).toBeInTheDocument()
  })
})
