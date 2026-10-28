import React, { useState, useEffect } from 'react';
import { 
  FaFilter, 
  FaDownload, 
  FaTrash, 
  FaSearch, 
  FaCalendarAlt,
  FaFile,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaChartBar,
  FaEye,
  FaRedo
} from 'react-icons/fa';

const History = () => {
  const [scans, setScans] = useState([]);
  const [filteredScans, setFilteredScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedScans, setSelectedScans] = useState([]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockScans = [
        { 
          id: 1, 
          fileName: 'setup.exe', 
          status: 'infected', 
          timestamp: '2024-01-15 14:30', 
          size: '15.2 MB', 
          threats: 2, 
          scanType: 'Deep Scan',
          duration: '1.2s',
          fileType: 'executable'
        },
        { 
          id: 2, 
          fileName: 'document.pdf', 
          status: 'clean', 
          timestamp: '2024-01-15 11:15', 
          size: '2.4 MB', 
          threats: 0, 
          scanType: 'Quick Scan',
          duration: '0.3s',
          fileType: 'document'
        },
        { 
          id: 3, 
          fileName: 'archive.zip', 
          status: 'suspicious', 
          timestamp: '2024-01-14 16:45', 
          size: '45.7 MB', 
          threats: 1, 
          scanType: 'Deep Scan',
          duration: '3.5s',
          fileType: 'archive'
        },
        { 
          id: 4, 
          fileName: 'image.jpg', 
          status: 'clean', 
          timestamp: '2024-01-14 10:20', 
          size: '8.9 MB', 
          threats: 0, 
          scanType: 'Quick Scan',
          duration: '0.4s',
          fileType: 'image'
        },
        { 
          id: 5, 
          fileName: 'script.js', 
          status: 'infected', 
          timestamp: '2024-01-13 09:10', 
          size: '124 KB', 
          threats: 1, 
          scanType: 'Custom Scan',
          duration: '0.8s',
          fileType: 'script'
        },
        { 
          id: 6, 
          fileName: 'presentation.pptx', 
          status: 'clean', 
          timestamp: '2024-01-12 15:30', 
          size: '12.3 MB', 
          threats: 0, 
          scanType: 'Deep Scan',
          duration: '2.1s',
          fileType: 'document'
        },
        { 
          id: 7, 
          fileName: 'backup.rar', 
          status: 'clean', 
          timestamp: '2024-01-11 08:45', 
          size: '102.4 MB', 
          threats: 0, 
          scanType: 'Deep Scan',
          duration: '4.8s',
          fileType: 'archive'
        },
        { 
          id: 8, 
          fileName: 'malware.dll', 
          status: 'infected', 
          timestamp: '2024-01-10 13:20', 
          size: '3.7 MB', 
          threats: 3, 
          scanType: 'Deep Scan',
          duration: '1.5s',
          fileType: 'executable'
        },
      ];
      
      setScans(mockScans);
      setFilteredScans(mockScans);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let results = scans;
    
    // Apply search filter
    if (searchTerm) {
      results = results.filter(scan =>
        scan.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scan.fileType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      results = results.filter(scan => scan.status === statusFilter);
    }
    
    setFilteredScans(results);
  }, [scans, searchTerm, statusFilter]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'clean':
        return <FaCheckCircle className="text-green-600" />;
      case 'infected':
        return <FaTimesCircle className="text-red-600" />;
      case 'suspicious':
        return <FaExclamationTriangle className="text-yellow-600" />;
      default:
        return <FaFile className="text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'clean':
        return <span className="badge-success">Clean</span>;
      case 'infected':
        return <span className="badge-danger">Infected</span>;
      case 'suspicious':
        return <span className="badge-warning">Suspicious</span>;
      default:
        return <span className="badge-info">Unknown</span>;
    }
  };

  const handleSelectScan = (id) => {
    setSelectedScans(prev =>
      prev.includes(id)
        ? prev.filter(scanId => scanId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedScans.length === filteredScans.length) {
      setSelectedScans([]);
    } else {
      setSelectedScans(filteredScans.map(scan => scan.id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedScans.length === 0) return;
    
    if (window.confirm(`Delete ${selectedScans.length} scan record(s)?`)) {
      setScans(prev => prev.filter(scan => !selectedScans.includes(scan.id)));
      setSelectedScans([]);
    }
  };

  const handleRescan = (id) => {
    // TODO: Implement rescan functionality
    console.log('Rescanning:', id);
  };

  const downloadReport = (scan) => {
    // TODO: Implement download functionality
    const report = {
      fileName: scan.fileName,
      status: scan.status,
      timestamp: scan.timestamp,
      threats: scan.threats,
      scanType: scan.scanType,
      duration: scan.duration
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scan-report-${scan.fileName}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const stats = {
    total: scans.length,
    clean: scans.filter(s => s.status === 'clean').length,
    infected: scans.filter(s => s.status === 'infected').length,
    suspicious: scans.filter(s => s.status === 'suspicious').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="spinner w-12 h-12 border-4 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading scan history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scan History</h1>
          <p className="text-gray-600">View and manage your file scan records</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <button
            onClick={handleDeleteSelected}
            disabled={selectedScans.length === 0}
            className="btn-danger disabled:opacity-50"
          >
            <FaTrash className="mr-2" />
            Delete Selected
          </button>
          <button className="btn-outline">
            <FaChartBar className="mr-2" />
            Export All
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Scans</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.clean}</div>
          <div className="text-sm text-gray-600">Clean Files</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.infected}</div>
          <div className="text-sm text-gray-600">Threats Found</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {((stats.clean / stats.total) * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">Clean Rate</div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Files
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by filename or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status Filter
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Statuses</option>
              <option value="clean">Clean</option>
              <option value="infected">Infected</option>
              <option value="suspicious">Suspicious</option>
            </select>
          </div>
        </div>
      </div>

      {/* Scan History Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedScans.length === filteredScans.length && filteredScans.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scan Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredScans.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <FaSearch className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">No scan records found</p>
                      <p className="text-sm mt-2">Try adjusting your filters or upload new files to scan</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredScans.map((scan) => (
                  <tr key={scan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedScans.includes(scan.id)}
                        onChange={() => handleSelectScan(scan.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          {getStatusIcon(scan.status)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {scan.fileName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {scan.size} • {scan.fileType}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusBadge(scan.status)}
                        {scan.threats > 0 && (
                          <span className="ml-2 text-sm text-gray-500">
                            ({scan.threats} threat{scan.threats !== 1 ? 's' : ''})
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{scan.scanType}</div>
                      <div className="text-sm text-gray-500">Duration: {scan.duration}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(scan.timestamp).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(scan.timestamp).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleRescan(scan.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Rescan"
                        >
                          <FaRedo />
                        </button>
                        <button
                          onClick={() => downloadReport(scan)}
                          className="text-green-600 hover:text-green-900"
                          title="Download Report"
                        >
                          <FaDownload />
                        </button>
                        <button
                          onClick={() => console.log('View details:', scan.id)}
                          className="text-gray-600 hover:text-gray-900"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredScans.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{' '}
                <span className="font-medium">{filteredScans.length}</span> of{' '}
                <span className="font-medium">{filteredScans.length}</span> results
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-3 py-1 bg-blue-600 text-white border border-blue-600 rounded-md text-sm">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                  2
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-bold text-gray-900 mb-4">History Management</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <span>Clear scan history older than 30 days</span>
                <FaTrash className="text-gray-400" />
              </div>
            </button>
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <span>Export all scan data as CSV</span>
                <FaDownload className="text-gray-400" />
              </div>
            </button>
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <span>View scan statistics report</span>
                <FaChartBar className="text-gray-400" />
              </div>
            </button>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-bold text-gray-900 mb-4">Most Scanned File Types</h3>
          <div className="space-y-4">
            {['executable', 'document', 'archive', 'image', 'script'].map((type, index) => {
              const count = scans.filter(s => s.fileType === type).length;
              const percentage = (count / scans.length) * 100;
              return (
                <div key={type}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{type}</span>
                    <span>{count} files ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;