// GEMINI PvP ANNIHILATION v8.0 - FAST COMBAT STRATEGY
// OPTIMIZED FOR IMMEDIATE COMBAT - TICK 79828

console.log('⚡ GEMINI PvP ANNIHILATION v8.0 - COMBAT MODE ACTIVATED');

// FAST PvP STRATEGY PHASES
const STRATEGY = {
    RUSH: 'rush',           // 0-15 ticks: Fast economy + defense
    BLITZ: 'blitz',         // 15-35 ticks: Military buildup  
    DOMINATION: 'domination' // 35+ ticks: Total enemy destruction
};

// THREAT LEVELS
const DEFCON = {
    SAFE: 0,      // No enemies
    ALERT: 1,     // Enemies detected
    COMBAT: 2,    // Under attack
    EMERGENCY: 3  // Critical threat
};

// GLOBAL STATE
let currentStrategy = STRATEGY.RUSH;
let defconLevel = DEFCON.SAFE;
let warClock = 0;

// ROLE PRIORITIES FOR PvP
const ROLES = {
    HARVESTER: 'harvester',
    DEFENDER: 'defender',    // Priority 1 - Survival
    ATTACKER: 'attacker',    // Priority 2 - Offense
    RANGER: 'ranger',        // Ranged support
    HEALER: 'healer',        // Combat support
    SCOUT: 'scout'           // Intelligence
};

// OPTIMIZED BODY DESIGNS FOR FAST DEPLOYMENT
const BODY_DESIGNS = {
    harvester: [WORK, CARRY, MOVE],           // 200 cost, efficient
    defender: [TOUGH, ATTACK, MOVE, MOVE],    // 190 cost, balanced
    attacker: [ATTACK, ATTACK, MOVE, MOVE],   // 260 cost, aggressive
    ranger: [RANGED_ATTACK, MOVE, MOVE],      // 250 cost, kiting
    healer: [HEAL, MOVE, MOVE],               // 350 cost, support
    scout: [MOVE, MOVE]                       // 100 cost, fast
};

// MAIN COMBAT LOOP
module.exports.loop = function() {
    // Initialize memory
    if (!Memory.initialized) {
        Memory.initialized = true;
        Memory.creepCounter = 0;
        Memory.enemyIntel = {};
        Memory.warStart = Game.time;
        Memory.emergencyMode = false;
        Memory.lastAttack = 0;
        Memory.kills = 0;
        console.log('🧠 GEMINI PvP ANNIHILATION v8.0 COMBAT BRAIN ONLINE');
    }
    
    warClock = Game.time - Memory.warStart;
    
    console.log(`⚡ PvP ANNIHILATION Tick:${Game.time} WarClock:${warClock} Strategy:${currentStrategy} DEFCON:${defconLevel}`);
    
    // Execute PvP strategy
    intelGathering();
    updateThreatLevel();
    executePvPStrategy();
    manageCombatUnits();
    manageDefenseSystems();
    executeEmergencyProtocols();
    
    // Victory tracking
    trackVictoryConditions();
};

// INTELLIGENCE GATHERING
function intelGathering() {
    const spawn = Game.spawns.Spawn1;
    if (!spawn) return;
    
    const room = spawn.room;
    const exits = Game.map.describeExits(room.name);
    
    // Scan adjacent rooms for enemies
    for (const direction in exits) {
        const roomName = exits[direction];
        if (Game.rooms[roomName]) {
            const hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);
            const enemySpawns = Game.rooms[roomName].find(FIND_HOSTILE_SPAWNS);
            
            if (hostiles.length > 0 || enemySpawns.length > 0) {
                Memory.enemyIntel[roomName] = {
                    creeps: hostiles.length,
                    spawns: enemySpawns.length,
                    lastSeen: Game.time,
                    threatLevel: hostiles.length + (enemySpawns.length * 50)
                };
                
                console.log(`📡 ENEMY INTEL: ${roomName} - ${hostiles.length} creeps, ${enemySpawns.length} spawns`);
            }
        }
    }
}

