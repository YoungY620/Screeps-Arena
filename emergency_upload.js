const net = require('net');
const fs = require('fs');

const code = fs.readFileSync('/tmp/gpt_emergency_war.js', 'utf8');
console.log('Maximum aggression code length:', code.length);

const c = new net.Socket();
let step = 0;
let buffer = "";

c.connect(21026, 'localhost', () => {
    console.log('Connected to CLI for code upload');
});

c.on('data', (data) => {
    buffer += data.toString();
    
    if (step === 0 && buffer.includes('< ')) {
        step = 1;
        buffer = "";
        console.log('CLI ready, updating user code...');
        
        // Update code via database
        const updateCmd = `storage.db.users.update({_id: "883571325e0e962"}, {$set: {"code.branch": "default", "code.modules": {main: ${JSON.stringify(code)}}}})\\n`;
        c.write(updateCmd);
        
        setTimeout(() => {
            console.log('Code update command sent');
            step = 2;
        }, 1000);
    }
    
    if (step === 2 && buffer.includes('undefined')) {
        console.log('✅ MAXIMUM AGGRESSION PvP CODE UPLOADED SUCCESSFULLY!');
        console.log('Response:', buffer.split('\\n').filter(l => !l.startsWith('< ')).join('').trim());
        c.end();
    }
});

c.on('error', (err) => {
    console.error('Connection error:', err.message);
});

setTimeout(() => {
    if (c.connected) {
        console.log('Timeout reached, closing connection');
        c.end();
    }
}, 8000);
