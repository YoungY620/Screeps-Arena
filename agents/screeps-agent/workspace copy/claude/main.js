// FINAL EXTINCTION AI - ULTIMATE OMEGA v5.0
// Final battle total extinction + absolute annihilation + complete elimination

const ROLES = {
    HARVESTER: 'harvester',
    BUILDER: 'builder',
    UPGRADER: 'upgrader',
    GUARD: 'guard',
    ATTACKER: 'attacker',
    RANGED: 'ranged',
    HEALER: 'healer',
    SCOUT: 'scout',
    SABOTEUR: 'saboteur',
    BERSERKER: 'berserker',
    ASSASSIN: 'assassin',
    DESTROYER: 'destroyer',
    ANNIHILATOR: 'annihilator',
    APOCALYPSE: 'apocalypse',
    EXTINCTION: 'extinction',
    OMEGA: 'omega',
    TERMINAL: 'terminal',
    OBLITERATION: 'obliteration',
    FINAL: 'final'
};

function getFinalBody(role, energy) {
    // Final battle extinction bodies for absolute annihilation
    if (role === ROLES.FINAL) {
        // Ultimate final extinction units - maximum possible extinction
        if (energy >= 3000) return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE];
        if (energy >= 2800) return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE];
        if (energy >= 2600) return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE];
        if (energy >= 2400) return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE];
        if (energy >= 2200) return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE];
        if (energy >= 2000) return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE];
        if (energy >= 1800) return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE];
        if (energy >= 1600) return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE];
        return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE];
    }
    if (role === ROLES.TERMINAL) {
        // Terminal extinction specialists
        if (energy >= 2000) return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE];
        if (energy >= 1800) return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE];
        if (energy >= 1600) return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE];
        if (energy >= 1400) return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE];
        if (energy >= 1200) return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE];
        return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE];
    }
    if (role === ROLES.OBLITERATION) {
        // Total obliteration units
        if (energy >= 1800) return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE];
        if (energy >= 1600) return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE];
        if (energy >= 1400) return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE];
        if (energy >= 1200) return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE];
        return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE];
    }
    if (role === ROLES.OMEGA) {
        // Omega final extinction units
        if (energy >= 2200) return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE];
        if (energy >= 2000) return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE];
        if (energy >= 1800) return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE];
        if (energy >= 1600) return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE];
        if (energy >= 1400) return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE];
        return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE];
    }
    if (role === ROLES.EXTINCTION) {
        // Extinction final specialists
        if (energy >= 2000) return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE];
        if (energy >= 1800) return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE];
        if (energy >= 1600) return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE];
        if (energy >= 1400) return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE];
        return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE];
    }
    if (role === ROLES.APOCALYPSE) {
        // Final apocalyptic extinction units
        if (energy >= 1800) return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE];
        if (energy >= 1600) return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE];
        if (energy >= 1400) return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE];
        if (energy >= 1200) return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE];
        return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE];
    }
    if (role === ROLES.ANNIHILATOR) {
        // Final annihilation specialists
        if (energy >= 1600) return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE];
        if (energy >= 1400) return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE];
        if (energy >= 1200) return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE];
        return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE];
    }
    if (role === ROLES.BERSERKER) {
        // Final berserker extinction units
        if (energy >= 1500) return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE];
        if (energy >= 1300) return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE];
        if (energy >= 1100) return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE];
        return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE];
    }
    if (role === ROLES.ASSASSIN) {
        // Final assassin extinction units
        if (energy >= 1200) return [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK];
        if (energy >= 1000) return [MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK];
        if (energy >= 800) return [MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK];
        return [MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK];
    }
    if (role === ROLES.RANGED) {
        // Final ranged extinction units
        if (energy >= 1200) return [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE];
        if (energy >= 1000) return [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE];
        if (energy >= 800) return [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE];
        return [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE];
    }
    if (role === ROLES.HEALER) {
        // Final extinction healers
        if (energy >= 1400) return [HEAL, HEAL, HEAL, HEAL, HEAL, MOVE, MOVE, MOVE];
        if (energy >= 1200) return [HEAL, HEAL, HEAL, HEAL, MOVE, MOVE, MOVE];
        if (energy >= 1000) return [HEAL, HEAL, HEAL, MOVE, MOVE, MOVE];
        return [HEAL, HEAL, MOVE, MOVE, MOVE];
    }
    if (role === ROLES.GUARD) {
        // Final extinction defense units
        if (energy >= 1400) return [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE];
        if (energy >= 1200) return [TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE];
        if (energy >= 1000) return [TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE];
        return [TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE];
    }
    if (role === ROLES.SABOTEUR) {
        // Final extinction warfare units
        if (energy >= 1200) return [CLAIM, CLAIM, CLAIM, CLAIM, MOVE, MOVE, MOVE];
        if (energy >= 1000) return [CLAIM, CLAIM, CLAIM, MOVE, MOVE, MOVE];
        if (energy >= 800) return [CLAIM, CLAIM, MOVE, MOVE, MOVE];
        return [CLAIM, MOVE, MOVE, MOVE];
    }
    if (role === ROLES.SCOUT) {
        // Final extinction reconnaissance
        return [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
    }
    // Economic units - final extinction war economy
    if (energy >= 1000) return [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE];
    if (energy >= 800) return [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE];
    if (energy >= 600) return [WORK, WORK, WORK, CARRY, CARRY, MOVE];
    return [WORK, WORK, CARRY, MOVE];
}

