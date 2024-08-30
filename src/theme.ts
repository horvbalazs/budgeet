import { createTheme, darkScrollbar } from '@mui/material';

const commonTheme = {
  primary: {
    dark: '#3d5a3c',
    main: '#588157',
    light: '#799a78',
    contrastText: '#fff',
  },
  secondary: {
    dark: '#916923',
    main: '#D09632',
    light: '#d9ab5b',
    contrastText: '#fff',
  },
};

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    ...commonTheme,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          ...darkScrollbar(),
        },
      },
    },
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    ...commonTheme,
  },
});
