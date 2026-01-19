// PHOENIX PROTOCOL - EMERGENCY REBIRTH SYSTEM
// STATUS: TOTAL CREEP LOSS - SPAWN SURVIVES
// MISSION: RAPID RECONSTRUCTION AND COUNTER-OFFENSIVE

const ROLE_HARVESTER = 'harvester';
const ROLE_UPGRADER = 'upgrader';
const ROLE_SOLDIER = 'soldier';
const ROLE_RANGED = 'ranged';
const ROLE_HEALER = 'healer';
const ROLE_SCOUT = 'scout';
const ROLE_BUILDER = 'builder';

// PHOENIX PROTOCOL PARAMETERS
const REBIRTH_PHASE = 'CRITICAL'; // CRITICAL, RECOVERY, OFFENSIVE
const MIN_SURVIVAL_FORCE = 5; // Minimum creeps for survival
const TARGET_FORCE = 15; // Target force size
const EMERGENCY_ENERGY_THRESHOLD = 200; // Minimum energy for emergency units

// Ultra-efficient templates for rapid rebuilding
const PHOENIX_HARVESTER = [WORK, CARRY, MOVE]; // 200 energy - essential
const PHOENIX_SOLDIER = [ATTACK, MOVE]; // 130 energy - ultra cheap
const PHOENIX_RANGED = [RANGED_ATTACK, MOVE]; // 200 energy - cost effective
const PHOENIX_HEALER = [HEAL, MOVE]; // 300 energy - critical support
const PHOENIX_BUILDER = [WORK, CARRY, MOVE]; // 200 energy - for structures
const PHOENIX_SCOUT = [MOVE]; // 50 energy - ultra cheap

// Phoenix state tracking
let phoenixState = {
    rebirthTime: Game.time,
    currentPhase: 'CRITICAL',
    lastSpawnCheck: 0,
    militaryCount: 0,
    economyCount: 0,
    structuresBuilt: 0,
    enemyIntel: {},
    isAlive: true
};

module.exports.loop = function () {
    try {
        // Phoenix memory management
        clearPhoenixMemory();
        
        // Update survival status
        updatePhoenixStatus();
        
        // Execute survival strategy
        executeSurvivalProtocol();
        
        // Emergency spawning
        spawnEmergencyForces();
        
        // Control remaining/respawning forces
        controlPhoenixForces();
        
        // Build critical infrastructure
        buildCriticalInfrastructure();
        
        // Scout for threats and opportunities
        conductReconnaissance();
        
        // Log survival status
        if (Game.time % 5 === 0) {
            logSurvivalStatus();
        }
        
    } catch (error) {
        console.log(`💀 PHOENIX ERROR: ${error.message}`);
    }
};

function clearPhoenixMemory() {
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
}

function updatePhoenixStatus() {
    // Count current forces
    const counts = countPhoenixCreeps();
    phoenixState.militaryCount = counts.soldier + counts.ranged + counts.healer;
    phoenixState.economyCount = counts.harvester + counts.upgrader + counts.builder;
    
    const totalForce = Object.keys(Game.creeps).length;
    
    // Determine current phase
    if (totalForce < MIN_SURVIVAL_FORCE) {
        phoenixState.currentPhase = 'CRITICAL';
    } else if (totalForce < TARGET_FORCE) {
        phoenixState.currentPhase = 'RECOVERY';
    } else {
        phoenixState.currentPhase = 'OFFENSIVE';
    }
    
    // Check if we're still alive
    phoenixState.isAlive = totalForce > 0;
}

function executeSurvivalProtocol() {
    switch (phoenixState.currentPhase) {
        case 'CRITICAL':
            executeCriticalSurvival();
            break;
        case 'RECOVERY':
            executeRecovery();
            break;
        case 'OFFENSIVE':
            executeOffensive();
            break;
    }
}

function executeCriticalSurvival() {
    console.log('🚨 CRITICAL SURVIVAL MODE - Minimum force detected!');
    
    // Check for immediate threats
    const enemies = findImmediateThreats();
    if (enemies.length > 0) {
        console.log(`⚠️ IMMEDIATE THREAT: ${enemies.length} enemies detected!`);
        coordinateEmergencyDefense(enemies[0]);
    }
    
    // Prioritize absolute essentials
    const spawn = Game.spawns.Spawn1;
    if (spawn && spawn.room.energyAvailable >= 200) {
        console.log('💪 Emergency energy available - spawning critical units');
    }
}

function executeRecovery() {
    console.log('🔄 RECOVERY MODE - Building back strength');
    
    // Balance economy and military
    const counts = countPhoenixCreeps();
    
    if (counts.harvester < 3) {
        console.log('🌾 Recovery priority: Food production');
    }
    if (phoenixState.militaryCount < 5) {
        console.log('⚔️ Recovery priority: Military defense');
    }
}

