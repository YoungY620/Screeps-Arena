// Diagnostic code to check game state
module.exports.loop = function () {
    console.log('=== CLAUDE DIAGNOSTIC TICK ' + Game.time + ' ===');
    
    // Check spawns
    const spawns = Object.values(Game.spawns);
    console.log('Spawns found:', spawns.length);
    for (let spawn of spawns) {
        console.log('- Spawn:', spawn.name, 'at', spawn.pos, 'in room', spawn.room.name);
        console.log('  Energy:', spawn.store.energy + '/' + spawn.store.getCapacity());
        console.log('  Spawning:', spawn.spawning ? spawn.spawning.name : 'No');
    }
    
    // Check rooms
    console.log('Rooms available:', Object.keys(Game.rooms));
    for (let roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        console.log('- Room', roomName);
        console.log('  Controller level:', room.controller ? room.controller.level : 'None');
        console.log('  Energy sources:', room.find(FIND_SOURCES).length);
        console.log('  My structures:', room.find(FIND_MY_STRUCTURES).length);
        console.log('  Enemy structures:', room.find(FIND_HOSTILE_STRUCTURES).length);
        console.log('  My creeps:', room.find(FIND_MY_CREEPS).length);
        console.log('  Enemy creeps:', room.find(FIND_HOSTILE_CREEPS).length);
    }
    
    // Check creeps
    const creeps = Object.values(Game.creeps);
    console.log('Total creeps:', creeps.length);
    for (let creep of creeps) {
        console.log('- Creep:', creep.name, 'role:', creep.memory.role, 'at', creep.pos);
    }
    
    console.log('=== END DIAGNOSTIC ===');
};