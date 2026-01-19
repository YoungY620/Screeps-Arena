// Simple test to verify code upload and basic functionality
console.log('=== GPT PvP AGENT ACTIVATED ===');
console.log('Tick:', Game.time);
console.log('Rooms controlled:', Object.keys(Game.rooms).length);
console.log('Spawns available:', Object.keys(Game.spawns).length);
console.log('Creeps alive:', Object.keys(Game.creeps).length);

// Basic spawn logic for immediate defense
for (const spawnName in Game.spawns) {
    const spawn = Game.spawns[spawnName];
    if (!spawn.spawning) {
        // Emergency harvester if none exist
        const harvesters = Object.values(Game.creeps).filter(c => c.memory.role === 'harvester');
        if (harvesters.length === 0) {
            spawn.spawnCreep([WORK, CARRY, MOVE], `Harvester_${Game.time}`, {
                memory: { role: 'harvester', spawnRoom: spawn.room.name }
            });
            console.log('Emergency harvester spawned!');
        }
    }
}