// WORKING EMERGENCY CLAIMER - IMMEDIATE DEPLOYMENT
console.log('🎯 WORKING EMERGENCY CLAIMER - Tick:', Game.time);

// Check spawn status
const spawn = Game.spawns.Spawn1;
if (spawn) {
    console.log('✅ Spawn found:', spawn.name);
    console.log('📊 Spawn energy:', spawn.energy, '/', spawn.energyCapacity);
    console.log('🔄 Spawning status:', spawn.spawning);
    
    if (!spawn.spawning) {
        // Try to spawn claimer first to claim the room
        const claimerBody = [CLAIM, MOVE, MOVE]; // 650 energy
        const claimerResult = spawn.spawnCreep(claimerBody, 'Claimer1', {
            memory: {role: 'claimer', target: 'controller'}
        });
        
        console.log('🚀 Claimer spawn attempt result:', claimerResult);
        
        if (claimerResult === ERR_NOT_ENOUGH_ENERGY) {
            console.log('⚡ Not enough energy for claimer, trying harvester...');
            
            // Spawn basic harvester to gather energy
            const harvesterBody = [WORK, CARRY, MOVE]; // 200 energy
            const harvesterResult = spawn.spawnCreep(harvesterBody, 'Harvester1', {
                memory: {role: 'harvester'}
            });
            
            console.log('🌾 Harvester spawn result:', harvesterResult);
        }
    }
} else {
    console.log('❌ No spawn found!');
}

// Check for controller
const room = Game.rooms.W5N5;
if (room) {
    const controller = room.controller;
    if (controller) {
        console.log('🏰 Controller found:', controller.level, 'owned by:', controller.owner);
    } else {
        console.log('❌ No controller in room - need to claim!');
    }
}