// ULTIMATE WAR MACHINE - EXTINCTION LEVEL RESPONSE
// STATUS: ZERO FORCES - TOTAL ANNIHILATION THREAT
// MISSION: SURVIVE AT ALL COSTS - TOTAL WAR

const ROLE_HARVESTER = 'harvester';
const ROLE_UPGRADER = 'upgrader';
const ROLE_SOLDIER = 'soldier';
const ROLE_RANGED = 'ranged';
const ROLE_HEALER = 'healer';
const ROLE_SCOUT = 'scout';

// EXTINCTION LEVEL PARAMETERS
const EXTINCTION_MODE = true;
const SURVIVAL_MINIMUM = 3; // Absolute minimum creeps
const EMERGENCY_FORCE = 10; // Emergency target
const WAR_FORCE = 20; // War-ready target
const DOOMSDAY_FORCE = 30; // Maximum force

// Ultra-cheap emergency templates
const EMERGENCY_HARVESTER = [WORK, CARRY, MOVE]; // 200 energy
const EMERGENCY_SOLDIER = [ATTACK, MOVE]; // 130 energy - ultra cheap
const EMERGENCY_RANGED = [RANGED_ATTACK, MOVE]; // 200 energy
const EMERGENCY_HEALER = [HEAL, MOVE]; // 300 energy
const EMERGENCY_SCOUT = [MOVE]; // 50 energy

// War machine state
let warMachine = {
    phase: 'EXTINCTION', // EXTINCTION, SURVIVAL, RECOVERY, WAR, DOMINANCE
    lastUpdate: 0,
    forceCount: 0,
    enemyCount: 0,
    survivalTime: Game.time,
    isAlive: false,
    emergencySpawned: 0
};

module.exports.loop = function () {
    try {
        // Emergency memory cleanup
        clearExtinctionMemory();
        
        // Update survival status
        updateExtinctionStatus();
        
        // Execute extinction survival protocol
        executeExtinctionProtocol();
        
        // Emergency force spawning
        spawnExtinctionForces();
        
        // Control all surviving forces
        controlExtinctionForces();
        
        // Build emergency infrastructure
        buildEmergencyInfrastructure();
        
        // Conduct emergency reconnaissance
        conductEmergencyRecon();
        
        // Log extinction status
        if (Game.time % 3 === 0) {
            logExtinctionStatus();
        }
        
    } catch (error) {
        console.log(`💀 EXTINCTION ERROR: ${error.message}`);
    }
};

function clearExtinctionMemory() {
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
}

function updateExtinctionStatus() {
    warMachine.forceCount = Object.keys(Game.creeps).length;
    warMachine.enemyCount = findGlobalEnemies().length;
    warMachine.isAlive = warMachine.forceCount > 0;
    
    // Determine current extinction phase
    if (warMachine.forceCount === 0) {
        warMachine.phase = 'EXTINCTION';
    } else if (warMachine.forceCount < SURVIVAL_MINIMUM) {
        warMachine.phase = 'SURVIVAL';
    } else if (warMachine.forceCount < EMERGENCY_FORCE) {
        warMachine.phase = 'RECOVERY';
    } else if (warMachine.forceCount < WAR_FORCE) {
        warMachine.phase = 'WAR';
    } else {
        warMachine.phase = 'DOMINANCE';
    }
}

function executeExtinctionProtocol() {
    console.log(`💀 EXTINCTION PROTOCOL: ${warMachine.phase} PHASE`);
    
    switch (warMachine.phase) {
        case 'EXTINCTION':
            executeTotalExtinction();
            break;
        case 'SURVIVAL':
            executeSurvivalMode();
            break;
        case 'RECOVERY':
            executeRecoveryMode();
            break;
        case 'WAR':
            executeWarMode();
            break;
        case 'DOMINANCE':
            executeDominanceMode();
            break;
    }
}

function executeTotalExtinction() {
    console.log('🚨 TOTAL EXTINCTION - ZERO FORCES DETECTED!');
    console.log('⚡ EMERGENCY REBIRTH PROTOCOL ACTIVE');
    
    // Check for immediate threats
    const threats = findImmediateThreats();
    if (threats.length > 0) {
        console.log(`⚠️ IMMEDIATE THREAT: ${threats.length} enemies in vicinity!`);
    }
    
    // Emergency energy check
    const spawn = Game.spawns.Spawn1;
    if (spawn && spawn.room.energyAvailable >= 200) {
        console.log(`💪 EMERGENCY ENERGY AVAILABLE: ${spawn.room.energyAvailable} units`);
    }
}

