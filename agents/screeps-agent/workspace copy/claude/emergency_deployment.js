// EMERGENCY DEPLOYMENT - MAXIMUM AGGRESSION PvP AI
// Tick 9650 - ENEMIES LIKELY ACTIVE - IMMEDIATE DEPLOYMENT REQUIRED

// ULTRA-AGGRESSIVE CONFIGURATION
const DEFENSE_PRIORITY = 0.2; // 80% OFFENSE, 20% DEFENSE - MAXIMUM AGGRESSION
const MAX_CREEPS = 120; // ABSOLUTE MAXIMUM ARMY SIZE
const TOWER_THRESHOLD = 0.4; // BUILD TOWERS EARLIER
const ATTACK_THRESHOLD = 0.1; // ATTACK AT 10% READINESS - IMMEDIATE ENGAGEMENT

// ROLE DEFINITIONS
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
    SABOTEUR: 'saboteur',
    ASSASSIN: 'assassin',
    BERSERKER: 'berserker' // NEW: MAXIMUM DAMAGE UNITS
};

// BODY COSTS
const BODY_COSTS = {
    move: 50, work: 100, carry: 50, attack: 80, 
    ranged_attack: 150, heal: 250, tough: 10, claim: 600
};

// MAXIMUM AGGRESSION BODY CONFIGURATIONS
function getEmergencyBodyParts(role, energyAvailable) {
    const emergencyBodies = {
        [ROLES.HARVESTER]: [
            [WORK, WORK, CARRY, MOVE],
            [WORK, WORK, WORK, CARRY, MOVE, MOVE],
            [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE],
            [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
            [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
        ],
        [ROLES.BUILDER]: [
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
            [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE],
            [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
        ],
        [ROLES.RANGER]: [
            [RANGED_ATTACK, MOVE],
            [RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE],
            [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE],
            [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE]
        ],
        [ROLES.ASSASSIN]: [
            [MOVE, ATTACK, ATTACK],
            [MOVE, MOVE, ATTACK, ATTACK, ATTACK],
            [MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK]
        ],
        [ROLES.BERSERKER]: [
            [ATTACK, ATTACK, ATTACK, MOVE],
            [ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE],
            [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE]
        ],
        [ROLES.SABOTEUR]: [
            [MOVE, CLAIM],
            [MOVE, MOVE, CLAIM, CLAIM],
            [MOVE, MOVE, MOVE, CLAIM, CLAIM, CLAIM]
        ]
    };
    
    const roleBodies = emergencyBodies[role] || emergencyBodies[ROLES.HARVESTER];
    
    // MAXIMUM SIZE PRIORITY
    for (let i = roleBodies.length - 1; i >= 0; i--) {
        const cost = roleBodies[i].reduce((sum, part) => sum + BODY_COSTS[part], 0);
        if (cost <= energyAvailable) {
            return roleBodies[i];
        }
    }
    
    return roleBodies[0];
}

// EMERGENCY SPAWN MANAGEMENT
function manageEmergencySpawns() {
    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName];
        if (spawn.spawning) continue;
        
        const room = spawn.room;
        const energy = room.energyAvailable;
        const creeps = room.find(FIND_MY_CREEPS);
        const enemies = room.find(FIND_HOSTILE_CREEPS);
        
        // EMERGENCY PRIORITIES - KILL FIRST, ASK QUESTIONS LATER
        const priorities = getEmergencySpawnPriorities(room, creeps, enemies, energy);
        
        for (const priority of priorities) {
            if (spawnEmergencyCreep(spawn, priority.role, priority.body)) {
                console.log(`🚨 EMERGENCY SPAWN: ${priority.role} in ${room.name} (${enemies.length} enemies detected)`);
                break;
            }
        }
    }
}

function getEmergencySpawnPriorities(room, creeps, enemies, energy) {
    const priorities = [];
    const counts = countCreepsByRole(creeps);
    
    // 🔥 EMERGENCY PROTOCOL: ENEMIES DETECTED = MASSIVE RESPONSE 🔥
    if (enemies.length > 0) {
        console.log(`🚨🚨🚨 EMERGENCY: ${enemies.length} HOSTILES IN ${room.name} - MAXIMUM RESPONSE ACTIVATED 🚨🚨🚨`);
        
        // BERSERKER CHARGE - MAXIMUM DAMAGE
        for (let i = 0; i < enemies.length * 3; i++) {
            priorities.push({
                role: ROLES.BERSERKER,
                body: getEmergencyBodyParts(ROLES.BERSERKER, energy),
                priority: 50000 + i
            });
        }
        
        // ASSASSIN SQUADS - TARGET ELIMINATION
        for (let i = 0; i < enemies.length * 2; i++) {
            priorities.push({
                role: ROLES.ASSASSIN,
                body: getEmergencyBodyParts(ROLES.ASSASSIN, energy),
                priority: 45000 + i
            });
        }
        
        // GUARD WALL - DEFENSIVE BARRIER
        for (let i = 0; i < enemies.length * 4; i++) {
            priorities.push({
                role: ROLES.GUARD,
                body: getEmergencyBodyParts(ROLES.GUARD, energy),
                priority: 40000 + i
            });
        }
        
        // RANGER ARTILLERY
        for (let i = 0; i < enemies.length * 2; i++) {
            priorities.push({
                role: ROLES.RANGER,
                body: getEmergencyBodyParts(ROLES.RANGER, energy),
                priority: 35000 + i
            });
        }
        
        // MEDICAL SUPPORT
        priorities.push({
            role: ROLES.HEALER,
            body: getEmergencyBodyParts(ROLES.HEALER, energy),
            priority: 30000
        });
    }
    
    // ⚔️ CONSTANT MILITARY PRESENCE - NEVER LET GUARD DOWN ⚔️
    if (room.controller.level >= 2) {
        if (counts[ROLES.ATTACKER] < 8) {
            priorities.push({
                role: ROLES.ATTACKER,
                body: getEmergencyBodyParts(ROLES.ATTACKER, energy),
                priority: 25000
            });
        }
        
        if (counts[ROLES.SCOUT] < 4) {
            priorities.push({
                role: ROLES.SCOUT,
                body: getEmergencyBodyParts(ROLES.SCOUT, energy),
                priority: 20000
            });
        }
        
        if (counts[ROLES.BERSERKER] < 6) {
            priorities.push({
                role: ROLES.BERSERKER,
                body: getEmergencyBodyParts(ROLES.BERSERKER, energy),
                priority: 18000
            });
        }
    }
    
    // MINIMAL ECONOMY - MAXIMUM AGGRESSION
    if (counts[ROLES.HARVESTER] < 2) {
        priorities.push({
            role: ROLES.HARVESTER,
            body: getEmergencyBodyParts(ROLES.HARVESTER, energy),
            priority: 15000
        });
    }
    
    // 💥 ECONOMIC WARFARE - CONTROLLER ATTACKS 💥
    if (room.controller.level >= 3) {
        if (counts[ROLES.SABOTEUR] < 4) {
            priorities.push({
                role: ROLES.SABOTEUR,
                body: getEmergencyBodyParts(ROLES.SABOTEUR, energy),
                priority: 12000
            });
        }
    }
    
    return priorities.sort((a, b) => b.priority - a.priority);
}

function spawnEmergencyCreep(spawn, role, body) {
    const name = `${role}_${Game.time}_${Math.random().toString(36).substr(2, 8)}`;
    const result = spawn.spawnCreep(body, name, {
        memory: {
            role: role,
            room: spawn.room.name,
            working: false,
            target: null,
            emergency: true,
            aggressive: true,
            born: Game.time
        }
    });
    
    if (result === OK) {
        console.log(`💀 EMERGENCY SPAWNED: ${role} (${body.join(",")})`);
    }
    
    return result === OK;
}

function countCreepsByRole(creeps) {
    const counts = {};
    for (const role of Object.values(ROLES)) {
        counts[role] = creeps.filter(c => c.memory.role === role).length;
    }
    return counts;
}

// EMERGENCY CREEP BEHAVIORS - MAXIMUM AGGRESSION
function manageEmergencyCreeps() {
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        try {
            switch (creep.memory.role) {
                case ROLES.HARVESTER:
                    runEmergencyHarvester(creep);
                    break;
                case ROLES.ATTACKER:
                    runEmergencyAttacker(creep);
                    break;
                case ROLES.GUARD:
                    runEmergencyGuard(creep);
                    break;
                case ROLES.RANGER:
                    runEmergencyRanger(creep);
                    break;
                case ROLES.HEALER:
                    runEmergencyHealer(creep);
                    break;
                case ROLES.SCOUT:
                    runEmergencyScout(creep);
                    break;
                case ROLES.ASSASSIN:
                    runAssassin(creep);
                    break;
                case ROLES.BERSERKER:
                    runBerserker(creep);
                    break;
                case ROLES.SABOTEUR:
                    runSaboteur(creep);
                    break;
            }
        } catch (error) {
            console.log(`❌ Emergency error with ${name}: ${error.message}`);
        }
    }
}

