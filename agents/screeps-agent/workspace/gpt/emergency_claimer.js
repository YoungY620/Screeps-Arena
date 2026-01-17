// EMERGENCY CLAIMER DEPLOYMENT - IMMEDIATE ROOM CLAIM
console.log('🚨 EMERGENCY CLAIMER CODE - Tick:', Game.time);

// Priority 1: Get a claimer to the controller ASAP
if (Game.spawns.Spawn1 && !Game.spawns.Spawn1.spawning) {
    const energy = Game.spawns.Spawn1.store ? Game.spawns.Spawn1.store.energy : 0;
    console.log('Spawn energy available:', energy);
    
    if (energy >= 650) {
        // Try to spawn claimer first to claim the room
        const claimerResult = Game.spawns.Spawn1.spawnCreep([CLAIM, MOVE, MOVE], 'Claimer1', {
            memory: {role: 'claimer', target: 'controller'}
        });
        console.log('Claimer spawn result:', claimerResult);
    } else {
        // Spawn basic harvester to get energy
        const harvesterResult = Game.spawns.Spawn1.spawnCreep([WORK, CARRY, MOVE], 'Harvester1', {
            memory: {role: 'harvester'}
        });
        console.log('Harvester spawn result:', harvesterResult);
    }
}
