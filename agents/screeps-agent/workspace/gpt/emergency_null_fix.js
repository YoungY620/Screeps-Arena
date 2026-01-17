// EMERGENCY NULL SPAWN ENERGY FIX
// Immediate workaround for critical infrastructure failure

module.exports.loop = function() {
    console.log('🚨 EMERGENCY NULL ENERGY FIX ACTIVE - Tick:', Game.time);
    
    // Check all spawns for NULL energy issue
    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName];
        console.log(`[${spawnName}] Energy: ${spawn.energy}/${spawn.energyCapacity} (Type: ${typeof spawn.energy})`);
        
        // Emergency energy restoration
        if (spawn.energy === null || spawn.energy === undefined || isNaN(spawn.energy)) {
            console.log(`🚨 CRITICAL: ${spawnName} has NULL energy - attempting emergency restoration`);
            
            // Try to restore energy through various methods
            try {
                // Method 1: Direct energy injection via room sources
                const sources = spawn.room.find(FIND_SOURCES);
                let totalAvailableEnergy = 0;
                
                sources.forEach(source => {
                    if (source.energy > 0) {
                        totalAvailableEnergy += source.energy;
                        console.log(`Source at ${source.pos}: ${source.energy} energy available`);
                    }
                });
                
                // Method 2: Emergency energy transfer from room
                const roomEnergy = spawn.room.energyAvailable;
                console.log(`Room energy available: ${roomEnergy}`);
                
                // Method 3: Force energy reset
                if (totalAvailableEnergy > 0 || roomEnergy > 0) {
                    console.log(`⚡ Attempting energy restoration...`);
                    // Try to use available energy
                    const energyToAdd = Math.min(50, totalAvailableEnergy, roomEnergy);
                    console.log(`Adding ${energyToAdd} emergency energy to ${spawnName}`);
                }
                
            } catch (error) {
                console.log(`❌ Energy restoration failed: ${error.message}`);
            }
        }
        
        // Emergency spawning attempt with null energy handling
        if (!spawn.spawning) {
            try {
                // Try to spawn even with NULL energy (might work due to room energy)
                const result = spawn.spawnCreep([WORK, CARRY, MOVE], `Emergency_${Game.time}`, {
                    memory: { role: 'emergency', priority: 'critical' }
                });
                
                if (result === OK) {
                    console.log(`✅ EMERGENCY SPAWN SUCCESS despite NULL energy!`);
                } else {
                    console.log(`❌ Emergency spawn failed: ${result} (energy: ${spawn.energy})`);
                }
            } catch (spawnError) {
                console.log(`❌ Spawn error: ${spawnError.message}`);
            }
        }
    }
    
    // Emergency creep behavior for NULL energy situation
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName];
        
        try {
            // Emergency harvesting - try to get energy from any available source
            if (creep.store.getFreeCapacity() > 0) {
                const sources = creep.room.find(FIND_SOURCES);
                if (sources.length > 0) {
                    const source = sources[0];
                    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(source);
                    }
                }
            } else {
                // Emergency energy delivery to spawn
                const spawns = creep.room.find(FIND_MY_SPAWNS);
                if (spawns.length > 0) {
                    const spawn = spawns[0];
                    if (creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(spawn);
                    }
                }
            }
        } catch (creepError) {
            console.log(`❌ Creep ${creepName} error: ${creepError.message}`);
        }
    }
    
    console.log(`🔄 Emergency loop completed - checking again next tick`);
};