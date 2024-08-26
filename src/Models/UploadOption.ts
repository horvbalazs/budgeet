import { RecordBase } from './Record';
import { Rule } from './Rule';

export type FieldIndex = {
  [key in keyof Omit<RecordBase, 'type'>]: number;
};

export interface UploadOption {
  fieldIndexes: FieldIndex;
  dateFormat: string;
  rules: Rule[];
}
