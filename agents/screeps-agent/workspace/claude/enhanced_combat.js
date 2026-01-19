// Claude's Enhanced Aggressive PvP AI
// ULTIMATE GOAL: SEEK AND DESTROY ALL ENEMIES

module.exports.loop = function () {
    // Clear memory of dead creeps
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // Initialize memory if needed
    if (!Memory.scouts) Memory.scouts = {};
    if (!Memory.targetRooms) Memory.targetRooms = [];

    const spawns = Object.values(Game.spawns);
    if (spawns.length === 0) {
        console.log('CRITICAL: No spawns available!');
        return;
    }

    const mainSpawn = spawns[0];
    const room = mainSpawn.room;
    
    // Count forces
    const creeps = Object.values(Game.creeps);
    const workers = creeps.filter(c => c.memory.role === 'worker');
    const attackers = creeps.filter(c => c.memory.role === 'attacker');
    const healers = creeps.filter(c => c.memory.role === 'healer');
    const rangers = creeps.filter(c => c.memory.role === 'ranger');
    const scouts = creeps.filter(c => c.memory.role === 'scout');
    const towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    
    console.log(`Tick ${Game.time}: W:${workers.length} A:${attackers.length} R:${rangers.length} H:${healers.length} S:${scouts.length} T:${towers.length} E:${room.energyAvailable}/${room.energyCapacityAvailable}`);

    // AGGRESSIVE SPAWNING STRATEGY
    if (!mainSpawn.spawning) {
        const totalMilitary = attackers.length + rangers.length;
        
        // Phase 1: Minimum viable economy (2 workers max)
        if (workers.length < 2 && room.energyAvailable >= 200) {
            spawnWorker(mainSpawn);
        }
        // Phase 2: Scouts to find enemies
        else if (scouts.length < 2 && room.energyAvailable >= 50) {
            spawnScout(mainSpawn);
        }
        // Phase 3: MILITARY FIRST!
        else if (totalMilitary < 8 && room.energyAvailable >= 260) {
            if (rangers.length < 4) {
                spawnRanger(mainSpawn);
            } else if (healers.length < Math.floor(totalMilitary / 3)) {
                spawnHealer(mainSpawn);
            } else {
                spawnAttacker(mainSpawn);
            }
        }
        // Phase 4: Only then more workers
        else if (workers.length < 4 && room.energyAvailable >= 200) {
            spawnWorker(mainSpawn);
        }
    }

    // Critical defense building
    buildDefenses(room, mainSpawn);

    // Execute behaviors
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        
        switch(creep.memory.role) {
            case 'worker': runWorker(creep); break;
            case 'attacker': runAttacker(creep); break;
            case 'ranger': runRanger(creep); break;
            case 'healer': runHealer(creep); break;
            case 'scout': runScout(creep); break;
        }
    }

    // Tower operations
    runTowers(towers, room);

    // AGGRESSIVE SCOUTING every tick
    huntEnemies();
};

function spawnWorker(spawn) {
    const name = 'Worker' + Game.time;
    const parts = [WORK,CARRY,MOVE];
    if(spawn.spawnCreep(parts, name, {memory: {role: 'worker'}}) == OK) {
        console.log('Spawning worker: ' + name);
    }
}

function spawnRanger(spawn) {
    const name = 'Ranger' + Game.time;
    const energy = spawn.room.energyAvailable;
    let parts;
    
    if (energy >= 400) {
        parts = [RANGED_ATTACK,RANGED_ATTACK,MOVE,MOVE];
    } else {
        parts = [RANGED_ATTACK,MOVE,MOVE];
    }
    
    if(spawn.spawnCreep(parts, name, {memory: {role: 'ranger'}}) == OK) {
        console.log('Spawning ranger: ' + name);
    }
}

function spawnAttacker(spawn) {
    const name = 'Attacker' + Game.time;
    const parts = [ATTACK,MOVE,MOVE];
    
    if(spawn.spawnCreep(parts, name, {memory: {role: 'attacker'}}) == OK) {
        console.log('Spawning attacker: ' + name);
    }
}