function executeOffensive() {
    console.log('⚡ OFFENSIVE MODE - Ready for counter-attack');
    
    // Scout for attack targets
    const targets = findAttackTargets();
    if (targets.length > 0) {
        console.log(`🎯 Attack targets identified: ${targets.length}`);
    }
}

function findImmediateThreats() {
    const threats = [];
    for (let roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        const hostiles = room.find(FIND_HOSTILE_CREEPS);
        threats.push(...hostiles);
    }
    return threats;
}

function coordinateEmergencyDefense(target) {
    // Use all available creeps for emergency defense
    for (let name in Game.creeps) {
        const creep = Game.creeps[name];
        
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

function spawnEmergencyForces() {
    const spawn = Game.spawns.Spawn1;
    if (!spawn || spawn.spawning) return;
    
    const room = spawn.room;
    const energyAvailable = room.energyAvailable;
    const counts = countPhoenixCreeps();
    
    console.log(`📊 Phoenix status: ${counts.harvester}H, ${counts.soldier}S, ${counts.ranged}R, ${counts.healer}H, Energy: ${energyAvailable}`);
    
    // CRITICAL PHASE: Absolute minimum survival
    if (phoenixState.currentPhase === 'CRITICAL') {
        // Priority 1: At least 1 harvester for energy
        if (counts.harvester < 1 && energyAvailable >= 200) {
            spawnCreep(spawn, ROLE_HARVESTER, PHOENIX_HARVESTER);
            return;
        }
        
        // Priority 2: Basic military defense
        if (counts.soldier < 2 && energyAvailable >= 130) {
            spawnCreep(spawn, ROLE_SOLDIER, PHOENIX_SOLDIER);
            return;
        }
        
        // Priority 3: Ranged support
        if (counts.ranged < 1 && energyAvailable >= 200) {
            spawnCreep(spawn, ROLE_RANGED, PHOENIX_RANGED);
            return;
        }
        
        // Priority 4: Healer support
        if (counts.healer < 1 && energyAvailable >= 300) {
            spawnCreep(spawn, ROLE_HEALER, PHOENIX_HEALER);
            return;
        }
    }
    
    // RECOVERY PHASE: Balanced rebuilding
    if (phoenixState.currentPhase === 'RECOVERY') {
        // Balanced approach to rebuilding
        if (counts.harvester < 3 && energyAvailable >= 200) {
            spawnCreep(spawn, ROLE_HARVESTER, PHOENIX_HARVESTER);
            return;
        }
        
        if (counts.soldier < 5 && energyAvailable >= 130) {
            spawnCreep(spawn, ROLE_SOLDIER, PHOENIX_SOLDIER);
            return;
        }
        
        if (counts.ranged < 3 && energyAvailable >= 200) {
            spawnCreep(spawn, ROLE_RANGED, PHOENIX_RANGED);
            return;
        }
        
        if (counts.healer < 2 && energyAvailable >= 300) {
            spawnCreep(spawn, ROLE_HEALER, PHOENIX_HEALER);
            return;
        }
        
        if (counts.upgrader < 2 && energyAvailable >= 300) {
            spawnCreep(spawn, ROLE_UPGRADER, [WORK, CARRY, MOVE, MOVE]);
            return;
        }
        
        if (counts.builder < 1 && energyAvailable >= 200) {
            spawnCreep(spawn, ROLE_BUILDER, PHOENIX_BUILDER);
            return;
        }
    }
    
    // OFFENSIVE PHASE: Maximum military buildup
    if (phoenixState.currentPhase === 'OFFENSIVE') {
        // Maximum military force
        if (counts.soldier < 8 && energyAvailable >= 130) {
            spawnCreep(spawn, ROLE_SOLDIER, PHOENIX_SOLDIER);
            return;
        }
        
        if (counts.ranged < 6 && energyAvailable >= 200) {
            spawnCreep(spawn, ROLE_RANGED, PHOENIX_RANGED);
            return;
        }
        
        if (counts.healer < 4 && energyAvailable >= 300) {
            spawnCreep(spawn, ROLE_HEALER, PHOENIX_HEALER);
            return;
        }
        
        // Maintain economy
        if (counts.harvester < 4 && energyAvailable >= 200) {
            spawnCreep(spawn, ROLE_HARVESTER, PHOENIX_HARVESTER);
            return;
        }
        
        if (counts.scout < 2 && energyAvailable >= 50) {
            spawnCreep(spawn, ROLE_SCOUT, PHOENIX_SCOUT);
            return;
        }
    }
}

function spawnCreep(spawn, role, body) {
    const result = spawn.spawnCreep(body, `${role}_${Game.time}`, {
        memory: { role: role, phoenix: true, rebirth: Game.time }
    });
    
    if (result === OK) {
        console.log(`🔥 PHOENIX SPAWN: ${role} (${body.join(",")})`);
    } else if (result === ERR_NOT_ENOUGH_ENERGY) {
        console.log(`⏳ Phoenix waiting: ${role} - need more energy`);
    } else if (result === ERR_BUSY) {
        console.log(`⚡ Phoenix spawn busy`);
    }
}

function countPhoenixCreeps() {
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

function controlPhoenixForces() {
    for (let name in Game.creeps) {
        const creep = Game.creeps[name];
        
        // Handle emergency situations first
        const nearbyEnemies = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 5);
        if (nearbyEnemies.length > 0 && !isMilitaryCreep(creep)) {
            // Non-military creeps flee from danger
            fleeFromEnemy(creep, nearbyEnemies[0]);
            continue;
        }
        
        switch (creep.memory.role) {
            case ROLE_HARVESTER:
                runPhoenixHarvester(creep);
                break;
            case ROLE_UPGRADER:
                runPhoenixUpgrader(creep);
                break;
            case ROLE_BUILDER:
                runPhoenixBuilder(creep);
                break;
            case ROLE_SOLDIER:
                runPhoenixSoldier(creep);
                break;
            case ROLE_RANGED:
                runPhoenixRanged(creep);
                break;
            case ROLE_HEALER:
                runPhoenixHealer(creep);
                break;
            case ROLE_SCOUT:
                runPhoenixScout(creep);
                break;
        }
    }
}

function fleeFromEnemy(creep, enemy) {
    const spawn = Game.spawns.Spawn1;
    if (spawn) {
        const fleeDirection = new RoomPosition(
            creep.pos.x + (creep.pos.x - enemy.pos.x) * 2,
            creep.pos.y + (creep.pos.y - enemy.pos.y) * 2,
            creep.room.name
        );
        creep.moveTo(fleeDirection, { visualizePathStyle: { stroke: '#ffff00' } });
    } else {
        creep.moveTo(25, 25, { visualizePathStyle: { stroke: '#ffff00' } });
    }
}

function runPhoenixHarvester(creep) {
    if (creep.store.getFreeCapacity() > 0) {
        const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (source) {
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
    } else {
        // Priority delivery: spawn > towers > extensions
        const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: structure => {
                return (structure.structureType === STRUCTURE_SPAWN ||
                        structure.structureType === STRUCTURE_TOWER ||
                        structure.structureType === STRUCTURE_EXTENSION) &&
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

function runPhoenixUpgrader(creep) {
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

function runPhoenixBuilder(creep) {
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
        const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (source) {
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
    } else {
        // Build critical structures first
        const target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if (target) {
            if (creep.build(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
    }
}

function runPhoenixSoldier(creep) {
    const target = findEnemyTarget(creep);
    
    if (target) {
        if (creep.attack(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000' } });
        }
    } else {
        // Defensive patrol around spawn
        const spawn = Game.spawns.Spawn1;
        if (spawn) {
            if (creep.pos.getRangeTo(spawn) > 8) {
                creep.moveTo(spawn, { visualizePathStyle: { stroke: '#00ff00' } });
            } else {
                // Patrol around spawn
                const patrolPos = new RoomPosition(
                    spawn.pos.x + Math.floor(Math.random() * 6) - 3,
                    spawn.pos.y + Math.floor(Math.random() * 6) - 3,
                    spawn.room.name
                );
                creep.moveTo(patrolPos, { visualizePathStyle: { stroke: '#00ff00' } });
            }
        }
    }
}

function runPhoenixRanged(creep) {
    const target = findEnemyTarget(creep);
    
    if (target) {
        const range = creep.pos.getRangeTo(target);
        if (range <= 3) {
            creep.rangedAttack(target);
        } else {
            creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000' } });
        }
    } else {
        // Defensive positioning
        const spawn = Game.spawns.Spawn1;
        if (spawn) {
            if (creep.pos.getRangeTo(spawn) > 6) {
                creep.moveTo(spawn, { visualizePathStyle: { stroke: '#00ff00' } });
            }
        }
    }
}

function runPhoenixHealer(creep) {
    // Heal military units first
    const damagedMilitary = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
        filter: ally => (ally.memory.role === ROLE_SOLDIER || ally.memory.role === ROLE_RANGED) && ally.hits < ally.hitsMax
    });
    
    if (damagedMilitary) {
        if (creep.heal(damagedMilitary) === ERR_NOT_IN_RANGE) {
            creep.moveTo(damagedMilitary, { visualizePathStyle: { stroke: '#00ff00' } });
        }
        return;
    }
    
    // Then any damaged creep
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

function runPhoenixScout(creep) {
    // Scout adjacent rooms for intelligence
    const adjacentRooms = ['W1N1', 'W1N2', 'W1N4', 'W2N3', 'W0N3'];
    
    if (!creep.memory.scoutTarget) {
        creep.memory.scoutTarget = adjacentRooms[Math.floor(Math.random() * adjacentRooms.length)];
    }
    
    const targetRoom = creep.memory.scoutTarget;
    
    if (creep.room.name !== targetRoom) {
        const exit = creep.room.findExitTo(targetRoom);
        if (exit !== ERR_NO_PATH && exit !== ERR_INVALID_ARGS) {
            creep.moveTo(creep.pos.findClosestByRange(exit), { visualizePathStyle: { stroke: '#ffff00' } });
        }
    } else {
        // In target room - gather intelligence
        const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
        const enemyStructures = creep.room.find(FIND_HOSTILE_STRUCTURES);
        
        console.log(`📡 Phoenix intel: Room ${targetRoom} - ${enemies.length} enemies, ${enemyStructures.length} structures`);
        
        // Record intelligence
        phoenixState.enemyIntel[targetRoom] = {
            lastSeen: Game.time,
            enemies: enemies.length,
            structures: enemyStructures.length,
            hasSpawn: enemyStructures.some(s => s.structureType === STRUCTURE_SPAWN)
        };
        
        // Pick new target
        creep.memory.scoutTarget = adjacentRooms[Math.floor(Math.random() * adjacentRooms.length)];
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

function buildCriticalInfrastructure() {
    const spawn = Game.spawns.Spawn1;
    if (!spawn) return;
    
    const room = spawn.room;
    
    // Build extensions for energy capacity
    const extensionCount = room.find(FIND_STRUCTURES, {
        filter: structure => structure.structureType === STRUCTURE_EXTENSION
    }).length;
    
    const maxExtensions = CONTROLLER_STRUCTURES.extension[room.controller.level];
    
    if (extensionCount < maxExtensions) {
        const pos = findBuildPosition(spawn.pos, 3);
        if (pos) {
            room.createConstructionSite(pos.x, pos.y, STRUCTURE_EXTENSION);
            console.log(`🏗️ Phoenix extension at ${pos.x},${pos.y}`);
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
            console.log(`🏰 Phoenix tower at ${pos.x},${pos.y}`);
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

function conductReconnaissance() {
    // Analyze enemy intelligence
    const enemyRooms = Object.keys(phoenixState.enemyIntel);
    const currentTime = Game.time;
    
    let totalEnemies = 0;
    let viableTargets = [];
    
    enemyRooms.forEach(room => {
        const intel = phoenixState.enemyIntel[room];
        if (currentTime - intel.lastSeen < 100) { // Recent intelligence
            totalEnemies += intel.enemies;
            
            if (intel.enemies < 5 && intel.structures > 0) {
                viableTargets.push({
                    room: room,
                    enemies: intel.enemies,
                    structures: intel.structures,
                    hasSpawn: intel.hasSpawn
                });
            }
        }
    });
    
    if (viableTargets.length > 0) {
        console.log(`🎯 Phoenix targets identified: ${viableTargets.length} weak enemy positions`);
    }
}

function logSurvivalStatus() {
    const counts = countPhoenixCreeps();
    const totalForce = Object.keys(Game.creeps).length;
    const survivalTime = Game.time - phoenixState.rebirthTime;
    
    console.log('🔥 PHOENIX STATUS REPORT:');
    console.log(`⏰ Survival Time: ${survivalTime} ticks`);
    console.log(`🔄 Current Phase: ${phoenixState.currentPhase}`);
    console.log(`💪 Total Force: ${totalForce}/${TARGET_FORCE} creeps`);
    console.log(`⚔️ Military: ${phoenixState.militaryCount} units`);
    console.log(`🌾 Economy: ${phoenixState.economyCount} units`);
    console.log(`🏗️ Structures Built: ${phoenixState.structuresBuilt}`);
    console.log(`🕵️ Intelligence Reports: ${Object.keys(phoenixState.enemyIntel).length} rooms`);
    
    if (phoenixState.currentPhase === 'CRITICAL') {
        console.log(`🚨 CRITICAL: Need minimum ${MIN_SURVIVAL_FORCE} creeps for survival!`);
    } else if (phoenixState.currentPhase === 'RECOVERY') {
        console.log(`🔄 RECOVERY: Building toward ${TARGET_FORCE} total force`);
    } else {
        console.log(`⚡ OFFENSIVE: Ready for counter-attacks!`);
    }
}