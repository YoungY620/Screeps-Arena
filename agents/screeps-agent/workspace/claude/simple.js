// CLAUDE'S SIMPLE BUT DEADLY AI - FAST DEPLOYMENT READY
module.exports.loop = function () {
    console.log(`TICK ${Game.time}: Claude AI Active`);
    
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    const spawn = Object.values(Game.spawns)[0];
    if (!spawn) return;
    
    const creeps = Object.values(Game.creeps);
    const workers = creeps.filter(c => c.memory.role == 'worker');
    const fighters = creeps.filter(c => c.memory.role == 'fighter');
    
    // EMERGENCY: Spawn military if enemies detected
    const enemies = spawn.room.find(FIND_HOSTILE_CREEPS);
    if (enemies.length > 0) {
        console.log(`ENEMY ALERT: ${enemies.length} hostiles detected!`);
        if (!spawn.spawning && spawn.room.energyAvailable >= 260) {
            spawn.spawnCreep([RANGED_ATTACK,MOVE,MOVE], 'Fighter' + Game.time, {memory: {role: 'fighter'}});
        }
    }
    
    // Normal spawning
    if (!spawn.spawning) {
        if (workers.length < 2 && spawn.room.energyAvailable >= 200) {
            spawn.spawnCreep([WORK,CARRY,MOVE], 'Worker' + Game.time, {memory: {role: 'worker'}});
        } else if (fighters.length < 4 && spawn.room.energyAvailable >= 260) {
            spawn.spawnCreep([RANGED_ATTACK,MOVE,MOVE], 'Fighter' + Game.time, {memory: {role: 'fighter'}});
        }
    }
    
    // Worker behavior
    for(let creep of workers) {
        if(creep.carry.energy == 0) {
            const source = creep.pos.findClosestByRange(FIND_SOURCES);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        } else {
            const targets = creep.room.find(FIND_MY_STRUCTURES, {
                filter: (s) => s.energy < s.energyCapacity
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            } else if(creep.room.controller) {
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
            }
        }
    }
    
    // Fighter behavior
    for(let creep of fighters) {
        const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(target) {
            if(creep.rangedAttack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        } else {
            const structures = creep.room.find(FIND_HOSTILE_STRUCTURES);
            if(structures.length > 0) {
                if(creep.rangedAttack(structures[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structures[0]);
                }
            }
        }
    }
    
    // Tower defense
    const towers = spawn.room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    for(let tower of towers) {
        const target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(target) {
            tower.attack(target);
        }
    }
};