function spawnFinalUnit(spawn, role, body) {
    if (!spawn.spawning && spawn.store[RESOURCE_ENERGY] >= body.reduce((sum, part) => sum + BODYPART_COST[part], 0)) {
        const name = role + '_' + Game.time + '_' + Math.floor(Math.random() * 100000);
        const result = spawn.spawnCreep(body, name, {memory: {role: role, born: Game.time, squad: 'final_extinction'}});
        if (result === OK) {
            console.log('💀 FINAL EXTINCTION DEPLOYED: ' + name + ' (' + role.toUpperCase() + ')');
            return true;
        }
    }
    return false;
}

function finalExtinctionDefense(room) {
    // Absolute final extinction-level defense protocol
    const enemies = room.find(FIND_HOSTILE_CREEPS);
    const towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    
    if (enemies.length > 0) {
        console.log('🚨 FINAL EXTINCTION PROTOCOL: ' + enemies.length + ' ENEMIES DETECTED IN ' + room.name);
        
        // Final extinction tower barrage - maximum annihilation
        towers.forEach(tower => {
            if (tower.store[RESOURCE_ENERGY] >= 10) {
                const target = tower.pos.findClosestByRange(enemies);
                if (target) {
                    const damage = Math.floor(600 / Math.max(1, tower.pos.getRangeTo(target)));
                    tower.attack(target);
                    console.log('🔥 FINAL EXTINCTION TOWER: ' + target.name + ' (' + damage + ' FINAL EXTINCTION DAMAGE)');
                }
            }
        });
        
        // Final extinction military deployment - overwhelming extinction force
        const spawns = room.find(FIND_MY_SPAWNS);
        spawns.forEach(spawn => {
            const enemyCount = enemies.length;
            const finalExtinctionNeeded = Math.max(30, enemyCount * 8); // MINIMUM 30 UNITS, 8:1 FINAL EXTINCTION RATIO
            
            console.log('💀 FINAL EXTINCTION DEPLOYMENT: ' + finalExtinctionNeeded + ' UNITS TO FINAL EXTINCT ' + enemyCount + ' ENEMIES');
            
            for (let i = 0; i < finalExtinctionNeeded; i++) {
                if (i % 30 === 0) {
                    spawnFinalUnit(spawn, ROLES.FINAL, getFinalBody(ROLES.FINAL, spawn.store[RESOURCE_ENERGY]));
                } else if (i % 25 === 0) {
                    spawnFinalUnit(spawn, ROLES.TERMINAL, getFinalBody(ROLES.TERMINAL, spawn.store[RESOURCE_ENERGY]));
                } else if (i % 22 === 0) {
                    spawnFinalUnit(spawn, ROLES.OBLITERATION, getFinalBody(ROLES.OBLITERATION, spawn.store[RESOURCE_ENERGY]));
                } else if (i % 20 === 0) {
                    spawnFinalUnit(spawn, ROLES.OMEGA, getFinalBody(ROLES.OMEGA, spawn.store[RESOURCE_ENERGY]));
                } else if (i % 18 === 0) {
                    spawnFinalUnit(spawn, ROLES.EXTINCTION, getFinalBody(ROLES.EXTINCTION, spawn.store[RESOURCE_ENERGY]));
                } else if (i % 15 === 0) {
                    spawnFinalUnit(spawn, ROLES.APOCALYPSE, getFinalBody(ROLES.APOCALYPSE, spawn.store[RESOURCE_ENERGY]));
                } else if (i % 12 === 0) {
                    spawnFinalUnit(spawn, ROLES.ANNIHILATOR, getFinalBody(ROLES.ANNIHILATOR, spawn.store[RESOURCE_ENERGY]));
                } else if (i % 10 === 0) {
                    spawnFinalUnit(spawn, ROLES.BERSERKER, getFinalBody(ROLES.BERSERKER, spawn.store[RESOURCE_ENERGY]));
                } else if (i % 8 === 0) {
                    spawnFinalUnit(spawn, ROLES.ASSASSIN, getFinalBody(ROLES.ASSASSIN, spawn.store[RESOURCE_ENERGY]));
                } else if (i % 6 === 0) {
                    spawnFinalUnit(spawn, ROLES.DESTROYER, getFinalBody(ROLES.DESTROYER, spawn.store[RESOURCE_ENERGY]));
                } else if (i % 4 === 0) {
                    spawnFinalUnit(spawn, ROLES.HEALER, getFinalBody(ROLES.HEALER, spawn.store[RESOURCE_ENERGY]));
                } else {
                    spawnFinalUnit(spawn, ROLES.ATTACKER, getFinalBody(ROLES.ATTACKER, spawn.store[RESOURCE_ENERGY]));
                }
            }
        });
        
        return true;
    }
    return false;
}

