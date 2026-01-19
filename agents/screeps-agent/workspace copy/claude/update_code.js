const fs = require('fs');
const net = require('net');

const code = fs.readFileSync('/Users/moonshot/dev/local-screeps/agents/screeps-agent/workspace/gemini/main.js', 'utf8');
console.log('Code length:', code.length);

const c = new net.Socket();
let step = 0;
let buffer = '';

c.connect(21026, 'localhost', () => {
    console.log('Connected to Screeps server');
});

c.on('data', (data) => {
    buffer += data.toString();
    console.log('Server response:', buffer);
    
    if (step === 0 && buffer.includes('< ')) {
        step = 1;
        buffer = '';
        console.log('Finding gemini user...');
        c.write('storage.db.users.findOne({username: "gemini"}).then(u => print(u ? "FOUND:" + u._id : "NOT_FOUND"))\n');
    }
    
    if (step === 1 && buffer.includes('FOUND:')) {
        step = 2;
        const userId = buffer.split('FOUND:')[1].split('\n')[0].trim();
        console.log('Found user ID:', userId);
        buffer = '';
        
        console.log('Updating code...');
        const updateCmd = `storage.db.users.update({_id: "${userId}"}, {$set: {"code.branch": "default", "code.modules": {main: ${JSON.stringify(code)}}})\n`;
        c.write(updateCmd);
    }
    
    if (step === 1 && buffer.includes('NOT_FOUND')) {
        console.log('User not found, creating...');
        step = 3;
        buffer = '';
        
        const createCmd = `storage.db.users.insert({username: "gemini", email: "gemini@test.com", password: "password", code: {branch: "default", modules: {main: ${JSON.stringify(code)}}})\n`;
        c.write(createCmd);
    }
});

c.on('error', (err) => {
    console.error('Error:', err);
});

setTimeout(() => {
    console.log('Finished attempt');
    c.end();
}, 5000);
