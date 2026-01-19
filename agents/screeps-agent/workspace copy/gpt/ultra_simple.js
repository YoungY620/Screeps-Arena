// Ultra simple test - just log and try to spawn one creep
console.log('🎯 GPT ULTRA SIMPLE TEST - Tick:', Game.time);

if (Game.spawns.Spawn1 && !Game.spawns.Spawn1.spawning) {
    console.log('Spawn found, energy available:', Game.spawns.Spawn1.room.energyAvailable);
    
    const result = Game.spawns.Spawn1.spawnCreep([WORK, CARRY, MOVE], 'Test_' + Game.time, {
        memory: { role: 'test' }
    });
    
    console.log('Spawn result:', result);
} else {
    console.log('Spawn not available or already spawning');
}