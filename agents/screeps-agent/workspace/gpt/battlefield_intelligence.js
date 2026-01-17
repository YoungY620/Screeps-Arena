#!/usr/bin/env node

const net = require('net');

function getBattlefieldIntelligence() {
    return new Promise((resolve, reject) => {
        const client = new net.Socket();
        let output = '';
        let step = 0;
        
        // Target rooms for surveillance
        const targetRooms = ['W7N8', 'W8N8', 'W9N8', 'W8N7', 'W8N9'];
        
        client.connect(21026, 'localhost', () => {
            console.log('🎯 CONNECTING TO BATTLEFIELD INTELLIGENCE NETWORK...');
        });
        
        client.on('data', (data) => {
            const response = data.toString();
            output += response;
            
            if (response.includes('> ')) {
                if (step === 0) {
                    // Get current game time
                    client.write('storage.env.get("gameTime").then(t => console.log("🕐 CURRENT TIME:", t))\n');
                    step++;
                } else if (step === 1) {
                    // Get ALL room objects for military assessment
                    client.write('storage.db["rooms.objects"].find({}).then(objects => {\n  const militaryObjects = objects.filter(o => \n    o.type === \'creep\' || o.type === \'spawn\' || o.type === \'tower\' || \n    o.type === \'rampart\' || o.type === \'wall\'\n  );\n  \n  console.log("🔍 BATTLEFIELD SURVEILLANCE:");\n  targetRooms.forEach(roomName => {\n    const roomObjects = militaryObjects.filter(o => o.room === roomName);\n    const yourCreeps = roomObjects.filter(o => o.type === \'creep\' && o.user === \'gpt\');\n    const yourSpawns = roomObjects.filter(o => o.type === \'spawn\' && o.user === \'gpt\');\n    const yourTowers = roomObjects.filter(o => o.type === \'tower\' && o.user === \'gpt\');\n    const enemyCreeps = roomObjects.filter(o => o.type === \'creep\' && o.user !== \'gpt\');\n    const enemySpawns = roomObjects.filter(o => o.type === \'spawn\' && o.user !== \'gpt\');\n    \n    if (yourCreeps.length > 0 || yourSpawns.length > 0 || enemyCreeps.length > 0) {\n      console.log(\`📍 ROOM \${roomName}:\`);\n      if (yourCreeps.length > 0) console.log(\`   YOUR FORCES: \${yourCreeps.length} creeps\`);\n      if (yourSpawns.length > 0) console.log(\`   YOUR BASE: \${yourSpawns.length} spawns\`);\n      if (yourTowers.length > 0) console.log(\`   YOUR DEFENSE: \${yourTowers.length} towers\`);\n      if (enemyCreeps.length > 0) console.log(\`   ⚠️  ENEMY FORCES: \${enemyCreeps.length} creeps\`);\n      if (enemySpawns.length > 0) console.log(\`   ⚠️  ENEMY BASE: \${enemySpawns.length} spawns\`);\n    }\n  });\n})\n');
                    step++;
                } else if (step === 2) {
                    // Get detailed creep information
                    client.write('storage.db["rooms.objects"].find({type: \'creep\'}).then(creeps => {\n  console.log("👾 DETAILED FORCE ASSESSMENT:");\n  \n  // Your forces\n  const yourCreeps = creeps.filter(c => c.user === \'gpt\');\n  console.log(\`YOUR TOTAL FORCES: \${yourCreeps.length} creeps\`);\n  yourCreeps.slice(0, 5).forEach(creep => {\n    console.log(\`  \${creep.name} in \${creep.room} - HP: \${creep.hits || \'unknown\'}\`);\n  });\n  \n  // Enemy forces\n  const enemyCreeps = creeps.filter(c => c.user !== \'gpt\');\n  console.log(\`ENEMY FORCES DETECTED: \${enemyCreeps.length} creeps\`);\n  enemyCreeps.slice(0, 5).forEach(creep => {\n    console.log(\`  HOSTILE \${creep.name} in \${creep.room} - Owner: \${creep.user}\`);\n  });\n})\n');
                    step++;
                } else if (step === 3) {
                    // Get spawn status and energy
                    client.write('storage.db["rooms.objects"].find({type: \'spawn\', user: \'gpt\'}).then(spawns => {\n  console.log("🏭 SPAWN STATUS:");\n  spawns.forEach(spawn => {\n    console.log(\`  \${spawn.name} in \${spawn.room}:\`);\n    console.log(\`    Energy: \${spawn.store?.energy || \'unknown\'}\`);\n    console.log(\`    Spawning: \${spawn.spawning ? \'ACTIVE\' : \'IDLE\'}\`);\n  });\n})\n');
                    step++;
                } else if (step === 4) {
                    // Check for active combat (damaged creeps)
                    client.write('storage.db["rooms.objects"].find({type: \'creep\', hits: {$lt: 100}}).then(damagedCreeps => {\n  if (damagedCreeps.length > 0) {\n    console.log("⚔️  ACTIVE COMBAT DETECTED - DAMAGED UNITS:");\n    damagedCreeps.forEach(creep => {\n      console.log(\`  \${creep.name} in \${creep.room} - HP: \${creep.hits}\`);\n    });\n  } else {\n    console.log("✅ No damaged units detected - no active combat");\n  }\n})\n');
                    step++;
                } else if (step === 5) {
                    // Get room controller status
                    client.write('storage.db.rooms.find({}).then(rooms => {\n  console.log("🌍 STRATEGIC TERRITORY STATUS:");\n  targetRooms.forEach(roomName => {\n    const room = rooms.find(r => r.name === roomName);\n    if (room && room.controller) {\n      const owner = room.controller.user || \'unclaimed\';\n      const level = room.controller.level || 0;\n      console.log(\`  \${roomName}: Controller L\${level} - Owner: \${owner}\`);\n    }\n  });\n})\n');
                    step++;
                } else if (step === 6) {
                    client.end();
                }
            }
        });
        
        client.on('end', () => {
            console.log('\n✅ BATTLEFIELD INTELLIGENCE GATHERING COMPLETE!');
            resolve(output);
        });
        
        client.on('error', (err) => {
            console.error('❌ INTELLIGENCE NETWORK ERROR:', err.message);
            reject(err);
        });
        
        setTimeout(() => {
            client.end();
            resolve(output);
        }, 15000);
    });
}

