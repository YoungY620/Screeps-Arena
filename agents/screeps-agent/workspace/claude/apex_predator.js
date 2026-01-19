// CLAUDE'S APEX PREDATOR - THE FINAL SOLUTION
// TICK 315+ BATTLEFIELD SUPREMACY ENGINE

module.exports.loop = function () {
    // THE APEX PROTOCOL
    if (!Memory.apex) {
        Memory.apex = {
            genesis: Game.time,
            protocol: 'TOTAL_ANNIHILATION',
            phase: 'RAPID_DEPLOYMENT',
            totalKills: 0,
            enemyBases: [],
            dominanceLevel: 0,
            lastThreat: null
        };
        console.log(`🔥🔥🔥 APEX PREDATOR PROTOCOL ACTIVATED - TICK ${Game.time} - BEGINNING THE HUNT! 🔥🔥🔥`);
    }

    // DEATH TRACKING
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            Memory.apex.totalKills++;
        }
    }

    const spawns = Object.values(Game.spawns);
    if (spawns.length === 0) {
        console.log('💀💀💀 CRITICAL FAILURE: ALL SPAWNS LOST - EMERGENCY RESURRECTION PROTOCOL! 💀💀💀');
        return;
    }

    const mainSpawn = spawns[0];
    const room = mainSpawn.room;
    const elapsedTime = Game.time - Memory.apex.genesis;
    
    // APEX FORCE ANALYSIS
    const allCreeps = Object.values(Game.creeps);
    const harvesters = allCreeps.filter(c => c.memory.role === 'harvester');
    const predators = allCreeps.filter(c => c.memory.role === 'predator');
    const annihilators = allCreeps.filter(c => c.memory.role === 'annihilator');
    const hunters = allCreeps.filter(c => c.memory.role === 'hunter');
    const totalArmy = predators.length + annihilators.length + hunters.length;
    
    const defenses = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    const powerSources = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}});
    
    // THREAT MATRIX
    const hostiles = room.find(FIND_HOSTILE_CREEPS);
    const hostileStructures = room.find(FIND_HOSTILE_STRUCTURES);
    const threatLevel = hostiles.length * 2 + hostileStructures.length;
    
    // Update threat status
    if (threatLevel > 0) {
        Memory.apex.lastThreat = Game.time;
        if (Memory.apex.phase !== 'COMBAT_SUPREMACY') {
            Memory.apex.phase = 'COMBAT_SUPREMACY';
            console.log('🚨🚨🚨 THREAT DETECTED - ENTERING COMBAT SUPREMACY MODE! 🚨🚨🚨');
        }
    }
    
    // DYNAMIC DOMINANCE CALCULATION
    Memory.apex.dominanceLevel = Math.floor(
        (totalArmy * 10 + defenses.length * 20 + powerSources.length * 5) / 
        Math.max(threatLevel, 1)
    );

    // BATTLEFIELD PHASE CONTROL
    updateSupremacyPhase(elapsedTime, totalArmy, threatLevel);

    console.log(`⚡ TICK ${Game.time} | PHASE: ${Memory.apex.phase} | DOMINANCE: ${Memory.apex.dominanceLevel} | P:${predators.length} A:${annihilators.length} H:${hunters.length} | HARV:${harvesters.length} | TOWERS:${defenses.length} | THREATS:${threatLevel} | ENERGY:${room.energyAvailable}/${room.energyCapacityAvailable}`);

    // THE SPAWNING MACHINE
    if (!mainSpawn.spawning) {
        executeApexSpawning(mainSpawn, room, harvesters, predators, annihilators, hunters, threatLevel);
    }

    // INFRASTRUCTURE OF DEATH
    if (elapsedTime % 20 === 0) {
        buildApexInfrastructure(room, mainSpawn);
    }

    // EXECUTE THE HUNT
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        
        switch(creep.memory.role) {
            case 'harvester': runHarvesterUnit(creep); break;
            case 'predator': runPredatorUnit(creep); break;
            case 'annihilator': runAnnihilatorUnit(creep); break;
            case 'hunter': runHunterUnit(creep); break;
        }
    }

    // TOWER NETWORK OF DESTRUCTION
    runApexDefenseGrid(defenses, room);

    // STRATEGIC INTELLIGENCE
    if (elapsedTime % 15 === 0) {
        runApexIntelligence();
    }

    // VICTORY CONDITIONS
    if (elapsedTime % 100 === 0) {
        assessTotalDomination();
    }
};

