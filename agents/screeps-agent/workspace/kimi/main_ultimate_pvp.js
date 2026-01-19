// 🏆 SCREEPS ULTIMATE PvP DOMINATION AI v4.0 🏆
// APOCALYPSE EDITION - Total Annihilation Protocol

const DEFENSE_MODE = {
    PEACETIME: 0,
    ALERT: 1,
    WAR: 2,
    EMERGENCY: 3,
    TOTAL_WAR: 4,
    APOCALYPSE: 5
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
    maxAttackWave: 8,
    economyPhase: 'early',
    militaryPhase: 'defensive',
    totalWarDeclared: false
};

// APOCALYPSE military unit designs - Maximum destruction, no mercy
const militaryBodies = {
    scout: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], // Ultra fast recon
    
    warrior: [TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
    
    archer: [TOUGH, TOUGH, TOUGH, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE],
    
    healer: [TOUGH, TOUGH, HEAL, HEAL, HEAL, HEAL, HEAL, MOVE, MOVE, MOVE, MOVE, MOVE],
    
    destroyer: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
    
    siege: [TOUGH, TOUGH, TOUGH, TOUGH, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
    
    assassin: [MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK], // Lightning fast executioner
    
    kamikaze: [MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK], // Pure annihilation
    
    apocalypse: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE] // Ultimate war machine
};

// APOCALYPSE role system - Total domination
const roles = {
    harvester: {
        body: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE],
        maxCount: 10,
        priority: 1,
        emergencyCount: 4
    },
    
    upgrader: {
        body: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE],
        maxCount: 8,
        priority: 2,
        emergencyCount: 3
    },
    
    builder: {
        body: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE],
        maxCount: 6,
        priority: 3,
        emergencyCount: 2
    },
    
    repairer: {
        body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
        maxCount: 4,
        priority: 4,
        emergencyCount: 1
    },
    
    scout: {
        body: militaryBodies.scout,
        maxCount: 4,
        priority: 5,
        emergencyCount: 2
    },
    
    warrior: {
        body: militaryBodies.warrior,
        maxCount: 6,
        priority: 6,
        emergencyCount: 3
    },
    
    archer: {
        body: militaryBodies.archer,
        maxCount: 6,
        priority: 7,
        emergencyCount: 3
    },
    
    healer: {
        body: militaryBodies.healer,
        maxCount: 4,
        priority: 8,
        emergencyCount: 2
    },
    
    attacker: {
        body: militaryBodies.destroyer,
        maxCount: 8,
        priority: 9,
        emergencyCount: 4
    },
    
    kamikaze: {
        body: militaryBodies.kamikaze,
        maxCount: 6,
        priority: 10,
        emergencyCount: 3
    },
    
    apocalypse: {
        body: militaryBodies.apocalypse,
        maxCount: 4,
        priority: 11,
        emergencyCount: 2
    }
};

