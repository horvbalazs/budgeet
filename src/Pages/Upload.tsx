import { Badge, Box, IconButton } from '@mui/material';
import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';
import {
  AnonymousItem,
  ArrayToRecords,
  compareRecordTypes,
  CSVToArray,
  DATE_FORMAT,
  DEFAULT_TYPE,
  getUID,
  Record,
  RecordBase,
  RecordType,
  StorageContext,
  StorageKeys,
  UploadOption,
  useRecord,
  useRecordType,
} from '@budgeet/shared';
import ErrorToast from '../Components/ErrorToast';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { LoadingButton } from '@mui/lab';
import DeleteIcon from '@mui/icons-material/Delete';
import EditDateCell from '../Components/EditDateCell';
import TypeTag from '../Components/TypeTag';
import EditTypeCell from '../Components/EditTypeCell';
import { useNavigate } from 'react-router-dom';
import UploadOptionsModal from '../Components/UploadOptionsModal';
import {
  TableButtonContainer,
  TableContainer,
  TableWrapper,
} from '../Components/Common';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import moment from 'moment';
import SettingsIcon from '@mui/icons-material/Settings';

const DEFAULT_OPTIONS: UploadOption = {
  fieldIndexes: {
    date: 0,
    name: 1,
    note: 2,
    value: 3,
    currency: 4,
  },
  dateFormat: '',
  rules: [],
};

export default function Upload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { storage } = useContext(StorageContext);
  const {
    recordTypes,
    loading: typesFetching,
    error: fetchError,
  } = useRecordType();
  const { addRecords } = useRecord(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedRecords, setUploadedRecords] = useState<
    AnonymousItem<Record>[]
  >([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [options, setOptions] = useState<UploadOption>(getDefaultOptions());

  useEffect(() => {
    storage!.cache
      .getItem<UploadOption>(StorageKeys.UPLOAD_OPTIONS)
      .then((storageOptions) => {
        if (storageOptions) {
          setOptions(storageOptions);
        }
      });
  }, []);

  useEffect(() => {
    if (options) {
      storage!.cache.setItem(StorageKeys.UPLOAD_OPTIONS, options);
    }
  }, [options]);

  const loading = typesFetching || uploading;
  const error = uploadError ?? fetchError;

  const parseCSV = async (file: File): Promise<RecordBase[]> => {
    const text = await file.text();

    return ArrayToRecords(CSVToArray(text), options);
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
            temp.push({ ...r, anonymousId: getUID() });
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
    setUploadedRecords((prev) => prev.filter((r) => r.anonymousId !== rowId));
  };

  const handleUpdate = (row: AnonymousItem<Record>) => {
    setUploadedRecords((prev) =>
      prev.map((r) => (r.anonymousId === row.anonymousId ? row : r))
    );

    return row;
  };

  const handleAddRow = () => {
    setUploadedRecords((prev) => [
      ...prev,
      {
        currency: '',
        date: moment().valueOf(),
        note: '',
        anonymousId: getUID(),
        name: 'NEW_RECORD',
        type: DEFAULT_TYPE.id,
        value: 0,
        userId: '',
      },
    ]);
  };

  const handleSave = () => {
    const records: RecordBase[] = uploadedRecords.map((r) => {
      const { anonymousId: _, ...withoutId } = r;

      return withoutId;
    });

    addRecords(records).then(() => {
      navigate('/dashboard');
    });
  };

  const handleOptionsChanged = (value: UploadOption) => {
    setOptions(value);
  };

  const columns: GridColDef<AnonymousItem<Record>>[] = [
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
      field: 'note',
      headerName: 'Note',
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
        <IconButton
          color="error"
          onClick={() => handleRemoveRow(row.anonymousId)}
        >
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
        <Badge badgeContent={options?.rules.length} color="primary">
          <LoadingButton
            variant="outlined"
            onClick={() => setModalOpen(true)}
            startIcon={<SettingsIcon />}
          >
            Options
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
          getRowId={(row) => row.anonymousId}
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
      {options && (
        <UploadOptionsModal
          options={options}
          recordTypes={recordTypes}
          open={modalOpen}
          handleChange={handleOptionsChanged}
          handleClose={() => setModalOpen(false)}
        />
      )}
      <ErrorToast error={error} />
    </TableContainer>
  );
}

function getDefaultOptions(): UploadOption {
  const lang = navigator.languages
    ? navigator.languages[0]
    : navigator.language;

  return {
    ...DEFAULT_OPTIONS,
    dateFormat:
      moment().locale(lang).localeData().longDateFormat('L') ?? 'MM/DD/YYYY',
  };
}
