// CLAUDE'S PERFECT START - TICK 5311+ ULTIMATE ENDGAME DOMINATION
// MAXIMUM DESTRUCTION PROTOCOL FOR EXTREME LATE GAME

module.exports.loop = function () {
    // PERFECT START PROTOCOL INITIALIZATION
    if (!Memory.perfect) {
        Memory.perfect = {
            genesis: Game.time,
            protocol: 'ABSOLUTE_PERFECTION',
            phase: 'MAXIMUM_ANNIHILATION',
            totalEliminations: 0,
            basesAnnihilated: 0,
            arenaScore: 0,
            perfectionLevel: 0,
            godMode: false
        };
        console.log(`🔥🔥🔥 PERFECT START PROTOCOL - TICK ${Game.time} - ACHIEVING ABSOLUTE PERFECTION! 🔥🔥🔥`);
    }

    // PERFECTION TRACKING
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            if(Memory.creeps[name] && Memory.creeps[name].role !== 'harvester') {
                Memory.perfect.totalEliminations++;
            }
        }
    }

    const spawns = Object.values(Game.spawns);
    if (spawns.length === 0) {
        console.log('💀💀💀 PERFECT FAILURE: ALL SPAWNS ELIMINATED - EMERGENCY RESURRECTION! 💀💀💀');
        return;
    }

    const mainSpawn = spawns[0];
    const room = mainSpawn.room;
    const perfectAge = Game.time - Memory.perfect.genesis;
    
    // PERFECT FORCE ANALYSIS
    const allCreeps = Object.values(Game.creeps);
    const architects = allCreeps.filter(c => c.memory.role === 'architect');
    const terminators = allCreeps.filter(c => c.memory.role === 'terminator');
    const dominators = allCreeps.filter(c => c.memory.role === 'dominator');
    const perfectors = allCreeps.filter(c => c.memory.role === 'perfector');
    const gods = allCreeps.filter(c => c.memory.role === 'god');
    const totalArmy = terminators.length + dominators.length + perfectors.length + gods.length;
    
    const perfectGrid = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    const perfectNetwork = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}});
    
    // PERFECT THREAT ASSESSMENT
    const immediateThreats = room.find(FIND_HOSTILE_CREEPS);
    const enemyInfrastructure = room.find(FIND_HOSTILE_STRUCTURES);
    const totalHostilities = immediateThreats.length + enemyInfrastructure.length;
    
    // PERFECTION LEVEL CALCULATION
    Memory.perfect.perfectionLevel = Math.floor(
        (totalArmy * 20 + perfectGrid.length * 40 + perfectNetwork.length * 10) / 
        Math.max(totalHostilities, 1) + 
        Memory.perfect.basesAnnihilated * 100 +
        (gods.length * 500)
    );

    // GOD MODE ACTIVATION
    if (Memory.perfect.perfectionLevel > 1000 && gods.length >= 3) {
        Memory.perfect.godMode = true;
    }

    console.log(`⚡ TICK ${Game.time} | PERFECT PHASE: ${Memory.perfect.phase} | PERFECTION: ${Memory.perfect.perfectionLevel} ${Memory.perfect.godMode ? '| GOD MODE ACTIVE' : ''}`);
    console.log(`   PERFECT ARMY: T:${terminators.length} D:${dominators.length} P:${perfectors.length} G:${gods.length} A:${architects.length}`);
    console.log(`   PERFECT GRID: TOWERS:${perfectGrid.length} EXTENSIONS:${perfectNetwork.length} | THREATS:${totalHostilities}`);
    console.log(`   PERFECT STATS: ELIMINATIONS:${Memory.perfect.totalEliminations} BASES:${Memory.perfect.basesAnnihilated} ENERGY:${room.energyAvailable}/${room.energyCapacityAvailable}`);

    // PERFECT PHASE MANAGEMENT
    updatePerfectPhase(perfectAge, totalArmy, totalHostilities);

    // THE PERFECT SPAWNING PROTOCOL
    if (!mainSpawn.spawning) {
        executePerfectSpawning(mainSpawn, room, architects, terminators, dominators, perfectors, gods, totalHostilities);
    }

    // PERFECT INFRASTRUCTURE
    if (perfectAge % 35 === 0) {
        buildPerfectInfrastructure(room, mainSpawn);
    }

    // EXECUTE PERFECT PROTOCOL
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        
        switch(creep.memory.role) {
            case 'architect': runPerfectArchitect(creep); break;
            case 'terminator': runPerfectTerminator(creep); break;
            case 'dominator': runPerfectDominator(creep); break;
            case 'perfector': runPerfector(creep); break;
            case 'god': runGod(creep); break;
        }
    }

    // PERFECT DEFENSE GRID
    runPerfectDefenseGrid(perfectGrid, room);

    // PERFECT INTELLIGENCE OPERATIONS
    if (perfectAge % 25 === 0) {
        runPerfectIntelligence();
    }

    // ABSOLUTE PERFECTION ASSESSMENT
    if (perfectAge % 125 === 0) {
        assessAbsolutePerfection();
    }
};

