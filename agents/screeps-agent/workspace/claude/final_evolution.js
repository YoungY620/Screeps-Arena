// CLAUDE'S FINAL EVOLUTION - THE APEX PREDATOR AI
// TICK 315+ OPTIMIZED FOR MAXIMUM DESTRUCTION

module.exports.loop = function () {
    // APEX PREDATOR INITIALIZATION
    if (!Memory.apex) {
        Memory.apex = {
            startTick: Game.time,
            phase: 'BLITZ_ECONOMY',
            killCount: 0,
            enemyRooms: [],
            lastEnemyContact: null,
            strategy: 'TOTAL_WAR'
        };
        console.log(`🔥 APEX PREDATOR ONLINE - TICK ${Game.time} - BEGINNING TOTAL ANNIHILATION! 🔥`);
    }

    // Memory cleanup with kill tracking
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            if(Memory.creeps[name].role !== 'worker') {
                Memory.apex.killCount++;
                console.log(`💀 Unit lost: ${name} (Total losses: ${Memory.apex.killCount})`);
            }
            delete Memory.creeps[name];
        }
    }

    const spawns = Object.values(Game.spawns);
    if (spawns.length === 0) {
        console.log('🚨 CRITICAL: ALL SPAWNS DESTROYED - EMERGENCY PROTOCOLS ACTIVE!');
        return;
    }

    const mainSpawn = spawns[0];
    const room = mainSpawn.room;
    const gameAge = Game.time - Memory.apex.startTick;
    
    // COMPREHENSIVE BATTLEFIELD ANALYSIS
    const creeps = Object.values(Game.creeps);
    const workers = creeps.filter(c => c.memory.role === 'worker');
    const killers = creeps.filter(c => c.memory.role === 'killer');
    const destroyers = creeps.filter(c => c.memory.role === 'destroyer');
    const scouts = creeps.filter(c => c.memory.role === 'scout');
    const totalMilitary = killers.length + destroyers.length;
    
    const towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    const extensions = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}});
    
    // THREAT DETECTION
    const enemies = room.find(FIND_HOSTILE_CREEPS);
    const enemyStructures = room.find(FIND_HOSTILE_STRUCTURES);
    const immediateThreats = enemies.length + enemyStructures.length;
    
    // Update enemy contact tracking
    if (immediateThreats > 0) {
        Memory.apex.lastEnemyContact = Game.time;
        if (Memory.apex.phase !== 'ACTIVE_COMBAT') {
            Memory.apex.phase = 'ACTIVE_COMBAT';
            console.log('🚨 ENEMY CONTACT - SWITCHING TO COMBAT MODE!');
        }
    }
    
    // DYNAMIC PHASE MANAGEMENT
    updateBattlePhase(gameAge, totalMilitary, immediateThreats);

    console.log(`⚔️ TICK ${Game.time} | PHASE: ${Memory.apex.phase} | K:${killers.length} D:${destroyers.length} W:${workers.length} S:${scouts.length} T:${towers.length} | THREATS:${immediateThreats} | ENERGY:${room.energyAvailable}/${room.energyCapacityAvailable}`);

    // AGGRESSIVE SPAWNING PROTOCOL
    if (!mainSpawn.spawning) {
        executeSupremacySpawning(mainSpawn, room, workers, killers, destroyers, scouts, immediateThreats);
    }

    // INFRASTRUCTURE WARFARE
    if (gameAge % 15 === 0) {
        buildWarInfrastructure(room, mainSpawn);
    }

    // EXECUTE ALL COMBAT ROLES
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        
        switch(creep.memory.role) {
            case 'worker': runEconomyUnit(creep); break;
            case 'killer': runKillerUnit(creep); break;
            case 'destroyer': runDestroyerUnit(creep); break;
            case 'scout': runScoutUnit(creep); break;
        }
    }

    // TOWER SUPREMACY
    runTowerSupremacy(towers, room);

    // STRATEGIC OPERATIONS
    if (gameAge % 10 === 0) {
        runStrategicOperations();
    }

    // VICTORY ASSESSMENT
    if (gameAge % 50 === 0) {
        assessDominance();
    }
};

