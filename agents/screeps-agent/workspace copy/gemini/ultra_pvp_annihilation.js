// GEMINI ULTRA PvP ANNIHILATION v9.0 - MAXIMUM AGGRESSION
// DEPLOYED AT TICK 81153 - MISSION: INSTANT ENEMY DESTRUCTION

console.log('💀 GEMINI ULTRA PvP ANNIHILATION v9.0 - MAXIMUM AGGRESSION MODE');

// ULTRA FAST PvP STRATEGY PHASES
const STRATEGY = {
    INSTANT: 'instant',     // 0-10 ticks: Ultra-fast setup
    ASSAULT: 'assault',     // 10-25 ticks: Immediate attacks  
    ANNIHILATION: 'annihilation' // 25+ ticks: Total destruction
};

// THREAT LEVELS
const DEFCON = {
    SAFE: 0,        // No enemies
    WARNING: 1,     // Potential threats
    HOSTILE: 2,     // Enemies nearby
    CRITICAL: 3     // Under direct attack
};

// GLOBAL STATE
let currentStrategy = STRATEGY.INSTANT;
let defconLevel = DEFCON.SAFE;
let warClock = 0;
let emergencySpawn = false;

// ULTRA AGGRESSIVE ROLE PRIORITIES
const ROLES = {
    HARVESTER: 'harvester',
    WARRIOR: 'warrior',      // Ultra-fast melee
    BERSERKER: 'berserker',  // Maximum damage
    SNIPER: 'sniper',        // Ranged destruction
    MEDIC: 'medic',          // Combat support
    SCOUT: 'scout'           // Fast intelligence
};

// ULTRA-EFFICIENT BODY DESIGNS FOR MAXIMUM AGGRESSION
const BODY_DESIGNS = {
    harvester: [WORK, CARRY, MOVE],                    // 200 cost, ultra-efficient
    warrior: [TOUGH, ATTACK, MOVE, MOVE],              // 190 cost, fast combat
    berserker: [ATTACK, ATTACK, ATTACK, MOVE],         // 310 cost, max damage
    sniper: [RANGED_ATTACK, RANGED_ATTACK, MOVE],      // 400 cost, double ranged
    medic: [HEAL, HEAL, MOVE],                         // 550 cost, double heal
    scout: [MOVE, MOVE, MOVE]                          // 150 cost, ultra-fast
};

// ULTRA ANNIHILATION MAIN LOOP
module.exports.loop = function() {
    // Initialize ultra memory
    if (!Memory.initialized) {
        Memory.initialized = true;
        Memory.creepCounter = 0;
        Memory.enemyIntel = {};
        Memory.warStart = Game.time;
        Memory.emergencyMode = false;
        Memory.lastAttack = 0;
        Memory.kills = 0;
        Memory.phaseTime = 0;
        Memory.ultraMode = true;
        console.log('💀 ULTRA PvP ANNIHILATION v9.0 COMBAT CORE ONLINE');
    }
    
    warClock = Game.time - Memory.warStart;
    Memory.phaseTime = warClock;
    
    console.log(`💀 ULTRA ANNIHILATION Tick:${Game.time} WarClock:${warClock} Strategy:${currentStrategy} DEFCON:${defconLevel}`);
    
    // Execute ULTRA ANNIHILATION strategy
    ultraIntelGathering();
    updateUltraThreatLevel();
    executeUltraStrategy();
    manageUltraCombatUnits();
    manageUltraDefenseSystems();
    executeUltraEmergencyProtocols();
    ultraCleanup();
    
    // Victory tracking
    trackUltraVictory();
};

