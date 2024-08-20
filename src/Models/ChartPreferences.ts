import { RecordType } from './RecordType';

export type Disposition = 'week' | 'month' | 'year';

export interface ChartPreferences {
  startDate: number;
  endDate: number;
  currency: string;
  disposition: Disposition;
  selectedTypes: string[];
}