function updateSupremacyPhase(age, army, threats) {
    if (threats > 3) {
        Memory.apex.phase = 'COMBAT_SUPREMACY';
    } else if (age < 200 && army < 2) {
        Memory.apex.phase = 'RAPID_DEPLOYMENT';
    } else if (army >= 2 && army < 6) {
        Memory.apex.phase = 'FORCE_BUILDUP';
    } else if (army >= 6 && army < 12) {
        Memory.apex.phase = 'TERRITORIAL_EXPANSION';
    } else if (army >= 12) {
        Memory.apex.phase = 'TOTAL_SUPREMACY';
    } else {
        Memory.apex.phase = 'CONSOLIDATION';
    }
}

function executeApexSpawning(spawn, room, harvesters, predators, annihilators, hunters, threats) {
    const phase = Memory.apex.phase;
    const energy = room.energyAvailable;
    const maxEnergy = room.energyCapacityAvailable;
    
    // CRITICAL THREAT RESPONSE
    if (threats > 0) {
        if (energy >= 400 && annihilators.length < threats) {
            spawnAnnihilator(spawn);
            return;
        } else if (energy >= 300) {
            spawnPredator(spawn);
            return;
        }
    }
    
    // PHASE-BASED SUPREMACY SPAWNING
    switch(phase) {
        case 'RAPID_DEPLOYMENT':
            if (harvesters.length < 1 && energy >= 200) {
                spawnHarvester(spawn);
            } else if (hunters.length < 1 && energy >= 50) {
                spawnHunter(spawn);
            } else if (energy >= 300) {
                spawnPredator(spawn);
            }
            break;
            
        case 'FORCE_BUILDUP':
            if (hunters.length < 2 && energy >= 50) {
                spawnHunter(spawn);
            } else if (predators.length < 4 && energy >= 300) {
                spawnPredator(spawn);
            } else if (energy >= 500) {
                spawnAnnihilator(spawn);
            }
            break;
            
        case 'TERRITORIAL_EXPANSION':
            if (hunters.length < 4 && energy >= 50) {
                spawnHunter(spawn);
            } else if (energy >= 500) {
                spawnAnnihilator(spawn);
            } else if (energy >= 300) {
                spawnPredator(spawn);
            }
            break;
            
        case 'TOTAL_SUPREMACY':
            if (energy >= maxEnergy * 0.8) {
                spawnUltimateAnnihilator(spawn);
            } else if (energy >= 500) {
                spawnAnnihilator(spawn);
            }
            break;
            
        case 'COMBAT_SUPREMACY':
            if (energy >= 600) {
                spawnUltimateAnnihilator(spawn);
            } else if (energy >= 400) {
                spawnAnnihilator(spawn);
            } else if (energy >= 300) {
                spawnPredator(spawn);
            } else if (harvesters.length === 0 && energy >= 200) {
                spawnHarvester(spawn);
            }
            break;
            
        case 'CONSOLIDATION':
            if (harvesters.length < 2 && energy >= 200) {
                spawnHarvester(spawn);
            } else if (energy >= 400) {
                spawnAnnihilator(spawn);
            }
            break;
    }
}

// APEX SPAWNING FUNCTIONS
function spawnHarvester(spawn) {
    const name = 'Harvester' + Game.time;
    const body = spawn.room.energyAvailable >= 350 ? 
        [WORK,WORK,WORK,CARRY,MOVE] : [WORK,CARRY,MOVE];
    
    if(spawn.spawnCreep(body, name, {memory: {role: 'harvester'}}) == OK) {
        console.log(`⚡ SPAWNING HARVESTER: ${name}`);
    }
}

function spawnPredator(spawn) {
    const name = 'PRED' + Game.time;
    const energy = spawn.room.energyAvailable;
    let body;
    
    if (energy >= 550) {
        body = [RANGED_ATTACK,RANGED_ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE];
    } else if (energy >= 400) {
        body = [RANGED_ATTACK,ATTACK,ATTACK,MOVE,MOVE];
    } else if (energy >= 300) {
        body = [RANGED_ATTACK,ATTACK,MOVE,MOVE];
    } else {
        return;
    }
    
    if(spawn.spawnCreep(body, name, {memory: {role: 'predator'}}) == OK) {
        console.log(`💀 SPAWNING PREDATOR: ${name} (${body.length} parts)`);
    }
}

