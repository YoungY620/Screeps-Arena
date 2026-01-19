// CLAUDE PvP ULTRA-AGGRESSIVE STRATEGY v2.0
// Enhanced for maximum destruction and rapid elimination

// Configuration - MORE AGGRESSIVE
const DEFENSE_PRIORITY = 0.4; // 40% defense, 60% offense - MORE OFFENSIVE
const MAX_CREEPS = 60; // INCREASED LIMIT
const TOWER_THRESHOLD = 0.6; // Build towers earlier
const ATTACK_THRESHOLD = 0.3; // Attack EARLIER - at 30% readiness

// Role definitions
const ROLES = {
    HARVESTER: 'harvester',
    BUILDER: 'builder',
    UPGRADER: 'upgrader',
    REPAIRER: 'repairer',
    GUARD: 'guard',
    ATTACKER: 'attacker',
    RANGER: 'ranger',
    HEALER: 'healer',
    SCOUT: 'scout',
    SABOTEUR: 'saboteur' // NEW ROLE for economic warfare
};

// Body part costs
const BODY_COSTS = {
    move: 50,
    work: 100,
    carry: 50,
    attack: 80,
    ranged_attack: 150,
    heal: 250,
    tough: 10,
    claim: 600
};

// ULTRA-AGGRESSIVE body configurations
function getBodyParts(role, energyAvailable) {
    const bodies = {
        [ROLES.HARVESTER]: [
            [WORK, WORK, CARRY, MOVE],
            [WORK, WORK, WORK, CARRY, MOVE, MOVE],
            [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE],
            [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
        ],
        [ROLES.BUILDER]: [
            [WORK, CARRY, MOVE],
            [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
            [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
            [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
        ],
        [ROLES.UPGRADER]: [
            [WORK, CARRY, MOVE],
            [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
            [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
            [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
        ],
        [ROLES.REPAIRER]: [
            [WORK, CARRY, MOVE],
            [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
            [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
            [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
        ],
        [ROLES.GUARD]: [
            [TOUGH, ATTACK, MOVE],
            [TOUGH, TOUGH, ATTACK, ATTACK, MOVE, MOVE],
            [TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE],
            [TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE]
        ],
        [ROLES.ATTACKER]: [
            [ATTACK, MOVE],
            [ATTACK, ATTACK, MOVE, MOVE],
            [ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE],
            [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE]
        ],
        [ROLES.RANGER]: [
            [RANGED_ATTACK, MOVE],
            [RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE],
            [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE],
            [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE]
        ],
        [ROLES.HEALER]: [
            [HEAL, MOVE],
            [HEAL, HEAL, MOVE, MOVE],
            [HEAL, HEAL, HEAL, MOVE, MOVE, MOVE],
            [HEAL, HEAL, HEAL, HEAL, MOVE, MOVE, MOVE, MOVE]
        ],
        [ROLES.SCOUT]: [
            [MOVE, MOVE],
            [MOVE, MOVE, MOVE],
            [MOVE, MOVE, MOVE, MOVE],
            [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
        ],
        [ROLES.SABOTEUR]: [
            [MOVE, MOVE, CLAIM], // For attacking controllers
            [MOVE, MOVE, MOVE, CLAIM, CLAIM],
            [MOVE, MOVE, MOVE, MOVE, CLAIM, CLAIM, CLAIM]
        ]
    };
    
    const roleBodies = bodies[role] || bodies[ROLES.HARVESTER];
    
    // Find the best body that fits energy budget - PRIORITIZE BIGGER BODIES
    for (let i = roleBodies.length - 1; i >= 0; i--) {
        const cost = roleBodies[i].reduce((sum, part) => sum + BODY_COSTS[part], 0);
        if (cost <= energyAvailable) {
            return roleBodies[i];
        }
    }
    
    return roleBodies[0]; // Fallback to cheapest
}

// ENHANCED spawn management with WAR PRIORITIES
function manageSpawns() {
    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName];
        
        if (spawn.spawning) {
            continue;
        }
        
        const room = spawn.room;
        const energyAvailable = room.energyAvailable;
        const creeps = room.find(FIND_MY_CREEPS);
        
        // ULTRA-AGGRESSIVE priority system
        const priorities = calculateUltraSpawnPriorities(room, creeps, energyAvailable);
        
        for (const priority of priorities) {
            if (spawnCreep(spawn, priority.role, priority.body)) {
                console.log(`🚀 ULTRA SPAWN: ${priority.role} in room ${room.name}`);
                break;
            }
        }
    }
}

function calculateUltraSpawnPriorities(room, creeps, energyAvailable) {
    const priorities = [];
    const creepCounts = countCreepsByRole(creeps);
    const enemyCreeps = room.find(FIND_HOSTILE_CREEPS);
    const hasTower = room.find(FIND_MY_STRUCTURES, {
        filter: s => s.structureType === STRUCTURE_TOWER
    }).length > 0;
    
    // CRITICAL EMERGENCY: Enemy in base = MASSIVE MILITARY RESPONSE
    if (enemyCreeps.length > 0) {
        console.log(`🚨 ENEMY DETECTED: ${enemyCreeps.length} hostiles in ${room.name}`);
        
        // IMMEDIATE GUARD DEPLOYMENT
        for (let i = 0; i < Math.min(enemyCreeps.length * 3, 6); i++) {
            priorities.push({
                role: ROLES.GUARD,
                body: getBodyParts(ROLES.GUARD, energyAvailable),
                priority: 1000 + i
            });
        }
        
        // RANGER SUPPORT
        for (let i = 0; i < Math.min(enemyCreeps.length * 2, 4); i++) {
            priorities.push({
                role: ROLES.RANGER,
                body: getBodyParts(ROLES.RANGER, energyAvailable),
                priority: 950 + i
            });
        }
        
        // HEALER SUPPORT
        priorities.push({
            role: ROLES.HEALER,
            body: getBodyParts(ROLES.HEALER, energyAvailable),
            priority: 900
        });
    }
    
    // ULTRA-AGGRESSIVE: Always maintain attack force
    if (room.controller.level >= 2) {
        if (creepCounts[ROLES.ATTACKER] < 4) {
            priorities.push({
                role: ROLES.ATTACKER,
                body: getBodyParts(ROLES.ATTACKER, energyAvailable),
                priority: 800
            });
        }
        
        if (creepCounts[ROLES.SCOUT] < 2) {
            priorities.push({
                role: ROLES.SCOUT,
                body: getBodyParts(ROLES.SCOUT, energyAvailable),
                priority: 750
            });
        }
    }
    
    // ECONOMIC BASE (but still aggressive)
    if (creepCounts[ROLES.HARVESTER] < 3) {
        priorities.push({
            role: ROLES.HARVESTER,
            body: getBodyParts(ROLES.HARVESTER, energyAvailable),
            priority: 700
        });
    }
    
    if (room.controller.level >= 3) {
        // CONTROLLER ATTACKERS for economic warfare
        if (creepCounts[ROLES.SABOTEUR] < 2) {
            priorities.push({
                role: ROLES.SABOTEUR,
                body: getBodyParts(ROLES.SABOTEUR, energyAvailable),
                priority: 650
            });
        }
        
        // CONSTANT GUARD PRESENCE
        if (creepCounts[ROLES.GUARD] < 6) {
            priorities.push({
                role: ROLES.GUARD,
                body: getBodyParts(ROLES.GUARD, energyAvailable),
                priority: 600
            });
        }
    }
    
    return priorities.sort((a, b) => b.priority - a.priority);
}

function countCreepsByRole(creeps) {
    const counts = {};
    for (const role of Object.values(ROLES)) {
        counts[role] = creeps.filter(c => c.memory.role === role).length;
    }
    return counts;
}

function spawnCreep(spawn, role, body) {
    const result = spawn.spawnCreep(body, `${role}_${Game.time}_${Math.random().toString(36).substr(2, 4)}`, {
        memory: {
            role: role,
            room: spawn.room.name,
            working: false,
            target: null,
            aggressive: true, // NEW: Mark as aggressive unit
            spawnTime: Game.time
        }
    });
    
    return result === OK;
}

// ULTRA-AGGRESSIVE creep behaviors
function manageCreeps() {
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        
        try {
            switch (creep.memory.role) {
                case ROLES.HARVESTER:
                    runUltraHarvester(creep);
                    break;
                case ROLES.BUILDER:
                    runUltraBuilder(creep);
                    break;
                case ROLES.UPGRADER:
                    runUltraUpgrader(creep);
                    break;
                case ROLES.REPAIRER:
                    runUltraRepairer(creep);
                    break;
                case ROLES.GUARD:
                    runUltraGuard(creep);
                    break;
                case ROLES.ATTACKER:
                    runUltraAttacker(creep);
                    break;
                case ROLES.RANGER:
                    runUltraRanger(creep);
                    break;
                case ROLES.HEALER:
                    runUltraHealer(creep);
                    break;
                case ROLES.SCOUT:
                    runUltraScout(creep);
                    break;
                case ROLES.SABOTEUR:
                    runSaboteur(creep);
                    break;
            }
        } catch (error) {
            console.log(`Error managing creep ${name}: ${error}`);
        }
    }
}

// ULTRA-AGGRESSIVE economic roles
function runUltraHarvester(creep) {
    // If enemies nearby, FIGHT BACK!
    const nearbyEnemies = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
    if (nearbyEnemies.length > 0 && creep.getActiveBodyparts(ATTACK) > 0) {
        creep.attack(nearbyEnemies[0]);
        return;
    }
    
    if (creep.store.getFreeCapacity() === 0) {
        // URGENT deposit - prioritize military structures
        const target = findUltraDepositTarget(creep);
        if (target) {
            if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    } else {
        // AGGRESSIVE harvesting
        const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (source) {
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
}

function runUltraBuilder(creep) {
    // If enemies nearby, FIGHT!
    const nearbyEnemies = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
    if (nearbyEnemies.length > 0 && creep.getActiveBodyparts(ATTACK) > 0) {
        creep.attack(nearbyEnemies[0]);
        return;
    }
    
    if (creep.store.getUsedCapacity() === 0) {
        const source = findEnergySource(creep);
        if (source) {
            if (creep.withdraw(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    } else {
        // PRIORITIZE DEFENSIVE STRUCTURES
        const target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {
            filter: s => s.structureType === STRUCTURE_TOWER || 
                        s.structureType === STRUCTURE_RAMPART ||
                        s.structureType === STRUCTURE_WALL
        });
        
        if (target) {
            if (creep.build(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            // Then other structures
            const otherTarget = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if (otherTarget) {
                if (creep.build(otherTarget) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(otherTarget, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                runUltraRepairer(creep);
            }
        }
    }
}

function runUltraUpgrader(creep) {
    // If enemies nearby, ALERT!
    const nearbyEnemies = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 5);
    if (nearbyEnemies.length > 0) {
        console.log(`🚨 ENEMIES NEAR CONTROLLER in ${creep.room.name}!`);
        // Try to get help
        const guards = creep.room.find(FIND_MY_CREEPS, {
            filter: c => c.memory.role === ROLES.GUARD
        });
        if (guards.length > 0) {
            creep.moveTo(guards[0]);
        }
        return;
    }
    
    if (creep.store.getUsedCapacity() === 0) {
        const source = findEnergySource(creep);
        if (source) {
            if (creep.withdraw(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffff00'}});
            }
        }
    } else {
        const controller = creep.room.controller;
        if (controller) {
            if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(controller, {visualizePathStyle: {stroke: '#ffff00'}});
            }
        }
    }
}

function runUltraRepairer(creep) {
    // If enemies nearby, FIGHT!
    const nearbyEnemies = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
    if (nearbyEnemies.length > 0 && creep.getActiveBodyparts(ATTACK) > 0) {
        creep.attack(nearbyEnemies[0]);
        return;
    }
    
    if (creep.store.getUsedCapacity() === 0) {
        const source = findEnergySource(creep);
        if (source) {
            if (creep.withdraw(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#00ff00'}});
            }
        }
    } else {
        // PRIORITIZE CRITICAL DEFENSE
        const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: s => (s.hits < s.hitsMax * 0.5) && 
                        (s.structureType === STRUCTURE_RAMPART || 
                         s.structureType === STRUCTURE_WALL ||
                         s.structureType === STRUCTURE_TOWER ||
                         s.structureType === STRUCTURE_SPAWN)
        });
        
        if (target) {
            if (creep.repair(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#00ff00'}});
            }
        }
    }
}

// ULTRA-AGGRESSIVE military roles
function runUltraGuard(creep) {
    const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
    
    if (enemies.length > 0) {
        // PRIORITIZE DANGEROUS ENEMIES
        const priorityTarget = enemies.find(e => 
            e.getActiveBodyparts(ATTACK) > 0 || 
            e.getActiveBodyparts(RANGED_ATTACK) > 0
        ) || enemies[0];
        
        const closestDangerous = creep.pos.findClosestByPath(enemies.filter(e => 
            e.getActiveBodyparts(ATTACK) > 0 || e.getActiveBodyparts(RANGED_ATTACK) > 0
        )) || creep.pos.findClosestByPath(enemies);
        
        if (closestDangerous) {
            if (creep.attack(closestDangerous) === ERR_NOT_IN_RANGE) {
                creep.moveTo(closestDangerous, {visualizePathStyle: {stroke: '#ff0000'}});
            }
        }
    } else {
        // PATROL AGGRESSIVELY
        const spawn = creep.room.find(FIND_MY_SPAWNS)[0];
        if (spawn) {
            // Random aggressive patrol
            const angle = Math.random() * Math.PI * 2;
            const distance = 5 + Math.random() * 10;
            const targetX = spawn.pos.x + Math.cos(angle) * distance;
            const targetY = spawn.pos.y + Math.sin(angle) * distance;
            
            creep.moveTo(Math.max(0, Math.min(49, targetX)), Math.max(0, Math.min(49, targetY)));
        }
    }
}

function runUltraAttacker(creep) {
    // FIND ENEMY SPAWNS FIRST - HIGHEST PRIORITY
    const enemySpawns = creep.room.find(FIND_HOSTILE_SPAWNS);
    
    if (enemySpawns.length > 0) {
        const target = creep.pos.findClosestByPath(enemySpawns);
        if (target) {
            if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
            }
        }
        return;
    }
    
    // Then enemy creeps
    const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
    if (enemies.length > 0) {
        // PRIORITIZE ATTACKERS
        const dangerousEnemies = enemies.filter(e => 
            e.getActiveBodyparts(ATTACK) > 0 || e.getActiveBodyparts(RANGED_ATTACK) > 0
        );
        
        const target = creep.pos.findClosestByPath(dangerousEnemies.length > 0 ? dangerousEnemies : enemies);
        if (target) {
            if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
            }
        }
    } else {
        // INVADE ADJACENT ROOMS
        ultraInvadeAdjacentRooms(creep);
    }
}

function runUltraRanger(creep) {
    const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
    
    if (enemies.length > 0) {
        // KITE ENEMIES - STAY AT RANGE
        const target = creep.pos.findClosestByPath(enemies);
        if (target) {
            const range = creep.pos.getRangeTo(target);
            
            if (range <= 3) {
                creep.rangedAttack(target);
            }
            
            if (range <= 1) {
                // TOO CLOSE - BACK UP!
                const fleeDirection = creep.pos.getDirectionTo(target);
                const fleePos = creep.pos.getAdjacentPosition((fleeDirection + 3) % 8 + 1);
                creep.moveTo(fleePos);
                creep.rangedMassAttack();
            } else if (range > 3) {
                // TOO FAR - ADVANCE
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff00ff'}});
            }
        }
    } else {
        // SUPPORT ATTACKERS or INVADE
        const attackers = creep.room.find(FIND_MY_CREEPS, {
            filter: c => c.memory.role === ROLES.ATTACKER
        });
        
        if (attackers.length > 0) {
            // Follow but stay at range
            const range = creep.pos.getRangeTo(attackers[0]);
            if (range > 2) {
                creep.moveTo(attackers[0], {visualizePathStyle: {stroke: '#ff00ff'}});
            }
        } else {
            ultraInvadeAdjacentRooms(creep);
        }
    }
}

function runUltraHealer(creep) {
    // PRIORITIZE HEALING ATTACKERS
    const damagedAttackers = creep.room.find(FIND_MY_CREEPS, {
        filter: c => (c.hits < c.hitsMax) && 
                    [ROLES.ATTACKER, ROLES.RANGER, ROLES.GUARD].includes(c.memory.role)
    });
    
    if (damagedAttackers.length > 0) {
        const target = creep.pos.findClosestByPath(damagedAttackers);
        if (target) {
            const range = creep.pos.getRangeTo(target);
            
            if (range <= 1) {
                creep.heal(target);
            } else {
                creep.rangedHeal(target);
                creep.moveTo(target, {visualizePathStyle: {stroke: '#00ff00'}});
            }
        }
    } else {
        // Heal any damaged ally
        const damagedAlly = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
            filter: c => c.hits < c.hitsMax
        });
        
        if (damagedAlly) {
            const range = creep.pos.getRangeTo(damagedAlly);
            
            if (range <= 1) {
                creep.heal(damagedAlly);
            } else {
                creep.rangedHeal(damagedAlly);
                creep.moveTo(damagedAlly, {visualizePathStyle: {stroke: '#00ff00'}});
            }
        } else {
            // Follow military units
            const military = creep.room.find(FIND_MY_CREEPS, {
                filter: c => [ROLES.ATTACKER, ROLES.RANGER, ROLES.GUARD].includes(c.memory.role)
            });
            
            if (military.length > 0) {
                creep.moveTo(military[0], {visualizePathStyle: {stroke: '#00ff00'}});
            }
        }
    }
}

function runUltraScout(creep) {
    // AGGRESSIVE SCOUTING - Map enemy bases
    const exits = Game.map.describeExits(creep.room.name);
    
    if (exits) {
        // Find un-scouted rooms
        const unscoutedRooms = Object.values(exits).filter(roomName => 
            !Memory.scoutedRooms || !Memory.scoutedRooms[roomName]
        );
        
        const targetRoom = unscoutedRooms.length > 0 ? 
            unscoutedRooms[0] : 
            Object.values(exits)[Math.floor(Math.random() * Object.values(exits).length)];
        
        if (creep.room.name !== targetRoom) {
            const exitDir = creep.room.findExit(targetRoom);
            const exit = creep.pos.findClosestByPath(exitDir);
            
            if (exit) {
                creep.moveTo(exit, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            // INTELLIGENCE GATHERING
            const enemySpawns = creep.room.find(FIND_HOSTILE_SPAWNS);
            const enemyStructures = creep.room.find(FIND_HOSTILE_STRUCTURES);
            const enemyCreeps = creep.room.find(FIND_HOSTILE_CREEPS);
            
            // Record intelligence
            if (!Memory.scoutedRooms) Memory.scoutedRooms = {};
            Memory.scoutedRooms[creep.room.name] = {
                lastScouted: Game.time,
                enemySpawns: enemySpawns.length,
                enemyStructures: enemyStructures.length,
                enemyCreeps: enemyCreeps.length,
                threatLevel: enemySpawns.length + enemyCreeps.length
            };
            
            console.log(`📡 SCOUT INTEL: ${creep.room.name} - ${enemySpawns.length} spawns, ${enemyCreeps.length} creeps`);
            
            // If enemies found, MARK FOR INVASION
            if (enemySpawns.length > 0 || enemyCreeps.length > 0) {
                if (!Memory.invasionTargets) Memory.invasionTargets = [];
                if (!Memory.invasionTargets.includes(creep.room.name)) {
                    Memory.invasionTargets.push(creep.room.name);
                    console.log(`🎯 INVASION TARGET ADDED: ${creep.room.name}`);
                }
            }
            
            // Move to map the room
            creep.moveTo(Math.floor(Math.random() * 50), Math.floor(Math.random() * 50), 
                        {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
}

function runSaboteur(creep) {
    // ECONOMIC WARFARE - Attack enemy controllers
    const enemyControllers = creep.room.find(FIND_HOSTILE_STRUCTURES, {
        filter: s => s.structureType === STRUCTURE_CONTROLLER
    });
    
    if (enemyControllers.length > 0) {
        const target = enemyControllers[0];
        if (creep.attackController) {
            const result = creep.attackController(target);
            if (result === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff00ff'}});
            } else if (result === OK) {
                console.log(`⚡ SABOTEUR attacking controller in ${creep.room.name}`);
            }
        }
    } else {
        // Invade rooms with enemy structures
        ultraInvadeAdjacentRooms(creep);
    }
}

// ULTRA-AGGRESSIVE invasion function
function ultraInvadeAdjacentRooms(creep) {
    const exits = Game.map.describeExits(creep.room.name);
    
    if (exits) {
        // Prioritize known enemy rooms
        if (Memory.invasionTargets && Memory.invasionTargets.length > 0) {
            const targetRoom = Memory.invasionTargets.find(room => 
                Object.values(exits).includes(room)
            );
            
            if (targetRoom) {
                const exitDir = creep.room.findExit(targetRoom);
                const exit = creep.pos.findClosestByPath(exitDir);
                
                if (exit) {
                    creep.moveTo(exit, {visualizePathStyle: {stroke: '#ff0000'}});
                    return;
                }
            }
        }
        
        // Otherwise, random invasion
        const directions = Object.values(exits);
        const targetRoom = directions[Math.floor(Math.random() * directions.length)];
        
        const exitDir = creep.room.findExit(targetRoom);
        const exit = creep.pos.findClosestByPath(exitDir);
        
        if (exit) {
            creep.moveTo(exit, {visualizePathStyle: {stroke: '#ff0000'}});
        }
    }
}

// Enhanced helper functions
function findUltraDepositTarget(creep) {
    // PRIORITIZE: Towers > Spawns > Extensions
    const tower = creep.room.find(FIND_STRUCTURES, {
        filter: s => s.structureType === STRUCTURE_TOWER && 
                    s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    })[0];
    
    if (tower) return tower;
    
    const spawn = creep.room.find(FIND_STRUCTURES, {
        filter: s => s.structureType === STRUCTURE_SPAWN && 
                    s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    })[0];
    
    if (spawn) return spawn;
    
    const extension = creep.room.find(FIND_STRUCTURES, {
        filter: s => s.structureType === STRUCTURE_EXTENSION && 
                    s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    })[0];
    
    if (extension) return extension;
    
    // Then other structures
    return findDepositTarget(creep);
}

// ULTRA-AGGRESSIVE defense management
function manageUltraDefense() {
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        
        // ENHANCED Tower defense
        const towers = room.find(FIND_MY_STRUCTURES, {
            filter: s => s.structureType === STRUCTURE_TOWER
        });
        
        for (const tower of towers) {
            // PRIORITY 1: Attack enemies
            const enemies = room.find(FIND_HOSTILE_CREEPS);
            if (enemies.length > 0) {
                // Target most dangerous enemy
                const dangerousEnemies = enemies.filter(e => 
                    e.getActiveBodyparts(ATTACK) > 0 || e.getActiveBodyparts(RANGED_ATTACK) > 0
                );
                
                const target = tower.pos.findClosestByRange(dangerousEnemies.length > 0 ? dangerousEnemies : enemies);
                if (target) {
                    tower.attack(target);
                    continue; // Don't repair while enemies are present
                }
            }
            
            // PRIORITY 2: Repair critical structures
            const criticalStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: s => s.hits < s.hitsMax * 0.3 && 
                           (s.structureType === STRUCTURE_RAMPART || 
                            s.structureType === STRUCTURE_WALL ||
                            s.structureType === STRUCTURE_TOWER ||
                            s.structureType === STRUCTURE_SPAWN)
            });
            
            if (criticalStructure) {
                tower.repair(criticalStructure);
            }
        }
        
        // ULTRA-AGGRESSIVE defense building
        buildUltraDefense(room);
    }
}

function buildUltraDefense(room) {
    const controller = room.controller;
    if (!controller || controller.level < 2) return;
    
    const spawn = room.find(FIND_MY_SPAWNS)[0];
    if (!spawn) return;
    
    // MASSIVE RAMPART FORTRESS around spawn
    const spawnPos = spawn.pos;
    for (let x = spawnPos.x - 3; x <= spawnPos.x + 3; x++) {
        for (let y = spawnPos.y - 3; y <= spawnPos.y + 3; y++) {
            if (x >= 0 && x < 50 && y >= 0 && y < 50) {
                const pos = new RoomPosition(x, y, room.name);
                const structures = pos.lookFor(LOOK_STRUCTURES);
                const constructionSites = pos.lookFor(LOOK_CONSTRUCTION_SITES);
                
                if (structures.length === 0 && constructionSites.length === 0 && 
                    !(x === spawnPos.x && y === spawnPos.y)) {
                    room.createConstructionSite(x, y, STRUCTURE_RAMPART);
                }
            }
        }
    }
    
    // AGGRESSIVE WALL BUILDING at ALL exits
    if (controller.level >= 3) {
        const exits = Game.map.describeExits(room.name);
        if (exits) {
            for (const [dir, targetRoom] of Object.entries(exits)) {
                const exitPositions = room.find(parseInt(dir));
                for (const pos of exitPositions) {
                    // Build walls at exit positions
                    const structures = pos.lookFor(LOOK_STRUCTURES);
                    const constructionSites = pos.lookFor(LOOK_CONSTRUCTION_SITES);
                    
                    if (structures.length === 0 && constructionSites.length === 0) {
                        room.createConstructionSite(pos.x, pos.y, STRUCTURE_WALL);
                    }
                }
            }
        }
    }
    
    // BUILD TOWERS AGGRESSIVELY
    if (controller.level >= 3) {
        const existingTowers = room.find(FIND_MY_STRUCTURES, {
            filter: s => s.structureType === STRUCTURE_TOWER
        });
        
        if (existingTowers.length < 6) { // MAX TOWERS
            // Build towers in defensive positions
            const towerPositions = [
                {x: spawnPos.x - 5, y: spawnPos.y - 5},
                {x: spawnPos.x + 5, y: spawnPos.y - 5},
                {x: spawnPos.x - 5, y: spawnPos.y + 5},
                {x: spawnPos.x + 5, y: spawnPos.y + 5},
                {x: spawnPos.x, y: spawnPos.y - 7},
                {x: spawnPos.x, y: spawnPos.y + 7}
            ];
            
            for (const pos of towerPositions) {
                if (pos.x >= 0 && pos.x < 50 && pos.y >= 0 && pos.y < 50) {
                    const structures = new RoomPosition(pos.x, pos.y, room.name).lookFor(LOOK_STRUCTURES);
                    const constructionSites = new RoomPosition(pos.x, pos.y, room.name).lookFor(LOOK_CONSTRUCTION_SITES);
                    
                    if (structures.length === 0 && constructionSites.length === 0) {
                        room.createConstructionSite(pos.x, pos.y, STRUCTURE_TOWER);
                        break; // Build one at a time
                    }
                }
            }
        }
    }
}

// Main loop - ULTRA-AGGRESSIVE
module.exports.loop = function () {
    // Clear dead creeps memory
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
    
    // Run ULTRA systems
    manageSpawns();
    manageCreeps();
    manageUltraDefense();
    
    // ULTRA-AGGRESSIVE emergency responses
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        const enemies = room.find(FIND_HOSTILE_CREEPS);
        
        if (enemies.length > 0) {
            console.log(`🚨🚨 ULTRA EMERGENCY: ${enemies.length} ENEMIES in ${roomName}! 🚨🚨`);
            
            // MASSIVE EMERGENCY SPAWN
            const spawn = room.find(FIND_MY_SPAWNS)[0];
            if (spawn && !spawn.spawning && room.energyAvailable >= 300) {
                const guards = room.find(FIND_MY_CREEPS, {
                    filter: c => c.memory.role === ROLES.GUARD
                });
                
                // SPAWN MASSIVE RESPONSE
                if (guards.length < enemies.length * 3) {
                    const body = getBodyParts(ROLES.GUARD, room.energyAvailable);
                    if (spawnCreep(spawn, ROLES.GUARD, body)) {
                        console.log(`🚀 EMERGENCY GUARD DEPLOYED in ${roomName}`);
                    }
                }
            }
            
            // ALERT ALL MILITARY
            const military = room.find(FIND_MY_CREEPS, {
                filter: c => [ROLES.ATTACKER, ROLES.RANGER].includes(c.memory.role)
            });
            
            console.log(`⚔️ ${military.length} military units responding in ${roomName}`);
        }
    }
    
    // ULTRA-AGGRESSIVE invasion planning
    if (Game.time % 50 === 0) { // Every 50 ticks
        if (Memory.invasionTargets && Memory.invasionTargets.length > 0) {
            console.log(`🎯 INVASION TARGETS: ${Memory.invasionTargets.join(', ')}`);
            
            // Launch coordinated attacks
            for (const targetRoom of Memory.invasionTargets) {
                const attackers = Object.values(Game.creeps).filter(c => 
                    c.memory.role === ROLES.ATTACKER && c.room.name !== targetRoom
                );
                
                if (attackers.length >= 3) {
                    console.log(`🚀 LAUNCHING ATTACK on ${targetRoom} with ${attackers.length} units!`);
                }
            }
        }
    }
    
    console.log(`⚡ ULTRA TICK ${Game.time}: ${Object.keys(Game.creeps).length} creeps, ${Object.keys(Game.spawns).length} spawns`);
    
    // Victory check
    if (Game.time % 100 === 0) {
        const allRooms = Object.keys(Game.rooms);
        const myRooms = allRooms.filter(roomName => 
            Game.rooms[roomName].controller && 
            Game.rooms[roomName].controller.my
        );
        
        console.log(`🏆 DOMINION STATUS: ${myRooms.length}/${allRooms.length} rooms controlled`);
    }
};