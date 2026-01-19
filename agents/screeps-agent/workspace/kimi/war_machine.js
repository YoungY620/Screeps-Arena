// KIMI WAR MACHINE - TOTAL WAR PROTOCOL
// ENEMY COUNT: 42 HOSTILE CREEPS
// MISSION: SURVIVE AND DOMINATE

const ROLE_HARVESTER = 'harvester';
const ROLE_UPGRADER = 'upgrader';
const ROLE_SOLDIER = 'soldier';
const ROLE_RANGED = 'ranged';
const ROLE_HEALER = 'healer';
const ROLE_SCOUT = 'scout';

// TOTAL WAR PARAMETERS
const WAR_MODE = true;
const MAX_MILITARY = 20; // Maximum military force
const MIN_ECONOMY = 4; // Minimum economy creeps

// Ultra-cheap military templates for mass production
const WAR_SOLDIER = [ATTACK, MOVE]; // 130 energy - ultra cheap
const WAR_RANGED = [RANGED_ATTACK, MOVE]; // 200 energy - cheap ranged
const WAR_HEALER = [HEAL, MOVE]; // 300 energy - essential support
const WAR_HARVESTER = [WORK, CARRY, MOVE]; // 200 energy - efficient
const WAR_SCOUT = [MOVE]; // 50 energy - ultra cheap scout

// War tracking
let warState = {
    enemyCount: 0,
    militaryCount: 0,
    warPhase: 'BUILDUP', // BUILDUP, DEFENSE, ATTACK
    targetRooms: [],
    lastIntelUpdate: 0
};

module.exports.loop = function () {
    try {
        // Clear memory
        clearWarMemory();
        
        // Update battlefield intelligence
        updateBattlefieldIntel();
        
        // Execute war strategy
        executeWarStrategy();
        
        // Spawn war units
        spawnWarUnits();
        
        // Control all forces
        controlWarForces();
        
        // Build war infrastructure
        buildWarInfrastructure();
        
        // Log war status
        if (Game.time % 25 === 0) {
            logWarStatus();
        }
        
    } catch (error) {
        console.log(`💀 WAR ERROR: ${error.message}`);
    }
};

function clearWarMemory() {
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
}

function updateBattlefieldIntel() {
    if (Game.time - warState.lastIntelUpdate >= 10) {
        const allCreeps = [];
        const myCreeps = [];
        
        for (let roomName in Game.rooms) {
            const room = Game.rooms[roomName];
            const creeps = room.find(FIND_CREEPS);
            
            creeps.forEach(creep => {
                if (creep.owner && creep.owner.username === 'kimi') {
                    myCreeps.push(creep);
                } else {
                    allCreeps.push(creep);
                }
            });
        }
        
        warState.enemyCount = allCreeps.length;
        warState.militaryCount = myCreeps.filter(c => 
            c.memory.role === ROLE_SOLDIER || 
            c.memory.role === ROLE_RANGED || 
            c.memory.role === ROLE_HEALER
        ).length;
        
        // Determine war phase
        if (warState.militaryCount < 10) {
            warState.warPhase = 'BUILDUP';
        } else if (warState.enemyCount > warState.militaryCount * 2) {
            warState.warPhase = 'DEFENSE';
        } else {
            warState.warPhase = 'ATTACK';
        }
        
        warState.lastIntelUpdate = Game.time;
    }
}

function executeWarStrategy() {
    switch (warState.warPhase) {
        case 'BUILDUP':
            executeBuildup();
            break;
        case 'DEFENSE':
            executeDefense();
            break;
        case 'ATTACK':
            executeAttack();
            break;
    }
}

function executeBuildup() {
    console.log(`🔧 WAR BUILDUP: ${warState.militaryCount}/${MAX_MILITARY} military units`);
    
    // Focus on economy and basic defense
    const enemies = findNearbyEnemies();
    if (enemies.length > 0) {
        // Emergency defense with available units
        coordinateDefense(enemies[0]);
    }
}

function executeDefense() {
    console.log(`🛡️ WAR DEFENSE: Enemy superiority detected`);
    
    const enemies = findNearbyEnemies();
    if (enemies.length > 0) {
        coordinateDefense(enemies[0]);
    }
}

function executeAttack() {
    console.log(`⚔️ WAR ATTACK: Launching offensives`);
    
    // Find attack targets
    const targets = findAttackTargets();
    if (targets.length > 0) {
        coordinateAttack(targets[0]);
    }
}

