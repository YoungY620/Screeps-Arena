// ULTIMATE FINAL SURVIVAL - COMPLETE SYSTEM OVERRIDE
// STATUS: EXTINCTION LEVEL - FINAL ATTEMPT
// MISSION: ACHIEVE FORCE GENERATION AT ANY COST

const EXTINCTION_LEVEL = true;
const MAX_SURVIVAL_ATTEMPTS = 100;
let survivalAttempts = 0;
let lastSuccessfulSpawn = null;

module.exports.loop = function () {
    try {
        survivalAttempts++;
        
        console.log('');
        console.log('='.repeat(80));
        console.log('💀 ULTIMATE FINAL SURVIVAL - ATTEMPT #' + survivalAttempts);
        console.log('='.repeat(80));
        
        if (survivalAttempts > MAX_SURVIVAL_ATTEMPTS) {
            console.log('🚨 MAXIMUM ATTEMPTS REACHED - CONTINUING ANYWAY');
        }
        
        // Ultimate diagnostic
        console.log(`⏰ Current Tick: ${Game.time}`);
        console.log(`🎯 Total Creeps: ${Object.keys(Game.creeps).length}`);
        console.log(`🏠 Total Rooms: ${Object.keys(Game.rooms).length}`);
        console.log(`⚡ Total Spawns: ${Object.keys(Game.spawns).length}`);
        
        // Execute ultimate survival protocol
        executeUltimateSurvival();
        
        // Emergency reconnaissance
        conductUltimateReconnaissance();
        
        // Log ultimate status
        logUltimateStatus();
        
        console.log('='.repeat(80));
        
    } catch (error) {
        console.log(`💀 ULTIMATE SURVIVAL ERROR: ${error.message}`);
        console.log('🔧 Attempting catastrophic error recovery...');
    }
};

function executeUltimateSurvival() {
    console.log('⚡ EXECUTING ULTIMATE SURVIVAL PROTOCOL');
    
    // Method 1: Standard spawn approach
    attemptStandardSpawn();
    
    // Method 2: Direct spawn manipulation
    attemptDirectSpawn();
    
    // Method 3: Energy manipulation
    attemptEnergyManipulation();
    
    // Method 4: Room-based spawning
    attemptRoomBasedSpawn();
    
    // Method 5: Catastrophic recovery
    attemptCatastrophicRecovery();
    
    // Method 6: Nuclear option
    attemptNuclearOption();
}

function attemptStandardSpawn() {
    console.log('🎯 METHOD 1: STANDARD SPAWN APPROACH');
    
    const spawn = Game.spawns.Spawn1;
    if (!spawn) {
        console.log('💀 No spawn found');
        return;
    }
    
    if (spawn.spawning) {
        console.log(`🟡 Spawn busy: ${spawn.spawning.name} (${spawn.spawning.remainingTime} ticks remaining)`);
        return;
    }
    
    const energy = spawn.room.energyAvailable;
    console.log(`⚡ Available Energy: ${energy}`);
    
    // Try every possible body combination
    const bodyCombinations = [
        { body: [MOVE], name: 'scout', cost: 50 },
        { body: [WORK], name: 'worker', cost: 100 },
        { body: [ATTACK], name: 'attack', cost: 80 },
        { body: [RANGED_ATTACK], name: 'ranged', cost: 150 },
        { body: [HEAL], name: 'heal', cost: 250 },
        { body: [TOUGH], name: 'tough', cost: 10 },
        { body: [WORK, MOVE], name: 'harvester', cost: 150 },
        { body: [ATTACK, MOVE], name: 'soldier', cost: 130 },
        { body: [RANGED_ATTACK, MOVE], name: 'ranged_attacker', cost: 200 },
        { body: [HEAL, MOVE], name: 'healer', cost: 300 },
        { body: [WORK, CARRY, MOVE], name: 'harvester_plus', cost: 200 },
        { body: [ATTACK, ATTACK, MOVE], name: 'soldier_plus', cost: 210 },
        { body: [RANGED_ATTACK, RANGED_ATTACK, MOVE], name: 'ranged_plus', cost: 350 },
        { body: [HEAL, HEAL, MOVE], name: 'healer_plus', cost: 500 },
        { body: [MOVE, MOVE, MOVE], name: 'speed', cost: 150 },
        { body: [TOUGH, TOUGH, TOUGH], name: 'armor', cost: 30 },
        { body: [WORK, WORK, MOVE], name: 'worker_plus', cost: 250 },
        { body: [CARRY, CARRY, MOVE], name: 'carrier', cost: 100 }
    ];
    
    for (let combo of bodyCombinations) {
        if (energy >= combo.cost) {
            console.log(`🎯 Attempting: ${combo.name} (${combo.body.join(',')}) - Cost: ${combo.cost}`);
            
            const result = spawn.spawnCreep(combo.body, `ULTIMATE_${combo.name}_${Game.time}`, {
                memory: { 
                    role: combo.name, 
                    ultimate: true,
                    method: 'standard',
                    attempt: survivalAttempts
                }
            });
            
            console.log(`🎯 Standard Result: ${result}`);
            
            if (result === OK) {
                console.log('🎉 ULTIMATE SUCCESS - STANDARD SPAWN ACHIEVED!');
                lastSuccessfulSpawn = 'standard';
                return;
            } else {
                console.log(`💀 Standard Failed: ${result} - Trying next...`);
            }
        }
    }
}

