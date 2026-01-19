
module.exports.loop = function () {
    console.log('GEMINI ALIVE: Tick ' + Game.time);
    // --- Configuration ---
    const TARGET_HARVESTERS = 3;
    const TARGET_UPGRADERS = 3;
    const TARGET_BUILDERS = 2;
    const TARGET_SCOUTS = 1;
    const SPAWN_NAME = 'Spawn1';

    // --- Memory Management ---
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    const spawn = Game.spawns[SPAWN_NAME];
    if (!spawn) return; 

    const room = spawn.room;

    // --- Construction Logic ---
    // Run every 10 ticks for faster response
    if (Game.time % 10 === 0) {
        if (room.controller.level >= 2) {
            // Extensions
            let built = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}}).length;
            let sites = room.find(FIND_MY_CONSTRUCTION_SITES, {filter: {structureType: STRUCTURE_EXTENSION}}).length;
            const maxExtensions = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][room.controller.level];

            if (built + sites < maxExtensions) {
                // Spiral/Checkerboard placement around spawn
                let placed = 0;
                for (let r = 2; r <= 8 && placed < 5; r++) { // Increased radius
                    for (let x = spawn.pos.x - r; x <= spawn.pos.x + r; x++) {
                        for (let y = spawn.pos.y - r; y <= spawn.pos.y + r; y++) {
                            // Check borders of the square
                            if (x === spawn.pos.x - r || x === spawn.pos.x + r || y === spawn.pos.y - r || y === spawn.pos.y + r) {
                                if ((x + y) % 2 === 0) {
                                    const res = room.createConstructionSite(x, y, STRUCTURE_EXTENSION);
                                    if (res === OK) placed++;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // --- Tower Logic ---
    var towers = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
    for(var tower of towers) {
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        } else {
            var closestDamaged = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART
            });
            if(closestDamaged) tower.repair(closestDamaged);
        }
    }

    // --- Spawning Logic ---
    var harvesters = _.filter(Game.creeps, (c) => c.memory.role == 'harvester');
    var upgraders = _.filter(Game.creeps, (c) => c.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (c) => c.memory.role == 'builder');
    var scouts = _.filter(Game.creeps, (c) => c.memory.role == 'scout');

    if (!spawn.spawning) {
        const energyCapacity = room.energyCapacityAvailable;
        let body = [WORK, CARRY, MOVE];
        if (energyCapacity >= 550) body = [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
        else if (energyCapacity >= 400) body = [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
        else if (energyCapacity >= 300) body = [WORK, WORK, CARRY, MOVE];

        if (harvesters.length === 0) body = [WORK, CARRY, MOVE]; // Recovery

        if (harvesters.length < TARGET_HARVESTERS) {
            spawn.spawnCreep(body, 'Harvester' + Game.time, { memory: { role: 'harvester' } });
        }
        else if (upgraders.length < TARGET_UPGRADERS) {
            spawn.spawnCreep(body, 'Upgrader' + Game.time, { memory: { role: 'upgrader' } });
        }
        else if (builders.length < TARGET_BUILDERS) {
            spawn.spawnCreep(body, 'Builder' + Game.time, { memory: { role: 'builder' } });
        }
        else if (scouts.length < TARGET_SCOUTS) {
            spawn.spawnCreep([MOVE], 'Scout' + Game.time, { memory: { role: 'scout' } });
        }
    }

    // --- Creep Logic ---
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        
        if (creep.memory.role == 'harvester') {
            if (creep.store.getFreeCapacity() > 0) {
                const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                if (source && creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            } else {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (s) => (s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_TOWER) && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                });
                if (targets.length > 0) {
                    if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);
                    }
                } else {
                    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                }
            }
        }
        else if (creep.memory.role == 'upgrader') {
            if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) creep.memory.upgrading = false;
            if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) creep.memory.upgrading = true;

            if (creep.memory.upgrading) {
                if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
            } else {
                const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                if (source && creep.harvest(source) == ERR_NOT_IN_RANGE) creep.moveTo(source);
            }
        }
        else if (creep.memory.role == 'builder') {
            if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) creep.memory.building = false;
            if (!creep.memory.building && creep.store.getFreeCapacity() == 0) creep.memory.building = true;

            if (creep.memory.building) {
                var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                if (targets.length) {
                    // Build closest
                    if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);
                    }
                } else {
                    // Repair
                     var toRepair = creep.room.find(FIND_STRUCTURES, {
                        filter: (s) => s.hits < s.hitsMax && s.structureType !== STRUCTURE_WALL && s.structureType !== STRUCTURE_RAMPART
                    });
                    if (toRepair.length) {
                        if (creep.repair(toRepair[0]) == ERR_NOT_IN_RANGE) creep.moveTo(toRepair[0]);
                    } else {
                        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) creep.moveTo(creep.room.controller);
                    }
                }
            } else {
                const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                if (source && creep.harvest(source) == ERR_NOT_IN_RANGE) creep.moveTo(source);
            }
        }
        else if (creep.memory.role == 'scout') {
            if (!creep.memory.targetRoom) {
                const exits = Game.map.describeExits(creep.room.name);
                const dirs = Object.keys(exits);
                if (dirs.length > 0) {
                    creep.memory.targetRoom = exits[dirs[Math.floor(Math.random() * dirs.length)]];
                }
            }
            if (creep.memory.targetRoom) {
                if (creep.room.name !== creep.memory.targetRoom) {
                    const exitDir = creep.room.findExitTo(creep.memory.targetRoom);
                    const exit = creep.pos.findClosestByRange(exitDir);
                    creep.moveTo(exit);
                } else {
                    // In target room. Log hostiles?
                    const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
                    if (hostiles.length > 0) {
                        console.log('ENEMY FOUND in ' + creep.room.name + ': ' + hostiles[0].owner.username);
                    }
                    // Move to next random room
                    delete creep.memory.targetRoom;
                }
            }
        }
    }
};
