import { RecordType } from '@budgeet/types';

export function compareRecordTypes(
  a: string,
  b: string,
  recordTypes: RecordType[]
) {
  const aVal = recordTypes.find((rt) => rt.id === a)!;
  const bVal = recordTypes.find((rt) => rt.id === b)!;

  return aVal.type.localeCompare(bVal.type);
}
