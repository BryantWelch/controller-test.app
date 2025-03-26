export const theme = {
  colors: {
    text: '#dbfeed',
    background: '#001209',
    primary: '#7dfcbd',
    secondary: '#036f9a',
    accent: '#3589fb',
    // Additional shades for various UI elements
    textLight: '#e6fef2',
    textDark: '#9cfccc',
    backgroundDark: '#000a05',
    backgroundLight: '#002413',
    primaryLight: '#9ffcd1',
    primaryDark: '#05c766',
    secondaryLight: '#05b5fa',
    secondaryDark: '#024864',
    accentLight: '#69a6fc',
    accentDark: '#034096',
    // Gradients
    gradients: {
      primary: 'linear-gradient(135deg, #7dfcbd, #9ffcd1)',
      secondary: 'linear-gradient(135deg, #036f9a, #05b5fa)',
      accent: 'linear-gradient(135deg, #3589fb, #69a6fc)',
      background: 'linear-gradient(to bottom, #000a05, #001209, #002413)',
      card: 'linear-gradient(135deg, rgba(3, 111, 154, 0.1), rgba(125, 252, 189, 0.05))',
      cardHover: 'linear-gradient(135deg, rgba(3, 111, 154, 0.15), rgba(125, 252, 189, 0.1))',
      text: 'linear-gradient(135deg, #7dfcbd, #3589fb)',
    },
    // Transparency colors for overlays
    overlay: {
      light: 'rgba(219, 254, 237, 0.05)',
      medium: 'rgba(219, 254, 237, 0.1)',
      dark: 'rgba(0, 18, 9, 0.85)',
    },
  },
  fonts: {
    body: "'Roboto', sans-serif",
    heading: "'Roboto', sans-serif",
    monospace: "'Roboto Mono', monospace",
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
  space: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '4rem',
    '3xl': '8rem',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.25rem',
    lg: '0.5rem',
    xl: '1rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    md: '0 4px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
    lg: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
    xl: '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },
  transitions: {
    fast: 'all 0.2s ease',
    default: 'all 0.3s ease',
    slow: 'all 0.5s ease',
  },
};

export type Theme = typeof theme;
