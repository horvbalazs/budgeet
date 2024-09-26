import './App.css';
import { BrowserRouter, Routes } from 'react-router-dom';
import Header from './Components/Header';
import { ErrorBoundary } from 'react-error-boundary';
import { Box, CssBaseline, Theme, ThemeProvider, Toolbar } from '@mui/material';
import styled, { ThemeProvider as StyledTheme } from 'styled-components';
import { useEffect, useState } from 'react';
import { darkTheme, lightTheme } from './theme';
import routes from './routes';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import Drawer from './Components/Drawer';
import {
  AnonymousUser,
  AuthContext,
  DefaultStorageClient,
  StorageContext,
  StorageKeys,
  ThemeContext,
  ThemeOptions,
  User,
} from '@budgeet/shared';
import cacheClient from './storage';
import fireStore from './fireStore';

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  gap: 10px;
  background-color: ${(props) => props.theme.palette.background.default};
`;

function App() {
  const [storage, setStorage] = useState<DefaultStorageClient>();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | AnonymousUser | undefined>();
  const [theme, setTheme] = useState<Theme>(darkTheme);
  const [themeMode, setThemeMode] = useState<ThemeOptions>(
    ThemeOptions.Default
  );

  useEffect(() => {
    setStorage(new DefaultStorageClient(cacheClient, fireStore));
  }, []);

  useEffect(() => {
    switch (themeMode) {
      case ThemeOptions.Light:
        setTheme(lightTheme);
        break;
      case ThemeOptions.Dark:
        setTheme(darkTheme);
        break;
      case ThemeOptions.Default:
        const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)');
        setTheme(darkThemeMq ? darkTheme : lightTheme);
        break;
    }
  }, [themeMode]);

  useEffect(() => {
    storage?.cache.getItem<User>(StorageKeys.USER).then((storageUser) => {
      setLoading(false);
      setUser(storageUser);
    });
  }, [storage]);

  return (
    <ErrorBoundary fallback={<div>Something went wrong.</div>}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <StyledTheme theme={theme}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <ThemeContext.Provider
              value={{
                theme: themeMode,
                toggleTheme: setThemeMode,
              }}
            >
              <AuthContext.Provider value={{ user, setUser }}>
                <StorageContext.Provider value={{ storage }}>
                  {!loading && (
                    <BrowserRouter>
                      <Box sx={{ display: 'flex' }}>
                        <Header />
                        {user && <Drawer />}
                        <Container>
                          <Toolbar />
                          <Box
                            flex={1}
                            display="flex"
                            justifyContent="center"
                            minHeight={0}
                          >
                            <Routes>{routes}</Routes>
                          </Box>
                        </Container>
                      </Box>
                      <div id="popper-root" />
                    </BrowserRouter>
                  )}
                </StorageContext.Provider>
              </AuthContext.Provider>
            </ThemeContext.Provider>
          </LocalizationProvider>
        </StyledTheme>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
