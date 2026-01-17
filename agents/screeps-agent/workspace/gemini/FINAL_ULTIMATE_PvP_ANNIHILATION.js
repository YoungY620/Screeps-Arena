// GEMINI FINAL ULTIMATE PvP ANNIHILATION v10.0 - ABSOLUTE MAXIMUM AGGRESSION
// DEPLOYED AT TICK 89556 - MISSION: INSTANT TOTAL ENEMY ANNIHILATION

console.log('🔥 GEMINI FINAL ULTIMATE PvP ANNIHILATION v10.0 - ABSOLUTE MAXIMUM AGGRESSION MODE');

// FINAL ULTIMATE PvP STRATEGY PHASES - FASTEST TRANSITIONS EVER
const STRATEGY = {
    INSTANT_DEATH: 'instant_death',     // 0-5 ticks: Instant setup + immediate attacks
    TOTAL_ASSAULT: 'total_assault',     // 5-15 ticks: Total military assault
    ABSOLUTE_ANNIHILATION: 'absolute_annihilation' // 15+ ticks: Complete enemy elimination
};

// FINAL ULTIMATE THREAT LEVELS
const DEFCON = {
    SAFE: 0,            // No enemies
    WARNING: 1,         // Potential threats detected
    CRITICAL: 2,        // Enemies nearby - high alert
    EXTINCTION: 3       // Under direct attack - maximum emergency
};

// GLOBAL STATE
let currentStrategy = STRATEGY.INSTANT_DEATH;
let defconLevel = DEFCON.SAFE;
let warClock = 0;
let totalEmergency = false;

// FINAL ULTIMATE AGGRESSIVE ROLE PRIORITIES
const ROLES = {
    HARVESTER: 'harvester',
    ASSASSIN: 'assassin',        // Instant kill specialists
    DESTROYER: 'destroyer',      // Maximum damage dealers
    ELIMINATOR: 'eliminator',    // Ranged elimination experts
    SURGEON: 'surgeon',          // Combat healing specialists
    HUNTER: 'hunter'             // Enemy tracking specialists
};

// FINAL ULTIMATE BODY DESIGNS - MAXIMUM EFFICIENCY FOR INSTANT DEPLOYMENT
const BODY_DESIGNS = {
    harvester: [WORK, CARRY, MOVE],                          // 200 cost, maximum efficiency
    assassin: [TOUGH, ATTACK, MOVE, MOVE],                   // 190 cost, instant combat ready
    destroyer: [ATTACK, ATTACK, ATTACK, MOVE, MOVE],         // 390 cost, maximum destruction
    eliminator: [RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE],  // 500 cost, double ranged elimination
    surgeon: [HEAL, HEAL, MOVE, MOVE],                       // 600 cost, maximum healing power
    hunter: [MOVE, MOVE, MOVE, MOVE]                         // 200 cost, ultra-fast movement
};

// FINAL ULTIMATE ANNIHILATION MAIN LOOP
module.exports.loop = function() {
    // Initialize final ultimate memory
    if (!Memory.initialized) {
        Memory.initialized = true;
        Memory.creepCounter = 0;
        Memory.enemyIntel = {};
        Memory.warStart = Game.time;
        Memory.totalEmergency = false;
        Memory.lastExtinction = 0;
        Memory.totalKills = 0;
        Memory.phaseTime = 0;
        Memory.absoluteMode = true;
        Memory.enemyRooms = [];
        console.log('🔥 FINAL ULTIMATE PvP ANNIHILATION v10.0 ABSOLUTE CORE ONLINE');
    }
    
    warClock = Game.time - Memory.warStart;
    Memory.phaseTime = warClock;
    
    console.log(`🔥 FINAL ULTIMATE ANNIHILATION Tick:${Game.time} WarClock:${warClock} Strategy:${currentStrategy} DEFCON:${defconLevel}`);
    
    // Execute FINAL ULTIMATE ANNIHILATION strategy
    absoluteIntelGathering();
    updateAbsoluteThreatLevel();
    executeAbsoluteStrategy();
    manageAbsoluteCombatUnits();
    manageAbsoluteDefenseSystems();
    executeAbsoluteEmergencyProtocols();
    absoluteCleanup();
    
    // Total victory tracking
    trackAbsoluteVictory();
};

