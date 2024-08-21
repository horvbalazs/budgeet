import {
  Drawer as MuiDrawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
} from '@mui/material';
import { ReactNode, useState } from 'react';
import styled from 'styled-components';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import CategoryIcon from '@mui/icons-material/Category';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useLocation, useNavigate } from 'react-router-dom';

const ArrowIcon = styled(ChevronRightIcon)`
  transition: all 0.3s ease-out !important;

  &.open {
    transform: rotate(-180deg);
  }
`;

const StyledDrawer = styled(MuiDrawer)`
  transition: width 0.3s ease-out;
  overflow: hidden;
  flex-shrink: 0;

  & .MuiDrawer-paper {
    box-sizing: border-box;
    width: inherit;
  }
`;

interface NavItem {
  label: string;
  route: string;
  icon: ReactNode;
}

const drawerWidth = 240;
const drawerClosedWidth = 64;

const menuItems: NavItem[] = [
  { label: 'Dashboard', route: '/dashboard', icon: <DashboardIcon /> },
  {
    label: 'Manage records',
    route: '/records',
    icon: <ManageSearchIcon />,
  },
  { label: 'Manage types', route: '/types', icon: <CategoryIcon /> },
  { label: 'Upload', route: '/upload', icon: <FileUploadIcon /> },
];

export default function Drawer() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleToggleOpen = () => {
    setOpen((prev) => !prev);
  };

  return (
    <StyledDrawer
      variant="permanent"
      open={open}
      sx={{ width: open ? drawerWidth : drawerClosedWidth }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'hidden', height: '100%' }}>
        <List sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {menuItems.map((item) => (
            <ListItem key={item.route} sx={{ display: 'block' }} disablePadding>
              <ListItemButton
                selected={location.pathname === item.route}
                onClick={() => navigate(item.route)}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{ opacity: open ? 1 : 0, whiteSpace: 'nowrap' }}
                />
              </ListItemButton>
            </ListItem>
          ))}
          <Box flex={1} />
          <ListItem sx={{ display: 'block' }} disablePadding>
            <ListItemButton
              onClick={handleToggleOpen}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <ArrowIcon className={open ? 'open' : ''} />
              </ListItemIcon>
              <ListItemText
                primary="Close"
                sx={{ opacity: open ? 1 : 0, whiteSpace: 'nowrap' }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </StyledDrawer>
  );
}
