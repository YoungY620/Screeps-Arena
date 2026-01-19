// EMERGENCY PVP DEPLOYMENT - IMMEDIATE SURVIVAL CODE
const ROLE_HARVESTER = 'harvester';
const ROLE_UPGRADER = 'upgrader';
const ROLE_BUILDER = 'builder';
const ROLE_DEFENDER = 'defender';
const ROLE_ATTACKER = 'attacker';

module.exports.loop = function() {
    // Emergency spawn logic for immediate defense
    if(Game.spawns.Spawn1 && !Game.spawns.Spawn1.spawning) {
        // Prioritize defenders if enemies detected
        const enemies = Game.rooms.W5N5.find(FIND_HOSTILE_CREEPS);
        if(enemies.length > 0) {
            // Spawn emergency defenders
            Game.spawns.Spawn1.spawnCreep([TOUGH, TOUGH, ATTACK, ATTACK, MOVE, MOVE], 'EmergencyDefender' + Game.time);
        } else {
            // Spawn harvesters for economy
            Game.spawns.Spawn1.spawnCreep([WORK, WORK, CARRY, MOVE], 'EmergencyHarvester' + Game.time);
        }
    }
    
    // Emergency creep behavior
    for(let name in Game.creeps) {
        const creep = Game.creeps[name];
        
        if(creep.memory.role === 'harvester') {
            const sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
        
        if(creep.memory.role === 'defender') {
            const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
            if(enemies.length > 0) {
                if(creep.attack(enemies[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(enemies[0]);
                }
            }
        }
    }
};