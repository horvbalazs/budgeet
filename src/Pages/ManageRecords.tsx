import {
  DataGrid,
  getGridDateOperators,
  getGridStringOperators,
  GridColDef,
  GridRowSelectionModel,
} from '@mui/x-data-grid';
import EditDateCell from '../Components/EditDateCell';
import { useEffect, useState } from 'react';
import EditTypeCell from '../Components/EditTypeCell';
import TypeTag from '../Components/TypeTag';
import { Box } from '@mui/material';
import ErrorToast from '../Components/ErrorToast';
import { LoadingButton } from '@mui/lab';
import {
  TableButtonContainer,
  TableContainer,
  TableWrapper,
} from '../Components/Common';
import moment from 'moment';
import {
  compareRecordTypes,
  DATE_FORMAT,
  Record,
  RecordType,
  useRecord,
  useRecordType,
} from '@budgeet/shared';

const anyOfOperator = getGridStringOperators().filter(
  (op) => op.value === 'isAnyOf'
);

export default function ManageRecords() {
  const {
    recordTypes,
    loading: recordTypesLoading,
    error: recordTypesError,
  } = useRecordType();
  const {
    records: defaultRecords,
    loading: recordsLoading,
    error: recordsError,
    editRecords,
    deleteRecords,
  } = useRecord();
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);
  const [records, setRecords] = useState<Record[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setRecords(defaultRecords);
    setIsDirty(false);
  }, [defaultRecords]);

  const loading = recordTypesLoading || recordsLoading;
  const error = recordTypesError ?? recordsError;

  const columns: GridColDef<Record>[] = [
    {
      field: 'date',
      headerName: 'Date',
      editable: true,
      filterOperators: getGridDateOperators(),
      valueFormatter: (val) => moment(val).format(DATE_FORMAT),
      renderEditCell: (props) => <EditDateCell {...props} />,
      flex: 1,
    },
    {
      field: 'name',
      headerName: 'Name',
      editable: true,
      filterOperators: getGridStringOperators(),
      flex: 1,
    },
    {
      field: 'note',
      headerName: 'Note',
      editable: true,
      filterOperators: getGridStringOperators(),
      flex: 3,
    },
    {
      field: 'type',
      headerName: 'Type',
      type: 'singleSelect',
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
      valueOptions: recordTypes.map((rt) => ({ value: rt.id, label: rt.type })),
      sortComparator: (a: string, b: string) =>
        compareRecordTypes(a, b, recordTypes),
      valueFormatter: (val: RecordType) => val.type,
      flex: 1,
    },
    {
      field: 'value',
      headerName: 'Value',
      editable: true,
      type: 'number',
      flex: 1,
    },
    {
      field: 'currency',
      headerName: 'Currency',
      align: 'center',
      headerAlign: 'center',
      editable: true,
      filterOperators: anyOfOperator,
      flex: 1,
    },
  ];

  const handleUpdate = (value: Record) => {
    setRecords((prev) => prev.map((r) => (r.id === value.id ? value : r)));
    setIsDirty(true);

    return value;
  };

  const handleCancel = () => {
    setRecords(defaultRecords);
    setIsDirty(false);
  };

  const handleSave = () => {
    editRecords(records);
  };

  const handleDeleteSelected = () => {
    deleteRecords(rowSelectionModel.map((id) => id.toString()));
  };

  return (
    <TableContainer>
      <TableButtonContainer>
        <LoadingButton
          loading={loading}
          disabled={!isDirty}
          onClick={handleCancel}
        >
          Cancel
        </LoadingButton>
        <Box flex={1} />
        <LoadingButton
          variant="outlined"
          loading={loading}
          disabled={rowSelectionModel.length === 0}
          color="error"
          onClick={handleDeleteSelected}
        >
          Delete
        </LoadingButton>
        <LoadingButton
          variant="contained"
          loading={loading}
          disabled={!isDirty}
          onClick={handleSave}
        >
          Save
        </LoadingButton>
      </TableButtonContainer>
      <TableWrapper>
        <DataGrid
          rows={records}
          columns={columns}
          loading={loading}
          editMode="cell"
          rowSelectionModel={rowSelectionModel}
          onRowSelectionModelChange={(value) => setRowSelectionModel(value)}
          processRowUpdate={(value) => handleUpdate(value)}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </TableWrapper>
      <ErrorToast error={error} />
    </TableContainer>
  );
}
