import { pieArcLabelClasses, PieChart } from '@mui/x-charts';
import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import styled from 'styled-components';
import { Record, RecordType } from '@budgeet/shared';

const Container = styled(Box)`
  height: calc(100% - 128px);
  max-height: 512px;
  width: 100%;
  max-width: 768px;
`;

interface PieChartData {
  id: string;
  value: number;
  label: string;
  color: string;
}

interface OwnProps {
  records: Record[];
  recordTypes: RecordType[];
  currency: string;
}

export default function PieChartTab({
  records,
  recordTypes,
  currency,
}: OwnProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartData, setChartData] = useState<PieChartData[]>([]);
  const [chartSize, setChartSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const temp: Map<string | undefined, PieChartData> = new Map();

    records.forEach((record) => {
      const type = recordTypes.find((r) => r.id === record.type);
      let data = temp.get(type?.id);

      if (!type) {
        return;
      }

      if (!data) {
        data = {
          id: type.id,
          color: type?.color ?? '#808080',
          label: type?.type ?? 'No type',
          value: 0,
        };
      }

      data.value += record.value;

      temp.set(type?.id, data);
    });

    setChartData(Array.from(temp.values()));
  }, [records, recordTypes]);

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
      <PieChart
        series={[
          {
            arcLabel: ({ value, label }) =>
              `${label}: ${Math.round(value).toLocaleString()} ${currency}`,
            arcLabelMinAngle: 25,
            data: chartData,
            valueFormatter: ({ value }) =>
              `${Math.round(value).toLocaleString()} ${currency}`,
          },
        ]}
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