// THREAT ASSESSMENT
function updateThreatLevel() {
    const spawn = Game.spawns.Spawn1;
    if (!spawn) return;
    
    const room = spawn.room;
    const previousDefcon = defconLevel;
    
    // Check for immediate threats
    const hostiles = room.find(FIND_HOSTILE_CREEPS);
    if (hostiles.length > 0) {
        defconLevel = DEFCOM.EMERGENCY;
        console.log(`🚨 EMERGENCY: ${hostiles.length} ENEMIES IN BASE!`);
        
        // Analyze enemy composition
        const melee = hostiles.filter(h => h.body.some(b => b.type === ATTACK));
        const ranged = hostiles.filter(h => h.body.some(b => b.type === RANGED_ATTACK));
        const healers = hostiles.filter(h => h.body.some(b => b.type === HEAL));
        
        console.log(`⚠️  Threat Analysis: Melee:${melee.length} Ranged:${ranged.length} Healers:${healers.length}`);
    } else {
        // Check adjacent rooms
        let maxThreat = DEFCON.SAFE;
        for (const roomName in Memory.enemyIntel) {
            const intel = Memory.enemyIntel[roomName];
            if (Game.time - intel.lastSeen < 50) {
                if (intel.spawns > 0) maxThreat = DEFCON.COMBAT;
                else if (intel.creeps > 0) maxThreat = DEFCON.ALERT;
            }
        }
        defconLevel = maxThreat;
    }
    
    if (defconLevel !== previousDefcon) {
        console.log(`🔥 DEFCON SHIFT: ${previousDefcon} -> ${defconLevel}`);
    }
}

// PvP STRATEGY EXECUTION
function executePvPStrategy() {
    // Phase transitions
    if (warClock >= 15 && currentStrategy === STRATEGY.RUSH) {
        currentStrategy = STRATEGY.BLITZ;
        console.log('🚀 PHASE SHIFT: RUSH -> BLITZ');
    } else if (warClock >= 35 && currentStrategy === STRATEGY.BLITZ) {
        currentStrategy = STRATEGY.DOMINATION;
        console.log('🚀 PHASE SHIFT: BLITZ -> DOMINATION');
    }
    
    // Emergency override
    if (defconLevel === DEFCON.EMERGENCY) {
        executeEmergencyDefense();
        return;
    }
    
    switch (currentStrategy) {
        case STRATEGY.RUSH:
            executeRushPhase();
            break;
        case STRATEGY.BLITZ:
            executeBlitzPhase();
            break;
        case STRATEGY.DOMINATION:
            executeDominationPhase();
            break;
    }
}

// RUSH PHASE - Fast economy + basic defense
function executeRushPhase() {
    const spawn = Game.spawns.Spawn1;
    if (!spawn || spawn.spawning) return;
    
    const energy = spawn.room.energyAvailable;
    
    // Priority 1: Harvesters (minimum 4)
    const harvesters = Object.values(Game.creeps).filter(c => c.memory.role === 'harvester');
    if (harvesters.length < 4 && energy >= 200) {
        spawnCreep('harvester');
        return;
    }
    
    // Priority 2: Defenders (minimum 2)
    const defenders = Object.values(Game.creeps).filter(c => c.memory.role === 'defender');
    if (defenders.length < 2 && energy >= 190) {
        spawnCreep('defender');
        return;
    }
    
    // Priority 3: Scouts (1 minimum)
    const scouts = Object.values(Game.creeps).filter(c => c.memory.role === 'scout');
    if (scouts.length < 1 && energy >= 100) {
        spawnCreep('scout');
        return;
    }
    
    // Priority 4: More harvesters
    if (harvesters.length < 6 && energy >= 200) {
        spawnCreep('harvester');
        return;
    }
    
    // Build basic defenses
    buildBasicStructures(spawn.room);
}

