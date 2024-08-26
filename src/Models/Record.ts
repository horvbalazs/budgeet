export interface RecordBase {
  date: number;
  name: string;
  note: string;
  type: string;
  value: number;
  currency: string;
}

export interface Record extends RecordBase {
  id: string;
  userId: string;
}
