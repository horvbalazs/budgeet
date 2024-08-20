import { RecordBase } from './Record';

export interface Rule {
  id: string;
  field: keyof RecordBase;
  keywords: string[];
  type?: string;
}
