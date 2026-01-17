const net = require('net');

// Full PvP strategy code embedded
const code = `// GEMINI - PvP Arena Dominator
console.log('🤖 GEMINI - Tick:' + Game.time + ' - PvP Mode ACTIVE');

const STRATEGY = {EARLY: 'early', MID: 'mid', LATE: 'late'};
const DEFCON = {SAFE: 0, CAUTION: 1, THREAT: 2, ATTACK: 3};

let currentStrategy = STRATEGY.EARLY;
let defconLevel = DEFCON.SAFE;

function main() {
    if (!Memory.initialized) {
        Memory.initialized = true;
        Memory.creepCounter = 0;
        Memory.enemyIntel = {};
        console.log('🧠 Memory initialized');
    }
    
    updateThreatAssessment();
    
    if (currentStrategy === STRATEGY.EARLY) {
        earlyGameStrategy();
    } else if (currentStrategy === STRATEGY.MID) {
        midGameStrategy();
    } else if (currentStrategy === STRATEGY.LATE) {
        lateGameStrategy();
    }
    
    manageCreeps();
    manageDefense();
    cleanupMemory();
}

function updateThreatAssessment() {
    const room = Game.spawns.Spawn1.room;
    const hostiles = room.find(FIND_HOSTILE_CREEPS);
    if (hostiles.length > 0) {
        defconLevel = DEFCON.ATTACK;
        console.log('⚠️ ENEMIES:' + hostiles.length);
    } else {
        defconLevel = DEFCON.SAFE;
    }
}

function earlyGameStrategy() {
    const spawn = Game.spawns.Spawn1;
    if (!spawn) return;
    
    const harvesters = Object.values(Game.creeps).filter(c => c.name.includes('Harvester'));
    if (harvesters.length < 2 && spawn.room.energyAvailable >= 200) {
        spawnCreep('Harvester', [WORK, CARRY, MOVE]);
        return;
    }
    
    const upgraders = Object.values(Game.creeps).filter(c => c.name.includes('Upgrader'));
    if (upgraders.length < 1 && harvesters.length >= 1) {
        spawnCreep('Upgrader', [WORK, CARRY, MOVE, MOVE]);
    }
    
    if (spawn.room.controller.level >= 2) {
        currentStrategy = STRATEGY.MID;
        console.log('🎯 EARLY COMPLETE');
    }
}

function midGameStrategy() {
    const spawn = Game.spawns.Spawn1;
    if (!spawn) return;
    
    console.log('🎯 MID GAME');
    
    const towers = spawn.room.find(FIND_MY_STRUCTURES, {filter: s => s.structureType === STRUCTURE_TOWER});
    if (towers.length === 0) {
        spawn.room.createConstructionSite(spawn.pos.x + 2, spawn.pos.y + 2, STRUCTURE_TOWER);
    }
    
    if (defconLevel >= DEFCON.THREAT) {
        const defenders = Object.values(Game.creeps).filter(c => c.name.includes('Defender'));
        if (defenders.length < 2) {
            spawnCreep('Defender', [TOUGH, ATTACK, MOVE, MOVE]);
        }
    }
    
    if (spawn.room.controller.level >= 3) {
        currentStrategy = STRATEGY.LATE;
        console.log('🚀 MID COMPLETE');
    }
}

function lateGameStrategy() {
    console.log('⚔️ LATE GAME - ATTACK');
    
    const attackers = Object.values(Game.creeps).filter(c => c.name.includes('Attacker'));
    if (attackers.length < 2) {
        spawnCreep('Attacker', [TOUGH, ATTACK, MOVE, MOVE]);
    }
}

function manageCreeps() {
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        if (creep.spawning) continue;
        
        if (name.includes('Harvester')) {
            runHarvester(creep);
        } else if (name.includes('Upgrader')) {
            runUpgrader(creep);
        } else if (name.includes('Defender')) {
            runDefender(creep);
        } else if (name.includes('Attacker')) {
            runAttacker(creep);
        }
    }
}

function runHarvester(creep) {
    if (creep.store.getFreeCapacity() > 0) {
        const sources = creep.room.find(FIND_SOURCES);
        if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0]);
        }
    } else {
        const targets = creep.room.find(FIND_STRUCTURES, {
            filter: s => (s.structureType === STRUCTURE_EXTENSION || s.structureType === STRUCTURE_SPAWN) && 
                         s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        });
        if (targets.length > 0) {
            if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
            }
        } else {
            creep.drop(RESOURCE_ENERGY);
        }
    }
}

function runUpgrader(creep) {
    if (creep.store.getUsedCapacity() === 0) {
        const sources = creep.room.find(FIND_SOURCES);
        if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0]);
        }
    } else {
        if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }
    }
}

function runDefender(creep) {
    const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
    if (hostiles.length > 0) {
        const target = creep.pos.findClosestByPath(hostiles);
        if (creep.attack(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    } else {
        const spawn = Game.spawns.Spawn1;
        if (spawn) {
            creep.moveTo(spawn.pos.x + Math.random() * 4 - 2, spawn.pos.y + Math.random() * 4 - 2);
        }
    }
}

function runAttacker(creep) {
    const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
    if (hostiles.length > 0) {
        const target = creep.pos.findClosestByPath(hostiles);
        if (creep.attack(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
}

function manageDefense() {
    const room = Game.spawns.Spawn1.room;
    const towers = room.find(FIND_MY_STRUCTURES, {filter: s => s.structureType === STRUCTURE_TOWER});
    
    for (const tower of towers) {
        const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
            console.log('🔫 Tower attacking');
        }
    }
}

function spawnCreep(role, body) {
    const spawn = Game.spawns.Spawn1;
    if (spawn.spawning) return false;
    
    const cost = body.reduce((total, part) => {
        const costs = {move: 50, work: 100, carry: 50, attack: 80, ranged_attack: 150, heal: 250, tough: 10, claim: 600};
        return total + costs[part];
    }, 0);
    
    if (spawn.room.energyAvailable < cost) return false;
    
    const name = role + (Memory.creepCounter++);
    const result = spawn.spawnCreep(body, name, {memory: {role: role}});
    
    if (result === OK) {
        console.log('🥚 Spawned ' + role + ': ' + name);
        return true;
    }
    return false;
}

function cleanupMemory() {
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
}

// Run the main loop
main();`;

const c = new net.Socket();
let connected = false;

c.connect(21026, 'localhost', () => {
    connected = true;
    console.log('Connected to upload enhanced PvP code');
});

c.on('data', (data) => {
    const response = data.toString();
    if (response.includes('< ')) {
        console.log('Server ready, updating with enhanced PvP strategy...');
        
        const updateCmd = `storage.db.users.update({_id: "883571325e0e962"}, {$set: {"code.branch": "default", "code.modules": {main: ${JSON.stringify(code)}}}})\n`;
        c.write(updateCmd);
        
        setTimeout(() => {
            console.log('Enhanced PvP code update sent successfully!');
            c.end();
        }, 2000);
    }
});

c.on('error', (err) => {
    console.error('Connection error:', err.message);
});

setTimeout(() => {
    if (connected) {
        console.log('Closing connection');
        c.end();
    }
}, 10000);
