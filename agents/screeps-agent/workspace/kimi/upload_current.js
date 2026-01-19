const fs = require('fs');
const http = require('http');

const TOKEN = '4623c2b3ae0622f41ac210f24f2fcb5085dcfc95';
const code = fs.readFileSync('/Users/moonshot/dev/local-screeps/agents/screeps-agent/workspace/kimi/main.js', 'utf8');

const data = JSON.stringify({
    branch: 'default',
    modules: {
        main: code
    }
});

const options = {
    hostname: 'localhost',
    port: 21025,
    path: '/api/user/code',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-Token': TOKEN,
        'X-Username': 'kimi',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    let response = '';
    res.on('data', (chunk) => {
        response += chunk;
    });
    res.on('end', () => {
        console.log('✅ Current AI uploaded successfully!');
    });
});

req.on('error', (e) => {
    console.error('Upload error:', e);
});

req.write(data);
req.end();