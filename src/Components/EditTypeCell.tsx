import {
  GridRenderCellParams,
  GridValidRowModel,
  useGridApiContext,
} from '@mui/x-data-grid';
import TypeSelector from './TypeSelector';
import { RecordType } from '@budgeet/shared';

interface WithType extends GridValidRowModel {
  type?: string;
}

interface OwnProps<T extends WithType> extends GridRenderCellParams<T, string> {
  recordTypes: RecordType[];
}

export default function EditTypeCell<T extends WithType>(props: OwnProps<T>) {
  const { row, id, field, recordTypes } = props;
  const apiRef = useGridApiContext();

  const handleChange = (typeId?: string) => {
    if (typeId) {
      apiRef.current.setEditCellValue({ id, field, value: typeId });
    }

    apiRef.current.stopCellEditMode({ id, field });
  };

  return (
    <TypeSelector
      defaultSelected={row.type}
      recordTypes={recordTypes}
      handleSelect={handleChange}
    />
  );
}