// EMERGENCY HARVESTER - FIGHTS OR FLIGHTS
function runEmergencyHarvester(creep) {
    const enemies = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
    if (enemies.length > 0) {
        // FIGHT BACK IMMEDIATELY
        if (creep.getActiveBodyparts(ATTACK) > 0) {
            creep.attack(enemies[0]);
            console.log(`⚡ ${creep.name} EMERGENCY COMBAT!`);
        }
        return;
    }
    
    if (creep.store.getFreeCapacity() === 0) {
        const target = findEmergencyDepositTarget(creep);
        if (target && creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    } else {
        const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
}

// EMERGENCY ATTACKER - SPAWN DESTROYER
function runEmergencyAttacker(creep) {
    // PRIMARY: ENEMY SPAWNS
    const enemySpawns = creep.room.find(FIND_HOSTILE_SPAWNS);
    if (enemySpawns.length > 0) {
        const target = creep.pos.findClosestByPath(enemySpawns);
        if (creep.attack(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
        }
        console.log(`⚔️ ${creep.name} ATTACKING ENEMY SPAWN!`);
        return;
    }
    
    // SECONDARY: DANGEROUS ENEMIES
    const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
    const dangerous = enemies.filter(e => 
        e.getActiveBodyparts(ATTACK) > 0 || e.getActiveBodyparts(RANGED_ATTACK) > 0
    );
    
    if (enemies.length > 0) {
        const target = creep.pos.findClosestByPath(dangerous.length > 0 ? dangerous : enemies);
        if (creep.attack(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
        }
    } else {
        emergencyInvadeRooms(creep);
    }
}

// EMERGENCY GUARD - MAXIMUM DEFENSE
function runEmergencyGuard(creep) {
    const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
    
    if (enemies.length > 0) {
        // PRIORITIZE DANGEROUS ENEMIES
        const dangerous = enemies.filter(e => 
            e.getActiveBodyparts(ATTACK) > 0 || e.getActiveBodyparts(RANGED_ATTACK) > 0
        );
        
        const target = creep.pos.findClosestByPath(dangerous.length > 0 ? dangerous : enemies);
        if (creep.attack(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ff00ff'}});
        }
        
        console.log(`🛡️ ${creep.name} EMERGENCY DEFENSE: ${enemies.length} enemies`);
    } else {
        // AGGRESSIVE PATROL
        const spawn = creep.room.find(FIND_MY_SPAWNS)[0];
        if (spawn) {
            const angle = Math.random() * Math.PI * 2;
            const distance = 10 + Math.random() * 20;
            const x = Math.max(0, Math.min(49, spawn.pos.x + Math.cos(angle) * distance));
            const y = Math.max(0, Math.min(49, spawn.pos.y + Math.sin(angle) * distance));
            creep.moveTo(x, y);
        }
    }
}

// EMERGENCY RANGER - MAXIMUM KITING
function runEmergencyRanger(creep) {
    const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
    
    if (enemies.length > 0) {
        const target = creep.pos.findClosestByPath(enemies);
        const range = creep.pos.getRangeTo(target);
        
        if (range <= 3) {
            creep.rangedAttack(target);
        }
        
        if (range <= 1) {
            // EMERGENCY FLEE + MASS ATTACK
            const fleeDir = creep.pos.getDirectionTo(target);
            const fleePos = creep.pos.getAdjacentPosition((fleeDir + 3) % 8 + 1);
            creep.moveTo(fleePos);
            creep.rangedMassAttack();
            console.log(`🏃 ${creep.name} EMERGENCY KITING!`);
        } else if (range > 3) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ff00ff'}});
        }
    } else {
        // SUPPORT ATTACKERS
        const attackers = creep.room.find(FIND_MY_CREEPS, {
            filter: c => c.memory.role === ROLES.ATTACKER
        });
        
        if (attackers.length > 0) {
            const range = creep.pos.getRangeTo(attackers[0]);
            if (range > 2) {
                creep.moveTo(attackers[0], {visualizePathStyle: {stroke: '#ff00ff'}});
            }
        } else {
            emergencyInvadeRooms(creep);
        }
    }
}

// BERSERKER - MAXIMUM DAMAGE
function runBerserker(creep) {
    // PRIORITY: ENEMY SPAWNS
    const enemySpawns = creep.room.find(FIND_HOSTILE_SPAWNS);
    if (enemySpawns.length > 0) {
        const target = creep.pos.findClosestByPath(enemySpawns);
        if (creep.attack(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
        }
        console.log(`💀 ${creep.name} BERSERKER RAGE ON SPAWN!`);
        return;
    }
    
    // SECONDARY: MAXIMUM DAMAGE ON ANYTHING
    const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
    if (enemies.length > 0) {
        const target = creep.pos.findClosestByPath(enemies);
        if (creep.attack(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
        }
        console.log(`💀 ${creep.name} BERSERKER RAGE!`);
    } else {
        emergencyInvadeRooms(creep);
    }
}

// EMERGENCY HEALER - MAXIMUM SUPPORT
function runEmergencyHealer(creep) {
    // PRIORITY 1: HEAL COMBAT UNITS
    const damagedCombat = creep.room.find(FIND_MY_CREEPS, {
        filter: c => (c.hits < c.hitsMax) && 
                    ['attacker', 'ranger', 'guard', 'assassin', 'berserker'].includes(c.memory.role)
    });
    
    if (damagedCombat.length > 0) {
        const target = creep.pos.findClosestByPath(damagedCombat);
        const range = creep.pos.getRangeTo(target);
        
        if (range <= 1) {
            creep.heal(target);
        } else {
            creep.rangedHeal(target);
            creep.moveTo(target, {visualizePathStyle: {stroke: '#00ff00'}});
        }
        return;
    }
    
    // PRIORITY 2: ANY DAMAGED ALLY
    const damaged = creep.room.find(FIND_MY_CREEPS, {
        filter: c => c.hits < c.hitsMax
    });
    
    if (damaged.length > 0) {
        const target = creep.pos.findClosestByPath(damaged);
        const range = creep.pos.getRangeTo(target);
        
        if (range <= 1) {
            creep.heal(target);
        } else {
            creep.rangedHeal(target);
            creep.moveTo(target, {visualizePathStyle: {stroke: '#00ff00'}});
        }
    } else {
        // FOLLOW COMBAT UNITS
        const combat = creep.room.find(FIND_MY_CREEPS, {
            filter: c => ['attacker', 'ranger', 'berserker'].includes(c.memory.role)
        });
        
        if (combat.length > 0) {
            creep.moveTo(combat[0], {visualizePathStyle: {stroke: '#00ff00'}});
        }
    }
}

// EMERGENCY SCOUT - MAXIMUM INTELLIGENCE
function runEmergencyScout(creep) {
    const exits = Game.map.describeExits(creep.room.name);
    
    if (exits) {
        // PRIORITIZE ENEMY ROOMS
        if (Memory.invasionTargets && Memory.invasionTargets.length > 0) {
            const targetRoom = Memory.invasionTargets.find(room => 
                Object.values(exits).includes(room) && creep.room.name !== room
            );
            
            if (targetRoom) {
                const exitDir = creep.room.findExit(targetRoom);
                const exit = creep.pos.findClosestByPath(exitDir);
                if (exit) {
                    creep.moveTo(exit, {visualizePathStyle: {stroke: '#ffffff'}});
                    return;
                }
            }
        }
        
        // RANDOM INVASION
        const directions = Object.values(exits);
        const targetRoom = directions[Math.floor(Math.random() * directions.length)];
        
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
            
            // RECORD INTELLIGENCE
            if (!Memory.scoutedRooms) Memory.scoutedRooms = {};
            Memory.scoutedRooms[creep.room.name] = {
                lastScouted: Game.time,
                enemySpawns: enemySpawns.length,
                enemyStructures: enemyStructures.length,
                enemyCreeps: enemyCreeps.length,
                threatLevel: enemySpawns.length + enemyCreeps.length
            };
            
            console.log(`📡 EMERGENCY SCOUT: ${creep.room.name} - ${enemySpawns.length} spawns, ${enemyCreeps.length} creeps`);
            
            // MARK FOR INVASION
            if (enemySpawns.length > 0) {
                if (!Memory.invasionTargets) Memory.invasionTargets = [];
                if (!Memory.invasionTargets.includes(creep.room.name)) {
                    Memory.invasionTargets.push(creep.room.name);
                    console.log(`🎯 EMERGENCY INVASION TARGET: ${creep.room.name}`);
                }
            }
            
            // EXPLORE
            creep.moveTo(Math.floor(Math.random() * 50), Math.floor(Math.random() * 50));
        }
    }
}

// SABOTEUR - ECONOMIC WARFARE
function runSaboteur(creep) {
    // ATTACK ENEMY CONTROLLERS IMMEDIATELY
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
                console.log(`⚡ EMERGENCY SABOTEUR attacking controller in ${creep.room.name}!`);
            }
        }
    } else {
        emergencyInvadeRooms(creep);
    }
}

// EMERGENCY INVASION - MAXIMUM AGGRESSION
function emergencyInvadeRooms(creep) {
    const exits = Game.map.describeExits(creep.room.name);
    
    if (exits) {
        // PRIORITIZE KNOWN ENEMY ROOMS
        if (Memory.invasionTargets && Memory.invasionTargets.length > 0) {
            const targetRoom = Memory.invasionTargets.find(room => 
                Object.values(exits).includes(room)
            );
            
            if (targetRoom) {
                const exitDir = creep.room.findExit(targetRoom);
                const exit = creep.pos.findClosestByPath(exitDir);
                if (exit) {
                    creep.moveTo(exit, {visualizePathStyle: {stroke: '#ff0000'}});
                    console.log(`🚀 EMERGENCY INVASION: ${creep.name} attacking ${targetRoom}!`);
                    return;
                }
            }
        }
        
        // RANDOM INVASION
        const directions = Object.values(exits);
        const targetRoom = directions[Math.floor(Math.random() * directions.length)];
        
        const exitDir = creep.room.findExit(targetRoom);
        const exit = creep.pos.findClosestByPath(exitDir);
        
        if (exit) {
            creep.moveTo(exit, {visualizePathStyle: {stroke: '#ff0000'}});
            console.log(`🚀 EMERGENCY: ${creep.name} invading ${targetRoom}!`);
        }
    }
}

// HELPER FUNCTIONS
function findEmergencyDepositTarget(creep) {
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
    
    return creep.room.find(FIND_STRUCTURES, {
        filter: s => (s.structureType === STRUCTURE_SPAWN || 
                     s.structureType === STRUCTURE_EXTENSION) && 
                    s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    })[0];
}

function findEnergySource(creep) {
    const storage = creep.room.find(FIND_STRUCTURES, {
        filter: s => s.structureType === STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] > 0
    })[0];
    
    if (storage) return storage;
    
    const container = creep.room.find(FIND_STRUCTURES, {
        filter: s => s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0
    })[0];
    
    if (container) return container;
    
    return creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
}

// EMERGENCY DEFENSE MANAGEMENT
function manageEmergencyDefense() {
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        
        // EMERGENCY TOWER PROTOCOL - KILL EVERYTHING
        const towers = room.find(FIND_MY_STRUCTURES, {
            filter: s => s.structureType === STRUCTURE_TOWER
        });
        
        for (const tower of towers) {
            // PRIORITY 1: KILL ALL ENEMIES IMMEDIATELY
            const enemies = room.find(FIND_HOSTILE_CREEPS);
            if (enemies.length > 0) {
                // TARGET MOST DANGEROUS FIRST
                const dangerous = enemies.filter(e => 
                    e.getActiveBodyparts(ATTACK) > 0 || e.getActiveBodyparts(RANGED_ATTACK) > 0
                );
                
                const target = tower.pos.findClosestByRange(dangerous.length > 0 ? dangerous : enemies);
                if (target) {
                    tower.attack(target);
                    console.log(`💥 EMERGENCY TOWER: Killing ${target.name}`);
                    continue; // NO REPAIRS WHILE ENEMIES EXIST
                }
            }
            
            // PRIORITY 2: CRITICAL REPAIRS ONLY
            const critical = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: s => s.hits < s.hitsMax * 0.1 && 
                           (s.structureType === STRUCTURE_SPAWN || 
                            s.structureType === STRUCTURE_TOWER)
            });
            
            if (critical) {
                tower.repair(critical);
            }
        }
        
        // EMERGENCY FORTRESS BUILDING
        buildEmergencyFortress(room);
    }
}

