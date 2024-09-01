import './App.css';
import { BrowserRouter, Routes } from 'react-router-dom';
import Header from './Components/Header';
import { ErrorBoundary } from 'react-error-boundary';
import { Box, CssBaseline, Theme, ThemeProvider, Toolbar } from '@mui/material';
import styled, { ThemeProvider as StyledTheme } from 'styled-components';
import { useState } from 'react';
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
  ThemeContext,
  User,
} from '@budgeet/shared';
import { cacheClient } from './storage';
import { db } from './firebase';

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  gap: 10px;
  background-color: ${(props) => props.theme.palette.background.default};
`;

function App() {
  const storage = new DefaultStorageClient(cacheClient, db);
  const storageUser = storage.getCachedUser();
  const [user, setUser] = useState<User | AnonymousUser | undefined>(
    storageUser
  );
  const [theme, setTheme] = useState<Theme>(darkTheme);

  return (
    <ErrorBoundary fallback={<div>Something went wrong.</div>}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <StyledTheme theme={theme}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <ThemeContext.Provider
              value={{
                toggleTheme: () =>
                  setTheme((prev) =>
                    prev.palette.mode === 'dark' ? lightTheme : darkTheme
                  ),
              }}
            >
              <AuthContext.Provider value={{ user, setUser }}>
                <StorageContext.Provider value={{ storage }}>
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
