// CLAUDE PvP ULTRA-DESTROYER v3.0
// MAXIMUM AGGRESSION - ZERO MERCY - TOTAL ELIMINATION

// ULTRA-AGGRESSIVE CONFIGURATION
const DEFENSE_PRIORITY = 0.3; // 70% OFFENSE, 30% DEFENSE
const MAX_CREEPS = 100; // MAXIMUM ARMY SIZE
const TOWER_THRESHOLD = 0.5; // BUILD TOWERS EARLIER
const ATTACK_THRESHOLD = 0.2; // ATTACK AT 20% READINESS

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
    ASSASSIN: 'assassin' // NEW: HIGH-DAMAGE ELIMINATION UNITS
};

// BODY COSTS
const BODY_COSTS = {
    move: 50, work: 100, carry: 50, attack: 80, 
    ranged_attack: 150, heal: 250, tough: 10, claim: 600
};

// MAXIMUM AGGRESSION BODY CONFIGURATIONS
function getUltraBodyParts(role, energyAvailable) {
    const ultraBodies = {
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
        [ROLES.UPGRADER]: [
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
        [ROLES.HEALER]: [
            [HEAL, MOVE],
            [HEAL, HEAL, MOVE, MOVE],
            [HEAL, HEAL, HEAL, MOVE, MOVE, MOVE],
            [HEAL, HEAL, HEAL, HEAL, MOVE, MOVE, MOVE, MOVE]
        ],
        [ROLES.ASSASSIN]: [
            [MOVE, ATTACK, ATTACK], // Fast strike
            [MOVE, MOVE, ATTACK, ATTACK, ATTACK], // Mobile killer
            [MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK] // Death squad
        ],
        [ROLES.SABOTEUR]: [
            [MOVE, CLAIM], // Quick controller attack
            [MOVE, MOVE, CLAIM, CLAIM], // Sustained attack
            [MOVE, MOVE, MOVE, CLAIM, CLAIM, CLAIM] // Heavy assault
        ]
    };
    
    const roleBodies = ultraBodies[role] || ultraBodies[ROLES.HARVESTER];
    
    // MAXIMUM SIZE PRIORITY
    for (let i = roleBodies.length - 1; i >= 0; i--) {
        const cost = roleBodies[i].reduce((sum, part) => sum + BODY_COSTS[part], 0);
        if (cost <= energyAvailable) {
            return roleBodies[i];
        }
    }
    
    return roleBodies[0];
}

// ULTRA-SPAWN MANAGEMENT
function manageUltraSpawns() {
    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName];
        if (spawn.spawning) continue;
        
        const room = spawn.room;
        const energy = room.energyAvailable;
        const creeps = room.find(FIND_MY_CREEPS);
        const enemies = room.find(FIND_HOSTILE_CREEPS);
        
        // MAXIMUM AGGRESSION PRIORITIES
        const priorities = getUltraSpawnPriorities(room, creeps, enemies, energy);
        
        for (const priority of priorities) {
            if (spawnUltraCreep(spawn, priority.role, priority.body)) {
                console.log(`🚀 ULTRA SPAWN: ${priority.role} in ${room.name} (${enemies.length} enemies detected)`);
                break;
            }
        }
    }
}