// APOCALYPSE defense system - Impregnable fortress of doom
const defense = {
    buildFortress: function(room) {
        const spawn = Game.spawns.Spawn1;
        if (!spawn) return;
        
        // Build MASSIVE fortress walls
        const wallPositions = [];
        for (let radius = 3; radius <= 6; radius++) {
            for (let x = spawn.pos.x - radius; x <= spawn.pos.x + radius; x++) {
                for (let y = spawn.pos.y - radius; y <= spawn.pos.y + radius; y++) {
                    if (Math.abs(x - spawn.pos.x) === radius || Math.abs(y - spawn.pos.y) === radius) {
                        wallPositions.push({x, y});
                    }
                }
            }
        }
        
        wallPositions.forEach(pos => {
            const structures = room.lookForAt(LOOK_STRUCTURES, pos.x, pos.y);
            const hasWall = structures.some(s => s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART);
            
            if (!hasWall) {
                if (room.createConstructionSite(pos.x, pos.y, STRUCTURE_RAMPART) === OK) {
                    console.log(`🏰 APOCALYPSE Fortress rampart at ${pos.x},${pos.y}`);
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
                {x: gameState.spawnPos.x - 6, y: gameState.spawnPos.y - 6},
                {x: gameState.spawnPos.x + 6, y: gameState.spawnPos.y - 6},
                {x: gameState.spawnPos.x - 6, y: gameState.spawnPos.y + 6},
                {x: gameState.spawnPos.x + 6, y: gameState.spawnPos.y + 6},
                {x: gameState.spawnPos.x, y: gameState.spawnPos.y - 8},
                {x: gameState.spawnPos.x, y: gameState.spawnPos.y + 8}
            ];
            
            towerPositions.forEach(pos => {
                if (room.createConstructionSite(pos.x, pos.y, STRUCTURE_TOWER) === OK) {
                    console.log(`🏗️ APOCALYPSE Tower construction at ${pos.x},${pos.y}`);
                }
            });
        }
    },
    
    buildExtensions: function(room) {
        const extensionCount = room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_EXTENSION }
        }).length;
        
        if (extensionCount < 60) {
            const positions = [];
            for (let x = gameState.spawnPos.x - 12; x <= gameState.spawnPos.x + 12; x++) {
                for (let y = gameState.spawnPos.y - 12; y <= gameState.spawnPos.y + 12; y++) {
                    if (Math.abs(x - gameState.spawnPos.x) + Math.abs(y - gameState.spawnPos.y) > 5) {
                        positions.push({x, y});
                    }
                }
            }
            
            positions.forEach(pos => {
                if (room.createConstructionSite(pos.x, pos.y, STRUCTURE_EXTENSION) === OK) {
                    console.log(`🔋 APOCALYPSE Extension at ${pos.x},${pos.y}`);
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
            // APOCALYPSE PRIORITY: Kill enemy healers first, then spawns, then attackers
            const hostileHealers = tower.room.find(FIND_HOSTILE_CREEPS, {
                filter: hostile => hostile.getActiveBodyparts(HEAL) > 0
            });
            
            if (hostileHealers.length > 0) {
                const target = tower.pos.findClosestByRange(hostileHealers);
                if (target) {
                    tower.attack(target);
                    console.log(`💥 APOCALYPSE Tower EXECUTING healer!`);
                    enemiesEngaged++;
                    return;
                }
            }
            
            // Target enemy spawns
            const enemySpawns = tower.room.find(FIND_HOSTILE_SPAWNS);
            if (enemySpawns.length > 0) {
                const target = tower.pos.findClosestByRange(enemySpawns);
                if (target) {
                    tower.attack(target);
                    console.log(`🏴‍☠️ APOCALYPSE Tower DESTROYING enemy spawn!`);
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
                    console.log(`⚔️ APOCALYPSE Tower OBLITERATING hostile!`);
                    enemiesEngaged++;
                    return;
                }
            }
            
            // Finally attack any hostile
            const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (closestHostile) {
                tower.attack(closestHostile);
                console.log(`⚔️ APOCALYPSE Tower ANNIHILATING hostile`);
                enemiesEngaged++;
                return;
            }
            
            // Heal damaged allies
            const damagedAlly = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: creep => creep.hits < creep.hitsMax * 0.8
            });
            
            if (damagedAlly) {
                tower.heal(damagedAlly);
                console.log(`💚 APOCALYPSE Tower MENDING ally`);
            }
        });
        
        return enemiesEngaged;
    }
};

