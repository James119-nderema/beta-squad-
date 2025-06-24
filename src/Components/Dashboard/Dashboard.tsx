"use client";

// src/components/DataAnalytics.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';

interface AnalyticsData {
  total_records: number;
  checkin_vs_checkout: Record<string, number>;
  department_distribution: Record<string, number>;
  role_distribution: Record<string, number>;
  daily_attendance: Record<string, number>;
}

interface ChartLoadingState {
  departments: boolean;
  roles: boolean;
  attendance: boolean;
  signatures: boolean;
}

interface DailyAttendance {
  date: string;
  count: number;
}

const DataAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timestamp, setTimestamp] = useState<number>(Date.now()); // For cache-busting
  const [chartLoading, setChartLoading] = useState<ChartLoadingState>({
    departments: true,
    roles: true,
    attendance: true,
    signatures: true
  });

  const fetchData = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/analysis/');
      setAnalytics(response.data);
      setError(null);

      // Reset chart loading states
      setChartLoading({
        departments: true,
        roles: true,
        attendance: true,
        signatures: true
      });

      // Update timestamp to force new image fetches
      setTimestamp(Date.now());
    } catch (err: unknown) {
      setError('Failed to load analytics data: ' + (err instanceof Error ? err.message : 'Unknown error'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refreshData = (): void => {
    setTimestamp(Date.now());
    fetchData();
  };

  // Generate chart URLs with timestamp for cache busting
  const getChartUrl = (endpoint: string): string => {
    return `http://localhost:8000/api/chart/${endpoint}/?t=${timestamp}`;
  };

  // Function to handle image load events
  const handleImageLoad = (chartType: keyof ChartLoadingState): void => {
    setChartLoading(prev => ({...prev, [chartType]: false}));
  };

  // Function to handle image errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, chartType: keyof ChartLoadingState): void => {
    setChartLoading(prev => ({...prev, [chartType]: false}));
    e.currentTarget.onerror = null;
    e.currentTarget.src = 'https://via.placeholder.com/600x400?text=Chart+Error';
  };

  // Format dates for display
  const formatDailyAttendance = (dailyData?: Record<string, number>): DailyAttendance[] => {
    if (!dailyData) return [];

    return Object.entries(dailyData)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg font-semibold text-gray-700">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-500 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading analytics data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4" role="alert">
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-700">Attendance Analytics Dashboard</h2>
        <button
          onClick={refreshData}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Refresh Data
        </button>
      </div>

      {analytics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
              <h3 className="text-xl font-semibold mb-2 text-gray-700">Total Records</h3>
              <p className="text-4xl font-bold text-indigo-600">{analytics.total_records}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2 text-gray-700">Check-ins</h3>
              <p className="text-4xl font-bold text-green-600">
                {analytics.checkin_vs_checkout?.["CHECK-IN"] || 0}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2 text-gray-700">Check-outs</h3>
              <p className="text-4xl font-bold text-red-600">
                {analytics.checkin_vs_checkout?.["CHECK-OUT"] || 0}
              </p>
            </div>
          </div>

          {/* Individual Charts - with proper sizing matching backend figures */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Department Distribution Chart - backend size: (10, 8) */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">Department Distribution</h3>
              <div className="flex justify-center relative" style={{height: "400px"}}>
                {chartLoading.departments && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                  </div>
                )}
                <Image
                  src={getChartUrl('departments')}
                  alt="Department Distribution"
                  width={800}
                  height={400}
                  className={`max-h-full max-w-full object-contain transition-opacity duration-300 ${chartLoading.departments ? 'opacity-0' : 'opacity-100'}`}
                  onLoad={() => handleImageLoad('departments')}
                  onError={(e) => handleImageError(e, 'departments')}
                />
              </div>
            </div>

            {/* Role Distribution Chart - backend size: (10, 8) */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">Role Distribution</h3>
              <div className="flex justify-center relative" style={{height: "400px"}}>
                {chartLoading.roles && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                  </div>
                )}
                <Image
                  src={getChartUrl('roles')}
                  alt="Role Distribution"
                  width={800}
                  height={400}
                  className={`max-h-full max-w-full object-contain transition-opacity duration-300 ${chartLoading.roles ? 'opacity-0' : 'opacity-100'}`}
                  onLoad={() => handleImageLoad('roles')}
                  onError={(e) => handleImageError(e, 'roles')}
                />
              </div>
            </div>

            {/* Daily Attendance Chart - backend size: (12, 8) */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">Daily Attendance</h3>
              <div className="flex justify-center relative" style={{height: "400px"}}>
                {chartLoading.attendance && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                  </div>
                )}
                <Image
                  src={getChartUrl('attendance')}
                  alt="Daily Attendance"
                  width={800}
                  height={400}
                  className={`max-h-full max-w-full object-contain transition-opacity duration-300 ${chartLoading.attendance ? 'opacity-0' : 'opacity-100'}`}
                  onLoad={() => handleImageLoad('attendance')}
                  onError={(e) => handleImageError(e, 'attendance')}
                />
              </div>
            </div>

            {/* Check-in vs Check-out Chart - backend size: (10, 8) */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">Check-in vs Check-out</h3>
              <div className="flex justify-center relative" style={{height: "400px"}}>
                {chartLoading.signatures && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                  </div>
                )}
                <Image
                  src={getChartUrl('signatures')}
                  alt="Check-in vs Check-out"
                  width={800}
                  height={400}
                  className={`max-h-full max-w-full object-contain transition-opacity duration-300 ${chartLoading.signatures ? 'opacity-0' : 'opacity-100'}`}
                  onLoad={() => handleImageLoad('signatures')}
                  onError={(e) => handleImageError(e, 'signatures')}
                />
              </div>
            </div>
          </div>

          {/* Daily Attendance Details */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Daily Attendance Details</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formatDailyAttendance(analytics.daily_attendance).map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.count}</td>
                    </tr>
                  ))}
                  {formatDailyAttendance(analytics.daily_attendance).length === 0 && (
                    <tr>
                      <td colSpan={2} className="px-6 py-4 text-center text-sm text-gray-500">No attendance data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DataAnalytics;