function getUltraSpawnPriorities(room, creeps, enemies, energy) {
    const priorities = [];
    const counts = countCreepsByRole(creeps);
    
    // 🔥 MAXIMUM EMERGENCY: ENEMIES DETECTED 🔥
    if (enemies.length > 0) {
        console.log(`🚨 ENEMY INCURSION: ${enemies.length} hostiles in ${room.name}`);
        
        // MASSIVE GUARD DEPLOYMENT
        for (let i = 0; i < enemies.length * 4; i++) {
            priorities.push({
                role: ROLES.GUARD,
                body: getUltraBodyParts(ROLES.GUARD, energy),
                priority: 10000 + i
            });
        }
        
        // ASSASSIN SQUADS
        for (let i = 0; i < enemies.length * 2; i++) {
            priorities.push({
                role: ROLES.ASSASSIN,
                body: getUltraBodyParts(ROLES.ASSASSIN, energy),
                priority: 9500 + i
            });
        }
        
        // RANGER SUPPORT
        for (let i = 0; i < enemies.length * 3; i++) {
            priorities.push({
                role: ROLES.RANGER,
                body: getUltraBodyParts(ROLES.RANGER, energy),
                priority: 9000 + i
            });
        }
        
        // MEDICAL CORPS
        priorities.push({
            role: ROLES.HEALER,
            body: getUltraBodyParts(ROLES.HEALER, energy),
            priority: 8500
        });
    }
    
    // ⚔️ CONSTANT MILITARY PRESENCE ⚔️
    if (room.controller.level >= 2) {
        if (counts[ROLES.ATTACKER] < 6) {
            priorities.push({
                role: ROLES.ATTACKER,
                body: getUltraBodyParts(ROLES.ATTACKER, energy),
                priority: 8000
            });
        }
        
        if (counts[ROLES.SCOUT] < 3) {
            priorities.push({
                role: ROLES.SCOUT,
                body: getUltraBodyParts(ROLES.SCOUT, energy),
                priority: 7500
            });
        }
        
        if (counts[ROLES.ASSASSIN] < 4) {
            priorities.push({
                role: ROLES.ASSASSIN,
                body: getUltraBodyParts(ROLES.ASSASSIN, energy),
                priority: 7000
            });
        }
    }
    
    // 🏗️ MINIMAL ECONOMY (MAXIMUM AGGRESSION)
    if (counts[ROLES.HARVESTER] < 2) {
        priorities.push({
            role: ROLES.HARVESTER,
            body: getUltraBodyParts(ROLES.HARVESTER, energy),
            priority: 6000
        });
    }
    
    // 💥 ECONOMIC WARFARE 💥
    if (room.controller.level >= 3) {
        if (counts[ROLES.SABOTEUR] < 3) {
            priorities.push({
                role: ROLES.SABOTEUR,
                body: getUltraBodyParts(ROLES.SABOTEUR, energy),
                priority: 6500
            });
        }
    }
    
    return priorities.sort((a, b) => b.priority - a.priority);
}