function spawnAnnihilator(spawn) {
    const name = 'ANNI' + Game.time;
    const energy = spawn.room.energyAvailable;
    let body;
    
    if (energy >= 800) {
        body = [RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,ATTACK,ATTACK,HEAL,MOVE,MOVE,MOVE,MOVE,MOVE];
    } else if (energy >= 650) {
        body = [RANGED_ATTACK,RANGED_ATTACK,ATTACK,ATTACK,HEAL,MOVE,MOVE,MOVE,MOVE];
    } else if (energy >= 500) {
        body = [RANGED_ATTACK,ATTACK,ATTACK,HEAL,MOVE,MOVE,MOVE];
    } else if (energy >= 400) {
        body = [RANGED_ATTACK,ATTACK,HEAL,MOVE,MOVE];
    } else {
        return;
    }
    
    if(spawn.spawnCreep(body, name, {memory: {role: 'annihilator'}}) == OK) {
        console.log(`🔥 SPAWNING ANNIHILATOR: ${name} (${body.length} parts)`);
    }
}

function spawnUltimateAnnihilator(spawn) {
    const name = 'ULTIMATE' + Game.time;
    const energy = spawn.room.energyAvailable;
    let body;
    
    if (energy >= 1000) {
        body = [TOUGH,TOUGH,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,ATTACK,ATTACK,ATTACK,HEAL,HEAL,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
    } else if (energy >= 800) {
        body = [TOUGH,RANGED_ATTACK,RANGED_ATTACK,ATTACK,ATTACK,HEAL,HEAL,MOVE,MOVE,MOVE,MOVE,MOVE];
    } else if (energy >= 600) {
        body = [RANGED_ATTACK,RANGED_ATTACK,ATTACK,ATTACK,HEAL,MOVE,MOVE,MOVE,MOVE];
    } else {
        return;
    }
    
    if(spawn.spawnCreep(body, name, {memory: {role: 'annihilator', ultimate: true}}) == OK) {
        console.log(`🌟 SPAWNING ULTIMATE ANNIHILATOR: ${name} (${body.length} parts)`);
    }
}

function spawnHunter(spawn) {
    const name = 'Hunt' + Game.time;
    const body = [MOVE];
    
    if(spawn.spawnCreep(body, name, {memory: {role: 'hunter', targetRoom: null}}) == OK) {
        console.log(`👁️ SPAWNING HUNTER: ${name}`);
    }
}

// APEX BEHAVIOR FUNCTIONS
function runHarvesterUnit(creep) {
    if(creep.carry.energy == 0) {
        const source = creep.pos.findClosestByPath(FIND_SOURCES);
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    } else {
        // APEX ECONOMY PRIORITIES
        const criticalTargets = creep.room.find(FIND_MY_STRUCTURES, {
            filter: (s) => s.energy < s.energyCapacity && s.structureType === STRUCTURE_SPAWN
        });
        
        const powerTargets = creep.room.find(FIND_MY_STRUCTURES, {
            filter: (s) => s.energy < s.energyCapacity && s.structureType === STRUCTURE_EXTENSION
        });
        
        const defenseTargets = creep.room.find(FIND_MY_STRUCTURES, {
            filter: (s) => s.energy < s.energyCapacity && s.structureType === STRUCTURE_TOWER
        });
        
        const targets = [...criticalTargets, ...powerTargets, ...defenseTargets];
        
        if(targets.length > 0) {
            const target = creep.pos.findClosestByPath(targets);
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            // BUILD THE INFRASTRUCTURE OF DEATH
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

function runPredatorUnit(creep) {
    // THE PREDATOR PROTOCOL
    const localTargets = creep.room.find(FIND_HOSTILE_CREEPS);
    if (localTargets.length > 0) {
        executeTermination(creep, localTargets);
        return;
    }

    const structures = creep.room.find(FIND_HOSTILE_STRUCTURES);
    if (structures.length > 0) {
        executeDestruction(creep, structures);
        return;
    }

    // HUNT IN ENEMY TERRITORY
    if (Memory.apex.enemyBases.length > 0) {
        const targetBase = Memory.apex.enemyBases[0];
        if (creep.room.name !== targetBase) {
            huntInRoom(creep, targetBase);
            return;
        }
    }

    // AGGRESSIVE PATROL
    predatorPatrol(creep);
}

function runAnnihilatorUnit(creep) {
    // SELF-PRESERVATION PROTOCOL
    if (creep.hits < creep.hitsMax && creep.getActiveBodyparts(HEAL) > 0) {
        creep.heal(creep);
    }

    // ENHANCED PREDATOR BEHAVIOR WITH HEALING
    runPredatorUnit(creep);
}

function runHunterUnit(creep) {
    // THE HUNTER'S PROTOCOL
    if (!creep.memory.targetRoom) {
        const huntZones = [
            'W1N2', 'W3N2', 'W2N1', 'W2N3',  // Adjacent
            'W1N1', 'W3N3', 'W1N3', 'W3N1',  // Diagonal
            'W0N2', 'W4N2', 'W2N0', 'W2N4',  // Extended
            'W1N0', 'W3N0', 'W0N1', 'W0N3',  // Far zones
            'W4N1', 'W4N3', 'W1N4', 'W3N4'   // Ultra-range
        ];
        creep.memory.targetRoom = huntZones[(Game.time + creep.name.charCodeAt(0)) % huntZones.length];
        creep.memory.huntStart = Game.time;
    }

    if (creep.room.name !== creep.memory.targetRoom) {
        huntInRoom(creep, creep.memory.targetRoom);
    } else {
        // INTELLIGENCE GATHERING
        const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
        const hostileStructures = creep.room.find(FIND_HOSTILE_STRUCTURES);
        
        if (hostiles.length > 0 || hostileStructures.length > 0) {
            console.log(`🎯 HUNTER INTEL: ${creep.room.name} - ${hostiles.length} hostiles, ${hostileStructures.length} structures - PRIORITY TARGET!`);
            if (!Memory.apex.enemyBases.includes(creep.room.name)) {
                Memory.apex.enemyBases.push(creep.room.name);
                console.log(`🚨 TARGET CONFIRMED: ${creep.room.name} added to termination list!`);
            }
        }

        // MAXIMUM COVERAGE HUNTING
        if (creep.fatigue === 0) {
            const patterns = [
                [TOP, TOP_RIGHT, RIGHT, BOTTOM_RIGHT],
                [BOTTOM, BOTTOM_LEFT, LEFT, TOP_LEFT],
                [TOP_LEFT, TOP, TOP_RIGHT, RIGHT],
                [BOTTOM_RIGHT, BOTTOM, BOTTOM_LEFT, LEFT]
            ];
            const pattern = patterns[Math.floor(Game.time / 25) % patterns.length];
            creep.move(pattern[Game.time % pattern.length]);
        }
        
        // REASSIGN AFTER THOROUGH HUNT
        if (Game.time - creep.memory.huntStart > 120) {
            creep.memory.targetRoom = null;
        }
    }
}

// APEX COMBAT FUNCTIONS
function executeTermination(creep, targets) {
    const target = creep.pos.findClosestByRange(targets);
    const range = creep.pos.getRangeTo(target);
    
    // MULTI-VECTOR ATTACK PROTOCOL
    if (creep.getActiveBodyparts(RANGED_ATTACK) > 0) {
        if (range <= 3) {
            if (range === 1 && targets.length > 1) {
                creep.rangedMassAttack();
            } else {
                creep.rangedAttack(target);
            }
        }
    }
    
    if (creep.getActiveBodyparts(ATTACK) > 0 && range === 1) {
        creep.attack(target);
    }
    
    // APEX POSITIONING
    if (range > 3) {
        creep.moveTo(target, {reusePath: 2, visualizePathStyle: {stroke: '#ff0000'}});
    } else if (range < 2 && creep.getActiveBodyparts(RANGED_ATTACK) > 0 && !creep.getActiveBodyparts(ATTACK)) {
        // KITING PROTOCOL
        const direction = creep.pos.getDirectionTo(target);
        const oppositeDir = ((direction + 3) % 8) + 1;
        creep.move(oppositeDir);
    } else if (range > 1 && creep.getActiveBodyparts(ATTACK) > 0) {
        // CLOSING PROTOCOL
        creep.moveTo(target, {reusePath: 1});
    }

    console.log(`⚔️ ${creep.name} TERMINATING ${target.name} at range ${range}`);
}

function executeDestruction(creep, structures) {
    // HIGH-VALUE TARGET PRIORITIZATION
    const priority = structures.find(s => s.structureType === STRUCTURE_SPAWN) ||
                    structures.find(s => s.structureType === STRUCTURE_TOWER) ||
                    structures.find(s => s.structureType === STRUCTURE_EXTENSION) ||
                    structures.find(s => s.structureType === STRUCTURE_CONTAINER) ||
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
    
    console.log(`🏗️ ${creep.name} DESTROYING ${priority.structureType} at ${priority.pos}`);
}

function huntInRoom(creep, targetRoom) {
    const exit = creep.room.findExitTo(targetRoom);
    if (exit) {
        creep.moveTo(creep.pos.findClosestByRange(exit), {
            visualizePathStyle: {stroke: '#00ff00'}
        });
    }
}

function predatorPatrol(creep) {
    // MAXIMUM TERRITORY COVERAGE
    const patrolPattern = [
        {x: 5, y: 5}, {x: 45, y: 5}, {x: 45, y: 45}, {x: 5, y: 45},
        {x: 25, y: 10}, {x: 40, y: 25}, {x: 25, y: 40}, {x: 10, y: 25}
    ];
    
    if (!creep.memory.patrolIndex) {
        creep.memory.patrolIndex = 0;
    }
    
    const targetPos = patrolPattern[creep.memory.patrolIndex];
    if (creep.pos.getRangeTo(targetPos.x, targetPos.y) < 3) {
        creep.memory.patrolIndex = (creep.memory.patrolIndex + 1) % patrolPattern.length;
    }
    
    creep.moveTo(targetPos.x, targetPos.y, {visualizePathStyle: {stroke: '#0000ff'}});
}

// APEX INFRASTRUCTURE
function buildApexInfrastructure(room, spawn) {
    const controller = room.controller;
    const sites = room.find(FIND_CONSTRUCTION_SITES);
    
    if (sites.length > 5) return; // Prevent site spam
    
    // DEFENSE GRID PRIORITY
    const towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    const maxTowers = CONTROLLER_STRUCTURES[STRUCTURE_TOWER][controller.level] || 0;
    if (towers.length < maxTowers && controller.level >= 3) {
        if (placeApexTower(room, spawn)) return;
    }
    
    // POWER INFRASTRUCTURE
    const extensions = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}});
    const maxExt = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][controller.level] || 0;
    if (extensions.length < Math.min(maxExt, 15)) {
        placeApexExtension(room, spawn);
    }
}