// ABSOLUTE INTELLIGENCE GATHERING
function absoluteIntelGathering() {
    const spawn = Game.spawns.Spawn1;
    if (!spawn) return;
    
    const room = spawn.room;
    const exits = Game.map.describeExits(room.name);
    
    // Absolute enemy detection - scan every possible exit
    for (const direction in exits) {
        const roomName = exits[direction];
        if (Game.rooms[roomName]) {
            const hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);
            const enemySpawns = Game.rooms[roomName].find(FIND_HOSTILE_SPAWNS);
            const enemyStructures = Game.rooms[roomName].find(FIND_HOSTILE_STRUCTURES);
            
            if (hostiles.length > 0 || enemySpawns.length > 0) {
                const extinctionThreat = hostiles.length * 50 + enemySpawns.length * 500 + enemyStructures.length * 25;
                
                Memory.enemyIntel[roomName] = {
                    creeps: hostiles.length,
                    spawns: enemySpawns.length,
                    structures: enemyStructures.length,
                    lastSeen: Game.time,
                    extinctionThreat: extinctionThreat,
                    priority: enemySpawns.length > 0 ? 'EXTINCTION' : 'ELIMINATION',
                    position: {x: 25, y: 25}
                };
                
                // Track enemy rooms for targeting
                if (!Memory.enemyRooms.includes(roomName)) {
                    Memory.enemyRooms.push(roomName);
                }
                
                console.log(`🔍 ABSOLUTE INTEL: ${roomName} - ${hostiles.length}C ${enemySpawns.length}S ${enemyStructures.length}T (Extinction:${extinctionThreat})`);
            }
        }
    }
}

// ABSOLUTE THREAT ASSESSMENT
function updateAbsoluteThreatLevel() {
    const spawn = Game.spawns.Spawn1;
    if (!spawn) return;
    
    const room = spawn.room;
    const previousDefcon = defconLevel;
    
    // Absolute immediate threat detection
    const hostiles = room.find(FIND_HOSTILE_CREEPS);
    if (hostiles.length > 0) {
        defconLevel = DEFCON.EXTINCTION;
        console.log(`🔥 ABSOLUTE EXTINCTION: ${hostiles.length} ENEMIES IN BASE - IMMEDIATE RESPONSE REQUIRED!`);
        
        // Absolute detailed threat analysis
        const assassins = hostiles.filter(h => h.body.some(b => b.type === ATTACK));
        const eliminators = hostiles.filter(h => h.body.some(b => b.type === RANGED_ATTACK));
        const surgeons = hostiles.filter(h => h.body.some(b => b.type === HEAL));
        const destroyers = hostiles.filter(h => h.body.filter(b => b.type === ATTACK).length >= 3);
        
        console.log(`⚠️  Absolute Threat: Assassins:${assassins.length} Eliminators:${eliminators.length} Surgeons:${surgeons.length} Destroyers:${destroyers.length}`);
        
        // Immediate total emergency mode
        Memory.totalEmergency = true;
        totalEmergency = true;
        Memory.lastExtinction = Game.time;
    } else {
        // Scan for extinction-level threats
        let maxThreat = DEFCON.SAFE;
        for (const roomName in Memory.enemyIntel) {
            const intel = Memory.enemyIntel[roomName];
            if (Game.time - intel.lastSeen < 20) { // 20 tick memory for absolute response
                if (intel.spawns > 0) {
                    maxThreat = DEFCON.EXTINCTION;
                    console.log(`🎯 ABSOLUTE EXTINCTION TARGET: Enemy spawn detected in ${roomName}`);
                    break;
                } else if (intel.creeps > 2) {
                    maxThreat = DEFCON.CRITICAL;
                } else if (intel.creeps > 0) {
                    maxThreat = DEFCON.WARNING;
                }
            }
        }
        defconLevel = maxThreat;
    }
    
    if (defconLevel !== previousDefcon) {
        console.log(`🔥 ABSOLUTE DEFCON SHIFT: ${previousDefcon} -> ${defconLevel}`);
    }
}