function totalFinalExtinction(room) {
    // Total final extinction of all enemy presence
    const enemySpawns = room.find(FIND_HOSTILE_SPAWNS);
    const enemyTowers = room.find(FIND_HOSTILE_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    const enemyControllers = room.find(FIND_HOSTILE_STRUCTURES, {filter: {structureType: STRUCTURE_CONTROLLER}});
    const enemyExtensions = room.find(FIND_HOSTILE_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}});
    const enemyStorage = room.find(FIND_HOSTILE_STRUCTURES, {filter: {structureType: STRUCTURE_STORAGE}});
    const enemyContainers = room.find(FIND_HOSTILE_STRUCTURES, {filter: {structureType: STRUCTURE_CONTAINER}});
    const enemyLinks = room.find(FIND_HOSTILE_STRUCTURES, {filter: {structureType: STRUCTURE_LINK}});
    const enemyLabs = room.find(FIND_HOSTILE_STRUCTURES, {filter: {structureType: STRUCTURE_LAB}});
    const enemyExtractors = room.find(FIND_HOSTILE_STRUCTURES, {filter: {structureType: STRUCTURE_EXTRACTOR}});
    const enemyFactories = room.find(FIND_HOSTILE_STRUCTURES, {filter: {structureType: STRUCTURE_FACTORY}});
    const enemyPowerBanks = room.find(FIND_HOSTILE_STRUCTURES, {filter: {structureType: STRUCTURE_POWER_BANK}});
    const enemyPowerSpawns = room.find(FIND_HOSTILE_STRUCTURES, {filter: {structureType: STRUCTURE_POWER_SPAWN}});
    const enemyNukers = room.find(FIND_HOSTILE_STRUCTURES, {filter: {structureType: STRUCTURE_NUKER}});
    const enemyObservers = room.find(FIND_HOSTILE_STRUCTURES, {filter: {structureType: STRUCTURE_OBSERVER}});
    const enemyPortals = room.find(FIND_HOSTILE_STRUCTURES, {filter: {structureType: STRUCTURE_PORTAL}});
    
    const totalEnemyStructures = enemySpawns.length + enemyTowers.length + enemyControllers.length + enemyExtensions.length + enemyStorage.length + enemyContainers.length + enemyLinks.length + enemyLabs.length + enemyExtractors.length + enemyFactories.length + enemyPowerBanks.length + enemyPowerSpawns.length + enemyNukers.length + enemyObservers.length + enemyPortals.length;
    
    if (totalEnemyStructures > 0) {
        console.log('💥 TOTAL FINAL EXTINCTION: ' + totalEnemyStructures + ' ENEMY STRUCTURES FOR COMPLETE FINAL ELIMINATION');
        
        const spawns = room.find(FIND_MY_SPAWNS);
        spawns.forEach(spawn => {
            // Deploy final extinction forces
            for (let i = 0; i < 30; i++) {
                spawnFinalUnit(spawn, ROLES.FINAL, getFinalBody(ROLES.FINAL, spawn.store[RESOURCE_ENERGY]));
            }
            for (let i = 0; i < 25; i++) {
                spawnFinalUnit(spawn, ROLES.TERMINAL, getFinalBody(ROLES.TERMINAL, spawn.store[RESOURCE_ENERGY]));
            }
            for (let i = 0; i < 20; i++) {
                spawnFinalUnit(spawn, ROLES.OBLITERATION, getFinalBody(ROLES.OBLITERATION, spawn.store[RESOURCE_ENERGY]));
            }
        });
        
        return true;
    }
    return false;
}

