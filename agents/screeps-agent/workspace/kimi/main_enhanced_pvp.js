// 🏆 SCREEPS ULTIMATE PvP DOMINATION AI v3.0 🏆
// ULTRA AGGRESSIVE EDITION - Maximum destruction, minimum mercy

const DEFENSE_MODE = {
    PEACETIME: 0,
    ALERT: 1,
    WAR: 2,
    EMERGENCY: 3,
    TOTAL_WAR: 4
};

let gameState = {
    defenseMode: DEFENSE_MODE.PEACETIME,
    lastEnemySeen: 0,
    currentTick: 0,
    roomName: 'W1N3',
    spawnPos: {x: 25, y: 25},
    enemies: [],
    allies: [],
    enemyRooms: new Set(),
    attackTargets: [],
    lastAttackTime: 0,
    attackWaveSize: 0,
    maxAttackWave: 6
};

// ULTRA military unit designs - Maximum damage, maximum speed
const militaryBodies = {
    scout: [MOVE, MOVE, MOVE, MOVE, MOVE], // Ultra fast
    
    warrior: [TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE],
    
    archer: [TOUGH, TOUGH, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE],
    
    healer: [TOUGH, TOUGH, HEAL, HEAL, HEAL, HEAL, MOVE, MOVE, MOVE, MOVE],
    
    destroyer: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
    
    siege: [TOUGH, TOUGH, TOUGH, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
    
    assassin: [MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK], // Lightning fast killer
    
    kamikaze: [MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK] // Pure offense
};

// Enhanced role system with ULTRA priorities
const roles = {
    harvester: {
        body: [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE],
        maxCount: 8,
        priority: 1,
        emergencyCount: 3
    },
    
    upgrader: {
        body: [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE],
        maxCount: 6,
        priority: 2,
        emergencyCount: 2
    },
    
    builder: {
        body: [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE],
        maxCount: 4,
        priority: 3,
        emergencyCount: 1
    },
    
    repairer: {
        body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
        maxCount: 2,
        priority: 4,
        emergencyCount: 1
    },
    
    scout: {
        body: militaryBodies.scout,
        maxCount: 3,
        priority: 5,
        emergencyCount: 1
    },
    
    warrior: {
        body: militaryBodies.warrior,
        maxCount: 4,
        priority: 6,
        emergencyCount: 2
    },
    
    archer: {
        body: militaryBodies.archer,
        maxCount: 4,
        priority: 7,
        emergencyCount: 2
    },
    
    healer: {
        body: militaryBodies.healer,
        maxCount: 3,
        priority: 8,
        emergencyCount: 1
    },
    
    attacker: {
        body: militaryBodies.destroyer,
        maxCount: 6,
        priority: 9,
        emergencyCount: 3
    },
    
    kamikaze: {
        body: militaryBodies.kamikaze,
        maxCount: 4,
        priority: 10,
        emergencyCount: 2
    }
};

// ULTRA defense system - Impenetrable fortress
const defense = {
    buildFortress: function(room) {
        const spawn = Game.spawns.Spawn1;
        if (!spawn) return;
        
        // Build MASSIVE walls around spawn
        const wallPositions = [];
        for (let x = spawn.pos.x - 4; x <= spawn.pos.x + 4; x++) {
            for (let y = spawn.pos.y - 4; y <= spawn.pos.y + 4; y++) {
                if (Math.abs(x - spawn.pos.x) >= 3 || Math.abs(y - spawn.pos.y) >= 3) {
                    wallPositions.push({x, y});
                }
            }
        }
        
        wallPositions.forEach(pos => {
            const structures = room.lookForAt(LOOK_STRUCTURES, pos.x, pos.y);
            const hasWall = structures.some(s => s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART);
            
            if (!hasWall) {
                if (room.createConstructionSite(pos.x, pos.y, STRUCTURE_RAMPART) === OK) {
                    console.log(`🏰 ULTRA Fortress rampart at ${pos.x},${pos.y}`);
                }
            }
        });
    },
    
    buildTowers: function(room) {
        const towerCount = room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_TOWER }
        }).length;
        
        if (towerCount < 6) {
            const towerPositions = [
                {x: gameState.spawnPos.x - 5, y: gameState.spawnPos.y - 5},
                {x: gameState.spawnPos.x + 5, y: gameState.spawnPos.y - 5},
                {x: gameState.spawnPos.x - 5, y: gameState.spawnPos.y + 5},
                {x: gameState.spawnPos.x + 5, y: gameState.spawnPos.y + 5},
                {x: gameState.spawnPos.x, y: gameState.spawnPos.y - 7},
                {x: gameState.spawnPos.x, y: gameState.spawnPos.y + 7}
            ];
            
            towerPositions.forEach(pos => {
                if (room.createConstructionSite(pos.x, pos.y, STRUCTURE_TOWER) === OK) {
                    console.log(`🏗️ ULTRA Tower construction at ${pos.x},${pos.y}`);
                }
            });
        }
    },
    
    buildExtensions: function(room) {
        const extensionCount = room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_EXTENSION }
        }).length;
        
        if (extensionCount < 50) {
            const positions = [];
            for (let x = gameState.spawnPos.x - 10; x <= gameState.spawnPos.x + 10; x++) {
                for (let y = gameState.spawnPos.y - 10; y <= gameState.spawnPos.y + 10; y++) {
                    if (Math.abs(x - gameState.spawnPos.x) + Math.abs(y - gameState.spawnPos.y) > 4) {
                        positions.push({x, y});
                    }
                }
            }
            
            positions.forEach(pos => {
                if (room.createConstructionSite(pos.x, pos.y, STRUCTURE_EXTENSION) === OK) {
                    console.log(`🔋 ULTRA Extension at ${pos.x},${pos.y}`);
                }
            });
        }
    },
    
    activateTowers: function(room) {
        const towers = room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_TOWER }
        });
        
        let enemiesEngaged = 0;
        
        towers.forEach(tower => {
            // ULTRA PRIORITY: Kill enemy healers first
            const hostileHealers = tower.room.find(FIND_HOSTILE_CREEPS, {
                filter: hostile => hostile.getActiveBodyparts(HEAL) > 0
            });
            
            if (hostileHealers.length > 0) {
                const target = tower.pos.findClosestByRange(hostileHealers);
                if (target) {
                    tower.attack(target);
                    console.log(`💥 ULTRA Tower SNIPING healer!`);
                    enemiesEngaged++;
                    return;
                }
            }
            
            // Then kill attackers
            const hostileAttackers = tower.room.find(FIND_HOSTILE_CREEPS, {
                filter: hostile => {
                    return hostile.getActiveBodyparts(ATTACK) > 0 || hostile.getActiveBodyparts(RANGED_ATTACK) > 0;
                }
            });
            
            if (hostileAttackers.length > 0) {
                const target = tower.pos.findClosestByRange(hostileAttackers);
                if (target) {
                    tower.attack(target);
                    console.log(`⚔️ ULTRA Tower engaging hostile attacker!`);
                    enemiesEngaged++;
                    return;
                }
            }
            
            // Finally attack any hostile
            const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (closestHostile) {
                tower.attack(closestHostile);
                console.log(`⚔️ ULTRA Tower attacking hostile`);
                enemiesEngaged++;
                return;
            }
            
            // Heal damaged allies
            const damagedAlly = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: creep => creep.hits < creep.hitsMax
            });
            
            if (damagedAlly) {
                tower.heal(damagedAlly);
                console.log(`💚 ULTRA Tower healing ally`);
            }
        });
        
        return enemiesEngaged;
    }
};