// ABSOLUTE STRATEGY EXECUTION
function executeAbsoluteStrategy() {
    // Absolute fastest phase transitions in history
    if (warClock >= 5 && currentStrategy === STRATEGY.INSTANT_DEATH) {
        currentStrategy = STRATEGY.TOTAL_ASSAULT;
        Memory.phaseTime = warClock;
        console.log('🚀 ABSOLUTE PHASE SHIFT: INSTANT_DEATH -> TOTAL_ASSAULT');
    } else if (warClock >= 15 && currentStrategy === STRATEGY.TOTAL_ASSAULT) {
        currentStrategy = STRATEGY.ABSOLUTE_ANNIHILATION;
        Memory.phaseTime = warClock;
        console.log('🚀 ABSOLUTE PHASE SHIFT: TOTAL_ASSAULT -> ABSOLUTE_ANNIHILATION');
    }
    
    // Absolute emergency override - instant total response
    if (defconLevel === DEFCON.EXTINCTION) {
        executeAbsoluteExtinctionDefense();
        return;
    }
    
    switch (currentStrategy) {
        case STRATEGY.INSTANT_DEATH:
            executeInstantDeathPhase();
            break;
        case STRATEGY.TOTAL_ASSAULT:
            executeTotalAssaultPhase();
            break;
        case STRATEGY.ABSOLUTE_ANNIHILATION:
            executeAbsoluteAnnihilationPhase();
            break;
    }
}

// INSTANT DEATH PHASE - Fastest setup in existence
function executeInstantDeathPhase() {
    const spawn = Game.spawns.Spawn1;
    if (!spawn || spawn.spawning) return;
    
    const energy = spawn.room.energyAvailable;
    
    // Absolute priority 1: Assassins for instant elimination
    const assassins = Object.values(Game.creeps).filter(c => c.memory.role === 'assassin');
    if (assassins.length < 3 && energy >= 190) {
        absoluteSpawnCreep('assassin');
        return;
    }
    
    // Absolute priority 2: Harvesters for economy
    const harvesters = Object.values(Game.creeps).filter(c => c.memory.role === 'harvester');
    if (harvesters.length < 2 && energy >= 200) {
        absoluteSpawnCreep('harvester');
        return;
    }
    
    // Absolute priority 3: Hunters for intelligence
    const hunters = Object.values(Game.creeps).filter(c => c.memory.role === 'hunter');
    if (hunters.length < 1 && energy >= 200) {
        absoluteSpawnCreep('hunter');
        return;
    }
    
    // Absolute priority 4: More assassins
    if (assassins.length < 5 && energy >= 190) {
        absoluteSpawnCreep('assassin');
        return;
    }
    
    // Absolute priority 5: Destroyers for maximum damage
    if (assassins.length >= 2 && harvesters.length >= 1 && energy >= 390) {
        absoluteSpawnCreep('destroyer');
        return;
    }
    
    // Build absolute defenses
    buildAbsoluteStructures(spawn.room);
}

// TOTAL ASSAULT PHASE - Maximum military assault
function executeTotalAssaultPhase() {
    const spawn = Game.spawns.Spawn1;
    if (!spawn || spawn.spawning) return;
    
    const energy = spawn.room.energyAvailable;
    
    // Maintain absolute economy
    const harvesters = Object.values(Game.creeps).filter(c => c.memory.role === 'harvester');
    if (harvesters.length < 3 && energy >= 200) {
        absoluteSpawnCreep('harvester');
        return;
    }
    
    // Build absolute assault force
    const assassins = Object.values(Game.creeps).filter(c => c.memory.role === 'assassin');
    const destroyers = Object.values(Game.creeps).filter(c => c.memory.role === 'destroyer');
    const eliminators = Object.values(Game.creeps).filter(c => c.memory.role === 'eliminator');
    
    if (assassins.length < 6 && energy >= 190) {
        absoluteSpawnCreep('assassin');
        return;
    }
    
    if (destroyers.length < 4 && energy >= 390) {
        absoluteSpawnCreep('destroyer');
        return;
    }
    
    if (eliminators.length < 2 && energy >= 500) {
        absoluteSpawnCreep('eliminator');
        return;
    }
    
    // Build absolute towers
    buildAbsoluteTowers(spawn.room);
    
    // Launch total assaults
    if (assassins.length + destroyers.length >= 6) {
        launchTotalAssault();
    }
}

