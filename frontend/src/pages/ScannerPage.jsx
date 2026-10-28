// frontend/src/pages/ScannerPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaUpload, 
  FaBolt, 
  FaShieldAlt, 
  FaClock, 
  FaChartBar,
  FaCogs,
  FaFile,
  FaCheckCircle,
  FaTimesCircle,
  FaCaretRight,
  FaServer,
  FaMicrochip,
  FaMemory
} from 'react-icons/fa';
import { api } from '../services/api';
import Scanner from '../components/Scanner';

const ScannerPage = () => {
  const [systemInfo, setSystemInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('quick');
  const [scanHistory, setScanHistory] = useState([]);
  const [performanceStats, setPerformanceStats] = useState({
    totalScans: 0,
    threatsDetected: 0,
    avgScanTime: '0.2s',
    successRate: '99.8%'
  });

  useEffect(() => {
    fetchSystemInfo();
    fetchScanHistory();
  }, []);

  const fetchSystemInfo = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockSystemInfo = {
        gpu: { 
          name: 'NVIDIA GeForce RTX 3060', 
          memory: '12GB GDDR6', 
          cudaCores: '3584',
          clockSpeed: '1.78 GHz'
        },
        cpu: { 
          model: 'Intel Core i7-12700K', 
          cores: '12 (8P + 4E)', 
          threads: '20',
          clockSpeed: '3.6 GHz'
        },
        mpi: { 
          version: 'Microsoft MPI v10.0', 
          available: true,
          nodes: 4
        },
        system: {
          ram: '32GB DDR4',
          storage: '1TB NVMe SSD',
          os: 'Windows 11 Pro'
        }
      };
      setSystemInfo(mockSystemInfo);
    } catch (error) {
      console.error('Failed to fetch system info:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchScanHistory = async () => {
    // Mock scan history
    const mockHistory = [
      { id: 1, fileName: 'document.pdf', status: 'clean', time: '2 min ago', size: '2.4 MB' },
      { id: 2, fileName: 'setup.exe', status: 'threat', time: '1 hour ago', size: '45.2 MB' },
      { id: 3, fileName: 'image.png', status: 'clean', time: '3 hours ago', size: '8.7 MB' },
      { id: 4, fileName: 'archive.zip', status: 'clean', time: '1 day ago', size: '102.3 MB' },
      { id: 5, fileName: 'script.js', status: 'threat', time: '2 days ago', size: '0.8 MB' },
    ];
    setScanHistory(mockHistory);
  };

  const handleScanComplete = (result) => {
    // Update stats and history when scan completes
    setPerformanceStats(prev => ({
      ...prev,
      totalScans: prev.totalScans + 1,
      threatsDetected: result.isThreat ? prev.threatsDetected + 1 : prev.threatsDetected
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading scanner configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Virus Scanner</h1>
          <p className="text-gray-600">GPU-accelerated threat detection using CUDA and MPI</p>
        </div>
        <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-lg">
          <FaBolt className="text-yellow-500" />
          <span className="font-semibold text-gray-800">Real-time Protection: ACTIVE</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Scans</p>
              <p className="text-2xl font-bold text-gray-900">{performanceStats.totalScans}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FaChartBar className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Threats Detected</p>
              <p className="text-2xl font-bold text-red-600">{performanceStats.threatsDetected}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <FaShieldAlt className="text-red-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg. Scan Time</p>
              <p className="text-2xl font-bold text-purple-600">{performanceStats.avgScanTime}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <FaClock className="text-purple-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Success Rate</p>
              <p className="text-2xl font-bold text-green-600">{performanceStats.successRate}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FaCheckCircle className="text-green-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Scanner Component */}
        <div className="lg:col-span-2 space-y-6">
          {/* Scanner Tabs */}
          <div className="bg-white rounded-xl shadow border border-gray-200">
            <div className="border-b border-gray-200">
              <div className="flex space-x-1 px-6">
                {['quick', 'full', 'custom'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 font-medium text-sm transition-colors ${
                      activeTab === tab
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)} Scan
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-6">
              {/* Your Scanner Component */}
              <Scanner onScanComplete={handleScanComplete} />
            </div>
          </div>

          {/* Recent Scans */}
          <div className="bg-white rounded-xl shadow border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Scans</h2>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {scanHistory.slice(0, 5).map((scan) => (
                  <div key={scan.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FaFile className="text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{scan.fileName}</p>
                        <p className="text-sm text-gray-500">{scan.time} • {scan.size}</p>
                      </div>
                    </div>
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
                      scan.status === 'clean' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {scan.status === 'clean' ? (
                        <FaCheckCircle />
                      ) : (
                        <FaTimesCircle />
                      )}
                      <span className="text-sm font-medium">
                        {scan.status === 'clean' ? 'Clean' : 'Threat'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 p-3 text-center text-blue-600 hover:bg-blue-50 rounded-lg font-medium">
                View Full History <FaCaretRight className="inline ml-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: System Info */}
        <div className="space-y-6">
          {/* System Configuration Card */}
          <div className="bg-white rounded-xl shadow border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <FaCogs className="mr-2 text-blue-600" />
                System Configuration
              </h2>
            </div>
            <div className="p-6 space-y-6">
              {/* GPU */}
              <div className="space-y-2">
                <div className="flex items-center text-gray-700">
                  <FaBolt className="mr-2 text-green-600" />
                  <span className="font-medium">GPU</span>
                </div>
                <div className="pl-6 space-y-1">
                  <p className="text-sm text-gray-900">{systemInfo.gpu.name}</p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Memory: {systemInfo.gpu.memory}</span>
                    <span>Cores: {systemInfo.gpu.cudaCores}</span>
                  </div>
                </div>
              </div>

              {/* CPU */}
              <div className="space-y-2">
                <div className="flex items-center text-gray-700">
                  <FaMicrochip className="mr-2 text-blue-600" />
                  <span className="font-medium">CPU</span>
                </div>
                <div className="pl-6 space-y-1">
                  <p className="text-sm text-gray-900">{systemInfo.cpu.model}</p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Cores: {systemInfo.cpu.cores}</span>
                    <span>Threads: {systemInfo.cpu.threads}</span>
                  </div>
                </div>
              </div>

              {/* MPI */}
              <div className="space-y-2">
                <div className="flex items-center text-gray-700">
                  <FaServer className="mr-2 text-purple-600" />
                  <span className="font-medium">MPI Cluster</span>
                </div>
                <div className="pl-6 space-y-1">
                  <p className="text-sm text-gray-900">{systemInfo.mpi.version}</p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Status: {systemInfo.mpi.available ? 'Active' : 'Inactive'}</span>
                    <span>Nodes: {systemInfo.mpi.nodes}</span>
                  </div>
                </div>
              </div>

              {/* System */}
              <div className="space-y-2">
                <div className="flex items-center text-gray-700">
                  <FaMemory className="mr-2 text-yellow-600" />
                  <span className="font-medium">System</span>
                </div>
                <div className="pl-6 space-y-1">
                  <p className="text-sm text-gray-900">{systemInfo.system.os}</p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>RAM: {systemInfo.system.ram}</span>
                    <span>Storage: {systemInfo.system.storage}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow border border-blue-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full btn-primary flex items-center justify-center space-x-2 py-3">
                <FaUpload />
                <span>Scan Directory</span>
              </button>
              <button className="w-full btn-secondary flex items-center justify-center space-x-2 py-3">
                <FaShieldAlt />
                <span>Schedule Scan</span>
              </button>
              <button className="w-full bg-white text-gray-800 border border-gray-300 flex items-center justify-center space-x-2 py-3 rounded-lg hover:bg-gray-50">
                <FaCogs />
                <span>Scanner Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;