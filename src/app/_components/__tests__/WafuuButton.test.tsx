import { render, screen } from '@testing-library/react';
import WafuuButton from '../WafuuButton';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#c93a52',
    },
  },
});

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('WafuuButton Component', () => {
  it('should render the button with provided children text', () => {
    renderWithTheme(<WafuuButton>テストボタン</WafuuButton>);
    const button = screen.getByRole('button', { name: /テストボタン/i });
    expect(button).toBeInTheDocument();
  });

  it('should render as a button element', () => {
    const { container } = renderWithTheme(<WafuuButton>クリック</WafuuButton>);
    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
  });

  it('should display the children text correctly', () => {
    renderWithTheme(<WafuuButton>和風ボタン</WafuuButton>);
    const button = screen.getByText('和風ボタン');
    expect(button.tagName).toBe('BUTTON');
  });

  it('should accept additional MUI ButtonProps', () => {
    renderWithTheme(
      <WafuuButton disabled variant="outlined">
        無効ボタン
      </WafuuButton>,
    );
    const button = screen.getByRole('button', { name: /無効ボタン/i });
    expect(button).toBeDisabled();
  });
});
