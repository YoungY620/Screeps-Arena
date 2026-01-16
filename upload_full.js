const net = require('net');
const fs = require('fs');

// Read the full PvP code
const code = fs.readFileSync('/Users/moonshot/dev/local-screeps/agents/screeps-agent/workspace/gemini/main.js', 'utf8');
console.log('Full code length:', code.length);

const c = new net.Socket();
let connected = false;

c.connect(21026, 'localhost', () => {
    connected = true;
    console.log('Connected to upload full PvP code');
});

c.on('data', (data) => {
    const response = data.toString();
    console.log('Server:', response.substring(0, 50));
    
    if (response.includes('< ')) {
        console.log('Server ready, updating with full PvP strategy...');
        
        // Update user code
        const updateCmd = `storage.db.users.update({_id: "883571325e0e962"}, {$set: {"code.branch": "default", "code.modules": {main: ${JSON.stringify(code)}}}})\n`;
        c.write(updateCmd);
        
        setTimeout(() => {
            console.log('Full PvP code update sent!');
            c.end();
        }, 2000);
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
}, 8000);
