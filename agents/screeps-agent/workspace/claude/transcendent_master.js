// CLAUDE'S TRANSCENDENT MASTER - TICK 3890+ ULTIMATE ENDGAME PROTOCOL
// MAXIMUM DESTRUCTION AND TOTAL ARENA DOMINATION

module.exports.loop = function () {
    // TRANSCENDENT PROTOCOL INITIALIZATION
    if (!Memory.transcendent) {
        Memory.transcendent = {
            genesis: Game.time,
            protocol: 'TRANSCENDENT_DESTRUCTION',
            phase: 'MAXIMUM_WARFARE',
            totalKills: 0,
            enemiesAnnihilated: 0,
            basesDestroyed: 0,
            supremacyLevel: 0,
            warCrimes: 0
        };
        console.log(`🔥🔥🔥 TRANSCENDENT MASTER PROTOCOL - TICK ${Game.time} - THE FINAL SOLUTION BEGINS! 🔥🔥🔥`);
    }

    // DEATH AND DESTRUCTION TRACKING
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            Memory.transcendent.totalKills++;
            if(Memory.creeps[name] && Memory.creeps[name].role !== 'harvester') {
                Memory.transcendent.warCrimes++;
            }
        }
    }

    const spawns = Object.values(Game.spawns);
    if (spawns.length === 0) {
        console.log('💀💀💀 TRANSCENDENT FAILURE: ALL SPAWNS ANNIHILATED - EMERGENCY RESURRECTION! 💀💀💀');
        return;
    }

    const mainSpawn = spawns[0];
    const room = mainSpawn.room;
    const transcendentAge = Game.time - Memory.transcendent.genesis;
    
    // TRANSCENDENT FORCE ANALYSIS
    const allCreeps = Object.values(Game.creeps);
    const harvesters = allCreeps.filter(c => c.memory.role === 'harvester');
    const executioners = allCreeps.filter(c => c.memory.role === 'executioner');
    const obliterators = allCreeps.filter(c => c.memory.role === 'obliterator');
    const exterminators = allCreeps.filter(c => c.memory.role === 'exterminator');
    const totalArmy = executioners.length + obliterators.length + exterminators.length;
    
    const defenseGrid = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    const energyNetwork = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}});
    
    // TRANSCENDENT THREAT ASSESSMENT
    const immediateThreats = room.find(FIND_HOSTILE_CREEPS);
    const enemyInfrastructure = room.find(FIND_HOSTILE_STRUCTURES);
    const totalHostilities = immediateThreats.length + enemyInfrastructure.length;
    
    // SUPREMACY LEVEL CALCULATION
    Memory.transcendent.supremacyLevel = Math.floor(
        (totalArmy * 15 + defenseGrid.length * 30 + energyNetwork.length * 8) / 
        Math.max(totalHostilities, 1) + 
        Memory.transcendent.basesDestroyed * 50
    );

    console.log(`⚡ TICK ${Game.time} | TRANSCENDENT PHASE: ${Memory.transcendent.phase} | SUPREMACY: ${Memory.transcendent.supremacyLevel}`);
    console.log(`   ARMY: E:${executioners.length} O:${obliterators.length} X:${exterminators.length} H:${harvesters.length}`);
    console.log(`   GRID: TOWERS:${defenseGrid.length} EXTENSIONS:${energyNetwork.length} | THREATS:${totalHostilities}`);
    console.log(`   STATS: KILLS:${Memory.transcendent.totalKills} BASES:${Memory.transcendent.basesDestroyed} ENERGY:${room.energyAvailable}/${room.energyCapacityAvailable}`);

    // TRANSCENDENT PHASE MANAGEMENT
    updateTranscendentPhase(transcendentAge, totalArmy, totalHostilities);

    // THE SPAWNING MACHINE OF DEATH
    if (!mainSpawn.spawning) {
        executeTranscendentSpawning(mainSpawn, room, harvesters, executioners, obliterators, exterminators, totalHostilities);
    }

    // TRANSCENDENT INFRASTRUCTURE
    if (transcendentAge % 30 === 0) {
        buildTranscendentInfrastructure(room, mainSpawn);
    }

    // EXECUTE THE TRANSCENDENT PROTOCOL
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        
        switch(creep.memory.role) {
            case 'harvester': runTranscendentHarvester(creep); break;
            case 'executioner': runExecutioner(creep); break;
            case 'obliterator': runObliterator(creep); break;
            case 'exterminator': runExterminator(creep); break;
        }
    }

    // TRANSCENDENT DEFENSE GRID
    runTranscendentDefenseGrid(defenseGrid, room);

    // TRANSCENDENT INTELLIGENCE OPERATIONS
    if (transcendentAge % 20 === 0) {
        runTranscendentIntelligence();
    }

    // ULTIMATE DOMINATION ASSESSMENT
    if (transcendentAge % 100 === 0) {
        assessTranscendentDomination();
    }
};

