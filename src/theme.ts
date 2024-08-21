import { createTheme, darkScrollbar } from '@mui/material';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
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
    background: {
      paper: '#121212',
      default: '#121212',
    },
    text: {
      primary: '#fff',
      secondary: '#ccc',
      disabled: '#bbb',
    },
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
    primary: {
      dark: '#3d5a3c',
      main: '#588157',
      light: '#799a78',
      contrastText: '#fff',
    },
    secondary: {
      dark: '#283e2c',
      main: '#3a5a40',
      light: '#617b66',
      contrastText: '#fff',
    },
    background: {
      paper: '#fff',
      default: '#fff',
    },
    text: {
      primary: '#000',
      secondary: '#666',
      disabled: '#777',
    },
  },
});
