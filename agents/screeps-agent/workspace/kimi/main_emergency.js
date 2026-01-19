// KIMI AI - EMERGENCY PvP PROTOCOL
// CRITICAL THREAT LEVEL: 34 ENEMY CREEPS DETECTED
// IMMEDIATE ACTION: Emergency defense + rapid military buildup

const ROLE_HARVESTER = 'harvester';
const ROLE_UPGRADER = 'upgrader';
const ROLE_BUILDER = 'builder';
const ROLE_SOLDIER = 'soldier';
const ROLE_RANGED = 'ranged';
const ROLE_HEALER = 'healer';
const ROLE_SCOUT = 'scout';

// EMERGENCY PARAMETERS - More aggressive response
const ENEMY_CHECK_INTERVAL = 3; // Check every 3 ticks
const DEFENSE_MODE_THRESHOLD = 1; // ANY enemy triggers defense
const CRITICAL_MILITARY_MASS = 10; // Need 10+ military units ASAP

// Cost-effective emergency templates
const EMERGENCY_SOLDIER = [ATTACK, MOVE, MOVE]; // 180 energy - fast spawn
const EMERGENCY_RANGED = [RANGED_ATTACK, MOVE, MOVE]; // 250 energy
const EMERGENCY_HEALER = [HEAL, MOVE, MOVE]; // 350 energy
const EMERGENCY_HARVESTER = [WORK, CARRY, MOVE]; // 200 energy - cheaper

// Emergency game state
let gameState = {
    defenseMode: true, // Always in defense mode with this threat level
    enemyDetected: false,
    lastEnemyCheck: 0,
    emergencyPhase: true,
    militaryCount: 0,
    enemyPositions: []
};

module.exports.loop = function () {
    try {
        // Clear memory
        clearDeadMemory();
        
        // EMERGENCY: Check for enemies immediately
        checkEmergencyThreats();
        
        // Run emergency defense protocols
        runEmergencyDefense();
        
        // Spawn emergency units
        spawnEmergencyUnits();
        
        // Control all creeps with emergency protocols
        controlEmergencyCreeps();
        
        // Build emergency defenses
        buildEmergencyStructures();
        
        // Log emergency status
        if (Game.time % 10 === 0) {
            logEmergencyStatus();
        }
        
    } catch (error) {
        console.log(`🚨 EMERGENCY ERROR: ${error.message}`);
    }
};

function clearDeadMemory() {
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
}

function checkEmergencyThreats() {
    // Check for enemies more frequently in emergency
    if (Game.time - gameState.lastEnemyCheck >= ENEMY_CHECK_INTERVAL) {
        const enemies = findEnemies();
        gameState.enemyDetected = enemies.length > 0;
        gameState.enemyPositions = enemies.map(e => ({room: e.room.name, x: e.x, y: e.y}));
        gameState.lastEnemyCheck = Game.time;
        
        if (gameState.enemyDetected) {
            console.log(`🚨 ENEMY DETECTED: ${enemies.length} hostile creeps!`);
        }
    }
}

function findEnemies() {
    let enemies = [];
    for (let roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        const hostiles = room.find(FIND_HOSTILE_CREEPS);
        enemies = enemies.concat(hostiles);
    }
    return enemies;
}

function runEmergencyDefense() {
    if (!gameState.enemyDetected) return;
    
    console.log('🛡️ EMERGENCY DEFENSE ACTIVATED!');
    
    // Use all available creeps for defense
    const enemies = findEnemies();
    if (enemies.length > 0) {
        const target = enemies[0]; // Focus fire on first enemy
        
        for (let name in Game.creeps) {
            const creep = Game.creeps[name];
            
            // Even harvesters can help if enemy is close
            if (creep.memory.role === ROLE_HARVESTER && creep.pos.getRangeTo(target) <= 3) {
                // Harvesters flee from enemies
                fleeFromEnemy(creep, target);
                continue;
            }
            
            // Military units attack
            if (creep.memory.role === ROLE_SOLDIER && creep.attack) {
                if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000' } });
                }
            } else if (creep.memory.role === ROLE_RANGED && creep.rangedAttack) {
                const range = creep.pos.getRangeTo(target);
                if (range <= 3) {
                    creep.rangedAttack(target);
                } else {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000' } });
                }
            }
        }
    }
}

function fleeFromEnemy(creep, enemy) {
    const spawn = Game.spawns.Spawn1;
    if (spawn) {
        const fleeDirection = new RoomPosition(
            creep.pos.x + (creep.pos.x - enemy.pos.x),
            creep.pos.y + (creep.pos.y - enemy.pos.y),
            creep.room.name
        );
        creep.moveTo(fleeDirection, { visualizePathStyle: { stroke: '#ffff00' } });
    }
}