function buildEmergencyFortress(room) {
    const controller = room.controller;
    if (!controller || controller.level < 2) return;
    
    const spawn = room.find(FIND_MY_SPAWNS)[0];
    if (!spawn) return;
    
    // MASSIVE EMERGENCY FORTRESS
    const spawnPos = spawn.pos;
    for (let x = spawnPos.x - 5; x <= spawnPos.x + 5; x++) {
        for (let y = spawnPos.y - 5; y <= spawnPos.y + 5; y++) {
            if (x >= 0 && x < 50 && y >= 0 && y < 50 && !(x === spawnPos.x && y === spawnPos.y)) {
                const pos = new RoomPosition(x, y, room.name);
                const structures = pos.lookFor(LOOK_STRUCTURES);
                const sites = pos.lookFor(LOOK_CONSTRUCTION_SITES);
                
                if (structures.length === 0 && sites.length === 0) {
                    room.createConstructionSite(x, y, STRUCTURE_RAMPART);
                }
            }
        }
    }
    
    // EMERGENCY TOWER BUILDING
    if (controller.level >= 3) {
        const existingTowers = room.find(FIND_MY_STRUCTURES, {
            filter: s => s.structureType === STRUCTURE_TOWER
        });
        
        if (existingTowers.length < 6) {
            const towerPositions = [
                {x: spawnPos.x - 7, y: spawnPos.y - 7},
                {x: spawnPos.x + 7, y: spawnPos.y - 7},
                {x: spawnPos.x - 7, y: spawnPos.y + 7},
                {x: spawnPos.x + 7, y: spawnPos.y + 7},
                {x: spawnPos.x, y: spawnPos.y - 10},
                {x: spawnPos.x, y: spawnPos.y + 10}
            ];
            
            for (const pos of towerPositions) {
                if (pos.x >= 0 && pos.x < 50 && pos.y >= 0 && pos.y < 50) {
                    const structures = new RoomPosition(pos.x, pos.y, room.name).lookFor(LOOK_STRUCTURES);
                    const sites = new RoomPosition(pos.x, pos.y, room.name).lookFor(LOOK_CONSTRUCTION_SITES);
                    
                    if (structures.length === 0 && sites.length === 0) {
                        room.createConstructionSite(pos.x, pos.y, STRUCTURE_TOWER);
                        break;
                    }
                }
            }
        }
    }
}