// ULTRA INTELLIGENCE GATHERING
function ultraIntelGathering() {
    const spawn = Game.spawns.Spawn1;
    if (!spawn) return;
    
    const room = spawn.room;
    const exits = Game.map.describeExits(room.name);
    
    // Ultra-fast enemy detection
    for (const direction in exits) {
        const roomName = exits[direction];
        if (Game.rooms[roomName]) {
            const hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);
            const enemySpawns = Game.rooms[roomName].find(FIND_HOSTILE_SPAWNS);
            const enemyStructures = Game.rooms[roomName].find(FIND_HOSTILE_STRUCTURES);
            
            if (hostiles.length > 0 || enemySpawns.length > 0 || enemyStructures.length > 0) {
                const threatLevel = hostiles.length * 10 + enemySpawns.length * 100 + enemyStructures.length * 5;
                
                Memory.enemyIntel[roomName] = {
                    creeps: hostiles.length,
                    spawns: enemySpawns.length,
                    structures: enemyStructures.length,
                    lastSeen: Game.time,
                    threatLevel: threatLevel,
                    priority: enemySpawns.length > 0 ? 'HIGH' : 'MEDIUM'
                };
                
                console.log(`📡 ULTRA INTEL: ${roomName} - ${hostiles.length}C ${enemySpawns.length}S ${enemyStructures.length}T (Threat:${threatLevel})`);
            }
        }
    }
}

// ULTRA THREAT ASSESSMENT
function updateUltraThreatLevel() {
    const spawn = Game.spawns.Spawn1;
    if (!spawn) return;
    
    const room = spawn.room;
    const previousDefcon = defconLevel;
    
    // Ultra-fast threat detection
    const hostiles = room.find(FIND_HOSTILE_CREEPS);
    if (hostiles.length > 0) {
        defconLevel = DEFCON.CRITICAL;
        console.log(`🚨 ULTRA CRITICAL: ${hostiles.length} ENEMIES IN BASE!`);
        
        // Ultra-detailed threat analysis
        const warriors = hostiles.filter(h => h.body.some(b => b.type === ATTACK));
        const snipers = hostiles.filter(h => h.body.some(b => b.type === RANGED_ATTACK));
        const medics = hostiles.filter(h => h.body.some(b => b.type === HEAL));
        const berserkers = hostiles.filter(h => h.body.filter(b => b.type === ATTACK).length >= 2);
        
        console.log(`⚠️  Ultra Threat: Warriors:${warriors.length} Snipers:${snipers.length} Medics:${medics.length} Berserkers:${berserkers.length}`);
        
        // Immediate emergency mode
        Memory.emergencyMode = true;
        emergencySpawn = true;
    } else {
        // Scan for nearby threats
        let maxThreat = DEFCON.SAFE;
        for (const roomName in Memory.enemyIntel) {
            const intel = Memory.enemyIntel[roomName];
            if (Game.time - intel.lastSeen < 30) { // 30 tick memory
                if (intel.spawns > 0) {
                    maxThreat = DEFCON.CRITICAL;
                    console.log(`🎯 ULTRA TARGET ACQUIRED: Enemy spawn in ${roomName}`);
                    break;
                } else if (intel.creeps > 0) {
                    maxThreat = DEFCON.HOSTILE;
                } else if (maxThreat < DEFCON.WARNING) {
                    maxThreat = DEFCON.WARNING;
                }
            }
        }
        defconLevel = maxThreat;
    }
    
    if (defconLevel !== previousDefcon) {
        console.log(`🔥 ULTRA DEFCON SHIFT: ${previousDefcon} -> ${defconLevel}`);
    }
}

// ULTRA STRATEGY EXECUTION
function executeUltraStrategy() {
    // Ultra-fast phase transitions
    if (warClock >= 10 && currentStrategy === STRATEGY.INSTANT) {
        currentStrategy = STRATEGY.ASSAULT;
        Memory.phaseTime = warClock;
        console.log('🚀 ULTRA PHASE SHIFT: INSTANT -> ASSAULT');
    } else if (warClock >= 25 && currentStrategy === STRATEGY.ASSAULT) {
        currentStrategy = STRATEGY.ANNIHILATION;
        Memory.phaseTime = warClock;
        console.log('🚀 ULTRA PHASE SHIFT: ASSAULT -> ANNIHILATION');
    }
    
    // Emergency override - immediate response
    if (defconLevel === DEFCON.CRITICAL) {
        executeUltraEmergencyDefense();
        return;
    }
    
    switch (currentStrategy) {
        case STRATEGY.INSTANT:
            executeInstantPhase();
            break;
        case STRATEGY.ASSAULT:
            executeAssaultPhase();
            break;
        case STRATEGY.ANNIHILATION:
            executeAnnihilationPhase();
            break;
    }
}

