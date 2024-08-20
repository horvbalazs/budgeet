import { Alert, Snackbar } from '@mui/material';
import { useEffect, useState } from 'react';

interface OwnProps {
  error: string | null;
}

export default function ErrorToast({ error }: OwnProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (error) {
      setOpen(true);
    }
  }, [error]);

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={() => setOpen(false)}
    >
      <Alert severity="error">{error}</Alert>
    </Snackbar>
  );
}
