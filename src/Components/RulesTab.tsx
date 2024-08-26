import { RecordType } from '../Models/RecordType';
import { Rule } from '../Models/Rule';
import { Autocomplete, Box, Chip, IconButton, TextField } from '@mui/material';
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
import { compareRecordTypes } from '../Helpers/compareRecordTypes';
import { DEFAULT_TYPE } from '../Hooks/useRecordType';

const ChipContainer = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  gap: 1px;
  align-items: center;
  height: 100%;
`;

interface OwnProps {
  rules: Rule[];
  recordTypes: RecordType[];
  handleChange: (value: Rule[]) => void;
}

export default function RulesTab({
  rules,
  recordTypes,
  handleChange,
}: OwnProps) {
  const handleAddRule = () => {
    handleChange([
      ...rules,
      {
        id: getUID(rules),
        fieldIndex: 0,
        keywords: [],
        type: DEFAULT_TYPE.id,
      },
    ]);
  };

  const handleUpdateRule = (value: Rule) => {
    handleChange(rules.map((r) => (r.id === value.id ? value : r)));

    return value;
  };

  const handleDeleteRule = (id: string) => {
    handleChange(rules.filter((r) => r.id !== id));
  };

  const columns: GridColDef<Rule>[] = [
    {
      field: 'fieldIndex',
      headerName: 'Field',
      editable: true,
      type: 'number',
    },
    {
      field: 'keywords',
      headerName: 'Keywords',
      editable: true,
      renderCell: ({ row }) => (
        <ChipContainer>
          {row.keywords?.map((kw, i) => (
            <Chip key={i} label={kw} />
          ))}
        </ChipContainer>
      ),
      renderEditCell: (props) => <EditKeywordsCell {...props} />,
      flex: 5,
    },
    {
      field: 'type',
      headerName: 'Type',
      editable: true,
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      filterable: false,
      renderCell: ({ row }) => {
        const type = recordTypes.find((rt) => rt.id === row.type);

        return type ? <TypeTag recordType={type} /> : <>-</>;
      },
      renderEditCell: (props) => (
        <EditTypeCell {...props} recordTypes={recordTypes} />
      ),
      sortComparator: (a: string, b: string) =>
        compareRecordTypes(a, b, recordTypes),
    },
    {
      field: 'actions',
      headerName: '',
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      resizable: false,
      renderCell: ({ row }: GridCellParams<Rule>) => (
        <IconButton onClick={() => handleDeleteRule(row.id)}>
          <DeleteIcon color="error" />
        </IconButton>
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
    <DataGrid
      rows={rules}
      columns={columns}
      editMode="cell"
      processRowUpdate={handleUpdateRule}
      sx={{
        '& .MuiDataGrid-cell:hover': {
          background: 'inherit',
          overflow: 'visible',
        },
      }}
    />
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
      sx={{
        width: '100%',
        padding: 0,
        overflow: 'visible',
        '.MuiOutlinedInput-root': { padding: '6px' },
      }}
      limitTags={4}
      options={[]}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Add keywords"
          sx={{ height: '51px' }}
          autoFocus
        />
      )}
      value={row.keywords}
      onChange={(_, values) => handleChange(values)}
      multiple
      freeSolo
    />
  );
}