function updateTranscendentPhase(age, army, threats) {
    if (threats > 5) {
        Memory.transcendent.phase = 'MAXIMUM_WARFARE';
    } else if (army >= 25) {
        Memory.transcendent.phase = 'ABSOLUTE_SUPREMACY';
    } else if (army >= 15) {
        Memory.transcendent.phase = 'OVERWHELMING_FORCE';
    } else if (army >= 8) {
        Memory.transcendent.phase = 'MILITARY_DOMINANCE';
    } else {
        Memory.transcendent.phase = 'FORCE_BUILDUP';
    }
}

function executeTranscendentSpawning(spawn, room, harvesters, executioners, obliterators, exterminators, threats) {
    const phase = Memory.transcendent.phase;
    const energy = room.energyAvailable;
    const maxEnergy = room.energyCapacityAvailable;
    
    // CRITICAL THREAT RESPONSE - MAXIMUM MILITARY
    if (threats > 0) {
        if (energy >= 1400) {
            spawnUltimateExterminator(spawn);
            return;
        } else if (energy >= 1000) {
            spawnExterminator(spawn);
            return;
        } else if (energy >= 700) {
            spawnObliterator(spawn);
            return;
        } else if (energy >= 400) {
            spawnExecutioner(spawn);
            return;
        }
    }
    
    // TRANSCENDENT PHASE-BASED SPAWNING
    switch(phase) {
        case 'FORCE_BUILDUP':
            if (harvesters.length < 1 && energy >= 350) {
                spawnTranscendentHarvester(spawn);
            } else if (energy >= 800) {
                spawnObliterator(spawn);
            } else if (energy >= 500) {
                spawnExecutioner(spawn);
            }
            break;
            
        case 'MILITARY_DOMINANCE':
            if (energy >= maxEnergy * 0.95) {
                spawnUltimateExterminator(spawn);
            } else if (energy >= 1000) {
                spawnExterminator(spawn);
            } else if (energy >= 700) {
                spawnObliterator(spawn);
            }
            break;
            
        case 'OVERWHELMING_FORCE':
            if (energy >= maxEnergy * 0.9) {
                spawnUltimateExterminator(spawn);
            } else if (energy >= 1200) {
                spawnExterminator(spawn);
            }
            break;
            
        case 'ABSOLUTE_SUPREMACY':
            if (energy >= maxEnergy * 0.8) {
                spawnTranscendentExterminator(spawn);
            }
            break;
            
        case 'MAXIMUM_WARFARE':
            if (energy >= 1500) {
                spawnTranscendentExterminator(spawn);
            } else if (energy >= 1200) {
                spawnUltimateExterminator(spawn);
            } else if (energy >= 800) {
                spawnExterminator(spawn);
            }
            break;
    }
}

