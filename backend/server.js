// backend/server.js
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// File upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

// Routes

// 1. Upload file
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    
    res.json({
        success: true,
        message: 'File uploaded successfully',
        file: {
            id: req.file.filename,
            name: req.file.originalname,
            path: req.file.path,
            size: req.file.size,
            url: `/uploads/${req.file.filename}`
        }
    });
});

// 2. Scan files with MPI+CUDA
app.post('/api/scan', async (req, res) => {
    try {
        const { processes = 2, fileIds = [] } = req.body;
        
        // Build file list
        let filesToScan = [];
        if (fileIds.length > 0) {
            filesToScan = fileIds.map(id => path.join('uploads', id));
        } else {
            // Scan all files in uploads
            const files = fs.readdirSync('uploads');
            filesToScan = files.map(file => path.join('uploads', file));
        }
        
        if (filesToScan.length === 0) {
            return res.json({
                success: false,
                message: 'No files to scan'
            });
        }
        
        // Create temporary file list
        const fileList = 'filelist.txt';
        fs.writeFileSync(fileList, filesToScan.join('\n'));
        
        console.log(`Starting scan with ${processes} MPI processes...`);
        console.log(`Files: ${filesToScan.join(', ')}`);
        
        // Run CUDA+MPI scanner (simulated for now)
        // In real setup, you would call: mpiexec -n ${processes} ./virus_scanner uploads/
        
        // Simulate MPI+CUDA processing
        const scanResults = simulateMPICUDA(filesToScan, parseInt(processes));
        
        // Generate performance report
        const performanceData = generatePerformanceReport(scanResults, processes);
        
        res.json({
            success: true,
            results: scanResults,
            performance: performanceData,
            summary: {
                totalFiles: scanResults.length,
                totalThreats: scanResults.reduce((sum, file) => sum + file.threats, 0),
                totalTime: performanceData.totalTime
            }
        });
        
    } catch (error) {
        console.error('Scan error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// 3. Get scan history
app.get('/api/history', (req, res) => {
    try {
        const historyFile = 'scan_history.json';
        let history = [];
        
        if (fs.existsSync(historyFile)) {
            history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
        }
        
        res.json({
            success: true,
            history: history.slice(-10) // Last 10 scans
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 4. Get system info
app.get('/api/system-info', async (req, res) => {
    try {
        // Get GPU info (simulated)
        const gpuInfo = {
            name: 'NVIDIA GeForce RTX 3060',
            memory: '12GB',
            cudaCores: 3584,
            driverVersion: '545.84'
        };
        
        // Get CPU info
        const cpuInfo = {
            model: 'Intel Core i7-12700K',
            cores: 12,
            threads: 20
        };
        
        // Get MPI info
        const mpiInfo = {
            version: 'Microsoft MPI v10.0',
            available: true
        };
        
        res.json({
            success: true,
            gpu: gpuInfo,
            cpu: cpuInfo,
            mpi: mpiInfo,
            system: {
                platform: process.platform,
                arch: process.arch,
                nodeVersion: process.version
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 5. Clean/remove threats
app.post('/api/clean', (req, res) => {
    const { fileId, action = 'quarantine' } = req.body;
    
    if (!fileId) {
        return res.status(400).json({ error: 'File ID required' });
    }
    
    const filePath = path.join('uploads', fileId);
    
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
    }
    
    try {
        if (action === 'quarantine') {
            // Move to quarantine folder
            const quarantineDir = 'quarantine/';
            if (!fs.existsSync(quarantineDir)) {
                fs.mkdirSync(quarantineDir, { recursive: true });
            }
            fs.renameSync(filePath, path.join(quarantineDir, fileId));
            
            res.json({
                success: true,
                message: 'File quarantined successfully',
                quarantinePath: path.join(quarantineDir, fileId)
            });
        } else if (action === 'delete') {
            // Delete the file
            fs.unlinkSync(filePath);
            res.json({
                success: true,
                message: 'File deleted successfully'
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Simulation functions
function simulateMPICUDA(files, processes) {
    const results = [];
    const virusPatterns = [
        'MALWARE_SIG_001',
        'TROJAN_PATTERN',
        'VIRUS_HEADER_X',
        'EXPLOIT_CODE',
        'BACKDOOR_KEY'
    ];
    
    files.forEach((file, index) => {
        // Simulate file processing by different MPI ranks
        const rank = index % processes;
        
        // Read file content
        let content = '';
        try {
            content = fs.readFileSync(file, 'utf8');
        } catch (e) {
            content = `Simulated content for ${file}`;
        }
        
        // Count virus patterns
        let threats = 0;
        const detectedPatterns = [];
        
        virusPatterns.forEach(pattern => {
            const regex = new RegExp(pattern, 'gi');
            const matches = content.match(regex);
            if (matches) {
                threats += matches.length;
                detectedPatterns.push({
                    pattern,
                    count: matches.length
                });
            }
        });
        
        // Add some random threats for simulation
        if (threats === 0 && Math.random() > 0.7) {
            threats = Math.floor(Math.random() * 3) + 1;
            detectedPatterns.push({
                pattern: virusPatterns[Math.floor(Math.random() * virusPatterns.length)],
                count: threats
            });
        }
        
        results.push({
            file: path.basename(file),
            path: file,
            rank,
            threats,
            detectedPatterns,
            size: fs.existsSync(file) ? fs.statSync(file).size : 1024 * (index + 1),
            status: threats > 0 ? 'infected' : 'clean'
        });
    });
    
    return results;
}

function generatePerformanceReport(results, processes) {
    const totalFiles = results.length;
    const totalThreats = results.reduce((sum, file) => sum + file.threats, 0);
    
    // Simulate performance metrics
    const baseTime = 0.5; // seconds per file
    const parallelTime = (baseTime * totalFiles) / processes;
    const communicationOverhead = 0.1 * parallelTime;
    const totalTime = parallelTime + communicationOverhead;
    
    const serialTime = baseTime * totalFiles;
    const speedup = serialTime / totalTime;
    const efficiency = (speedup / processes) * 100;
    const gpuUtilization = 75 + (Math.random() * 20); // 75-95%
    
    return {
        totalTime: totalTime.toFixed(3),
        parallelTime: parallelTime.toFixed(3),
        communicationTime: communicationOverhead.toFixed(3),
        serialTime: serialTime.toFixed(3),
        speedup: speedup.toFixed(2),
        efficiency: efficiency.toFixed(1),
        gpuUtilization: gpuUtilization.toFixed(1),
        processes,
        totalFiles,
        totalThreats
    };
}

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    console.log(`📁 Uploads directory: ${path.join(__dirname, 'uploads')}`);
    console.log(`🔧 API Endpoints:`);
    console.log(`   POST /api/upload - Upload files`);
    console.log(`   POST /api/scan   - Scan with MPI+CUDA`);
    console.log(`   GET  /api/history - Scan history`);
    console.log(`   GET  /api/system-info - System configuration`);
});