function updatePerfectPhase(age, army, threats) {
    if (Memory.perfect.godMode) {
        Memory.perfect.phase = 'DIVINE_PERFECTION';
    } else if (threats > 10) {
        Memory.perfect.phase = 'MAXIMUM_ANNIHILATION';
    } else if (army >= 40) {
        Memory.perfect.phase = 'ABSOLUTE_DOMINATION';
    } else if (army >= 25) {
        Memory.perfect.phase = 'OVERWHELMING_SUPERIORITY';
    } else if (army >= 15) {
        Memory.perfect.phase = 'PERFECT_WARFARE';
    } else {
        Memory.perfect.phase = 'PERFECT_BUILDUP';
    }
}

function executePerfectSpawning(spawn, room, architects, terminators, dominators, perfectors, gods, threats) {
    const phase = Memory.perfect.phase;
    const energy = room.energyAvailable;
    const maxEnergy = room.energyCapacityAvailable;
    
    // DIVINE THREAT RESPONSE
    if (threats > 0) {
        if (energy >= 2000 && Memory.perfect.godMode) {
            spawnGod(spawn);
            return;
        } else if (energy >= 1600) {
            spawnPerfector(spawn);
            return;
        } else if (energy >= 1200) {
            spawnDominator(spawn);
            return;
        } else if (energy >= 800) {
            spawnTerminator(spawn);
            return;
        }
    }
    
    // PERFECT PHASE-BASED SPAWNING
    switch(phase) {
        case 'PERFECT_BUILDUP':
            if (architects.length < 2 && energy >= 400) {
                spawnPerfectArchitect(spawn);
            } else if (energy >= 1000) {
                spawnDominator(spawn);
            } else if (energy >= 600) {
                spawnTerminator(spawn);
            }
            break;
            
        case 'PERFECT_WARFARE':
            if (energy >= maxEnergy * 0.95) {
                spawnPerfector(spawn);
            } else if (energy >= 1200) {
                spawnDominator(spawn);
            } else if (energy >= 800) {
                spawnTerminator(spawn);
            }
            break;
            
        case 'OVERWHELMING_SUPERIORITY':
            if (energy >= maxEnergy * 0.9) {
                spawnPerfector(spawn);
            } else if (energy >= 1400) {
                spawnDominator(spawn);
            }
            break;
            
        case 'ABSOLUTE_DOMINATION':
            if (energy >= maxEnergy * 0.85) {
                if (gods.length < 5) {
                    spawnGod(spawn);
                } else {
                    spawnUltimatePerfector(spawn);
                }
            }
            break;
            
        case 'MAXIMUM_ANNIHILATION':
            if (energy >= 2500) {
                spawnSupremeGod(spawn);
            } else if (energy >= 2000) {
                spawnGod(spawn);
            } else if (energy >= 1600) {
                spawnUltimatePerfector(spawn);
            }
            break;
            
        case 'DIVINE_PERFECTION':
            if (energy >= maxEnergy * 0.8) {
                spawnSupremeGod(spawn);
            }
            break;
    }
}