// EMERGENCY MAIN LOOP
module.exports.loop = function () {
    // CLEAN UP DEAD CREEPS
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
    
    // RUN EMERGENCY SYSTEMS
    manageEmergencySpawns();
    manageEmergencyCreeps();
    manageEmergencyDefense();
    
    // 🔥 EMERGENCY WAR RESPONSE - TICK 9650 - ENEMIES ACTIVE 🔥
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        const enemies = room.find(FIND_HOSTILE_CREEPS);
        
        if (enemies.length > 0) {
            console.log(`🚨🚨🚨 EMERGENCY WAR IN ${roomName}: ${enemies.length} ENEMIES AT TICK ${Game.time}! 🚨🚨🚨`);
            
            // MASSIVE EMERGENCY RESPONSE
            const spawn = room.find(FIND_MY_SPAWNS)[0];
            if (spawn && !spawn.spawning && room.energyAvailable >= 200) {
                const military = room.find(FIND_MY_CREEPS, {
                    filter: c => ['guard', 'attacker', 'ranger', 'berserker'].includes(c.memory.role)
                });
                
                if (military.length < enemies.length * 5) {
                    const body = getEmergencyBodyParts(ROLES.BERSERKER, room.energyAvailable);
                    if (spawnEmergencyCreep(spawn, ROLES.BERSERKER, body)) {
                        console.log(`🚀 EMERGENCY BERSERKER DEPLOYED!`);
                    }
                }
            }
        }
    }
    
    // 📡 EMERGENCY INTELLIGENCE
    if (Game.time % 20 === 0) { // Every 20 ticks - FAST UPDATES
        if (Memory.invasionTargets && Memory.invasionTargets.length > 0) {
            console.log(`🎯 EMERGENCY TARGETS: ${Memory.invasionTargets.join(', ')}`);
        }
        
        const allCreeps = Object.keys(Game.creeps).length;
        const militaryCreeps = Object.values(Game.creeps).filter(c => 
            ['attacker', 'ranger', 'guard', 'assassin', 'berserker'].includes(c.memory.role)
        ).length;
        
        console.log(`⚡ EMERGENCY STATUS: ${allCreeps} total, ${militaryCreeps} military at tick ${Game.time}`);
    }
    
    // 🏆 EMERGENCY DOMINION TRACKING
    if (Game.time % 100 === 0) {
        const allRooms = Object.keys(Game.rooms);
        const myRooms = allRooms.filter(roomName => {
            const room = Game.rooms[roomName];
            return room.controller && room.controller.my;
        });
        
        console.log(`🏆 EMERGENCY DOMINION: ${myRooms.length}/${allRooms.length} rooms at tick ${Game.time}`);
        
        if (Memory.invasionTargets && Memory.invasionTargets.length > 0) {
            console.log(`🚀 PREPARING EMERGENCY INVASION OF ${Memory.invasionTargets.length} territories`);
        }
    }
    
    console.log(`💀 EMERGENCY TICK ${Game.time}: MAXIMUM AGGRESSION ACTIVE - ENEMIES BEWARE`);
};