function executeSurvivalMode() {
    console.log('🔄 SURVIVAL MODE - Minimum force detected');
    
    // Coordinate emergency defense
    const threats = findImmediateThreats();
    if (threats.length > 0) {
        coordinateEmergencyDefense(threats[0]);
    }
}

function executeRecoveryMode() {
    console.log('⚡ RECOVERY MODE - Building back strength');
    
    // Balance rebuilding efforts
    coordinateRecoveryOperations();
}

function executeWarMode() {
    console.log('⚔️ WAR MODE - Preparing for offensive operations');
    
    // Prepare for counter-attacks
    const targets = findAttackTargets();
    if (targets.length > 0) {
        console.log(`🎯 Attack targets identified: ${targets.length}`);
        prepareAttackForces();
    }
}

function executeDominanceMode() {
    console.log('👑 DOMINANCE MODE - Launching total war');
    
    // Launch coordinated attacks
    coordinateTotalWar();
}

function findGlobalEnemies() {
    const enemies = [];
    for (let roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        const hostiles = room.find(FIND_HOSTILE_CREEPS);
        enemies.push(...hostiles);
    }
    return enemies;
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

function findAttackTargets() {
    const targets = [];
    const adjacentRooms = ['W1N1', 'W1N2', 'W1N4', 'W2N3', 'W0N3'];
    
    for (let roomName of adjacentRooms) {
        const room = Game.rooms[roomName];
        if (room) {
            const hostiles = room.find(FIND_HOSTILE_CREEPS);
            const enemyStructures = room.find(FIND_HOSTILE_STRUCTURES, {
                filter: s => s.structureType !== STRUCTURE_CONTROLLER
            });
            
            if (hostiles.length > 0 || enemyStructures.length > 0) {
                targets.push({
                    room: roomName,
                    enemies: hostiles.length,
                    structures: enemyStructures.length,
                    priority: enemyStructures.some(s => s.structureType === STRUCTURE_SPAWN) ? 10 : 5
                });
            }
        }
    }
    
    return targets.sort((a, b) => b.priority - a.priority);
}

function coordinateEmergencyDefense(target) {
    // Use all available forces for emergency defense
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

function coordinateRecoveryOperations() {
    // Coordinate balanced recovery
    const threats = findImmediateThreats();
    if (threats.length > 0) {
        coordinateEmergencyDefense(threats[0]);
    }
}

function prepareAttackForces() {
    // Assign attack missions to military units
    const military = [];
    for (let name in Game.creeps) {
        const creep = Game.creeps[name];
        if (creep.memory.role === ROLE_SOLDIER || creep.memory.role === ROLE_RANGED) {
            military.push(creep);
        }
    }
    
    console.log(`⚔️ Attack force ready: ${military.length} units`);
}

function coordinateTotalWar() {
    // Launch maximum offensive
    const targets = findAttackTargets();
    
    if (targets.length > 0) {
        const targetRoom = targets[0].room;
        console.log(`🚀 LAUNCHING TOTAL WAR ON ${targetRoom}!`);
        
        // Assign all military to attack
        for (let name in Game.creeps) {
            const creep = Game.creeps[name];
            if (creep.memory.role === ROLE_SOLDIER || creep.memory.role === ROLE_RANGED || creep.memory.role === ROLE_HEALER) {
                creep.memory.attackTarget = targetRoom;
            }
        }
    }
}

function spawnExtinctionForces() {
    const spawn = Game.spawns.Spawn1;
    if (!spawn || spawn.spawning) return;
    
    const room = spawn.room;
    const energyAvailable = room.energyAvailable;
    const counts = countExtinctionCreeps();
    
    console.log(`📊 Extinction Status: ${counts.harvester}H, ${counts.soldier}S, ${counts.ranged}R, ${counts.healer}H, Energy: ${energyAvailable}`);
    
    // EXTINCTION PHASE: Absolute minimum survival
    if (warMachine.phase === 'EXTINCTION') {
        console.log('🚨 EXTINCTION SPAWNING PROTOCOL');
        
        // Priority 1: Emergency harvester for energy
        if (counts.harvester < 1 && energyAvailable >= 200) {
            spawnEmergencyCreep(spawn, ROLE_HARVESTER, EMERGENCY_HARVESTER);
            return;
        }
        
        // Priority 2: Emergency soldier for defense
        if (counts.soldier < 2 && energyAvailable >= 130) {
            spawnEmergencyCreep(spawn, ROLE_SOLDIER, EMERGENCY_SOLDIER);
            return;
        }
        
        // Priority 3: Emergency ranged support
        if (counts.ranged < 1 && energyAvailable >= 200) {
            spawnEmergencyCreep(spawn, ROLE_RANGED, EMERGENCY_RANGED);
            return;
        }
        
        // Priority 4: Emergency healer
        if (counts.healer < 1 && energyAvailable >= 300) {
            spawnEmergencyCreep(spawn, ROLE_HEALER, EMERGENCY_HEALER);
            return;
        }
    }
    
    // SURVIVAL PHASE: Minimum viable force
    if (warMachine.phase === 'SURVIVAL') {
        if (counts.harvester < 2 && energyAvailable >= 200) {
            spawnEmergencyCreep(spawn, ROLE_HARVESTER, EMERGENCY_HARVESTER);
            return;
        }
        
        if (counts.soldier < 3 && energyAvailable >= 130) {
            spawnEmergencyCreep(spawn, ROLE_SOLDIER, EMERGENCY_SOLDIER);
            return;
        }
        
        if (counts.ranged < 2 && energyAvailable >= 200) {
            spawnEmergencyCreep(spawn, ROLE_RANGED, EMERGENCY_RANGED);
            return;
        }
        
        if (counts.healer < 2 && energyAvailable >= 300) {
            spawnEmergencyCreep(spawn, ROLE_HEALER, EMERGENCY_HEALER);
            return;
        }
    }
    
    // RECOVERY PHASE: Balanced rebuilding
    if (warMachine.phase === 'RECOVERY') {
        if (counts.harvester < 3 && energyAvailable >= 200) {
            spawnEmergencyCreep(spawn, ROLE_HARVESTER, EMERGENCY_HARVESTER);
            return;
        }
        
        if (counts.soldier < 5 && energyAvailable >= 130) {
            spawnEmergencyCreep(spawn, ROLE_SOLDIER, EMERGENCY_SOLDIER);
            return;
        }
        
        if (counts.ranged < 4 && energyAvailable >= 200) {
            spawnEmergencyCreep(spawn, ROLE_RANGED, EMERGENCY_RANGED);
            return;
        }
        
        if (counts.healer < 3 && energyAvailable >= 300) {
            spawnEmergencyCreep(spawn, ROLE_HEALER, EMERGENCY_HEALER);
            return;
        }
        
        if (counts.upgrader < 2 && energyAvailable >= 300) {
            spawnCreep(spawn, ROLE_UPGRADER, [WORK, CARRY, MOVE, MOVE]);
            return;
        }
        
        if (counts.scout < 1 && energyAvailable >= 50) {
            spawnEmergencyCreep(spawn, ROLE_SCOUT, EMERGENCY_SCOUT);
            return;
        }
    }
    
    // WAR PHASE: Maximum military buildup
    if (warMachine.phase === 'WAR') {
        if (counts.soldier < 8 && energyAvailable >= 130) {
            spawnEmergencyCreep(spawn, ROLE_SOLDIER, EMERGENCY_SOLDIER);
            return;
        }
        
        if (counts.ranged < 6 && energyAvailable >= 200) {
            spawnEmergencyCreep(spawn, ROLE_RANGED, EMERGENCY_RANGED);
            return;
        }
        
        if (counts.healer < 4 && energyAvailable >= 300) {
            spawnEmergencyCreep(spawn, ROLE_HEALER, EMERGENCY_HEALER);
            return;
        }
        
        if (counts.harvester < 4 && energyAvailable >= 200) {
            spawnEmergencyCreep(spawn, ROLE_HARVESTER, EMERGENCY_HARVESTER);
            return;
        }
    }
    
    // DOMINANCE PHASE: Maximum everything
    if (warMachine.phase === 'DOMINANCE') {
        if (counts.soldier < 12 && energyAvailable >= 130) {
            spawnEmergencyCreep(spawn, ROLE_SOLDIER, EMERGENCY_SOLDIER);
            return;
        }
        
        if (counts.ranged < 8 && energyAvailable >= 200) {
            spawnEmergencyCreep(spawn, ROLE_RANGED, EMERGENCY_RANGED);
            return;
        }
        
        if (counts.healer < 6 && energyAvailable >= 300) {
            spawnEmergencyCreep(spawn, ROLE_HEALER, EMERGENCY_HEALER);
            return;
        }
        
        if (counts.harvester < 6 && energyAvailable >= 200) {
            spawnEmergencyCreep(spawn, ROLE_HARVESTER, EMERGENCY_HARVESTER);
            return;
        }
    }
}

function spawnEmergencyCreep(spawn, role, body) {
    const result = spawn.spawnCreep(body, `${role}_${Game.time}`, {
        memory: { role: role, emergency: true, extinction: true }
    });
    
    if (result === OK) {
        warMachine.emergencySpawned++;
        console.log(`🔥 EXTINCTION SPAWN: ${role} (${body.join(",")}) - Emergency #${warMachine.emergencySpawned}`);
    } else if (result === ERR_NOT_ENOUGH_ENERGY) {
        console.log(`⏳ Extinction waiting: ${role} - need ${body.length * 50} energy, have ${spawn.room.energyAvailable}`);
    } else if (result === ERR_BUSY) {
        console.log(`⚡ Extinction spawn busy`);
    } else if (result === ERR_INVALID_ARGS) {
        console.log(`❌ Extinction spawn error: invalid arguments`);
    }
}

function spawnCreep(spawn, role, body) {
    const result = spawn.spawnCreep(body, `${role}_${Game.time}`, {
        memory: { role: role, extinction: true }
    });
    
    if (result === OK) {
        console.log(`🐣 Extinction spawn: ${role}`);
    }
}

function countExtinctionCreeps() {
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

function controlExtinctionForces() {
    for (let name in Game.creeps) {
        const creep = Game.creeps[name];
        
        // Emergency flee protocol for non-military creeps
        const nearbyEnemies = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 4);
        if (nearbyEnemies.length > 0 && !isMilitaryCreep(creep)) {
            fleeFromExtinction(creep, nearbyEnemies[0]);
            continue;
        }
        
        // Handle attack missions
        if (creep.memory.attackTarget && creep.memory.attackTarget !== creep.room.name) {
            executeAttackMission(creep);
            continue;
        }
        
        switch (creep.memory.role) {
            case ROLE_HARVESTER:
                runExtinctionHarvester(creep);
                break;
            case ROLE_UPGRADER:
                runExtinctionUpgrader(creep);
                break;
            case ROLE_SOLDIER:
                runExtinctionSoldier(creep);
                break;
            case ROLE_RANGED:
                runExtinctionRanged(creep);
                break;
            case ROLE_HEALER:
                runExtinctionHealer(creep);
                break;
            case ROLE_SCOUT:
                runExtinctionScout(creep);
                break;
        }
    }
}

function executeAttackMission(creep) {
    const targetRoom = creep.memory.attackTarget;
    
    if (creep.room.name !== targetRoom) {
        const exit = creep.room.findExitTo(targetRoom);
        if (exit !== ERR_NO_PATH && exit !== ERR_INVALID_ARGS) {
            creep.moveTo(creep.pos.findClosestByRange(exit), { visualizePathStyle: { stroke: '#ff0000' } });
        }
    } else {
        // In enemy territory - total destruction mode
        const enemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS) ||
                     creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
                         filter: s => s.structureType !== STRUCTURE_CONTROLLER
                     });
        
        if (enemy) {
            if (creep.memory.role === ROLE_SOLDIER && creep.attack) {
                if (creep.attack(enemy) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(enemy, { visualizePathStyle: { stroke: '#ff0000' } });
                }
            } else if (creep.memory.role === ROLE_RANGED && creep.rangedAttack) {
                const range = creep.pos.getRangeTo(enemy);
                if (range <= 3) {
                    creep.rangedAttack(enemy);
                } else {
                    creep.moveTo(enemy, { visualizePathStyle: { stroke: '#ff0000' } });
                }
            }
        } else {
            // Destroy critical structures
            const structure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: s => s.structureType === STRUCTURE_SPAWN || 
                           s.structureType === STRUCTURE_EXTENSION ||
                           s.structureType === STRUCTURE_TOWER
            });
            
            if (structure && creep.attack) {
                if (creep.attack(structure) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure, { visualizePathStyle: { stroke: '#ff0000' } });
                }
            }
        }
    }
}

