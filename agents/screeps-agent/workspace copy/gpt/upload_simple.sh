#!/bin/bash

# Simple code to upload
CODE='// GEMINI - Simple PvP Strategy
console.log("🤖 GEMINI AI ACTIVATED - PvP Mode");

// Basic harvester role
const roleHarvester = {
    run: function(creep) {
        if (creep.store.getFreeCapacity() > 0) {
            const sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: "#ffaa00"}});
            }
        } else {
            // Drop energy for now to keep harvesting
            creep.drop(RESOURCE_ENERGY);
        }
    }
};

// Main game loop
module.exports.loop = function() {
    console.log("⚡ Gemini AI - Tick:", Game.time);
    
    // Run creeps
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        roleHarvester.run(creep);
    }
    
    // Spawn new creeps if needed
    const harvesters = Object.values(Game.creeps).filter(c => c.name.includes("Gemini"));
    console.log("👥 Active creeps:", harvesters.length);
    
    if (harvesters.length < 2 && Game.spawns.Spawn1 && !Game.spawns.Spawn1.spawning) {
        const result = Game.spawns.Spawn1.spawnCreep([WORK, CARRY, MOVE], `Gemini${Game.time}`, {
            memory: {role: "harvester"}
        });
        if (result === OK) {
            console.log("🥚 Spawned new harvester");
        }
    }
};'

# Escape the code for MongoDB
ESCAPED_CODE=$(echo "$CODE" | sed 's/"/\\"/g' | sed ':a;N;$!ba;s/\n/\\n/g')

# Send update command via docker
docker exec screeps node -e "
const net = require('net');
const c = new net.Socket();
c.connect(21026, 'localhost', () => {
  console.log('Connected');
  c.write('storage.db.users.update({_id: \"883571325e0e962\"}, {\$set: {\"code.branch\": \"default\", \"code.modules\": {main: \"'$ESCAPED_CODE'\"}}})\n');
  setTimeout(() => c.end(), 1000);
});
c.on('data', data => console.log('Response:', data.toString().substring(0, 50)));
setTimeout(() => process.exit(0), 3000);
"
