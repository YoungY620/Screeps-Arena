const fs = require('fs');
const http = require('http');

const TOKEN = '21dc573f49a48ad2a8d8deef3a784f4b588defa1';
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
        console.log('Response:', response);
    });
});

req.on('error', (e) => {
    console.error('Error:', e);
});

req.write(data);
req.end();