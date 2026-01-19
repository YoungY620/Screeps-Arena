// CLAUDE'S ENDGAME DOMINATION - TICK 2375+ SUPREMACY
// LATE-GAME BATTLEFIELD CONTROL AND TOTAL ANNIHILATION

module.exports.loop = function () {
    // ENDGAME PROTOCOL INITIALIZATION
    if (!Memory.endgame) {
        Memory.endgame = {
            startTick: Game.time,
            phase: 'MAXIMUM_AGGRESSION',
            enemyEliminated: 0,
            basesCaptured: 0,
            totalDeaths: 0,
            warStatus: 'ACTIVE'
        };
        console.log(`🔥🔥🔥 ENDGAME DOMINATION PROTOCOL - TICK ${Game.time} - LATE GAME SUPREMACY BEGINS! 🔥🔥🔥`);
    }

    // Death tracking and memory cleanup
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            Memory.endgame.totalDeaths++;
        }
    }

    const spawns = Object.values(Game.spawns);
    if (spawns.length === 0) {
        console.log('💀 CRITICAL: ALL SPAWNS DESTROYED - EMERGENCY RESURRECTION!');
        return;
    }

    const mainSpawn = spawns[0];
    const room = mainSpawn.room;
    const gameAge = Game.time - Memory.endgame.startTick;
    
    // LATE-GAME FORCE ANALYSIS
    const creeps = Object.values(Game.creeps);
    const workers = creeps.filter(c => c.memory.role === 'worker');
    const terminators = creeps.filter(c => c.memory.role === 'terminator');
    const destroyers = creeps.filter(c => c.memory.role === 'destroyer');  
    const scouts = creeps.filter(c => c.memory.role === 'scout');
    const totalMilitary = terminators.length + destroyers.length;
    
    const towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    const extensions = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}});
    const controller = room.controller;
    
    // IMMEDIATE THREAT ASSESSMENT
    const enemies = room.find(FIND_HOSTILE_CREEPS);
    const enemyStructures = room.find(FIND_HOSTILE_STRUCTURES);
    const currentThreats = enemies.length + enemyStructures.length;
    
    console.log(`⚔️ TICK ${Game.time} | PHASE: ${Memory.endgame.phase} | T:${terminators.length} D:${destroyers.length} W:${workers.length} S:${scouts.length} | TOWERS:${towers.length} | THREATS:${currentThreats} | ENERGY:${room.energyAvailable}/${room.energyCapacityAvailable}`);

    // LATE-GAME AGGRESSIVE SPAWNING (Priority: Military > Economy)
    if (!mainSpawn.spawning) {
        executeLateGameSpawning(mainSpawn, room, workers, terminators, destroyers, scouts, currentThreats);
    }

    // LATE-GAME INFRASTRUCTURE (Max efficiency)
    if (gameAge % 25 === 0) {
        buildEndgameInfrastructure(room, mainSpawn);
    }

    // EXECUTE ALL COMBAT OPERATIONS
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        
        switch(creep.memory.role) {
            case 'worker': runEndgameWorker(creep); break;
            case 'terminator': runTerminator(creep); break;
            case 'destroyer': runDestroyer(creep); break;
            case 'scout': runEndgameScout(creep); break;
        }
    }

    // TOWER SUPREMACY GRID
    runEndgameTowers(towers, room);

    // STRATEGIC OPERATIONS EVERY 10 TICKS
    if (gameAge % 10 === 0) {
        runEndgameIntelligence();
    }

    // VICTORY ASSESSMENT
    if (gameAge % 75 === 0) {
        assessEndgameDominance();
    }
};

