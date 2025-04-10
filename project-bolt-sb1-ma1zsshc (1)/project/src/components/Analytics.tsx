import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { AppDispatch } from '../store/store';
import { Line, Pie } from 'react-chartjs-2';
import { format } from 'date-fns';
import { RootState } from '../store/store';
import {
  fetchClicksOverTime,
  fetchDeviceBreakdown,
} from '../store/slices/analyticsSlice';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Analytics() {
  const dispatch: AppDispatch = useDispatch();
  const { clicksOverTime, deviceBreakdown, isLoading } = useSelector(
    (state: RootState) => state.analytics
  );

  useEffect(() => {
    dispatch(fetchClicksOverTime());
    dispatch(fetchDeviceBreakdown());
  }, [dispatch]);

  const clicksData = {
    labels: clicksOverTime.map((item) =>
      format(new Date(item.date), 'MMM d, yyyy')
    ),
    datasets: [
      {
        label: 'Clicks',
        data: clicksOverTime.map((item) => item.clicks),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const deviceData = {
    labels: deviceBreakdown.map((item) => item.device),
    datasets: [
      {
        data: deviceBreakdown.map((item) => item.count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Clicks Over Time</h3>
        <div className="h-64">
          <Line
            data={clicksData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
              },
            }}
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Device Breakdown</h3>
        <div className="h-64">
          <Pie
            data={deviceData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </div>
      </div>
    </div>
  );
}