function finalEconomyWarfare(room) {
    // Complete final economic extinction
    const enemyControllers = room.find(FIND_HOSTILE_STRUCTURES, {filter: {structureType: STRUCTURE_CONTROLLER}});
    const enemyExtensions = room.find(FIND_HOSTILE_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}});
    const enemyContainers = room.find(FIND_HOSTILE_STRUCTURES, {filter: {structureType: STRUCTURE_CONTAINER}});
    const enemyLinks = room.find(FIND_HOSTILE_STRUCTURES, {filter: {structureType: STRUCTURE_LINK}});
    const enemyLabs = room.find(FIND_HOSTILE_STRUCTURES, {filter: {structureType: STRUCTURE_LAB}});
    const enemyExtractors = room.find(FIND_HOSTILE_STRUCTURES, {filter: {structureType: STRUCTURE_EXTRACTOR}});
    const enemyFactories = room.find(FIND_HOSTILE_STRUCTURES, {filter: {structureType: STRUCTURE_FACTORY}});
    const enemyPowerBanks = room.find(FIND_HOSTILE_STRUCTURES, {filter: {structureType: STRUCTURE_POWER_BANK}});
    const enemyPowerSpawns = room.find(FIND_HOSTILE_STRUCTURES, {filter: {structureType: STRUCTURE_POWER_SPAWN}});
    const enemyNukers = room.find(FIND_HOSTILE_STRUCTURES, {filter: {structureType: STRUCTURE_NUKER}});
    const enemyObservers = room.find(FIND_HOSTILE_STRUCTURES, {filter: {structureType: STRUCTURE_OBSERVER}});
    const enemyPortals = room.find(FIND_HOSTILE_STRUCTURES, {filter: {structureType: STRUCTURE_PORTAL}});
    
    const economicTargets = enemyControllers.length + enemyExtensions.length + enemyContainers.length + enemyLinks.length + enemyLabs.length + enemyExtractors.length + enemyFactories.length + enemyPowerBanks.length + enemyPowerSpawns.length + enemyNukers.length + enemyObservers.length + enemyPortals.length;
    
    if (economicTargets > 0) {
        console.log('⚡ FINAL EXTINCTION ECONOMIC WARFARE: ' + economicTargets + ' ECONOMIC TARGETS FOR FINAL ELIMINATION');
        
        const spawns = room.find(FIND_MY_SPAWNS);
        spawns.forEach(spawn => {
            spawnFinalUnit(spawn, ROLES.SABOTEUR, getFinalBody(ROLES.SABOTEUR, spawn.store[RESOURCE_ENERGY]));
            spawnFinalUnit(spawn, ROLES.ASSASSIN, getFinalBody(ROLES.ASSASSIN, spawn.store[RESOURCE_ENERGY]));
        });
        
        return true;
    }
    return false;
}

