const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function run() {
  const filePath = './test_files/infected.txt';
  if (!fs.existsSync(filePath)) {
    console.error('Test file not found:', filePath);
    process.exit(1);
  }

  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));

  try {
    const res = await axios.post('http://127.0.0.1:3000/api/scan', form, {
      headers: form.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 5000,
    });

    console.log('Scan response:', res.data);

    if (res.data && res.data.status === 'infected') {
      console.log('Requesting clean for scan id', res.data.id);
      const cleanResp = await axios.post('http://127.0.0.1:3000/api/clean', { id: res.data.id, replacement: '[CLEANED]' }, { timeout: 10000 });
      console.log('Clean response:', cleanResp.data);
      if (cleanResp.data && cleanResp.data.downloadUrl) {
        const dl = await axios.get(`http://127.0.0.1:3000${cleanResp.data.downloadUrl}`, { responseType: 'arraybuffer' });
        const content = Buffer.from(dl.data).toString('utf8');
        console.log('Downloaded cleaned file length:', content.length);
        if (content.includes('MALWARE_SIG_001')) {
          console.error('Clean failed: pattern still present');
          process.exit(3);
        } else {
          console.log('Clean successful: pattern removed');
        }
      }
    }

    const hist = await axios.get('http://127.0.0.1:3000/api/history');
    console.log('History length:', hist.data.scans.length);
    process.exit(0);
  } catch (err) {
    if (err.response) {
      console.error('Server responded with error:', err.response.status, err.response.data);
    } else {
      console.error('Request failed:', err.message);
    }
    process.exit(2);
  }
}

run();