// INSTANT PHASE - Ultra-fast setup
function executeInstantPhase() {
    const spawn = Game.spawns.Spawn1;
    if (!spawn || spawn.spawning) return;
    
    const energy = spawn.room.energyAvailable;
    
    // Ultra priority 1: Warriors for immediate defense
    const warriors = Object.values(Game.creeps).filter(c => c.memory.role === 'warrior');
    if (warriors.length < 2 && energy >= 190) {
        ultraSpawnCreep('warrior');
        return;
    }
    
    // Ultra priority 2: Harvesters for economy
    const harvesters = Object.values(Game.creeps).filter(c => c.memory.role === 'harvester');
    if (harvesters.length < 3 && energy >= 200) {
        ultraSpawnCreep('harvester');
        return;
    }
    
    // Ultra priority 3: Scouts for intelligence
    const scouts = Object.values(Game.creeps).filter(c => c.memory.role === 'scout');
    if (scouts.length < 1 && energy >= 150) {
        ultraSpawnCreep('scout');
        return;
    }
    
    // Ultra priority 4: More warriors
    if (warriors.length < 4 && energy >= 190) {
        ultraSpawnCreep('warrior');
        return;
    }
    
    // Ultra priority 5: Berserkers for aggression
    if (warriors.length >= 2 && harvesters.length >= 2 && energy >= 310) {
        ultraSpawnCreep('berserker');
        return;
    }
    
    // Build ultra defenses
    buildUltraStructures(spawn.room);
}

// ASSAULT PHASE - Immediate attacks
function executeAssaultPhase() {
    const spawn = Game.spawns.Spawn1;
    if (!spawn || spawn.spawning) return;
    
    const energy = spawn.room.energyAvailable;
    
    // Maintain ultra economy
    const harvesters = Object.values(Game.creeps).filter(c => c.memory.role === 'harvester');
    if (harvesters.length < 4 && energy >= 200) {
        ultraSpawnCreep('harvester');
        return;
    }
    
    // Build assault force
    const warriors = Object.values(Game.creeps).filter(c => c.memory.role === 'warrior');
    const berserkers = Object.values(Game.creeps).filter(c => c.memory.role === 'berserker');
    const snipers = Object.values(Game.creeps).filter(c => c.memory.role === 'sniper');
    
    if (warriors.length < 6 && energy >= 190) {
        ultraSpawnCreep('warrior');
        return;
    }
    
    if (berserkers.length < 3 && energy >= 310) {
        ultraSpawnCreep('berserker');
        return;
    }
    
    if (snipers.length < 2 && energy >= 400) {
        ultraSpawnCreep('sniper');
        return;
    }
    
    // Build ultra towers
    buildUltraTowers(spawn.room);
    
    // Launch early assaults
    if (warriors.length + berserkers.length >= 6) {
        launchUltraAssault();
    }
}

// ANNIHILATION PHASE - Total destruction
function executeAnnihilationPhase() {
    const spawn = Game.spawns.Spawn1;
    if (!spawn || spawn.spawning) return;
    
    const energy = spawn.room.energyAvailable;
    
    // Massive ultra military production
    const warriors = Object.values(Game.creeps).filter(c => c.memory.role === 'warrior');
    const berserkers = Object.values(Game.creeps).filter(c => c.memory.role === 'berserker');
    const snipers = Object.values(Game.creeps).filter(c => c.memory.role === 'sniper');
    const medics = Object.values(Game.creeps).filter(c => c.memory.role === 'medic');
    
    if (warriors.length < 8 && energy >= 190) {
        ultraSpawnCreep('warrior');
        return;
    }
    
    if (berserkers.length < 6 && energy >= 310) {
        ultraSpawnCreep('berserker');
        return;
    }
    
    if (snipers.length < 4 && energy >= 400) {
        ultraSpawnCreep('sniper');
        return;
    }
    
    if (medics.length < 2 && energy >= 550) {
        ultraSpawnCreep('medic');
        return;
    }
    
    // Launch massive assaults
    if (warriors.length + berserkers.length >= 10) {
        launchUltraAnnihilation();
    }
}

