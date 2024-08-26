import { Box } from '@mui/material';
import styled from 'styled-components';

export const ColorBox = styled(Box)`
  width: 32px;
  height: 32px;
  border: 1px solid ${(props) => props.theme.palette.primary.main};
  margin-top: auto;
  margin-bottom: auto;
`;

export const TableWrapper = styled(Box)`
  width: 90%;
  flex: 1;
  max-width: 2048px;
  min-height: 0;
`;

export const TableButtonContainer = styled(Box)`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  width: 90%;
  max-width: 512px;
`;

export const TableContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 0;
  max-height: calc(100% - 10px);
  flex: 1;
`;