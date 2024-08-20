import { RecordType } from '../Models/RecordType';

export function compareRecordTypes(
  a: string,
  b: string,
  recordTypes: RecordType[]
) {
  const aVal = recordTypes.find((rt) => rt.id === a)!;
  const bVal = recordTypes.find((rt) => rt.id === b)!;

  return aVal.type.localeCompare(bVal.type);
}
