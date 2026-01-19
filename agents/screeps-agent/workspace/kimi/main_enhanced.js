// 🏆 SCREEPS ULTIMATE PvP DOMINATION AI v2.0 🏆
// Enhanced for maximum aggression and defense

const DEFENSE_MODE = {
    PEACETIME: 0,
    ALERT: 1,
    WAR: 2,
    EMERGENCY: 3
};

let gameState = {
    defenseMode: DEFENSE_MODE.PEACETIME,
    lastEnemySeen: 0,
    currentTick: 0,
    roomName: 'W1N3',
    spawnPos: {x: 15, y: 15},
    enemies: [],
    allies: [],
    enemyRooms: new Set(),
    attackTargets: []
};

// Enhanced military unit designs for PvP
const militaryBodies = {
    scout: [MOVE, MOVE, MOVE, MOVE],
    
    warrior: [TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE],
    
    archer: [TOUGH, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE],
    
    healer: [TOUGH, HEAL, HEAL, HEAL, MOVE, MOVE, MOVE, MOVE],
    
    destroyer: [TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
    
    siege: [TOUGH, TOUGH, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE],
    
    assassin: [MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK] // Fast killer unit
};

// Enhanced role system
const roles = {
    harvester: {
        body: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE],
        maxCount: 6,
        priority: 1,
        emergencyCount: 2
    },
    
    upgrader: {
        body: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE],
        maxCount: 4,
        priority: 2,
        emergencyCount: 1
    },
    
    builder: {
        body: [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        maxCount: 3,
        priority: 3,
        emergencyCount: 1
    },
    
    repairer: {
        body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
        maxCount: 2,
        priority: 4,
        emergencyCount: 0
    },
    
    scout: {
        body: militaryBodies.scout,
        maxCount: 2,
        priority: 5,
        emergencyCount: 1
    },
    
    defender: {
        body: militaryBodies.warrior,
        maxCount: 4,
        priority: 6,
        emergencyCount: 3
    },
    
    archer: {
        body: militaryBodies.archer,
        maxCount: 3,
        priority: 7,
        emergencyCount: 2
    },
    
    attacker: {
        body: militaryBodies.destroyer,
        maxCount: 3,
        priority: 8,
        emergencyCount: 1
    },
    
    assassin: {
        body: militaryBodies.assassin,
        maxCount: 2,
        priority: 9,
        emergencyCount: 1
    }
};