function spawnUltraCreep(spawn, role, body) {
    const name = `${role}_${Game.time}_${Math.random().toString(36).substr(2, 6)}`;
    const result = spawn.spawnCreep(body, name, {
        memory: {
            role: role,
            room: spawn.room.name,
            working: false,
            target: null,
            ultra: true,
            aggressive: true,
            born: Game.time
        }
    });
    
    if (result === OK) {
        console.log(`💀 SPAWNED: ${role} (${body.join(",")})`);
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

// ULTRA-AGGRESSIVE CREEP BEHAVIORS
function manageUltraCreeps() {
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        try {
            switch (creep.memory.role) {
                case ROLES.HARVESTER:
                    runUltraHarvester(creep);
                    break;
                case ROLES.ATTACKER:
                    runUltraAttacker(creep);
                    break;
                case ROLES.GUARD:
                    runUltraGuard(creep);
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
                case ROLES.ASSASSIN:
                    runAssassin(creep);
                    break;
                case ROLES.SABOTEUR:
                    runSaboteur(creep);
                    break;
            }
        } catch (error) {
            console.log(`❌ Error with ${name}: ${error.message}`);
        }
    }
}

// ULTRA-HARVESTER: Fights back when attacked
function runUltraHarvester(creep) {
    // Fight or flight response
    const enemies = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
    if (enemies.length > 0) {
        if (creep.getActiveBodyparts(ATTACK) > 0) {
            creep.attack(enemies[0]);
            console.log(`⚡ ${creep.name} fighting back!`);
        }
        return;
    }
    
    if (creep.store.getFreeCapacity() === 0) {
        const target = findUltraDepositTarget(creep);
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

// ULTRA-ATTACKER: Spawn destroyer
function runUltraAttacker(creep) {
    // PRIMARY TARGET: ENEMY SPAWNS
    const enemySpawns = creep.room.find(FIND_HOSTILE_SPAWNS);
    if (enemySpawns.length > 0) {
        const target = creep.pos.findClosestByPath(enemySpawns);
        if (creep.attack(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
        }
        console.log(`⚔️ ${creep.name} attacking enemy spawn!`);
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
        // INVADE ADJACENT ROOMS
        ultraInvadeRooms(creep);
    }
}

// ULTRA-GUARD: Maximum defense
function runUltraGuard(creep) {
    const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
    
    if (enemies.length > 0) {
        // PRIORITIZE MOST DANGEROUS
        const dangerous = enemies.filter(e => 
            e.getActiveBodyparts(ATTACK) > 0 || e.getActiveBodyparts(RANGED_ATTACK) > 0
        );
        
        const target = creep.pos.findClosestByPath(dangerous.length > 0 ? dangerous : enemies);
        if (creep.attack(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ff00ff'}});
        }
        
        console.log(`🛡️ ${creep.name} defending against ${enemies.length} enemies`);
    } else {
        // AGGRESSIVE PATROL
        const spawn = creep.room.find(FIND_MY_SPAWNS)[0];
        if (spawn) {
            const angle = Math.random() * Math.PI * 2;
            const distance = 8 + Math.random() * 15;
            const x = Math.max(0, Math.min(49, spawn.pos.x + Math.cos(angle) * distance));
            const y = Math.max(0, Math.min(49, spawn.pos.y + Math.sin(angle) * distance));
            creep.moveTo(x, y);
        }
    }
}

// ULTRA-RANGER: Maximum kiting
function runUltraRanger(creep) {
    const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
    
    if (enemies.length > 0) {
        const target = creep.pos.findClosestByPath(enemies);
        const range = creep.pos.getRangeTo(target);
        
        if (range <= 3) {
            creep.rangedAttack(target);
        }
        
        if (range <= 1) {
            // TOO CLOSE - FLEE AND MASS ATTACK
            const fleeDir = creep.pos.getDirectionTo(target);
            const fleePos = creep.pos.getAdjacentPosition((fleeDir + 3) % 8 + 1);
            creep.moveTo(fleePos);
            creep.rangedMassAttack();
            console.log(`🏃 ${creep.name} kiting and mass attacking!`);
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
            ultraInvadeRooms(creep);
        }
    }
}

// ULTRA-HEALER: Maximum support
function runUltraHealer(creep) {
    // PRIORITY 1: HEAL ATTACKERS
    const damagedAttackers = creep.room.find(FIND_MY_CREEPS, {
        filter: c => (c.hits < c.hitsMax) && 
                    ['attacker', 'ranger', 'guard', 'assassin'].includes(c.memory.role)
    });
    
    if (damagedAttackers.length > 0) {
        const target = creep.pos.findClosestByPath(damagedAttackers);
        const range = creep.pos.getRangeTo(target);
        
        if (range <= 1) {
            creep.heal(target);
        } else {
            creep.rangedHeal(target);
            creep.moveTo(target, {visualizePathStyle: {stroke: '#00ff00'}});
        }
        return;
    }
    
    // PRIORITY 2: HEAL ANY DAMAGED ALLY
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
        // FOLLOW MILITARY
        const military = creep.room.find(FIND_MY_CREEPS, {
            filter: c => ['attacker', 'ranger', 'assassin'].includes(c.memory.role)
        });
        
        if (military.length > 0) {
            creep.moveTo(military[0], {visualizePathStyle: {stroke: '#00ff00'}});
        }
    }
}

// ULTRA-SCOUT: Maximum intelligence
function runUltraScout(creep) {
    const exits = Game.map.describeExits(creep.room.name);
    
    if (exits) {
        // PRIORITIZE UNSCOUTED ENEMY ROOMS
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
        
        // RANDOM EXPLORATION
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
            
            console.log(`📡 SCOUT: ${creep.room.name} - ${enemySpawns.length} spawns, ${enemyCreeps.length} creeps`);
            
            // MARK FOR INVASION
            if (enemySpawns.length > 0) {
                if (!Memory.invasionTargets) Memory.invasionTargets = [];
                if (!Memory.invasionTargets.includes(creep.room.name)) {
                    Memory.invasionTargets.push(creep.room.name);
                    console.log(`🎯 INVASION TARGET: ${creep.room.name}`);
                }
            }
            
            // EXPLORE ROOM
            creep.moveTo(Math.floor(Math.random() * 50), Math.floor(Math.random() * 50));
        }
    }
}

// ASSASSIN: High-damage elimination
function runAssassin(creep) {
    // PRIORITY: ENEMY SPAWNS
    const enemySpawns = creep.room.find(FIND_HOSTILE_SPAWNS);
    if (enemySpawns.length > 0) {
        const target = creep.pos.findClosestByPath(enemySpawns);
        if (creep.attack(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
        }
        console.log(`💀 ${creep.name} ASSASSINATING enemy spawn!`);
        return;
    }
    
    // SECONDARY: HIGH-VALUE TARGETS
    const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
    const highValue = enemies.filter(e => 
        e.getActiveBodyparts(ATTACK) > 2 || e.getActiveBodyparts(RANGED_ATTACK) > 2
    );
    
    if (enemies.length > 0) {
        const target = creep.pos.findClosestByPath(highValue.length > 0 ? highValue : enemies);
        if (creep.attack(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
        }
        console.log(`💀 ${creep.name} eliminating high-value target!`);
    } else {
        ultraInvadeRooms(creep);
    }
}

// SABOTEUR: Economic warfare
function runSaboteur(creep) {
    // ATTACK ENEMY CONTROLLERS
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
                console.log(`⚡ ${creep.name} ATTACKING CONTROLLER in ${creep.room.name}!`);
            }
        }
    } else {
        // INVADE ENEMY ROOMS
        ultraInvadeRooms(creep);
    }
}

// ULTRA-INVADE: Maximum aggression invasion
function ultraInvadeRooms(creep) {
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
                    console.log(`🚀 ${creep.name} INVADING ${targetRoom}!`);
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
            console.log(`🚀 ${creep.name} invading ${targetRoom}!`);
        }
    }
}

