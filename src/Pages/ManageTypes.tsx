import { useContext } from 'react';
import { Box, IconButton } from '@mui/material';
import styled from 'styled-components';
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridRenderCellParams,
  useGridApiContext,
} from '@mui/x-data-grid';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import ColorPicker from '../Components/ColorPicker';
import ErrorToast from '../Components/ErrorToast';
import { ColorBox } from '../Components/Common';
import {
  AuthContext,
  DEFAULT_TYPE,
  RecordType,
  StorageContext,
  useRecordType,
} from '@budgeet/shared';

const TableWrapper = styled(Box)`
  width: 100%;
  max-width: 512px;
  max-height: calc(100% - 10px);
`;

export default function ManageTypes() {
  const { storage } = useContext(StorageContext);
  const { user } = useContext(AuthContext);
  const {
    recordTypes,
    loading,
    error,
    addRecordTypes,
    editRecordTypes,
    deleteRecordTypes,
  } = useRecordType(user!, storage!);

  const handleAddRecordType = () => {
    addRecordTypes([{ type: 'NEW_TYPE', color: '#000' }]);
  };

  const handleDeleteRecordType = (id: string) => {
    deleteRecordTypes([id]);
  };

  const handleUpdateRecordType = (value: RecordType) => {
    editRecordTypes([value]);

    return value;
  };

  const columns: GridColDef<RecordType>[] = [
    {
      field: 'type' as keyof RecordType,
      headerName: 'Type',
      disableColumnMenu: true,
      resizable: false,
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      editable: true,
    },
    {
      field: 'color' as keyof RecordType,
      headerName: 'Color',
      headerAlign: 'center',
      align: 'center',
      disableColumnMenu: true,
      resizable: false,
      flex: 1,
      editable: true,
      display: 'flex',
      renderCell: ({ row }) => <ColorBox bgcolor={row.color} />,
      renderEditCell: (props) => <EditColorCell {...props} />,
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
      renderCell: ({ row }: GridCellParams<RecordType>) => (
        <Box>
          <IconButton onClick={() => handleDeleteRecordType(row.id)}>
            <DeleteIcon color="error" />
          </IconButton>
        </Box>
      ),
      renderHeader: () => (
        <Box>
          <IconButton onClick={handleAddRecordType}>
            <AddCircleIcon color="primary" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <>
      <TableWrapper>
        <DataGrid
          rows={recordTypes.filter((rt) => rt.id !== DEFAULT_TYPE.id)}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id}
          rowSelection={false}
          editMode="cell"
          processRowUpdate={(value) => handleUpdateRecordType(value)}
        />
      </TableWrapper>
      <ErrorToast error={error} />
    </>
  );
}

function EditColorCell(props: GridRenderCellParams<RecordType, number>) {
  const { row, id, field } = props;
  const apiRef = useGridApiContext();

  const handleChange = (color?: string) => {
    if (color) {
      apiRef.current.setEditCellValue({ id, field, value: color });
    }

    apiRef.current.stopCellEditMode({ id, field });
  };

  return <ColorPicker defaultColor={row.color} handleClose={handleChange} />;
}
