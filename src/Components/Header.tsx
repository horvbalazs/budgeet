import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import { useContext, useState } from 'react';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import AuthContext from '../Contexts/AuthContext';
import { useAuth } from '../Hooks/useAuth';
import ThemeContext from '../Contexts/ThemeContext';
import styled from 'styled-components';
import { ReactComponent as Logo } from '../Images/HeaderLogo.svg';
import { ReactComponent as LogoDark } from '../Images/HeaderLogoDark.svg';

const Container = styled(Box)`
  display: flex;
  width: 100%;
  align-items: center;
`;

const AvatarButton = styled(Button)`
  display: flex;
  gap: 10px;
  text-transform: none;
`;

const LogoContainer = styled(Box)`
  height: 40px;

  svg {
    height: 40px;
    width: auto;
  }
`;

export default function Header() {
  const theme = useTheme();
  const { toggleTheme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<HTMLElement>();
  const open = Boolean(anchorEl);

  const handleLogout = () => {
    logout();
    setAnchorEl(undefined);
  };

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <Container>
          <LogoContainer>
            {theme?.palette.mode === 'dark' ? <LogoDark /> : <Logo />}
          </LogoContainer>
          <Box flex={1} />
          {user && (
            <>
              <AvatarButton onClick={(evt) => setAnchorEl(evt.currentTarget)}>
                <Typography
                  textTransform="none"
                  color={theme?.palette.primary.contrastText}
                >
                  {user.name}
                </Typography>
                <Avatar src={user.avatar} />
              </AvatarButton>
            </>
          )}
          <IconButton onClick={toggleTheme} disableRipple>
            {theme?.palette.mode === 'dark' ? (
              <LightModeIcon />
            ) : (
              <DarkModeIcon />
            )}
          </IconButton>
        </Container>
      </Toolbar>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(undefined)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </AppBar>
  );
}
