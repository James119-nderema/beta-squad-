// src/components/DataAnalytics.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DataAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visualizationUrl, setVisualizationUrl] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8000/api/analysis/');
        setAnalytics(response.data);
        setVisualizationUrl('http://localhost:8000/api/visualization/');
        setError(null);
      } catch (err) {
        setError('Failed to load analytics data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading analytics data...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Attendance Analytics</h2>
      
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Summary</h3>
            <p className="mb-2">Total Records: <span className="font-bold">{analytics.total_records}</span></p>
            
            <h4 className="text-lg font-semibold mt-4 mb-2">Check-ins vs Check-outs</h4>
            <div className="flex justify-between">
              <span>Check-ins: {analytics.checkin_vs_checkout['Check in'] || 0}</span>
              <span>Check-outs: {analytics.checkin_vs_checkout['Check out'] || 0}</span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Department Distribution</h3>
            <ul className="space-y-1">
              {Object.entries(analytics.department_distribution || {}).map(([dept, count]) => (
                <li key={dept} className="flex justify-between">
                  <span>{dept}</span>
                  <span className="font-medium">{count}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Role Distribution</h3>
            <ul className="space-y-1">
              {Object.entries(analytics.role_distribution || {}).map(([role, count]) => (
                <li key={role} className="flex justify-between">
                  <span>{role}</span>
                  <span className="font-medium">{count}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Visualization</h3>
            {visualizationUrl && (
              <img 
                src={visualizationUrl} 
                alt="Attendance Data Visualization" 
                className="w-full h-auto"
                style={{ maxHeight: '300px' }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataAnalytics;