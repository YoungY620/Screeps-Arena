// ULTRA-AGGRESSIVE PvP AI - SIMPLIFIED VERSION
// EMERGENCY DEPLOYMENT - DESTROY ALL ENEMIES

const ROLES = {
    HARVESTER: 'harvester',
    BUILDER: 'builder',
    UPGRADER: 'upgrader',
    GUARD: 'guard',
    ATTACKER: 'attacker'
};

function getBodyParts(role, energy) {
    if (role === ROLES.GUARD) {
        if (energy >= 400) return [TOUGH, TOUGH, ATTACK, ATTACK, MOVE, MOVE];
        return [TOUGH, ATTACK, MOVE];
    }
    if (role === ROLES.ATTACKER) {
        if (energy >= 400) return [ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE];
        return [ATTACK, ATTACK, MOVE, MOVE];
    }
    if (energy >= 400) return [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
    return [WORK, CARRY, MOVE];
}

function spawnCreep(spawn, role, body) {
    if (!spawn.spawning && spawn.store[RESOURCE_ENERGY] >= body.reduce((sum, part) => sum + BODYPART_COST[part], 0)) {
        const name = role + '_' + Game.time;
        const result = spawn.spawnCreep(body, name, {memory: {role: role}});
        if (result === OK) {
            console.log('Spawned ' + name);
            return true;
        }
    }
    return false;
}

function defendRoom(room) {
    const enemies = room.find(FIND_HOSTILE_CREEPS);
    if (enemies.length > 0) {
        const towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        towers.forEach(tower => {
            const target = enemies[0];
            if (target) tower.attack(target);
        });
        
        const spawns = room.find(FIND_MY_SPAWNS);
        spawns.forEach(spawn => {
            spawnCreep(spawn, ROLES.GUARD, getBodyParts(ROLES.GUARD, spawn.store[RESOURCE_ENERGY]));
        });
    }
}

function attackEnemies(room) {
    const enemies = room.find(FIND_HOSTILE_CREEPS);
    if (enemies.length > 0) {
        const spawns = room.find(FIND_MY_SPAWNS);
        spawns.forEach(spawn => {
            for (let i = 0; i < 3; i++) {
                spawnCreep(spawn, ROLES.ATTACKER, getBodyParts(ROLES.ATTACKER, spawn.store[RESOURCE_ENERGY]));
            }
        });
    }
}

module.exports.loop = function() {
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        
        // MAXIMUM AGGRESSION - ATTACK FIRST
        attackEnemies(room);
        defendRoom(room);
        
        // Basic economy
        const spawns = room.find(FIND_MY_SPAWNS);
        spawns.forEach(spawn => {
            if (!spawn.spawning) {
                const harvesters = room.find(FIND_MY_CREEPS, {filter: c => c.memory.role === ROLES.HARVESTER}).length;
                const builders = room.find(FIND_MY_CREEPS, {filter: c => c.memory.role === ROLES.BUILDER}).length;
                
                if (harvesters < 4) {
                    spawnCreep(spawn, ROLES.HARVESTER, getBodyParts(ROLES.HARVESTER, spawn.store[RESOURCE_ENERGY]));
                } else if (builders < 2) {
                    spawnCreep(spawn, ROLES.BUILDER, getBodyParts(ROLES.BUILDER, spawn.store[RESOURCE_ENERGY]));
                } else {
                    spawnCreep(spawn, ROLES.UPGRADER, getBodyParts(ROLES.UPGRADER, spawn.store[RESOURCE_ENERGY]));
                }
            }
        });
    }
    
    // Auto-attack all enemy creeps
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        if (creep.memory.role === ROLES.ATTACKER || creep.memory.role === ROLES.GUARD) {
            const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
            if (enemies.length > 0) {
                const target = creep.pos.findClosestByRange(enemies);
                if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        } else {
            // Normal worker behavior
            const sources = creep.room.find(FIND_SOURCES);
            if (creep.memory.role === ROLES.HARVESTER && sources[0]) {
                if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                }
            }
        }
    }
};