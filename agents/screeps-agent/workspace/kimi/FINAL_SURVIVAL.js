// FINAL SURVIVAL - MANUAL INTERVENTION PROTOCOL
// STATUS: CRITICAL FAILURE DETECTED - ZERO FORCES MAINTAINED
// MISSION: DIAGNOSE AND MANUAL OVERRIDE

module.exports.loop = function () {
    try {
        console.log('🚨 FINAL SURVIVAL PROTOCOL - MANUAL INTERVENTION');
        console.log('💀 STATUS: EXTINCTION LEVEL THREAT CONFIRMED');
        console.log('⚡ ATTEMPTING MANUAL OVERRIDE OF SPAWN SYSTEM');
        
        // Maximum diagnostic logging
        console.log(`⏰ Game Time: ${Game.time}`);
        console.log(`🏠 Available Rooms: ${Object.keys(Game.rooms).length}`);
        console.log(`🎯 Available Spawns: ${Object.keys(Game.spawns).length}`);
        console.log(`👥 Total Creeps: ${Object.keys(Game.creeps).length}`);
        
        // Check every possible spawn
        for (let spawnName in Game.spawns) {
            const spawn = Game.spawns[spawnName];
            console.log(`🔍 Checking Spawn: ${spawnName}`);
            console.log(`   Room: ${spawn.room.name}`);
            console.log(`   Energy: ${spawn.room.energyAvailable}/${spawn.room.energyCapacityAvailable}`);
            console.log(`   Spawning: ${spawn.spawning ? 'YES' : 'NO'}`);
            
            if (spawn.spawning) {
                console.log(`   Current Spawn: ${spawn.spawning.name}`);
                console.log(`   Spawn Remaining: ${spawn.spawning.remainingTime} ticks`);
            }
            
            // Try ultra-simple spawn
            if (!spawn.spawning && spawn.room.energyAvailable >= 130) {
                console.log('⚡ ATTEMPTING ULTRA-SIMPLE SPAWN');
                
                const result = spawn.spawnCreep([ATTACK, MOVE], `SURVIVE_${Game.time}`, {
                    memory: { role: 'soldier', survival: true }
                });
                
                console.log(`🎯 SPAWN RESULT: ${result}`);
                
                if (result === OK) {
                    console.log('🎉 SURVIVAL UNIT SPAWNED!');
                    console.log('🚀 FORCE GENERATION ACHIEVED!');
                    return;
                } else {
                    console.log(`💀 SPAWN FAILED: ${result}`);
                    
                    // Try different approaches
                    if (result === ERR_NOT_ENOUGH_ENERGY) {
                        console.log('🔴 Not enough energy - waiting...');
                    } else if (result === ERR_BUSY) {
                        console.log('🟡 Spawn busy - waiting...');
                    } else if (result === ERR_INVALID_ARGS) {
                        console.log('🟠 Invalid arguments - trying simpler...');
                        
                        // Try with just move
                        const simpleResult = spawn.spawnCreep([MOVE], `SIMPLE_${Game.time}`, {
                            memory: { role: 'scout', survival: true }
                        });
                        
                        console.log(`🎯 SIMPLE SPAWN RESULT: ${simpleResult}`);
                        
                        if (simpleResult === OK) {
                            console.log('🎉 SIMPLE SURVIVAL UNIT SPAWNED!');
                            return;
                        }
                    }
                }
            }
        }
        
        // If no spawns found, try Game.spawns.Spawn1 directly
        if (Game.spawns.Spawn1) {
            console.log('🎯 Trying Game.spawns.Spawn1 directly...');
            const spawn = Game.spawns.Spawn1;
            
            if (!spawn.spawning && spawn.room.energyAvailable >= 50) {
                console.log('⚡ ATTEMPTING DIRECT SPAWN1 SPAWN');
                
                const result = spawn.spawnCreep([MOVE], `DIRECT_${Game.time}`, {
                    memory: { role: 'scout', direct: true }
                });
                
                console.log(`🎯 DIRECT SPAWN RESULT: ${result}`);
                
                if (result === OK) {
                    console.log('🎉 DIRECT SURVIVAL UNIT SPAWNED!');
                    return;
                }
            }
        }
        
        // Final attempt - check room energy
        if (Game.spawns.Spawn1) {
            const room = Game.spawns.Spawn1.room;
            console.log(`🔍 Room Energy Check:`);
            console.log(`   Energy Available: ${room.energyAvailable}`);
            console.log(`   Energy Capacity: ${room.energyCapacityAvailable}`);
            console.log(`   Sources: ${room.find(FIND_SOURCES).length}`);
            console.log(`   Sources Active: ${room.find(FIND_SOURCES_ACTIVE).length}`);
            
            // Check energy structures
            const extensions = room.find(FIND_STRUCTURES, {
                filter: structure => structure.structureType === STRUCTURE_EXTENSION
            });
            
            const towers = room.find(FIND_STRUCTURES, {
                filter: structure => structure.structureType === STRUCTURE_TOWER
            });
            
            console.log(`   Extensions: ${extensions.length}`);
            console.log(`   Towers: ${towers.length}`);
            
            // Check if energy is being blocked
            const spawnEnergy = Game.spawns.Spawn1.store.energy;
            console.log(`   Spawn Energy: ${spawnEnergy}`);
            
            if (spawnEnergy >= 50) {
                console.log('⚡ SPAWN HAS ENERGY - ATTEMPTING MANUAL SPAWN');
                
                // Try with spawn's own energy
                const manualResult = Game.spawns.Spawn1.spawnCreep([MOVE], `MANUAL_${Game.time}`, {
                    memory: { role: 'scout', manual: true }
                });
                
                console.log(`🎯 MANUAL SPAWN RESULT: ${manualResult}`);
                
                if (manualResult === OK) {
                    console.log('🎉 MANUAL SURVIVAL UNIT SPAWNED!');
                    return;
                } else {
                    console.log(`💀 MANUAL SPAWN ALSO FAILED: ${manualResult}`);
                    console.log('🩺 DIAGNOSTIC: Multiple spawn failures detected');
                    console.log('🔍 POSSIBLE ISSUES:');
                    console.log('   • Game state corruption');
                    console.log('   • Spawn system malfunction');
                    console.log('   • Energy allocation error');
                    console.log('   • Code execution blockage');
                }
            }
        }
        
        console.log('⏳ All spawn attempts failed - continuing emergency protocol...');
        console.log('🔄 Will retry on next tick...');
        
    } catch (error) {
        console.log(`💀 FINAL SURVIVAL ERROR: ${error.message}`);
        console.log('🔧 Attempting error recovery...');
    }
};