// ULTRA military tactics
const military = {
    scoutEnemy: function(creep) {
        const enemyRooms = ['W1N1', 'W1N2', 'W1N4', 'W1N5', 'W2N1', 'W2N2', 'W2N3', 'W0N1', 'W0N2', 'W0N3'];
        const targetRoom = enemyRooms[Math.floor(Math.random() * enemyRooms.length)];
        
        if (creep.room.name !== targetRoom) {
            creep.moveTo(new RoomPosition(25, 25, targetRoom), {visualizePathStyle: {stroke: '#00ff00'}});
            return;
        }
        
        // Scout for enemies
        const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
        const enemyStructures = creep.room.find(FIND_HOSTILE_STRUCTURES);
        
        if (hostiles.length > 0 || enemyStructures.length > 0) {
            gameState.enemyRooms.add(creep.room.name);
            console.log(`🎯 ULTRA SCOUT Found enemy in ${creep.room.name}!`);
            
            // Prioritize enemy spawn locations
            const enemySpawns = enemyStructures.filter(s => s.structureType === STRUCTURE_SPAWN);
            if (enemySpawns.length > 0) {
                gameState.attackTargets.push({
                    room: creep.room.name,
                    type: 'spawn',
                    pos: enemySpawns[0].pos,
                    priority: 1
                });
            }
        }
        
        // Keep moving to avoid being hit
        creep.moveTo(new RoomPosition(Math.random() * 40 + 10, Math.random() * 40 + 10, creep.room.name));
    },
    
    launchUltraAttack: function(targetRoom) {
        console.log(`🚀 LAUNCHING ULTRA ATTACK ON ${targetRoom}!`);
        
        // Get current attack forces
        const attackers = Object.keys(Game.creeps).filter(name => {
            const creep = Game.creeps[name];
            return (creep.memory.role === 'attacker' || creep.memory.role === 'kamikaze') && 
                   creep.room.name === gameState.roomName;
        }).length;
        
        const healers = Object.keys(Game.creeps).filter(name => {
            const creep = Game.creeps[name];
            return creep.memory.role === 'healer' && creep.room.name === gameState.roomName;
        }).length;
        
        console.log(`📊 Current forces: ${attackers} attackers, ${healers} healers`);
        
        // Launch coordinated attack
        if (attackers >= 2) {
            // Move existing forces to attack
            Object.keys(Game.creeps).forEach(name => {
                const creep = Game.creeps[name];
                if ((creep.memory.role === 'attacker' || creep.memory.role === 'kamikaze') && creep.room.name === gameState.roomName) {
                    creep.memory.targetRoom = targetRoom;
                    creep.memory.mode = 'attack';
                    console.log(`🎯 ${name} ordered to attack ${targetRoom}`);
                }
                if (creep.memory.role === 'healer' && creep.room.name === gameState.roomName) {
                    creep.memory.targetRoom = targetRoom;
                    creep.memory.mode = 'support';
                    console.log(`💚 ${name} ordered to support attack on ${targetRoom}`);
                }
            });
            
            gameState.lastAttackTime = Game.time;
            gameState.attackWaveSize = attackers;
        }
    }
};

