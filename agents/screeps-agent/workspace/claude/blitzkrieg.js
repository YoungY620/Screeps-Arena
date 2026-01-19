// Claude's BLITZKRIEG PvP AI - Maximum Aggression Mode
// SEEK AND DESTROY - NO MERCY

module.exports.loop = function () {
    // Memory cleanup
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    if (!Memory.warMode) Memory.warMode = true;
    if (!Memory.enemyRooms) Memory.enemyRooms = [];
    if (!Memory.lastSeen) Memory.lastSeen = {};

    console.log(`=== CLAUDE BLITZKRIEG - TICK ${Game.time} ===`);

    const spawns = Object.values(Game.spawns);
    if (spawns.length === 0) return;

    const mainSpawn = spawns[0];
    const room = mainSpawn.room;
    
    // Force count
    const creeps = Object.values(Game.creeps);
    const workers = creeps.filter(c => c.memory.role === 'worker');
    const warriors = creeps.filter(c => c.memory.role === 'warrior');
    const scouts = creeps.filter(c => c.memory.role === 'scout');

    console.log(`Forces: ${warriors.length} warriors, ${workers.length} workers, ${scouts.length} scouts | Energy: ${room.energyAvailable}/${room.energyCapacityAvailable}`);

    // ULTRA AGGRESSIVE SPAWNING
    if (!mainSpawn.spawning) {
        // Only 1 worker max - economy is secondary to WAR
        if (workers.length === 0 && room.energyAvailable >= 200) {
            spawnWorker(mainSpawn);
        }
        // Scout constantly to find enemies
        else if (scouts.length < 3 && room.energyAvailable >= 50) {
            spawnScout(mainSpawn);
        }
        // WARRIORS FIRST!
        else if (room.energyAvailable >= 300) {
            spawnWarrior(mainSpawn);
        }
    }

    // Execute all roles
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        
        switch(creep.memory.role) {
            case 'worker': runWorker(creep); break;
            case 'warrior': runWarrior(creep); break;
            case 'scout': runScout(creep); break;
        }
    }

    // Towers shoot everything that moves
    const towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    for(let tower of towers) {
        const target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(target) {
            tower.attack(target);
            console.log('TOWER ENGAGING ENEMY! KILL KILL KILL!');
        }
    }

    // Intelligence gathering - every tick
    gatherIntelligence();

    // Build minimal defenses
    if (Game.time % 10 === 0) {
        buildWarInfrastructure(room, mainSpawn);
    }

    // War status report
    if (Game.time % 25 === 0) {
        console.log(`WAR STATUS: ${Memory.enemyRooms.length} enemy rooms detected: ${Memory.enemyRooms.join(', ')}`);
    }
};

function spawnWorker(spawn) {
    const name = 'W' + Game.time;
    if(spawn.spawnCreep([WORK,CARRY,MOVE], name, {memory: {role: 'worker'}}) == OK) {
        console.log('Spawning worker: ' + name);
    }
}

function spawnWarrior(spawn) {
    const name = 'KILL' + Game.time;
    let parts;
    const energy = spawn.room.energyAvailable;
    
    // Build the most deadly warrior possible
    if (energy >= 600) {
        parts = [RANGED_ATTACK,RANGED_ATTACK,ATTACK,HEAL,MOVE,MOVE,MOVE,MOVE];
    } else if (energy >= 500) {
        parts = [RANGED_ATTACK,ATTACK,HEAL,MOVE,MOVE,MOVE];
    } else if (energy >= 400) {
        parts = [RANGED_ATTACK,ATTACK,MOVE,MOVE];
    } else {
        parts = [RANGED_ATTACK,MOVE,MOVE];
    }
    
    if(spawn.spawnCreep(parts, name, {memory: {role: 'warrior'}}) == OK) {
        console.log('SPAWNING WARRIOR OF DEATH: ' + name + ' (' + parts.length + ' parts)');
    }
}

function spawnScout(spawn) {
    const name = 'S' + Game.time;
    if(spawn.spawnCreep([MOVE], name, {memory: {role: 'scout'}}) == OK) {
        console.log('Spawning scout: ' + name);
    }
}

