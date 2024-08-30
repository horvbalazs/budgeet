import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { RecordType } from '@budgeet/types';
import TypeTag from './TypeTag';
import styled from 'styled-components';

const StyledSelect = styled(Select)`
  height: 100%;
`;

interface OwnProps {
  defaultSelected?: string;
  recordTypes: RecordType[];
  handleSelect: (value: string) => void;
}

export default function TypeSelector({
  defaultSelected,
  recordTypes,
  handleSelect,
}: OwnProps) {
  const handleChange = (event: SelectChangeEvent<string>) => {
    handleSelect(event.target.value);
  };

  return (
    <FormControl
      sx={{
        minWidth: 120,
        margin: 0,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <StyledSelect
        value={defaultSelected}
        onChange={(evt) => handleChange(evt as SelectChangeEvent<string>)}
        defaultOpen
      >
        {recordTypes.map((rt) => (
          <MenuItem key={rt.id} value={rt.id}>
            <TypeTag recordType={rt} />
          </MenuItem>
        ))}
      </StyledSelect>
    </FormControl>
  );
}