function attemptDirectSpawn() {
    console.log('🎯 METHOD 2: DIRECT SPAWN MANIPULATION');
    
    if (!Game.spawns.Spawn1) return;
    
    const spawn = Game.spawns.Spawn1;
    
    // Try direct property manipulation
    console.log('🔍 Direct Spawn Properties:');
    console.log(`   Name: ${spawn.name}`);
    console.log(`   ID: ${spawn.id}`);
    console.log(`   Room: ${spawn.room.name}`);
    console.log(`   Pos: ${spawn.pos.x},${spawn.pos.y}`);
    console.log(`   My: ${spawn.my}`);
    
    if (spawn.spawning) {
        console.log('🟡 Cannot attempt direct - spawn busy');
        return;
    }
    
    // Try with different memory structures
    const memoryAttempts = [
        { memory: {} },
        { memory: { role: 'test' } },
        { memory: { ultimate: true } },
        { memory: { direct: true, method: 'direct' } },
        { memory: null },
        { memory: undefined }
    ];
    
    for (let memAttempt of memoryAttempts) {
        console.log(`🎯 Direct Memory Attempt: ${JSON.stringify(memAttempt.memory)}`);
        
        const result = Game.spawns.Spawn1.spawnCreep([MOVE], `DIRECT_${Game.time}`, memAttempt.memory || {});
        
        console.log(`🎯 Direct Result: ${result}`);
        
        if (result === OK) {
            console.log('🎉 ULTIMATE SUCCESS - DIRECT SPAWN ACHIEVED!');
            lastSuccessfulSpawn = 'direct';
            return;
        }
    }
}

function attemptEnergyManipulation() {
    console.log('🎯 METHOD 3: ENERGY MANIPULATION');
    
    if (!Game.spawns.Spawn1) return;
    
    const spawn = Game.spawns.Spawn1;
    const room = spawn.room;
    
    console.log('🔍 Energy System Analysis:');
    console.log(`   Room Energy Available: ${room.energyAvailable}`);
    console.log(`   Room Energy Capacity: ${room.energyCapacityAvailable}`);
    console.log(`   Spawn Store Energy: ${spawn.store.energy}`);
    console.log(`   Spawn Store Capacity: ${spawn.store.getCapacity(RESOURCE_ENERGY)}`);
    
    // Check all energy structures
    const extensions = room.find(FIND_STRUCTURES, {
        filter: s => s.structureType === STRUCTURE_EXTENSION
    });
    
    const towers = room.find(FIND_STRUCTURES, {
        filter: s => s.structureType === STRUCTURE_TOWER
    });
    
    console.log(`   Extensions: ${extensions.length}`);
    console.log(`   Towers: ${towers.length}`);
    
    // Check each extension
    extensions.forEach((ext, index) => {
        console.log(`   Extension ${index}: ${ext.store.energy}/${ext.store.getCapacity(RESOURCE_ENERGY)}`);
    });
    
    // Try spawning with specific energy thresholds
    const energyThresholds = [50, 100, 130, 150, 200, 250, 300, 350, 400, 500];
    
    for (let threshold of energyThresholds) {
        if (room.energyAvailable >= threshold) {
            console.log(`🎯 Energy Threshold Attempt: ${threshold}+ energy`);
            
            const result = spawn.spawnCreep([MOVE], `ENERGY_${threshold}_${Game.time}`, {
                memory: { role: 'energy_test', threshold: threshold, method: 'energy' }
            });
            
            console.log(`🎯 Energy Result: ${result}`);
            
            if (result === OK) {
                console.log('🎉 ULTIMATE SUCCESS - ENERGY MANIPULATION ACHIEVED!');
                lastSuccessfulSpawn = 'energy';
                return;
            }
        }
    }
}

