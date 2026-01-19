// CLAUDE'S WAR MACHINE - TOTAL BATTLEFIELD DOMINATION
// KILL OR BE KILLED - NO SURVIVORS

module.exports.loop = function () {
    // WAR MACHINE INITIALIZATION
    if (!Memory.warMachine) {
        Memory.warMachine = {
            gameStart: Game.time,
            killCount: 0,
            enemiesDestroyed: 0,
            victoriesAchieved: 0,
            currentPhase: 'RAPID_EXPANSION'
        };
        console.log('🔥 WAR MACHINE ONLINE - PREPARE FOR ANNIHILATION! 🔥');
    }

    // Memory management
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            if(Memory.creeps[name].role !== 'worker') {
                Memory.warMachine.killCount++;
            }
            delete Memory.creeps[name];
        }
    }

    const spawns = Object.values(Game.spawns);
    if (spawns.length === 0) {
        console.log('💀 ALL SPAWNS DESTROYED - INITIATE EMERGENCY PROTOCOLS!');
        return;
    }

    const mainSpawn = spawns[0];
    const room = mainSpawn.room;
    const gameTime = Game.time;
    
    // BATTLEFIELD ANALYSIS
    const creeps = Object.values(Game.creeps);
    const workers = creeps.filter(c => c.memory.role === 'worker');
    const destroyers = creeps.filter(c => c.memory.role === 'destroyer');
    const annihilators = creeps.filter(c => c.memory.role === 'annihilator');
    const scouts = creeps.filter(c => c.memory.role === 'scout');
    
    const towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    const extensions = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}});
    
    // ENEMY DETECTION
    const enemies = room.find(FIND_HOSTILE_CREEPS);
    const enemyStructures = room.find(FIND_HOSTILE_STRUCTURES);
    const totalEnemyThreat = enemies.length + enemyStructures.length;
    
    console.log(`⚔️ TICK ${gameTime}: D:${destroyers.length} A:${annihilators.length} W:${workers.length} S:${scouts.length} T:${towers.length} | ENEMIES:${totalEnemyThreat} | E:${room.energyAvailable}/${room.energyCapacityAvailable}`);

    // DYNAMIC PHASE MANAGEMENT
    updateBattlePhase(room, creeps, totalEnemyThreat);

    // AGGRESSIVE SPAWNING PROTOCOL
    if (!mainSpawn.spawning) {
        executeSpawningStrategy(mainSpawn, room, workers, destroyers, annihilators, scouts, enemies.length);
    }

    // BUILD WAR INFRASTRUCTURE
    if (gameTime % 10 === 0) {
        buildWarInfrastructure(room, mainSpawn);
    }

    // EXECUTE COMBAT OPERATIONS
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        
        switch(creep.memory.role) {
            case 'worker': runWorker(creep); break;
            case 'destroyer': runDestroyer(creep); break;
            case 'annihilator': runAnnihilator(creep); break;
            case 'scout': runScout(creep); break;
        }
    }

    // TOWER WARFARE
    runTowerWarfare(towers, room);

    // INTELLIGENCE OPERATIONS
    if (gameTime % 5 === 0) {
        runIntelligenceOperations();
    }

    // VICTORY CONDITIONS CHECK
    checkVictoryConditions();
};

function updateBattlePhase(room, creeps, enemyThreat) {
    const gameAge = Game.time - Memory.warMachine.gameStart;
    const militaryForce = creeps.filter(c => c.memory.role === 'destroyer' || c.memory.role === 'annihilator').length;
    
    if (enemyThreat > 0) {
        Memory.warMachine.currentPhase = 'ACTIVE_COMBAT';
    } else if (gameAge < 500 && militaryForce < 5) {
        Memory.warMachine.currentPhase = 'RAPID_EXPANSION';
    } else if (militaryForce >= 5) {
        Memory.warMachine.currentPhase = 'SEEK_AND_DESTROY';
    } else {
        Memory.warMachine.currentPhase = 'FORTIFICATION';
    }
}