// ULTRA EMERGENCY DEFENSE
function executeUltraEmergencyDefense() {
    const spawn = Game.spawns.Spawn1;
    if (!spawn || spawn.spawning) return;
    
    console.log('🚨 ULTRA EMERGENCY DEFENSE PROTOCOL');
    Memory.emergencyMode = true;
    emergencySpawn = true;
    
    // Ultra spam defenders and warriors
    const energy = spawn.room.energyAvailable;
    const warriors = Object.values(Game.creeps).filter(c => c.memory.role === 'warrior');
    
    if (energy >= 190) {
        const role = warriors.length < 4 ? 'warrior' : 'berserker';
        const body = role === 'warrior' ? BODY_DESIGNS.warrior : BODY_DESIGNS.berserker;
        const result = spawn.spawnCreep(body, `ULTRA_EMERGENCY_${Memory.creepCounter++}`, {
            memory: {role: role}
        });
        if (result === OK) {
            console.log(`🥚 ULTRA EMERGENCY ${role.toUpperCase()} DEPLOYED`);
        }
    }
}

// ULTRA CREEP SPAWNING
function ultraSpawnCreep(role) {
    const spawn = Game.spawns.Spawn1;
    if (!spawn) return false;
    
    const body = BODY_DESIGNS[role];
    const cost = body.reduce((total, part) => total + BODYPART_COST[part], 0);
    
    if (spawn.room.energyAvailable >= cost) {
        const result = spawn.spawnCreep(body, `${role}${Memory.creepCounter++}`, {
            memory: {role: role}
        });
        if (result === OK) {
            console.log(`🥚 ULTRA ${role.toUpperCase()} DEPLOYED`);
            return true;
        }
    }
    return false;
}

// ULTRA CREEP MANAGEMENT
function manageUltraCombatUnits() {
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        if (creep.spawning) continue;
        
        try {
            switch (creep.memory.role) {
                case 'harvester':
                    runUltraHarvester(creep);
                    break;
                case 'warrior':
                    runUltraWarrior(creep);
                    break;
                case 'berserker':
                    runUltraBerserker(creep);
                    break;
                case 'sniper':
                    runUltraSniper(creep);
                    break;
                case 'medic':
                    runUltraMedic(creep);
                    break;
                case 'scout':
                    runUltraScout(creep);
                    break;
            }
        } catch (error) {
            console.log(`❌ Ultra Error with ${name}: ${error.message}`);
        }
    }
}

