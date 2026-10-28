// frontend/src/services/api.js
const API_BASE = 'http://localhost:5000/api';

export const api = {
    // Upload file
    async uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(`${API_BASE}/upload`, {
            method: 'POST',
            body: formData
        });
        return response.json();
    },
    
    // Scan files
    async scanFiles(processes = 2, fileIds = []) {
        const response = await fetch(`${API_BASE}/scan`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ processes, fileIds })
        });
        return response.json();
    },
    
    // Get history
    async getHistory() {
        const response = await fetch(`${API_BASE}/history`);
        return response.json();
    },
    
    // Get system info
    async getSystemInfo() {
        const response = await fetch(`${API_BASE}/system-info`);
        return response.json();
    },
    
    // Clean file
    async cleanFile(fileId, action = 'quarantine') {
        const response = await fetch(`${API_BASE}/clean`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fileId, action })
        });
        return response.json();
    }
};