function spawnHealer(spawn) {
    const name = 'Healer' + Game.time;
    const parts = [HEAL,MOVE,MOVE];
    
    if(spawn.spawnCreep(parts, name, {memory: {role: 'healer'}}) == OK) {
        console.log('Spawning healer: ' + name);
    }
}

function spawnScout(spawn) {
    const name = 'Scout' + Game.time;
    const parts = [MOVE];
    
    if(spawn.spawnCreep(parts, name, {memory: {role: 'scout'}}) == OK) {
        console.log('Spawning scout: ' + name);
    }
}

function runScout(creep) {
    // Assign scout to a room if not assigned
    if (!creep.memory.targetRoom) {
        const scoutRooms = ['W1N2', 'W3N2', 'W2N1', 'W2N3', 'W1N1', 'W3N3', 'W1N3', 'W3N1'];
        creep.memory.targetRoom = scoutRooms[Game.time % scoutRooms.length];
    }
    
    // Move to target room
    if (creep.room.name !== creep.memory.targetRoom) {
        const exit = creep.room.findExitTo(creep.memory.targetRoom);
        if (exit) {
            creep.moveTo(creep.pos.findClosestByRange(exit));
        }
    } else {
        // Scout the room
        const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
        const enemyStructures = creep.room.find(FIND_HOSTILE_STRUCTURES);
        
        if (enemies.length > 0 || enemyStructures.length > 0) {
            console.log(`SCOUT ALERT: Found ${enemies.length} enemy creeps and ${enemyStructures.length} enemy structures in ${creep.room.name}!`);
            Memory.targetRooms.push(creep.room.name);
        }
        
        // Move around to scout
        if (creep.pos.x === 0) creep.move(RIGHT);
        else if (creep.pos.x === 49) creep.move(LEFT);
        else if (creep.pos.y === 0) creep.move(BOTTOM);
        else if (creep.pos.y === 49) creep.move(TOP);
        else creep.move(Math.floor(Math.random() * 8) + 1);
    }
}

function buildDefenses(room, spawn) {
    const controller = room.controller;
    const towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    const extensions = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}});
    
    // PRIORITY: TOWERS for immediate defense
    if (towers.length === 0 && controller.level >= 3) {
        const pos = spawn.pos;
        for(let dx = -3; dx <= 3; dx++) {
            for(let dy = -3; dy <= 3; dy++) {
                if(dx === 0 && dy === 0) continue;
                const x = pos.x + dx;
                const y = pos.y + dy;
                if(x > 0 && x < 49 && y > 0 && y < 49) {
                    if(room.createConstructionSite(x, y, STRUCTURE_TOWER) === OK) {
                        console.log(`Placing tower at ${x},${y}`);
                        return;
                    }
                }
            }
        }
    }
    
    // Extensions for more energy
    const maxExt = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][controller.level] || 0;
    if (extensions.length < maxExt && extensions.length < 5) {
        const pos = spawn.pos;
        for(let dx = -2; dx <= 2; dx++) {
            for(let dy = -2; dy <= 2; dy++) {
                if(dx === 0 && dy === 0) continue;
                const x = pos.x + dx;
                const y = pos.y + dy;
                if(x > 0 && x < 49 && y > 0 && y < 49) {
                    if(room.createConstructionSite(x, y, STRUCTURE_EXTENSION) === OK) {
                        console.log(`Placing extension at ${x},${y}`);
                        return;
                    }
                }
            }
        }
    }
}

