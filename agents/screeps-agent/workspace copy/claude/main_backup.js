// CLAUDE PvP AGGRESSIVE STRATEGY
// Ultimate Goal: DESTROY ALL OPPONENTS AS FAST AS POSSIBLE

// Configuration
const DEFENSE_PRIORITY = 0.6; // 60% focus on defense, 40% on offense
const MAX_CREEPS = 50;
const TOWER_THRESHOLD = 0.7; // Build towers when controller level >= 3
const ATTACK_THRESHOLD = 0.5; // Start attacking when we have sufficient defense

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
    SCOUT: 'scout'
};

// Body part costs
const BODY_COSTS = {
    move: 50,
    work: 100,
    carry: 50,
    attack: 80,
    ranged_attack: 150,
    heal: 250,
    tough: 10
};

// PvP Strategy: Prioritize military units and defense
function getBodyParts(role, energyAvailable) {
    const bodies = {
        [ROLES.HARVESTER]: [
            [WORK, WORK, CARRY, MOVE],
            [WORK, WORK, WORK, CARRY, MOVE, MOVE],
            [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE]
        ],
        [ROLES.BUILDER]: [
            [WORK, CARRY, MOVE],
            [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
            [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
        ],
        [ROLES.UPGRADER]: [
            [WORK, CARRY, MOVE],
            [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
            [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
        ],
        [ROLES.REPAIRER]: [
            [WORK, CARRY, MOVE],
            [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
            [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
        ],
        [ROLES.GUARD]: [
            [TOUGH, ATTACK, MOVE],
            [TOUGH, TOUGH, ATTACK, ATTACK, MOVE, MOVE],
            [TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE]
        ],
        [ROLES.ATTACKER]: [
            [ATTACK, MOVE],
            [ATTACK, ATTACK, MOVE, MOVE],
            [ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE]
        ],
        [ROLES.RANGER]: [
            [RANGED_ATTACK, MOVE],
            [RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE],
            [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE]
        ],
        [ROLES.HEALER]: [
            [HEAL, MOVE],
            [HEAL, HEAL, MOVE, MOVE],
            [HEAL, HEAL, HEAL, MOVE, MOVE, MOVE]
        ],
        [ROLES.SCOUT]: [
            [MOVE, MOVE],
            [MOVE, MOVE, MOVE],
            [MOVE, MOVE, MOVE, MOVE]
        ]
    };
    
    const roleBodies = bodies[role] || bodies[ROLES.HARVESTER];
    
    // Find the best body that fits energy budget
    for (let i = roleBodies.length - 1; i >= 0; i--) {
        const cost = roleBodies[i].reduce((sum, part) => sum + BODY_COSTS[part], 0);
        if (cost <= energyAvailable) {
            return roleBodies[i];
        }
    }
    
    return roleBodies[0]; // Fallback to cheapest
}

// Spawn management
function manageSpawns() {
    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName];
        
        if (spawn.spawning) {
            continue;
        }
        
        const room = spawn.room;
        const energyAvailable = room.energyAvailable;
        const creeps = room.find(FIND_MY_CREEPS);
        
        // Priority system for PvP
        const priorities = calculateSpawnPriorities(room, creeps, energyAvailable);
        
        for (const priority of priorities) {
            if (spawnCreep(spawn, priority.role, priority.body)) {
                console.log(`Spawning ${priority.role} in room ${room.name}`);
                break;
            }
        }
    }
}

function calculateSpawnPriorities(room, creeps, energyAvailable) {
    const priorities = [];
    const creepCounts = countCreepsByRole(creeps);
    const enemyCreeps = room.find(FIND_HOSTILE_CREEPS);
    const hasTower = room.find(FIND_MY_STRUCTURES, {
        filter: s => s.structureType === STRUCTURE_TOWER
    }).length > 0;
    
    // EMERGENCY: No harvesters = spawn immediately
    if (creepCounts[ROLES.HARVESTER] < 2) {
        priorities.push({
            role: ROLES.HARVESTER,
            body: getBodyParts(ROLES.HARVESTER, energyAvailable),
            priority: 100
        });
    }
    
    // PvP Defense: Enemy detected = spawn guards
    if (enemyCreeps.length > 0) {
        priorities.push({
            role: ROLES.GUARD,
            body: getBodyParts(ROLES.GUARD, energyAvailable),
            priority: 90
        });
        
        priorities.push({
            role: ROLES.RANGER,
            body: getBodyParts(ROLES.RANGER, energyAvailable),
            priority: 85
        });
    }
    
    // Early game: Basic economy
    if (room.controller.level <= 2) {
        if (creepCounts[ROLES.HARVESTER] < 4) {
            priorities.push({
                role: ROLES.HARVESTER,
                body: getBodyParts(ROLES.HARVESTER, energyAvailable),
                priority: 80
            });
        }
        
        if (creepCounts[ROLES.BUILDER] < 2) {
            priorities.push({
                role: ROLES.BUILDER,
                body: getBodyParts(ROLES.BUILDER, energyAvailable),
                priority: 70
            });
        }
        
        if (creepCounts[ROLES.UPGRADER] < 2) {
            priorities.push({
                role: ROLES.UPGRADER,
                body: getBodyParts(ROLES.UPGRADER, energyAvailable),
                priority: 60
            });
        }
    }
    
    // Mid game: Military focus
    if (room.controller.level >= 3) {
        if (creepCounts[ROLES.GUARD] < 3) {
            priorities.push({
                role: ROLES.GUARD,
                body: getBodyParts(ROLES.GUARD, energyAvailable),
                priority: 75
            });
        }
        
        if (creepCounts[ROLES.SCOUT] < 1) {
            priorities.push({
                role: ROLES.SCOUT,
                body: getBodyParts(ROLES.SCOUT, energyAvailable),
                priority: 70
            });
        }
        
        if (creepCounts[ROLES.ATTACKER] < 2) {
            priorities.push({
                role: ROLES.ATTACKER,
                body: getBodyParts(ROLES.ATTACKER, energyAvailable),
                priority: 65
            });
        }
    }
    
    // Late game: Full military
    if (room.controller.level >= 4) {
        if (creepCounts[ROLES.HEALER] < 2) {
            priorities.push({
                role: ROLES.HEALER,
                body: getBodyParts(ROLES.HEALER, energyAvailable),
                priority: 60
            });
        }
        
        if (creepCounts[ROLES.RANGER] < 3) {
            priorities.push({
                role: ROLES.RANGER,
                body: getBodyParts(ROLES.RANGER, energyAvailable),
                priority: 55
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
    const result = spawn.spawnCreep(body, `${role}_${Game.time}`, {
        memory: {
            role: role,
            room: spawn.room.name,
            working: false,
            target: null
        }
    });
    
    return result === OK;
}

// Creep behavior management
function manageCreeps() {
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        
        switch (creep.memory.role) {
            case ROLES.HARVESTER:
                runHarvester(creep);
                break;
            case ROLES.BUILDER:
                runBuilder(creep);
                break;
            case ROLES.UPGRADER:
                runUpgrader(creep);
                break;
            case ROLES.REPAIRER:
                runRepairer(creep);
                break;
            case ROLES.GUARD:
                runGuard(creep);
                break;
            case ROLES.ATTACKER:
                runAttacker(creep);
                break;
            case ROLES.RANGER:
                runRanger(creep);
                break;
            case ROLES.HEALER:
                runHealer(creep);
                break;
            case ROLES.SCOUT:
                runScout(creep);
                break;
        }
    }
}

// Economic roles
function runHarvester(creep) {
    if (creep.store.getFreeCapacity() === 0) {
        // Full, go deposit
        const target = findDepositTarget(creep);
        if (target) {
            if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    } else {
        // Need to harvest
        const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (source) {
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
    }
}

function runBuilder(creep) {
    if (creep.store.getUsedCapacity() === 0) {
        // Need energy
        const source = findEnergySource(creep);
        if (source) {
            if (creep.withdraw(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
    } else {
        // Build construction sites
        const target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if (target) {
            if (creep.build(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        } else {
            // No construction sites, help with repairs
            runRepairer(creep);
        }
    }
}

function runUpgrader(creep) {
    if (creep.store.getUsedCapacity() === 0) {
        // Need energy
        const source = findEnergySource(creep);
        if (source) {
            if (creep.withdraw(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
    } else {
        // Upgrade controller
        const controller = creep.room.controller;
        if (controller) {
            if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(controller);
            }
        }
    }
}

function runRepairer(creep) {
    if (creep.store.getUsedCapacity() === 0) {
        // Need energy
        const source = findEnergySource(creep);
        if (source) {
            if (creep.withdraw(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
    } else {
        // Find damaged structures (prioritize defense)
        const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: s => (s.hits < s.hitsMax * 0.8) && 
                        (s.structureType === STRUCTURE_RAMPART || 
                         s.structureType === STRUCTURE_WALL ||
                         s.structureType === STRUCTURE_TOWER)
        });
        
        if (target) {
            if (creep.repair(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        } else {
            // Repair other structures
            const otherTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s => s.hits < s.hitsMax * 0.5
            });
            
            if (otherTarget) {
                if (creep.repair(otherTarget) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(otherTarget);
                }
            }
        }
    }
}

// Military roles
function runGuard(creep) {
    const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
    
    if (enemies.length > 0) {
        const closestEnemy = creep.pos.findClosestByPath(enemies);
        if (closestEnemy) {
            if (creep.attack(closestEnemy) === ERR_NOT_IN_RANGE) {
                creep.moveTo(closestEnemy);
            }
        }
    } else {
        // Patrol near important structures
        const spawn = creep.room.find(FIND_MY_SPAWNS)[0];
        if (spawn) {
            creep.moveTo(spawn.pos.x + Math.random() * 10 - 5, spawn.pos.y + Math.random() * 10 - 5);
        }
    }
}

function runAttacker(creep) {
    // Find enemy spawns or creeps in adjacent rooms
    const enemySpawn = creep.pos.findClosestByPath(FIND_HOSTILE_SPAWNS);
    
    if (enemySpawn) {
        if (creep.attack(enemySpawn) === ERR_NOT_IN_RANGE) {
            creep.moveTo(enemySpawn);
        }
    } else {
        // Look for enemy creeps
        const enemyCreep = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        if (enemyCreep) {
            if (creep.attack(enemyCreep) === ERR_NOT_IN_RANGE) {
                creep.moveTo(enemyCreep);
            }
        } else {
            // Move to enemy room or patrol
            exploreAndAttack(creep);
        }
    }
}

function runRanger(creep) {
    const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
    
    if (enemies.length > 0) {
        // Attack from range
        const target = creep.pos.findClosestByPath(enemies);
        if (target) {
            const range = creep.pos.getRangeTo(target);
            
            if (range <= 3) {
                creep.rangedAttack(target);
            } else {
                creep.moveTo(target);
            }
            
            // Mass attack if enemies are clustered
            if (range <= 1) {
                creep.rangedMassAttack();
            }
        }
    } else {
        // Support attackers or explore
        const allies = creep.room.find(FIND_MY_CREEPS, {
            filter: c => c.memory.role === ROLES.ATTACKER
        });
        
        if (allies.length > 0) {
            creep.moveTo(allies[0]);
        } else {
            exploreAndAttack(creep);
        }
    }
}

function runHealer(creep) {
    // Heal damaged allies
    const damagedAlly = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
        filter: c => c.hits < c.hitsMax
    });
    
    if (damagedAlly) {
        const range = creep.pos.getRangeTo(damagedAlly);
        
        if (range <= 1) {
            creep.heal(damagedAlly);
        } else {
            creep.rangedHeal(damagedAlly);
            creep.moveTo(damagedAlly);
        }
    } else {
        // Follow military units
        const military = creep.room.find(FIND_MY_CREEPS, {
            filter: c => [ROLES.ATTACKER, ROLES.RANGER, ROLES.GUARD].includes(c.memory.role)
        });
        
        if (military.length > 0) {
            creep.moveTo(military[0]);
        }
    }
}

function runScout(creep) {
    // Explore adjacent rooms
    const exits = Game.map.describeExits(creep.room.name);
    
    if (exits) {
        const directions = Object.values(exits);
        const targetRoom = directions[Math.floor(Math.random() * directions.length)];
        
        if (creep.room.name !== targetRoom) {
            const exitDir = creep.room.findExit(targetRoom);
            const exit = creep.pos.findClosestByPath(exitDir);
            
            if (exit) {
                creep.moveTo(exit);
            }
        } else {
            // Scout current room
            const enemyStructures = creep.room.find(FIND_HOSTILE_STRUCTURES);
            const enemySpawns = creep.room.find(FIND_HOSTILE_SPAWNS);
            
            if (enemySpawns.length > 0) {
                // Report back enemy spawn location
                creep.memory.enemySpawn = enemySpawns[0].pos;
            }
            
            // Move to unexplored areas
            creep.moveTo(Math.random() * 49, Math.random() * 49);
        }
    }
}

// Helper functions
function findEnergySource(creep) {
    // Priority: Storage > Container > Spawn/Extension > Source
    const storage = creep.room.find(FIND_STRUCTURES, {
        filter: s => s.structureType === STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] > 0
    })[0];
    
    if (storage) return storage;
    
    const container = creep.room.find(FIND_STRUCTURES, {
        filter: s => s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0
    })[0];
    
    if (container) return container;
    
    const spawnExtension = creep.room.find(FIND_STRUCTURES, {
        filter: s => (s.structureType === STRUCTURE_SPAWN || s.structureType === STRUCTURE_EXTENSION) && 
                    s.store[RESOURCE_ENERGY] > 0
    })[0];
    
    if (spawnExtension) return spawnExtension;
    
    return creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
}

function findDepositTarget(creep) {
    // Priority: Spawn > Extension > Tower > Storage
    const spawn = creep.room.find(FIND_STRUCTURES, {
        filter: s => s.structureType === STRUCTURE_SPAWN && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    })[0];
    
    if (spawn) return spawn;
    
    const extension = creep.room.find(FIND_STRUCTURES, {
        filter: s => s.structureType === STRUCTURE_EXTENSION && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    })[0];
    
    if (extension) return extension;
    
    const tower = creep.room.find(FIND_STRUCTURES, {
        filter: s => s.structureType === STRUCTURE_TOWER && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    })[0];
    
    if (tower) return tower;
    
    const storage = creep.room.find(FIND_STRUCTURES, {
        filter: s => s.structureType === STRUCTURE_STORAGE && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    })[0];
    
    if (storage) return storage;
    
    return null;
}

function exploreAndAttack(creep) {
    // Move to adjacent rooms looking for enemies
    const exits = Game.map.describeExits(creep.room.name);
    
    if (exits) {
        const directions = Object.values(exits);
        const targetRoom = directions[Math.floor(Math.random() * directions.length)];
        
        const exitDir = creep.room.findExit(targetRoom);
        const exit = creep.pos.findClosestByPath(exitDir);
        
        if (exit) {
            creep.moveTo(exit);
        }
    }
}

// Defense management
function manageDefense() {
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        
        // Tower defense
        const towers = room.find(FIND_MY_STRUCTURES, {
            filter: s => s.structureType === STRUCTURE_TOWER
        });
        
        for (const tower of towers) {
            const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: s => s.hits < s.hitsMax && 
                           (s.structureType === STRUCTURE_RAMPART || 
                            s.structureType === STRUCTURE_WALL ||
                            s.structureType === STRUCTURE_TOWER)
            });
            
            if (closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }
            
            const closestEnemy = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (closestEnemy) {
                tower.attack(closestEnemy);
            }
        }
        
        // Build defensive structures
        buildDefense(room);
    }
}

function buildDefense(room) {
    const controller = room.controller;
    if (!controller || controller.level < 3) return;
    
    const spawn = room.find(FIND_MY_SPAWNS)[0];
    if (!spawn) return;
    
    // Build ramparts around spawn
    const spawnPos = spawn.pos;
    for (let x = spawnPos.x - 2; x <= spawnPos.x + 2; x++) {
        for (let y = spawnPos.y - 2; y <= spawnPos.y + 2; y++) {
            if (x >= 0 && x < 50 && y >= 0 && y < 50) {
                const pos = new RoomPosition(x, y, room.name);
                const structures = pos.lookFor(LOOK_STRUCTURES);
                
                if (structures.length === 0 && !(x === spawnPos.x && y === spawnPos.y)) {
                    room.createConstructionSite(x, y, STRUCTURE_RAMPART);
                }
            }
        }
    }
    
    // Build walls at room exits
    if (controller.level >= 4) {
        const exits = Game.map.describeExits(room.name);
        if (exits) {
            for (const [dir, targetRoom] of Object.entries(exits)) {
                const exitPositions = room.find(parseInt(dir));
                for (const pos of exitPositions.slice(0, 3)) {
                    room.createConstructionSite(pos.x, pos.y, STRUCTURE_WALL);
                }
            }
        }
    }
}

// Main loop
module.exports.loop = function () {
    // Clear dead creeps memory
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
    
    // Run all systems
    manageSpawns();
    manageCreeps();
    manageDefense();
    
    // Emergency defense check
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        const enemies = room.find(FIND_HOSTILE_CREEPS);
        
        if (enemies.length > 0) {
            console.log(`ENEMY DETECTED in ${roomName}! ${enemies.length} hostile creeps`);
            
            // Emergency spawn guards
            const spawn = room.find(FIND_MY_SPAWNS)[0];
            if (spawn && !spawn.spawning) {
                const guards = room.find(FIND_MY_CREEPS, {
                    filter: c => c.memory.role === ROLES.GUARD
                });
                
                if (guards.length < enemies.length * 2) {
                    const body = getBodyParts(ROLES.GUARD, room.energyAvailable);
                    spawnCreep(spawn, ROLES.GUARD, body);
                }
            }
        }
    }
    
    console.log(`Tick ${Game.time}: ${Object.keys(Game.creeps).length} creeps, ${Object.keys(Game.spawns).length} spawns`);
};