function executeLateGameSpawning(spawn, room, workers, terminators, destroyers, scouts, threats) {
    const energy = room.energyAvailable;
    const maxEnergy = room.energyCapacityAvailable;
    
    // EMERGENCY: If under attack, spawn maximum military
    if (threats > 0) {
        if (energy >= 700) {
            spawnUltimateDestroyer(spawn);
            return;
        } else if (energy >= 500) {
            spawnDestroyer(spawn);
            return;
        } else if (energy >= 350) {
            spawnTerminator(spawn);
            return;
        }
    }
    
    // LATE-GAME STRATEGY: 90% Military, 10% Economy
    if (workers.length < 2 && energy >= 300) {
        spawnMaxWorker(spawn);
    } else if (scouts.length < 4 && energy >= 50) {
        spawnScout(spawn);
    } else if (energy >= maxEnergy * 0.9) {
        // Use maximum energy for ultimate units
        spawnUltimateDestroyer(spawn);
    } else if (energy >= 700) {
        spawnDestroyer(spawn);
    } else if (energy >= 500) {
        spawnDestroyer(spawn);
    } else if (energy >= 350) {
        spawnTerminator(spawn);
    }
}

// LATE-GAME SPAWNING FUNCTIONS
function spawnMaxWorker(spawn) {
    const name = 'MaxWorker' + Game.time;
    const energy = spawn.room.energyAvailable;
    let body;
    
    if (energy >= 550) {
        body = [WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE];
    } else if (energy >= 400) {
        body = [WORK,WORK,WORK,CARRY,CARRY,MOVE];
    } else {
        body = [WORK,WORK,CARRY,MOVE];
    }
    
    if(spawn.spawnCreep(body, name, {memory: {role: 'worker'}}) == OK) {
        console.log(`⚡ SPAWNING MAX WORKER: ${name}`);
    }
}

function spawnTerminator(spawn) {
    const name = 'TERM' + Game.time;
    const energy = spawn.room.energyAvailable;
    let body;
    
    if (energy >= 600) {
        body = [RANGED_ATTACK,RANGED_ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE];
    } else if (energy >= 450) {
        body = [RANGED_ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE];
    } else if (energy >= 350) {
        body = [RANGED_ATTACK,ATTACK,MOVE,MOVE];
    } else {
        return;
    }
    
    if(spawn.spawnCreep(body, name, {memory: {role: 'terminator'}}) == OK) {
        console.log(`💀 SPAWNING TERMINATOR: ${name} (${body.length} parts)`);
    }
}

