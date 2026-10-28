import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaUpload, 
  FaShieldAlt, 
  FaChartBar, 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle,
  FaArrowUp,
  FaBolt,
  FaHistory,
  FaFileAlt,
  FaCubes
} from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalScans: 0,
    threatsDetected: 0,
    cleanFiles: 0,
    avgScanTime: 0,
    gpuUtilization: 0
  });

  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalScans: 127,
        threatsDetected: 8,
        cleanFiles: 119,
        avgScanTime: 0.24,
        gpuUtilization: 85
      });

      setRecentScans([
        { id: 1, fileName: 'document.pdf', status: 'clean', timestamp: '2 min ago', size: '2.4 MB' },
        { id: 2, fileName: 'setup.exe', status: 'infected', timestamp: '15 min ago', size: '15.2 MB' },
        { id: 3, fileName: 'archive.zip', status: 'clean', timestamp: '1 hour ago', size: '45.7 MB' },
        { id: 4, fileName: 'image.jpg', status: 'clean', timestamp: '2 hours ago', size: '8.9 MB' },
        { id: 5, fileName: 'script.js', status: 'suspicious', timestamp: '5 hours ago', size: '124 KB' },
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Files Scanned',
        data: [12, 19, 15, 25, 22, 30, 18],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Threats Detected',
        data: [1, 2, 0, 3, 1, 2, 0],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Weekly Scan Activity'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const statCards = [
    {
      title: 'Total Scans',
      value: stats.totalScans,
      icon: <FaShieldAlt className="text-blue-600" />,
      color: 'blue',
      change: '+12%',
      description: 'Files scanned this month'
    },
    {
      title: 'Threats Detected',
      value: stats.threatsDetected,
      icon: <FaTimesCircle className="text-red-600" />,
      color: 'red',
      change: '-3%',
      description: 'Malicious files found'
    },
    {
      title: 'Clean Files',
      value: stats.cleanFiles,
      icon: <FaCheckCircle className="text-green-600" />,
      color: 'green',
      change: '+8%',
      description: 'Safe files verified'
    },
    {
      title: 'Avg Scan Time',
      value: `${stats.avgScanTime}s`,
      icon: <FaBolt className="text-purple-600" />,
      color: 'purple',
      change: '-25%',
      description: 'With CUDA acceleration'
    }
  ];

  const getStatusBadge = (status) => {
    const badges = {
      clean: <span className="badge-success">Clean</span>,
      infected: <span className="badge-danger">Infected</span>,
      suspicious: <span className="badge-warning">Suspicious</span>
    };
    return badges[status] || <span className="badge-info">Unknown</span>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="spinner w-12 h-12 border-4 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-cuda text-white rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back!</h1>
            <p className="opacity-90">
              Your CUDA scanner is active and ready. Upload files for lightning-fast virus detection.
            </p>
          </div>
          <Link
            to="/scanner"
            className="mt-4 md:mt-0 inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            <FaUpload className="mr-2" />
            Scan Files Now
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                {stat.icon}
              </div>
              <span className={`text-sm font-medium text-${stat.color}-600 flex items-center`}>
                <FaArrowUp className="mr-1" />
                {stat.change}
              </span>
            </div>
            <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
            <p className="text-gray-600 font-medium">{stat.title}</p>
            <p className="text-sm text-gray-500 mt-2">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Charts and Recent Scans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Scan Analytics</h2>
            <select className="text-sm border rounded-lg px-3 py-1">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="h-80">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Recent Scans */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Recent Scans</h2>
            <Link
              to="/history"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentScans.map((scan) => (
              <div
                key={scan.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <FaFileAlt className="text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{scan.fileName}</p>
                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                      <span>{scan.size}</span>
                      <span>•</span>
                      <span>{scan.timestamp}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {getStatusBadge(scan.status)}
                  <button className="text-gray-400 hover:text-blue-600">
                    <FaHistory />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* GPU Status and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GPU Status */}
        <div className="card p-6 lg:col-span-2">
          <h2 className="text-xl font-bold mb-6">GPU Acceleration Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FaCubes className="text-purple-600 text-xl" />
                </div>
                <div>
                  <h3 className="font-medium">CUDA Performance</h3>
                  <p className="text-sm text-gray-500">NVIDIA GPU Acceleration</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">{stats.gpuUtilization}%</div>
                <div className="text-sm text-gray-500">Utilization</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.gpuUtilization}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">24x</div>
                <div className="text-sm text-gray-600">Faster</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">512</div>
                <div className="text-sm text-gray-600">Cores Active</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="text-lg font-bold text-purple-600">5.2GB</div>
                <div className="text-sm text-gray-600">VRAM Used</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaUpload className="text-blue-600" />
                </div>
                <span className="font-medium">Upload & Scan</span>
              </div>
              <span className="text-gray-400">→</span>
            </button>
            <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FaChartBar className="text-green-600" />
                </div>
                <span className="font-medium">View Reports</span>
              </div>
              <span className="text-gray-400">→</span>
            </button>
            <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FaClock className="text-purple-600" />
                </div>
                <span className="font-medium">Schedule Scan</span>
              </div>
              <span className="text-gray-400">→</span>
            </button>
            <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FaShieldAlt className="text-red-600" />
                </div>
                <span className="font-medium">Threat History</span>
              </div>
              <span className="text-gray-400">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;