function updateBattlePhase(gameAge, military, threats) {
    if (threats > 0) {
        Memory.apex.phase = 'ACTIVE_COMBAT';
    } else if (gameAge < 300 && military < 3) {
        Memory.apex.phase = 'BLITZ_ECONOMY';
    } else if (military >= 3 && military < 8) {
        Memory.apex.phase = 'MILITARY_BUILDUP';
    } else if (military >= 8) {
        Memory.apex.phase = 'TOTAL_DOMINANCE';
    } else {
        Memory.apex.phase = 'CONSOLIDATION';
    }
}

function executeSupremacySpawning(spawn, room, workers, killers, destroyers, scouts, threats) {
    const phase = Memory.apex.phase;
    const energy = room.energyAvailable;
    
    // EMERGENCY COMBAT SPAWNING
    if (threats > 0 && energy >= 260) {
        if (killers.length < threats * 2) {
            spawnKiller(spawn);
            return;
        }
    }
    
    switch(phase) {
        case 'BLITZ_ECONOMY':
            if (workers.length < 2 && energy >= 200) {
                spawnWorker(spawn);
            } else if (scouts.length < 2 && energy >= 50) {
                spawnScout(spawn);
            } else if (energy >= 300) {
                spawnKiller(spawn);
            }
            break;
            
        case 'MILITARY_BUILDUP':
            if (scouts.length < 3 && energy >= 50) {
                spawnScout(spawn);
            } else if (killers.length < 5 && energy >= 300) {
                spawnKiller(spawn);
            } else if (energy >= 450) {
                spawnDestroyer(spawn);
            }
            break;
            
        case 'TOTAL_DOMINANCE':
            if (energy >= 500) {
                spawnDestroyer(spawn);
            } else if (energy >= 300) {
                spawnKiller(spawn);
            }
            break;
            
        case 'ACTIVE_COMBAT':
            if (energy >= 450) {
                spawnDestroyer(spawn);
            } else if (energy >= 300) {
                spawnKiller(spawn);
            } else if (energy >= 200 && workers.length === 0) {
                spawnWorker(spawn);
            }
            break;
            
        case 'CONSOLIDATION':
            if (workers.length < 3 && energy >= 200) {
                spawnWorker(spawn);
            } else if (energy >= 300) {
                spawnKiller(spawn);
            }
            break;
    }
}

// SPAWNING FUNCTIONS - ULTIMATE UNITS
function spawnWorker(spawn) {
    const name = 'Worker' + Game.time;
    const body = spawn.room.energyAvailable >= 300 ? 
        [WORK,WORK,CARRY,MOVE] : [WORK,CARRY,MOVE];
    
    if(spawn.spawnCreep(body, name, {memory: {role: 'worker'}}) == OK) {
        console.log(`⚡ Spawning worker: ${name}`);
    }
}

function spawnKiller(spawn) {
    const name = 'KILL' + Game.time;
    const energy = spawn.room.energyAvailable;
    let body;
    
    if (energy >= 500) {
        body = [RANGED_ATTACK,RANGED_ATTACK,ATTACK,MOVE,MOVE,MOVE];
    } else if (energy >= 400) {
        body = [RANGED_ATTACK,ATTACK,MOVE,MOVE];
    } else if (energy >= 300) {
        body = [RANGED_ATTACK,MOVE,MOVE];
    } else {
        return; // Not enough energy
    }
    
    if(spawn.spawnCreep(body, name, {memory: {role: 'killer'}}) == OK) {
        console.log(`💀 SPAWNING KILLER: ${name} (${body.length} parts)`);
    }
}

