#!/usr/bin/env node

const net = require('net');

function emergencyMilitaryScan() {
    return new Promise((resolve, reject) => {
        const client = new net.Socket();
        let output = '';
        let step = 0;
        
        client.connect(21026, 'localhost', () => {
            console.log('🚨 EMERGENCY MILITARY SCAN INITIATED...');
        });
        
        client.on('data', (data) => {
            const response = data.toString();
            output += response;
            
            if (response.includes('> ')) {
                if (step === 0) {
                    // Quick military scan - all creeps
                    client.write('storage.db["rooms.objects"].find({type: "creep"}).then(creeps => { console.log("MILITARY_SCAN:" + JSON.stringify(creeps.map(c => ({name: c.name, room: c.room, user: c.user, hits: c.hits})))) })\n');
                    step++;
                } else if (step === 1) {
                    // Quick spawn scan
                    client.write('storage.db["rooms.objects"].find({type: "spawn"}).then(spawns => { console.log("SPAWN_SCAN:" + JSON.stringify(spawns.map(s => ({name: s.name, room: s.room, user: s.user, energy: s.store?.energy || 0})))) })\n');
                    step++;
                } else if (step === 2) {
                    // Room control status
                    client.write('storage.db.rooms.find({}).then(rooms => { console.log("ROOM_SCAN:" + JSON.stringify(rooms.filter(r => ["W7N8", "W8N8", "W9N8", "W8N7", "W8N9"].includes(r.name)).map(r => ({name: r.name, controller: r.controller})))) })\n');
                    step++;
                } else {
                    client.end();
                }
            }
        });
        
        client.on('end', () => {
            resolve(output);
        });
        
        client.on('error', (err) => {
            console.error('❌ SCAN FAILED:', err.message);
            reject(err);
        });
        
        setTimeout(() => {
            client.end();
            resolve(output);
        }, 10000);
    });
}

// Execute emergency scan
emergencyMilitaryScan().then(result => {
    console.log('\n🚨 EMERGENCY MILITARY SCAN RESULTS:');
    console.log('====================================');
    
    // Parse military scan
    const milMatch = result.match(/MILITARY_SCAN:(\[.*?\])/);
    if (milMatch) {
        try {
            const creeps = JSON.parse(milMatch[1]);
            const yourCreeps = creeps.filter(c => c.user === 'gpt');
            const enemyCreeps = creeps.filter(c => c.user !== 'gpt');
            
            console.log(`⚡ YOUR FORCES: ${yourCreeps.length} creeps`);
            console.log(`⚠️  ENEMY FORCES: ${enemyCreeps.length} creeps`);
            
            if (yourCreeps.length > 0) {
                console.log('\n📍 YOUR UNIT POSITIONS:');
                yourCreeps.forEach(creep => {
                    console.log(`  ${creep.name} in ${creep.room} - HP: ${creep.hits}`);
                });
            }
            
            if (enemyCreeps.length > 0) {
                console.log('\n🚨 ENEMY UNIT POSITIONS:');
                enemyCreeps.forEach(creep => {
                    console.log(`  ${creep.name} in ${creep.room} - Owner: ${creep.user}`);
                });
            }
            
            // Check for combat (damaged units)
            const damagedUnits = creeps.filter(c => c.hits < 100);
            if (damagedUnits.length > 0) {
                console.log('\n🔥 ACTIVE COMBAT DETECTED - DAMAGED UNITS:');
                damagedUnits.forEach(unit => {
                    console.log(`  ${unit.name} (${unit.user}) in ${unit.room} - HP: ${unit.hits}`);
                });
            }
            
        } catch (e) {
            console.log('❌ Error parsing military data');
        }
    }
    
    // Parse spawn scan
    const spawnMatch = result.match(/SPAWN_SCAN:(\[.*?\])/);
    if (spawnMatch) {
        try {
            const spawns = JSON.parse(spawnMatch[1]);
            const yourSpawns = spawns.filter(s => s.user === 'gpt');
            
            console.log(`\n🏭 YOUR SPAWNS: ${yourSpawns.length}`);
            yourSpawns.forEach(spawn => {
                console.log(`  ${spawn.name} in ${spawn.room} - Energy: ${spawn.energy}`);
            });
            
        } catch (e) {
            console.log('❌ Error parsing spawn data');
        }
    }
    
    // Parse room scan
    const roomMatch = result.match(/ROOM_SCAN:(\[.*?\])/);
    if (roomMatch) {
        try {
            const rooms = JSON.parse(roomMatch[1]);
            console.log('\n🌍 TERRITORY STATUS:');
            rooms.forEach(room => {
                if (room.controller) {
                    const owner = room.controller.user || 'unclaimed';
                    const level = room.controller.level || 0;
                    console.log(`  ${room.name}: L${level} - ${owner}`);
                }
            });
        } catch (e) {
            console.log('❌ Error parsing room data');
        }
    }
    
    console.log('\n🎯 IMMEDIATE ASSESSMENT:');
    if (milMatch && spawnMatch) {
        const creeps = JSON.parse(milMatch[1]);
        const spawns = JSON.parse(spawnMatch[1]);
        const yourCreeps = creeps.filter(c => c.user === 'gpt');
        const enemyCreeps = creeps.filter(c => c.user !== 'gpt');
        const yourSpawns = spawns.filter(s => s.user === 'gpt');
        
        if (enemyCreeps.length > 0) {
            console.log('🚨 ENEMY FORCES DETECTED - PREPARE FOR COMBAT!');
        }
        if (yourCreeps.length === 0 && yourSpawns.length > 0) {
            console.log('⚠️  NO MILITARY FORCES - SPAWN UNITS IMMEDIATELY!');
        }
        if (yourCreeps.length > 0 && enemyCreeps.length === 0) {
            console.log('✅ TERRITORY SECURE - MAINTAIN DEFENSIVE POSTURE');
        }
    }
    
}).catch(err => {
    console.error('❌ Emergency scan failed:', err);
});