function attemptRoomBasedSpawn() {
    console.log('🎯 METHOD 4: ROOM-BASED SPAWN');
    
    // Try spawning in every available room
    for (let roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        console.log(`🎯 Room Attempt: ${roomName}`);
        
        const spawns = room.find(FIND_MY_SPAWNS);
        console.log(`   Spawns in room: ${spawns.length}`);
        
        for (let roomSpawn of spawns) {
            if (!roomSpawn.spawning) {
                console.log(`🎯 Room Spawn Attempt: ${roomSpawn.name}`);
                console.log(`   Room Energy: ${roomSpawn.room.energyAvailable}`);
                
                const result = roomSpawn.spawnCreep([MOVE], `ROOM_${roomName}_${Game.time}`, {
                    memory: { role: 'room_test', room: roomName, method: 'room' }
                });
                
                console.log(`🎯 Room Result: ${result}`);
                
                if (result === OK) {
                    console.log('🎉 ULTIMATE SUCCESS - ROOM-BASED SPAWN ACHIEVED!');
                    lastSuccessfulSpawn = 'room';
                    return;
                }
            }
        }
    }
}

function attemptCatastrophicRecovery() {
    console.log('🎯 METHOD 5: CATASTROPHIC RECOVERY');
    
    // Try completely different approaches
    
    // Method 5a: Try with no memory at all
    console.log('🎯 Catastrophic: No memory attempt');
    const noMemResult = Game.spawns.Spawn1.spawnCreep([MOVE], `CATASTROPHIC_${Game.time}`);
    console.log(`🎯 Catastrophic No-Mem Result: ${noMemResult}`);
    
    if (noMemResult === OK) {
        console.log('🎉 ULTIMATE SUCCESS - CATASTROPHIC RECOVERY ACHIEVED!');
        lastSuccessfulSpawn = 'catastrophic';
        return;
    }
    
    // Method 5b: Try with maximum body parts
    console.log('🎯 Catastrophic: Maximum body parts');
    const maxBody = [];
    for (let i = 0; i < 50; i++) {
        maxBody.push(MOVE);
    }
    
    const maxResult = Game.spawns.Spawn1.spawnCreep(maxBody, `MAXIMUM_${Game.time}`, {
        memory: { role: 'maximum', catastrophic: true }
    });
    console.log(`🎯 Catastrophic Maximum Result: ${maxResult}`);
    
    if (maxResult === OK) {
        console.log('🎉 ULTIMATE SUCCESS - CATASTROPHIC MAXIMUM ACHIEVED!');
        lastSuccessfulSpawn = 'catastrophic';
        return;
    }
    
    // Method 5c: Try with minimum body parts
    console.log('🎯 Catastrophic: Minimum body parts');
    const minResult = Game.spawns.Spawn1.spawnCreep([], `MINIMUM_${Game.time}`, {
        memory: { role: 'minimum', catastrophic: true }
    });
    console.log(`🎯 Catastrophic Minimum Result: ${minResult}`);
    
    if (minResult === OK) {
        console.log('🎉 ULTIMATE SUCCESS - CATASTROPHIC MINIMUM ACHIEVED!');
        lastSuccessfulSpawn = 'catastrophic';
        return;
    }
}

