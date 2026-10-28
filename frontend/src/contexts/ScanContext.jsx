import React, { createContext, useState, useContext, useCallback } from 'react';
import { toast } from 'react-hot-toast';

// Create context
const ScanContext = createContext(null);

// Custom hook to use scan context
export const useScan = () => {
  const context = useContext(ScanContext);
  if (!context) {
    throw new Error('useScan must be used within a ScanProvider');
  }
  return context;
};

// Mock virus patterns for demo
const VIRUS_PATTERNS = [
  { id: 'v1', name: 'Trojan.Win32', pattern: 'trojan', severity: 'high' },
  { id: 'v2', name: 'Worm.VBS', pattern: 'worm', severity: 'high' },
  { id: 'v3', name: 'Adware.Generic', pattern: 'adware', severity: 'medium' },
  { id: 'v4', name: 'Ransomware.Crypto', pattern: 'ransom', severity: 'critical' },
  { id: 'v5', name: 'Spyware.Keylogger', pattern: 'keylog', severity: 'high' },
  { id: 'v6', name: 'PUA.Downloader', pattern: 'downloader', severity: 'low' },
  { id: 'v7', name: 'Backdoor.Shell', pattern: 'shell', severity: 'critical' },
  { id: 'v8', name: 'Malware.Packed', pattern: 'packed', severity: 'medium' },
];