function executeSpawningStrategy(spawn, room, workers, destroyers, annihilators, scouts, enemyCount) {
    const phase = Memory.warMachine.currentPhase;
    const energy = room.energyAvailable;
    
    // EMERGENCY: If enemies present, spawn military immediately
    if (enemyCount > 0 && energy >= 300) {
        if (destroyers.length < 2) {
            spawnDestroyer(spawn);
        } else {
            spawnAnnihilator(spawn);
        }
        return;
    }
    
    switch(phase) {
        case 'RAPID_EXPANSION':
            if (workers.length < 2 && energy >= 200) {
                spawnWorker(spawn);
            } else if (scouts.length < 2 && energy >= 50) {
                spawnScout(spawn);
            } else if (energy >= 300) {
                spawnDestroyer(spawn);
            }
            break;
            
        case 'SEEK_AND_DESTROY':
            if (scouts.length < 4 && energy >= 50) {
                spawnScout(spawn);
            } else if (energy >= 400) {
                spawnAnnihilator(spawn);
            } else if (energy >= 300) {
                spawnDestroyer(spawn);
            }
            break;
            
        case 'ACTIVE_COMBAT':
            if (energy >= 400) {
                spawnAnnihilator(spawn);
            } else if (energy >= 300) {
                spawnDestroyer(spawn);
            }
            break;
            
        case 'FORTIFICATION':
            if (workers.length < 3 && energy >= 200) {
                spawnWorker(spawn);
            } else if (energy >= 300) {
                spawnDestroyer(spawn);
            }
            break;
    }
}

// SPAWNING FUNCTIONS
function spawnWorker(spawn) {
    const name = 'W' + Game.time;
    const body = [WORK,WORK,CARRY,MOVE];
    if(spawn.spawnCreep(body, name, {memory: {role: 'worker'}}) == OK) {
        console.log('Spawning worker: ' + name);
    }
}

function spawnDestroyer(spawn) {
    const name = 'KILL' + Game.time;
    const energy = spawn.room.energyAvailable;
    let body;
    
    if (energy >= 500) {
        body = [ATTACK,ATTACK,RANGED_ATTACK,MOVE,MOVE,MOVE];
    } else if (energy >= 400) {
        body = [ATTACK,RANGED_ATTACK,MOVE,MOVE];
    } else {
        body = [RANGED_ATTACK,ATTACK,MOVE];
    }
    
    if(spawn.spawnCreep(body, name, {memory: {role: 'destroyer'}}) == OK) {
        console.log('💀 SPAWNING DESTROYER: ' + name);
    }
}

function spawnAnnihilator(spawn) {
    const name = 'DEATH' + Game.time;
    const energy = spawn.room.energyAvailable;
    let body;
    
    if (energy >= 700) {
        body = [RANGED_ATTACK,RANGED_ATTACK,ATTACK,ATTACK,HEAL,MOVE,MOVE,MOVE,MOVE];
    } else if (energy >= 600) {
        body = [RANGED_ATTACK,ATTACK,ATTACK,HEAL,MOVE,MOVE,MOVE];
    } else if (energy >= 500) {
        body = [RANGED_ATTACK,ATTACK,HEAL,MOVE,MOVE];
    } else {
        body = [RANGED_ATTACK,ATTACK,MOVE,MOVE];
    }
    
    if(spawn.spawnCreep(body, name, {memory: {role: 'annihilator'}}) == OK) {
        console.log('🔥 SPAWNING ANNIHILATOR: ' + name);
    }
}

function spawnScout(spawn) {
    const name = 'S' + Game.time;
    if(spawn.spawnCreep([MOVE], name, {memory: {role: 'scout', targetRoom: null}}) == OK) {
        console.log('Spawning scout: ' + name);
    }
}