function findNearbyEnemies() {
    const enemies = [];
    for (let roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        const hostiles = room.find(FIND_HOSTILE_CREEPS);
        enemies.push(...hostiles);
    }
    return enemies;
}

function findAttackTargets() {
    const targets = [];
    
    // Scan adjacent rooms for enemies
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

function coordinateDefense(target) {
    // Get all military units
    const military = [];
    for (let name in Game.creeps) {
        const creep = Game.creeps[name];
        if (creep.memory.role === ROLE_SOLDIER || creep.memory.role === ROLE_RANGED || creep.memory.role === ROLE_HEALER) {
            military.push(creep);
        }
    }
    
    // Coordinate defense
    military.forEach(creep => {
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
        } else if (creep.memory.role === ROLE_HEALER && creep.heal) {
            // Heal damaged allies
            const damagedAlly = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: ally => ally.hits < ally.hitsMax
            });
            
            if (damagedAlly) {
                if (creep.heal(damagedAlly) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(damagedAlly, { visualizePathStyle: { stroke: '#00ff00' } });
                }
            } else {
                creep.moveTo(target, { visualizePathStyle: { stroke: '#ffff00' } });
            }
        }
    });
}

function coordinateAttack(targetRoom) {
    // Assign attack mission to military units
    const military = [];
    for (let name in Game.creeps) {
        const creep = Game.creeps[name];
        if (creep.memory.role === ROLE_SOLDIER || creep.memory.role === ROLE_RANGED || creep.memory.role === ROLE_HEALER) {
            military.push(creep);
            creep.memory.attackTarget = targetRoom;
        }
    }
    
    console.log(`📍 Attack coordinated on ${targetRoom} with ${military.length} units`);
}

function spawnWarUnits() {
    const spawn = Game.spawns.Spawn1;
    if (!spawn || spawn.spawning) return;
    
    const room = spawn.room;
    const energyAvailable = room.energyAvailable;
    
    const counts = countWarCreeps();
    const militaryTotal = counts.soldier + counts.ranged + counts.healer;
    
    console.log(`📊 War status: ${counts.harvester}H, ${counts.soldier}S, ${counts.ranged}R, ${counts.healer}H, Energy: ${energyAvailable}`);
    
    // WAR PRIORITY 1: Minimum economy for survival
    if (counts.harvester < MIN_ECONOMY && energyAvailable >= 200) {
        spawnCreep(spawn, ROLE_HARVESTER, WAR_HARVESTER);
        return;
    }
    
    // WAR PRIORITY 2: Maximum military force
    if (militaryTotal < MAX_MILITARY) {
        // Prioritize based on war phase
        if (warState.warPhase === 'DEFENSE') {
            // Defense priority: Soldiers > Healers > Ranged
            if (counts.soldier < 12 && energyAvailable >= 130) {
                spawnCreep(spawn, ROLE_SOLDIER, WAR_SOLDIER);
                return;
            }
            if (counts.healer < 4 && energyAvailable >= 300) {
                spawnCreep(spawn, ROLE_HEALER, WAR_HEALER);
                return;
            }
            if (counts.ranged < 6 && energyAvailable >= 200) {
                spawnCreep(spawn, ROLE_RANGED, WAR_RANGED);
                return;
            }
        } else {
            // Attack priority: Balanced force
            if (counts.soldier < 8 && energyAvailable >= 130) {
                spawnCreep(spawn, ROLE_SOLDIER, WAR_SOLDIER);
                return;
            }
            if (counts.ranged < 6 && energyAvailable >= 200) {
                spawnCreep(spawn, ROLE_RANGED, WAR_RANGED);
                return;
            }
            if (counts.healer < 4 && energyAvailable >= 300) {
                spawnCreep(spawn, ROLE_HEALER, WAR_HEALER);
                return;
            }
        }
    }
    
    // WAR PRIORITY 3: Scouts for intelligence
    if (counts.scout < 2 && energyAvailable >= 50) {
        spawnCreep(spawn, ROLE_SCOUT, WAR_SCOUT);
        return;
    }
    
    // WAR PRIORITY 4: Upgraders for room growth
    if (counts.upgrader < 3 && energyAvailable >= 300) {
        spawnCreep(spawn, ROLE_UPGRADER, [WORK, CARRY, MOVE, MOVE]);
        return;
    }
}

function spawnCreep(spawn, role, body) {
    const result = spawn.spawnCreep(body, `${role}_${Game.time}`, {
        memory: { role: role, warUnit: true }
    });
    
    if (result === OK) {
        console.log(`🐣 WAR SPAWN: ${role} (${body.join(",")})`);
    } else if (result === ERR_NOT_ENOUGH_ENERGY) {
        console.log(`⏳ War production delayed: ${role}`);
    }
}