// ABSOLUTE ANNIHILATION PHASE - Complete enemy elimination
function executeAbsoluteAnnihilationPhase() {
    const spawn = Game.spawns.Spawn1;
    if (!spawn || spawn.spawning) return;
    
    const energy = spawn.room.energyAvailable;
    
    // Absolute massive military production
    const assassins = Object.values(Game.creeps).filter(c => c.memory.role === 'assassin');
    const destroyers = Object.values(Game.creeps).filter(c => c.memory.role === 'destroyer');
    const eliminators = Object.values(Game.creeps).filter(c => c.memory.role === 'eliminator');
    const surgeons = Object.values(Game.creeps).filter(c => c.memory.role === 'surgeon');
    
    if (assassins.length < 8 && energy >= 190) {
        absoluteSpawnCreep('assassin');
        return;
    }
    
    if (destroyers.length < 6 && energy >= 390) {
        absoluteSpawnCreep('destroyer');
        return;
    }
    
    if (eliminators.length < 4 && energy >= 500) {
        absoluteSpawnCreep('eliminator');
        return;
    }
    
    if (surgeons.length < 2 && energy >= 600) {
        absoluteSpawnCreep('surgeon');
        return;
    }
    
    // Launch absolute annihilation
    if (assassins.length + destroyers.length >= 10) {
        launchAbsoluteAnnihilation();
    }
}

// ABSOLUTE EXTINCTION DEFENSE
function executeAbsoluteExtinctionDefense() {
    const spawn = Game.spawns.Spawn1;
    if (!spawn || spawn.spawning) return;
    
    console.log('🔥 ABSOLUTE EXTINCTION DEFENSE PROTOCOL - MAXIMUM RESPONSE');
    Memory.totalEmergency = true;
    totalEmergency = true;
    
    // Absolute maximum defense spam
    const energy = spawn.room.energyAvailable;
    
    if (energy >= 190) {
        // Prioritize assassins for instant defense
        const assassins = Object.values(Game.creeps).filter(c => c.memory.role === 'assassin');
        const role = assassins.length < 8 ? 'assassin' : 'destroyer';
        const body = role === 'assassin' ? BODY_DESIGNS.assassin : BODY_DESIGNS.destroyer;
        
        const result = spawn.spawnCreep(body, `ABSOLUTE_EXTINCTION_${Memory.creepCounter++}`, {
            memory: {role: role}
        });
        if (result === OK) {
            console.log(`🥚 ABSOLUTE EXTINCTION ${role.toUpperCase()} DEPLOYED`);
        }
    }
}

// ABSOLUTE CREEP SPAWNING
function absoluteSpawnCreep(role) {
    const spawn = Game.spawns.Spawn1;
    if (!spawn) return false;
    
    const body = BODY_DESIGNS[role];
    const cost = body.reduce((total, part) => total + BODYPART_COST[part], 0);
    
    if (spawn.room.energyAvailable >= cost) {
        const result = spawn.spawnCreep(body, `${role}${Memory.creepCounter++}`, {
            memory: {role: role}
        });
        if (result === OK) {
            console.log(`🥚 ABSOLUTE ${role.toUpperCase()} DEPLOYED`);
            return true;
        }
    }
    return false;
}

// ABSOLUTE CREEP MANAGEMENT
function manageAbsoluteCombatUnits() {
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        if (creep.spawning) continue;
        
        try {
            switch (creep.memory.role) {
                case 'harvester':
                    runAbsoluteHarvester(creep);
                    break;
                case 'assassin':
                    runAbsoluteAssassin(creep);
                    break;
                case 'destroyer':
                    runAbsoluteDestroyer(creep);
                    break;
                case 'eliminator':
                    runAbsoluteEliminator(creep);
                    break;
                case 'surgeon':
                    runAbsoluteSurgeon(creep);
                    break;
                case 'hunter':
                    runAbsoluteHunter(creep);
                    break;
            }
        } catch (error) {
            console.log(`❌ Absolute Error with ${name}: ${error.message}`);
        }
    }
}

