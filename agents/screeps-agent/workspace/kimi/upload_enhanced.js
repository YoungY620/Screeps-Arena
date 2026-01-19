const fs = require('fs');
const http = require('http');

const TOKEN = 'c7e64acf19e76fbb71e41124d2052429fe6e3af5';
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
        console.log('Code uploaded successfully!');
    });
});

req.on('error', (e) => {
    console.error('Upload error:', e);
});

req.write(data);
req.end();