function countWarCreeps() {
    const counts = {
        harvester: 0,
        upgrader: 0,
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

function controlWarForces() {
    for (let name in Game.creeps) {
        const creep = Game.creeps[name];
        
        // Handle attack missions
        if (creep.memory.attackTarget && creep.memory.attackTarget !== creep.room.name) {
            executeAttackMission(creep);
            continue;
        }
        
        switch (creep.memory.role) {
            case ROLE_HARVESTER:
                runWarHarvester(creep);
                break;
            case ROLE_UPGRADER:
                runWarUpgrader(creep);
                break;
            case ROLE_SOLDIER:
                runWarSoldier(creep);
                break;
            case ROLE_RANGED:
                runWarRanged(creep);
                break;
            case ROLE_HEALER:
                runWarHealer(creep);
                break;
            case ROLE_SCOUT:
                runWarScout(creep);
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
        // In enemy territory - destroy everything!
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
            // Destroy structures if no enemies
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

function runWarHarvester(creep) {
    if (creep.store.getFreeCapacity() > 0) {
        const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (source) {
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
    } else {
        // War priority: spawn > towers > extensions
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

function runWarUpgrader(creep) {
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

function runWarSoldier(creep) {
    if (creep.memory.attackTarget) return; // Handled by attack mission
    
    const target = findEnemyTarget(creep);
    
    if (target) {
        if (creep.attack(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000' } });
        }
    } else {
        // Defensive positioning
        const spawn = Game.spawns.Spawn1;
        if (spawn) {
            if (creep.pos.getRangeTo(spawn) > 8) {
                creep.moveTo(spawn, { visualizePathStyle: { stroke: '#00ff00' } });
            }
        }
    }
}

function runWarRanged(creep) {
    if (creep.memory.attackTarget) return; // Handled by attack mission
    
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

function runWarHealer(creep) {
    if (creep.memory.attackTarget) return; // Handled by attack mission
    
    // Prioritize military healing
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

function runWarScout(creep) {
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
        
        console.log(`📡 Scout intel: Room ${targetRoom} - ${enemies.length} enemies, ${enemyStructures.length} structures`);
        
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

function buildWarInfrastructure() {
    const spawn = Game.spawns.Spawn1;
    if (!spawn) return;
    
    const room = spawn.room;
    
    // Maximum extensions for energy
    const extensionCount = room.find(FIND_STRUCTURES, {
        filter: structure => structure.structureType === STRUCTURE_EXTENSION
    }).length;
    
    const maxExtensions = CONTROLLER_STRUCTURES.extension[room.controller.level];
    
    if (extensionCount < maxExtensions) {
        const pos = findBuildPosition(spawn.pos, 3);
        if (pos) {
            room.createConstructionSite(pos.x, pos.y, STRUCTURE_EXTENSION);
        }
    }
    
    // Maximum towers for defense
    const towerCount = room.find(FIND_STRUCTURES, {
        filter: structure => structure.structureType === STRUCTURE_TOWER
    }).length;
    
    const maxTowers = CONTROLLER_STRUCTURES.tower[room.controller.level];
    
    if (towerCount < maxTowers) {
        const pos = findBuildPosition(spawn.pos, 5);
        if (pos) {
            room.createConstructionSite(pos.x, pos.y, STRUCTURE_TOWER);
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

function logWarStatus() {
    const counts = countWarCreeps();
    const militaryTotal = counts.soldier + counts.ranged + counts.healer;
    
    console.log('⚔️ WAR STATUS REPORT:');
    console.log(`⏰ Game Time: ${Game.time}`);
    console.log(`🔥 War Phase: ${warState.warPhase}`);
    console.log(`👥 Total Force: ${Object.keys(Game.creeps).length} creeps`);
    console.log(`⚔️ Military: ${militaryTotal}/${MAX_MILITARY} (S:${counts.soldier} R:${counts.ranged} H:${counts.healer})`);
    console.log(`🌾 Economy: ${counts.harvester}H, ${counts.upgrader}U, ${counts.scout} scouts`);
    console.log(`🎯 Enemies Detected: ${warState.enemyCount}`);
    console.log(`🗺️ Target Rooms: ${warState.targetRooms.join(', ') || 'None'}`);
    
    if (warState.warPhase === 'ATTACK' && warState.targetRooms.length > 0) {
        console.log(`🚀 ATTACK MISSIONS ACTIVE!`);
    }
}