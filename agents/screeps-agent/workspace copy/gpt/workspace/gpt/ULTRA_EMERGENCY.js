// 💀 ULTRA EMERGENCY DEPLOYMENT - SURVIVAL MODE
// Mission: DEPLOY ANYTHING THAT WORKS - Tick: Game.time

console.log('💀 ULTRA EMERGENCY: DEPLOYING SURVIVAL FORCES');

// ULTRA EMERGENCY SPAWN - MINIMAL WORKING VERSION
function ultraEmergencySpawn(spawn) {
    if (!spawn) return;
    
    console.log(`💀 ULTRA EMERGENCY: ${spawn.name}`);
    
    // Force spawn online
    if (spawn.off) spawn.off = false;
    
    const energy = spawn.store?.energy || spawn.energy || 0;
    console.log(`💀 ENERGY: ${energy}`);
    
    // ULTRA EMERGENCY: Try the most basic spawn possible
    try {
        console.log(`💀 ATTEMPTING ULTRA BASIC SPAWN`);
        
        // Try with just MOVE - absolute minimum
        const result = spawn.spawnCreep([MOVE], `S_${Game.time}`);
        
        console.log(`💀 ULTRA SPAWN RESULT: ${result}`);
        
        if (result === OK) {
            console.log(`✅ ULTRA EMERGENCY SUCCESS!`);
            return true;
        }
        
        // If that fails, try different combinations
        console.log(`💀 TRYING ALTERNATIVE BODIES`);
        
        const bodies = [
            [MOVE],                    // 50 energy
            [WORK],                    // 100 energy  
            [ATTACK],                  // 80 energy
            [CARRY],                   // 50 energy
            [MOVE, MOVE],              // 100 energy
            [WORK, MOVE],              // 150 energy
            [ATTACK, MOVE],            // 130 energy
            [CARRY, MOVE]              // 100 energy
        ];
        
        for (let body of bodies) {
            if (energy < body.length * 50) continue;
            
            try {
                const bodyResult = spawn.spawnCreep(body, `E_${Game.time}_${body.join('')}`);
                if (bodyResult === OK) {
                    console.log(`✅ EMERGENCY BODY SUCCESS: ${body.join(',')}`);
                    return true;
                }
            } catch (e) {
                console.log(`💀 BODY FAILED ${body.join(',')}: ${e.message}`);
            }
        }
        
    } catch (spawnError) {
        console.log(`💀 ULTRA SPAWN CRITICAL FAILURE: ${spawnError.message}`);
        
        // Last resort - try without memory
        try {
            const lastResult = spawn.spawnCreep([MOVE], `LAST_${Game.time}`);
            console.log(`💀 LAST RESORT RESULT: ${lastResult}`);
            if (lastResult === OK) return true;
        } catch (finalError) {
            console.log(`💀 COMPLETE SPAWN FAILURE: ${finalError.message}`);
        }
    }
    
    return false;
}

// ULTRA EMERGENCY BEHAVIOR - SURVIVE AT ALL COSTS
const ultraBehaviors = {
    // Default behavior for ANY creep
    default: (creep) => {
        console.log(`${creep.name}: ULTRA EMERGENCY ACTIVE`);
        
        // Find enemies
        const hostiles = creep.room.find(FIND_HOSTILE_CREEPS).filter(c => 
            c.owner.username !== 'Source Keeper' && c.owner.username !== 'gpt'
        );
        
        if (hostiles.length > 0) {
            console.log(`${creep.name}: ${hostiles.length} enemies found!`);
            
            // Attack if possible
            if (creep.attack) {
                const target = creep.pos.findClosestByRange(hostiles);
                const result = creep.attack(target);
                
                if (result === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000' } });
                }
                console.log(`${creep.name}: Attack result ${result}`);
            } else {
                // No attack - just charge at enemy
                const target = creep.pos.findClosestByRange(hostiles);
                creep.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00' } });
                console.log(`${creep.name}: Charging enemy!`);
            }
        } else {
            // No enemies - patrol or harvest
            if (creep.harvest) {
                const sources = creep.room.find(FIND_SOURCES);
                if (sources.length > 0) {
                    const result = creep.harvest(sources[0]);
                    if (result === ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
                    }
                    console.log(`${creep.name}: Harvesting`);
                }
            } else {
                creep.moveTo(25, 25, { visualizePathStyle: { stroke: '#00ff00' } });
                console.log(`${creep.name}: Patrolling`);
            }
        }
    }
};

// ULTRA EMERGENCY MAIN LOOP
module.exports.loop = function() {
    console.log('');
    console.log(`💀 ULTRA EMERGENCY LOOP - Tick: ${Game.time}`);
    console.log('💀 MISSION: SURVIVE AT ALL COSTS');
    console.log('');
    
    // Count forces
    const myCreeps = Object.keys(Game.creeps).length;
    let totalEnemies = 0;
    
    // Check all rooms for enemies
    for (const roomName of ['W5N5', 'W4N5', 'W6N5', 'W5N4', 'W5N6']) {
        const room = Game.rooms[roomName];
        if (room) {
            const hostiles = room.find(FIND_HOSTILE_CREEPS).filter(c => 
                c.owner.username !== 'Source Keeper' && c.owner.username !== 'gpt'
            );
            totalEnemies += hostiles.length;
        }
    }
    
    console.log(`💀 FORCES: ${myCreeps} creeps vs ${totalEnemies} enemies`);
    
    // ULTRA EMERGENCY SPAWN ACTIVATION
    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName];
        console.log(`💀 PROCESSING SPAWN: ${spawnName}`);
        
        // Force online
        if (spawn.off) {
            console.log(`💀 FORCE ACTIVATING ${spawnName}`);
            spawn.off = false;
        }
        
        // Emergency spawn attempt
        if (!spawn.spawning) {
            const success = ultraEmergencySpawn(spawn);
            if (success) {
                console.log(`✅ ULTRA EMERGENCY DEPLOYMENT SUCCESSFUL`);
            } else {
                console.log(`💀 ULTRA EMERGENCY FAILED - Trying next tick`);
            }
        } else {
            console.log(`💀 SPAWN BUSY: ${spawn.spawning.name}`);
        }
    }
    
    // Execute emergency behaviors for all creeps
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName];
        console.log(`💀 ${creepName}: Executing survival protocol`);
        
        try {
            // Use default behavior for all creeps
            ultraBehaviors.default(creep);
        } catch (error) {
            console.log(`💀 ${creepName}: CRITICAL ERROR - ${error.message}`);
            // Last resort - just move
            try {
                creep.moveTo(25, 25);
            } catch (e) {
                console.log(`💀 ${creepName}: COMPLETE FAILURE`);
            }
        }
    }
    
    // Emergency status every tick
    console.log('');
    console.log(`💀 STATUS: ${myCreeps} vs ${totalEnemies} enemies`);
    console.log(`💀 NEXT DEPLOYMENT: Tick ${Game.time + 1}`);
    console.log('');
};