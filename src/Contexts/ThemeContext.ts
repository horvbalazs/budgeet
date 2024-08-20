import { createContext } from 'react';

interface ThemeContextValue {
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  toggleTheme: () => void 0,
});

export default ThemeContext;