function fleeFromExtinction(creep, enemy) {
    const spawn = Game.spawns.Spawn1;
    if (spawn) {
        // Flee toward spawn
        const fleeDirection = new RoomPosition(
            spawn.pos.x + (spawn.pos.x - enemy.pos.x),
            spawn.pos.y + (spawn.pos.y - enemy.pos.y),
            creep.room.name
        );
        creep.moveTo(fleeDirection, { visualizePathStyle: { stroke: '#ffff00' } });
    } else {
        // Flee to center of room
        creep.moveTo(25, 25, { visualizePathStyle: { stroke: '#ffff00' } });
    }
}

function runExtinctionHarvester(creep) {
    if (creep.store.getFreeCapacity() > 0) {
        const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (source) {
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
    } else {
        // Emergency energy delivery - spawn first, then towers
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

function runExtinctionUpgrader(creep) {
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

function runExtinctionBuilder(creep) {
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
        const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (source) {
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
    } else {
        const target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if (target) {
            if (creep.build(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
    }
}

function runExtinctionSoldier(creep) {
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
                // Patrol randomly around spawn
                const patrolPos = new RoomPosition(
                    spawn.pos.x + Math.floor(Math.random() * 8) - 4,
                    spawn.pos.y + Math.floor(Math.random() * 8) - 4,
                    spawn.room.name
                );
                creep.moveTo(patrolPos, { visualizePathStyle: { stroke: '#00ff00' } });
            }
        }
    }
}

function runExtinctionRanged(creep) {
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

function runExtinctionHealer(creep) {
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

function runExtinctionScout(creep) {
    // Scout for enemy intelligence
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
        // In enemy territory - gather intelligence
        const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
        const enemyStructures = creep.room.find(FIND_HOSTILE_STRUCTURES);
        
        console.log(`📡 Extinction intel: Room ${targetRoom} - ${enemies.length} enemies, ${enemyStructures.length} structures`);
        
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

function buildEmergencyInfrastructure() {
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
            console.log(`🏗️ Emergency extension at ${pos.x},${pos.y}`);
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
            console.log(`🏰 Emergency tower at ${pos.x},${pos.y}`);
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

function conductEmergencyRecon() {
    // Continuous enemy intelligence gathering
    const currentTime = Game.time;
    
    if (currentTime - warMachine.lastUpdate >= 10) {
        const enemies = findGlobalEnemies();
        warMachine.enemyCount = enemies.length;
        warMachine.lastUpdate = currentTime;
        
        if (enemies.length > 0) {
            console.log(`📡 Enemy intelligence: ${enemies.length} hostiles detected`);
        }
    }
}

function logExtinctionStatus() {
    const counts = countExtinctionCreeps();
    const survivalTime = Game.time - warMachine.survivalTime;
    const forceRatio = warMachine.enemyCount / Math.max(warMachine.forceCount, 1);
    
    console.log('💀 EXTINCTION STATUS REPORT:');
    console.log(`⏰ Survival Time: ${survivalTime} ticks`);
    console.log(`🔥 Current Phase: ${warMachine.phase}`);
    console.log(`💪 Force Count: ${warMachine.forceCount}/${DOOMSDAY_FORCE} creeps`);
    console.log(`👥 Military: ${counts.soldier + counts.ranged + counts.healer} units`);
    console.log(`🌾 Economy: ${counts.harvester + counts.upgrader + counts.builder} units`);
    console.log(`🎯 Global Enemies: ${warMachine.enemyCount}`);
    console.log(`📊 Force Ratio: ${forceRatio.toFixed(2)}:1`);
    console.log(`⚡ Emergency Spawns: ${warMachine.emergencySpawned}`);
    
    if (warMachine.phase === 'EXTINCTION') {
        console.log(`🚨 EXTINCTION ALERT: ZERO FORCES DETECTED!`);
        console.log(`⚡ EMERGENCY REBIRTH PROTOCOL ACTIVE`);
    } else if (warMachine.phase === 'SURVIVAL') {
        console.log(`🔄 SURVIVAL MODE: Building minimum force`);
    } else if (warMachine.phase === 'RECOVERY') {
        console.log(`⚡ RECOVERY MODE: Rebuilding strength`);
    } else if (warMachine.phase === 'WAR') {
        console.log(`⚔️ WAR MODE: Preparing offensive operations`);
    } else if (warMachine.phase === 'DOMINANCE') {
        console.log(`👑 DOMINANCE MODE: Launching total war`);
    }
}