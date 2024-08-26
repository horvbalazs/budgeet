import moment from 'moment';
import { RecordBase } from '../Models/Record';
import { Rule } from '../Models/Rule';
import { DEFAULT_TYPE } from '../Hooks/useRecordType';
import { UploadOption } from '../Models/UploadOption';

export default function ArrayToRecords(arr: string[][], options: UploadOption) {
  const result: RecordBase[] = [];

  arr.forEach((row) => {
    const errors: string[] = [];

    const date = row[options.fieldIndexes.date];
    if (!date) {
      errors.push(`Invalid index: ${options.fieldIndexes.date}`);
    }

    const name = row[options.fieldIndexes.name];
    if (!name) {
      errors.push(`Invalid index: ${options.fieldIndexes.name}`);
    }

    const note = row[options.fieldIndexes.note];
    if (!note) {
      errors.push(`Invalid index: ${options.fieldIndexes.note}`);
    }

    const value = row[options.fieldIndexes.value];
    if (!value) {
      errors.push(`Invalid index: ${options.fieldIndexes.value}`);
    }

    const currency = row[options.fieldIndexes.currency];
    if (!currency) {
      errors.push(`Invalid index: ${options.fieldIndexes.currency}`);
    }

    if (errors.length > 0) {
      throw new Error(errors.join('\n'));
    }

    const record: RecordBase = {
      date: moment(date, options.dateFormat).valueOf(),
      name,
      value: Math.abs(parseFloat(value.replace(/,/g, ''))),
      currency,
      note,
      ...ApplyRules(options.rules, row),
    };

    result.push(record);
  });

  return result;
}

function ApplyRules(
  rules: Rule[],
  rawRecord: string[]
): { note?: string; type: string } {
  for (const rule of rules) {
    const value = rawRecord[rule.fieldIndex];

    if (typeof value == 'string') {
      const keyword = rule.keywords.find((kw) =>
        (value as string).toLocaleLowerCase().includes(kw.toLocaleLowerCase())
      );

      if (keyword) {
        return { note: keyword, type: rule.type };
      }
    }
  }

  return { type: DEFAULT_TYPE.id };
}
