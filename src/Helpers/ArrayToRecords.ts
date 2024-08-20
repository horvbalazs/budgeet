import moment from 'moment';
import { RecordBase } from '../Models/Record';
import { Rule } from '../Models/Rule';
import { DEFAULT_TYPE } from '../Hooks/useRecordType';

export default function ArrayToRecords(arr: string[][], rules: Rule[] = []) {
  const result: RecordBase[] = [];

  arr.forEach((row) => {
    const record: RecordBase = {
      date: moment(row[0] ?? moment.now()).valueOf(),
      name: row[1] ?? '',
      description: row[2] ?? '',
      value: Math.abs(
        parseFloat(row[3].split(' ').join('').split(',').join('.')) ?? 0
      ),
      currency: row[4] ?? '',
      type: DEFAULT_TYPE.id,
    };

    const type = ApplyRules(rules, record);

    if (type) {
      record.type = type;
    }

    result.push(record);
  });

  return result;
}

function ApplyRules(rules: Rule[], record: RecordBase): string | undefined {
  for (const rule of rules) {
    const value = record[rule.field];
    if (
      typeof value == 'string' &&
      rule.keywords.some((kw) =>
        (value as string).toLocaleLowerCase().includes(kw.toLocaleLowerCase())
      )
    ) {
      return rule.type;
    }
  }

  return;
}
