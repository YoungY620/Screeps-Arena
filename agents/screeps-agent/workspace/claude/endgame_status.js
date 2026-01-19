// Endgame Status Assessment - Tick 5989+
module.exports.loop = function () {
    console.log('🔥 ENDGAME ASSESSMENT - TICK ' + Game.time + ' 🔥');
    
    // Critical stats
    const spawns = Object.values(Game.spawns);
    const creeps = Object.values(Game.creeps);
    
    if (spawns.length === 0) {
        console.log('💀 DEFEAT - NO SPAWNS REMAINING!');
        return;
    }
    
    const spawn = spawns[0];
    const room = spawn.room;
    const controller = room.controller;
    
    console.log('📍 BASE STATUS:');
    console.log(`   Room: ${room.name}`);
    console.log(`   RCL: ${controller ? controller.level : 'None'} (${controller ? Math.floor(controller.progress/controller.progressTotal*100) : 0}%)`);
    console.log(`   Energy: ${room.energyAvailable}/${room.energyCapacityAvailable}`);
    
    // Force composition
    const workers = creeps.filter(c => c.memory.role === 'worker');
    const attackers = creeps.filter(c => c.memory.role === 'attacker');
    const rangers = creeps.filter(c => c.memory.role === 'ranger');
    const healers = creeps.filter(c => c.memory.role === 'healer');
    const supers = creeps.filter(c => c.memory.role === 'supersoldier');
    const totalMilitary = attackers.length + rangers.length + supers.length;
    
    console.log('👥 FORCE COMPOSITION:');
    console.log(`   Workers: ${workers.length}`);
    console.log(`   Attackers: ${attackers.length}`);
    console.log(`   Rangers: ${rangers.length}`);
    console.log(`   Healers: ${healers.length}`);
    console.log(`   Super Soldiers: ${supers.length}`);
    console.log(`   Total Military: ${totalMilitary}`);
    
    // Infrastructure
    const towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    const extensions = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}});
    const walls = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_WALL}});
    const ramparts = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_RAMPART}});
    
    console.log('🏗️ INFRASTRUCTURE:');
    console.log(`   Towers: ${towers.length}`);
    console.log(`   Extensions: ${extensions.length}`);
    console.log(`   Walls: ${walls.length}`);
    console.log(`   Ramparts: ${ramparts.length}`);
    
    // Threat assessment
    const enemies = room.find(FIND_HOSTILE_CREEPS);
    const enemyStructures = room.find(FIND_HOSTILE_STRUCTURES);
    
    console.log('🚨 THREAT LEVEL:');
    console.log(`   Enemy Creeps: ${enemies.length}`);
    console.log(`   Enemy Structures: ${enemyStructures.length}`);
    
    if (enemies.length > 0) {
        console.log('   ACTIVE COMBAT:');
        enemies.forEach(enemy => {
            console.log(`     - ${enemy.name} at ${enemy.pos} (${enemy.hits}/${enemy.hitsMax} HP)`);
        });
    }
    
    if (enemyStructures.length > 0) {
        console.log('   ENEMY INSTALLATIONS:');
        enemyStructures.forEach(structure => {
            console.log(`     - ${structure.structureType} at ${structure.pos} (${structure.hits}/${structure.hitsMax} HP)`);
        });
    }
    
    // Performance metrics
    const averageCreepCost = creeps.reduce((sum, creep) => {
        return sum + creep.body.length * 50; // Rough estimate
    }, 0) / Math.max(creeps.length, 1);
    
    console.log('📊 PERFORMANCE:');
    console.log(`   Army Quality: ${Math.floor(averageCreepCost)} avg energy per creep`);
    console.log(`   Base Efficiency: ${Math.floor(room.energyAvailable/room.energyCapacityAvailable*100)}% energy utilization`);
    
    // Strategic recommendations
    console.log('🎯 STRATEGIC ANALYSIS:');
    
    if (totalMilitary < 8) {
        console.log('   ⚠️  MILITARY WEAKNESS - Need more combat units');
    } else if (totalMilitary >= 15) {
        console.log('   ⚔️  MASSIVE ARMY - Ready for total warfare');
    } else {
        console.log('   ✅ ADEQUATE MILITARY - Maintain pressure');
    }
    
    if (towers.length < 3 && controller && controller.level >= 3) {
        console.log('   🗼 DEFENSE WEAKNESS - Need more towers');
    } else if (towers.length >= 3) {
        console.log('   🛡️  STRONG DEFENSES - Base is fortified');
    }
    
    if (enemies.length > 0) {
        console.log('   🚨 ACTIVE THREAT - Priority: Eliminate invaders');
    } else if (enemyStructures.length > 0) {
        console.log('   🎯 ENEMY DETECTED - Priority: Structure destruction');
    } else {
        console.log('   🔍 NO IMMEDIATE THREATS - Expand or reinforce');
    }
    
    // Victory conditions
    if (totalMilitary >= 20 && towers.length >= 4 && controller && controller.level >= 6) {
        console.log('🏆 VICTORY CONDITIONS MET - READY FOR FINAL ASSAULT!');
    }
    
    console.log('===============================================');
};