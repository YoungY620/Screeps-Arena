// Simple check to see current game state
console.log('=== GPT PvP AGENT STATUS CHECK ===');
console.log('Tick:', Game.time);
console.log('Rooms controlled:', Object.keys(Game.rooms).length);
console.log('Spawns available:', Object.keys(Game.spawns).length);
console.log('Creeps alive:', Object.keys(Game.creeps).length);

// Check my room
const room = Game.rooms.W5N5;
if (room) {
    console.log('Room W5N5 - Controller Level:', room.controller?.level || 'No controller');
    console.log('Energy available:', room.energyAvailable);
    console.log('Energy capacity:', room.energyCapacityAvailable);
    
    const sources = room.find(FIND_SOURCES);
    console.log('Energy sources:', sources.length);
    
    const hostiles = room.find(FIND_HOSTILE_CREEPS);
    console.log('Hostile creeps:', hostiles.length);
}

// Check spawns
for (const spawnName in Game.spawns) {
    const spawn = Game.spawns[spawnName];
    console.log(`Spawn ${spawnName}:`, spawn.spawning ? 'Spawning' : 'Ready');
}