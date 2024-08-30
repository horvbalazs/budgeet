import { v1 } from 'uuid';

export default function getUID(): string {
  return v1();
}
