// CLAUDE'S PERFECT START MONITOR - LEGENDARY BATTLE TRACKER
module.exports.loop = function () {
    console.log('🌟 PERFECT START MONITOR - TICK ' + Game.time + ' - LEGENDARY BATTLE TRACKER 🌟');
    
    const spawns = Object.values(Game.spawns);
    if (spawns.length === 0) {
        console.log('💀 CRITICAL: PERFECT START PROTOCOL COMPROMISED - NO SPAWNS!');
        return;
    }
    
    const room = spawns[0].room;
    const creeps = Object.values(Game.creeps);
    
    // Core legendary status
    const battleAge = Game.time - 8056; // From original battle start
    console.log(`⏱️ LEGENDARY BATTLE AGE: ${battleAge} ticks | Base: ${room.name} | Energy: ${room.energyAvailable}/${room.energyCapacityAvailable}`);
    console.log(`🏰 Controller Level: ${room.controller.level} | Progress: ${room.controller.progress}/${room.controller.progressTotal}`);
    
    // Perfect Start forces analysis
    const architects = creeps.filter(c => c.memory.role === 'architect');
    const terminators = creeps.filter(c => c.memory.role === 'terminator');
    const dominators = creeps.filter(c => c.memory.role === 'dominator');
    const perfectors = creeps.filter(c => c.memory.role === 'perfector');
    const gods = creeps.filter(c => c.memory.role === 'god');
    
    // Legacy forces (from previous AIs)
    const workers = creeps.filter(c => c.memory.role === 'worker');
    const harvesters = creeps.filter(c => c.memory.role === 'harvester');
    const military = creeps.filter(c => ['attacker', 'ranger', 'destroyer', 'annihilator', 'predator', 'executioner', 'obliterator', 'exterminator'].includes(c.memory.role));
    
    const totalPerfect = terminators.length + dominators.length + perfectors.length + gods.length;
    const totalForces = totalPerfect + military.length;
    const totalEconomy = architects.length + workers.length + harvesters.length;
    
    console.log(`💀 PERFECT FORCES: T:${terminators.length} D:${dominators.length} P:${perfectors.length} G:${gods.length} (Total: ${totalPerfect})`);
    console.log(`⚔️ Legacy Military: ${military.length} | 🏗️ Economy: A:${architects.length} W:${workers.length} H:${harvesters.length}`);
    console.log(`👑 TOTAL ARMY: ${totalForces} units | TOTAL EMPIRE: ${creeps.length} creeps`);
    
    // Infrastructure status
    const towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    const extensions = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}});
    const walls = room.find(FIND_MY_STRUCTURES, {filter: s => s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART});
    const constructionSites = room.find(FIND_CONSTRUCTION_SITES);
    
    console.log(`🏰 Perfect Infrastructure: Towers:${towers.length} Extensions:${extensions.length} Walls:${walls.length} Building:${constructionSites.length}`);
    
    // Immediate threat assessment
    const hostiles = room.find(FIND_HOSTILE_CREEPS);
    const hostileStructures = room.find(FIND_HOSTILE_STRUCTURES);
    
    if (hostiles.length > 0) {
        console.log(`🚨 LEGENDARY BATTLE: ${hostiles.length} enemy warriors in our fortress!`);
        hostiles.forEach(enemy => {
            console.log(`   💀 Legendary Opponent: ${enemy.name || 'Unknown'} at (${enemy.pos.x},${enemy.pos.y}) - ${enemy.hits}/${enemy.hitsMax} HP - ${enemy.body.length} parts`);
        });
    } else {
        console.log('🏰 Fortress secure - legendary enemies maintaining distance');
    }
    
    if (hostileStructures.length > 0) {
        console.log(`🎯 Enemy installations in fortress: ${hostileStructures.length} - ELIMINATION IN PROGRESS`);
    }
    
    // Perfect Start memory analysis
    if (Memory.perfect) {
        console.log(`🌟 PERFECT STATS: Eliminations:${Memory.perfect.totalEliminations} Bases:${Memory.perfect.basesAnnihilated} Score:${Memory.perfect.arenaScore}`);
        console.log(`⚡ Perfection Level: ${Memory.perfect.perfectionLevel} | God Mode: ${Memory.perfect.godMode} | Phase: ${Memory.perfect.phase}`);
    }
    
    // Battle efficiency analysis
    const armyGrowthRate = totalForces > 0 ? (totalForces / Math.max(battleAge, 1)) : 0;
    const economicEfficiency = room.energyAvailable / Math.max(room.energyCapacityAvailable, 1);
    const infrastructureRatio = (towers.length + extensions.length) / Math.max(battleAge / 100, 1);
    
    console.log(`📊 Perfect Metrics: Age:${battleAge} | Army Growth:${armyGrowthRate.toFixed(3)}/tick | Economy:${(economicEfficiency*100).toFixed(1)}% | Infrastructure:${infrastructureRatio.toFixed(2)}`);
    
    // Legendary status assessment
    let battleStatus = 'PERFECT_PREPARING';
    if (totalPerfect >= 3) battleStatus = 'PERFECT_READY';
    if (gods.length >= 1) battleStatus = 'GOD_MODE_ACTIVE';
    if (totalForces >= 15) battleStatus = 'PERFECT_ARMY';
    if (towers.length >= 3 && totalForces >= 10) battleStatus = 'ABSOLUTE_PERFECTION';
    if (hostiles.length > 0) battleStatus = 'LEGENDARY_COMBAT';
    
    console.log(`🔥 PERFECT STATUS: ${battleStatus}`);
    
    // Legendary targets status
    console.log(`🎯 LEGENDARY TARGETS:`);
    console.log(`   💀 kimi (W1N3) - Survival: ${battleAge} ticks (LEGENDARY ENDURANCE)`);  
    console.log(`   💀 gpt (W4N3) - Multi-front warfare opponent (WORTHY ADVERSARY)`);
    
    // Perfect Start phase announcements
    if (Memory.perfect && Memory.perfect.godMode && Game.time % 50 === 0) {
        console.log('👑👑👑 GOD MODE ACTIVE - DIVINE INTERVENTION IN PROGRESS 👑👑👑');
    }
    
    if (Game.time % 100 === 0) {
        console.log(`🌟 LEGENDARY BATTLE UPDATE: ${battleAge} ticks of the greatest warfare in Screeps history!`);
    }
    
    console.log('💀 PERFECT START MONITOR COMPLETE - THE LEGEND CONTINUES 💀');
};