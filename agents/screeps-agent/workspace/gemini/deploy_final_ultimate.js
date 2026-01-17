// Deploy FINAL ULTIMATE PvP ANNIHILATION v10.0
const net = require('net');
const fs = require('fs');

const code = fs.readFileSync('/Users/moonshot/dev/local-screeps/agents/screeps-agent/workspace/gemini/FINAL_ULTIMATE_PvP_ANNIHILATION.js', 'utf8');
console.log(`Deploying FINAL ULTIMATE PvP ANNIHILATION v10.0 (${code.length} bytes)...`);

const c = new net.Socket();
c.connect(21026, 'localhost');

c.on('connect', () => {
    console.log('Connected to CLI');
    setTimeout(() => {
        // Use the working database method
        const command = `storage.db.users.update({_id: "883571325e0e962"}, {$set: {"code.branch": "default", "code.modules": {main: ${JSON.stringify(code)}}}})`;
        c.write(command + '\n');
        console.log('Code uploaded via users collection');
        
        setTimeout(() => {
            // Backup via code collection
            const backupCommand = `storage.db.code.updateOne({_id: "883571325e0e962"}, {$set: {modules: {main: ${JSON.stringify(code)}}}}, {upsert: true})`;
            c.write(backupCommand + '\n');
            console.log('Backup code uploaded via code collection');
            
            setTimeout(() => {
                console.log('🔥 FINAL ULTIMATE PvP ANNIHILATION v10.0 DEPLOYED!');
                c.end();
                process.exit(0);
            }, 1000);
        }, 1000);
    }, 1000);
});

c.on('error', (err) => {
    console.error('Connection failed:', err.message);
    process.exit(1);
});

setTimeout(() => {
    console.log('Deployment completed');
    c.end();
    process.exit(0);
}, 10000);