const fs = require('fs');
const net = require('net');

const code = fs.readFileSync('/Users/moonshot/dev/local-screeps/agents/screeps-agent/workspace/gemini/main.js', 'utf8');
console.log('Code length:', code.length);

const c = new net.Socket();
let out = "", ready = false;
c.connect(21026, "localhost");

c.on('data', d => {
    out += d;
    if (!ready && out.includes("< ")) { 
        ready = true; 
        out = ""; 
        console.log('Connected to server, checking user...');
        c.write('storage.db.users.findOne({username: "gemini"}).then(u=>print(u?JSON.stringify(u):"NO_USER"))\n'); 
    }
    if (ready && out.includes("\n< ")) { 
        console.log('Response:', out.split("\n").filter(l=>!l.startsWith("< ")).join("\n")); 
        
        // Now try to set the code
        setTimeout(() => {
            const codeCmd = `storage.db.users.update({username: "gemini"}, {$set: {"code.branch": "default", "code.modules": {main: ${JSON.stringify(code)}}}).then(()=>print("CODE_UPDATED"))\n`;
            c.write(codeCmd);
        }, 1000);
        
        setTimeout(() => {
            c.destroy();
            process.exit(0);
        }, 3000);
    }
});

c.on('error', err => {
    console.error('Connection error:', err);
    process.exit(1);
});

setTimeout(() => {
    console.log('Timeout reached');
    c.destroy();
    process.exit(0);
}, 5000);