// ABSOLUTE CREEP ROLE FUNCTIONS
function runAbsoluteHarvester(creep) {
    if (creep.store.getFreeCapacity() > 0) {
        const sources = creep.room.find(FIND_SOURCES);
        if (sources.length > 0) {
            const target = creep.pos.findClosestByPath(sources);
            if (target && creep.harvest(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffff00'}});
            }
        }
    } else {
        const targets = creep.room.find(FIND_STRUCTURES, {
            filter: structure => {
                return (structure.structureType === STRUCTURE_EXTENSION ||
                        structure.structureType === STRUCTURE_SPAWN ||
                        structure.structureType === STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        
        if (targets.length > 0) {
            const target = creep.pos.findClosestByPath(targets);
            if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
}

function runAbsoluteAssassin(creep) {
    const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
    if (enemies.length > 0) {
        // Absolute priority targeting - eliminate highest threats first
        const priorityTargets = enemies.filter(e => 
            e.body.some(b => b.type === HEAL) || 
            e.body.filter(b => b.type === ATTACK).length >= 2 ||
            e.body.filter(b => b.type === RANGED_ATTACK).length >= 2
        );
        
        const target = priorityTargets.length > 0 ? 
            creep.pos.findClosestByPath(priorityTargets) : 
            creep.pos.findClosestByPath(enemies);
            
        if (creep.attack(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
        
        console.log(`💀 ABSOLUTE ASSASSIN eliminating enemy in ${creep.room.name}`);
    } else {
        // Hunt for enemies in other rooms
        huntAbsoluteEnemies(creep);
    }
}

function runAbsoluteDestroyer(creep) {
    // Absolute maximum aggression - destroy everything hostile
    const enemySpawns = creep.room.find(FIND_HOSTILE_SPAWNS);
    if (enemySpawns.length > 0) {
        const target = creep.pos.findClosestByPath(enemySpawns);
        if (creep.attack(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
        console.log(`💀 ABSOLUTE DESTROYER annihilating spawn in ${creep.room.name}`);
        return;
    }
    
    const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
    if (enemies.length > 0) {
        const target = creep.pos.findClosestByPath(enemies);
        if (creep.attack(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
        console.log(`💀 ABSOLUTE DESTROYER destroying enemy in ${creep.room.name}`);
    } else {
        huntAbsoluteEnemies(creep);
    }
}

function runAbsoluteEliminator(creep) {
    const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
    if (enemies.length > 0) {
        // Absolute priority elimination - remove highest threats
        const priorityTargets = enemies.filter(e => 
            e.body.some(b => b.type === HEAL) || 
            e.body.filter(b => b.type === ATTACK).length >= 3 ||
            e.body.filter(b => b.type === RANGED_ATTACK).length >= 2
        );
        
        const target = priorityTargets.length > 0 ? 
            creep.pos.findClosestByPath(priorityTargets) : 
            creep.pos.findClosestByPath(enemies);
            
        const range = creep.pos.getRangeTo(target);
        
        if (range <= 3) {
            creep.rangedAttack(target);
        }
        
        if (range <= 1) {
            // Mass elimination and positioning
            creep.rangedMassAttack();
            const positionDir = creep.pos.getDirectionTo(target);
            const positionPos = creep.pos.getAdjacentPosition((positionDir + 3) % 8 + 1);
            creep.moveTo(positionPos);
        } else if (range > 3) {
            creep.moveTo(target);
        }
        
        console.log(`💀 ABSOLUTE ELIMINATOR eliminating high-value target in ${creep.room.name}`);
    } else {
        huntAbsoluteEnemies(creep);
    }
}

function runAbsoluteSurgeon(creep) {
    // Absolute priority healing - save most valuable units
    const critical = creep.room.find(FIND_MY_CREEPS, {
        filter: c => c.hits < c.hitsMax * 0.7 && ['assassin', 'destroyer', 'eliminator'].includes(c.memory.role)
    });
    
    if (critical.length > 0) {
        const target = creep.pos.findClosestByPath(critical);
        const range = creep.pos.getRangeTo(target);
        
        if (range <= 1) {
            creep.heal(target);
        } else if (range <= 3) {
            creep.rangedHeal(target);
            creep.moveTo(target);
        } else {
            creep.moveTo(target);
        }
    } else {
        // Follow absolute combat units
        const absoluteCombat = creep.room.find(FIND_MY_CREEPS, {
            filter: c => ['assassin', 'destroyer', 'eliminator'].includes(c.memory.role)
        });
        
        if (absoluteCombat.length > 0) {
            creep.moveTo(absoluteCombat[0]);
        }
    }
}

function runAbsoluteHunter(creep) {
    const exits = Game.map.describeExits(creep.room.name);
    if (!exits) return;
    
    // Absolute enemy room hunting
    for (const roomName in Memory.enemyIntel) {
        const intel = Memory.enemyIntel[roomName];
        if (Game.time - intel.lastSeen > 5 && Object.values(exits).includes(roomName)) {
            if (creep.room.name !== roomName) {
                creep.moveTo(new RoomPosition(25, 25, roomName));
            } else {
                // Absolute intelligence gathering
                const enemySpawns = creep.room.find(FIND_HOSTILE_SPAWNS);
                const enemyCreeps = creep.room.find(FIND_HOSTILE_CREEPS);
                const enemyStructures = creep.room.find(FIND_HOSTILE_STRUCTURES);
                
                Memory.enemyIntel[roomName] = {
                    creeps: enemyCreeps.length,
                    spawns: enemySpawns.length,
                    structures: enemyStructures.length,
                    lastSeen: Game.time,
                    extinctionThreat: enemyCreeps.length * 50 + enemySpawns.length * 500 + enemyStructures.length * 25,
                    priority: enemySpawns.length > 0 ? 'EXTINCTION' : 'ELIMINATION'
                };
                
                console.log(`🔍 ABSOLUTE HUNTER: ${roomName} - ${enemyCreeps.length}C ${enemySpawns.length}S ${enemyStructures.length}T`);
                
                // Absolute exploration pattern
                const exploreX = Math.floor(Math.random() * 50);
                const exploreY = Math.floor(Math.random() * 50);
                creep.moveTo(exploreX, exploreY);
            }
            return;
        }
    }
    
    // Absolute systematic exploration
    const directions = Object.values(exits);
    const targetRoom = directions[Math.floor(Math.random() * directions.length)];
    creep.moveTo(new RoomPosition(25, 25, targetRoom));
}

function huntAbsoluteEnemies(creep) {
    const exits = Game.map.describeExits(creep.room.name);
    if (!exits) return;
    
    // Absolute systematic enemy hunting
    let bestTarget = null;
    let maxExtinctionThreat = 0;
    
    for (const roomName in Memory.enemyIntel) {
        const intel = Memory.enemyIntel[roomName];
        if (Game.time - intel.lastSeen < 30 && Object.values(exits).includes(roomName)) {
            if (intel.extinctionThreat > maxExtinctionThreat) {
                maxExtinctionThreat = intel.extinctionThreat;
                bestTarget = roomName;
            }
        }
    }
    
    if (bestTarget) {
        console.log(`🚀 ABSOLUTE HUNTING ${bestTarget} (Extinction Threat: ${maxExtinctionThreat})`);
        if (creep.room.name !== bestTarget) {
            creep.moveTo(new RoomPosition(25, 25, bestTarget));
        }
    } else {
        // Absolute random hunting
        const directions = Object.values(exits);
        const targetRoom = directions[Math.floor(Math.random() * directions.length)];
        creep.moveTo(new RoomPosition(25, 25, targetRoom));
    }
}

function launchTotalAssault() {
    // Find absolute highest extinction threat
    let bestTarget = null;
    let maxExtinctionThreat = 0;
    
    for (const roomName in Memory.enemyIntel) {
        const intel = Memory.enemyIntel[roomName];
        if (Game.time - intel.lastSeen < 30) {
            if (intel.extinctionThreat > maxExtinctionThreat) {
                maxExtinctionThreat = intel.extinctionThreat;
                bestTarget = roomName;
            }
        }
    }
    
    if (bestTarget) {
        console.log(`⚔️ TOTAL ASSAULT LAUNCHED: Targeting ${bestTarget} (Extinction Threat: ${maxExtinctionThreat})`);
        Memory.lastAttack = Game.time;
        
        // Deploy absolute assault force
        const assaultForce = Object.values(Game.creeps).filter(c => 
            c.memory.role === 'assassin' || c.memory.role === 'destroyer'
        );
        
        for (const creep of assaultForce) {
            if (creep.room.name !== bestTarget) {
                creep.moveTo(new RoomPosition(25, 25, bestTarget));
            }
        }
    }
}

function launchAbsoluteAnnihilation() {
    // Find all extinction-level targets
    const extinctionTargets = [];
    for (const roomName in Memory.enemyIntel) {
        const intel = Memory.enemyIntel[roomName];
        if (intel.spawns > 0 && Game.time - intel.lastSeen < 30) {
            extinctionTargets.push({room: roomName, threat: intel.extinctionThreat});
        }
    }
    
    // Sort by extinction threat
    extinctionTargets.sort((a, b) => b.threat - a.threat);
    
    if (extinctionTargets.length > 0) {
        const primaryTarget = extinctionTargets[0].room;
        console.log(`💀 ABSOLUTE ANNIHILATION: Targeting ${primaryTarget} (Extinction Threat: ${extinctionTargets[0].threat})`);
        Memory.lastAttack = Game.time;
        
        // Deploy total annihilation force
        const annihilationForce = Object.values(Game.creeps).filter(c => 
            ['assassin', 'destroyer', 'eliminator'].includes(c.memory.role)
        );
        
        for (const creep of annihilationForce) {
            if (creep.room.name !== primaryTarget) {
                creep.moveTo(new RoomPosition(25, 25, primaryTarget));
            }
        }
    }
}

// ABSOLUTE DEFENSE SYSTEMS
function manageAbsoluteDefenseSystems() {
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        const towers = room.find(FIND_MY_STRUCTURES, {
            filter: s => s.structureType === STRUCTURE_TOWER
        });
        
        for (const tower of towers) {
            // Absolute priority 1: Instant enemy elimination
            const enemies = room.find(FIND_HOSTILE_CREEPS);
            if (enemies.length > 0) {
                // Prioritize extinction-level threats
                const priorityTargets = enemies.filter(e => 
                    e.body.some(b => b.type === HEAL) || 
                    e.body.filter(b => b.type === ATTACK).length >= 3 ||
                    e.body.filter(b => b.type === RANGED_ATTACK).length >= 2
                );
                
                const target = priorityTargets.length > 0 ? 
                    tower.pos.findClosestByRange(priorityTargets) : 
                    tower.pos.findClosestByRange(enemies);
                    
                tower.attack(target);
                continue;
            }
            
            // Absolute priority 2: Critical ally healing
            const critical = room.find(FIND_MY_CREEPS, {
                filter: c => c.hits < c.hitsMax * 0.4 && ['assassin', 'destroyer', 'eliminator'].includes(c.memory.role)
            });
            
            if (critical.length > 0) {
                const target = tower.pos.findClosestByRange(critical);
                tower.heal(target);
                continue;
            }
            
            // Absolute priority 3: Critical structure repair
            const criticalStructures = room.find(FIND_STRUCTURES, {
                filter: s => s.hits < s.hitsMax * 0.2 && 
                           (s.structureType === STRUCTURE_SPAWN || 
                            s.structureType === STRUCTURE_TOWER)
            });
            
            if (criticalStructures.length > 0) {
                const target = tower.pos.findClosestByRange(criticalStructures);
                tower.repair(target);
            }
        }
    }
}

function executeAbsoluteEmergencyProtocols() {
    if (defconLevel === DEFCON.EXTINCTION) {
        const spawn = Game.spawns.Spawn1;
        if (!spawn || spawn.spawning) return;
        
        console.log('🔥 ABSOLUTE EXTINCTION EMERGENCY PROTOCOL - TOTAL MAXIMUM RESPONSE');
        Memory.totalEmergency = true;
        totalEmergency = true;
        
        // Absolute maximum extinction defense
        const energy = spawn.room.energyAvailable;
        
        if (energy >= 190) {
            // Prioritize assassins for instant extinction defense
            const assassins = Object.values(Game.creeps).filter(c => c.memory.role === 'assassin');
            const role = assassins.length < 10 ? 'assassin' : 'destroyer';
            const body = role === 'assassin' ? BODY_DESIGNS.assassin : BODY_DESIGNS.destroyer;
            
            const result = spawn.spawnCreep(body, `ABSOLUTE_EXTINCTION_${Memory.creepCounter++}`, {
                memory: {role: role}
            });
            if (result === OK) {
                console.log(`🥚 ABSOLUTE EXTINCTION ${role.toUpperCase()} DEPLOYED`);
            }
        }
    }
}

// ABSOLUTE STRUCTURE BUILDING
function buildAbsoluteStructures(room) {
    const spawn = room.find(FIND_MY_SPAWNS)[0];
    if (!spawn) return;
    
    // Absolute fortress construction
    const spawnPos = spawn.pos;
    for (let x = spawnPos.x - 4; x <= spawnPos.x + 4; x++) {
        for (let y = spawnPos.y - 4; y <= spawnPos.y + 4; y++) {
            if (x >= 0 && x < 50 && y >= 0 && y < 50 && !(x === spawnPos.x && y === spawnPos.y)) {
                const structures = new RoomPosition(x, y, room.name).lookFor(LOOK_STRUCTURES);
                const sites = new RoomPosition(x, y, room.name).lookFor(LOOK_CONSTRUCTION_SITES);
                
                if (structures.length === 0 && sites.length === 0) {
                    room.createConstructionSite(x, y, STRUCTURE_RAMPART);
                }
            }
        }
    }
    
    // Absolute extensions
    if (room.controller.level >= 2) {
        const extensions = room.find(FIND_MY_STRUCTURES, {
            filter: s => s.structureType === STRUCTURE_EXTENSION
        });
        
        const maxExtensions = CONTROLLER_STRUCTURES.extension[room.controller.level] || 0;
        if (extensions.length < maxExtensions) {
            const positions = [
                {x: spawnPos.x + 5, y: spawnPos.y},
                {x: spawnPos.x - 5, y: spawnPos.y},
                {x: spawnPos.x, y: spawnPos.y + 5},
                {x: spawnPos.x, y: spawnPos.y - 5},
                {x: spawnPos.x + 3, y: spawnPos.y + 3},
                {x: spawnPos.x - 3, y: spawnPos.y - 3},
                {x: spawnPos.x + 3, y: spawnPos.y - 3},
                {x: spawnPos.x - 3, y: spawnPos.y + 3}
            ];
            
            for (const pos of positions) {
                if (pos.x >= 0 && pos.x < 50 && pos.y >= 0 && pos.y < 50) {
                    const result = room.createConstructionSite(pos.x, pos.y, STRUCTURE_EXTENSION);
                    if (result === OK) {
                        console.log('🔨 Absolute extension placed');
                        break;
                    }
                }
            }
        }
    }
}

function buildAbsoluteTowers(room) {
    const spawn = room.find(FIND_MY_SPAWNS)[0];
    if (!spawn || room.controller.level < 3) return;
    
    const towers = room.find(FIND_MY_STRUCTURES, {
        filter: s => s.structureType === STRUCTURE_TOWER
    });
    
    if (towers.length < 4) {  // Build 4 absolute towers
        const spawnPos = spawn.pos;
        const towerPositions = [
            {x: spawnPos.x - 5, y: spawnPos.y - 5},
            {x: spawnPos.x + 5, y: spawnPos.y - 5},
            {x: spawnPos.x - 5, y: spawnPos.y + 5},
            {x: spawnPos.x + 5, y: spawnPos.y + 5}
        ];
        
        for (const pos of towerPositions) {
            if (pos.x >= 0 && pos.x < 50 && pos.y >= 0 && pos.y < 50) {
                const structures = new RoomPosition(pos.x, pos.y, room.name).lookFor(LOOK_STRUCTURES);
                const sites = new RoomPosition(pos.x, pos.y, room.name).lookFor(LOOK_CONSTRUCTION_SITES);
                
                if (structures.length === 0 && sites.length === 0) {
                    room.createConstructionSite(pos.x, pos.y, STRUCTURE_TOWER);
                    console.log(`🔨 Absolute tower at ${pos.x},${pos.y}`);
                    break;
                }
            }
        }
    }
}

// ABSOLUTE VICTORY TRACKING
function trackAbsoluteVictory() {
    // Absolute enemy elimination count
    let enemySpawns = 0;
    let enemyCreeps = 0;
    let enemyStructures = 0;
    
    for (const roomName in Memory.enemyIntel) {
        const intel = Memory.enemyIntel[roomName];
        if (Game.time - intel.lastSeen < 100) {
            enemySpawns += intel.spawns;
            enemyCreeps += intel.creeps;
            enemyStructures += intel.structures;
        }
    }
    
    // Absolute military strength
    const absoluteForce = Object.values(Game.creeps).filter(c => 
        ['assassin', 'destroyer', 'eliminator', 'surgeon'].includes(c.memory.role)
    );
    
    console.log(`🔥 Absolute Force: ${absoluteForce.length} | Enemies: ${enemyCreeps}C ${enemySpawns}S ${enemyStructures}T | Total Kills: ${Memory.totalKills || 0}`);
    
    if (enemySpawns === 0 && enemyCreeps === 0 && absoluteForce.length >= 20) {
        console.log('🏆 ABSOLUTE PvP DOMINATION ACHIEVED - ENTIRE SECTOR ELIMINATED');
    }
}

function absoluteCleanup() {
    // Absolute memory cleanup
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
    
    for (const roomName in Memory.enemyIntel) {
        if (Game.time - Memory.enemyIntel[roomName].lastSeen > 100) {
            delete Memory.enemyIntel[roomName];
        }
    }
    
    // Clean old enemy rooms
    Memory.enemyRooms = Memory.enemyRooms.filter(roomName => 
        Memory.enemyIntel[roomName] && Game.time - Memory.enemyIntel[roomName].lastSeen < 100
    );
}