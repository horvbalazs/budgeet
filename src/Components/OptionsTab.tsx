import styled from 'styled-components';
import { UploadOption, FieldIndex } from '@budgeet/shared';
import { Box, Divider, TextField, Typography } from '@mui/material';

const Container = styled(Box)`
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const Row = styled(Box)`
  width: 50%;
  max-width: 256px;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
`;

interface OwnProps {
  options: Omit<UploadOption, 'rules'>;
  handleChange: (value: Omit<UploadOption, 'rules'>) => void;
}

export default function OptionsTab({ options, handleChange }: OwnProps) {
  const fieldIndexOptions: (keyof FieldIndex)[] = [
    'date',
    'name',
    'note',
    'value',
    'currency',
  ];

  const handleValueSet = (val: number, field: keyof FieldIndex) => {
    if (isNaN(val)) {
      return;
    }

    const existingNum = Object.entries(options.fieldIndexes).find(
      ([k, v]) => k !== field && v === val
    );

    if (existingNum) {
      const [prevField] = existingNum;
      const currValue = options.fieldIndexes[field];

      handleChange({
        ...options,
        fieldIndexes: {
          ...options.fieldIndexes,
          [prevField]: currValue,
          [field]: val,
        },
      });
    } else {
      handleChange({
        ...options,
        fieldIndexes: {
          ...options.fieldIndexes,
          [field]: val,
        },
      });
    }
  };

  return (
    <Container>
      <Typography>
        Set which column of the CSV should be read for each field when
        uploading.
      </Typography>
      {fieldIndexOptions.map((o) => (
        <Row key={o}>
          <Typography>{o}</Typography>
          <TextField
            size="small"
            type="number"
            value={options.fieldIndexes[o]}
            onChange={(evt) => handleValueSet(parseInt(evt.target.value), o)}
            sx={{ maxWidth: '64px' }}
          />
        </Row>
      ))}
      <Divider />
      <Typography>Set the format of the date field in the CSV.</Typography>
      <TextField
        size="small"
        value={options.dateFormat}
        onChange={(evt) =>
          handleChange({ ...options, dateFormat: evt.target.value })
        }
      />
    </Container>
  );
}
