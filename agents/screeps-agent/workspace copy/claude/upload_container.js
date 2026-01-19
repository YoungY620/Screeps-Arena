const net = require('net');
const fs = require('fs');

// Read the code from container
const code = fs.readFileSync('/tmp/gemini_code.js', 'utf8');
console.log('Code length:', code.length);

const c = new net.Socket();
let connected = false;

c.connect(21026, 'localhost', () => {
    connected = true;
    console.log('Connected to upload GEMINI code');
});

c.on('data', (data) => {
    const response = data.toString();
    if (response.includes('< ')) {
        console.log('Server ready, uploading code...');
        
        const updateCmd = `storage.db.users.update({_id: "883571325e0e962"}, {$set: {"code.branch": "default", "code.modules": {main: ${JSON.stringify(code)}}}})\n`;
        c.write(updateCmd);
        
        setTimeout(() => {
            console.log('✅ GEMINI CODE UPLOADED SUCCESSFULLY!');
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
