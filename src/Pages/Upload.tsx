import { Badge, Box, IconButton } from '@mui/material';
import { DEFAULT_TYPE, useRecordType } from '../Hooks/useRecordType';
import AuthContext from '../Contexts/AuthContext';
import { ChangeEvent, useContext, useRef, useState } from 'react';
import { RecordBase } from '../Models/Record';
import ErrorToast from '../Components/ErrorToast';
import CSVToArray from '../Helpers/CSVToArray';
import ArrayToRecords from '../Helpers/ArrayToRecords';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { LoadingButton } from '@mui/lab';
import DeleteIcon from '@mui/icons-material/Delete';
import EditDateCell from '../Components/EditDateCell';
import TypeTag from '../Components/TypeTag';
import EditTypeCell from '../Components/EditTypeCell';
import { useRecord } from '../Hooks/useRecord';
import { useNavigate } from 'react-router-dom';
import RulesModal from '../Components/RulesModal';
import { Rule } from '../Models/Rule';
import getUID from '../Helpers/getUID';
import {
  TableButtonContainer,
  TableContainer,
  TableWrapper,
} from '../Components/Common';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { DATE_FORMAT } from '../Models/Format';
import moment from 'moment';
import { compareRecordTypes } from '../Helpers/compareRecordTypes';
import { RecordType } from '../Models/RecordType';

interface WithTempId extends RecordBase {
  id: string;
}

export default function Upload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const {
    recordTypes,
    loading: typesFetching,
    error: fetchError,
  } = useRecordType(user?.id!);
  const { addRecords } = useRecord(user?.id!, false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedRecords, setUploadedRecords] = useState<WithTempId[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [rules, setRules] = useState<Rule[]>([]);

  const loading = typesFetching || uploading;
  const error = uploadError ?? fetchError;

  const parseCSV = async (file: File): Promise<RecordBase[]> => {
    const text = await file.text();

    return ArrayToRecords(CSVToArray(text), rules);
  };

  const handleFileChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0];

    if (!file || file.type !== 'text/csv') {
      setUploadError('The uploaded file must be in CSV format.');
      return;
    }

    setUploading(true);
    setUploadError(null);

    parseCSV(file)
      .then((result) =>
        setUploadedRecords((prev) => {
          const temp = [...prev];

          result.forEach((r) => {
            temp.push({ ...r, id: getUID(temp) });
          });

          return temp;
        })
      )
      .catch((e) => setUploadError(e.message))
      .finally(() => {
        setUploading(false);
      });
  };

  const handleUpload = () => {
    inputRef.current?.click();
  };

  const handleRemoveRow = (rowId: string) => {
    setUploadedRecords((prev) => prev.filter((r) => r.id !== rowId));
  };

  const handleUpdate = (row: WithTempId) => {
    setUploadedRecords((prev) => prev.map((r) => (r.id === row.id ? row : r)));

    return row;
  };

  const handleAddRow = () => {
    setUploadedRecords((prev) => [
      ...prev,
      {
        currency: '',
        date: moment().valueOf(),
        description: '',
        id: getUID(prev),
        name: 'NEW_RECORD',
        type: DEFAULT_TYPE.id,
        value: 0,
      },
    ]);
  };

  const handleSave = () => {
    const records: RecordBase[] = uploadedRecords.map((r) => {
      const { id: _, ...withoutId } = r;

      return withoutId;
    });

    addRecords(records).then(() => {
      navigate('/dashboard');
    });
  };

  const handleRulesChanged = (value: Rule[]) => {
    setRules(value);
    setModalOpen(false);
  };

  const columns: GridColDef<WithTempId>[] = [
    {
      field: 'date',
      headerName: 'Date',
      editable: true,
      valueFormatter: (val) => moment(val).format(DATE_FORMAT),
      renderEditCell: (props) => <EditDateCell {...props} />,
      flex: 1,
    },
    {
      field: 'name',
      headerName: 'Name',
      editable: true,
      flex: 1,
    },
    {
      field: 'description',
      headerName: 'Description',
      editable: true,
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
      flex: 1,
    },
    {
      field: 'actions',
      headerName: '',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderHeader: () => (
        <Box>
          <IconButton onClick={handleAddRow}>
            <AddCircleIcon color="primary" />
          </IconButton>
        </Box>
      ),
      renderCell: ({ row }) => (
        <IconButton color="error" onClick={() => handleRemoveRow(row.id)}>
          <DeleteIcon />
        </IconButton>
      ),
      flex: 1,
    },
  ];

  return (
    <TableContainer>
      <TableButtonContainer>
        <LoadingButton loading={loading} onClick={handleUpload}>
          {uploadedRecords.length > 0 ? 'Upload more' : 'Upload'}
        </LoadingButton>
        <Box flex={1} />
        <Badge badgeContent={rules.length} color="primary">
          <LoadingButton variant="outlined" onClick={() => setModalOpen(true)}>
            Manage rules
          </LoadingButton>
        </Badge>
        <LoadingButton
          variant="contained"
          loading={loading}
          disabled={uploadedRecords.length === 0}
          onClick={handleSave}
        >
          Save
        </LoadingButton>
      </TableButtonContainer>
      <TableWrapper>
        <DataGrid
          rows={uploadedRecords}
          columns={columns}
          loading={loading}
          rowSelection={false}
          editMode="cell"
          processRowUpdate={(value) => handleUpdate(value)}
        />
      </TableWrapper>
      <input
        ref={inputRef}
        id="file"
        type="file"
        onClick={() => {
          if (inputRef.current) {
            inputRef.current.value = '';
          }
        }}
        onChange={handleFileChange}
        hidden
      />
      <RulesModal
        recordTypes={recordTypes}
        open={modalOpen}
        handleClose={handleRulesChanged}
      />
      <ErrorToast error={error} />
    </TableContainer>
  );
}
