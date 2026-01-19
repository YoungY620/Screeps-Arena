// CLAUDE'S BATTLE DIAGNOSTIC - IMMEDIATE THREAT ASSESSMENT
module.exports.loop = function () {
    console.log('🔥 APEX PREDATOR DIAGNOSTIC - TICK ' + Game.time + ' 🔥');
    
    const spawns = Object.values(Game.spawns);
    if (spawns.length === 0) {
        console.log('💀 CRITICAL: NO SPAWNS! EMERGENCY REQUIRED!');
        return;
    }
    
    const room = spawns[0].room;
    const creeps = Object.values(Game.creeps);
    
    console.log(`📍 Base Room: ${room.name}`);
    console.log(`⚡ Energy: ${room.energyAvailable}/${room.energyCapacityAvailable}`);
    console.log(`🏗️ Controller Level: ${room.controller ? room.controller.level : 'No Controller'}`);
    
    // Force analysis
    const military = creeps.filter(c => 
        c.memory.role === 'predator' || c.memory.role === 'annihilator' || 
        c.memory.role === 'attacker' || c.memory.role === 'ranger' || c.memory.role === 'hunter');
    const workers = creeps.filter(c => c.memory.role === 'worker' || c.memory.role === 'harvester');
    
    console.log(`👥 Total Creeps: ${creeps.length}`);
    console.log(`⚔️ Military Units: ${military.length}`);
    console.log(`⛏️ Workers: ${workers.length}`);
    
    // Infrastructure
    const towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    const extensions = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}});
    
    console.log(`🏰 Towers: ${towers.length}`);
    console.log(`🔋 Extensions: ${extensions.length}`);
    
    // IMMEDIATE THREAT ASSESSMENT
    const hostiles = room.find(FIND_HOSTILE_CREEPS);
    const hostileStructures = room.find(FIND_HOSTILE_STRUCTURES);
    
    if (hostiles.length > 0) {
        console.log(`🚨 IMMEDIATE THREAT: ${hostiles.length} hostile creeps in base!`);
        for (let enemy of hostiles) {
            console.log(`   - ${enemy.name || 'Unknown'} at (${enemy.pos.x},${enemy.pos.y}) - ${enemy.body.length} parts`);
        }
    } else {
        console.log('✅ Base secure - no immediate hostiles');
    }
    
    if (hostileStructures.length > 0) {
        console.log(`🚨 ENEMY STRUCTURES: ${hostileStructures.length} in base!`);
    }
    
    // ADJACENT ROOM INTELLIGENCE 
    const adjacentRooms = ['W1N2', 'W3N2', 'W2N1', 'W2N3', 'W1N1', 'W1N3', 'W3N1', 'W3N3'];
    for (let roomName of adjacentRooms) {
        const adjRoom = Game.rooms[roomName];
        if (adjRoom) {
            const enemies = adjRoom.find(FIND_HOSTILE_CREEPS);
            const enemyStructures = adjRoom.find(FIND_HOSTILE_STRUCTURES);
            if (enemies.length > 0 || enemyStructures.length > 0) {
                console.log(`🎯 TARGET: ${roomName} has ${enemies.length} enemies, ${enemyStructures.length} structures`);
            }
        }
    }
    
    // IMMEDIATE ACTIONS
    if (!spawns[0].spawning) {
        if (military.length === 0 && room.energyAvailable >= 260) {
            const name = 'EmergencyPredator' + Game.time;
            const body = [RANGED_ATTACK, MOVE, MOVE];
            if (spawns[0].spawnCreep(body, name, {memory: {role: 'predator'}}) === OK) {
                console.log('🔥 EMERGENCY: Spawning immediate predator!');
            }
        } else if (workers.length < 2 && room.energyAvailable >= 200) {
            const name = 'EmergencyWorker' + Game.time;
            const body = [WORK, CARRY, MOVE];
            if (spawns[0].spawnCreep(body, name, {memory: {role: 'worker'}}) === OK) {
                console.log('⛏️ EMERGENCY: Spawning immediate worker!');
            }
        }
    }
    
    console.log('🔥 DIAGNOSTIC COMPLETE - READY FOR BATTLE! 🔥');
};