function runWorker(creep) {
    if(creep.carry.energy == 0) {
        const source = creep.pos.findClosestByPath(FIND_SOURCES);
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
    } else {
        const targets = creep.room.find(FIND_MY_STRUCTURES, {
            filter: (s) => s.energy < s.energyCapacity && 
                          (s.structureType === STRUCTURE_SPAWN || 
                           s.structureType === STRUCTURE_EXTENSION || 
                           s.structureType === STRUCTURE_TOWER)
        });
        
        if(targets.length > 0) {
            const target = creep.pos.findClosestByPath(targets);
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        } else {
            const buildTargets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(buildTargets.length > 0) {
                if(creep.build(buildTargets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(buildTargets[0]);
                }
            } else if(creep.room.controller) {
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
            }
        }
    }
}

function runAttacker(creep) {
    // Check for target rooms with enemies
    if (Memory.targetRooms.length > 0 && creep.room.name === Object.values(Game.spawns)[0].room.name) {
        const targetRoom = Memory.targetRooms[0];
        const exit = creep.room.findExitTo(targetRoom);
        if (exit) {
            creep.moveTo(creep.pos.findClosestByRange(exit));
            return;
        }
    }
    
    const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if(target) {
        if(creep.attack(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    } else {
        const structures = creep.room.find(FIND_HOSTILE_STRUCTURES);
        if(structures.length > 0) {
            const priority = structures.find(s => s.structureType === STRUCTURE_SPAWN) ||
                           structures.find(s => s.structureType === STRUCTURE_TOWER) ||
                           structures[0];
            if(creep.attack(priority) == ERR_NOT_IN_RANGE) {
                creep.moveTo(priority);
            }
        }
    }
}

function runRanger(creep) {
    // Check for target rooms
    if (Memory.targetRooms.length > 0 && creep.room.name === Object.values(Game.spawns)[0].room.name) {
        const targetRoom = Memory.targetRooms[0];
        const exit = creep.room.findExitTo(targetRoom);
        if (exit) {
            creep.moveTo(creep.pos.findClosestByRange(exit));
            return;
        }
    }
    
    const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if(target) {
        const range = creep.pos.getRangeTo(target);
        if(range <= 3) {
            if(range > 1) {
                creep.rangedAttack(target);
            } else {
                creep.rangedMassAttack();
            }
        }
        
        if(range > 3) {
            creep.moveTo(target);
        } else if(range < 2) {
            const direction = creep.pos.getDirectionTo(target);
            const oppositeDir = ((direction + 3) % 8) + 1;
            creep.move(oppositeDir);
        }
    } else {
        const structures = creep.room.find(FIND_HOSTILE_STRUCTURES);
        if(structures.length > 0) {
            const priority = structures.find(s => s.structureType === STRUCTURE_SPAWN) ||
                           structures.find(s => s.structureType === STRUCTURE_TOWER) ||
                           structures[0];
            if(creep.pos.getRangeTo(priority) <= 3) {
                creep.rangedAttack(priority);
            }
            if(creep.pos.getRangeTo(priority) > 3) {
                creep.moveTo(priority);
            }
        }
    }
}

function runHealer(creep) {
    const damaged = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
        filter: (c) => c.hits < c.hitsMax
    });
    
    if(damaged) {
        if(creep.heal(damaged) == ERR_NOT_IN_RANGE) {
            creep.moveTo(damaged);
        }
    } else {
        const military = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: (c) => c.memory.role === 'attacker' || c.memory.role === 'ranger'
        });
        
        if(military && creep.pos.getRangeTo(military) > 2) {
            creep.moveTo(military);
        }
    }
}

function runTowers(towers, room) {
    for(let tower of towers) {
        const target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(target) {
            tower.attack(target);
            console.log('Tower engaging enemy!');
        } else {
            const damaged = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: (c) => c.hits < c.hitsMax
            });
            if(damaged) {
                tower.heal(damaged);
            }
        }
    }
}

function huntEnemies() {
    // Scan for enemies across all visible rooms
    for(let roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        const enemies = room.find(FIND_HOSTILE_CREEPS);
        const enemyStructures = room.find(FIND_HOSTILE_STRUCTURES);
        
        if(enemies.length > 0 || enemyStructures.length > 0) {
            console.log(`ENEMY DETECTED in ${roomName}: ${enemies.length} creeps, ${enemyStructures.length} structures`);
            if (!Memory.targetRooms.includes(roomName)) {
                Memory.targetRooms.push(roomName);
                console.log(`Added ${roomName} to target list!`);
            }
        }
    }
    
    // Clean up conquered rooms
    if (Game.time % 100 === 0) {
        Memory.targetRooms = Memory.targetRooms.filter(roomName => {
            const room = Game.rooms[roomName];
            if (room) {
                const enemies = room.find(FIND_HOSTILE_CREEPS);
                const enemyStructures = room.find(FIND_HOSTILE_STRUCTURES);
                return enemies.length > 0 || enemyStructures.length > 0;
            }
            return true;
        });
    }
}