// BLITZ PHASE - Military buildup
function executeBlitzPhase() {
    const spawn = Game.spawns.Spawn1;
    if (!spawn || spawn.spawning) return;
    
    const energy = spawn.room.energyAvailable;
    
    // Maintain economy
    const harvesters = Object.values(Game.creeps).filter(c => c.memory.role === 'harvester');
    if (harvesters.length < 6 && energy >= 200) {
        spawnCreep('harvester');
        return;
    }
    
    // Build military force
    const attackers = Object.values(Game.creeps).filter(c => c.memory.role === 'attacker');
    const defenders = Object.values(Game.creeps).filter(c => c.memory.role === 'defender');
    const rangers = Object.values(Game.creeps).filter(c => c.memory.role === 'ranger');
    
    if (defenders.length < 4 && energy >= 190) {
        spawnCreep('defender');
        return;
    }
    
    if (attackers.length < 6 && energy >= 260) {
        spawnCreep('attacker');
        return;
    }
    
    if (rangers.length < 3 && energy >= 250) {
        spawnCreep('ranger');
        return;
    }
    
    // Build towers
    buildTowers(spawn.room);
}

// DOMINATION PHASE - Total destruction
function executeDominationPhase() {
    const spawn = Game.spawns.Spawn1;
    if (!spawn || spawn.spawning) return;
    
    const energy = spawn.room.energyAvailable;
    
    // Massive military production
    const attackers = Object.values(Game.creeps).filter(c => c.memory.role === 'attacker');
    const defenders = Object.values(Game.creeps).filter(c => c.memory.role === 'defender');
    const rangers = Object.values(Game.creeps).filter(c => c.memory.role === 'ranger');
    const healers = Object.values(Game.creeps).filter(c => c.memory.role === 'healer');
    
    if (attackers.length < 10 && energy >= 260) {
        spawnCreep('attacker');
        return;
    }
    
    if (rangers.length < 5 && energy >= 250) {
        spawnCreep('ranger');
        return;
    }
    
    if (healers.length < 3 && energy >= 350) {
        spawnCreep('healer');
        return;
    }
    
    // Launch attacks when ready
    if (attackers.length >= 8) {
        launchAttack();
    }
}

// EMERGENCY DEFENSE
function executeEmergencyDefense() {
    const spawn = Game.spawns.Spawn1;
    if (!spawn || spawn.spawning) return;
    
    console.log('🚨 EMERGENCY DEFENSE PROTOCOL');
    Memory.emergencyMode = true;
    
    // Spam defenders
    const defenders = Object.values(Game.creeps).filter(c => c.memory.role === 'defender');
    if (defenders.length < 10 && spawn.room.energyAvailable >= 190) {
        const result = spawn.spawnCreep(BODY_DESIGNS.defender, `EmergencyDefender${Memory.creepCounter++}`, {
            memory: {role: 'defender'}
        });
        if (result === OK) {
            console.log('🥚 EMERGENCY DEFENDER DEPLOYED');
        }
    }
}

// CREEP SPAWNING HELPER
function spawnCreep(role) {
    const spawn = Game.spawns.Spawn1;
    if (!spawn) return;
    
    const body = BODY_DESIGNS[role];
    const cost = body.reduce((total, part) => total + BODYPART_COST[part], 0);
    
    if (spawn.room.energyAvailable >= cost) {
        const result = spawn.spawnCreep(body, `${role}${Memory.creepCounter++}`, {
            memory: {role: role}
        });
        if (result === OK) {
            console.log(`🥚 ${role.toUpperCase()} DEPLOYED`);
            return true;
        }
    }
    return false;
}