// Role execution functions
const roleFunctions = {
    harvester: function(creep) {
        if (creep.store.getFreeCapacity() > 0) {
            const sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else {
            const targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_EXTENSION ||
                            structure.structureType === STRUCTURE_SPAWN ||
                            structure.structureType === STRUCTURE_TOWER) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    },
    
    upgrader: function(creep) {
        if (creep.store[RESOURCE_ENERGY] === 0) {
            const sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else {
            if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    },
    
    builder: function(creep) {
        const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (targets.length) {
            if (creep.store[RESOURCE_ENERGY] === 0) {
                const sources = creep.room.find(FIND_SOURCES);
                if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
                if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        } else {
            // No construction sites, help as upgrader
            roleFunctions.upgrader(creep);
        }
    },
    
    repairer: function(creep) {
        const targets = creep.room.find(FIND_STRUCTURES, {
            filter: object => object.hits < object.hitsMax && object.structureType !== STRUCTURE_WALL
        });
        
        targets.sort((a, b) => a.hits - b.hits);
        
        if (targets.length > 0) {
            if (creep.store[RESOURCE_ENERGY] === 0) {
                const sources = creep.room.find(FIND_SOURCES);
                if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
                if (creep.repair(targets[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        } else {
            // Nothing to repair, help as builder
            roleFunctions.builder(creep);
        }
    },
    
    scout: function(creep) {
        military.scoutEnemy(creep);
    },
    
    warrior: function(creep) {
        const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
        if (hostiles.length > 0) {
            const target = creep.pos.findClosestByRange(hostiles);
            if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
            }
        } else {
            // Patrol around room
            creep.moveTo(new RoomPosition(Math.random() * 40 + 10, Math.random() * 40 + 10, creep.room.name));
        }
    },
    
    archer: function(creep) {
        const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
        if (hostiles.length > 0) {
            const target = creep.pos.findClosestByRange(hostiles);
            if (creep.rangedAttack(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
            } else {
                // Mass attack if close to multiple enemies
                creep.rangedMassAttack();
            }
        } else {
            // Patrol
            creep.moveTo(new RoomPosition(Math.random() * 40 + 10, Math.random() * 40 + 10, creep.room.name));
        }
    },
    
    healer: function(creep) {
        // Heal damaged allies first
        const damagedAlly = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: ally => ally.hits < ally.hitsMax
        });
        
        if (damagedAlly) {
            if (creep.heal(damagedAlly) === ERR_NOT_IN_RANGE) {
                creep.moveTo(damagedAlly, {visualizePathStyle: {stroke: '#00ff00'}});
            }
            return;
        }
        
        // Follow military units if no one needs healing
        const militaryUnits = creep.room.find(FIND_MY_CREEPS, {
            filter: ally => ['warrior', 'archer', 'attacker', 'kamikaze'].includes(ally.memory.role)
        });
        
        if (militaryUnits.length > 0) {
            const target = creep.pos.findClosestByRange(militaryUnits);
            if (creep.pos.getRangeTo(target) > 2) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#00ff00'}});
            }
        }
    },
    
    attacker: function(creep) {
        // ULTRA ATTACK MODE
        if (creep.memory.targetRoom && creep.room.name !== creep.memory.targetRoom) {
            creep.moveTo(new RoomPosition(25, 25, creep.memory.targetRoom), {visualizePathStyle: {stroke: '#ff0000'}});
            return;
        }
        
        // Target enemy spawns first (HIGHEST PRIORITY)
        const enemySpawn = creep.pos.findClosestByPath(FIND_HOSTILE_SPAWNS);
        if (enemySpawn) {
            if (creep.attack(enemySpawn) === ERR_NOT_IN_RANGE) {
                creep.moveTo(enemySpawn, {visualizePathStyle: {stroke: '#ff0000'}});
            }
            console.log(`💀 ${creep.name} ATTACKING ENEMY SPAWN!`);
            return;
        }
        
        // Target enemy towers
        const enemyTower = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
            filter: { structureType: STRUCTURE_TOWER }
        });
        if (enemyTower) {
            if (creep.attack(enemyTower) === ERR_NOT_IN_RANGE) {
                creep.moveTo(enemyTower, {visualizePathStyle: {stroke: '#ff0000'}});
            }
            console.log(`🏗️ ${creep.name} DESTROYING ENEMY TOWER!`);
            return;
        }
        
        // Target enemy extensions and containers
        const enemyStructures = creep.room.find(FIND_HOSTILE_STRUCTURES, {
            filter: s => s.structureType === STRUCTURE_EXTENSION || 
                        s.structureType === STRUCTURE_CONTAINER || 
                        s.structureType === STRUCTURE_STORAGE
        });
        if (enemyStructures.length > 0) {
            const target = creep.pos.findClosestByRange(enemyStructures);
            if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
            }
            console.log(`🔥 ${creep.name} DESTROYING ENEMY STRUCTURES!`);
            return;
        }
        
        // Kill enemy creeps
        const enemyCreep = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {
            filter: hostile => hostile.getActiveBodyparts(ATTACK) > 0 || hostile.getActiveBodyparts(RANGED_ATTACK) > 0
        });
        if (enemyCreep) {
            if (creep.attack(enemyCreep) === ERR_NOT_IN_RANGE) {
                creep.moveTo(enemyCreep, {visualizePathStyle: {stroke: '#aa0000'}});
            }
            console.log(`⚔️ ${creep.name} KILLING ENEMY CREEPS!`);
            return;
        }
        
        // Attack anything else
        const anyEnemy = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        if (anyEnemy) {
            if (creep.attack(anyEnemy) === ERR_NOT_IN_RANGE) {
                creep.moveTo(anyEnemy, {visualizePathStyle: {stroke: '#aa0000'}});
            }
            console.log(`💥 ${creep.name} ATTACKING ANY ENEMY!`);
        }
    },
    
    kamikaze: function(creep) {
        // PURE SUICIDE ATTACKER - Maximum damage, no retreat
        if (creep.memory.targetRoom && creep.room.name !== creep.memory.targetRoom) {
            creep.moveTo(new RoomPosition(25, 25, creep.memory.targetRoom), {visualizePathStyle: {stroke: '#ff0000'}});
            return;
        }
        
        // Find highest value target
        const targets = [
            ...creep.room.find(FIND_HOSTILE_SPAWNS),
            ...creep.room.find(FIND_HOSTILE_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}}),
            ...creep.room.find(FIND_HOSTILE_CREEPS, {filter: c => c.getActiveBodyparts(HEAL) > 0}),
            ...creep.room.find(FIND_HOSTILE_CREEPS, {filter: c => c.getActiveBodyparts(ATTACK) > 0 || c.getActiveBodyparts(RANGED_ATTACK) > 0}),
            ...creep.room.find(FIND_HOSTILE_CREEPS)
        ];
        
        if (targets.length > 0) {
            const target = creep.pos.findClosestByRange(targets);
            if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
            }
            console.log(`💀💥 KAMIKAZE ${creep.name} ATTACKING ${target.structureType || 'CREEP'}!`);
        } else {
            // No targets? Move to center and wait
            creep.moveTo(new RoomPosition(25, 25, creep.room.name));
        }
    }
};

