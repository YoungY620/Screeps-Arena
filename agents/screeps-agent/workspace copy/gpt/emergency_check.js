#!/usr/bin/env node

// EMERGENCY PvP STATUS CHECK
const net = require('net');

console.log('🚨 EMERGENCY PvP STATUS CHECK 🚨');
console.log('⚡ Connecting to CLI...');

const client = new net.Socket();

client.connect(21026, 'localhost', () => {
    console.log('✅ Connected to CLI');
});

client.on('data', (data) => {
    const response = data.toString();
    
    if (response.includes('> ')) {
        console.log('🔑 Getting auth and status...');
        
        // Get user auth
        client.write('storage.db.users.findOne({username: "gpt"}).then(user => console.log("AUTH:", user._id, user.cpu, user.gcl))\n');
        
        setTimeout(() => {
            client.write('storage.env.get("gameTime").then(t => console.log("TICK:", t))\n');
        }, 1000);
        
        setTimeout(() => {
            client.write('storage.db["rooms.objects"].find({user: "gpt", type: "spawn"}).then(s => console.log("SPAWNS:", s.length))\n');
        }, 2000);
        
        setTimeout(() => {
            client.write('storage.db["rooms.objects"].find({user: "gpt", type: "creep"}).then(c => console.log("FORCES:", c.length))\n');
        }, 3000);
        
        setTimeout(() => {
            client.write('storage.db["rooms.objects"].find({type: "creep", user: {$ne: "gpt"}}).then(e => console.log("ENEMIES:", e.length))\n');
        }, 4000);
        
        setTimeout(() => {
            client.end();
        }, 6000);
    }
});

client.on('end', () => {
    console.log('✅ Check complete');
});

client.on('error', (err) => {
    console.error('❌ Connection failed:', err.message);
});

setTimeout(() => client.end(), 10000);