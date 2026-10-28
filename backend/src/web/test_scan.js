const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const { spawn } = require('child_process');

function waitForServer(proc, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      proc.kill();
      reject(new Error('Server startup timeout'));
    }, timeout);

    proc.stdout.on('data', (chunk) => {
      const s = chunk.toString();
      if (s.includes('Server running')) {
        clearTimeout(timer);
        resolve();
      }
    });

    proc.stderr.on('data', (chunk) => {
      // forward errors for debugging
      console.error('[server stderr]', chunk.toString());
    });
  });
}

async function run() {
  const filePath = './test_files/infected.txt';
  if (!fs.existsSync(filePath)) {
    console.error('Test file not found:', filePath);
    process.exit(1);
  }

  // Start server as child so tests don't depend on external process
  const path = require('path');
  const projectRoot = path.resolve(__dirname, '..');
  const proc = spawn('node', ['server.js'], { cwd: projectRoot, shell: true });
  // Wait for health endpoint instead of stdout parsing
  const healthUrl = 'http://127.0.0.1:3000/api/health';
  const start = Date.now();
  const timeout = 10000;
  while (Date.now() - start < timeout) {
    try {
      await axios.get(healthUrl, { timeout: 1000 });
      break;
    } catch (e) {
      // wait a bit
      await new Promise(r => setTimeout(r, 300));
    }
  }
  // final check
  try { await axios.get(healthUrl, { timeout: 1000 }); } catch (e) { console.error('Server health check failed'); proc.kill(); process.exit(2); }

  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));

  try {
    const res = await axios.post('http://127.0.0.1:3000/api/scan', form, {
      headers: form.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    console.log('Scan response:', res.data);
    // If infected, request cleaning and download cleaned file
    if (res.data && res.data.status === 'infected') {
      console.log('Requesting clean for scan id', res.data.id);
      const cleanResp = await axios.post('http://127.0.0.1:3000/api/clean', { id: res.data.id }, { timeout: 10000 });
      console.log('Clean response:', cleanResp.data);
      if (cleanResp.data && cleanResp.data.downloadUrl) {
        const dl = await axios.get(`http://127.0.0.1:3000${cleanResp.data.downloadUrl}`, { responseType: 'arraybuffer' });
        const content = Buffer.from(dl.data).toString('utf8');
        console.log('Downloaded cleaned file length:', content.length);
        if (content.includes('MALWARE_SIG_001')) {
          console.error('Clean failed: pattern still present');
          proc.kill();
          process.exit(3);
        } else {
          console.log('Clean successful: pattern removed');
        }
      }
    }

    const hist = await axios.get('http://127.0.0.1:3000/api/history');
    console.log('History:', hist.data);
  } catch (err) {
    if (err.response) {
      console.error('Server responded with error:', err.response.status, err.response.data);
    } else {
      console.error('Request failed:', err.message);
    }
    proc.kill();
    process.exit(2);
  }

  proc.kill();
}

run();