// Spawn management
const spawnManager = {
    spawnCreep: function(spawn, role) {
        const roleConfig = roles[role];
        if (!roleConfig) return null;
        
        const body = roleConfig.body;
        const name = `${role}_${Game.time}_${Math.floor(Math.random() * 1000)}`;
        
        const result = spawn.spawnCreep(body, name, {
            memory: {
                role: role,
                born: Game.time,
                homeRoom: spawn.room.name
            }
        });
        
        if (result === OK) {
            console.log(`🆕 Spawned ${role}: ${name}`);
            return name;
        }
        
        return null;
    },
    
    manageSpawning: function(spawn) {
        if (spawn.spawning) return;
        
        const room = spawn.room;
        const currentCreeps = Object.keys(Game.creeps);
        
        // Count creeps by role
        const creepCounts = {};
        currentCreeps.forEach(name => {
            const creep = Game.creeps[name];
            if (creep.memory.role) {
                creepCounts[creep.memory.role] = (creepCounts[creep.memory.role] || 0) + 1;
            }
        });
        
        // ULTRA spawning strategy based on defense mode
        if (gameState.defenseMode === DEFENSE_MODE.EMERGENCY || gameState.defenseMode === DEFENSE_MODE.TOTAL_WAR) {
            // Emergency military production
            if (creepCounts.warrior < 2) {
                spawnManager.spawnCreep(spawn, 'warrior');
                return;
            }
            if (creepCounts.kamikaze < 2) {
                spawnManager.spawnCreep(spawn, 'kamikaze');
                return;
            }
            if (creepCounts.archer < 2) {
                spawnManager.spawnCreep(spawn, 'archer');
                return;
            }
            if (creepCounts.healer < 1) {
                spawnManager.spawnCreep(spawn, 'healer');
                return;
            }
        }
        
        // Normal spawning priorities
        for (const role in roles) {
            const roleConfig = roles[role];
            const currentCount = creepCounts[role] || 0;
            
            const maxCount = gameState.defenseMode >= DEFENSE_MODE.WAR ? 
                           roleConfig.emergencyCount : roleConfig.maxCount;
            
            if (currentCount < maxCount) {
                spawnManager.spawnCreep(spawn, role);
                return;
            }
        }
    }
};