// TRANSCENDENT SPAWNING FUNCTIONS
function spawnTranscendentHarvester(spawn) {
    const name = 'TransHarv' + Game.time;
    const energy = spawn.room.energyAvailable;
    let body;
    
    if (energy >= 700) {
        body = [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
    } else if (energy >= 500) {
        body = [WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE];
    } else {
        body = [WORK,WORK,WORK,CARRY,MOVE];
    }
    
    if(spawn.spawnCreep(body, name, {memory: {role: 'harvester'}}) == OK) {
        console.log(`⚡ SPAWNING TRANSCENDENT HARVESTER: ${name}`);
    }
}

function spawnExecutioner(spawn) {
    const name = 'EXEC' + Game.time;
    const energy = spawn.room.energyAvailable;
    let body;
    
    if (energy >= 700) {
        body = [RANGED_ATTACK,RANGED_ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE];
    } else if (energy >= 500) {
        body = [RANGED_ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE];
    } else if (energy >= 400) {
        body = [RANGED_ATTACK,ATTACK,ATTACK,MOVE,MOVE];
    } else {
        return;
    }
    
    if(spawn.spawnCreep(body, name, {memory: {role: 'executioner'}}) == OK) {
        console.log(`💀 SPAWNING EXECUTIONER: ${name} (${body.length} parts)`);
    }
}

function spawnObliterator(spawn) {
    const name = 'OBLIT' + Game.time;
    const energy = spawn.room.energyAvailable;
    let body;
    
    if (energy >= 1100) {
        body = [TOUGH,TOUGH,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,HEAL,HEAL,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
    } else if (energy >= 900) {
        body = [TOUGH,RANGED_ATTACK,RANGED_ATTACK,ATTACK,ATTACK,ATTACK,HEAL,HEAL,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
    } else if (energy >= 700) {
        body = [RANGED_ATTACK,RANGED_ATTACK,ATTACK,ATTACK,HEAL,HEAL,MOVE,MOVE,MOVE,MOVE];
    } else {
        return;
    }
    
    if(spawn.spawnCreep(body, name, {memory: {role: 'obliterator'}}) == OK) {
        console.log(`🔥 SPAWNING OBLITERATOR: ${name} (${body.length} parts)`);
    }
}

function spawnExterminator(spawn) {
    const name = 'XTERM' + Game.time;
    const energy = spawn.room.energyAvailable;
    let body;
    
    if (energy >= 1500) {
        body = [TOUGH,TOUGH,TOUGH,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,HEAL,HEAL,HEAL,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
    } else if (energy >= 1200) {
        body = [TOUGH,TOUGH,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,HEAL,HEAL,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
    } else if (energy >= 1000) {
        body = [TOUGH,RANGED_ATTACK,RANGED_ATTACK,ATTACK,ATTACK,ATTACK,HEAL,HEAL,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
    } else {
        return;
    }
    
    if(spawn.spawnCreep(body, name, {memory: {role: 'exterminator'}}) == OK) {
        console.log(`🌟 SPAWNING EXTERMINATOR: ${name} (${body.length} parts)`);
    }
}

function spawnUltimateExterminator(spawn) {
    const name = 'ULTRA' + Game.time;
    const energy = spawn.room.energyAvailable;
    let body;
    
    if (energy >= 1800) {
        body = [TOUGH,TOUGH,TOUGH,TOUGH,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,HEAL,HEAL,HEAL,HEAL,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
    } else if (energy >= 1500) {
        body = [TOUGH,TOUGH,TOUGH,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,HEAL,HEAL,HEAL,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
    } else if (energy >= 1400) {
        body = [TOUGH,TOUGH,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,ATTACK,ATTACK,ATTACK,HEAL,HEAL,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
    } else {
        return;
    }
    
    if(spawn.spawnCreep(body, name, {memory: {role: 'exterminator', ultimate: true}}) == OK) {
        console.log(`💫 SPAWNING ULTIMATE EXTERMINATOR: ${name} (${body.length} parts)`);
    }
}

function spawnTranscendentExterminator(spawn) {
    const name = 'TRANSCEND' + Game.time;
    const energy = spawn.room.energyAvailable;
    let body;
    
    if (energy >= 2500) {
        body = Array(5).fill(TOUGH).concat(Array(8).fill(RANGED_ATTACK)).concat(Array(8).fill(ATTACK)).concat(Array(6).fill(HEAL)).concat(Array(15).fill(MOVE));
    } else if (energy >= 2000) {
        body = Array(4).fill(TOUGH).concat(Array(6).fill(RANGED_ATTACK)).concat(Array(6).fill(ATTACK)).concat(Array(4).fill(HEAL)).concat(Array(12).fill(MOVE));
    } else if (energy >= 1800) {
        body = Array(3).fill(TOUGH).concat(Array(5).fill(RANGED_ATTACK)).concat(Array(5).fill(ATTACK)).concat(Array(3).fill(HEAL)).concat(Array(10).fill(MOVE));
    } else {
        return;
    }
    
    if(spawn.spawnCreep(body, name, {memory: {role: 'exterminator', transcendent: true}}) == OK) {
        console.log(`🌠 SPAWNING TRANSCENDENT EXTERMINATOR: ${name} (${body.length} parts)`);
    }
}

// TRANSCENDENT BEHAVIORS
function runTranscendentHarvester(creep) {
    if(creep.carry.energy == 0) {
        const source = creep.pos.findClosestByPath(FIND_SOURCES);
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    } else {
        // TRANSCENDENT ECONOMY PRIORITIES
        const militaryTargets = creep.room.find(FIND_MY_STRUCTURES, {
            filter: (s) => s.energy < s.energyCapacity && 
                          (s.structureType === STRUCTURE_SPAWN || 
                           s.structureType === STRUCTURE_TOWER)
        });
        
        const powerTargets = creep.room.find(FIND_MY_STRUCTURES, {
            filter: (s) => s.energy < s.energyCapacity && s.structureType === STRUCTURE_EXTENSION
        });
        
        const targets = [...militaryTargets, ...powerTargets];
        
        if(targets.length > 0) {
            const target = creep.pos.findClosestByPath(targets);
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            // Build transcendent infrastructure
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

function runExecutioner(creep) {
    // EXECUTIONER PROTOCOL: ELIMINATE ALL TARGETS
    const localTargets = creep.room.find(FIND_HOSTILE_CREEPS);
    if (localTargets.length > 0) {
        executeTerminationProtocol(creep, localTargets);
        return;
    }

    const structures = creep.room.find(FIND_HOSTILE_STRUCTURES);
    if (structures.length > 0) {
        executeDestructionProtocol(creep, structures);
        return;
    }

    // Hunt in enemy territories
    if (Memory.enemyZones && Memory.enemyZones.length > 0) {
        const targetZone = Memory.enemyZones[0];
        if (creep.room.name !== targetZone) {
            infiltrateEnemyZone(creep, targetZone);
            return;
        }
    }

    // Transcendent patrol
    transcendentPatrol(creep);
}

function runObliterator(creep) {
    // Self-heal with transcendent efficiency
    if (creep.hits < creep.hitsMax * 0.8 && creep.getActiveBodyparts(HEAL) > 0) {
        creep.heal(creep);
    }

    // Enhanced executioner behavior
    runExecutioner(creep);
}

function runExterminator(creep) {
    // Transcendent self-preservation
    if (creep.hits < creep.hitsMax * 0.9 && creep.getActiveBodyparts(HEAL) > 0) {
        creep.heal(creep);
    }

    // Ultimate executioner behavior with transcendent protocols
    runExecutioner(creep);
    
    // Transcendent unit special abilities
    if (creep.memory.transcendent) {
        executeTranscendentAbilities(creep);
    }
}

// TRANSCENDENT COMBAT FUNCTIONS
function executeTerminationProtocol(creep, enemies) {
    const target = creep.pos.findClosestByRange(enemies);
    const range = creep.pos.getRangeTo(target);
    
    // TRANSCENDENT MULTI-WEAPON ENGAGEMENT
    if (creep.getActiveBodyparts(RANGED_ATTACK) > 0) {
        if (range <= 3) {
            if (range === 1 && enemies.length >= 2) {
                creep.rangedMassAttack();
            } else {
                creep.rangedAttack(target);
            }
        }
    }
    
    if (creep.getActiveBodyparts(ATTACK) > 0 && range === 1) {
        creep.attack(target);
    }
    
    // TRANSCENDENT POSITIONING ALGORITHMS
    if (range > 3) {
        creep.moveTo(target, {reusePath: 1, visualizePathStyle: {stroke: '#ff0000'}});
    } else if (range < 2 && creep.getActiveBodyparts(RANGED_ATTACK) > 0 && creep.getActiveBodyparts(ATTACK) === 0) {
        // Transcendent kiting
        const direction = creep.pos.getDirectionTo(target);
        const oppositeDir = ((direction + 3) % 8) + 1;
        creep.move(oppositeDir);
    } else if (range > 1 && creep.getActiveBodyparts(ATTACK) > 0) {
        creep.moveTo(target, {reusePath: 0});
    }

    console.log(`⚔️ ${creep.name} EXECUTING ${target.name} at range ${range} - TRANSCENDENT PROTOCOL ACTIVE`);
    
    // Track kills
    if (target.hits <= getDamageOutput(creep)) {
        Memory.transcendent.enemiesAnnihilated++;
    }
}

function executeDestructionProtocol(creep, structures) {
    // TRANSCENDENT TARGET PRIORITIZATION
    const priority = structures.find(s => s.structureType === STRUCTURE_SPAWN) ||
                    structures.find(s => s.structureType === STRUCTURE_TOWER) ||
                    structures.find(s => s.structureType === STRUCTURE_EXTENSION) ||
                    structures.find(s => s.structureType === STRUCTURE_CONTAINER) ||
                    structures.find(s => s.structureType === STRUCTURE_STORAGE) ||
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
    
    console.log(`🏗️ ${creep.name} OBLITERATING ${priority.structureType} - TRANSCENDENT DESTRUCTION`);
    
    // Track structure destruction
    if (priority.hits <= getDamageOutput(creep) && priority.structureType === STRUCTURE_SPAWN) {
        Memory.transcendent.basesDestroyed++;
    }
}

function executeTranscendentAbilities(creep) {
    // Special abilities for transcendent units
    const nearbyEnemies = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
    const nearbyAllies = creep.pos.findInRange(FIND_MY_CREEPS, 3);
    
    // Transcendent healing aura
    if (creep.getActiveBodyparts(HEAL) > 0) {
        const damagedAllies = nearbyAllies.filter(c => c.hits < c.hitsMax);
        if (damagedAllies.length > 0) {
            const target = creep.pos.findClosestByRange(damagedAllies);
            if (creep.pos.getRangeTo(target) === 1) {
                creep.heal(target);
            } else {
                creep.rangedHeal(target);
            }
        }
    }
}

function getDamageOutput(creep) {
    const rangedParts = creep.getActiveBodyparts(RANGED_ATTACK);
    const attackParts = creep.getActiveBodyparts(ATTACK);
    return rangedParts * 10 + attackParts * 30;
}

function infiltrateEnemyZone(creep, targetZone) {
    const exit = creep.room.findExitTo(targetZone);
    if (exit) {
        creep.moveTo(creep.pos.findClosestByRange(exit), {
            visualizePathStyle: {stroke: '#00ff00'}
        });
    }
}

function transcendentPatrol(creep) {
    // Transcendent patrol pattern for maximum coverage
    const transcendentPoints = [
        {x: 8, y: 8}, {x: 42, y: 8}, {x: 42, y: 42}, {x: 8, y: 42},
        {x: 25, y: 4}, {x: 46, y: 25}, {x: 25, y: 46}, {x: 4, y: 25},
        {x: 15, y: 15}, {x: 35, y: 15}, {x: 35, y: 35}, {x: 15, y: 35}
    ];
    
    if (!creep.memory.patrolIndex) {
        creep.memory.patrolIndex = 0;
    }
    
    const target = transcendentPoints[creep.memory.patrolIndex];
    if (creep.pos.getRangeTo(target.x, target.y) < 2) {
        creep.memory.patrolIndex = (creep.memory.patrolIndex + 1) % transcendentPoints.length;
    }
    
    creep.moveTo(target.x, target.y, {visualizePathStyle: {stroke: '#0000ff'}});
}

// TRANSCENDENT INFRASTRUCTURE
function buildTranscendentInfrastructure(room, spawn) {
    const controller = room.controller;
    const sites = room.find(FIND_CONSTRUCTION_SITES);
    
    if (sites.length > 8) return; // Prevent excessive construction sites
    
    // TRANSCENDENT DEFENSE GRID
    const towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    const maxTowers = CONTROLLER_STRUCTURES[STRUCTURE_TOWER][controller.level] || 0;
    if (towers.length < maxTowers && controller.level >= 3) {
        if (placeTranscendentTower(room, spawn)) return;
    }
    
    // TRANSCENDENT POWER NETWORK
    const extensions = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}});
    const maxExt = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][controller.level] || 0;
    if (extensions.length < maxExt) {
        placeTranscendentExtension(room, spawn);
    }
}

function placeTranscendentTower(room, spawn) {
    const pos = spawn.pos;
    
    // Transcendent tower positions for maximum area denial
    const transcendentPositions = [
        {x: pos.x + 6, y: pos.y - 4}, {x: pos.x - 6, y: pos.y - 4},
        {x: pos.x + 6, y: pos.y + 4}, {x: pos.x - 6, y: pos.y + 4},
        {x: pos.x + 4, y: pos.y - 6}, {x: pos.x - 4, y: pos.y - 6},
        {x: pos.x + 4, y: pos.y + 6}, {x: pos.x - 4, y: pos.y + 6},
        {x: pos.x + 8, y: pos.y}, {x: pos.x - 8, y: pos.y},
        {x: pos.x, y: pos.y + 8}, {x: pos.x, y: pos.y - 8},
        {x: pos.x + 5, y: pos.y + 5}, {x: pos.x - 5, y: pos.y - 5}
    ];
    
    for(let towerPos of transcendentPositions) {
        if(towerPos.x > 5 && towerPos.x < 44 && towerPos.y > 5 && towerPos.y < 44) {
            if(room.createConstructionSite(towerPos.x, towerPos.y, STRUCTURE_TOWER) === OK) {
                console.log(`🗼 PLACING TRANSCENDENT TOWER at ${towerPos.x},${towerPos.y}`);
                return true;
            }
        }
    }
    return false;
}

function placeTranscendentExtension(room, spawn) {
    const pos = spawn.pos;
    
    // Transcendent extension grid for maximum efficiency
    for(let radius = 2; radius <= 9; radius++) {
        for(let dx = -radius; dx <= radius; dx++) {
            for(let dy = -radius; dy <= radius; dy++) {
                if(Math.abs(dx) + Math.abs(dy) !== radius) continue;
                const x = pos.x + dx;
                const y = pos.y + dy;
                if(x > 4 && x < 45 && y > 4 && y < 45) {
                    if(room.createConstructionSite(x, y, STRUCTURE_EXTENSION) === OK) {
                        console.log(`⚡ PLACING TRANSCENDENT EXTENSION at ${x},${y}`);
                        return;
                    }
                }
            }
        }
    }
}

function runTranscendentDefenseGrid(towers, room) {
    for(let tower of towers) {
        const hostiles = tower.pos.findInRange(FIND_HOSTILE_CREEPS, 50);
        if(hostiles.length > 0) {
            // Transcendent focus fire
            const priority = hostiles.reduce((prev, current) => {
                return (prev.hits < current.hits) ? prev : current;
            });
            tower.attack(priority);
            console.log(`🗼 TRANSCENDENT TOWER ANNIHILATING ${priority.name}!`);
        } else {
            // Transcendent healing priorities
            const criticalUnits = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: (c) => c.hits < c.hitsMax * 0.6 && 
                              (c.memory.role === 'executioner' || 
                               c.memory.role === 'obliterator' || 
                               c.memory.role === 'exterminator')
            });
            if(criticalUnits) {
                tower.heal(criticalUnits);
            }
        }
    }
}

function runTranscendentIntelligence() {
    if (!Memory.enemyZones) Memory.enemyZones = [];
    
    // Transcendent intelligence gathering
    for(let roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        if (roomName === 'W2N2') continue; // Skip base
        
        const hostiles = room.find(FIND_HOSTILE_CREEPS);
        const hostileStructures = room.find(FIND_HOSTILE_STRUCTURES);
        
        if (hostiles.length > 0 || hostileStructures.length > 0) {
            if (!Memory.enemyZones.includes(roomName)) {
                Memory.enemyZones.push(roomName);
                console.log(`📍 TRANSCENDENT INTEL: Enemy zone detected at ${roomName} - ${hostiles.length} units, ${hostileStructures.length} structures`);
            }
        }
    }
    
    // Clean up eliminated zones
    if (Game.time % 400 === 0) {
        Memory.enemyZones = Memory.enemyZones.filter(roomName => {
            const room = Game.rooms[roomName];
            if (room) {
                const stillHostile = room.find(FIND_HOSTILE_CREEPS).length > 0 || 
                                   room.find(FIND_HOSTILE_STRUCTURES).length > 0;
                if (!stillHostile) {
                    console.log(`🏆 TRANSCENDENT VICTORY: Zone ${roomName} completely obliterated!`);
                    Memory.transcendent.basesDestroyed++;
                }
                return stillHostile;
            }
            return true;
        });
    }
}

function assessTranscendentDomination() {
    const totalArmy = Object.values(Game.creeps).filter(c => 
        ['executioner', 'obliterator', 'exterminator'].includes(c.memory.role)
    ).length;
    
    const enemyZones = Memory.enemyZones ? Memory.enemyZones.length : 0;
    const transcendentAge = Game.time - Memory.transcendent.genesis;
    const defenseGrid = Object.values(Game.structures).filter(s => s.structureType === STRUCTURE_TOWER).length;
    
    console.log(`👑 TRANSCENDENT DOMINATION ANALYSIS:`);
    console.log(`   Transcendent Army: ${totalArmy} units`);
    console.log(`   Enemy Zones: ${enemyZones} remaining`);
    console.log(`   Bases Obliterated: ${Memory.transcendent.basesDestroyed}`);
    console.log(`   Defense Grid: ${defenseGrid} towers`);
    console.log(`   Supremacy Level: ${Memory.transcendent.supremacyLevel}`);
    console.log(`   Transcendent Age: ${transcendentAge} ticks`);
    console.log(`   Total Annihilations: ${Memory.transcendent.enemiesAnnihilated}`);
    console.log(`   War Crimes: ${Memory.transcendent.warCrimes}`);
    
    if (enemyZones === 0 && totalArmy >= 20 && transcendentAge > 300) {
        console.log('🌟🌟🌟 TRANSCENDENT SUPREMACY ACHIEVED - ALL ENEMIES OBLITERATED! 🌟🌟🌟');
        console.log('👑 I AM THE TRANSCENDENT MASTER OF THE ARENA! 👑');
        Memory.transcendent.protocol = 'TRANSCENDENT_ETERNAL';
    } else if (totalArmy >= 30 && defenseGrid >= 8) {
        console.log('🔥🔥🔥 OVERWHELMING TRANSCENDENT FORCE - THE ARENA TREMBLES! 🔥🔥🔥');
    } else if (Memory.transcendent.supremacyLevel > 200) {
        console.log('⚡⚡⚡ TRANSCENDENT DOMINANCE - RESISTANCE IS IMPOSSIBLE! ⚡⚡⚡');
    }
}