function runWorker(creep) {
    if(creep.carry.energy == 0) {
        const source = creep.pos.findClosestByPath(FIND_SOURCES);
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
    } else {
        // Priority: Spawn > Extensions > Towers
        const targets = creep.room.find(FIND_MY_STRUCTURES, {
            filter: (s) => s.energy < s.energyCapacity
        });
        
        if(targets.length > 0) {
            const target = creep.pos.findClosestByPath(targets);
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        } else {
            // Build war infrastructure
            const sites = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(sites.length > 0) {
                if(creep.build(sites[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sites[0]);
                }
            } else {
                // Upgrade when nothing else to do
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
            }
        }
    }
}

function runWarrior(creep) {
    // If we know of enemy rooms, go there first
    if (Memory.enemyRooms.length > 0) {
        const targetRoom = Memory.enemyRooms[0];
        if (creep.room.name !== targetRoom) {
            const exit = creep.room.findExitTo(targetRoom);
            if (exit) {
                creep.moveTo(creep.pos.findClosestByRange(exit));
                return;
            }
        }
    }

    // KILL EVERYTHING!
    const hostileCreeps = creep.room.find(FIND_HOSTILE_CREEPS);
    const hostileStructures = creep.room.find(FIND_HOSTILE_STRUCTURES);

    if (hostileCreeps.length > 0) {
        const target = creep.pos.findClosestByRange(hostileCreeps);
        const range = creep.pos.getRangeTo(target);
        
        // Attack with everything we have
        if (creep.getActiveBodyparts(RANGED_ATTACK) > 0) {
            if (range <= 3) {
                if (range === 1) {
                    creep.rangedMassAttack();
                } else {
                    creep.rangedAttack(target);
                }
            }
        }
        
        if (creep.getActiveBodyparts(ATTACK) > 0 && range === 1) {
            creep.attack(target);
        }
        
        if (creep.getActiveBodyparts(HEAL) > 0 && creep.hits < creep.hitsMax) {
            creep.heal(creep);
        }
        
        // Movement logic
        if (range > 3) {
            creep.moveTo(target, {reusePath: 3});
        } else if (range < 2 && creep.getActiveBodyparts(RANGED_ATTACK) > 0) {
            // Keep distance for ranged
            const direction = creep.pos.getDirectionTo(target);
            const oppositeDir = ((direction + 3) % 8) + 1;
            creep.move(oppositeDir);
        } else if (range > 1 && creep.getActiveBodyparts(ATTACK) > 0) {
            // Close in for melee
            creep.moveTo(target);
        }

        console.log(`WARRIOR ${creep.name} ENGAGING ${target.name} at range ${range}!`);
    }
    else if (hostileStructures.length > 0) {
        // Destroy their base!
        const target = hostileStructures.find(s => s.structureType === STRUCTURE_SPAWN) ||
                      hostileStructures.find(s => s.structureType === STRUCTURE_TOWER) ||
                      hostileStructures[0];
        
        const range = creep.pos.getRangeTo(target);
        
        if (creep.getActiveBodyparts(RANGED_ATTACK) > 0 && range <= 3) {
            creep.rangedAttack(target);
        }
        if (creep.getActiveBodyparts(ATTACK) > 0 && range === 1) {
            creep.attack(target);
        }
        
        if (range > 1) {
            creep.moveTo(target);
        }
        
        console.log(`WARRIOR ${creep.name} DESTROYING ${target.structureType}!`);
    }
    else {
        // Patrol for enemies
        if (creep.pos.x === 0 || creep.pos.x === 49 || creep.pos.y === 0 || creep.pos.y === 49) {
            // At edge, move randomly inward
            creep.move(Math.floor(Math.random() * 8) + 1);
        } else {
            // Random patrol
            creep.move(Math.floor(Math.random() * 8) + 1);
        }
    }
}

function runScout(creep) {
    // Assign target room for scouting
    if (!creep.memory.target) {
        const roomsToScout = [
            'W1N2', 'W3N2', 'W2N1', 'W2N3',  // Adjacent
            'W1N1', 'W3N3', 'W1N3', 'W3N1',  // Diagonal
            'W0N2', 'W4N2', 'W2N0', 'W2N4'   // Further out
        ];
        creep.memory.target = roomsToScout[Game.time % roomsToScout.length];
    }

    if (creep.room.name !== creep.memory.target) {
        // Move to target room
        const exit = creep.room.findExitTo(creep.memory.target);
        if (exit) {
            creep.moveTo(creep.pos.findClosestByRange(exit));
        }
    } else {
        // Scout current room
        const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
        const enemyStructures = creep.room.find(FIND_HOSTILE_STRUCTURES);
        
        if (enemies.length > 0 || enemyStructures.length > 0) {
            console.log(`SCOUT ALERT: ENEMIES IN ${creep.room.name}! ${enemies.length} creeps, ${enemyStructures.length} structures`);
            if (!Memory.enemyRooms.includes(creep.room.name)) {
                Memory.enemyRooms.push(creep.room.name);
                Memory.lastSeen[creep.room.name] = Game.time;
                console.log(`TARGET ACQUIRED: ${creep.room.name} added to hit list!`);
            }
        }

        // Move around to explore
        if (creep.fatigue === 0) {
            creep.move(Math.floor(Math.random() * 8) + 1);
        }
        
        // Scout completed, assign new target
        if (Game.time % 100 === 0) {
            creep.memory.target = undefined;
        }
    }
}

function gatherIntelligence() {
    // Scan all visible rooms for enemies
    for(let roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        const enemies = room.find(FIND_HOSTILE_CREEPS);
        const enemyStructures = room.find(FIND_HOSTILE_STRUCTURES);
        
        if (enemies.length > 0 || enemyStructures.length > 0) {
            if (!Memory.enemyRooms.includes(roomName)) {
                Memory.enemyRooms.push(roomName);
                Memory.lastSeen[roomName] = Game.time;
                console.log(`INTELLIGENCE: New enemy base detected at ${roomName}!`);
            } else {
                Memory.lastSeen[roomName] = Game.time;
            }
        }
    }
    
    // Clean up old intelligence every 500 ticks
    if (Game.time % 500 === 0) {
        Memory.enemyRooms = Memory.enemyRooms.filter(roomName => {
            const room = Game.rooms[roomName];
            if (room) {
                const hasEnemies = room.find(FIND_HOSTILE_CREEPS).length > 0 || 
                                 room.find(FIND_HOSTILE_STRUCTURES).length > 0;
                if (!hasEnemies) {
                    console.log(`VICTORY: ${roomName} cleared of enemies!`);
                }
                return hasEnemies;
            }
            return Game.time - Memory.lastSeen[roomName] < 1000; // Keep for 1000 ticks
        });
    }
}

function buildWarInfrastructure(room, spawn) {
    const controller = room.controller;
    const sites = room.find(FIND_CONSTRUCTION_SITES);
    
    if (sites.length > 0) return; // Don't spam construction sites
    
    // Priority: Tower for defense
    const towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    if (towers.length === 0 && controller.level >= 3) {
        const pos = spawn.pos;
        for(let range = 2; range <= 4; range++) {
            for(let dx = -range; dx <= range; dx++) {
                for(let dy = -range; dy <= range; dy++) {
                    if(Math.abs(dx) + Math.abs(dy) !== range) continue;
                    const x = pos.x + dx;
                    const y = pos.y + dy;
                    if(x > 1 && x < 48 && y > 1 && y < 48) {
                        if(room.createConstructionSite(x, y, STRUCTURE_TOWER) === OK) {
                            console.log(`BUILDING TOWER OF DEATH at ${x},${y}`);
                            return;
                        }
                    }
                }
            }
        }
    }
    
    // Extensions for more energy
    const extensions = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}});
    const maxExt = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][controller.level] || 0;
    if (extensions.length < Math.min(maxExt, 10)) {
        const pos = spawn.pos;
        for(let dx = -3; dx <= 3; dx++) {
            for(let dy = -3; dy <= 3; dy++) {
                if(dx === 0 && dy === 0) continue;
                const x = pos.x + dx;
                const y = pos.y + dy;
                if(x > 1 && x < 48 && y > 1 && y < 48) {
                    if(room.createConstructionSite(x, y, STRUCTURE_EXTENSION) === OK) {
                        console.log(`Building extension at ${x},${y}`);
                        return;
                    }
                }
            }
        }
    }
}