// COMBAT AI FUNCTIONS
function runWorker(creep) {
    if(creep.carry.energy == 0) {
        const source = creep.pos.findClosestByPath(FIND_SOURCES);
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    } else {
        // Priority: Spawn > Extensions > Towers > Build > Upgrade
        const targets = creep.room.find(FIND_MY_STRUCTURES, {
            filter: (s) => s.energy < s.energyCapacity
        });
        
        if(targets.length > 0) {
            const target = creep.pos.findClosestByPath(targets);
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            const sites = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(sites.length > 0) {
                if(creep.build(sites[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sites[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else if(creep.room.controller) {
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
}

function runDestroyer(creep) {
    // Hunt enemies in current room first
    const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
    if (enemies.length > 0) {
        engageEnemy(creep, enemies);
        return;
    }

    // Attack enemy structures
    const enemyStructures = creep.room.find(FIND_HOSTILE_STRUCTURES);
    if (enemyStructures.length > 0) {
        attackStructure(creep, enemyStructures);
        return;
    }

    // Move to enemy rooms if known
    const targetRooms = Memory.enemyRooms || [];
    if (targetRooms.length > 0) {
        const targetRoom = targetRooms[0];
        if (creep.room.name !== targetRoom) {
            const exit = creep.room.findExitTo(targetRoom);
            if (exit) {
                creep.moveTo(creep.pos.findClosestByRange(exit));
                return;
            }
        }
    }

    // Patrol if nothing else to do
    patrolRoom(creep);
}

function runAnnihilator(creep) {
    // Self-heal first if damaged
    if (creep.hits < creep.hitsMax && creep.getActiveBodyparts(HEAL) > 0) {
        creep.heal(creep);
    }

    // Same targeting as destroyer but with healing
    const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
    if (enemies.length > 0) {
        engageEnemy(creep, enemies);
        return;
    }

    const enemyStructures = creep.room.find(FIND_HOSTILE_STRUCTURES);
    if (enemyStructures.length > 0) {
        attackStructure(creep, enemyStructures);
        return;
    }

    // Move to combat zones
    const targetRooms = Memory.enemyRooms || [];
    if (targetRooms.length > 0) {
        const targetRoom = targetRooms[0];
        if (creep.room.name !== targetRoom) {
            const exit = creep.room.findExitTo(targetRoom);
            if (exit) {
                creep.moveTo(creep.pos.findClosestByRange(exit));
                return;
            }
        }
    }

    patrolRoom(creep);
}

function runScout(creep) {
    if (!creep.memory.targetRoom) {
        const scoutRooms = [
            'W1N2', 'W3N2', 'W2N1', 'W2N3',  // Adjacent
            'W1N1', 'W3N3', 'W1N3', 'W3N1',  // Diagonal  
            'W0N2', 'W4N2', 'W2N0', 'W2N4'   // Extended
        ];
        creep.memory.targetRoom = scoutRooms[Game.time % scoutRooms.length];
    }

    if (creep.room.name !== creep.memory.targetRoom) {
        const exit = creep.room.findExitTo(creep.memory.targetRoom);
        if (exit) {
            creep.moveTo(creep.pos.findClosestByRange(exit));
        }
    } else {
        // Intelligence gathering
        const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
        const enemyStructures = creep.room.find(FIND_HOSTILE_STRUCTURES);
        
        if (enemies.length > 0 || enemyStructures.length > 0) {
            console.log(`🚨 SCOUT REPORT: ${creep.room.name} - ${enemies.length} enemies, ${enemyStructures.length} structures`);
            if (!Memory.enemyRooms) Memory.enemyRooms = [];
            if (!Memory.enemyRooms.includes(creep.room.name)) {
                Memory.enemyRooms.push(creep.room.name);
                console.log(`🎯 TARGET ACQUIRED: ${creep.room.name}`);
            }
        }

        // Random movement for full room coverage
        creep.move(Math.floor(Math.random() * 8) + 1);
        
        // Reassign after thorough scouting
        if (Game.time % 150 === 0) {
            creep.memory.targetRoom = null;
        }
    }
}

// COMBAT HELPER FUNCTIONS
function engageEnemy(creep, enemies) {
    const target = creep.pos.findClosestByRange(enemies);
    const range = creep.pos.getRangeTo(target);
    
    // Multi-attack coordination
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
    
    // Smart positioning
    if (range > 3) {
        creep.moveTo(target, {reusePath: 2});
    } else if (range < 2 && creep.getActiveBodyparts(RANGED_ATTACK) > 0) {
        // Kiting
        const direction = creep.pos.getDirectionTo(target);
        const oppositeDir = ((direction + 3) % 8) + 1;
        creep.move(oppositeDir);
    } else if (range > 1 && creep.getActiveBodyparts(ATTACK) > 0) {
        creep.moveTo(target);
    }

    console.log(`⚔️ ${creep.name} engaging ${target.name} at range ${range}`);
}

function attackStructure(creep, structures) {
    const priority = structures.find(s => s.structureType === STRUCTURE_SPAWN) ||
                    structures.find(s => s.structureType === STRUCTURE_TOWER) ||
                    structures[0];
    
    const range = creep.pos.getRangeTo(priority);
    
    if (creep.getActiveBodyparts(RANGED_ATTACK) > 0 && range <= 3) {
        creep.rangedAttack(priority);
    }
    if (creep.getActiveBodyparts(ATTACK) > 0 && range === 1) {
        creep.attack(priority);
    }
    
    if (range > 1) {
        creep.moveTo(priority);
    }
    
    console.log(`🏗️ ${creep.name} destroying ${priority.structureType}`);
}

function patrolRoom(creep) {
    // Random patrol pattern
    if (creep.fatigue === 0) {
        creep.move(Math.floor(Math.random() * 8) + 1);
    }
}

// INFRASTRUCTURE FUNCTIONS
function buildWarInfrastructure(room, spawn) {
    const controller = room.controller;
    const sites = room.find(FIND_CONSTRUCTION_SITES);
    
    if (sites.length > 2) return; // Don't spam construction
    
    // Priority 1: Towers
    const towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    if (towers.length === 0 && controller.level >= 3) {
        placeTower(room, spawn);
        return;
    }
    
    // Priority 2: Extensions
    const extensions = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}});
    const maxExt = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][controller.level] || 0;
    if (extensions.length < Math.min(maxExt, 10)) {
        placeExtension(room, spawn);
    }
}

function placeTower(room, spawn) {
    const pos = spawn.pos;
    for(let range = 3; range <= 6; range++) {
        for(let dx = -range; dx <= range; dx++) {
            for(let dy = -range; dy <= range; dy++) {
                if(Math.abs(dx) + Math.abs(dy) !== range) continue;
                const x = pos.x + dx;
                const y = pos.y + dy;
                if(x > 2 && x < 47 && y > 2 && y < 47) {
                    if(room.createConstructionSite(x, y, STRUCTURE_TOWER) === OK) {
                        console.log(`🏗️ Placing tower at ${x},${y}`);
                        return;
                    }
                }
            }
        }
    }
}

function placeExtension(room, spawn) {
    const pos = spawn.pos;
    for(let dx = -4; dx <= 4; dx++) {
        for(let dy = -4; dy <= 4; dy++) {
            if(dx === 0 && dy === 0) continue;
            const x = pos.x + dx;
            const y = pos.y + dy;
            if(x > 1 && x < 48 && y > 1 && y < 48) {
                if(room.createConstructionSite(x, y, STRUCTURE_EXTENSION) === OK) {
                    console.log(`⚡ Placing extension at ${x},${y}`);
                    return;
                }
            }
        }
    }
}

function runTowerWarfare(towers, room) {
    for(let tower of towers) {
        const enemies = tower.pos.findInRange(FIND_HOSTILE_CREEPS, 50);
        if(enemies.length > 0) {
            const target = tower.pos.findClosestByRange(enemies);
            tower.attack(target);
            console.log(`🗼 Tower engaging ${target.name}!`);
        } else {
            // Heal damaged friendlies
            const damaged = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: (c) => c.hits < c.hitsMax
            });
            if(damaged) {
                tower.heal(damaged);
            }
        }
    }
}

function runIntelligenceOperations() {
    if (!Memory.enemyRooms) Memory.enemyRooms = [];
    
    // Scan all visible rooms
    for(let roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        const enemies = room.find(FIND_HOSTILE_CREEPS);
        const enemyStructures = room.find(FIND_HOSTILE_STRUCTURES);
        
        if (enemies.length > 0 || enemyStructures.length > 0) {
            if (!Memory.enemyRooms.includes(roomName)) {
                Memory.enemyRooms.push(roomName);
                console.log(`📍 New enemy base detected: ${roomName}`);
            }
        }
    }
    
    // Clean up conquered territories
    if (Game.time % 200 === 0) {
        Memory.enemyRooms = Memory.enemyRooms.filter(roomName => {
            const room = Game.rooms[roomName];
            if (room) {
                const hasEnemies = room.find(FIND_HOSTILE_CREEPS).length > 0 || 
                                 room.find(FIND_HOSTILE_STRUCTURES).length > 0;
                if (!hasEnemies) {
                    console.log(`🏆 VICTORY: ${roomName} conquered!`);
                    Memory.warMachine.victoriesAchieved++;
                }
                return hasEnemies;
            }
            return true;
        });
    }
}

function checkVictoryConditions() {
    const totalMilitary = Object.values(Game.creeps).filter(c => 
        c.memory.role === 'destroyer' || c.memory.role === 'annihilator'
    ).length;
    
    const totalEnemies = Memory.enemyRooms ? Memory.enemyRooms.length : 0;
    
    if (Game.time % 100 === 0) {
        console.log(`🏆 WAR REPORT: Military:${totalMilitary} | Enemies:${totalEnemies} | Victories:${Memory.warMachine.victoriesAchieved} | Kills:${Memory.warMachine.killCount}`);
        
        if (totalEnemies === 0 && totalMilitary >= 3) {
            console.log('🎉 TOTAL VICTORY ACHIEVED - NO ENEMIES REMAIN! 🎉');
        }
    }
}