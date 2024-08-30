import { GridRenderCellParams, useGridApiContext } from '@mui/x-data-grid';
import { RecordBase } from '@budgeet/types';
import { DatePicker } from '@mui/x-date-pickers';
import moment, { Moment } from 'moment';
import { DATE_FORMAT } from '../Constants/Format';

export default function EditDateCell(
  props: GridRenderCellParams<RecordBase, number>
) {
  const { row, id, field } = props;
  const apiRef = useGridApiContext();

  const handleChange = (value: Moment | null) => {
    if (value) {
      apiRef.current.setEditCellValue({
        id,
        field,
        value: value.format(DATE_FORMAT),
      });
    }

    apiRef.current.stopCellEditMode({ id, field });
  };

  return <DatePicker value={moment(row.date)} onChange={handleChange} />;
}
