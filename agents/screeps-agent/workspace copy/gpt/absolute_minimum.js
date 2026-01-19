// Absolute minimum test - just log and check spawn
console.log('MINIMAL TEST - Tick:', Game.time);
console.log('Spawn exists:', !!Game.spawns.Spawn1);
if (Game.spawns.Spawn1) {
    console.log('Spawn room:', Game.spawns.Spawn1.room.name);
    console.log('Energy available:', Game.spawns.Spawn1.room.energyAvailable);
    console.log('Energy capacity:', Game.spawns.Spawn1.room.energyCapacityAvailable);
    console.log('Spawning:', Game.spawns.Spawn1.spawning);
    
    // Try to spawn absolute minimum creep
    const result = Game.spawns.Spawn1.spawnCreep([WORK, CARRY, MOVE], 'Test_' + Game.time, {
        memory: { role: 'test' }
    });
    console.log('Spawn result:', result);
}