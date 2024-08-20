import { useContext, useEffect, useMemo, useState } from 'react';
import { useRecord } from '../Hooks/useRecord';
import AuthContext from '../Contexts/AuthContext';
import { useRecordType } from '../Hooks/useRecordType';
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  CircularProgress,
  Paper,
} from '@mui/material';
import ErrorToast from '../Components/ErrorToast';
import styled from 'styled-components';
import PieChartTab from '../Components/PieChartTab';
import PieChartIcon from '@mui/icons-material/PieChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import { ChartPreferences } from '../Models/ChartPreferences';
import ChartSettings from '../Components/ChartSettings';
import { Record } from '../Models/Record';
import moment from 'moment';
import BarChartTab from '../Components/BarChartTab';
import { getItem, setItem, StorageKeys } from '../storage';

const Container = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const ChartContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const NavContainer = styled(Paper)`
  position: fixed;
  width: 100%;
  max-width: 516px;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
`;

enum ChartType {
  Pie,
  Bar,
}

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const {
    records,
    loading: recordsLoading,
    error: recordsError,
  } = useRecord(user?.id!);
  const {
    recordTypes,
    loading: typesLoading,
    error: typesError,
  } = useRecordType(user?.id!);
  const [chart, setChart] = useState<ChartType>(ChartType.Pie);
  const [chartPrefs, setChartPrefs] = useState<ChartPreferences>();
  const [applicableRecords, setApplicableRecords] = useState<Record[]>([]);

  const { currencies, minDate, maxDate } = useMemo(() => {
    const temp = new Set<string>();
    let minDate: number = Number.POSITIVE_INFINITY;
    let maxDate: number = Number.NEGATIVE_INFINITY;

    records.forEach((r) => {
      if (minDate > r.date) {
        minDate = r.date;
      }

      if (maxDate < r.date) {
        maxDate = r.date;
      }

      temp.add(r.currency);
    });

    minDate = moment(minDate).startOf('day').valueOf();
    maxDate = moment(maxDate).startOf('day').valueOf();

    return { currencies: Array.from(temp.values()), minDate, maxDate };
  }, [records]);

  useEffect(() => {
    const storagePrefs = getItem<ChartPreferences>(
      StorageKeys.CHART_PREFERENCES
    );

    if (storagePrefs) {
      setChartPrefs(storagePrefs);
    } else if (currencies.length > 0) {
      setChartPrefs({
        currency: currencies[0],
        startDate: minDate,
        endDate: maxDate,
        selectedTypes: recordTypes.map((rt) => rt.id),
        disposition: 'year',
      });
    }
  }, [currencies, recordTypes, minDate, maxDate]);

  useEffect(() => {
    if (chartPrefs) {
      setApplicableRecords(
        records.filter(
          (r) =>
            r.date >= chartPrefs.startDate &&
            r.date <= chartPrefs.endDate &&
            r.type &&
            chartPrefs.selectedTypes.includes(r.type) &&
            r.currency === chartPrefs.currency
        )
      );

      setItem(StorageKeys.CHART_PREFERENCES, chartPrefs);
    }
  }, [chartPrefs]);

  const loading = recordsLoading || typesLoading;
  const error = recordsError ?? typesError;

  return (
    <Container>
      {loading ? (
        <CircularProgress />
      ) : (
        chartPrefs && (
          <>
            <ChartSettings
              value={chartPrefs}
              currencies={currencies}
              recordTypes={recordTypes}
              minDate={minDate}
              maxDate={maxDate}
              handleChange={(value) => setChartPrefs(value)}
              hideDisposition={chart === ChartType.Pie}
            />
            <ChartContainer>
              {chart === ChartType.Pie ? (
                <PieChartTab
                  records={applicableRecords}
                  recordTypes={recordTypes}
                  currency={chartPrefs.currency}
                />
              ) : (
                <BarChartTab
                  records={applicableRecords}
                  recordTypes={recordTypes}
                  currency={chartPrefs.currency}
                  disposition={chartPrefs.disposition}
                />
              )}
            </ChartContainer>
          </>
        )
      )}
      <NavContainer elevation={3}>
        <BottomNavigation
          showLabels
          value={chart}
          onChange={(_, newValue: ChartType) => {
            setChart(newValue);
          }}
        >
          <BottomNavigationAction
            label="Pie"
            value={ChartType.Pie}
            icon={<PieChartIcon />}
          />
          <BottomNavigationAction
            label="Bars"
            value={ChartType.Bar}
            icon={<BarChartIcon />}
          />
        </BottomNavigation>
      </NavContainer>
      <ErrorToast error={error} />
    </Container>
  );
}
