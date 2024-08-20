export interface RecordTypeBase {
  type: string;
  color: string;
}

export interface RecordType extends RecordTypeBase {
  userId: string;
  id: string;
}
