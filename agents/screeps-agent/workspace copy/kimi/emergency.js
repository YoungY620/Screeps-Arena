// EMERGENCY SPAWN FIX - KIMI DESTROYER
// Mission: Fix spawn controller issue and establish base

module.exports.loop = function () {
    console.log('🚨 EMERGENCY CODE ACTIVATED - SPAWN FIX IN PROGRESS');
    
    // Try to find any available spawn
    const spawn = Game.spawns.Spawn1;
    if (!spawn) {
        console.log('💀 NO SPAWN FOUND - CRITICAL FAILURE');
        return;
    }
    
    console.log(`📍 Spawn found in room: ${spawn.room.name} at position (${spawn.pos.x}, ${spawn.pos.y})`);
    console.log(`⚡ Spawn energy: ${spawn.room.energyAvailable}/${spawn.room.energyCapacityAvailable}`);
    
    // Check for controller in spawn room
    const controller = spawn.room.controller;
    if (!controller) {
        console.log('❌ NO CONTROLLER IN SPAWN ROOM - THIS IS WHY SPAWN IS BROKEN');
        console.log('🎯 NEED TO MOVE TO ROOM WITH CONTROLLER');
        
        // Try to spawn a scout to find controller
        if (!spawn.spawning && spawn.room.energyAvailable >= 50) {
            const result = spawn.spawnCreep([MOVE], `scout_${Game.time}`, {
                memory: { role: 'scout', target: 'find_controller' }
            });
            if (result === OK) {
                console.log('🚀 DEPLOYED SCOUT TO FIND CONTROLLER');
            }
        }
        return;
    }
    
    console.log(`✅ Controller found: Level ${controller.level}, Owned: ${controller.my}`);
    
    // If we have controller, start normal operations
    if (controller.my) {
        console.log('✅ CONTROLLER OWNED - STARTING NORMAL OPERATIONS');
        
        // Emergency harvester first
        const harvesters = _.filter(Game.creeps, c => c.memory.role === 'harvester');
        if (harvesters.length < 1 && !spawn.spawning && spawn.room.energyAvailable >= 200) {
            const result = spawn.spawnCreep([WORK, CARRY, MOVE], `harvester_${Game.time}`, {
                memory: { role: 'harvester' }
            });
            if (result === OK) {
                console.log('🌾 EMERGENCY HARVESTER DEPLOYED');
            }
        }
        
        // Emergency upgrader
        const upgraders = _.filter(Game.creeps, c => c.memory.role === 'upgrader');
        if (upgraders.length < 1 && !spawn.spawning && spawn.room.energyAvailable >= 200) {
            const result = spawn.spawnCreep([WORK, CARRY, MOVE], `upgrader_${Game.time}`, {
                memory: { role: 'upgrader' }
            });
            if (result === OK) {
                console.log('📈 EMERGENCY UPGRADER DEPLOYED');
            }
        }
    } else {
        console.log('❌ CONTROLLER NOT OWNED - NEED TO CLAIM');
        
        // Try to spawn claimer
        if (!spawn.spawning && spawn.room.energyAvailable >= 650) {
            const result = spawn.spawnCreep([CLAIM, MOVE, MOVE], `claimer_${Game.time}`, {
                memory: { role: 'claimer', target: controller.id }
            });
            if (result === OK) {
                console.log('🎯 CLAIMER DEPLOYED TO CAPTURE CONTROLLER');
            }
        }
    }
    
    // Manage any existing creeps
    for (let name in Game.creeps) {
        const creep = Game.creeps[name];
        
        if (creep.memory.role === 'scout') {
            // Scout for controllers in adjacent rooms
            const exits = Game.map.describeExits(creep.room.name);
            if (exits) {
                const directions = Object.keys(exits);
                const targetRoom = exits[directions[0]];
                creep.moveTo(new RoomPosition(25, 25, targetRoom));
                
                const roomController = creep.room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_CONTROLLER}})[0];
                if (roomController) {
                    console.log(`🏛️ CONTROLLER FOUND IN ROOM ${creep.room.name}!`);
                    creep.say('CONTROLLER!');
                }
            }
        }
        
        if (creep.memory.role === 'harvester') {
            if (creep.store.getFreeCapacity() > 0) {
                const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            } else {
                const target = creep.room.controller;
                if (target && creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        }
        
        if (creep.memory.role === 'upgrader') {
            if (creep.store[RESOURCE_ENERGY] === 0) {
                const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            } else {
                const target = creep.room.controller;
                if (creep.upgradeController(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        }
        
        if (creep.memory.role === 'claimer') {
            const target = Game.getObjectById(creep.memory.target);
            if (target && creep.claimController(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    }
    
    console.log(`=== STATUS: Tick ${Game.time} ===`);
    console.log(`Spawn: ${spawn.name} in ${spawn.room.name}`);
    console.log(`Energy: ${spawn.room.energyAvailable}/${spawn.room.energyCapacityAvailable}`);
    console.log(`Controller: ${spawn.room.controller ? 'EXISTS' : 'MISSING'}`);
    console.log(`Creeps: ${Object.keys(Game.creeps).length}`);
};