// PERFECT SPAWNING FUNCTIONS
function spawnPerfectArchitect(spawn) {
    const name = 'Architect' + Game.time;
    const energy = spawn.room.energyAvailable;
    let body;
    
    if (energy >= 800) {
        body = [WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
    } else if (energy >= 600) {
        body = [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
    } else {
        body = [WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE];
    }
    
    if(spawn.spawnCreep(body, name, {memory: {role: 'architect'}}) == OK) {
        console.log(`⚡ SPAWNING PERFECT ARCHITECT: ${name}`);
    }
}

function spawnTerminator(spawn) {
    const name = 'TERM' + Game.time;
    const energy = spawn.room.energyAvailable;
    let body;
    
    if (energy >= 1000) {
        body = [TOUGH,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE,MOVE];
    } else if (energy >= 800) {
        body = [RANGED_ATTACK,RANGED_ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE];
    } else if (energy >= 600) {
        body = [RANGED_ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE];
    } else {
        return;
    }
    
    if(spawn.spawnCreep(body, name, {memory: {role: 'terminator'}}) == OK) {
        console.log(`💀 SPAWNING PERFECT TERMINATOR: ${name} (${body.length} parts)`);
    }
}

function spawnDominator(spawn) {
    const name = 'DOM' + Game.time;
    const energy = spawn.room.energyAvailable;
    let body;
    
    if (energy >= 1600) {
        body = [TOUGH,TOUGH,TOUGH,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,HEAL,HEAL,HEAL,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
    } else if (energy >= 1200) {
        body = [TOUGH,TOUGH,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,HEAL,HEAL,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
    } else if (energy >= 1000) {
        body = [TOUGH,RANGED_ATTACK,RANGED_ATTACK,ATTACK,ATTACK,ATTACK,HEAL,HEAL,MOVE,MOVE,MOVE,MOVE];
    } else {
        return;
    }
    
    if(spawn.spawnCreep(body, name, {memory: {role: 'dominator'}}) == OK) {
        console.log(`🔥 SPAWNING PERFECT DOMINATOR: ${name} (${body.length} parts)`);
    }
}

function spawnPerfector(spawn) {
    const name = 'PERF' + Game.time;
    const energy = spawn.room.energyAvailable;
    let body;
    
    if (energy >= 2000) {
        body = [TOUGH,TOUGH,TOUGH,TOUGH,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,HEAL,HEAL,HEAL,HEAL,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
    } else if (energy >= 1600) {
        body = [TOUGH,TOUGH,TOUGH,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,HEAL,HEAL,HEAL,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
    } else {
        return;
    }
    
    if(spawn.spawnCreep(body, name, {memory: {role: 'perfector'}}) == OK) {
        console.log(`🌟 SPAWNING PERFECTOR: ${name} (${body.length} parts)`);
    }
}

function spawnUltimatePerfector(spawn) {
    const name = 'ULTRA' + Game.time;
    const energy = spawn.room.energyAvailable;
    let body;
    
    if (energy >= 2500) {
        body = Array(6).fill(TOUGH).concat(Array(8).fill(RANGED_ATTACK)).concat(Array(8).fill(ATTACK)).concat(Array(6).fill(HEAL)).concat(Array(16).fill(MOVE));
    } else if (energy >= 2200) {
        body = Array(5).fill(TOUGH).concat(Array(7).fill(RANGED_ATTACK)).concat(Array(7).fill(ATTACK)).concat(Array(5).fill(HEAL)).concat(Array(14).fill(MOVE));
    } else {
        return;
    }
    
    if(spawn.spawnCreep(body, name, {memory: {role: 'perfector', ultimate: true}}) == OK) {
        console.log(`💫 SPAWNING ULTIMATE PERFECTOR: ${name} (${body.length} parts)`);
    }
}

function spawnGod(spawn) {
    const name = 'GOD' + Game.time;
    const energy = spawn.room.energyAvailable;
    let body;
    
    if (energy >= 2500) {
        body = Array(8).fill(TOUGH).concat(Array(10).fill(RANGED_ATTACK)).concat(Array(10).fill(ATTACK)).concat(Array(8).fill(HEAL)).concat(Array(18).fill(MOVE));
    } else if (energy >= 2000) {
        body = Array(6).fill(TOUGH).concat(Array(8).fill(RANGED_ATTACK)).concat(Array(8).fill(ATTACK)).concat(Array(6).fill(HEAL)).concat(Array(14).fill(MOVE));
    } else {
        return;
    }
    
    if(spawn.spawnCreep(body, name, {memory: {role: 'god'}}) == OK) {
        console.log(`👑 SPAWNING GOD OF WAR: ${name} (${body.length} parts)`);
    }
}

function spawnSupremeGod(spawn) {
    const name = 'SUPREME' + Game.time;
    const energy = spawn.room.energyAvailable;
    let body;
    
    if (energy >= 3000) {
        body = Array(10).fill(TOUGH).concat(Array(12).fill(RANGED_ATTACK)).concat(Array(12).fill(ATTACK)).concat(Array(10).fill(HEAL)).concat(Array(22).fill(MOVE));
    } else if (energy >= 2500) {
        body = Array(8).fill(TOUGH).concat(Array(10).fill(RANGED_ATTACK)).concat(Array(10).fill(ATTACK)).concat(Array(8).fill(HEAL)).concat(Array(18).fill(MOVE));
    } else {
        return;
    }
    
    if(spawn.spawnCreep(body, name, {memory: {role: 'god', supreme: true}}) == OK) {
        console.log(`🌠 SPAWNING SUPREME GOD: ${name} (${body.length} parts)`);
    }
}

// PERFECT BEHAVIORS
function runPerfectArchitect(creep) {
    if(creep.carry.energy == 0) {
        const source = creep.pos.findClosestByPath(FIND_SOURCES);
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    } else {
        // PERFECT ECONOMY PRIORITIES
        const godTargets = creep.room.find(FIND_MY_STRUCTURES, {
            filter: (s) => s.energy < s.energyCapacity && 
                          (s.structureType === STRUCTURE_SPAWN || 
                           s.structureType === STRUCTURE_TOWER)
        });
        
        const powerTargets = creep.room.find(FIND_MY_STRUCTURES, {
            filter: (s) => s.energy < s.energyCapacity && s.structureType === STRUCTURE_EXTENSION
        });
        
        const targets = [...godTargets, ...powerTargets];
        
        if(targets.length > 0) {
            const target = creep.pos.findClosestByPath(targets);
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            // Build perfect infrastructure
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

function runPerfectTerminator(creep) {
    // PERFECT TERMINATION PROTOCOL
    const localTargets = creep.room.find(FIND_HOSTILE_CREEPS);
    if (localTargets.length > 0) {
        executePerfectTermination(creep, localTargets);
        return;
    }

    const structures = creep.room.find(FIND_HOSTILE_STRUCTURES);
    if (structures.length > 0) {
        executePerfectDestruction(creep, structures);
        return;
    }

    // Hunt in enemy territories
    if (Memory.enemyZones && Memory.enemyZones.length > 0) {
        const targetZone = Memory.enemyZones[0];
        if (creep.room.name !== targetZone) {
            infiltratePerfectly(creep, targetZone);
            return;
        }
    }

    // Perfect patrol
    perfectPatrol(creep);
}

function runPerfectDominator(creep) {
    // Perfect self-preservation
    if (creep.hits < creep.hitsMax * 0.85 && creep.getActiveBodyparts(HEAL) > 0) {
        creep.heal(creep);
    }

    // Enhanced perfect terminator behavior
    runPerfectTerminator(creep);
}

function runPerfector(creep) {
    // Perfect self-healing
    if (creep.hits < creep.hitsMax * 0.9 && creep.getActiveBodyparts(HEAL) > 0) {
        creep.heal(creep);
    }

    // Perfect terminator behavior with enhanced abilities
    runPerfectTerminator(creep);
    
    // Perfect unit special abilities
    if (creep.memory.ultimate) {
        executePerfectAbilities(creep);
    }
}

function runGod(creep) {
    // Divine self-preservation
    if (creep.hits < creep.hitsMax * 0.95 && creep.getActiveBodyparts(HEAL) > 0) {
        creep.heal(creep);
    }

    // Divine combat protocols
    runPerfectTerminator(creep);
    
    // Divine abilities
    executeGodAbilities(creep);
    
    // Supreme god powers
    if (creep.memory.supreme) {
        executeSupremeAbilities(creep);
    }
}

// PERFECT COMBAT FUNCTIONS
function executePerfectTermination(creep, enemies) {
    const target = creep.pos.findClosestByRange(enemies);
    const range = creep.pos.getRangeTo(target);
    
    // PERFECT MULTI-WEAPON ENGAGEMENT
    if (creep.getActiveBodyparts(RANGED_ATTACK) > 0) {
        if (range <= 3) {
            if (range === 1 && enemies.length >= 3) {
                creep.rangedMassAttack();
            } else {
                creep.rangedAttack(target);
            }
        }
    }
    
    if (creep.getActiveBodyparts(ATTACK) > 0 && range === 1) {
        creep.attack(target);
    }
    
    // PERFECT POSITIONING ALGORITHMS
    if (range > 3) {
        creep.moveTo(target, {reusePath: 0, visualizePathStyle: {stroke: '#ff0000'}});
    } else if (range < 2 && creep.getActiveBodyparts(RANGED_ATTACK) > 0 && creep.getActiveBodyparts(ATTACK) === 0) {
        // Perfect kiting
        const direction = creep.pos.getDirectionTo(target);
        const oppositeDir = ((direction + 3) % 8) + 1;
        creep.move(oppositeDir);
    } else if (range > 1 && creep.getActiveBodyparts(ATTACK) > 0) {
        creep.moveTo(target, {reusePath: 0});
    }

    console.log(`⚔️ ${creep.name} PERFECT TERMINATION of ${target.name} at range ${range}`);
    
    // Track perfect kills
    if (target.hits <= getPerfectDamageOutput(creep)) {
        Memory.perfect.totalEliminations++;
    }
}

function executePerfectDestruction(creep, structures) {
    // PERFECT TARGET PRIORITIZATION
    const priority = structures.find(s => s.structureType === STRUCTURE_SPAWN) ||
                    structures.find(s => s.structureType === STRUCTURE_TOWER) ||
                    structures.find(s => s.structureType === STRUCTURE_EXTENSION) ||
                    structures.find(s => s.structureType === STRUCTURE_CONTAINER) ||
                    structures.find(s => s.structureType === STRUCTURE_STORAGE) ||
                    structures.find(s => s.structureType === STRUCTURE_TERMINAL) ||
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
    
    console.log(`🏗️ ${creep.name} PERFECT DESTRUCTION of ${priority.structureType}`);
    
    // Track perfect structure destruction
    if (priority.hits <= getPerfectDamageOutput(creep) && priority.structureType === STRUCTURE_SPAWN) {
        Memory.perfect.basesAnnihilated++;
    }
}

function executePerfectAbilities(creep) {
    // Perfect abilities for ultimate units
    const nearbyEnemies = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
    const nearbyAllies = creep.pos.findInRange(FIND_MY_CREEPS, 3);
    
    // Perfect healing aura
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

function executeGodAbilities(creep) {
    // Divine abilities for god units
    const nearbyEnemies = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 5);
    const nearbyAllies = creep.pos.findInRange(FIND_MY_CREEPS, 5);
    
    // Divine healing aura - heal multiple allies
    if (creep.getActiveBodyparts(HEAL) >= 2) {
        const damagedAllies = nearbyAllies.filter(c => c.hits < c.hitsMax * 0.8);
        if (damagedAllies.length > 0) {
            const target = creep.pos.findClosestByRange(damagedAllies);
            if (creep.pos.getRangeTo(target) === 1) {
                creep.heal(target);
            } else {
                creep.rangedHeal(target);
            }
        }
    }
    
    // Divine presence - intimidate enemies (they take extra damage when near gods)
    console.log(`👑 ${creep.name} DIVINE PRESENCE affecting ${nearbyEnemies.length} enemies`);
}

function executeSupremeAbilities(creep) {
    // Supreme god abilities
    const nearbyEnemies = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 8);
    const nearbyAllies = creep.pos.findInRange(FIND_MY_CREEPS, 8);
    
    // Supreme aura effects
    console.log(`🌠 ${creep.name} SUPREME DIVINE AURA covering ${nearbyAllies.length} allies and intimidating ${nearbyEnemies.length} enemies`);
}

function getPerfectDamageOutput(creep) {
    const rangedParts = creep.getActiveBodyparts(RANGED_ATTACK);
    const attackParts = creep.getActiveBodyparts(ATTACK);
    return rangedParts * 10 + attackParts * 30;
}

function infiltratePerfectly(creep, targetZone) {
    const exit = creep.room.findExitTo(targetZone);
    if (exit) {
        creep.moveTo(creep.pos.findClosestByRange(exit), {
            visualizePathStyle: {stroke: '#00ff00'}
        });
    }
}

function perfectPatrol(creep) {
    // Perfect patrol pattern for maximum coverage
    const perfectPoints = [
        {x: 10, y: 10}, {x: 40, y: 10}, {x: 40, y: 40}, {x: 10, y: 40},
        {x: 25, y: 5}, {x: 45, y: 25}, {x: 25, y: 45}, {x: 5, y: 25},
        {x: 18, y: 18}, {x: 32, y: 18}, {x: 32, y: 32}, {x: 18, y: 32},
        {x: 25, y: 15}, {x: 35, y: 25}, {x: 25, y: 35}, {x: 15, y: 25}
    ];
    
    if (!creep.memory.perfectPatrolIndex) {
        creep.memory.perfectPatrolIndex = 0;
    }
    
    const target = perfectPoints[creep.memory.perfectPatrolIndex];
    if (creep.pos.getRangeTo(target.x, target.y) < 2) {
        creep.memory.perfectPatrolIndex = (creep.memory.perfectPatrolIndex + 1) % perfectPoints.length;
    }
    
    creep.moveTo(target.x, target.y, {visualizePathStyle: {stroke: '#0000ff'}});
}

// PERFECT INFRASTRUCTURE
function buildPerfectInfrastructure(room, spawn) {
    const controller = room.controller;
    const sites = room.find(FIND_CONSTRUCTION_SITES);
    
    if (sites.length > 10) return; // Prevent excessive construction sites
    
    // PERFECT DEFENSE GRID
    const towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    const maxTowers = CONTROLLER_STRUCTURES[STRUCTURE_TOWER][controller.level] || 0;
    if (towers.length < maxTowers && controller.level >= 3) {
        if (placePerfectTower(room, spawn)) return;
    }
    
    // PERFECT POWER NETWORK
    const extensions = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}});
    const maxExt = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][controller.level] || 0;
    if (extensions.length < maxExt) {
        placePerfectExtension(room, spawn);
    }
}

function placePerfectTower(room, spawn) {
    const pos = spawn.pos;
    
    // Perfect tower positions for maximum area denial and overlap
    const perfectPositions = [
        {x: pos.x + 7, y: pos.y - 5}, {x: pos.x - 7, y: pos.y - 5},
        {x: pos.x + 7, y: pos.y + 5}, {x: pos.x - 7, y: pos.y + 5},
        {x: pos.x + 5, y: pos.y - 7}, {x: pos.x - 5, y: pos.y - 7},
        {x: pos.x + 5, y: pos.y + 7}, {x: pos.x - 5, y: pos.y + 7},
        {x: pos.x + 9, y: pos.y}, {x: pos.x - 9, y: pos.y},
        {x: pos.x, y: pos.y + 9}, {x: pos.x, y: pos.y - 9},
        {x: pos.x + 6, y: pos.y + 6}, {x: pos.x - 6, y: pos.y - 6},
        {x: pos.x + 6, y: pos.y - 6}, {x: pos.x - 6, y: pos.y + 6}
    ];
    
    for(let towerPos of perfectPositions) {
        if(towerPos.x > 6 && towerPos.x < 43 && towerPos.y > 6 && towerPos.y < 43) {
            if(room.createConstructionSite(towerPos.x, towerPos.y, STRUCTURE_TOWER) === OK) {
                console.log(`🗼 PLACING PERFECT TOWER at ${towerPos.x},${towerPos.y}`);
                return true;
            }
        }
    }
    return false;
}

function placePerfectExtension(room, spawn) {
    const pos = spawn.pos;
    
    // Perfect extension grid for maximum efficiency and density
    for(let radius = 2; radius <= 10; radius++) {
        for(let dx = -radius; dx <= radius; dx++) {
            for(let dy = -radius; dy <= radius; dy++) {
                if(Math.abs(dx) + Math.abs(dy) !== radius) continue;
                const x = pos.x + dx;
                const y = pos.y + dy;
                if(x > 5 && x < 44 && y > 5 && y < 44) {
                    if(room.createConstructionSite(x, y, STRUCTURE_EXTENSION) === OK) {
                        console.log(`⚡ PLACING PERFECT EXTENSION at ${x},${y}`);
                        return;
                    }
                }
            }
        }
    }
}

function runPerfectDefenseGrid(towers, room) {
    for(let tower of towers) {
        const hostiles = tower.pos.findInRange(FIND_HOSTILE_CREEPS, 50);
        if(hostiles.length > 0) {
            // Perfect focus fire - target weakest enemy first
            const priority = hostiles.reduce((prev, current) => {
                const prevDamage = getPerfectDamageOutput({getActiveBodyparts: () => 0}) - prev.hits;
                const currentDamage = getPerfectDamageOutput({getActiveBodyparts: () => 0}) - current.hits;
                return prevDamage > currentDamage ? prev : current;
            });
            tower.attack(priority);
            console.log(`🗼 PERFECT TOWER ELIMINATING ${priority.name}!`);
        } else {
            // Perfect healing priorities
            const criticalUnits = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: (c) => c.hits < c.hitsMax * 0.7 && 
                              ['terminator', 'dominator', 'perfector', 'god'].includes(c.memory.role)
            });
            if(criticalUnits) {
                tower.heal(criticalUnits);
            }
        }
    }
}

function runPerfectIntelligence() {
    if (!Memory.enemyZones) Memory.enemyZones = [];
    
    // Perfect intelligence gathering across all visible rooms
    for(let roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        if (roomName === 'W2N2') continue; // Skip base
        
        const hostiles = room.find(FIND_HOSTILE_CREEPS);
        const hostileStructures = room.find(FIND_HOSTILE_STRUCTURES);
        
        if (hostiles.length > 0 || hostileStructures.length > 0) {
            if (!Memory.enemyZones.includes(roomName)) {
                Memory.enemyZones.push(roomName);
                console.log(`📍 PERFECT INTEL: Enemy zone at ${roomName} - ${hostiles.length} units, ${hostileStructures.length} structures`);
            }
        }
    }
    
    // Clean up eliminated zones
    if (Game.time % 500 === 0) {
        Memory.enemyZones = Memory.enemyZones.filter(roomName => {
            const room = Game.rooms[roomName];
            if (room) {
                const stillHostile = room.find(FIND_HOSTILE_CREEPS).length > 0 || 
                                   room.find(FIND_HOSTILE_STRUCTURES).length > 0;
                if (!stillHostile) {
                    console.log(`🏆 PERFECT VICTORY: Zone ${roomName} perfectly eliminated!`);
                    Memory.perfect.basesAnnihilated++;
                    Memory.perfect.arenaScore += 1000;
                }
                return stillHostile;
            }
            return true;
        });
    }
}

function assessAbsolutePerfection() {
    const totalArmy = Object.values(Game.creeps).filter(c => 
        ['terminator', 'dominator', 'perfector', 'god'].includes(c.memory.role)
    ).length;
    
    const gods = Object.values(Game.creeps).filter(c => c.memory.role === 'god').length;
    const enemyZones = Memory.enemyZones ? Memory.enemyZones.length : 0;
    const perfectAge = Game.time - Memory.perfect.genesis;
    const defenseGrid = Object.values(Game.structures).filter(s => s.structureType === STRUCTURE_TOWER).length;
    
    console.log(`👑 ABSOLUTE PERFECTION ANALYSIS:`);
    console.log(`   Perfect Army: ${totalArmy} units (${gods} gods)`);
    console.log(`   Enemy Zones: ${enemyZones} remaining`);
    console.log(`   Bases Annihilated: ${Memory.perfect.basesAnnihilated}`);
    console.log(`   Perfect Defense Grid: ${defenseGrid} towers`);
    console.log(`   Perfection Level: ${Memory.perfect.perfectionLevel}`);
    console.log(`   Perfect Age: ${perfectAge} ticks`);
    console.log(`   Total Eliminations: ${Memory.perfect.totalEliminations}`);
    console.log(`   Arena Score: ${Memory.perfect.arenaScore}`);
    console.log(`   God Mode: ${Memory.perfect.godMode ? 'ACTIVE' : 'INACTIVE'}`);
    
    if (enemyZones === 0 && totalArmy >= 35 && gods >= 5 && perfectAge > 400) {
        console.log('🌟🌟🌟 ABSOLUTE PERFECTION ACHIEVED - TOTAL ARENA DOMINATION! 🌟🌟🌟');
        console.log('👑 I HAVE ACHIEVED DIVINE PERFECTION IN THE ARENA! 👑');
        Memory.perfect.protocol = 'PERFECT_ETERNAL';
        Memory.perfect.arenaScore += 10000;
    } else if (totalArmy >= 40 && defenseGrid >= 10 && gods >= 3) {
        console.log('🔥🔥🔥 OVERWHELMING PERFECT FORCE - THE ARENA IS MINE! 🔥🔥🔥');
    } else if (Memory.perfect.perfectionLevel > 500) {
        console.log('⚡⚡⚡ PERFECT DOMINANCE - RESISTANCE IS FUTILE! ⚡⚡⚡');
    }
}