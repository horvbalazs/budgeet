import { useAuth } from '../Hooks/useAuth';
import { Box, Typography, useTheme } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import styled from 'styled-components';
import { useContext, useEffect } from 'react';
import AuthContext from '../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ErrorToast from '../Components/ErrorToast';

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  text-align: center;
  align-items: center;

  button {
    max-width: 80px;
  }
`;

export default function Login() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { loading, error, authenticate } = useAuth();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!!user) {
      navigate('/');
    }
  }, [user]);

  return (
    <Container>
      <Typography variant="h4" color={theme.palette.text.primary}>
        Login required
      </Typography>
      <LoadingButton
        variant="contained"
        loading={loading}
        onClick={() => authenticate()}
      >
        Login
      </LoadingButton>
      <ErrorToast error={error} />
    </Container>
  );
}
