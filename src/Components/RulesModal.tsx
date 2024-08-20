import { useState } from 'react';
import { RecordType } from '../Models/RecordType';
import { Rule } from '../Models/Rule';
import {
  Autocomplete,
  Box,
  Chip,
  IconButton,
  Modal,
  Paper,
  TextField,
} from '@mui/material';
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridRenderCellParams,
  useGridApiContext,
} from '@mui/x-data-grid';
import styled from 'styled-components';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import TypeTag from './TypeTag';
import EditTypeCell from './EditTypeCell';
import getUID from '../Helpers/getUID';
import { Record } from '../Models/Record';

const Container = styled(Box)`
  max-width: 1024px;
  max-height: 512px;
  width: 90%;
  height: 90%;
  margin: auto;
`;

const ChipContainer = styled(Box)`
  display: flex;
  gap: 1px;
  align-items: center;
  height: 100%;
`;

interface OwnProps {
  recordTypes: RecordType[];
  open: boolean;
  handleClose: (value: Rule[]) => void;
}

export default function RulesModal({
  recordTypes,
  open,
  handleClose,
}: OwnProps) {
  const [rules, setRules] = useState<Rule[]>([]);
  const options: (keyof Record)[] = ['name', 'description', 'currency'];

  const handleAddRule = () => {
    setRules((prev) => [
      ...prev,
      {
        id: getUID(prev),
        field: 'description',
        keywords: [],
      },
    ]);
  };

  const handleUpdateRule = (value: Rule) => {
    setRules((prev) => prev.map((r) => (r.id === value.id ? value : r)));

    return value;
  };

  const handleDeleteRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const columns: GridColDef<Rule>[] = [
    {
      field: 'field',
      headerName: 'Field',
      editable: true,
      type: 'singleSelect',
      valueOptions: options,
      flex: 1,
    },
    {
      field: 'keywords',
      headerName: 'Keywords',
      editable: true,
      renderCell: ({ row }) => (
        <ChipContainer display={'flex'} gap={1}>
          {row.keywords.map((kw, i) => (
            <Chip key={i} label={kw} />
          ))}
        </ChipContainer>
      ),
      renderEditCell: (props) => <EditKeywordsCell {...props} />,
      flex: 2,
    },
    {
      field: 'type',
      headerName: 'Type',
      editable: true,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => {
        const type = recordTypes.find((rt) => rt.id === row.type);

        return type ? <TypeTag recordType={type} /> : <>-</>;
      },
      renderEditCell: (props) => (
        <EditTypeCell {...props} recordTypes={recordTypes} />
      ),
      flex: 1,
    },
    {
      field: 'actions',
      headerName: '',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      resizable: false,
      renderCell: ({ row }: GridCellParams<Rule>) => (
        <Box>
          <IconButton onClick={() => handleDeleteRule(row.id)}>
            <DeleteIcon color="error" />
          </IconButton>
        </Box>
      ),
      renderHeader: () => (
        <Box>
          <IconButton onClick={handleAddRule}>
            <AddCircleIcon color="primary" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Modal
      open={open}
      onClose={() => handleClose(rules)}
      sx={{ display: 'flex', justifyContent: 'center' }}
    >
      <Container component={Paper}>
        <DataGrid
          rows={rules}
          columns={columns}
          editMode="cell"
          processRowUpdate={handleUpdateRule}
        />
      </Container>
    </Modal>
  );
}

function EditKeywordsCell(props: GridRenderCellParams<Rule, number>) {
  const { row, id, field } = props;
  const apiRef = useGridApiContext();

  const handleChange = (values: string[]) => {
    apiRef.current.setEditCellValue({ id, field, value: values });
    apiRef.current.stopCellEditMode({ id, field });
  };

  return (
    <Autocomplete
      sx={{ width: '100%', padding: 0 }}
      limitTags={4}
      options={[]}
      renderInput={(params) => (
        <TextField {...params} placeholder="Add keywords" />
      )}
      value={row.keywords}
      onChange={(_, values) => handleChange(values)}
      multiple
      freeSolo
    />
  );
}