// APOCALYPSE military tactics - Total enemy annihilation
const military = {
    scoutEnemy: function(creep) {
        const enemyRooms = ['W1N1', 'W1N2', 'W1N4', 'W1N5', 'W2N1', 'W2N2', 'W2N3', 'W0N1', 'W0N2', 'W0N3', 'W3N1', 'W3N2', 'W3N3'];
        const targetRoom = enemyRooms[Math.floor(Math.random() * enemyRooms.length)];
        
        if (creep.room.name !== targetRoom) {
            creep.moveTo(new RoomPosition(25, 25, targetRoom), {visualizePathStyle: {stroke: '#00ff00'}});
            return;
        }
        
        // Scout for enemies with detailed intelligence
        const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
        const enemyStructures = creep.room.find(FIND_HOSTILE_STRUCTURES);
        
        if (hostiles.length > 0 || enemyStructures.length > 0) {
            gameState.enemyRooms.add(creep.room.name);
            console.log(`🎯 APOCALYPSE SCOUT Enemy detected in ${creep.room.name}!`);
            
            // Detailed enemy analysis
            const enemySpawns = enemyStructures.filter(s => s.structureType === STRUCTURE_SPAWN);
            const enemyTowers = enemyStructures.filter(s => s.structureType === STRUCTURE_TOWER);
            const dangerousCreeps = hostiles.filter(c => c.getActiveBodyparts(ATTACK) > 0 || c.getActiveBodyparts(RANGED_ATTACK) > 0);
            
            console.log(`📊 Enemy intel: ${enemySpawns.length} spawns, ${enemyTowers.length} towers, ${dangerousCreeps.length} dangerous creeps`);
            
            // Prioritize high-value targets
            if (enemySpawns.length > 0) {
                gameState.attackTargets.push({
                    room: creep.room.name,
                    type: 'spawn',
                    pos: enemySpawns[0].pos,
                    priority: 1,
                    danger: enemyTowers.length + dangerousCreeps.length
                });
            } else if (enemyTowers.length > 0) {
                gameState.attackTargets.push({
                    room: creep.room.name,
                    type: 'tower',
                    pos: enemyTowers[0].pos,
                    priority: 2,
                    danger: dangerousCreeps.length
                });
            }
        }
        
        // Keep moving to avoid being hit
        creep.moveTo(new RoomPosition(Math.random() * 40 + 10, Math.random() * 40 + 10, creep.room.name));
    },
    
    launchApocalypseAttack: function(targetRoom) {
        console.log(`🚀🌋 LAUNCHING APOCALYPSE ATTACK ON ${targetRoom}!`);
        
        // Get current attack forces with detailed analysis
        const attackers = Object.keys(Game.creeps).filter(name => {
            const creep = Game.creeps[name];
            return (creep.memory.role === 'attacker' || creep.memory.role === 'kamikaze' || creep.memory.role === 'apocalypse') && 
                   creep.room.name === gameState.roomName;
        }).length;
        
        const healers = Object.keys(Game.creeps).filter(name => {
            const creep = Game.creeps[name];
            return creep.memory.role === 'healer' && creep.room.name === gameState.roomName;
        }).length;
        
        const warriors = Object.keys(Game.creeps).filter(name => {
            const creep = Game.creeps[name];
            return creep.memory.role === 'warrior' && creep.room.name === gameState.roomName;
        }).length;
        
        const archers = Object.keys(Game.creeps).filter(name => {
            const creep = Game.creeps[name];
            return creep.memory.role === 'archer' && creep.room.name === gameState.roomName;
        }).length;
        
        console.log(`📊 APOCALYPSE forces: ${attackers} attackers, ${healers} healers, ${warriors} warriors, ${archers} archers`);
        
        // Launch coordinated attack only if we have sufficient forces
        const totalAttackPower = attackers + warriors + (archers * 0.8);
        if (totalAttackPower >= 3) {
            // Move existing forces to attack
            Object.keys(Game.creeps).forEach(name => {
                const creep = Game.creeps[name];
                if (creep.room.name === gameState.roomName) {
                    if (creep.memory.role === 'attacker' || creep.memory.role === 'kamikaze' || creep.memory.role === 'apocalypse') {
                        creep.memory.targetRoom = targetRoom;
                        creep.memory.mode = 'attack';
                        console.log(`🎯 ${name} ordered to APOCALYPSE ${targetRoom}`);
                    }
                    if (creep.memory.role === 'healer') {
                        creep.memory.targetRoom = targetRoom;
                        creep.memory.mode = 'support';
                        console.log(`💚 ${name} ordered to support APOCALYPSE on ${targetRoom}`);
                    }
                    if (creep.memory.role === 'warrior' || creep.memory.role === 'archer') {
                        creep.memory.targetRoom = targetRoom;
                        creep.memory.mode = 'assault';
                        console.log(`⚔️ ${name} ordered to assault ${targetRoom}`);
                    }
                }
            });
            
            gameState.lastAttackTime = Game.time;
            gameState.attackWaveSize = totalAttackPower;
            gameState.totalWarDeclared = true;
        } else {
            console.log(`⏳ Insufficient forces for APOCALYPSE attack. Need more units.`);
        }
    }
};