export const ScanProvider = ({ children }) => {
  const [scans, setScans] = useState([]);
  const [currentScan, setCurrentScan] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [gpuStatus, setGpuStatus] = useState({
    enabled: true,
    utilization: 0,
    temperature: 45,
    memory: 2048,
    cores: 512
  });

  // Mock scan history from localStorage
  const loadScansFromStorage = useCallback(() => {
    try {
      const savedScans = localStorage.getItem('cuda_scanner_history');
      if (savedScans) {
        setScans(JSON.parse(savedScans));
      }
    } catch (error) {
      console.error('Failed to load scan history:', error);
    }
  }, []);

  // Save scans to localStorage
  const saveScansToStorage = useCallback((updatedScans) => {
    try {
      localStorage.setItem('cuda_scanner_history', JSON.stringify(updatedScans));
    } catch (error) {
      console.error('Failed to save scan history:', error);
    }
  }, []);

  // Initialize with saved scans
  React.useEffect(() => {
    loadScansFromStorage();
  }, [loadScansFromStorage]);

  // Mock CUDA GPU scanning function
  const simulateCudaScan = async (file, scanType = 'quick') => {
    return new Promise((resolve) => {
      const fileSize = file.size;
      const scanTime = scanType === 'quick' ? 500 : scanType === 'deep' ? 2000 : 1000;
      
      // Simulate GPU processing
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          clearInterval(interval);
          
          // Generate random threats (20% chance)
          const hasThreats = Math.random() < 0.2;
          const threats = hasThreats ? 
            VIRUS_PATTERNS
              .filter(() => Math.random() < 0.3)
              .map(pattern => ({
                ...pattern,
                count: Math.floor(Math.random() * 3) + 1
              })) : [];
          
          const scanResult = {
            id: `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            fileName: file.name,
            fileSize: (fileSize / (1024 * 1024)).toFixed(2) + ' MB',
            fileType: file.type || file.name.split('.').pop().toUpperCase(),
            status: threats.length > 0 ? 'infected' : 'clean',
            threatsDetected: threats.length,
            threats,
            scanType,
            scanTime: (scanTime / 1000).toFixed(2) + 's',
            timestamp: new Date().toISOString(),
            gpuAccelerated: true,
            gpuUtilization: Math.floor(Math.random() * 30) + 70,
            scanLog: [
              `Initializing CUDA scan for: ${file.name}`,
              `File size: ${(fileSize / (1024 * 1024)).toFixed(2)} MB`,
              `Scan type: ${scanType}`,
              `GPU cores engaged: ${gpuStatus.cores}`,
              threats.length > 0 
                ? `Detected ${threats.length} threat(s)` 
                : 'No threats detected',
              `Scan completed in ${(scanTime / 1000).toFixed(2)} seconds`
            ].join('\n')
          };
          
          resolve(scanResult);
        }
        setScanProgress(Math.min(progress, 100));
      }, scanTime / 10);
    });
  };

  // Scan single file
  const scanFile = async (file, scanType = 'quick') => {
    if (!file) {
      toast.error('No file selected');
      return null;
    }

    setIsScanning(true);
    setScanProgress(0);
    
    try {
      toast.loading(`Starting ${scanType} scan...`, { id: 'scan-start' });
      
      // Update GPU status
      setGpuStatus(prev => ({
        ...prev,
        utilization: Math.floor(Math.random() * 30) + 70,
        temperature: prev.temperature + Math.floor(Math.random() * 5)
      }));

      // Simulate scan
      const result = await simulateCudaScan(file, scanType);
      
      // Add to history
      const updatedScans = [result, ...scans.slice(0, 49)]; // Keep last 50 scans
      setScans(updatedScans);
      saveScansToStorage(updatedScans);
      
      setCurrentScan(result);
      
      // Show result toast
      if (result.status === 'infected') {
        toast.error(`Found ${result.threatsDetected} threat(s)!`, { id: 'scan-start' });
      } else {
        toast.success('File is clean!', { id: 'scan-start' });
      }
      
      return result;
    } catch (error) {
      toast.error('Scan failed: ' + error.message, { id: 'scan-start' });
      console.error('Scan error:', error);
      return null;
    } finally {
      setIsScanning(false);
      setScanProgress(100);
      
      // Reset GPU status after delay
      setTimeout(() => {
        setGpuStatus(prev => ({
          ...prev,
          utilization: 0,
          temperature: 45
        }));
      }, 2000);
    }
  };

  // Scan multiple files
  const scanMultipleFiles = async (files, scanType = 'quick') => {
    if (!files || files.length === 0) {
      toast.error('No files selected');
      return [];
    }

    setIsScanning(true);
    setScanProgress(0);
    
    const results = [];
    const totalFiles = files.length;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setScanProgress((i / totalFiles) * 100);
      
      try {
        const result = await scanFile(file, scanType);
        if (result) {
          results.push(result);
        }
      } catch (error) {
        console.error(`Failed to scan ${file.name}:`, error);
      }
    }
    
    setIsScanning(false);
    setScanProgress(100);
    
    const infectedFiles = results.filter(r => r.status === 'infected').length;
    if (infectedFiles > 0) {
      toast.error(`Scan complete. Found threats in ${infectedFiles} file(s)`);
    } else {
      toast.success(`Scan complete. All ${totalFiles} files are clean!`);
    }
    
    return results;
  };

  // Get scan by ID
  const getScanById = (scanId) => {
    return scans.find(scan => scan.id === scanId);
  };

  // Delete scan by ID
  const deleteScan = (scanId) => {
    const updatedScans = scans.filter(scan => scan.id !== scanId);
    setScans(updatedScans);
    saveScansToStorage(updatedScans);
    toast.success('Scan deleted');
  };

  // Clear all scans
  const clearAllScans = () => {
    setScans([]);
    localStorage.removeItem('cuda_scanner_history');
    toast.success('All scan history cleared');
  };

  // Get scan statistics
  const getScanStats = () => {
    const totalScans = scans.length;
    const cleanScans = scans.filter(s => s.status === 'clean').length;
    const infectedScans = scans.filter(s => s.status === 'infected').length;
    const totalThreats = scans.reduce((sum, scan) => sum + scan.threatsDetected, 0);
    
    // Calculate average scan time
    const avgScanTime = scans.length > 0
      ? scans.reduce((sum, scan) => sum + parseFloat(scan.scanTime), 0) / scans.length
      : 0;
    
    // Get most common threat types
    const threatCounts = {};
    scans.forEach(scan => {
      scan.threats?.forEach(threat => {
        threatCounts[threat.name] = (threatCounts[threat.name] || 0) + 1;
      });
    });
    
    const commonThreats = Object.entries(threatCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
    
    return {
      totalScans,
      cleanScans,
      infectedScans,
      totalThreats,
      avgScanTime: avgScanTime.toFixed(2),
      commonThreats,
      cleanPercentage: totalScans > 0 ? ((cleanScans / totalScans) * 100).toFixed(1) : '0.0'
    };
  };

  // Get recent scans
  const getRecentScans = (limit = 10) => {
    return scans.slice(0, limit);
  };

  // Get scans by date range
  const getScansByDateRange = (startDate, endDate) => {
    return scans.filter(scan => {
      const scanDate = new Date(scan.timestamp);
      return scanDate >= startDate && scanDate <= endDate;
    });
  };

  // Get threat timeline data
  const getThreatTimeline = (days = 7) => {
    const timeline = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayScans = scans.filter(scan => 
        scan.timestamp.startsWith(dateStr)
      );
      
      const threats = dayScans.reduce((sum, scan) => sum + scan.threatsDetected, 0);
      
      timeline.push({
        date: dateStr,
        scans: dayScans.length,
        threats,
        infected: dayScans.filter(s => s.status === 'infected').length
      });
    }
    
    return timeline;
  };

  // Toggle GPU acceleration
  const toggleGpuAcceleration = (enabled) => {
    setGpuStatus(prev => ({ ...prev, enabled }));
    toast.info(`GPU acceleration ${enabled ? 'enabled' : 'disabled'}`);
  };

  // Export scan data
  const exportScanData = (format = 'json') => {
    const data = {
      exportDate: new Date().toISOString(),
      totalScans: scans.length,
      scans: scans
    };
    
    let blob;
    let filename;
    
    if (format === 'json') {
      blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      filename = `cuda-scanner-export-${new Date().toISOString().split('T')[0]}.json`;
    } else if (format === 'csv') {
      // Convert to CSV
      const headers = ['Date', 'Filename', 'Status', 'Threats', 'Scan Type', 'Scan Time'];
      const rows = scans.map(scan => [
        scan.timestamp,
        scan.fileName,
        scan.status,
        scan.threatsDetected,
        scan.scanType,
        scan.scanTime
      ]);
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');
      
      blob = new Blob([csvContent], { type: 'text/csv' });
      filename = `cuda-scanner-export-${new Date().toISOString().split('T')[0]}.csv`;
    }
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`Scan data exported as ${format.toUpperCase()}`);
  };

  // Value to provide to consumers
  const value = {
    scans,
    currentScan,
    scanProgress,
    isScanning,
    gpuStatus,
    scanFile,
    scanMultipleFiles,
    getScanById,
    deleteScan,
    clearAllScans,
    getScanStats,
    getRecentScans,
    getScansByDateRange,
    getThreatTimeline,
    toggleGpuAcceleration,
    exportScanData
  };

  return (
    <ScanContext.Provider value={value}>
      {children}
    </ScanContext.Provider>
  );
};