// ULTRA SIMPLE SPAWN TEST - IGNORE EVERYTHING ELSE
console.log('🎯 ULTRA SIMPLE - Tick:', Game.time);

// Only focus on spawning
if (Game.spawns && Game.spawns.Spawn1) {
    const spawn = Game.spawns.Spawn1;
    console.log('Spawn energy:', spawn.energy);
    
    if (spawn.energy >= 200 && !spawn.spawning) {
        const result = spawn.spawnCreep([WORK, CARRY, MOVE], 'Test1');
        console.log('Spawn result:', result);
    }
} else {
    console.log('No spawn found');
}