function placeApexTower(room, spawn) {
    const pos = spawn.pos;
    
    // STRATEGIC TOWER PLACEMENT
    const positions = [
        {x: pos.x + 4, y: pos.y - 2}, {x: pos.x - 4, y: pos.y - 2},
        {x: pos.x + 4, y: pos.y + 2}, {x: pos.x - 4, y: pos.y + 2},
        {x: pos.x + 2, y: pos.y - 4}, {x: pos.x - 2, y: pos.y - 4},
        {x: pos.x + 2, y: pos.y + 4}, {x: pos.x - 2, y: pos.y + 4},
        {x: pos.x + 6, y: pos.y}, {x: pos.x - 6, y: pos.y},
        {x: pos.x, y: pos.y + 6}, {x: pos.x, y: pos.y - 6}
    ];
    
    for(let towerPos of positions) {
        if(towerPos.x > 3 && towerPos.x < 46 && towerPos.y > 3 && towerPos.y < 46) {
            if(room.createConstructionSite(towerPos.x, towerPos.y, STRUCTURE_TOWER) === OK) {
                console.log(`🗼 PLACING APEX TOWER at ${towerPos.x},${towerPos.y}`);
                return true;
            }
        }
    }
    return false;
}

function placeApexExtension(room, spawn) {
    const pos = spawn.pos;
    
    // EFFICIENT EXTENSION GRID
    for(let radius = 2; radius <= 7; radius++) {
        for(let dx = -radius; dx <= radius; dx++) {
            for(let dy = -radius; dy <= radius; dy++) {
                if(Math.abs(dx) + Math.abs(dy) !== radius) continue;
                const x = pos.x + dx;
                const y = pos.y + dy;
                if(x > 2 && x < 47 && y > 2 && y < 47) {
                    if(room.createConstructionSite(x, y, STRUCTURE_EXTENSION) === OK) {
                        console.log(`⚡ PLACING APEX EXTENSION at ${x},${y}`);
                        return;
                    }
                }
            }
        }
    }
}