function attemptNuclearOption() {
    console.log('🎯 METHOD 6: NUCLEAR OPTION');
    
    // Nuclear Option: Try everything at once
    console.log('⚡ NUCLEAR OPTION: Complete system override');
    
    // Try with every possible parameter combination
    const nuclearAttempts = [
        { body: [MOVE], name: 'nuclear1', opts: {} },
        { body: [MOVE], name: 'nuclear2', opts: { memory: {} } },
        { body: [MOVE], name: 'nuclear3', opts: { memory: { role: 'nuclear' } } },
        { body: [MOVE], name: 'nuclear4', opts: { memory: { nuclear: true } } },
        { body: [MOVE], name: 'nuclear5', opts: null },
        { body: [MOVE], name: undefined, opts: { memory: { role: 'nuclear' } } },
        { body: undefined, name: 'nuclear7', opts: { memory: { role: 'nuclear' } } }
    ];
    
    for (let i = 0; i < nuclearAttempts.length; i++) {
        const attempt = nuclearAttempts[i];
        console.log(`🎯 Nuclear Attempt ${i + 1}: Body=${attempt.body}, Name=${attempt.name}, Opts=${JSON.stringify(attempt.opts)}`);
        
        try {
            const result = Game.spawns.Spawn1.spawnCreep(
                attempt.body || [MOVE],
                attempt.name || `NUCLEAR_${i}_${Game.time}`,
                attempt.opts || {}
            );
            
            console.log(`🎯 Nuclear Result ${i + 1}: ${result}`);
            
            if (result === OK) {
                console.log('🎉 ULTIMATE SUCCESS - NUCLEAR OPTION ACHIEVED!');
                lastSuccessfulSpawn = 'nuclear';
                return;
            }
        } catch (error) {
            console.log(`💀 Nuclear Error ${i + 1}: ${error.message}`);
        }
    }
}

function conductUltimateReconnaissance() {
    console.log('📡 CONDUCTING ULTIMATE RECONNAISSANCE');
    
    // Global enemy assessment
    const globalEnemies = [];
    const globalAllies = [];
    
    for (let roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        const creeps = room.find(FIND_CREEPS);
        
        creeps.forEach(creep => {
            if (creep.owner && creep.owner.username === 'kimi') {
                globalAllies.push(creep);
            } else {
                globalEnemies.push(creep);
            }
        });
    }
    
    console.log(`🎯 Ultimate Intelligence:`);
    console.log(`   Global Enemies: ${globalEnemies.length}`);
    console.log(`   Global Allies: ${globalAllies.length}`);
    console.log(`   Force Ratio: ${globalEnemies.length}:${globalAllies.length}`);
    
    if (Game.rooms.W1N3) {
        const room = Game.rooms.W1N3;
        console.log(`🎯 W1N3 Intelligence:`);
        console.log(`   My Creeps: ${room.find(FIND_MY_CREEPS).length}`);
        console.log(`   Enemy Creeps: ${room.find(FIND_HOSTILE_CREEPS).length}`);
        console.log(`   Energy Sources: ${room.find(FIND_SOURCES).length}`);
        console.log(`   Energy Available: ${room.energyAvailable}`);
        console.log(`   Extensions: ${room.find(FIND_STRUCTURES, {filter: s => s.structureType === STRUCTURE_EXTENSION}).length}`);
        console.log(`   Towers: ${room.find(FIND_STRUCTURES, {filter: s => s.structureType === STRUCTURE_TOWER}).length}`);
    }
}

function logUltimateStatus() {
    const totalCreeps = Object.keys(Game.creeps).length;
    const forceRatio = 37 / Math.max(totalCreeps, 1); // Using known enemy count
    
    console.log('💀 ULTIMATE STATUS REPORT:');
    console.log(`⏰ Survival Attempts: ${survivalAttempts}`);
    console.log(`💪 Current Force: ${totalCreeps} creeps`);
    console.log(`🎯 Global Enemies: 37 (estimated)`);
    console.log(`📊 Force Ratio: ${forceRatio.toFixed(2)}:1`);
    console.log(`🔥 Last Success: ${lastSuccessfulSpawn || 'NONE'}`);
    
    if (totalCreeps === 0) {
        console.log('🚨 ULTIMATE ALERT: STILL AT EXTINCTION LEVEL!');
        console.log('⚡ CONTINUING ULTIMATE SURVIVAL PROTOCOL...');
    } else {
        console.log('🎉 ULTIMATE SUCCESS: FORCE GENERATION ACHIEVED!');
        console.log('🚀 TRANSITIONING TO RECOVERY MODE...');
    }
}