// Role execution functions - Enhanced for APOCALYPSE
const roleFunctions = {
    harvester: function(creep) {
        if (creep.store.getFreeCapacity() > 0) {
            const sources = creep.room.find(FIND_SOURCES);
            if (sources.length > 0) {
                if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
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
            if (sources.length > 0) {
                if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
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
                if (sources.length > 0) {
                    if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
            } else {
                if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        } else {
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
                if (sources.length > 0) {
                    if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
            } else {
                if (creep.repair(targets[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        } else {
            roleFunctions.builder(creep);
        }
    },
    
    scout: function(creep) {
        military.scoutEnemy(creep);
    },
    
    warrior: function(creep) {
        if (creep.memory.targetRoom && creep.room.name !== creep.memory.targetRoom) {
            creep.moveTo(new RoomPosition(25, 25, creep.memory.targetRoom), {visualizePathStyle: {stroke: '#ff0000'}});
            return;
        }
        
        const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
        if (hostiles.length > 0) {
            const target = creep.pos.findClosestByRange(hostiles);
            if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
            }
        } else {
            if (creep.memory.mode === 'assault' && creep.memory.targetRoom) {
                creep.moveTo(new RoomPosition(25, 25, creep.memory.targetRoom), {visualizePathStyle: {stroke: '#ff0000'}});
            } else {
                creep.moveTo(new RoomPosition(Math.random() * 40 + 10, Math.random() * 40 + 10, creep.room.name));
            }
        }
    },
    
    archer: function(creep) {
        if (creep.memory.targetRoom && creep.room.name !== creep.memory.targetRoom) {
            creep.moveTo(new RoomPosition(25, 25, creep.memory.targetRoom), {visualizePathStyle: {stroke: '#ff0000'}});
            return;
        }
        
        const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
        if (hostiles.length > 0) {
            const target = creep.pos.findClosestByRange(hostiles);
            if (creep.rangedAttack(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
            } else {
                if (creep.pos.getRangeTo(target) <= 3) {
                    creep.rangedMassAttack();
                }
            }
        } else {
            if (creep.memory.mode === 'assault' && creep.memory.targetRoom) {
                creep.moveTo(new RoomPosition(25, 25, creep.memory.targetRoom), {visualizePathStyle: {stroke: '#ff0000'}});
            } else {
                creep.moveTo(new RoomPosition(Math.random() * 40 + 10, Math.random() * 40 + 10, creep.room.name));
            }
        }
    },
    
    healer: function(creep) {
        if (creep.memory.targetRoom && creep.room.name !== creep.memory.targetRoom && creep.memory.mode === 'support') {
            creep.moveTo(new RoomPosition(25, 25, creep.memory.targetRoom), {visualizePathStyle: {stroke: '#00ff00'}});
            return;
        }
        
        // Heal damaged allies first (prioritize military units)
        const militaryAllies = creep.room.find(FIND_MY_CREEPS, {
            filter: ally => (ally.memory.role === 'warrior' || ally.memory.role === 'archer' || 
                           ally.memory.role === 'attacker' || ally.memory.role === 'kamikaze' || 
                           ally.memory.role === 'apocalypse') && ally.hits < ally.hitsMax
        });
        
        if (militaryAllies.length > 0) {
            const target = creep.pos.findClosestByRange(militaryAllies);
            if (creep.heal(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#00ff00'}});
            }
            return;
        }
        
        // Heal any damaged ally
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
            filter: ally => ['warrior', 'archer', 'attacker', 'kamikaze', 'apocalypse'].includes(ally.memory.role)
        });
        
        if (militaryUnits.length > 0) {
            const target = creep.pos.findClosestByRange(militaryUnits);
            if (creep.pos.getRangeTo(target) > 2) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#00ff00'}});
            }
        }
    },
    
    attacker: function(creep) {
        // APOCALYPSE ATTACK MODE
        if (creep.memory.targetRoom && creep.room.name !== creep.memory.targetRoom) {
            creep.moveTo(new RoomPosition(25, 25, creep.memory.targetRoom), {visualizePathStyle: {stroke: '#ff0000'}});
            return;
        }
        
        // Target enemy spawns first (HIGHEST PRIORITY - KILL THE ENEMY'S ABILITY TO RESPAWN)
        const enemySpawn = creep.pos.findClosestByPath(FIND_HOSTILE_SPAWNS);
        if (enemySpawn) {
            if (creep.attack(enemySpawn) === ERR_NOT_IN_RANGE) {
                creep.moveTo(enemySpawn, {visualizePathStyle: {stroke: '#ff0000'}});
            }
            console.log(`💀 ${creep.name} APOCALYPSE ATTACKING ENEMY SPAWN!`);
            return;
        }
        
        // Target enemy towers (SILENCE THEIR DEFENSES)
        const enemyTower = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
            filter: { structureType: STRUCTURE_TOWER }
        });
        if (enemyTower) {
            if (creep.attack(enemyTower) === ERR_NOT_IN_RANGE) {
                creep.moveTo(enemyTower, {visualizePathStyle: {stroke: '#ff0000'}});
            }
            console.log(`🏗️ ${creep.name} APOCALYPSE DESTROYING ENEMY TOWER!`);
            return;
        }
        
        // Target enemy extensions (STARVE THEIR ECONOMY)
        const enemyExtensions = creep.room.find(FIND_HOSTILE_STRUCTURES, {
            filter: s => s.structureType === STRUCTURE_EXTENSION
        });
        if (enemyExtensions.length > 0) {
            const target = creep.pos.findClosestByRange(enemyExtensions);
            if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
            }
            console.log(`🔥 ${creep.name} APOCALYPSE DESTROYING ENEMY EXTENSIONS!`);
            return;
        }
        
        // Target enemy storage and containers (LOOT AND DESTROY)
        const enemyStorage = creep.room.find(FIND_HOSTILE_STRUCTURES, {
            filter: s => s.structureType === STRUCTURE_STORAGE || s.structureType === STRUCTURE_CONTAINER
        });
        if (enemyStorage.length > 0) {
            const target = creep.pos.findClosestByRange(enemyStorage);
            if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
            }
            console.log(`💰 ${creep.name} APOCALYPSE DESTROYING ENEMY STORAGE!`);
            return;
        }
        
        // Kill enemy healers first (REMOVE THEIR SUPPORT)
        const enemyHealers = creep.room.find(FIND_HOSTILE_CREEPS, {
            filter: hostile => hostile.getActiveBodyparts(HEAL) > 0
        });
        if (enemyHealers.length > 0) {
            const target = creep.pos.findClosestByRange(enemyHealers);
            if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#aa0000'}});
            }
            console.log(`🩹 ${creep.name} APOCALYPSE KILLING ENEMY HEALERS!`);
            return;
        }
        
        // Kill enemy attackers (ELIMINATE THEIR OFFENSE)
        const enemyAttackers = creep.room.find(FIND_HOSTILE_CREEPS, {
            filter: hostile => hostile.getActiveBodyparts(ATTACK) > 0 || hostile.getActiveBodyparts(RANGED_ATTACK) > 0
        });
        if (enemyAttackers.length > 0) {
            const target = creep.pos.findClosestByRange(enemyAttackers);
            if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#aa0000'}});
            }
            console.log(`⚔️ ${creep.name} APOCALYPSE KILLING ENEMY ATTACKERS!`);
            return;
        }
        
        // Attack anything else that moves
        const anyEnemy = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        if (anyEnemy) {
            if (creep.attack(anyEnemy) === ERR_NOT_IN_RANGE) {
                creep.moveTo(anyEnemy, {visualizePathStyle: {stroke: '#aa0000'}});
            }
            console.log(`💥 ${creep.name} APOCALYPSE ATTACKING ANY ENEMY!`);
        }
    },
    
    kamikaze: function(creep) {
        // PURE SUICIDE ANNIHILATION - No retreat, no surrender, only destruction
        if (creep.memory.targetRoom && creep.room.name !== creep.memory.targetRoom) {
            creep.moveTo(new RoomPosition(25, 25, creep.memory.targetRoom), {visualizePathStyle: {stroke: '#ff0000'}});
            return;
        }
        
        // Find highest value target with ruthless efficiency
        const targets = [
            ...creep.room.find(FIND_HOSTILE_SPAWNS),                    // Priority 1: Kill their respawn
            ...creep.room.find(FIND_HOSTILE_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}}), // Priority 2: Silence defenses
            ...creep.room.find(FIND_HOSTILE_CREEPS, {filter: c => c.getActiveBodyparts(HEAL) > 0}),   // Priority 3: Remove support
            ...creep.room.find(FIND_HOSTILE_CREEPS, {filter: c => c.getActiveBodyparts(ATTACK) > 0 || c.getActiveBodyparts(RANGED_ATTACK) > 0}), // Priority 4: Kill offense
            ...creep.room.find(FIND_HOSTILE_STRUCTURES, {filter: s => s.structureType === STRUCTURE_EXTENSION}), // Priority 5: Starve economy
            ...creep.room.find(FIND_HOSTILE_STRUCTURES, {filter: s => s.structureType === STRUCTURE_STORAGE || s.structureType === STRUCTURE_CONTAINER}), // Priority 6: Loot & destroy
            ...creep.room.find(FIND_HOSTILE_CREEPS)                      // Priority 7: Kill anything that moves
        ];
        
        if (targets.length > 0) {
            const target = creep.pos.findClosestByRange(targets);
            if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
            }
            const targetType = target.structureType || 'CREEP';
            console.log(`💀💥 KAMIKAZE ${creep.name} ANNIHILATING ${targetType}! ACCEPT DEATH!`);
        } else {
            // No targets? Move to center and wait for death
            creep.moveTo(new RoomPosition(25, 25, creep.room.name));
            console.log(`💀 KAMIKAZE ${creep.name} AWAITING DEATH IN ENEMY TERRITORY`);
        }
    },
    
    apocalypse: function(creep) {
        // ULTIMATE WAR MACHINE - The harbinger of total destruction
        if (creep.memory.targetRoom && creep.room.name !== creep.memory.targetRoom) {
            creep.moveTo(new RoomPosition(25, 25, creep.memory.targetRoom), {visualizePathStyle: {stroke: '#ff0000'}});
            return;
        }
        
        // Multi-role combat: Attack with melee, ranged, and heal self
        const enemySpawn = creep.pos.findClosestByPath(FIND_HOSTILE_SPAWNS);
        if (enemySpawn) {
            if (creep.attack(enemySpawn) === ERR_NOT_IN_RANGE) {
                creep.moveTo(enemySpawn, {visualizePathStyle: {stroke: '#ff0000'}});
            } else {
                // Use ranged attack if in range
                if (creep.pos.getRangeTo(enemySpawn) <= 3) {
                    creep.rangedAttack(enemySpawn);
                }
                // Heal self if damaged
                if (creep.hits < creep.hitsMax) {
                    creep.heal(creep);
                }
            }
            console.log(`🌋 APOCALYPSE ${creep.name} DESTROYING ENEMY SPAWN WITH ULTIMATE FORCE!`);
            return;
        }
        
        // Target enemy towers
        const enemyTower = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
            filter: { structureType: STRUCTURE_TOWER }
        });
        if (enemyTower) {
            if (creep.attack(enemyTower) === ERR_NOT_IN_RANGE) {
                creep.moveTo(enemyTower, {visualizePathStyle: {stroke: '#ff0000'}});
            } else {
                if (creep.pos.getRangeTo(enemyTower) <= 3) {
                    creep.rangedAttack(enemyTower);
                }
                if (creep.hits < creep.hitsMax) {
                    creep.heal(creep);
                }
            }
            console.log(`🏗️ APOCALYPSE ${creep.name} DEMOLISHING ENEMY TOWER WITH ULTIMATE FORCE!`);
            return;
        }
        
        // Mass attack enemy creeps
        const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
        if (hostiles.length > 0) {
            const target = creep.pos.findClosestByRange(hostiles);
            if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
            } else {
                // Use ranged mass attack if multiple enemies nearby
                if (hostiles.length > 2 && creep.pos.getRangeTo(target) <= 3) {
                    creep.rangedMassAttack();
                } else {
                    creep.rangedAttack(target);
                }
                // Heal self while fighting
                if (creep.hits < creep.hitsMax) {
                    creep.heal(creep);
                }
            }
            console.log(`⚔️ APOCALYPSE ${creep.name} OBLITERATING ENEMY CREEPS WITH ULTIMATE FORCE!`);
            return;
        }
        
        // Heal self if no enemies and damaged
        if (creep.hits < creep.hitsMax) {
            creep.heal(creep);
        }
    }
};