function spawnDestroyer(spawn) {
    const name = 'DESTROY' + Game.time;
    const energy = spawn.room.energyAvailable;
    let body;
    
    if (energy >= 700) {
        body = [RANGED_ATTACK,RANGED_ATTACK,ATTACK,ATTACK,HEAL,MOVE,MOVE,MOVE,MOVE];
    } else if (energy >= 600) {
        body = [RANGED_ATTACK,ATTACK,ATTACK,HEAL,MOVE,MOVE,MOVE];
    } else if (energy >= 500) {
        body = [RANGED_ATTACK,ATTACK,HEAL,MOVE,MOVE];
    } else if (energy >= 450) {
        body = [RANGED_ATTACK,ATTACK,MOVE,MOVE];
    } else {
        return;
    }
    
    if(spawn.spawnCreep(body, name, {memory: {role: 'destroyer'}}) == OK) {
        console.log(`🔥 SPAWNING DESTROYER: ${name} (${body.length} parts)`);
    }
}

function spawnScout(spawn) {
    const name = 'Scout' + Game.time;
    if(spawn.spawnCreep([MOVE], name, {memory: {role: 'scout', targetRoom: null}}) == OK) {
        console.log(`👁️ Spawning scout: ${name}`);
    }
}

// UNIT BEHAVIORS - APEX PREDATOR TACTICS
function runEconomyUnit(creep) {
    if(creep.carry.energy == 0) {
        const source = creep.pos.findClosestByPath(FIND_SOURCES);
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    } else {
        // War economy priorities
        const targets = creep.room.find(FIND_MY_STRUCTURES, {
            filter: (s) => s.energy < s.energyCapacity && 
                          (s.structureType === STRUCTURE_SPAWN || 
                           s.structureType === STRUCTURE_EXTENSION ||
                           s.structureType === STRUCTURE_TOWER)
        });
        
        if(targets.length > 0) {
            const target = creep.pos.findClosestByPath(targets);
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
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

function runKillerUnit(creep) {
    // Priority 1: Hunt enemies in current room
    const localEnemies = creep.room.find(FIND_HOSTILE_CREEPS);
    if (localEnemies.length > 0) {
        engageTargets(creep, localEnemies);
        return;
    }

    // Priority 2: Attack enemy structures
    const enemyStructures = creep.room.find(FIND_HOSTILE_STRUCTURES);
    if (enemyStructures.length > 0) {
        destroyStructures(creep, enemyStructures);
        return;
    }

    // Priority 3: Move to known enemy rooms
    if (Memory.apex.enemyRooms.length > 0) {
        const targetRoom = Memory.apex.enemyRooms[0];
        if (creep.room.name !== targetRoom) {
            moveToRoom(creep, targetRoom);
            return;
        }
    }

    // Priority 4: Patrol aggressively
    aggressivePatrol(creep);
}

function runDestroyerUnit(creep) {
    // Self-heal if damaged
    if (creep.hits < creep.hitsMax && creep.getActiveBodyparts(HEAL) > 0) {
        creep.heal(creep);
    }

    // Same targeting as killer but with enhanced survivability
    runKillerUnit(creep);
}

function runScoutUnit(creep) {
    // Assign scouting target
    if (!creep.memory.targetRoom) {
        const scoutTargets = [
            'W1N2', 'W3N2', 'W2N1', 'W2N3',  // Adjacent
            'W1N1', 'W3N3', 'W1N3', 'W3N1',  // Diagonal
            'W0N2', 'W4N2', 'W2N0', 'W2N4',  // Extended
            'W1N4', 'W3N4', 'W4N1', 'W4N3'   // Far recon
        ];
        creep.memory.targetRoom = scoutTargets[Game.time % scoutTargets.length];
        creep.memory.scoutStartTime = Game.time;
    }

    if (creep.room.name !== creep.memory.targetRoom) {
        moveToRoom(creep, creep.memory.targetRoom);
    } else {
        // Intelligence gathering
        const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
        const enemyStructures = creep.room.find(FIND_HOSTILE_STRUCTURES);
        
        if (enemies.length > 0 || enemyStructures.length > 0) {
            console.log(`🎯 INTEL: ${creep.room.name} - ${enemies.length} hostiles, ${enemyStructures.length} structures`);
            if (!Memory.apex.enemyRooms.includes(creep.room.name)) {
                Memory.apex.enemyRooms.push(creep.room.name);
                console.log(`🚨 NEW TARGET: ${creep.room.name} added to destruction list!`);
            }
        }

        // Thorough room exploration
        if (creep.fatigue === 0) {
            const directions = [TOP, TOP_RIGHT, RIGHT, BOTTOM_RIGHT, BOTTOM, BOTTOM_LEFT, LEFT, TOP_LEFT];
            creep.move(directions[Game.time % directions.length]);
        }
        
        // Reassign scout after thorough exploration
        if (Game.time - creep.memory.scoutStartTime > 100) {
            creep.memory.targetRoom = null;
        }
    }
}

// COMBAT HELPER FUNCTIONS
function engageTargets(creep, enemies) {
    const target = creep.pos.findClosestByRange(enemies);
    const range = creep.pos.getRangeTo(target);
    
    // Multi-weapon engagement
    if (creep.getActiveBodyparts(RANGED_ATTACK) > 0) {
        if (range <= 3) {
            if (range === 1) {
                creep.rangedMassAttack();
            } else {
                creep.rangedAttack(target);
            }
        }
    }
    
    if (creep.getActiveBodyparts(ATTACK) > 0 && range === 1) {
        creep.attack(target);
    }
    
    // Tactical positioning
    if (range > 3) {
        creep.moveTo(target, {reusePath: 3, visualizePathStyle: {stroke: '#ff0000'}});
    } else if (range < 2 && creep.getActiveBodyparts(RANGED_ATTACK) > 0) {
        // Kiting tactics
        const direction = creep.pos.getDirectionTo(target);
        const oppositeDir = ((direction + 3) % 8) + 1;
        creep.move(oppositeDir);
    } else if (range > 1 && creep.getActiveBodyparts(ATTACK) > 0) {
        creep.moveTo(target, {reusePath: 2});
    }

    console.log(`⚔️ ${creep.name} engaging ${target.name} at range ${range}`);
}

function destroyStructures(creep, structures) {
    // Prioritize high-value targets
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
    
    console.log(`🏗️ ${creep.name} destroying ${priority.structureType}`);
}

function moveToRoom(creep, targetRoom) {
    const exit = creep.room.findExitTo(targetRoom);
    if (exit) {
        creep.moveTo(creep.pos.findClosestByRange(exit), {
            visualizePathStyle: {stroke: '#00ff00'}
        });
    }
}

function aggressivePatrol(creep) {
    // Edge patrol for room coverage
    if (creep.pos.x === 0 || creep.pos.x === 49 || creep.pos.y === 0 || creep.pos.y === 49) {
        creep.move(Math.floor(Math.random() * 8) + 1);
    } else {
        // Move toward edges for patrol
        const directions = [TOP, RIGHT, BOTTOM, LEFT];
        const targetDir = directions[Math.floor(creep.pos.x + creep.pos.y) % 4];
        creep.move(targetDir);
    }
}

// INFRASTRUCTURE FUNCTIONS
function buildWarInfrastructure(room, spawn) {
    const controller = room.controller;
    const sites = room.find(FIND_CONSTRUCTION_SITES);
    
    if (sites.length > 3) return; // Don't spam sites
    
    // Critical Priority: Towers
    const towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    if (towers.length < 3 && controller.level >= 3) {
        if (placeTower(room, spawn)) return;
    }
    
    // Economic Priority: Extensions
    const extensions = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}});
    const maxExt = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][controller.level] || 0;
    if (extensions.length < Math.min(maxExt, 10)) {
        placeExtension(room, spawn);
    }
}

