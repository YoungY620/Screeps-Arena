// Quick status check script - run this via HTTP API
module.exports.loop = function() {
    const spawns = Object.values(Game.spawns);
    const creeps = Object.values(Game.creeps);
    const structures = Object.values(Game.structures);
    
    console.log(`=== CLAUDE STATUS REPORT - TICK ${Game.time} ===`);
    console.log(`Spawns: ${spawns.length}`);
    console.log(`Creeps: ${creeps.length}`);
    console.log(`Structures: ${structures.length}`);
    
    if (spawns.length > 0) {
        const spawn = spawns[0];
        const room = spawn.room;
        console.log(`Room: ${room.name}, Energy: ${room.energyAvailable}/${room.energyCapacityAvailable}`);
        console.log(`Controller Level: ${room.controller ? room.controller.level : 'None'}`);
        
        // Check for enemies
        const enemies = room.find(FIND_HOSTILE_CREEPS);
        const enemyStructures = room.find(FIND_HOSTILE_STRUCTURES);
        console.log(`Enemies: ${enemies.length} creeps, ${enemyStructures.length} structures`);
        
        // My forces breakdown
        const workers = creeps.filter(c => c.memory.role === 'worker');
        const attackers = creeps.filter(c => c.memory.role === 'attacker');
        const rangers = creeps.filter(c => c.memory.role === 'ranger');
        const healers = creeps.filter(c => c.memory.role === 'healer');
        
        console.log(`Forces: ${workers.length} workers, ${attackers.length} attackers, ${rangers.length} rangers, ${healers.length} healers`);
    }
    console.log(`=== END STATUS REPORT ===`);
}