// ULTRA-DEFENSE MANAGEMENT
function manageUltraDefense() {
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        
        // ULTRA-TOWER DEFENSE
        const towers = room.find(FIND_MY_STRUCTURES, {
            filter: s => s.structureType === STRUCTURE_TOWER
        });
        
        for (const tower of towers) {
            // PRIORITY 1: KILL ENEMIES
            const enemies = room.find(FIND_HOSTILE_CREEPS);
            if (enemies.length > 0) {
                // TARGET MOST DANGEROUS FIRST
                const dangerous = enemies.filter(e => 
                    e.getActiveBodyparts(ATTACK) > 0 || e.getActiveBodyparts(RANGED_ATTACK) > 0
                );
                
                const target = tower.pos.findClosestByRange(dangerous.length > 0 ? dangerous : enemies);
                if (target) {
                    tower.attack(target);
                    console.log(`💥 Tower attacking ${target.name}`);
                    continue; // NO REPAIRS WHILE ENEMIES EXIST
                }
            }
            
            // PRIORITY 2: EMERGENCY REPAIRS ONLY
            const critical = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: s => s.hits < s.hitsMax * 0.2 && 
                           (s.structureType === STRUCTURE_SPAWN || 
                            s.structureType === STRUCTURE_TOWER)
            });
            
            if (critical) {
                tower.repair(critical);
            }
        }
        
        // ULTRA-FORTRESS CONSTRUCTION
        buildUltraFortress(room);
    }
}

