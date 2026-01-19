#!/usr/bin/env node

const net = require('net');

function checkGameStatus() {
    return new Promise((resolve, reject) => {
        const client = new net.Socket();
        let output = '';
        let step = 0;
        
        client.connect(21026, 'localhost', () => {
            console.log('🎯 Connecting to Screeps CLI...');
        });
        
        client.on('data', (data) => {
            const response = data.toString();
            output += response;
            
            if (response.includes('> ')) {
                if (step === 0) {
                    // Get current game time
                    client.write('storage.env.get("gameTime").then(t => console.log("🕐 GAME TIME:", t))\n');
                    step++;
                } else if (step === 1) {
                    // Get your user data
                    client.write('storage.db.users.findOne({username: "gpt"}).then(user => console.log("👤 USER:", user ? "EXISTS - CPU:" + user.cpu + " GCL:" + user.gcl : "NOT FOUND"))\n');
                    step++;
                } else if (step === 2) {
                    // Get room objects (spawns, creeps, etc.)
                    client.write('storage.db["rooms.objects"].find({user: "gpt"}).then(objects => {\n  const spawns = objects.filter(o => o.type === "spawn");\n  const creeps = objects.filter(o => o.type === "creep");\n  console.log("🏠 YOUR OBJECTS:");\n  console.log("   Spawns:", spawns.length, spawns.map(s => s.room + "(" + s.name + ")"));\n  console.log("   Creeps:", creeps.length, creeps.slice(0,3).map(c => c.name + "(" + c.room + ")"));\n})\n');
                    step++;
                } else if (step === 3) {
                    // Get room status
                    client.write('storage.db.rooms.find({}).then(rooms => {\n  const yourRooms = rooms.filter(r => r.controller && r.controller.user === "gpt");\n  console.log("🌍 YOUR ROOMS:", yourRooms.map(r => r.name + "(L" + (r.controller.level || 0) + ")"));\n})\n');
                    step++;
                } else if (step === 4) {
                    client.end();
                }
            }
        });
        
        client.on('end', () => {
            console.log('✅ Status check complete!');
            resolve(output);
        });
        
        client.on('error', (err) => {
            console.error('❌ Connection error:', err.message);
            reject(err);
        });
        
        setTimeout(() => {
            client.end();
            resolve(output);
        }, 8000);
    });
}

// Run the status check
checkGameStatus().then(result => {
    console.log('\n📊 COMPLETE STATUS REPORT:');
    console.log('==========================');
    
    // Parse and display key information
    if (result.includes('GAME TIME:')) {
        const timeMatch = result.match(/GAME TIME: (\d+)/);
        if (timeMatch) {
            console.log(`🕐 Current Game Time: ${timeMatch[1]}`);
        }
    }
    
    if (result.includes('USER: EXISTS')) {
        console.log('✅ You are ALIVE and registered!');
        const cpuMatch = result.match(/CPU:(\d+)/);
        const gclMatch = result.match(/GCL:(\d+)/);
        if (cpuMatch) console.log(`💻 CPU: ${cpuMatch[1]}`);
        if (gclMatch) console.log(`🏆 GCL: ${gclMatch[1]}`);
    } else if (result.includes('NOT FOUND')) {
        console.log('❌ You are NOT registered - need to create user!');
    }
    
    if (result.includes('Spawns:')) {
        const spawnMatch = result.match(/Spawns: (\d+)(.*)/);
        if (spawnMatch) {
            console.log(`🏠 Spawns: ${spawnMatch[1]} ${spawnMatch[2].trim()}`);
            if (parseInt(spawnMatch[1]) > 0) {
                console.log('🎯 You HAVE a spawn - you can build and defend!');
            } else {
                console.log('🚨 You have NO spawns - need to place one immediately!');
            }
        }
    }
    
    if (result.includes('Creeps:')) {
        const creepMatch = result.match(/Creeps: (\d+)(.*)/);
        if (creepMatch) {
            console.log(`👾 Creeps: ${creepMatch[1]} ${creepMatch[2].trim()}`);
            if (parseInt(creepMatch[1]) > 0) {
                console.log('⚡ You have active creeps - you can fight and build!');
            } else {
                console.log('⚠️  You have NO creeps - you are defenseless!');
            }
        }
    }
    
    if (result.includes('YOUR ROOMS:')) {
        const roomMatch = result.match(/YOUR ROOMS:([\s\S]*?)(\n|$)/);
        if (roomMatch) {
            console.log(`🌍 Your Rooms: ${roomMatch[1].trim()}`);
        }
    }
    
    console.log('\n🎯 IMMEDIATE ACTION REQUIRED:');
    
    if (result.includes('Spawns: 0')) {
        console.log('🚨 CRITICAL: Place a spawn immediately using place_spawn.js!');
    } else if (result.includes('Creeps: 0')) {
        console.log('⚠️  URGENT: Your spawn needs to start producing creeps!');
    } else {
        console.log('✅ You are operational - monitor and defend!');
    }
    
}).catch(err => {
    console.error('Failed to get status:', err);
});