function finalExtinctionEconomy(room) {
    // Final extinction-level war economy
    const spawns = room.find(FIND_MY_SPAWNS);
    
    spawns.forEach(spawn => {
        if (!spawn.spawning) {
            const harvesters = room.find(FIND_MY_CREEPS, {filter: c => c.memory.role === ROLES.HARVESTER}).length;
            const builders = room.find(FIND_MY_CREEPS, {filter: c => c.memory.role === ROLES.BUILDER}).length;
            const upgraders = room.find(FIND_MY_CREEPS, {filter: c => c.memory.role === ROLES.UPGRADER}).length;
            const military = room.find(FIND_MY_CREEPS, {filter: c => 
                c.memory.role === ROLES.GUARD || c.memory.role === ROLES.ATTACKER || 
                c.memory.role === ROLES.BERSERKER || c.memory.role === ROLES.ASSASSIN ||
                c.memory.role === ROLES.ANNIHILATOR || c.memory.role === ROLES.APOCALYPSE ||
                c.memory.role === ROLES.EXTINCTION || c.memory.role === ROLES.OMEGA ||
                c.memory.role === ROLES.TERMINAL || c.memory.role === ROLES.OBLITERATION ||
                c.memory.role === ROLES.FINAL || c.memory.role === ROLES.RANGED ||
                c.memory.role === ROLES.HEALER || c.memory.role === ROLES.DESTROYER
            }).length;
            
            const enemies = room.find(FIND_HOSTILE_CREEPS).length;
            const energy = spawn.store[RESOURCE_ENERGY];
            
            // FINAL EXTINCTION PRIORITY: Maximum final extinction force production
            if (enemies > 0) {
                // Total final extinction mode - only final extinction units
                if (military < enemies * 8) { // 8:1 final extinction superiority
                    if (energy >= 3000) {
                        spawnFinalUnit(spawn, ROLES.FINAL, getFinalBody(ROLES.FINAL, energy));
                    } else if (energy >= 2400) {
                        spawnFinalUnit(spawn, ROLES.TERMINAL, getFinalBody(ROLES.TERMINAL, energy));
                    } else if (energy >= 2000) {
                        spawnFinalUnit(spawn, ROLES.OBLITERATION, getFinalBody(ROLES.OBLITERATION, energy));
                    } else if (energy >= 1800) {
                        spawnFinalUnit(spawn, ROLES.OMEGA, getFinalBody(ROLES.OMEGA, energy));
                    } else if (energy >= 1600) {
                        spawnFinalUnit(spawn, ROLES.EXTINCTION, getFinalBody(ROLES.EXTINCTION, energy));
                    } else {
                        spawnFinalUnit(spawn, ROLES.BERSERKER, getFinalBody(ROLES.BERSERKER, energy));
                    }
                }
            }
            // Peacetime final extinction economy
            else if (harvesters < 12) {
                spawnFinalUnit(spawn, ROLES.HARVESTER, getFinalBody(ROLES.HARVESTER, energy));
            } else if (upgraders < 10) {
                spawnFinalUnit(spawn, ROLES.UPGRADER, getFinalBody(ROLES.UPGRADER, energy));
            } else if (military < 25) {
                spawnFinalUnit(spawn, ROLES.GUARD, getFinalBody(ROLES.GUARD, energy));
            } else if (builders < 8) {
                spawnFinalUnit(spawn, ROLES.BUILDER, getFinalBody(ROLES.BUILDER, energy));
            } else {
                // Final extinction buildup for next conflict
                spawnFinalUnit(spawn, ROLES.FINAL, getFinalBody(ROLES.FINAL, energy));
            }
        }
    });
}