// Advanced defense system
const defense = {
    buildFortress: function(room) {
        const spawn = Game.spawns.Spawn1;
        if (!spawn) return;
        
        // Build walls around spawn first
        const wallPositions = [
            {x: spawn.pos.x-2, y: spawn.pos.y-2}, {x: spawn.pos.x-1, y: spawn.pos.y-2}, {x: spawn.pos.x, y: spawn.pos.y-2}, {x: spawn.pos.x+1, y: spawn.pos.y-2}, {x: spawn.pos.x+2, y: spawn.pos.y-2},
            {x: spawn.pos.x-2, y: spawn.pos.y-1}, {x: spawn.pos.x+2, y: spawn.pos.y-1},
            {x: spawn.pos.x-2, y: spawn.pos.y}, {x: spawn.pos.x+2, y: spawn.pos.y},
            {x: spawn.pos.x-2, y: spawn.pos.y+1}, {x: spawn.pos.x+2, y: spawn.pos.y+1},
            {x: spawn.pos.x-2, y: spawn.pos.y+2}, {x: spawn.pos.x-1, y: spawn.pos.y+2}, {x: spawn.pos.x, y: spawn.pos.y+2}, {x: spawn.pos.x+1, y: spawn.pos.y+2}, {x: spawn.pos.x+2, y: spawn.pos.y+2}
        ];
        
        wallPositions.forEach(pos => {
            const structures = room.lookForAt(LOOK_STRUCTURES, pos.x, pos.y);
            const hasWall = structures.some(s => s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART);
            
            if (!hasWall) {
                if (room.createConstructionSite(pos.x, pos.y, STRUCTURE_RAMPART) === OK) {
                    console.log(`🏰 Fortress rampart at ${pos.x},${pos.y}`);
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
                {x: gameState.spawnPos.x-4, y: gameState.spawnPos.y-4},
                {x: gameState.spawnPos.x+4, y: gameState.spawnPos.y-4},
                {x: gameState.spawnPos.x-4, y: gameState.spawnPos.y+4},
                {x: gameState.spawnPos.x+4, y: gameState.spawnPos.y+4},
                {x: gameState.spawnPos.x, y: gameState.spawnPos.y-6},
                {x: gameState.spawnPos.x, y: gameState.spawnPos.y+6}
            ];
            
            towerPositions.forEach(pos => {
                if (room.createConstructionSite(pos.x, pos.y, STRUCTURE_TOWER) === OK) {
                    console.log(`🏗️ Tower construction at ${pos.x},${pos.y}`);
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
            for (let x = gameState.spawnPos.x - 8; x <= gameState.spawnPos.x + 8; x++) {
                for (let y = gameState.spawnPos.y - 8; y <= gameState.spawnPos.y + 8; y++) {
                    if (Math.abs(x - gameState.spawnPos.x) + Math.abs(y - gameState.spawnPos.y) > 3) {
                        positions.push({x, y});
                    }
                }
            }
            
            positions.forEach(pos => {
                if (room.createConstructionSite(pos.x, pos.y, STRUCTURE_EXTENSION) === OK) {
                    console.log(`🔋 Extension at ${pos.x},${pos.y}`);
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
            // Prioritize enemies attacking our creeps
            const hostileAttackers = tower.room.find(FIND_HOSTILE_CREEPS, {
                filter: hostile => {
                    return hostile.getActiveBodyparts(ATTACK) > 0 || hostile.getActiveBodyparts(RANGED_ATTACK) > 0;
                }
            });
            
            if (hostileAttackers.length > 0) {
                const target = tower.pos.findClosestByRange(hostileAttackers);
                if (target) {
                    tower.attack(target);
                    console.log(`⚔️ Tower engaging hostile attacker!`);
                    enemiesEngaged++;
                    return;
                }
            }
            
            // Then heal our damaged creeps
            const damagedCreeps = tower.room.find(FIND_MY_CREEPS, {
                filter: creep => creep.hits < creep.hitsMax
            });
            
            if (damagedCreeps.length > 0) {
                const target = tower.pos.findClosestByRange(damagedCreeps);
                if (target) {
                    tower.heal(target);
                    return;
                }
            }
            
            // Attack any remaining hostiles
            const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (closestHostile) {
                tower.attack(closestHostile);
                console.log(`⚔️ Tower attacking hostile`);
                enemiesEngaged++;
            }
        });
        
        return enemiesEngaged;
    }
};

// Enhanced creep behaviors
const creepActions = {
    harvester: function(creep) {
        if (creep.store.getFreeCapacity() > 0) {
            const sources = creep.room.find(FIND_SOURCES);
            const targetSource = creep.memory.sourceId ? 
                Game.getObjectById(creep.memory.sourceId) : 
                sources[Math.floor(Math.random() * sources.length)];
            
            if (targetSource && creep.harvest(targetSource) === ERR_NOT_IN_RANGE) {
                creep.moveTo(targetSource, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else {
            // Prioritize towers and spawn, then extensions
            const targets = creep.room.find(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_TOWER && 
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 500) ||
                           (structure.structureType === STRUCTURE_SPAWN && 
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0) ||
                           (structure.structureType === STRUCTURE_EXTENSION && 
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
                }
            });
            
            if (targets.length > 0) {
                targets.sort((a, b) => {
                    if (a.structureType === STRUCTURE_TOWER) return -1;
                    if (b.structureType === STRUCTURE_TOWER) return 1;
                    if (a.structureType === STRUCTURE_SPAWN) return -1;
                    if (b.structureType === STRUCTURE_SPAWN) return 1;
                    return 0;
                });
                
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
        if (creep.store.getFreeCapacity() > 0) {
            const sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else {
            const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length) {
                // Prioritize towers and ramparts
                targets.sort((a, b) => {
                    if (a.structureType === STRUCTURE_TOWER) return -1;
                    if (b.structureType === STRUCTURE_TOWER) return 1;
                    if (a.structureType === STRUCTURE_RAMPART) return -1;
                    if (b.structureType === STRUCTURE_RAMPART) return 1;
                    return 0;
                });
                
                if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    },
    
    defender: function(creep) {
        const hostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
            filter: hostile => {
                return hostile.getActiveBodyparts(ATTACK) > 0 || hostile.getActiveBodyparts(RANGED_ATTACK) > 0;
            }
        });
        
        if (hostile) {
            if (creep.attack(hostile) === ERR_NOT_IN_RANGE) {
                creep.moveTo(hostile, {visualizePathStyle: {stroke: '#ff0000'}});
            }
        } else {
            // Patrol spawn area
            const spawn = Game.spawns.Spawn1;
            if (spawn) {
                const patrolX = spawn.pos.x + Math.floor(Math.random() * 7) - 3;
                const patrolY = spawn.pos.y + Math.floor(Math.random() * 7) - 3;
                creep.moveTo(patrolX, patrolY);
            }
        }
    },
    
    archer: function(creep) {
        const hostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (hostile) {
            const range = creep.pos.getRangeTo(hostile);
            if (range <= 3) {
                creep.rangedAttack(hostile);
                if (range <= 2) {
                    // Kite away from melee enemies
                    const fleeDirection = creep.pos.getDirectionTo(hostile);
                    const fleePos = creep.pos.getAdjacentPosition((fleeDirection + 3) % 8 + 1);
                    creep.moveTo(fleePos);
                }
            } else {
                creep.moveTo(hostile, {visualizePathStyle: {stroke: '#ff6600'}});
            }
        } else {
            // Stay near spawn but at range
            const spawn = Game.spawns.Spawn1;
            if (spawn) {
                if (creep.pos.getRangeTo(spawn) > 5) {
                    creep.moveTo(spawn);
                }
            }
        }
    },
    
    attacker: function(creep) {
        // Target enemy spawns first
        const enemySpawn = creep.pos.findClosestByPath(FIND_HOSTILE_SPAWNS);
        if (enemySpawn) {
            if (creep.attack(enemySpawn) === ERR_NOT_IN_RANGE) {
                creep.moveTo(enemySpawn, {visualizePathStyle: {stroke: '#ff0000'}});
            }
            return;
        }
        
        // Then target towers
        const enemyTower = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
            filter: { structureType: STRUCTURE_TOWER }
        });
        if (enemyTower) {
            if (creep.attack(enemyTower) === ERR_NOT_IN_RANGE) {
                creep.moveTo(enemyTower, {visualizePathStyle: {stroke: '#ff0000'}});
            }
            return;
        }
        
        // Then any hostile structures
        const hostileStructures = creep.room.find(FIND_HOSTILE_STRUCTURES);
        if (hostileStructures.length > 0) {
            if (creep.attack(hostileStructures[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(hostileStructures[0], {visualizePathStyle: {stroke: '#ff0000'}});
            }
        }
    },
    
    assassin: function(creep) {
        // Fast unit that targets enemy creeps
        const enemyCreep = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {
            filter: hostile => hostile.getActiveBodyparts(HEAL) === 0 // Target non-healers first
        });
        
        if (enemyCreep) {
            if (creep.attack(enemyCreep) === ERR_NOT_IN_RANGE) {
                creep.moveTo(enemyCreep, {visualizePathStyle: {stroke: '#aa0000'}});
            }
        } else {
            // If no good targets, attack anything
            const anyEnemy = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
            if (anyEnemy) {
                if (creep.attack(anyEnemy) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(anyEnemy, {visualizePathStyle: {stroke: '#aa0000'}});
                }
            }
        }
    },
    
    scout: function(creep) {
        // Systematic room exploration
        const exits = Game.map.describeExits(creep.room.name);
        if (exits) {
            const exitDirs = Object.keys(exits);
            const targetRoom = exits[exitDirs[0]]; // Always try first exit for consistency
            
            if (creep.room.name !== targetRoom) {
                const exitDir = creep.room.findExitTo(targetRoom);
                const exit = creep.pos.findClosestByRange(exitDir);
                if (exit) {
                    creep.moveTo(exit);
                }
            }
            
            // Record enemy presence
            const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
            const enemyStructures = creep.room.find(FIND_HOSTILE_STRUCTURES);
            
            if (hostiles.length > 0 || enemyStructures.length > 0) {
                gameState.enemyRooms.add(creep.room.name);
                console.log(`🎯 Enemy detected in ${creep.room.name}!`);
            }
        }
    },
    
    repairer: function(creep) {
        const damagedStructures = creep.room.find(FIND_MY_STRUCTURES, {
            filter: structure => structure.hits < structure.hitsMax * 0.8 && 
                               structure.structureType !== STRUCTURE_WALL
        });
        
        if (damagedStructures.length > 0) {
            damagedStructures.sort((a, b) => {
                // Prioritize towers and spawn
                if (a.structureType === STRUCTURE_TOWER) return -1;
                if (b.structureType === STRUCTURE_TOWER) return 1;
                if (a.structureType === STRUCTURE_SPAWN) return -1;
                if (b.structureType === STRUCTURE_SPAWN) return 1;
                return a.hits / a.hitsMax - b.hits / b.hitsMax;
            });
            
            if (creep.repair(damagedStructures[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(damagedStructures[0], {visualizePathStyle: {stroke: '#00ff00'}});
            }
        } else if (creep.store.getFreeCapacity() > 0) {
            const sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

// Enhanced spawn management
const spawnManager = {
    spawnCreep: function(roleName, emergency = false) {
        const spawn = Game.spawns.Spawn1;
        if (!spawn) return null;
        
        const role = roles[roleName];
        if (!role) return null;
        
        let body = role.body;
        if (emergency && roleName === 'defender') {
            // Emergency defenders are cheaper but faster to spawn
            body = [TOUGH, ATTACK, ATTACK, MOVE, MOVE];
        }
        
        const bodyCost = body.reduce((cost, part) => cost + BODYPART_COST[part], 0);
        if (spawn.room.energyAvailable < bodyCost) return null;
        
        const creepName = `${roleName}_${Game.time}_${emergency ? 'EMERGENCY' : ''}`;
        const result = spawn.spawnCreep(body, creepName, {
            memory: {role: roleName, born: Game.time, emergency: emergency}
        });
        
        if (result === OK) {
            console.log(`🐣 Spawned ${emergency ? 'EMERGENCY ' : ''}${roleName}: ${creepName}`);
            return creepName;
        }
        
        return null;
    },
    
    maintainCreepPopulation: function() {
        const creeps = Game.creeps;
        const creepCounts = {};
        const emergencyMode = gameState.defenseMode === DEFENSE_MODE.EMERGENCY;
        
        // Count existing creeps by role
        Object.keys(roles).forEach(role => creepCounts[role] = 0);
        
        for (let creepName in creeps) {
            const creep = creeps[creepName];
            if (creep.memory.role) {
                creepCounts[creep.memory.role]++;
            }
        }
        
        // Spawn missing creeps based on priority and defense mode
        const rolePriorities = Object.keys(roles).sort((a, b) => roles[a].priority - roles[b].priority);
        
        for (let role of rolePriorities) {
            const maxCount = emergencyMode ? (roles[role].emergencyCount || roles[role].maxCount) : roles[role].maxCount;
            
            if (creepCounts[role] < maxCount) {
                this.spawnCreep(role, emergencyMode && role === 'defender');
                break; // Only spawn one creep per tick
            }
        }
    }
};

// Intelligence and targeting system
const intelligence = {
    scanForEnemies: function(room) {
        const hostiles = room.find(FIND_HOSTILE_CREEPS);
        const hostileStructures = room.find(FIND_HOSTILE_STRUCTURES);
        
        gameState.enemies = hostiles;
        
        if (hostiles.length > 0 || hostileStructures.length > 0) {
            gameState.lastEnemySeen = Game.time;
            
            // Assess threat level
            const threatLevel = hostiles.reduce((threat, creep) => {
                return threat + creep.getActiveBodyparts(ATTACK) + creep.getActiveBodyparts(RANGED_ATTACK);
            }, 0);
            
            if (threatLevel > 10 || hostiles.length > 5) {
                gameState.defenseMode = DEFENSE_MODE.EMERGENCY;
                console.log(`🚨 EMERGENCY: High threat level ${threatLevel}!`);
            } else if (hostiles.length > 2) {
                gameState.defenseMode = DEFENSE_MODE.WAR;
                console.log(`🚨 WAR MODE: ${hostiles.length} enemies detected!`);
            } else {
                gameState.defenseMode = DEFENSE_MODE.ALERT;
                console.log(`⚠️ ALERT MODE: ${hostiles.length} enemies detected`);
            }
        } else {
            // Return to peacetime after 30 ticks of no enemies
            if (Game.time - gameState.lastEnemySeen > 30) {
                gameState.defenseMode = DEFENSE_MODE.PEACETIME;
            }
        }
        
        return { hostiles, hostileStructures, threatLevel };
    },
    
    selectAttackTarget: function() {
        // Prioritize rooms we've scouted with enemies
        const enemyRooms = Array.from(gameState.enemyRooms);
        if (enemyRooms.length > 0) {
            return enemyRooms[Math.floor(Math.random() * enemyRooms.length)];
        }
        
        // Otherwise, try adjacent rooms
        const room = Game.rooms[gameState.roomName];
        if (room) {
            const exits = Game.map.describeExits(room.name);
            if (exits) {
                const exitDirs = Object.keys(exits);
                if (exitDirs.length > 0) {
                    return exits[exitDirs[0]];
                }
            }
        }
        
        return null;
    }
};

// Main enhanced game loop
module.exports.loop = function() {
    gameState.currentTick = Game.time;
    
    // Clear memory of dead creeps
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
    
    const room = Game.rooms[gameState.roomName];
    if (!room) {
        console.log(`❌ Room ${gameState.roomName} not found!`);
        return;
    }
    
    // Intelligence gathering
    const intel = intelligence.scanForEnemies(room);
    
    // Activate defense systems
    const enemiesEngaged = defense.activateTowers(room);
    
    // Build based on defense mode
    if (gameState.defenseMode === DEFENSE_MODE.EMERGENCY) {
        defense.buildFortress(room);
    } else if (gameState.defenseMode === DEFENSE_MODE.WAR) {
        defense.buildFortress(room);
        defense.buildTowers(room);
    } else if (gameState.defenseMode === DEFENSE_MODE.PEACETIME) {
        defense.buildExtensions(room);
        defense.buildTowers(room);
    }
    
    // Manage creep population
    spawnManager.maintainCreepPopulation();
    
    // Handle creep actions
    for (let name in Game.creeps) {
        const creep = Game.creeps[name];
        const role = creep.memory.role;
        
        if (creepActions[role]) {
            creepActions[role](creep);
        }
    }
    
    // Strategic attacks
    if (gameState.defenseMode === DEFENSE_MODE.PEACETIME && Game.time % 50 === 0) {
        const targetRoom = intelligence.selectAttackTarget();
        if (targetRoom) {
            console.log(`🎯 Planning attack on ${targetRoom}`);
            // Spawn attack units
            const attackers = Object.keys(Game.creeps).filter(name => 
                Game.creeps[name].memory.role === 'attacker' || 
                Game.creeps[name].memory.role === 'assassin'
            ).length;
            
            if (attackers < 2) {
                spawnManager.spawnCreep('assassin');
            }
        }
    }
    
    // Log enhanced status
    if (Game.time % 5 === 0) {
        const modeNames = ['PEACETIME', 'ALERT', 'WAR', 'EMERGENCY'];
        const enemyRooms = Array.from(gameState.enemyRooms).join(', ') || 'None';
        console.log(`📊 ${modeNames[gameState.defenseMode]} | Energy: ${room.energyAvailable}/${room.energyCapacityAvailable} | Creeps: ${Object.keys(Game.creeps).length} | Enemies: ${gameState.enemies.length} | Enemy Rooms: ${enemyRooms}`);
    }
    
    // Emergency protocols
    if (gameState.defenseMode === DEFENSE_MODE.EMERGENCY) {
        const defenders = Object.keys(Game.creeps).filter(name => 
            Game.creeps[name].memory.role === 'defender'
        ).length;
        
        if (defenders < 3) {
            spawnManager.spawnCreep('defender', true);
        }
    }
};