// Main game loop
module.exports.loop = function() {
    // Update game state
    gameState.currentTick = Game.time;
    
    // Clear dead creeps from memory
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log(`💀 Cleared dead creep: ${name}`);
        }
    }
    
    // Get current room
    const room = Game.rooms[gameState.roomName];
    if (!room) {
        console.log(`❌ Room ${gameState.roomName} not found!`);
        return;
    }
    
    // Find enemies in room
    gameState.enemies = room.find(FIND_HOSTILE_CREEPS);
    
    // Update defense mode
    if (gameState.enemies.length > 0) {
        gameState.lastEnemySeen = Game.time;
        
        // Determine threat level
        const dangerousEnemies = gameState.enemies.filter(e => 
            e.getActiveBodyparts(ATTACK) > 0 || e.getActiveBodyparts(RANGED_ATTACK) > 0
        ).length;
        
        if (dangerousEnemies >= 3) {
            gameState.defenseMode = DEFENSE_MODE.TOTAL_WAR;
        } else if (dangerousEnemies > 0) {
            gameState.defenseMode = DEFENSE_MODE.WAR;
        } else {
            gameState.defenseMode = DEFENSE_MODE.ALERT;
        }
    } else {
        // Gradually decrease alert level
        if (Game.time - gameState.lastEnemySeen > 100) {
            gameState.defenseMode = DEFENSE_MODE.PEACETIME;
        } else if (Game.time - gameState.lastEnemySeen > 50) {
            gameState.defenseMode = DEFENSE_MODE.ALERT;
        }
    }
    
    // Build defenses
    if (Game.time % 10 === 0) {
        defense.buildFortress(room);
        defense.buildTowers(room);
        defense.buildExtensions(room);
    }
    
    // Activate towers
    const towersEngaged = defense.activateTowers(room);
    
    // Manage spawning
    const spawn = Game.spawns.Spawn1;
    if (spawn) {
        spawnManager.manageSpawning(spawn);
    }
    
    // Execute creep roles
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        if (creep.spawning) continue;
        
        const role = creep.memory.role;
        if (roleFunctions[role]) {
            try {
                roleFunctions[role](creep);
            } catch (error) {
                console.log(`❌ Error in ${role} ${name}: ${error}`);
            }
        }
    }
    
    // ULTRA ATTACK STRATEGY
    if (Game.time % 50 === 0 && gameState.defenseMode >= DEFENSE_MODE.WAR) {
        const targetRooms = Array.from(gameState.enemyRooms);
        if (targetRooms.length > 0) {
            // Pick strongest enemy room
            const targetRoom = targetRooms[0];
            military.launchUltraAttack(targetRoom);
        }
    }
    
    // Launch periodic attacks even without scouting
    if (Game.time % 200 === 0 && Game.time - gameState.lastAttackTime > 150) {
        const potentialTargets = ['W1N1', 'W1N2', 'W1N4', 'W2N1', 'W2N2'];
        const targetRoom = potentialTargets[Math.floor(Math.random() * potentialTargets.length)];
        military.launchUltraAttack(targetRoom);
    }
    
    // Status report
    if (Game.time % 10 === 0) {
        const modeNames = ['PEACETIME', 'ALERT', 'WAR', 'EMERGENCY', 'TOTAL_WAR'];
        const enemyRooms = Array.from(gameState.enemyRooms).join(', ') || 'None';
        const attackersReady = Object.keys(Game.creeps).filter(name => {
            const creep = Game.creeps[name];
            return (creep.memory.role === 'attacker' || creep.memory.role === 'kamikaze') && 
                   creep.room.name === gameState.roomName;
        }).length;
        
        console.log(`🏆 ULTRA AI: ${modeNames[gameState.defenseMode]} | Energy: ${room.energyAvailable}/${room.energyCapacityAvailable} | Creeps: ${Object.keys(Game.creeps).length} | Enemies: ${gameState.enemies.length} | Attackers: ${attackersReady} | Enemy Rooms: ${enemyRooms}`);
    }
};