function spawnEmergencyUnits() {
    const spawn = Game.spawns.Spawn1;
    if (!spawn || spawn.spawning) return;
    
    const room = spawn.room;
    const energyAvailable = room.energyAvailable;
    
    // Count current creeps by role
    const counts = countCreeps();
    gameState.militaryCount = counts.soldier + counts.ranged + counts.healer;
    
    console.log(`📊 Emergency status: ${counts.harvester}H, ${counts.soldier}S, ${counts.ranged}R, ${counts.healer}H, Energy: ${energyAvailable}`);
    
    // EMERGENCY PRIORITY 1: Military units if enemies detected
    if (gameState.enemyDetected) {
        if (counts.soldier < 5 && energyAvailable >= 180) {
            spawnCreep(spawn, ROLE_SOLDIER, EMERGENCY_SOLDIER);
            return;
        }
        if (counts.ranged < 3 && energyAvailable >= 250) {
            spawnCreep(spawn, ROLE_RANGED, EMERGENCY_RANGED);
            return;
        }
        if (counts.healer < 2 && energyAvailable >= 350) {
            spawnCreep(spawn, ROLE_HEALER, EMERGENCY_HEALER);
            return;
        }
    }
    
    // EMERGENCY PRIORITY 2: Minimum economy
    if (counts.harvester < 3 && energyAvailable >= 200) {
        spawnCreep(spawn, ROLE_HARVESTER, EMERGENCY_HARVESTER);
        return;
    }
    
    // EMERGENCY PRIORITY 3: Buildup military regardless
    if (gameState.militaryCount < CRITICAL_MILITARY_MASS) {
        if (counts.soldier < 8 && energyAvailable >= 180) {
            spawnCreep(spawn, ROLE_SOLDIER, EMERGENCY_SOLDIER);
            return;
        }
        if (counts.ranged < 5 && energyAvailable >= 250) {
            spawnCreep(spawn, ROLE_RANGED, EMERGENCY_RANGED);
            return;
        }
    }
    
    // EMERGENCY PRIORITY 4: Upgraders for room growth
    if (counts.upgrader < 2 && energyAvailable >= 300) {
        spawnCreep(spawn, ROLE_UPGRADER, [WORK, CARRY, MOVE, MOVE]);
        return;
    }
}

function spawnCreep(spawn, role, body) {
    const result = spawn.spawnCreep(body, `${role}_${Game.time}`, {
        memory: { role: role, emergency: true }
    });
    
    if (result === OK) {
        console.log(`🐣 EMERGENCY SPAWN: ${role} (${body.join(",")})`);
    } else if (result === ERR_NOT_ENOUGH_ENERGY) {
        console.log(`⏳ Waiting for energy to spawn ${role}`);
    } else if (result === ERR_BUSY) {
        console.log(`⚡ Spawn busy`);
    }
}

function countCreeps() {
    const counts = {
        harvester: 0,
        upgrader: 0,
        builder: 0,
        soldier: 0,
        ranged: 0,
        healer: 0,
        scout: 0
    };
    
    for (let name in Game.creeps) {
        const creep = Game.creeps[name];
        if (counts.hasOwnProperty(creep.memory.role)) {
            counts[creep.memory.role]++;
        }
    }
    
    return counts;
}

function controlEmergencyCreeps() {
    for (let name in Game.creeps) {
        const creep = Game.creeps[name];
        
        // Emergency behavior for all creeps
        if (gameState.enemyDetected) {
            const nearbyEnemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, { range: 5 });
            if (nearbyEnemy && !isMilitaryCreep(creep)) {
                // Non-military creeps flee when enemies are close
                fleeFromEnemy(creep, nearbyEnemy);
                continue;
            }
        }
        
        switch (creep.memory.role) {
            case ROLE_HARVESTER:
                runEmergencyHarvester(creep);
                break;
            case ROLE_UPGRADER:
                runEmergencyUpgrader(creep);
                break;
            case ROLE_SOLDIER:
                runEmergencySoldier(creep);
                break;
            case ROLE_RANGED:
                runEmergencyRanged(creep);
                break;
            case ROLE_HEALER:
                runEmergencyHealer(creep);
                break;
        }
    }
}

