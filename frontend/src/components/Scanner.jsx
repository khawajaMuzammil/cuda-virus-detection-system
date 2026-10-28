// frontend/src/components/Scanner.jsx
import React, { useState } from 'react';
import { FaUpload, FaCloudUploadAlt } from 'react-icons/fa';

const Scanner = ({ onScanComplete }) => {
  const [file, setFile] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setResult(null);
  };

  const handleScan = async () => {
    if (!file) return;
    
    setScanning(true);
    
    // Simulate scanning
    setTimeout(() => {
      const isThreat = Math.random() > 0.8;
      const scanResult = {
        fileName: file.name,
        fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        isThreat,
        threats: isThreat ? ['Trojan.Generic', 'Malware.Heuristic'] : [],
        scanTime: '0.23s',
        timestamp: new Date().toLocaleTimeString()
      };
      
      setResult(scanResult);
      setScanning(false);
      
      if (onScanComplete) {
        onScanComplete(scanResult);
      }
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors">
        <FaCloudUploadAlt className="mx-auto text-4xl text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-700 mb-2">Drop files here or click to upload</p>
        <p className="text-sm text-gray-500 mb-6">Supports .exe, .dll, .pdf, .doc, .zip up to 100MB</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <label className="btn-primary cursor-pointer px-6 py-3 rounded-lg">
            <FaUpload className="inline mr-2" />
            Choose File
            <input 
              type="file" 
              className="hidden" 
              onChange={handleFileChange}
              multiple
            />
          </label>
          <button 
            onClick={handleScan}
            disabled={!file || scanning}
            className={`px-6 py-3 rounded-lg font-medium ${
              !file || scanning
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'btn-primary'
            }`}
          >
            {scanning ? 'Scanning...' : 'Start Scan'}
          </button>
        </div>
        
        {file && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg inline-block">
            <p className="text-blue-800">
              📎 Selected: <span className="font-semibold">{file.name}</span>
            </p>
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className={`p-6 rounded-xl ${
          result.isThreat ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">
              {result.isThreat ? '⚠️ Threat Detected!' : '✅ File is Clean'}
            </h3>
            <span className="text-sm text-gray-500">Scanned: {result.timestamp}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">File Name</p>
              <p className="font-medium">{result.fileName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Scan Time</p>
              <p className="font-medium">{result.scanTime}</p>
            </div>
          </div>
          
          {result.isThreat && result.threats.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-2">Detected Threats:</p>
              <ul className="space-y-1">
                {result.threats.map((threat, index) => (
                  <li key={index} className="text-red-700 font-medium">• {threat}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Progress Bar */}
      {scanning && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Scanning file...</span>
            <span>50%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"
              style={{ width: '50%' }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scanner;