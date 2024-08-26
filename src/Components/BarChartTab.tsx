import { BarChart, BarSeriesType, pieArcLabelClasses } from '@mui/x-charts';
import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import styled from 'styled-components';
import { RecordType } from '../Models/RecordType';
import { Record } from '../Models/Record';
import { Disposition } from '../Models/ChartPreferences';
import moment from 'moment';
import { MakeOptional } from '@mui/x-charts/internals';

const Container = styled(Box)`
  height: calc(100% - 128px);
  max-height: 512px;
  width: 100%;
  max-width: 768px;
`;

type BarChartData = { [key: string]: number | string };

interface OwnProps {
  records: Record[];
  recordTypes: RecordType[];
  currency: string;
  disposition: Disposition;
}

export default function BarChartTab({
  records,
  recordTypes,
  currency,
  disposition,
}: OwnProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartData, setChartData] = useState<BarChartData[]>([]);
  const [chartSize, setChartSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const temp: Map<string, BarChartData> = new Map();

    records.forEach((record) => {
      const type = recordTypes.find((r) => r.id === record.type);
      const dispositionValue = getDispositionValue(disposition, record);
      const existing = temp.get(dispositionValue);
      let value: BarChartData = {
        ...existing,
        [disposition]: dispositionValue,
      };

      if (!type) {
        return;
      }

      if (value[type.id]) {
        value[type.id] = (value[type.id] as number) + record.value;
      } else {
        value[type.id] = record.value;
      }

      temp.set(dispositionValue, value);
    });

    const sortedData = Array.from(temp.values()).sort((a, b) => {
      const aDispValue = a[disposition];
      const bDispValue = b[disposition];

      if (typeof aDispValue === 'string' && typeof bDispValue === 'string') {
        let aFirst = 0;
        let bFirst = 0;
        let aSecond = 0;
        let bSecond = 0;

        switch (disposition) {
          case 'week':
            aFirst = parseInt(aDispValue.match(/^\S*/g)?.[0] ?? '0');
            bFirst = parseInt(bDispValue.match(/^\S*/g)?.[0] ?? '0');
            aSecond = parseInt(aDispValue.match(/\((.*?)\)/g)?.[0] ?? '0');
            bSecond = parseInt(bDispValue.match(/\((.*?)\)/g)?.[0] ?? '0');
            break;
          case 'month':
            const aMonthName = aDispValue.match(/^\S*/g)?.[0];
            const bMonthName = bDispValue.match(/^\S*/g)?.[0];
            aFirst = aMonthName
              ? parseInt(moment().month(aMonthName).format('M'))
              : Number.POSITIVE_INFINITY;
            bFirst = bMonthName
              ? parseInt(moment().month(bMonthName).format('M'))
              : Number.POSITIVE_INFINITY;
            aSecond = parseInt(aDispValue.match(/\((.*?)\)/g)?.[0] ?? '0');
            bSecond = parseInt(bDispValue.match(/\((.*?)\)/g)?.[0] ?? '0');
            break;
          case 'year':
            aFirst = parseInt(aDispValue);
            bFirst = parseInt(bDispValue);
            break;
        }

        return aFirst - bFirst || aSecond - bSecond;
      }

      return 0;
    });

    setChartData(sortedData);
  }, [records, recordTypes, disposition]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(([node]) => {
      setChartSize({
        width: node.contentRect.width,
        height: node.contentRect.height,
      });
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <Container ref={containerRef}>
      <BarChart
        dataset={chartData}
        series={addLabels(recordTypes, currency)}
        xAxis={[{ scaleType: 'band', dataKey: disposition }]}
        width={chartSize.width}
        height={chartSize.height}
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            fill: 'white',
            fontWeight: 'bold',
          },
        }}
      />
    </Container>
  );
}

function addLabels(
  types: RecordType[],
  currency: string
): MakeOptional<BarSeriesType, 'type'>[] {
  return types.map((item) => ({
    dataKey: item.id,
    label: item.type,
    color: item.color,
    stack: 'all',
    valueFormatter: (v: number | null) =>
      v ? `${v.toLocaleString()} ${currency}` : '-',
  }));
}

function getDispositionValue(disposition: Disposition, record: Record): string {
  const year = moment(record.date).year();
  const month = moment(record.date).startOf('month').format('MMM');
  const week = moment(record.date).week();

  switch (disposition) {
    case 'week':
      return `${week} (${year})`;
    case 'month':
      return `${month} (${year})`;
    case 'year':
      return year.toString();
  }
}
