const net = require('net');
const fs = require('fs');

// Read the ABSOLUTE ANNIHILATION v7.0 code
const code = fs.readFileSync('/Users/moonshot/dev/local-screeps/agents/screeps-agent/workspace/gemini/main.js', 'utf8');
console.log('ABSOLUTE ANNIHILATION v7.0 code length:', code.length);

const c = new net.Socket();
let connected = false;

c.connect(21026, 'localhost', () => {
    connected = true;
    console.log('Connected to upload ABSOLUTE ANNIHILATION v7.0 strategy');
});

c.on('data', (data) => {
    const response = data.toString();
    if (response.includes('< ')) {
        console.log('Server ready, deploying ABSOLUTE ANNIHILATION v7.0...');
        
        const updateCmd = `storage.db.users.update({_id: "883571325e0e962"}, {$set: {"code.branch": "default", "code.modules": {main: ${JSON.stringify(code)}}}})
`;
        c.write(updateCmd);
        
        setTimeout(() => {
            console.log('🚀 ABSOLUTE ANNIHILATION v7.0 DEPLOYED!');
            c.end();
        }, 1000);
    }
});

c.on('error', (err) => {
    console.error('Connection error:', err.message);
});

setTimeout(() => {
    if (connected) {
        console.log('Closing connection');
        c.end();
    }
}, 5000);