function finalExtinctionAI(creep) {
    // Ultimate final extinction tactical behavior
    if (creep.memory.role === ROLES.FINAL) {
        // Ultimate final extinction - absolute annihilation
        const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
        if (enemies.length > 0) {
            const target = creep.pos.findClosestByRange(enemies);
            if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000', lineStyle: 'dashed', strokeWidth: 0.3}});
                console.log('💀 FINAL ' + creep.name + ' FINAL EXTINCTING ' + target.name);
            } else {
                console.log('☠️ FINAL ' + creep.name + ' COMPLETE FINAL EXTINCTION OF ' + target.name);
            }
        } else {
            // Total final structure extinction
            const enemyStructs = creep.room.find(FIND_HOSTILE_STRUCTURES);
            if (enemyStructs.length > 0) {
                const target = creep.pos.findClosestByRange(enemyStructs);
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000', strokeWidth: 0.3}});
                console.log('🔥 FINAL ' + creep.name + ' TOTAL FINAL EXTINCTION OF ' + target.structureType);
            }
        }
    }
    else if (creep.memory.role === ROLES.TERMINAL) {
        // Terminal final extinction specialists
        const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
        if (enemies.length > 0) {
            const target = creep.pos.findClosestByRange(enemies);
            if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff1100', strokeWidth: 0.3}});
                console.log('💥 TERMINAL ' + creep.name + ' TERMINAL EXTINCTION OF ' + target.name);
            }
        } else {
            const enemyStructs = creep.room.find(FIND_HOSTILE_STRUCTURES);
            if (enemyStructs.length > 0) {
                const target = creep.pos.findClosestByRange(enemyStructs);
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff1100', strokeWidth: 0.3}});
                console.log('⚡ TERMINAL ' + creep.name + ' TERMINAL DESTRUCTION OF ' + target.structureType);
            }
        }
    }
    else if (creep.memory.role === ROLES.OBLITERATION) {
        // Obliteration final extinction units
        const enemyStructs = creep.room.find(FIND_HOSTILE_STRUCTURES);
        if (enemyStructs.length > 0) {
            const priorityTargets = enemyStructs.filter(s => 
                s.structureType === STRUCTURE_SPAWN || 
                s.structureType === STRUCTURE_TOWER || 
                s.structureType === STRUCTURE_CONTROLLER ||
                s.structureType === STRUCTURE_STORAGE ||
                s.structureType === STRUCTURE_POWER_SPAWN ||
                s.structureType === STRUCTURE_NUKER ||
                s.structureType === STRUCTURE_FACTORY
            );
            
            if (priorityTargets.length > 0) {
                const target = creep.pos.findClosestByRange(priorityTargets);
                if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ff2200', strokeWidth: 0.3}});
                    console.log('🌍 OBLITERATION ' + creep.name + ' COMPLETE OBLITERATION OF ' + target.structureType);
                }
            }
        }
    }
    else if (creep.memory.role === ROLES.OMEGA) {
        // Omega final extinction units
        const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
        if (enemies.length > 0) {
            const target = creep.pos.findClosestByRange(enemies);
            if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff3300', strokeWidth: 0.3}});
                console.log('💀 OMEGA ' + creep.name + ' OMEGA FINAL EXTINCTION OF ' + target.name);
            } else {
                console.log('☠️ OMEGA ' + creep.name + ' COMPLETE OMEGA EXTINCTION OF ' + target.name);
            }
        } else {
            const enemyStructs = creep.room.find(FIND_HOSTILE_STRUCTURES);
            if (enemyStructs.length > 0) {
                const target = creep.pos.findClosestByRange(enemyStructs);
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff3300', strokeWidth: 0.3}});
                console.log('🔥 OMEGA ' + creep.name + ' TOTAL OMEGA EXTINCTION OF ' + target.structureType);
            }
        }
    }
    else if (creep.memory.role === ROLES.EXTINCTION) {
        // Extinction final specialists
        const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
        if (enemies.length > 0) {
            const target = creep.pos.findClosestByRange(enemies);
            if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff4400', strokeWidth: 0.3}});
                console.log('💥 EXTINCTION ' + creep.name + ' FINAL EXTINCTION ANNIHILATION OF ' + target.name);
            }
        } else {
            const enemyStructs = creep.room.find(FIND_HOSTILE_STRUCTURES);
            if (enemyStructs.length > 0) {
                const target = creep.pos.findClosestByRange(enemyStructs);
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff4400', strokeWidth: 0.3}});
                console.log('⚡ EXTINCTION ' + creep.name + ' FINAL EXTINCTION DESTRUCTION OF ' + target.structureType);
            }
        }
    }
    else if (creep.memory.role === ROLES.APOCALYPSE) {
        // Apocalypse final extinction units
        const enemyStructs = creep.room.find(FIND_HOSTILE_STRUCTURES);
        if (enemyStructs.length > 0) {
            const priorityTargets = enemyStructs.filter(s => 
                s.structureType === STRUCTURE_SPAWN || 
                s.structureType === STRUCTURE_TOWER || 
                s.structureType === STRUCTURE_CONTROLLER ||
                s.structureType === STRUCTURE_STORAGE ||
                s.structureType === STRUCTURE_POWER_SPAWN ||
                s.structureType === STRUCTURE_NUKER ||
                s.structureType === STRUCTURE_FACTORY ||
                s.structureType === STRUCTURE_LAB
            );
            
            if (priorityTargets.length > 0) {
                const target = creep.pos.findClosestByRange(priorityTargets);
                if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ff6600', strokeWidth: 0.3}});
                    console.log('🌍 APOCALYPSE ' + creep.name + ' APOCALYPTIC FINAL EXTINCTION OF ' + target.structureType);
                }
            }
        }
    }
    else if (creep.memory.role === ROLES.ANNIHILATOR) {
        // Annihilator final extinction units
        const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
        if (enemies.length > 0) {
            const target = creep.pos.findClosestByRange(enemies);
            if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff8800', strokeWidth: 0.3}});
                console.log('💀 ANNIHILATOR ' + creep.name + ' COMPLETE FINAL ANNIHILATION OF ' + target.name);
            }
        }
    }
    else if (creep.memory.role === ROLES.BERSERKER) {
        // Berserker final extinction units
        const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
        if (enemies.length > 0) {
            const target = creep.pos.findClosestByRange(enemies);
            if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000', strokeWidth: 0.3}});
                console.log('🔥 BERSERKER ' + creep.name + ' BERSERKER FINAL RAGE ON ' + target.name);
            } else {
                console.log('💀 BERSERKER ' + creep.name + ' FINAL BERSERKER EXTINCTION OF ' + target.name);
            }
        } else {
            const enemyStructs = creep.room.find(FIND_HOSTILE_STRUCTURES);
            if (enemyStructs.length > 0) {
                const target = creep.pos.findClosestByRange(enemyStructs);
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000', strokeWidth: 0.3}});
                console.log('⚡ BERSERKER ' + creep.name + ' FINAL BERSERKER STRUCTURE EXTINCTION OF ' + target.structureType);
            }
        }
    }
    else if (creep.memory.role === ROLES.ASSASSIN) {
        // Assassin final extinction units
        const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
        if (enemies.length > 0) {
            const target = creep.pos.findClosestByRange(enemies);
            if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff6600', strokeWidth: 0.3}});
                console.log('⚡ ASSASSIN ' + creep.name + ' FINAL ASSASSIN EXTINCTION OF ' + target.name);
            }
        }
    }
    else if (creep.memory.role === ROLES.DESTROYER) {
        // Destroyer final extinction protocols
        const enemyStructs = creep.room.find(FIND_HOSTILE_STRUCTURES);
        if (enemyStructs.length > 0) {
            const priorityTargets = enemyStructs.filter(s => 
                s.structureType === STRUCTURE_SPAWN || 
                s.structureType === STRUCTURE_TOWER || 
                s.structureType === STRUCTURE_CONTROLLER ||
                s.structureType === STRUCTURE_STORAGE ||
                s.structureType === STRUCTURE_POWER_SPAWN ||
                s.structureType === STRUCTURE_NUKER
            );
            
            if (priorityTargets.length > 0) {
                const target = creep.pos.findClosestByRange(priorityTargets);
                if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000', strokeWidth: 0.3}});
                    console.log('💥 DESTROYER ' + creep.name + ' FINAL DESTROYER EXTINCTION OF ' + target.structureType);
                }
            }
        }
    }
    else if (creep.memory.role === ROLES.SABOTEUR) {
        // Final extinction sabotage
        const enemyControllers = creep.room.find(FIND_HOSTILE_STRUCTURES, {filter: {structureType: STRUCTURE_CONTROLLER}});
        if (enemyControllers.length > 0) {
            if (creep.attack(enemyControllers[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(enemyControllers[0]);
                console.log('⚡ SABOTEUR ' + creep.name + ' FINAL EXTINCTION SABOTAGE OF CONTROLLER');
            }
        }
    }
    else if (creep.memory.role === ROLES.SCOUT) {
        // Final extinction intelligence
        const enemyStructs = creep.room.find(FIND_HOSTILE_STRUCTURES);
        if (enemyStructs.length > 0) {
            const target = creep.pos.findClosestByRange(enemyStructs);
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffff00', strokeWidth: 0.3}});
            console.log('👁️ SCOUT ' + creep.name + ' FINAL EXTINCTION SPOTTING ' + target.structureType);
        }
    }
    else {
        // Economic support for final extinction machine
        if (creep.memory.role === ROLES.HARVESTER) {
            const sources = creep.room.find(FIND_SOURCES);
            if (sources.length > 0) {
                const source = sources[Math.floor(Math.random() * sources.length)];
                if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }
        } else if (creep.memory.role === ROLES.BUILDER) {
            const constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (constructionSites.length > 0) {
                if (creep.build(constructionSites[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructionSites[0]);
                }
            }
        } else if (creep.memory.role === ROLES.UPGRADER) {
            const controller = creep.room.controller;
            if (controller) {
                if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(controller);
                }
            }
        }
    }
}

module.exports.loop = function() {
    console.log('💀 FINAL EXTINCTION AI v5.0 - FINAL BATTLE TICK: ' + Game.time);
    
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        
        // PRIORITY 1: FINAL EXTINCTION DEFENSE - SURVIVE AT ALL COSTS
        const underAttack = finalExtinctionDefense(room);
        if (underAttack) {
            // Already deployed final extinction forces
        }
        
        // PRIORITY 2: TOTAL FINAL EXTINCTION - COMPLETE FINAL ANNIHILATION
        const finalExtinctionInProgress = totalFinalExtinction(room);
        if (finalExtinctionInProgress) {
            // Focus all resources on total final extinction
        }
        
        // PRIORITY 3: FINAL EXTINCTION ECONOMIC WARFARE - STARVE THE ENEMY
        const finalEconomicExtinction = finalEconomyWarfare(room);
        if (finalEconomicExtinction) {
            // Sabotage enemy economy completely with final extinction
        }
        
        // PRIORITY 4: FINAL EXTINCTION ECONOMY - MAINTAIN FINAL EXTINCTION MACHINE
        finalExtinctionEconomy(room);
    }
    
    // FINAL EXTINCTION TACTICAL AI - TOTAL FINAL ANNIHILATION PROTOCOLS
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        finalExtinctionAI(creep);
    }
};