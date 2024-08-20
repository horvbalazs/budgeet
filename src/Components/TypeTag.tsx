import { Chip, useTheme } from '@mui/material';
import { RecordType } from '../Models/RecordType';

interface OwnProps {
  recordType: RecordType;
}

export default function TypeTag({ recordType }: OwnProps) {
  const theme = useTheme();

  return (
    <Chip
      label={recordType.type}
      style={{
        backgroundColor: recordType.color,
        color: theme.palette.getContrastText(recordType.color),
      }}
    />
  );
}