function buildUltraFortress(room) {
    const controller = room.controller;
    if (!controller || controller.level < 2) return;
    
    const spawn = room.find(FIND_MY_SPAWNS)[0];
    if (!spawn) return;
    
    // MASSIVE FORTRESS AROUND SPAWN
    const spawnPos = spawn.pos;
    for (let x = spawnPos.x - 4; x <= spawnPos.x + 4; x++) {
        for (let y = spawnPos.y - 4; y <= spawnPos.y + 4; y++) {
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
    
    // AGGRESSIVE TOWER BUILDING
    if (controller.level >= 3) {
        const existingTowers = room.find(FIND_MY_STRUCTURES, {
            filter: s => s.structureType === STRUCTURE_TOWER
        });
        
        if (existingTowers.length < 6) {
            // STRATEGIC TOWER POSITIONS
            const towerPositions = [
                {x: spawnPos.x - 6, y: spawnPos.y - 6},
                {x: spawnPos.x + 6, y: spawnPos.y - 6},
                {x: spawnPos.x - 6, y: spawnPos.y + 6},
                {x: spawnPos.x + 6, y: spawnPos.y + 6},
                {x: spawnPos.x, y: spawnPos.y - 8},
                {x: spawnPos.x, y: spawnPos.y + 8}
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

// ULTRA-MAIN LOOP
module.exports.loop = function () {
    // CLEAN UP DEAD CREEPS
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
    
    // RUN ULTRA SYSTEMS
    manageUltraSpawns();
    manageUltraCreeps();
    manageUltraDefense();
    
    // 🔥 EMERGENCY WAR RESPONSE 🔥
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        const enemies = room.find(FIND_HOSTILE_CREEPS);
        
        if (enemies.length > 0) {
            console.log(`🚨🚨🚨 WAR IN ${roomName}: ${enemies.length} ENEMIES DETECTED! 🚨🚨🚨`);
            
            // MASSIVE EMERGENCY RESPONSE
            const spawn = room.find(FIND_MY_SPAWNS)[0];
            if (spawn && !spawn.spawning && room.energyAvailable >= 200) {
                const guards = room.find(FIND_MY_CREEPS, {
                    filter: c => c.memory.role === ROLES.GUARD
                });
                
                if (guards.length < enemies.length * 4) {
                    const body = getUltraBodyParts(ROLES.GUARD, room.energyAvailable);
                    if (spawnUltraCreep(spawn, ROLES.GUARD, body)) {
                        console.log(`🚀 EMERGENCY GUARD DEPLOYED!`);
                    }
                }
            }
        }
    }
    
    // 📡 INTELLIGENCE UPDATE
    if (Game.time % 50 === 0) {
        if (Memory.invasionTargets && Memory.invasionTargets.length > 0) {
            console.log(`🎯 INVASION TARGETS: ${Memory.invasionTargets.join(', ')}`);
        }
        
        const allCreeps = Object.keys(Game.creeps).length;
        const militaryCreeps = Object.values(Game.creeps).filter(c => 
            ['guard', 'attacker', 'ranger', 'assassin'].includes(c.memory.role)
        ).length;
        
        console.log(`⚡ ULTRA STATUS: ${allCreeps} total creeps, ${militaryCreeps} military`);
    }
    
    // 🏆 VICTORY TRACKING
    if (Game.time % 200 === 0) {
        const allRooms = Object.keys(Game.rooms);
        const myRooms = allRooms.filter(roomName => {
            const room = Game.rooms[roomName];
            return room.controller && room.controller.my;
        });
        
        console.log(`🏆 DOMINION: ${myRooms.length}/${allRooms.length} rooms controlled`);
        
        if (Memory.invasionTargets && Memory.invasionTargets.length > 0) {
            console.log(`🚀 PREPARING INVASION OF ${Memory.invasionTargets.length} enemy territories`);
        }
    }
    
    console.log(`💀 ULTRA TICK ${Game.time}: Maximum aggression active`);
};