function runEmergencyHarvester(creep) {
    // Quick energy collection with safety checks
    if (creep.store.getFreeCapacity() > 0) {
        const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (source) {
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
    } else {
        // Emergency energy delivery - prioritize spawn and towers
        const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: structure => {
                return (structure.structureType === STRUCTURE_SPAWN ||
                        structure.structureType === STRUCTURE_TOWER) &&
                       structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        
        if (target) {
            if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
    }
}

function runEmergencyUpgrader(creep) {
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
        const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (source) {
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
    } else {
        const controller = creep.room.controller;
        if (controller) {
            if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(controller, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
    }
}

function runEmergencySoldier(creep) {
    const target = findEnemyTarget(creep);
    
    if (target) {
        if (creep.attack(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000' } });
        }
    } else {
        // Patrol near spawn for defense
        const spawn = Game.spawns.Spawn1;
        if (spawn) {
            if (creep.pos.getRangeTo(spawn) > 7) {
                creep.moveTo(spawn, { visualizePathStyle: { stroke: '#00ff00' } });
            }
        }
    }
}

function runEmergencyRanged(creep) {
    const target = findEnemyTarget(creep);
    
    if (target) {
        const range = creep.pos.getRangeTo(target);
        if (range <= 3) {
            creep.rangedAttack(target);
        } else {
            creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000' } });
        }
    } else {
        // Position defensively
        const spawn = Game.spawns.Spawn1;
        if (spawn) {
            if (creep.pos.getRangeTo(spawn) > 5) {
                creep.moveTo(spawn, { visualizePathStyle: { stroke: '#00ff00' } });
            }
        }
    }
}

function runEmergencyHealer(creep) {
    // Heal damaged military first
    const damagedMilitary = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
        filter: ally => (ally.memory.role === ROLE_SOLDIER || ally.memory.role === ROLE_RANGED) && ally.hits < ally.hitsMax
    });
    
    if (damagedMilitary) {
        if (creep.heal(damagedMilitary) === ERR_NOT_IN_RANGE) {
            creep.moveTo(damagedMilitary, { visualizePathStyle: { stroke: '#00ff00' } });
        }
        return;
    }
    
    // Then heal any damaged creep
    const damagedCreep = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
        filter: creep => creep.hits < creep.hitsMax
    });
    
    if (damagedCreep) {
        if (creep.heal(damagedCreep) === ERR_NOT_IN_RANGE) {
            creep.moveTo(damagedCreep, { visualizePathStyle: { stroke: '#00ff00' } });
        }
    } else {
        // Follow military units
        const military = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: creep => creep.memory.role === ROLE_SOLDIER || creep.memory.role === ROLE_RANGED
        });
        
        if (military && creep.pos.getRangeTo(military) > 2) {
            creep.moveTo(military, { visualizePathStyle: { stroke: '#00ff00' } });
        }
    }
}

function findEnemyTarget(creep) {
    return creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS) ||
           creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
               filter: structure => structure.structureType !== STRUCTURE_CONTROLLER
           });
}

function isMilitaryCreep(creep) {
    return [ROLE_SOLDIER, ROLE_RANGED, ROLE_HEALER].includes(creep.memory.role);
}

function buildEmergencyStructures() {
    const spawn = Game.spawns.Spawn1;
    if (!spawn) return;
    
    const room = spawn.room;
    
    // Build extensions for more energy capacity
    const extensionCount = room.find(FIND_STRUCTURES, {
        filter: structure => structure.structureType === STRUCTURE_EXTENSION
    }).length;
    
    const maxExtensions = CONTROLLER_STRUCTURES.extension[room.controller.level];
    
    if (extensionCount < maxExtensions) {
        const pos = findBuildPosition(spawn.pos, 3);
        if (pos) {
            room.createConstructionSite(pos.x, pos.y, STRUCTURE_EXTENSION);
            console.log(`🔨 Emergency extension at ${pos.x},${pos.y}`);
        }
    }
    
    // Build towers for defense
    const towerCount = room.find(FIND_STRUCTURES, {
        filter: structure => structure.structureType === STRUCTURE_TOWER
    }).length;
    
    const maxTowers = CONTROLLER_STRUCTURES.tower[room.controller.level];
    
    if (towerCount < maxTowers) {
        const pos = findBuildPosition(spawn.pos, 5);
        if (pos) {
            room.createConstructionSite(pos.x, pos.y, STRUCTURE_TOWER);
            console.log(`🏗️ Emergency tower at ${pos.x},${pos.y}`);
        }
    }
}

function findBuildPosition(centerPos, radius) {
    for (let x = -radius; x <= radius; x++) {
        for (let y = -radius; y <= radius; y++) {
            if (Math.abs(x) + Math.abs(y) !== radius) continue;
            
            const pos = new RoomPosition(centerPos.x + x, centerPos.y + y, centerPos.roomName);
            
            const terrain = pos.lookFor(LOOK_TERRAIN)[0];
            if (terrain === 'wall') continue;
            
            const structures = pos.lookFor(LOOK_STRUCTURES);
            if (structures.length > 0) continue;
            
            const constructionSites = pos.lookFor(LOOK_CONSTRUCTION_SITES);
            if (constructionSites.length > 0) continue;
            
            return pos;
        }
    }
    return null;
}

function logEmergencyStatus() {
    const counts = countCreeps();
    const militaryTotal = counts.soldier + counts.ranged + counts.healer;
    
    console.log('🚨 EMERGENCY STATUS:');
    console.log(`⏰ Tick: ${Game.time}`);
    console.log(`🛡️ Defense Mode: ${gameState.defenseMode}`);
    console.log(`⚠️ Enemy Detected: ${gameState.enemyDetected}`);
    console.log(`👥 Military Force: ${militaryTotal} (Target: ${CRITICAL_MILITARY_MASS})`);
    console.log(`🌾 Economy: ${counts.harvester}H, ${counts.upgrader}U`);
    console.log(`⚔️ Military: ${counts.soldier}S, ${counts.ranged}R, ${counts.healer}H`);
    
    if (gameState.enemyPositions.length > 0) {
        console.log(`🎯 Enemy positions: ${JSON.stringify(gameState.enemyPositions)}`);
    }
}