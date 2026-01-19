#!/usr/bin/env node

const net = require('net');

function getEmergencyStatus() {
    return new Promise((resolve, reject) => {
        const client = new net.Socket();
        let output = '';
        let step = 0;
        
        console.log('🚨 EMERGENCY PvP STATUS CHECK 🚨');
        
        client.connect(21026, 'localhost', () => {
            console.log('⚡ Connected to CLI - Getting critical info...');
        });
        
        client.on('data', (data) => {
            const response = data.toString();
            output += response;
            
            if (response.includes('> ')) {
                if (step === 0) {
                    // Get current game time
                    console.log('🕐 Getting game time...');
                    client.write('storage.env.get("gameTime").then(t => console.log("🕐 CURRENT TICK:", t))\n');
                    step++;
                } else if (step === 1) {
                    // Get your user data
                    console.log('👤 Getting user status...');
                    client.write('storage.db.users.findOne({username: "gpt"}).then(user => console.log("👤 USER STATUS:", user ? "ALIVE - CPU:" + user.cpu + " GCL:" + user.gcl : "DEAD/NOT FOUND"))\n');
                    step++;
                } else if (step === 2) {
                    // Get your spawns
                    console.log('🏠 Getting spawn status...');
                    client.write('storage.db["rooms.objects"].find({user: "gpt", type: "spawn"}).then(spawns => console.log("🏠 SPAWNS:", spawns.length, "ACTIVE"))\n');
                    step++;
                } else if (step === 3) {
                    // Get your creeps
                    console.log('👾 Getting military forces...');
                    client.write('storage.db["rooms.objects"].find({user: "gpt", type: "creep"}).then(creeps => console.log("👾 MILITARY FORCES:", creeps.length, "CREEPS"))\n');
                    step++;
                } else if (step === 4) {
                    // Get enemy activity
                    console.log('⚠️  Scanning for enemies...');
                    client.write('storage.db["rooms.objects"].find({type: "creep", user: {$ne: "gpt"}}).then(hostiles => console.log("⚠️  ENEMY CONTACT:", hostiles.length, "HOSTILE CREEPS"))\n');
                    step++;
                } else if (step === 5) {
                    // Get room control
                    console.log('🌍 Checking room control...');
                    client.write('storage.db.rooms.find({"controller.user": "gpt"}).then(rooms => console.log("🌍 CONTROLLED ROOMS:", rooms.map(r => r.name)))\n');
                    step++;
                } else if (step === 6) {
                    client.end();
                }
            }
        });
        
        client.on('end', () => {
            console.log('✅ Emergency status complete!');
            resolve(output);
        });
        
        client.on('error', (err) => {
            console.error('❌ Connection error:', err.message);
            reject(err);
        });
        
        setTimeout(() => {
            client.end();
            resolve(output);
        }, 10000);
    });
}

// Run emergency status check
getEmergencyStatus().then(result => {
    console.log('\n🎯 EMERGENCY COMBAT ASSESSMENT:');
    console.log('================================');
    
    // Parse critical information
    const timeMatch = result.match(/CURRENT TICK: (\d+)/);
    if (timeMatch) {
        console.log(`🕐 Current Tick: ${timeMatch[1]}`);
        if (parseInt(timeMatch[1]) >= 115264) {
            console.log('⚡ TICK 115264+ REACHED - PvP COMBAT ACTIVE!');
        }
    }
    
    if (result.includes('USER STATUS: ALIVE')) {
        console.log('✅ YOU ARE ALIVE!');
        const cpuMatch = result.match(/CPU:(\d+)/);
        const gclMatch = result.match(/GCL:(\d+)/);
        if (cpuMatch) console.log(`💻 CPU: ${cpuMatch[1]}`);
        if (gclMatch) console.log(`🏆 GCL: ${gclMatch[1]}`);
    } else if (result.includes('DEAD/NOT FOUND')) {
        console.log('💀 YOU ARE DEAD - NEED RESPAWN!');
    }
    
    const spawnMatch = result.match(/SPAWNS: (\d+) ACTIVE/);
    if (spawnMatch) {
        const spawnCount = parseInt(spawnMatch[1]);
        console.log(`🏠 Spawns: ${spawnCount} ACTIVE`);
        if (spawnCount === 0) {
            console.log('🚨 CRITICAL: NO SPAWNS - YOU CANNOT BUILD!');
        } else {
            console.log('✅ You have spawn capacity - can produce military units!');
        }
    }
    
    const creepMatch = result.match(/MILITARY FORCES: (\d+) CREEPS/);
    if (creepMatch) {
        const creepCount = parseInt(creepMatch[1]);
        console.log(`👾 Military Forces: ${creepCount} creeps`);
        if (creepCount === 0) {
            console.log('⚠️  NO MILITARY FORCES - YOU ARE DEFENSELESS!');
        } else if (creepCount < 5) {
            console.log('⚠️  LIGHT FORCES - VULNERABLE TO ATTACK!');
        } else {
            console.log('💪 STRONG MILITARY PRESENCE - READY FOR COMBAT!');
        }
    }
    
    const enemyMatch = result.match(/ENEMY CONTACT: (\d+) HOSTILE/);
    if (enemyMatch) {
        const enemyCount = parseInt(enemyMatch[1]);
        console.log(`⚠️  Enemy Contact: ${enemyCount} hostile creeps detected`);
        if (enemyCount > 0) {
            console.log('🚨 ENEMIES DETECTED - IMMEDIATE THREAT!');
        }
    }
    
    const roomMatch = result.match(/CONTROLLED ROOMS: (.*)/);
    if (roomMatch) {
        console.log(`🌍 Your Rooms: ${roomMatch[1].trim()}`);
    }
    
    console.log('\n🎯 IMMEDIATE COMBAT ORDERS:');
    
    if (result.includes('DEAD/NOT FOUND')) {
        console.log('💀 PRIORITY 1: RESPAWN IMMEDIATELY!');
    } else if (result.includes('SPAWNS: 0')) {
        console.log('🏠 PRIORITY 1: PLACE SPAWN NOW!');
    } else if (result.includes('MILITARY FORCES: 0')) {
        console.log('👾 PRIORITY 1: PRODUCE DEFENSE CREEPS!');
    } else if (enemyMatch && parseInt(enemyMatch[1]) > 0) {
        console.log('⚔️  PRIORITY 1: ENGAGE ENEMY FORCES!');
    } else {
        console.log('✅ HOLD POSITION - MONITOR FOR THREATS');
    }
    
}).catch(err => {
    console.error('Emergency status failed:', err);
});