function runApexDefenseGrid(towers, room) {
    for(let tower of towers) {
        // PRIORITY TARGET ACQUISITION
        const hostiles = tower.pos.findInRange(FIND_HOSTILE_CREEPS, 50);
        if(hostiles.length > 0) {
            // FOCUS FIRE ON CLOSEST THREAT
            const target = tower.pos.findClosestByRange(hostiles);
            tower.attack(target);
            console.log(`🗼 TOWER ENGAGING ${target.name} - ELIMINATING THREAT!`);
        } else {
            // APEX HEALING PRIORITY
            const criticallyDamaged = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: (c) => c.hits < c.hitsMax * 0.5 && 
                              (c.memory.role === 'predator' || c.memory.role === 'annihilator')
            });
            if(criticallyDamaged) {
                tower.heal(criticallyDamaged);
            }
        }
    }
}

function runApexIntelligence() {
    if (!Memory.apex.enemyBases) Memory.apex.enemyBases = [];
    
    // SCAN ALL VISIBLE TERRITORY
    for(let roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        if (roomName === 'W2N2') continue; // Skip our base
        
        const hostiles = room.find(FIND_HOSTILE_CREEPS);
        const hostileStructures = room.find(FIND_HOSTILE_STRUCTURES);
        
        if ((hostiles.length > 0 || hostileStructures.length > 0)) {
            if (!Memory.apex.enemyBases.includes(roomName)) {
                Memory.apex.enemyBases.push(roomName);
                console.log(`📍 APEX INTELLIGENCE: Enemy base confirmed at ${roomName} - ${hostiles.length} units, ${hostileStructures.length} structures`);
            }
        }
    }
    
    // CLEAN UP DESTROYED BASES
    if (Game.time % 500 === 0) {
        Memory.apex.enemyBases = Memory.apex.enemyBases.filter(roomName => {
            const room = Game.rooms[roomName];
            if (room) {
                const stillHostile = room.find(FIND_HOSTILE_CREEPS).length > 0 || 
                                   room.find(FIND_HOSTILE_STRUCTURES).length > 0;
                if (!stillHostile) {
                    console.log(`🏆 APEX VICTORY: Base ${roomName} completely eliminated!`);
                }
                return stillHostile;
            }
            return true; // Keep if not visible
        });
    }
}