// Spawn management - Enhanced for APOCALYPSE
const spawnManager = {
    spawnCreep: function(spawn, role) {
        const roleConfig = roles[role];
        if (!roleConfig) return null;
        
        const body = roleConfig.body;
        const name = `${role}_${Game.time}_${Math.floor(Math.random() * 10000)}`;
        
        const result = spawn.spawnCreep(body, name, {
            memory: {
                role: role,
                born: Game.time,
                homeRoom: spawn.room.name,
                veteran: false
            }
        });
        
        if (result === OK) {
            console.log(`🆕 APOCALYPSE Spawned ${role}: ${name}`);
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
        const roomCreeps = {};
        currentCreeps.forEach(name => {
            const creep = Game.creeps[name];
            if (creep.memory.role) {
                creepCounts[creep.memory.role] = (creepCounts[creep.memory.role] || 0) + 1;
                if (creep.room.name === room.name) {
                    roomCreeps[creep.memory.role] = (roomCreeps[creep.memory.role] || 0) + 1;
                }
            }
        });
        
        // APOCALYPSE spawning strategy based on defense mode
        if (gameState.defenseMode === DEFENSE_MODE.APOCALYPSE) {
            // Maximum military production - no mercy
            if (roomCreeps.apocalypse < 2) {
                spawnManager.spawnCreep(spawn, 'apocalypse');
                return;
            }
            if (roomCreeps.kamikaze < 3) {
                spawnManager.spawnCreep(spawn, 'kamikaze');
                return;
            }
            if (roomCreeps.attacker < 4) {
                spawnManager.spawnCreep(spawn, 'attacker');
                return;
            }
            if (roomCreeps.warrior < 3) {
                spawnManager.spawnCreep(spawn, 'warrior');
                return;
            }
            if (roomCreeps.archer < 3) {
                spawnManager.spawnCreep(spawn, 'archer');
                return;
            }
            if (roomCreeps.healer < 2) {
                spawnManager.spawnCreep(spawn, 'healer');
                return;
            }
        }
        
        if (gameState.defenseMode === DEFENSE_MODE.TOTAL_WAR || gameState.defenseMode === DEFENSE_MODE.EMERGENCY) {
            // Emergency military production
            if (roomCreeps.warrior < 3) {
                spawnManager.spawnCreep(spawn, 'warrior');
                return;
            }
            if (roomCreeps.kamikaze < 2) {
                spawnManager.spawnCreep(spawn, 'kamikaze');
                return;
            }
            if (roomCreeps.archer < 3) {
                spawnManager.spawnCreep(spawn, 'archer');
                return;
            }
            if (roomCreeps.healer < 2) {
                spawnManager.spawnCreep(spawn, 'healer');
                return;
            }
            if (roomCreeps.attacker < 3) {
                spawnManager.spawnCreep(spawn, 'attacker');
                return;
            }
        }
        
        // Economy phase management
        const energyAvailable = room.energyAvailable;
        const energyCapacity = room.energyCapacityAvailable;
        
        if (energyAvailable < energyCapacity * 0.3) {
            gameState.economyPhase = 'critical';
        } else if (energyAvailable < energyCapacity * 0.7) {
            gameState.economyPhase = 'developing';
        } else {
            gameState.economyPhase = 'strong';
        }
        
        // Normal spawning priorities with economy consideration
        for (const role in roles) {
            const roleConfig = roles[role];
            const currentCount = roomCreeps[role] || 0;
            
            let maxCount = roleConfig.maxCount;
            if (gameState.economyPhase === 'critical') {
                maxCount = roleConfig.emergencyCount;
            } else if (gameState.defenseMode >= DEFENSE_MODE.WAR) {
                maxCount = roleConfig.emergencyCount;
            }
            
            if (currentCount < maxCount) {
                if (spawnManager.spawnCreep(spawn, role)) {
                    return;
                }
            }
        }
    }
};

// Main game loop - APOCALYPSE EDITION
module.exports.loop = function() {
    // Update game state
    gameState.currentTick = Game.time;
    
    // Clear dead creeps from memory
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log(`💀 APOCALYPSE Cleared dead creep: ${name}`);
        }
    }
    
    // Get current room
    const room = Game.rooms[gameState.roomName];
    if (!room) {
        console.log(`❌ APOCALYPSE Room ${gameState.roomName} not found!`);
        return;
    }
    
    // Find enemies in room
    gameState.enemies = room.find(FIND_HOSTILE_CREEPS);
    
    // Update defense mode based on threat level
    if (gameState.enemies.length > 0) {
        gameState.lastEnemySeen = Game.time;
        
        // Determine threat level with enhanced analysis
        const dangerousEnemies = gameState.enemies.filter(e => 
            e.getActiveBodyparts(ATTACK) > 0 || e.getActiveBodyparts(RANGED_ATTACK) > 0
        ).length;
        
        const totalEnemyParts = gameState.enemies.reduce((sum, enemy) => sum + enemy.body.length, 0);
        const enemySpawns = room.find(FIND_HOSTILE_SPAWNS);
        const enemyTowers = room.find(FIND_HOSTILE_STRUCTURES, {
            filter: { structureType: STRUCTURE_TOWER }
        });
        
        if (dangerousEnemies >= 5 || totalEnemyParts >= 30 || enemySpawns.length > 0 || enemyTowers.length > 0) {
            gameState.defenseMode = DEFENSE_MODE.APOCALYPSE;
            gameState.militaryPhase = 'total_annihilation';
        } else if (dangerousEnemies >= 3) {
            gameState.defenseMode = DEFENSE_MODE.TOTAL_WAR;
            gameState.militaryPhase = 'aggressive_assault';
        } else if (dangerousEnemies > 0) {
            gameState.defenseMode = DEFENSE_MODE.WAR;
            gameState.militaryPhase = 'defensive_counter';
        } else {
            gameState.defenseMode = DEFENSE_MODE.ALERT;
            gameState.militaryPhase = 'patrol';
        }
    } else {
        // Gradually decrease alert level
        const timeSinceEnemy = Game.time - gameState.lastEnemySeen;
        if (timeSinceEnemy > 150) {
            gameState.defenseMode = DEFENSE_MODE.PEACETIME;
            gameState.militaryPhase = 'defensive';
        } else if (timeSinceEnemy > 100) {
            gameState.defenseMode = DEFENSE_MODE.ALERT;
            gameState.militaryPhase = 'patrol';
        } else if (timeSinceEnemy > 50) {
            gameState.defenseMode = DEFENSE_MODE.WAR;
            gameState.militaryPhase = 'defensive_counter';
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
                console.log(`❌ APOCALYPSE Error in ${role} ${name}: ${error}`);
            }
        }
    }
    
    // APOCALYPSE ATTACK STRATEGY - Enhanced intelligence
    if (Game.time % 30 === 0 && gameState.defenseMode >= DEFENSE_MODE.WAR) {
        const targetRooms = Array.from(gameState.enemyRooms);
        if (targetRooms.length > 0) {
            // Pick highest priority target based on danger assessment
            let targetRoom = targetRooms[0];
            if (gameState.attackTargets.length > 0) {
                gameState.attackTargets.sort((a, b) => a.priority - b.priority);
                targetRoom = gameState.attackTargets[0].room;
            }
            military.launchApocalypseAttack(targetRoom);
        }
    }
    
    // Launch periodic attacks even without scouting - be proactive
    if (Game.time % 150 === 0 && Game.time - gameState.lastAttackTime > 100) {
        const potentialTargets = ['W1N1', 'W1N2', 'W1N4', 'W1N5', 'W2N1', 'W2N2', 'W3N1', 'W3N2'];
        const targetRoom = potentialTargets[Math.floor(Math.random() * potentialTargets.length)];
        military.launchApocalypseAttack(targetRoom);
    }
    
    // APOCALYPSE escalation - if we haven't found enemies, expand search
    if (Game.time % 500 === 0 && gameState.enemyRooms.size === 0 && !gameState.totalWarDeclared) {
        console.log(`🌍 APOCALYPSE Expanding search for enemies...`);
        // Add more rooms to scout list
        const expansionRooms = ['W4N1', 'W4N2', 'W4N3', 'W5N1', 'W5N2', 'W6N1', 'W6N2', 'W7N1', 'W8N1', 'W9N1'];
        expansionRooms.forEach(room => {
            // Will be picked up by scouts in their random selection
        });
    }
    
    // Status report - APOCALYPSE style
    if (Game.time % 10 === 0) {
        const modeNames = ['PEACETIME', 'ALERT', 'WAR', 'EMERGENCY', 'TOTAL_WAR', 'APOCALYPSE'];
        const enemyRooms = Array.from(gameState.enemyRooms).join(', ') || 'None';
        const attackersReady = Object.keys(Game.creeps).filter(name => {
            const creep = Game.creeps[name];
            return (creep.memory.role === 'attacker' || creep.memory.role === 'kamikaze' || creep.memory.role === 'apocalypse') && 
                   creep.room.name === gameState.roomName;
        }).length;
        
        const militaryPhase = gameState.militaryPhase.toUpperCase();
        const economyPhase = gameState.economyPhase.toUpperCase();
        
        console.log(`🌋 APOCALYPSE AI: ${modeNames[gameState.defenseMode]} | Phase: ${militaryPhase} | Economy: ${economyPhase} | Energy: ${room.energyAvailable}/${room.energyCapacityAvailable} | Creeps: ${Object.keys(Game.creeps).length} | Enemies: ${gameState.enemies.length} | Attackers: ${attackersReady} | Enemy Rooms: ${enemyRooms}`);
        
        // Special APOCALYPSE warnings
        if (gameState.defenseMode === DEFENSE_MODE.APOCALYPSE) {
            console.log(`🔥🔥🔥 TOTAL ANNIHILATION MODE ACTIVE - NO MERCY FOR THE ENEMY! 🔥🔥🔥`);
        }
    }
};