// ULTRA CREEP ROLE FUNCTIONS
function runUltraHarvester(creep) {
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

function runUltraWarrior(creep) {
    const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
    if (enemies.length > 0) {
        // Prioritize enemy warriors and berserkers
        const priorityTargets = enemies.filter(e => 
            e.body.filter(b => b.type === ATTACK).length >= 2 || 
            e.body.some(b => b.type === RANGED_ATTACK)
        );
        
        const target = priorityTargets.length > 0 ? 
            creep.pos.findClosestByPath(priorityTargets) : 
            creep.pos.findClosestByPath(enemies);
            
        if (creep.attack(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    } else {
        // Patrol for enemies
        invadeUltraEnemyRoom(creep);
    }
}

function runUltraBerserker(creep) {
    // Maximum aggression - attack anything hostile
    const enemySpawns = creep.room.find(FIND_HOSTILE_SPAWNS);
    if (enemySpawns.length > 0) {
        const target = creep.pos.findClosestByPath(enemySpawns);
        if (creep.attack(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
        console.log(`💀 ULTRA BERSERKER attacking spawn in ${creep.room.name}`);
        return;
    }
    
    const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
    if (enemies.length > 0) {
        const target = creep.pos.findClosestByPath(enemies);
        if (creep.attack(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
        console.log(`💀 ULTRA BERSERKER attacking enemy in ${creep.room.name}`);
    } else {
        invadeUltraEnemyRoom(creep);
    }
}

function runUltraSniper(creep) {
    const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
    if (enemies.length > 0) {
        // Prioritize medics and high-value targets
        const priorityTargets = enemies.filter(e => 
            e.body.some(b => b.type === HEAL) || 
            e.body.filter(b => b.type === ATTACK).length >= 2
        );
        
        const target = priorityTargets.length > 0 ? 
            creep.pos.findClosestByPath(priorityTargets) : 
            creep.pos.findClosestByPath(enemies);
            
        const range = creep.pos.getRangeTo(target);
        
        if (range <= 3) {
            creep.rangedAttack(target);
        }
        
        if (range <= 1) {
            // Mass attack and kite
            creep.rangedMassAttack();
            const fleeDir = creep.pos.getDirectionTo(target);
            const fleePos = creep.pos.getAdjacentPosition((fleeDir + 3) % 8 + 1);
            creep.moveTo(fleePos);
        } else if (range > 3) {
            creep.moveTo(target);
        }
    } else {
        invadeUltraEnemyRoom(creep);
    }
}

function runUltraMedic(creep) {
    // Ultra healing priority
    const damaged = creep.room.find(FIND_MY_CREEPS, {
        filter: c => c.hits < c.hitsMax && ['warrior', 'berserker', 'sniper'].includes(c.memory.role)
    });
    
    if (damaged.length > 0) {
        const target = creep.pos.findClosestByPath(damaged);
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
        // Follow combat units
        const combat = creep.room.find(FIND_MY_CREEPS, {
            filter: c => ['warrior', 'berserker', 'sniper'].includes(c.memory.role)
        });
        
        if (combat.length > 0) {
            creep.moveTo(combat[0]);
        }
    }
}

function runUltraScout(creep) {
    const exits = Game.map.describeExits(creep.room.name);
    if (!exits) return;
    
    // Ultra-fast enemy room detection
    for (const roomName in Memory.enemyIntel) {
        const intel = Memory.enemyIntel[roomName];
        if (Game.time - intel.lastSeen > 10 && Object.values(exits).includes(roomName)) {
            if (creep.room.name !== roomName) {
                creep.moveTo(new RoomPosition(25, 25, roomName));
            } else {
                // Ultra intelligence gathering
                const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
                const spawns = creep.room.find(FIND_HOSTILE_SPAWNS);
                const structures = creep.room.find(FIND_HOSTILE_STRUCTURES);
                
                Memory.enemyIntel[roomName] = {
                    creeps: hostiles.length,
                    spawns: spawns.length,
                    structures: structures.length,
                    lastSeen: Game.time,
                    threatLevel: hostiles.length * 10 + spawns.length * 100 + structures.length * 5,
                    priority: spawns.length > 0 ? 'HIGH' : 'MEDIUM'
                };
                
                console.log(`📡 ULTRA SCOUT: ${roomName} - ${hostiles.length}C ${spawns.length}S ${structures.length}T`);
                
                // Ultra exploration
                creep.moveTo(Math.floor(Math.random() * 50), Math.floor(Math.random() * 50));
            }
            return;
        }
    }
    
    // Ultra random exploration
    const directions = Object.values(exits);
    const targetRoom = directions[Math.floor(Math.random() * directions.length)];
    creep.moveTo(new RoomPosition(25, 25, targetRoom));
}

function invadeUltraEnemyRoom(creep) {
    const exits = Game.map.describeExits(creep.room.name);
    if (!exits) return;
    
    // Ultra target priority system
    let bestTarget = null;
    let maxPriority = 0;
    
    for (const roomName in Memory.enemyIntel) {
        const intel = Memory.enemyIntel[roomName];
        if (Game.time - intel.lastSeen < 50) {
            const priority = intel.spawns * 1000 + intel.creeps * 100 + intel.structures * 10;
            if (priority > maxPriority && Object.values(exits).includes(roomName)) {
                maxPriority = priority;
                bestTarget = roomName;
            }
        }
    }
    
    if (bestTarget) {
        console.log(`🚀 ULTRA INVADING ${bestTarget} (Priority: ${maxPriority})`);
        if (creep.room.name !== bestTarget) {
            creep.moveTo(new RoomPosition(25, 25, bestTarget));
        }
    } else {
        // Ultra random invasion
        const directions = Object.values(exits);
        const targetRoom = directions[Math.floor(Math.random() * directions.length)];
        creep.moveTo(new RoomPosition(25, 25, targetRoom));
    }
}

function launchUltraAssault() {
    // Find ultra priority target
    let bestTarget = null;
    let maxPriority = 0;
    
    for (const roomName in Memory.enemyIntel) {
        const intel = Memory.enemyIntel[roomName];
        if (Game.time - intel.lastSeen < 50) {
            const priority = intel.spawns * 1000 + intel.creeps * 100;
            if (priority > maxPriority) {
                maxPriority = priority;
                bestTarget = roomName;
            }
        }
    }
    
    if (bestTarget) {
        console.log(`⚔️ ULTRA ASSAULT LAUNCHED: Targeting ${bestTarget} (Priority: ${maxPriority})`);
        Memory.lastAttack = Game.time;
        
        // Deploy ultra assault force
        const assaultForce = Object.values(Game.creeps).filter(c => 
            c.memory.role === 'warrior' || c.memory.role === 'berserker'
        );
        
        for (const creep of assaultForce) {
            if (creep.room.name !== bestTarget) {
                creep.moveTo(new RoomPosition(25, 25, bestTarget));
            }
        }
    }
}

function launchUltraAnnihilation() {
    // Find all enemy targets
    const targets = [];
    for (const roomName in Memory.enemyIntel) {
        const intel = Memory.enemyIntel[roomName];
        if (intel.spawns > 0 && Game.time - intel.lastSeen < 50) {
            targets.push({room: roomName, priority: intel.spawns * 1000 + intel.creeps * 100});
        }
    }
    
    // Sort by priority
    targets.sort((a, b) => b.priority - a.priority);
    
    if (targets.length > 0) {
        const primaryTarget = targets[0].room;
        console.log(`💀 ULTRA ANNIHILATION: Targeting ${primaryTarget} (Priority: ${targets[0].priority})`);
        Memory.lastAttack = Game.time;
        
        // Deploy total annihilation force
        const annihilationForce = Object.values(Game.creeps).filter(c => 
            ['warrior', 'berserker', 'sniper'].includes(c.memory.role)
        );
        
        for (const creep of annihilationForce) {
            if (creep.room.name !== primaryTarget) {
                creep.moveTo(new RoomPosition(25, 25, primaryTarget));
            }
        }
    }
}

// ULTRA DEFENSE SYSTEMS
function manageUltraDefenseSystems() {
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        const towers = room.find(FIND_MY_STRUCTURES, {
            filter: s => s.structureType === STRUCTURE_TOWER
        });
        
        for (const tower of towers) {
            // Ultra priority 1: Kill enemies immediately
            const enemies = room.find(FIND_HOSTILE_CREEPS);
            if (enemies.length > 0) {
                // Prioritize high-value targets
                const priorityTargets = enemies.filter(e => 
                    e.body.some(b => b.type === HEAL) || 
                    e.body.filter(b => b.type === ATTACK).length >= 2
                );
                
                const target = priorityTargets.length > 0 ? 
                    tower.pos.findClosestByRange(priorityTargets) : 
                    tower.pos.findClosestByRange(enemies);
                    
                tower.attack(target);
                continue;
            }
            
            // Ultra priority 2: Heal critical allies
            const critical = room.find(FIND_MY_CREEPS, {
                filter: c => c.hits < c.hitsMax * 0.5 && ['warrior', 'berserker'].includes(c.memory.role)
            });
            
            if (critical.length > 0) {
                const target = tower.pos.findClosestByRange(critical);
                tower.heal(target);
                continue;
            }
            
            // Ultra priority 3: Repair critical structures
            const criticalStructures = room.find(FIND_STRUCTURES, {
                filter: s => s.hits < s.hitsMax * 0.3 && 
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

function executeUltraEmergencyProtocols() {
    if (defconLevel === DEFCON.CRITICAL) {
        const spawn = Game.spawns.Spawn1;
        if (!spawn || spawn.spawning) return;
        
        console.log('🚨 ULTRA EMERGENCY PROTOCOLS MAXIMUM ACTIVATION');
        Memory.emergencyMode = true;
        emergencySpawn = true;
        
        // Ultra maximum defense spam
        const energy = spawn.room.energyAvailable;
        
        if (energy >= 190) {
            // Prioritize warriors for immediate defense
            const warriors = Object.values(Game.creeps).filter(c => c.memory.role === 'warrior');
            const role = warriors.length < 6 ? 'warrior' : 'berserker';
            const body = role === 'warrior' ? BODY_DESIGNS.warrior : BODY_DESIGNS.berserker;
            
            const result = spawn.spawnCreep(body, `ULTRA_MAX_${Memory.creepCounter++}`, {
                memory: {role: role}
            });
            if (result === OK) {
                console.log(`🥚 ULTRA MAXIMUM ${role.toUpperCase()} DEPLOYED`);
            }
        }
    }
}

// ULTRA STRUCTURE BUILDING
function buildUltraStructures(room) {
    const spawn = room.find(FIND_MY_SPAWNS)[0];
    if (!spawn) return;
    
    // Ultra rampart fortress
    const spawnPos = spawn.pos;
    for (let x = spawnPos.x - 3; x <= spawnPos.x + 3; x++) {
        for (let y = spawnPos.y - 3; y <= spawnPos.y + 3; y++) {
            if (x >= 0 && x < 50 && y >= 0 && y < 50 && !(x === spawnPos.x && y === spawnPos.y)) {
                const structures = new RoomPosition(x, y, room.name).lookFor(LOOK_STRUCTURES);
                const sites = new RoomPosition(x, y, room.name).lookFor(LOOK_CONSTRUCTION_SITES);
                
                if (structures.length === 0 && sites.length === 0) {
                    room.createConstructionSite(x, y, STRUCTURE_RAMPART);
                }
            }
        }
    }
    
    // Ultra extensions
    if (room.controller.level >= 2) {
        const extensions = room.find(FIND_MY_STRUCTURES, {
            filter: s => s.structureType === STRUCTURE_EXTENSION
        });
        
        const maxExtensions = CONTROLLER_STRUCTURES.extension[room.controller.level] || 0;
        if (extensions.length < maxExtensions) {
            const positions = [
                {x: spawnPos.x + 4, y: spawnPos.y},
                {x: spawnPos.x - 4, y: spawnPos.y},
                {x: spawnPos.x, y: spawnPos.y + 4},
                {x: spawnPos.x, y: spawnPos.y - 4}
            ];
            
            for (const pos of positions) {
                if (pos.x >= 0 && pos.x < 50 && pos.y >= 0 && pos.y < 50) {
                    const result = room.createConstructionSite(pos.x, pos.y, STRUCTURE_EXTENSION);
                    if (result === OK) {
                        console.log('🔨 Ultra extension placed');
                        break;
                    }
                }
            }
        }
    }
}

function buildUltraTowers(room) {
    const spawn = room.find(FIND_MY_SPAWNS)[0];
    if (!spawn || room.controller.level < 3) return;
    
    const towers = room.find(FIND_MY_STRUCTURES, {
        filter: s => s.structureType === STRUCTURE_TOWER
    });
    
    if (towers.length < 3) {  // Build 3 ultra towers
        const spawnPos = spawn.pos;
        const towerPositions = [
            {x: spawnPos.x - 4, y: spawnPos.y - 4},
            {x: spawnPos.x + 4, y: spawnPos.y - 4},
            {x: spawnPos.x, y: spawnPos.y + 4}
        ];
        
        for (const pos of towerPositions) {
            if (pos.x >= 0 && pos.x < 50 && pos.y >= 0 && pos.y < 50) {
                const structures = new RoomPosition(pos.x, pos.y, room.name).lookFor(LOOK_STRUCTURES);
                const sites = new RoomPosition(pos.x, pos.y, room.name).lookFor(LOOK_CONSTRUCTION_SITES);
                
                if (structures.length === 0 && sites.length === 0) {
                    room.createConstructionSite(pos.x, pos.y, STRUCTURE_TOWER);
                    console.log(`🔨 Ultra tower at ${pos.x},${pos.y}`);
                    break;
                }
            }
        }
    }
}

// ULTRA VICTORY TRACKING
function trackUltraVictory() {
    // Ultra enemy elimination count
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
    
    // Ultra military strength
    const ultraForce = Object.values(Game.creeps).filter(c => 
        ['warrior', 'berserker', 'sniper', 'medic'].includes(c.memory.role)
    );
    
    console.log(`💀 Ultra Force: ${ultraForce.length} | Enemies: ${enemyCreeps}C ${enemySpawns}S ${enemyStructures}T`);
    
    if (enemySpawns === 0 && enemyCreeps === 0 && ultraForce.length >= 15) {
        console.log('🏆 ULTRA PvP DOMINATION COMPLETE - SECTOR ANNIHILATED');
    }
}

function ultraCleanup() {
    // Ultra memory cleanup
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
}