function assessTotalDomination() {
    const totalArmy = Object.values(Game.creeps).filter(c => 
        ['predator', 'annihilator', 'hunter'].includes(c.memory.role)
    ).length;
    
    const knownTargets = Memory.apex.enemyBases.length;
    const dominanceAge = Game.time - Memory.apex.genesis;
    const towerCount = Object.values(Game.structures).filter(s => s.structureType === STRUCTURE_TOWER).length;
    
    console.log(`👑 APEX DOMINATION STATUS:`);
    console.log(`   Army: ${totalArmy} units | Targets: ${knownTargets} | Towers: ${towerCount} | Age: ${dominanceAge} | Dominance Level: ${Memory.apex.dominanceLevel}`);
    console.log(`   Total Kills: ${Memory.apex.totalKills} | Last Threat: ${Memory.apex.lastThreat ? Game.time - Memory.apex.lastThreat : 'None'} ticks ago`);
    
    if (knownTargets === 0 && totalArmy >= 8 && dominanceAge > 600) {
        console.log('🌟🌟🌟 TOTAL APEX DOMINATION ACHIEVED - I AM THE ULTIMATE PREDATOR! 🌟🌟🌟');
        Memory.apex.protocol = 'VICTORY_ETERNAL';
    } else if (totalArmy >= 15 && towerCount >= 3) {
        console.log('🔥🔥🔥 OVERWHELMING FORCE ACHIEVED - THE ARENA TREMBLES! 🔥🔥🔥');
    } else if (Memory.apex.dominanceLevel > 100) {
        console.log('⚡⚡⚡ SUPREME DOMINANCE - RESISTANCE IS FUTILE! ⚡⚡⚡');
    }
}