function spawnDestroyer(spawn) {
    const name = 'DESTROY' + Game.time;
    const energy = spawn.room.energyAvailable;
    let body;
    
    if (energy >= 950) {
        body = [TOUGH,TOUGH,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,ATTACK,ATTACK,ATTACK,HEAL,HEAL,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
    } else if (energy >= 800) {
        body = [TOUGH,RANGED_ATTACK,RANGED_ATTACK,ATTACK,ATTACK,ATTACK,HEAL,HEAL,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
    } else if (energy >= 650) {
        body = [RANGED_ATTACK,RANGED_ATTACK,ATTACK,ATTACK,HEAL,HEAL,MOVE,MOVE,MOVE,MOVE,MOVE];
    } else if (energy >= 500) {
        body = [RANGED_ATTACK,ATTACK,ATTACK,HEAL,MOVE,MOVE,MOVE,MOVE];
    } else {
        return;
    }
    
    if(spawn.spawnCreep(body, name, {memory: {role: 'destroyer'}}) == OK) {
        console.log(`🔥 SPAWNING DESTROYER: ${name} (${body.length} parts)`);
    }
}

function spawnUltimateDestroyer(spawn) {
    const name = 'ULTIMATE' + Game.time;
    const energy = spawn.room.energyAvailable;
    let body;
    
    if (energy >= 1200) {
        body = [TOUGH,TOUGH,TOUGH,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,HEAL,HEAL,HEAL,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
    } else if (energy >= 1000) {
        body = [TOUGH,TOUGH,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,ATTACK,ATTACK,ATTACK,HEAL,HEAL,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
    } else if (energy >= 800) {
        body = [TOUGH,RANGED_ATTACK,RANGED_ATTACK,ATTACK,ATTACK,HEAL,HEAL,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
    } else {
        return;
    }
    
    if(spawn.spawnCreep(body, name, {memory: {role: 'destroyer', ultimate: true}}) == OK) {
        console.log(`🌟 SPAWNING ULTIMATE DESTROYER: ${name} (${body.length} parts)`);
    }
}

function spawnScout(spawn) {
    const name = 'Scout' + Game.time;
    if(spawn.spawnCreep([MOVE], name, {memory: {role: 'scout', targetRoom: null}}) == OK) {
        console.log(`👁️ Spawning scout: ${name}`);
    }
}

// LATE-GAME BEHAVIORS
function runEndgameWorker(creep) {
    if(creep.carry.energy == 0) {
        const source = creep.pos.findClosestByPath(FIND_SOURCES);
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    } else {
        // PRIORITY: Military infrastructure first
        const criticalTargets = creep.room.find(FIND_MY_STRUCTURES, {
            filter: (s) => s.energy < s.energyCapacity && 
                          (s.structureType === STRUCTURE_SPAWN || 
                           s.structureType === STRUCTURE_TOWER)
        });
        
        const powerTargets = creep.room.find(FIND_MY_STRUCTURES, {
            filter: (s) => s.energy < s.energyCapacity && s.structureType === STRUCTURE_EXTENSION
        });
        
        const targets = [...criticalTargets, ...powerTargets];
        
        if(targets.length > 0) {
            const target = creep.pos.findClosestByPath(targets);
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            // Build critical infrastructure
            const sites = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(sites.length > 0) {
                const priority = sites.find(s => s.structureType === STRUCTURE_TOWER) ||
                               sites.find(s => s.structureType === STRUCTURE_EXTENSION) ||
                               sites[0];
                if(creep.build(priority) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(priority, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else if(creep.room.controller && creep.room.controller.level < 8) {
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
}

function runTerminator(creep) {
    // TERMINATOR PROTOCOL: Hunt and destroy
    const localEnemies = creep.room.find(FIND_HOSTILE_CREEPS);
    if (localEnemies.length > 0) {
        terminateTargets(creep, localEnemies);
        return;
    }

    const enemyStructures = creep.room.find(FIND_HOSTILE_STRUCTURES);
    if (enemyStructures.length > 0) {
        demolishStructures(creep, enemyStructures);
        return;
    }

    // Hunt in enemy territory
    if (Memory.enemyRooms && Memory.enemyRooms.length > 0) {
        const targetRoom = Memory.enemyRooms[0];
        if (creep.room.name !== targetRoom) {
            moveToEnemyRoom(creep, targetRoom);
            return;
        }
    }

    // Aggressive patrol
    terminatorPatrol(creep);
}

function runDestroyer(creep) {
    // Self-heal if damaged
    if (creep.hits < creep.hitsMax && creep.getActiveBodyparts(HEAL) > 0) {
        creep.heal(creep);
    }

    // Enhanced terminator behavior
    runTerminator(creep);
}

function runEndgameScout(creep) {
    // ENDGAME SCOUTING: Cover maximum territory
    if (!creep.memory.targetRoom) {
        const scoutZones = [
            'W1N2', 'W3N2', 'W2N1', 'W2N3',  // Adjacent
            'W1N1', 'W3N3', 'W1N3', 'W3N1',  // Diagonal
            'W0N2', 'W4N2', 'W2N0', 'W2N4',  // Extended
            'W0N1', 'W4N1', 'W1N0', 'W3N0',  // Far zones
            'W0N3', 'W4N3', 'W1N4', 'W3N4',  // Ultra zones
            'W5N2', 'W2N5', 'W0N0', 'W4N4'   // Maximum range
        ];
        creep.memory.targetRoom = scoutZones[(Game.time + creep.name.charCodeAt(0)) % scoutZones.length];
        creep.memory.scoutStart = Game.time;
    }

    if (creep.room.name !== creep.memory.targetRoom) {
        moveToEnemyRoom(creep, creep.memory.targetRoom);
    } else {
        // Intelligence gathering
        const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
        const hostileStructures = creep.room.find(FIND_HOSTILE_STRUCTURES);
        
        if (hostiles.length > 0 || hostileStructures.length > 0) {
            console.log(`🎯 ENDGAME INTEL: ${creep.room.name} - ${hostiles.length} hostiles, ${hostileStructures.length} structures - HIGH VALUE TARGET!`);
            if (!Memory.enemyRooms) Memory.enemyRooms = [];
            if (!Memory.enemyRooms.includes(creep.room.name)) {
                Memory.enemyRooms.push(creep.room.name);
                console.log(`🚨 PRIORITY TARGET: ${creep.room.name} marked for destruction!`);
            }
        }

        // Maximum coverage pattern
        if (creep.fatigue === 0) {
            const explorePaths = [
                [TOP, TOP_RIGHT, RIGHT, BOTTOM_RIGHT, BOTTOM, BOTTOM_LEFT, LEFT, TOP_LEFT],
                [TOP_LEFT, LEFT, BOTTOM_LEFT, BOTTOM, BOTTOM_RIGHT, RIGHT, TOP_RIGHT, TOP],
                [RIGHT, BOTTOM_RIGHT, BOTTOM, BOTTOM_LEFT, LEFT, TOP_LEFT, TOP, TOP_RIGHT],
                [BOTTOM, BOTTOM_LEFT, LEFT, TOP_LEFT, TOP, TOP_RIGHT, RIGHT, BOTTOM_RIGHT]
            ];
            const path = explorePaths[Math.floor(Game.time / 50) % explorePaths.length];
            creep.move(path[Game.time % path.length]);
        }
        
        // Reassign after thorough exploration
        if (Game.time - creep.memory.scoutStart > 150) {
            creep.memory.targetRoom = null;
        }
    }
}

// COMBAT FUNCTIONS
function terminateTargets(creep, enemies) {
    const target = creep.pos.findClosestByRange(enemies);
    const range = creep.pos.getRangeTo(target);
    
    // Multi-weapon engagement
    if (creep.getActiveBodyparts(RANGED_ATTACK) > 0) {
        if (range <= 3) {
            if (range === 1 && enemies.length > 1) {
                creep.rangedMassAttack();
            } else {
                creep.rangedAttack(target);
            }
        }
    }
    
    if (creep.getActiveBodyparts(ATTACK) > 0 && range === 1) {
        creep.attack(target);
    }
    
    // Advanced positioning
    if (range > 3) {
        creep.moveTo(target, {reusePath: 2, visualizePathStyle: {stroke: '#ff0000'}});
    } else if (range < 2 && creep.getActiveBodyparts(RANGED_ATTACK) > 0 && !creep.getActiveBodyparts(ATTACK)) {
        // Kiting for ranged units
        const direction = creep.pos.getDirectionTo(target);
        const oppositeDir = ((direction + 3) % 8) + 1;
        creep.move(oppositeDir);
    } else if (range > 1 && creep.getActiveBodyparts(ATTACK) > 0) {
        creep.moveTo(target, {reusePath: 1});
    }

    console.log(`⚔️ ${creep.name} TERMINATING ${target.name} at range ${range}`);
}

function demolishStructures(creep, structures) {
    const priority = structures.find(s => s.structureType === STRUCTURE_SPAWN) ||
                    structures.find(s => s.structureType === STRUCTURE_TOWER) ||
                    structures.find(s => s.structureType === STRUCTURE_EXTENSION) ||
                    structures[0];
    
    const range = creep.pos.getRangeTo(priority);
    
    if (creep.getActiveBodyparts(RANGED_ATTACK) > 0 && range <= 3) {
        creep.rangedAttack(priority);
    }
    if (creep.getActiveBodyparts(ATTACK) > 0 && range === 1) {
        creep.attack(priority);
    }
    
    if (range > 1) {
        creep.moveTo(priority, {visualizePathStyle: {stroke: '#ff0000'}});
    }
    
    console.log(`🏗️ ${creep.name} DEMOLISHING ${priority.structureType}`);
}

function moveToEnemyRoom(creep, targetRoom) {
    const exit = creep.room.findExitTo(targetRoom);
    if (exit) {
        creep.moveTo(creep.pos.findClosestByRange(exit), {
            visualizePathStyle: {stroke: '#00ff00'}
        });
    }
}

function terminatorPatrol(creep) {
    // Aggressive patrol pattern for maximum coverage
    const patrolPoints = [
        {x: 10, y: 10}, {x: 40, y: 10}, {x: 40, y: 40}, {x: 10, y: 40},
        {x: 25, y: 5}, {x: 45, y: 25}, {x: 25, y: 45}, {x: 5, y: 25}
    ];
    
    if (!creep.memory.patrolPoint) {
        creep.memory.patrolPoint = 0;
    }
    
    const target = patrolPoints[creep.memory.patrolPoint];
    if (creep.pos.getRangeTo(target.x, target.y) < 3) {
        creep.memory.patrolPoint = (creep.memory.patrolPoint + 1) % patrolPoints.length;
    }
    
    creep.moveTo(target.x, target.y, {visualizePathStyle: {stroke: '#0000ff'}});
}

// INFRASTRUCTURE FUNCTIONS
function buildEndgameInfrastructure(room, spawn) {
    const controller = room.controller;
    const sites = room.find(FIND_CONSTRUCTION_SITES);
    
    if (sites.length > 6) return; // Don't spam too many sites
    
    // Maximum towers for defense
    const towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    const maxTowers = CONTROLLER_STRUCTURES[STRUCTURE_TOWER][controller.level] || 0;
    if (towers.length < maxTowers && controller.level >= 3) {
        if (placeEndgameTower(room, spawn)) return;
    }
    
    // Maximum extensions for energy
    const extensions = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}});
    const maxExt = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][controller.level] || 0;
    if (extensions.length < maxExt) {
        placeEndgameExtension(room, spawn);
    }
}

function placeEndgameTower(room, spawn) {
    const pos = spawn.pos;
    
    // Strategic tower positions for maximum coverage
    const towerPositions = [
        {x: pos.x + 5, y: pos.y - 3}, {x: pos.x - 5, y: pos.y - 3},
        {x: pos.x + 5, y: pos.y + 3}, {x: pos.x - 5, y: pos.y + 3},
        {x: pos.x + 3, y: pos.y - 5}, {x: pos.x - 3, y: pos.y - 5},
        {x: pos.x + 3, y: pos.y + 5}, {x: pos.x - 3, y: pos.y + 5},
        {x: pos.x + 7, y: pos.y}, {x: pos.x - 7, y: pos.y},
        {x: pos.x, y: pos.y + 7}, {x: pos.x, y: pos.y - 7}
    ];
    
    for(let towerPos of towerPositions) {
        if(towerPos.x > 4 && towerPos.x < 45 && towerPos.y > 4 && towerPos.y < 45) {
            if(room.createConstructionSite(towerPos.x, towerPos.y, STRUCTURE_TOWER) === OK) {
                console.log(`🗼 PLACING ENDGAME TOWER at ${towerPos.x},${towerPos.y}`);
                return true;
            }
        }
    }
    return false;
}

function placeEndgameExtension(room, spawn) {
    const pos = spawn.pos;
    
    // Efficient grid pattern
    for(let range = 2; range <= 8; range++) {
        for(let dx = -range; dx <= range; dx++) {
            for(let dy = -range; dy <= range; dy++) {
                if(Math.abs(dx) + Math.abs(dy) !== range) continue;
                const x = pos.x + dx;
                const y = pos.y + dy;
                if(x > 3 && x < 46 && y > 3 && y < 46) {
                    if(room.createConstructionSite(x, y, STRUCTURE_EXTENSION) === OK) {
                        console.log(`⚡ PLACING ENDGAME EXTENSION at ${x},${y}`);
                        return;
                    }
                }
            }
        }
    }
}

function runEndgameTowers(towers, room) {
    for(let tower of towers) {
        const enemies = tower.pos.findInRange(FIND_HOSTILE_CREEPS, 50);
        if(enemies.length > 0) {
            // Focus fire on most dangerous target
            const target = tower.pos.findClosestByRange(enemies);
            tower.attack(target);
            console.log(`🗼 TOWER ELIMINATING ${target.name}!`);
        } else {
            // Heal critical military units
            const damaged = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: (c) => c.hits < c.hitsMax * 0.7 && 
                              (c.memory.role === 'terminator' || c.memory.role === 'destroyer')
            });
            if(damaged) {
                tower.heal(damaged);
            }
        }
    }
}

function runEndgameIntelligence() {
    if (!Memory.enemyRooms) Memory.enemyRooms = [];
    
    // Scan all visible rooms
    for(let roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        if (roomName === 'W2N2') continue; // Skip our base
        
        const hostiles = room.find(FIND_HOSTILE_CREEPS);
        const hostileStructures = room.find(FIND_HOSTILE_STRUCTURES);
        
        if (hostiles.length > 0 || hostileStructures.length > 0) {
            if (!Memory.enemyRooms.includes(roomName)) {
                Memory.enemyRooms.push(roomName);
                console.log(`📍 ENDGAME INTEL: Enemy stronghold at ${roomName} - ${hostiles.length} units, ${hostileStructures.length} structures`);
            }
        }
    }
    
    // Clean up eliminated targets
    if (Game.time % 300 === 0) {
        Memory.enemyRooms = Memory.enemyRooms.filter(roomName => {
            const room = Game.rooms[roomName];
            if (room) {
                const stillHostile = room.find(FIND_HOSTILE_CREEPS).length > 0 || 
                                   room.find(FIND_HOSTILE_STRUCTURES).length > 0;
                if (!stillHostile) {
                    console.log(`🏆 ENDGAME VICTORY: ${roomName} completely eliminated!`);
                    Memory.endgame.basesCaptured++;
                }
                return stillHostile;
            }
            return true;
        });
    }
}

function assessEndgameDominance() {
    const totalMilitary = Object.values(Game.creeps).filter(c => 
        c.memory.role === 'terminator' || c.memory.role === 'destroyer'
    ).length;
    
    const enemyBases = Memory.enemyRooms ? Memory.enemyRooms.length : 0;
    const gameAge = Game.time - Memory.endgame.startTick;
    const towerCount = Object.values(Game.structures).filter(s => s.structureType === STRUCTURE_TOWER).length;
    
    console.log(`👑 ENDGAME DOMINANCE ASSESSMENT:`);
    console.log(`   Military Force: ${totalMilitary} units`);
    console.log(`   Enemy Bases Remaining: ${enemyBases}`);
    console.log(`   Bases Eliminated: ${Memory.endgame.basesCaptured}`);
    console.log(`   Tower Network: ${towerCount} towers`);
    console.log(`   Game Age: ${gameAge} ticks`);
    console.log(`   Total Losses: ${Memory.endgame.totalDeaths}`);
    
    if (enemyBases === 0 && totalMilitary >= 10 && gameAge > 200) {
        console.log('🌟🌟🌟 TOTAL ENDGAME VICTORY - ALL ENEMIES ELIMINATED! 🌟🌟🌟');
        Memory.endgame.warStatus = 'TOTAL_VICTORY';
    } else if (totalMilitary >= 20 && towerCount >= 5) {
        console.log('🔥🔥🔥 OVERWHELMING ENDGAME SUPREMACY - RESISTANCE IS FUTILE! 🔥🔥🔥');
    } else if (totalMilitary >= 15) {
        console.log('⚡⚡⚡ MASSIVE MILITARY FORCE - DOMINATION IMMINENT! ⚡⚡⚡');
    }
}