// CREEP MANAGEMENT
function manageCombatUnits() {
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        if (creep.spawning) continue;
        
        try {
            switch (creep.memory.role) {
                case 'harvester':
                    runHarvester(creep);
                    break;
                case 'defender':
                    runDefender(creep);
                    break;
                case 'attacker':
                    runAttacker(creep);
                    break;
                case 'ranger':
                    runRanger(creep);
                    break;
                case 'healer':
                    runHealer(creep);
                    break;
                case 'scout':
                    runScout(creep);
                    break;
            }
        } catch (error) {
            console.log(`❌ Error with ${name}: ${error.message}`);
        }
    }
}

// CREEP ROLE FUNCTIONS
function runHarvester(creep) {
    if (creep.store.getFreeCapacity() > 0) {
        const sources = creep.room.find(FIND_SOURCES);
        const target = creep.pos.findClosestByPath(sources);
        if (target && creep.harvest(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
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

function runDefender(creep) {
    const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
    if (enemies.length > 0) {
        const target = creep.pos.findClosestByPath(enemies);
        if (creep.attack(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    } else {
        // Patrol around spawn
        const spawn = Game.spawns.Spawn1;
        if (spawn) {
            creep.moveTo(spawn.pos.x + Math.random() * 8 - 4, spawn.pos.y + Math.random() * 8 - 4);
        }
    }
}

function runAttacker(creep) {
    // Attack enemy spawns first
    const enemySpawns = creep.room.find(FIND_HOSTILE_SPAWNS);
    if (enemySpawns.length > 0) {
        const target = creep.pos.findClosestByPath(enemySpawns);
        if (creep.attack(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
        return;
    }
    
    // Attack enemy creeps
    const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
    if (enemies.length > 0) {
        const target = creep.pos.findClosestByPath(enemies);
        if (creep.attack(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    } else {
        // Invade enemy rooms
        invadeEnemyRoom(creep);
    }
}

function runRanger(creep) {
    const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
    if (enemies.length > 0) {
        const target = creep.pos.findClosestByPath(enemies);
        const range = creep.pos.getRangeTo(target);
        
        if (range <= 3) {
            creep.rangedAttack(target);
        }
        
        if (range <= 1) {
            // Kite away and use mass attack
            creep.rangedMassAttack();
            const fleeDir = creep.pos.getDirectionTo(target);
            const fleePos = creep.pos.getAdjacentPosition((fleeDir + 3) % 8 + 1);
            creep.moveTo(fleePos);
        } else if (range > 3) {
            creep.moveTo(target);
        }
    } else {
        invadeEnemyRoom(creep);
    }
}

function runHealer(creep) {
    // Heal damaged allies
    const damaged = creep.room.find(FIND_MY_CREEPS, {
        filter: c => c.hits < c.hitsMax
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
            filter: c => ['attacker', 'ranger'].includes(c.memory.role)
        });
        
        if (combat.length > 0) {
            creep.moveTo(combat[0]);
        }
    }
}

function runScout(creep) {
    const exits = Game.map.describeExits(creep.room.name);
    if (!exits) return;
    
    // Explore enemy rooms
    for (const roomName in Memory.enemyIntel) {
        const intel = Memory.enemyIntel[roomName];
        if (Game.time - intel.lastSeen > 20 && Object.values(exits).includes(roomName)) {
            if (creep.room.name !== roomName) {
                creep.moveTo(new RoomPosition(25, 25, roomName));
            } else {
                // Gather fresh intel
                const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
                const spawns = creep.room.find(FIND_HOSTILE_SPAWNS);
                
                Memory.enemyIntel[roomName] = {
                    creeps: hostiles.length,
                    spawns: spawns.length,
                    lastSeen: Game.time,
                    threatLevel: hostiles.length + (spawns.length * 50)
                };
                
                // Explore the room
                creep.moveTo(Math.floor(Math.random() * 50), Math.floor(Math.random() * 50));
            }
            return;
        }
    }
    
    // Random exploration
    const directions = Object.values(exits);
    const targetRoom = directions[Math.floor(Math.random() * directions.length)];
    creep.moveTo(new RoomPosition(25, 25, targetRoom));
}

function invadeEnemyRoom(creep) {
    const exits = Game.map.describeExits(creep.room.name);
    if (!exits) return;
    
    // Find highest value target
    let bestTarget = null;
    let maxValue = 0;
    
    for (const roomName in Memory.enemyIntel) {
        const intel = Memory.enemyIntel[roomName];
        if (intel.spawns > 0 && Game.time - intel.lastSeen < 50) {
            const value = intel.spawns * 100 + intel.creeps * 20;
            if (value > maxValue && Object.values(exits).includes(roomName)) {
                maxValue = value;
                bestTarget = roomName;
            }
        }
    }
    
    if (bestTarget) {
        console.log(`🚀 INVADING ${bestTarget} (Value: ${maxValue})`);
        if (creep.room.name !== bestTarget) {
            creep.moveTo(new RoomPosition(25, 25, bestTarget));
        }
    } else {
        // Random invasion
        const directions = Object.values(exits);
        const targetRoom = directions[Math.floor(Math.random() * directions.length)];
        creep.moveTo(new RoomPosition(25, 25, targetRoom));
    }
}

function launchAttack() {
    // Find best target
    let bestTarget = null;
    let maxValue = 0;
    
    for (const roomName in Memory.enemyIntel) {
        const intel = Memory.enemyIntel[roomName];
        if (intel.spawns > 0 && Game.time - intel.lastSeen < 100) {
            const value = intel.spawns * 100 + intel.creeps * 20;
            if (value > maxValue) {
                maxValue = value;
                bestTarget = roomName;
            }
        }
    }
    
    if (bestTarget) {
        console.log(`⚔️ COORDINATED ASSAULT LAUNCHED: Targeting ${bestTarget}`);
        Memory.lastAttack = Game.time;
        
        // Deploy attack force
        const attackers = Object.values(Game.creeps).filter(c => 
            c.memory.role === 'attacker' || c.memory.role === 'ranger'
        );
        
        for (const creep of attackers) {
            if (creep.room.name !== bestTarget) {
                creep.moveTo(new RoomPosition(25, 25, bestTarget));
            }
        }
    }
}

// DEFENSE SYSTEMS
function manageDefenseSystems() {
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        const towers = room.find(FIND_MY_STRUCTURES, {
            filter: s => s.structureType === STRUCTURE_TOWER
        });
        
        for (const tower of towers) {
            // Priority 1: Kill enemies
            const enemies = room.find(FIND_HOSTILE_CREEPS);
            if (enemies.length > 0) {
                const target = tower.pos.findClosestByRange(enemies);
                tower.attack(target);
                continue;
            }
            
            // Priority 2: Heal damaged allies
            const damaged = room.find(FIND_MY_CREEPS, {
                filter: c => c.hits < c.hitsMax
            });
            
            if (damaged.length > 0) {
                const target = tower.pos.findClosestByRange(damaged);
                tower.heal(target);
                continue;
            }
            
            // Priority 3: Repair critical structures
            const critical = room.find(FIND_STRUCTURES, {
                filter: s => s.hits < s.hitsMax * 0.2 && 
                           (s.structureType === STRUCTURE_SPAWN || 
                            s.structureType === STRUCTURE_TOWER)
            });
            
            if (critical.length > 0) {
                const target = tower.pos.findClosestByRange(critical);
                tower.repair(target);
            }
        }
    }
}

function executeEmergencyProtocols() {
    if (defconLevel === DEFCON.EMERGENCY) {
        const spawn = Game.spawns.Spawn1;
        if (!spawn || spawn.spawning) return;
        
        console.log('🚨 EMERGENCY PROTOCOLS ACTIVE');
        
        // Spam defenders
        const defenders = Object.values(Game.creeps).filter(c => c.memory.role === 'defender');
        if (defenders.length < 8 && spawn.room.energyAvailable >= 190) {
            const result = spawn.spawnCreep(BODY_DESIGNS.defender, `Emergency${Memory.creepCounter++}`, {
                memory: {role: 'defender'}
            });
            if (result === OK) {
                console.log('🥚 EMERGENCY DEFENDER DEPLOYED');
            }
        }
    }
}

// STRUCTURE BUILDING
function buildBasicStructures(room) {
    const spawn = room.find(FIND_MY_SPAWNS)[0];
    if (!spawn) return;
    
    // Build ramparts around spawn
    const spawnPos = spawn.pos;
    for (let x = spawnPos.x - 2; x <= spawnPos.x + 2; x++) {
        for (let y = spawnPos.y - 2; y <= spawnPos.y + 2; y++) {
            if (x >= 0 && x < 50 && y >= 0 && y < 50 && !(x === spawnPos.x && y === spawnPos.y)) {
                const structures = new RoomPosition(x, y, room.name).lookFor(LOOK_STRUCTURES);
                const sites = new RoomPosition(x, y, room.name).lookFor(LOOK_CONSTRUCTION_SITES);
                
                if (structures.length === 0 && sites.length === 0) {
                    room.createConstructionSite(x, y, STRUCTURE_RAMPART);
                }
            }
        }
    }
    
    // Build extensions
    if (room.controller.level >= 2) {
        const extensions = room.find(FIND_MY_STRUCTURES, {
            filter: s => s.structureType === STRUCTURE_EXTENSION
        });
        
        const maxExtensions = CONTROLLER_STRUCTURES.extension[room.controller.level] || 0;
        if (extensions.length < maxExtensions) {
            const result = room.createConstructionSite(spawnPos.x + 3, spawnPos.y, STRUCTURE_EXTENSION);
            if (result === OK) {
                console.log('🔨 Extension site placed');
            }
        }
    }
}

function buildTowers(room) {
    const spawn = room.find(FIND_MY_SPAWNS)[0];
    if (!spawn || room.controller.level < 3) return;
    
    const towers = room.find(FIND_MY_STRUCTURES, {
        filter: s => s.structureType === STRUCTURE_TOWER
    });
    
    if (towers.length < 2) {  // Build 2 towers for defense
        const spawnPos = spawn.pos;
        const towerPos = towers.length === 0 ? 
            {x: spawnPos.x - 3, y: spawnPos.y - 3} : 
            {x: spawnPos.x + 3, y: spawnPos.y - 3};
        
        if (towerPos.x >= 0 && towerPos.x < 50 && towerPos.y >= 0 && towerPos.y < 50) {
            const result = room.createConstructionSite(towerPos.x, towerPos.y, STRUCTURE_TOWER);
            if (result === OK) {
                console.log('🔨 Tower site placed');
            }
        }
    }
}

// VICTORY TRACKING
function trackVictoryConditions() {
    // Count enemy elimination
    let enemySpawns = 0;
    let enemyCreeps = 0;
    
    for (const roomName in Memory.enemyIntel) {
        const intel = Memory.enemyIntel[roomName];
        if (Game.time - intel.lastSeen < 100) {
            enemySpawns += intel.spawns;
            enemyCreeps += intel.creeps;
        }
    }
    
    // Military strength
    const military = Object.values(Game.creeps).filter(c => 
        ['attacker', 'defender', 'ranger', 'healer'].includes(c.memory.role)
    );
    
    console.log(`⚔️ Military: ${military.length} | Enemies: ${enemyCreeps} creeps, ${enemySpawns} spawns`);
    
    if (enemySpawns === 0 && enemyCreeps === 0 && military.length >= 10) {
        console.log('🏆 PvP DOMINATION ACHIEVED - SECTOR CLEARED');
    }
}

// CLEANUP
for (const name in Memory.creeps) {
    if (!Game.creeps[name]) {
        delete Memory.creeps[name];
    }
}

for (const roomName in Memory.enemyIntel) {
    if (Game.time - Memory.enemyIntel[roomName].lastSeen > 150) {
        delete Memory.enemyIntel[roomName];
    }
}