function placeTower(room, spawn) {
    const pos = spawn.pos;
    for(let range = 3; range <= 7; range++) {
        for(let dx = -range; dx <= range; dx++) {
            for(let dy = -range; dy <= range; dy++) {
                if(Math.abs(dx) + Math.abs(dy) !== range) continue;
                const x = pos.x + dx;
                const y = pos.y + dy;
                if(x > 3 && x < 46 && y > 3 && y < 46) {
                    if(room.createConstructionSite(x, y, STRUCTURE_TOWER) === OK) {
                        console.log(`🗼 Placing tower at ${x},${y}`);
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

function placeExtension(room, spawn) {
    const pos = spawn.pos;
    for(let dx = -5; dx <= 5; dx++) {
        for(let dy = -5; dy <= 5; dy++) {
            if(dx === 0 && dy === 0) continue;
            const x = pos.x + dx;
            const y = pos.y + dy;
            if(x > 2 && x < 47 && y > 2 && y < 47) {
                if(room.createConstructionSite(x, y, STRUCTURE_EXTENSION) === OK) {
                    console.log(`⚡ Placing extension at ${x},${y}`);
                    return;
                }
            }
        }
    }
}

function runTowerSupremacy(towers, room) {
    for(let tower of towers) {
        const enemies = tower.pos.findInRange(FIND_HOSTILE_CREEPS, 50);
        if(enemies.length > 0) {
            // Focus fire on closest enemy
            const target = tower.pos.findClosestByRange(enemies);
            tower.attack(target);
            console.log(`🗼 Tower focusing ${target.name}!`);
        } else {
            // Heal damaged military units first
            const damaged = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: (c) => c.hits < c.hitsMax && (c.memory.role === 'killer' || c.memory.role === 'destroyer')
            });
            if(damaged) {
                tower.heal(damaged);
            }
        }
    }
}

function runStrategicOperations() {
    if (!Memory.apex.enemyRooms) Memory.apex.enemyRooms = [];
    
    // Scan all visible rooms for intelligence
    for(let roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        const enemies = room.find(FIND_HOSTILE_CREEPS);
        const enemyStructures = room.find(FIND_HOSTILE_STRUCTURES);
        
        if ((enemies.length > 0 || enemyStructures.length > 0) && roomName !== 'W2N2') {
            if (!Memory.apex.enemyRooms.includes(roomName)) {
                Memory.apex.enemyRooms.push(roomName);
                console.log(`📍 Strategic intel: New enemy base at ${roomName}`);
            }
        }
    }
    
    // Clean up conquered territories
    if (Game.time % 300 === 0) {
        Memory.apex.enemyRooms = Memory.apex.enemyRooms.filter(roomName => {
            const room = Game.rooms[roomName];
            if (room) {
                const hasEnemies = room.find(FIND_HOSTILE_CREEPS).length > 0 || 
                                 room.find(FIND_HOSTILE_STRUCTURES).length > 0;
                if (!hasEnemies) {
                    console.log(`🏆 CONQUEST COMPLETE: ${roomName} eliminated!`);
                }
                return hasEnemies;
            }
            return true; // Keep if not visible
        });
    }
}

function assessDominance() {
    const totalMilitary = Object.values(Game.creeps).filter(c => 
        c.memory.role === 'killer' || c.memory.role === 'destroyer'
    ).length;
    
    const knownEnemies = Memory.apex.enemyRooms.length;
    const gameAge = Game.time - Memory.apex.startTick;
    
    console.log(`🏆 DOMINANCE REPORT: Military:${totalMilitary} | Enemy Bases:${knownEnemies} | Age:${gameAge} | Losses:${Memory.apex.killCount}`);
    
    if (knownEnemies === 0 && totalMilitary >= 5 && gameAge > 500) {
        console.log('👑 TOTAL SUPREMACY ACHIEVED - THE ARENA IS MINE! 👑');
        Memory.apex.strategy = 'VICTORY_PATROL';
    } else if (totalMilitary >= 10) {
        console.log('🔥 OVERWHELMING FORCE - CRUSHING ALL OPPOSITION! 🔥');
    }
}