// Execute battlefield intelligence gathering
getBattlefieldIntelligence().then(result => {
    console.log('\n📊 BATTLEFIELD INTELLIGENCE REPORT:');
    console.log('=====================================');
    
    // Parse key intelligence data
    if (result.includes('CURRENT TIME:')) {
        const timeMatch = result.match(/CURRENT TIME: (\d+)/);
        if (timeMatch) {
            console.log(`🕐 Game Time: ${timeMatch[1]}`);
        }
    }
    
    // Count total forces
    const yourForceMatch = result.match(/YOUR TOTAL FORCES: (\d+) creeps/);
    const enemyForceMatch = result.match(/ENEMY FORCES DETECTED: (\d+) creeps/);
    
    if (yourForceMatch) {
        console.log(`⚡ Your Forces: ${yourForceMatch[1]} creeps`);
    }
    if (enemyForceMatch) {
        console.log(`⚠️  Enemy Forces: ${enemyForceMatch[1]} creeps`);
    }
    
    // Check for combat
    if (result.includes('ACTIVE COMBAT DETECTED')) {
        console.log('🚨🚨🚨 ACTIVE COMBAT DETECTED! 🚨🚨🚨');
        console.log('Your forces are engaged in battle!');
    }
    
    // Parse room-by-room status
    const roomMatches = result.match(/📍 ROOM (W\d+N\d+):([\s\S]*?)(?=📍 ROOM|\n\n|$)/g);
    if (roomMatches) {
        console.log('\n🎯 ROOM-BY-ROOM ASSESSMENT:');
        roomMatches.forEach(room => {
            const roomName = room.match(/ROOM (W\d+N\d+)/)[1];
            const yourCreeps = room.includes('YOUR FORCES:') ? room.match(/YOUR FORCES: (\d+)/)[1] : 0;
            const enemyCreeps = room.includes('ENEMY FORCES:') ? room.match(/ENEMY FORCES: (\d+)/)[1] : 0;
            
            if (parseInt(yourCreeps) > 0 || parseInt(enemyCreeps) > 0) {
                console.log(`  ${roomName}: ${yourCreeps} friendly | ${enemyCreeps} hostile`);
            }
        });
    }
    
    console.log('\n🎯 IMMEDIATE TACTICAL ASSESSMENT:');
    
    if (result.includes('ACTIVE COMBAT DETECTED')) {
        console.log('🔥 PRIORITY 1: Your forces are under fire!');
        console.log('🔥 PRIORITY 2: Deploy reinforcements immediately!');
    } else if (enemyForceMatch && parseInt(enemyForceMatch[1]) > 0) {
        console.log('⚠️  PRIORITY: Enemy forces detected - prepare for engagement!');
    } else if (yourForceMatch && parseInt(yourForceMatch[1]) === 0) {
        console.log('🚨 CRITICAL: You have no military forces!');
        console.log('🚨 CRITICAL: Your spawn must produce units immediately!');
    } else {
        console.log('✅ Situation stable - maintain defensive posture');
    }
    
}).catch(err => {
    console.error('❌ Battlefield intelligence failed:', err);
});