import styled from 'styled-components';
import { ChartPreferences, Disposition, RecordType } from '@budgeet/shared';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import moment from 'moment';

const Container = styled(Paper)`
  width: 90%;
  max-width: 1024px;
  padding: 10px 5px;
  display: flex;
  margin: auto;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
`;

const Row = styled(Box)`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

interface OwnProps {
  recordTypes: RecordType[];
  currencies: string[];
  minDate: number;
  maxDate: number;
  value: ChartPreferences;
  hideDisposition?: boolean;
  handleChange: (value: ChartPreferences) => void;
}

export default function ChartSettings({
  recordTypes,
  currencies,
  minDate,
  maxDate,
  value: preferences,
  hideDisposition,
  handleChange,
}: OwnProps) {
  const handleSelectTypes = (value: string | string[]) => {
    if (typeof value !== 'string') {
      handleChange({ ...preferences, selectedTypes: value });
    }
  };

  return (
    <Container>
      <Row>
        <DatePicker
          value={moment(preferences.startDate)}
          label="Start Date"
          minDate={moment(minDate)}
          maxDate={moment(preferences.endDate)}
          onChange={(value) =>
            value &&
            handleChange({ ...preferences, startDate: value.valueOf() })
          }
        />
        <DatePicker
          value={moment(preferences.endDate)}
          label="End Date"
          minDate={moment(preferences.startDate)}
          maxDate={moment(maxDate)}
          onChange={(value) =>
            value && handleChange({ ...preferences, endDate: value.valueOf() })
          }
        />
      </Row>
      <Row>
        <FormControl sx={{ minWidth: 80 }}>
          <InputLabel>Currency</InputLabel>
          <Select
            value={preferences.currency}
            onChange={(evt) =>
              handleChange({ ...preferences, currency: evt.target.value })
            }
            label="Currency"
          >
            {currencies.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 300 }}>
          <Select
            multiple
            displayEmpty
            value={preferences.selectedTypes}
            onChange={(evt) => handleSelectTypes(evt.target.value)}
            input={<OutlinedInput />}
          >
            {recordTypes.map((rt) => (
              <MenuItem key={rt.id} value={rt.id}>
                {rt.type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {!hideDisposition && (
          <FormControl sx={{ minWidth: 100 }}>
            <InputLabel>Disposition</InputLabel>
            <Select
              value={preferences.disposition}
              onChange={(evt) =>
                handleChange({
                  ...preferences,
                  disposition: evt.target.value as Disposition,
                })
              }
              label="Disposition"
            >
              <MenuItem value="week">Week</MenuItem>
              <MenuItem value="month">Month</MenuItem>
              <MenuItem value="year">Year</MenuItem>
            </Select>
          </FormControl>
        )}
      </Row>
    </Container>
  );
}
