// CLAUDE'S TRANSCENDENT BATTLE MONITOR - Real-time status tracking
module.exports.loop = function () {
    console.log('📊 TRANSCENDENT BATTLE MONITOR - TICK ' + Game.time + ' 📊');
    
    const spawns = Object.values(Game.spawns);
    if (spawns.length === 0) {
        console.log('💀 CRITICAL FAILURE: NO SPAWNS! TRANSCENDENT PROTOCOL COMPROMISED!');
        return;
    }
    
    const room = spawns[0].room;
    const creeps = Object.values(Game.creeps);
    
    // Core status
    console.log(`🏠 Base: ${room.name} | Energy: ${room.energyAvailable}/${room.energyCapacityAvailable} | RCL: ${room.controller.level}`);
    
    // Transcendent forces analysis
    const harvesters = creeps.filter(c => c.memory.role === 'harvester');
    const executioners = creeps.filter(c => c.memory.role === 'executioner');
    const obliterators = creeps.filter(c => c.memory.role === 'obliterator');  
    const exterminators = creeps.filter(c => c.memory.role === 'exterminator');
    
    // Legacy forces (from previous AIs)
    const workers = creeps.filter(c => c.memory.role === 'worker');
    const attackers = creeps.filter(c => c.memory.role === 'attacker');
    const rangers = creeps.filter(c => c.memory.role === 'ranger');
    const predators = creeps.filter(c => c.memory.role === 'predator');
    
    const totalTranscendent = executioners.length + obliterators.length + exterminators.length;
    const totalLegacy = attackers.length + rangers.length + predators.length;
    const totalMilitary = totalTranscendent + totalLegacy;
    
    console.log(`💀 TRANSCENDENT FORCES: E:${executioners.length} O:${obliterators.length} X:${exterminators.length} (Total: ${totalTranscendent})`);
    console.log(`⚔️ Legacy Forces: A:${attackers.length} R:${rangers.length} P:${predators.length} (Total: ${totalLegacy})`);
    console.log(`⛏️ Economic: H:${harvesters.length} W:${workers.length} | 🏛️ TOTAL ARMY: ${totalMilitary}`);
    
    // Infrastructure status
    const towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    const extensions = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}});
    const constructionSites = room.find(FIND_CONSTRUCTION_SITES);
    
    console.log(`🏰 Infrastructure: Towers:${towers.length} Extensions:${extensions.length} Building:${constructionSites.length}`);
    
    // Immediate threats
    const hostiles = room.find(FIND_HOSTILE_CREEPS);
    const hostileStructures = room.find(FIND_HOSTILE_STRUCTURES);
    
    if (hostiles.length > 0) {
        console.log(`🚨 BASE UNDER ATTACK: ${hostiles.length} hostiles detected!`);
        hostiles.forEach(enemy => {
            console.log(`   💀 ${enemy.name || 'Enemy'} at (${enemy.pos.x},${enemy.pos.y}) - ${enemy.hits}/${enemy.hitsMax} HP - ${enemy.body.length} parts`);
        });
    } else {
        console.log('✅ Base secure - no immediate threats');
    }
    
    if (hostileStructures.length > 0) {
        console.log(`🎯 Enemy structures in base: ${hostileStructures.length}`);
    }
    
    // Memory analysis (if transcendent memory exists)
    if (Memory.transcendent) {
        console.log(`💀 TRANSCENDENT STATS: Kills:${Memory.transcendent.totalKills} Bases:${Memory.transcendent.basesDestroyed} Phase:${Memory.transcendent.phase}`);
        console.log(`⚡ Supremacy Level: ${Memory.transcendent.supremacyLevel} | War Crimes: ${Memory.transcendent.warCrimes}`);
    }
    
    // Battle efficiency calculations
    const battleAge = Game.time - 9523; // From deployment
    const armyGrowthRate = totalMilitary > 0 ? (totalMilitary / Math.max(battleAge, 1)) : 0;
    const economicEfficiency = room.energyAvailable / Math.max(room.energyCapacityAvailable, 1);
    
    console.log(`📊 Battle Metrics: Age:${battleAge} ticks | Army Growth:${armyGrowthRate.toFixed(2)}/tick | Economy:${(economicEfficiency*100).toFixed(1)}%`);
    
    // Status assessment
    let status = 'TRANSCENDENT_PREPARING';
    if (totalTranscendent >= 5) status = 'TRANSCENDENT_READY';
    if (totalMilitary >= 8) status = 'ASSAULT_CAPABLE';
    if (towers.length >= 2 && totalMilitary >= 10) status = 'MAXIMUM_FORCE';
    if (hostiles.length > 0) status = 'UNDER_ATTACK';
    
    console.log(`🔥 CURRENT STATUS: ${status}`);
    
    // Target assessment  
    console.log(`🎯 PRIMARY TARGET: kimi at W1N3 - TRANSCENDENT ELIMINATION IN PROGRESS`);
    
    console.log('💀 TRANSCENDENT MONITOR COMPLETE - THE HUNT CONTINUES 💀');
};