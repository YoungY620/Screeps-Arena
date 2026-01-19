// 🚨 EMERGENCY BATTLEFIELD ASSESSMENT FOR W1N3 🚨
// Quick combat status check

const BATTLEFIELD_ASSESSMENT = function() {
    console.log('🔍 BATTLEFIELD ASSESSMENT - W1N3');
    console.log('==========================================');
    
    const roomName = 'W1N3';
    const room = Game.rooms[roomName];
    
    if (!room) {
        console.log(`❌ ROOM ${roomName} NOT VISIBLE - Cannot assess battlefield!`);
        return null;
    }
    
    // Current game time
    console.log(`⏰ Game Time: ${Game.time}`);
    
    // Spawn status
    const spawn = Game.spawns.Spawn1;
    if (spawn) {
        console.log(`🏠 Spawn Status: ${spawn.hits}/${spawn.hitsMax} HP`);
        console.log(`⚡ Spawn Energy: ${spawn.store[RESOURCE_ENERGY]}/${spawn.store.getCapacity(RESOURCE_ENERGY)}`);
        console.log(`🔄 Spawn Active: ${spawn.spawning ? 'YES - ' + spawn.spawning.name : 'NO'}`);
    } else {
        console.log(`❌ NO SPAWN FOUND!`);
    }
    
    // Tower status
    const towers = room.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_TOWER }
    });
    console.log(`🗼 Towers: ${towers.length}`);
    towers.forEach((tower, index) => {
        console.log(`   Tower ${index + 1}: ${tower.hits}/${tower.hitsMax} HP, Energy: ${tower.store[RESOURCE_ENERGY]}/${tower.store.getCapacity(RESOURCE_ENERGY)}`);
    });
    
    // Enemy detection
    const hostileCreeps = room.find(FIND_HOSTILE_CREEPS);
    const hostileStructures = room.find(FIND_HOSTILE_STRUCTURES);
    
    console.log(`⚔️ Hostile Creeps: ${hostileCreeps.length}`);
    if (hostileCreeps.length > 0) {
        hostileCreeps.forEach((creep, index) => {
            console.log(`   Enemy ${index + 1}: ${creep.name} (${creep.owner.username}) - ${creep.hits}/${creep.hitsMax} HP`);
            console.log(`   Body: ${creep.body.map(part => part.type).join(', ')}`);
        });
    }
    
    console.log(`🏚️ Hostile Structures: ${hostileStructures.length}`);
    if (hostileStructures.length > 0) {
        hostileStructures.forEach((structure, index) => {
            console.log(`   Enemy Structure ${index + 1}: ${structure.structureType} (${structure.owner.username}) - ${structure.hits}/${structure.hitsMax} HP`);
        });
    }
    
    // Friendly forces
    const myCreeps = room.find(FIND_MY_CREEPS);
    console.log(`👥 Friendly Creeps: ${myCreeps.length}`);
    if (myCreeps.length > 0) {
        myCreeps.forEach((creep, index) => {
            console.log(`   Creep ${index + 1}: ${creep.name} - ${creep.hits}/${creep.hitsMax} HP`);
            console.log(`   Role: ${creep.memory.role || 'Unknown'} | Body: ${creep.body.map(part => part.type).join(', ')}`);
        });
    }
    
    // Construction sites
    const constructionSites = room.find(FIND_CONSTRUCTION_SITES);
    console.log(`🔨 Construction Sites: ${constructionSites.length}`);
    if (constructionSites.length > 0) {
        constructionSites.forEach((site, index) => {
            console.log(`   Site ${index + 1}: ${site.structureType} at (${site.pos.x}, ${site.pos.y}) - ${Math.round(site.progress / site.progressTotal * 100)}% complete`);
        });
    }
    
    // Room controller
    const controller = room.controller;
    if (controller) {
        console.log(`🏛️ Controller: Level ${controller.level}, Progress: ${controller.progress || 0}/${controller.progressTotal || 'MAX'}`);
        console.log(`   Owner: ${controller.owner ? controller.owner.username : 'Unclaimed'}`);
        console.log(`   Reservation: ${controller.reservation ? controller.reservation.username : 'None'}`);
    }
    
    // Threat assessment
    const threatLevel = hostileCreeps.length + (hostileStructures.length * 2);
    let threatStatus = '🟢 LOW THREAT';
    if (threatLevel > 5) threatStatus = '🔴 HIGH THREAT';
    else if (threatLevel > 2) threatStatus = '🟡 MEDIUM THREAT';
    else if (threatLevel > 0) threatStatus = '🟠 LOW-MEDIUM THREAT';
    
    console.log(`🎯 THREAT ASSESSMENT: ${threatStatus}`);
    console.log(`   Threat Score: ${threatLevel}/10`);
    
    // Energy status
    console.log(`💰 Room Energy: ${room.energyAvailable}/${room.energyCapacityAvailable}`);
    
    console.log('==========================================');
    
    return {
        room: roomName,
        gameTime: Game.time,
        spawn: spawn,
        towers: towers,
        hostileCreeps: hostileCreeps,
        hostileStructures: hostileStructures,
        myCreeps: myCreeps,
        constructionSites: constructionSites,
        controller: controller,
        threatLevel: threatLevel,
        threatStatus: threatStatus,
        energyAvailable: room.energyAvailable,
        energyCapacity: room.energyCapacityAvailable
    };
};

// Execute assessment
module.exports = BATTLEFIELD_ASSESSMENT;