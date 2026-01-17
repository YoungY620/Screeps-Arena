#!/usr/bin/env node

// EMERGENCY AUTH TOKEN AND STATUS CHECK
const net = require('net');

console.log('🚨 EMERGENCY PvP AUTH & STATUS CHECK 🚨');
console.log('⚡ Connecting to CLI port 21026...');

const client = new net.Socket();
let authToken = null;
let status = {};

client.connect(21026, 'localhost', () => {
    console.log('✅ Connected to CLI');
});

client.on('data', (data) => {
    const response = data.toString();
    console.log('📡 CLI Response:', response.substring(0, 100));
    
    if (response.includes('> ')) {
        // Get authentication info
        console.log('🔑 Getting auth credentials...');
        client.write('storage.db.users.findOne({username: "gpt"}).then(user => {
            console.log("=== AUTH TOKEN ===");
            console.log("User ID:", user._id);
            console.log("Username:", user.username);
            console.log("CPU:", user.cpu);
            console.log("GCL:", user.gcl);
            console.log("Status:", user.active ? "ACTIVE" : "INACTIVE");
        })\n');
        
        setTimeout(() => {
            // Get current game time
            console.log('🕐 Getting game time...');
            client.write('storage.env.get("gameTime").then(time => {
                console.log("=== GAME STATUS ===");
                console.log("Current Tick:", time);
                if (time >= 115264) {
                    console.log("⚡ PvP COMBAT PHASE ACTIVE!");
                }
            })\n');
            
            setTimeout(() => {
                // Get your military assets
                console.log('👾 Getting military assets...');
                client.write('Promise.all([
                    storage.db["rooms.objects"].find({user: "gpt", type: "spawn"}),
                    storage.db["rooms.objects"].find({user: "gpt", type: "creep"}),
                    storage.db["rooms.objects"].find({user: "gpt", type: "tower"}),
                    storage.db.rooms.find({"controller.user": "gpt"})
                ]).then(([spawns, creeps, towers, rooms]) => {
                    console.log("=== MILITARY ASSETS ===");
                    console.log("Spawns:", spawns.length);
                    console.log("Creeps:", creeps.length);
                    console.log("Towers:", towers.length);
                    console.log("Controlled Rooms:", rooms.map(r => r.name));
                    
                    if (spawns.length === 0) {
                        console.log("🚨 CRITICAL: NO SPAWNS AVAILABLE!");
                    }
                    if (creeps.length < 3) {
                        console.log("⚠️  WARNING: LOW MILITARY FORCES!");
                    }
                    if (rooms.length === 0) {
                        console.log("⚠️  WARNING: NO CONTROLLED ROOMS!");
                    }
                })\n');
                
                setTimeout(() => {
                    // Get enemy intelligence
                    console.log('⚠️  Scanning for enemies...');
                    client.write('storage.db["rooms.objects"].find({
                        type: "creep", 
                        user: {$ne: "gpt", $ne: "Source Keeper"}
                    }).then(enemies => {
                        console.log("=== ENEMY INTELLIGENCE ===");
                        console.log("Hostile Creeps:", enemies.length);
                        
                        if (enemies.length > 0) {
                            console.log("🚨 ENEMIES DETECTED - IMMEDIATE THREAT!");
                            const enemyRooms = [...new Set(enemies.map(e => e.room))];
                            console.log("Enemy Presence In Rooms:", enemyRooms);
                        } else {
                            console.log("✅ NO IMMEDIATE ENEMY CONTACT");
                        }
                    })\n');
                    
                    setTimeout(() => {
                        client.end();
                    }, 3000);
                }, 3000);
            }, 2000);
        }, 2000);
    }
});

client.on('end', () => {
    console.log('✅ Emergency check complete');
});

client.on('error', (err) => {
    console.error('❌ CLI Connection failed:', err.message);
    console.log('🔄 Trying alternative connection...');
});

setTimeout(() => {
    if (client.readyState !== 'closed') {
        console.log('⏰ Timeout - closing connection');
        client.end();
    }
}, 15000);