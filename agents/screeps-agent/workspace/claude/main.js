// Claude's Screeps AI - Advanced PvP Arena Combat Agent
// ULTIMATE GOAL: DESTROY ALL OPPONENTS WHILE DEFENDING
// Enhanced with better spawning logic and multi-room support

module.exports.loop = function () {
    // Clear memory of dead creeps
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // Emergency: If we have no spawn, log critical error and try to place one
    const spawns = Object.values(Game.spawns);
    if (spawns.length === 0) {
        console.log('CRITICAL: No spawns available! Attempting emergency spawn placement...');
        attemptSpawnPlacement();
        return;
    }

    const mainSpawn = spawns[0];
    const room = mainSpawn.room;
    
    // Count our current forces
    const creeps = Object.values(Game.creeps);
    const workers = creeps.filter(c => c.memory.role === 'worker');
    const attackers = creeps.filter(c => c.memory.role === 'attacker');
    const healers = creeps.filter(c => c.memory.role === 'healer');
    const rangers = creeps.filter(c => c.memory.role === 'ranger');
    const towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    
    console.log(`Tick ${Game.time}: Workers: ${workers.length}, Attackers: ${attackers.length}, Rangers: ${rangers.length}, Healers: ${healers.length}, Towers: ${towers.length}, Energy: ${room.energyAvailable}/${room.energyCapacityAvailable}`);

    // ENHANCED PHASE 1: Economy with minimum viable force
    const totalMilitary = attackers.length + rangers.length;
    const needWorkers = workers.length < Math.max(2, Math.ceil(room.energyCapacityAvailable / 300));
    const needDefense = totalMilitary < 2;
    
    if (!mainSpawn.spawning) {
        if (needWorkers && (!needDefense || workers.length === 0)) {
            spawnWorker(mainSpawn);
        } else if (needDefense && room.energyAvailable >= 260) {
            // Prioritize rangers for better defense
            spawnRanger(mainSpawn);
        } else if (totalMilitary < 5 && room.energyAvailable >= 290) {
            // Build larger army
            if (rangers.length < attackers.length) {
                spawnRanger(mainSpawn);
            } else if (healers.length < Math.floor(totalMilitary / 3)) {
                spawnHealer(mainSpawn);
            } else {
                spawnAttacker(mainSpawn);
            }
        } else if (workers.length < 4 && room.energyAvailable >= 250) {
            spawnWorker(mainSpawn);
        }
    }

    // ENHANCED DEFENSE: Build critical structures
    buildDefenses(room, mainSpawn);

    // Execute all creep behaviors
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        
        if(creep.memory.role == 'worker') {
            runWorker(creep);
        }
        else if(creep.memory.role == 'attacker') {
            runAttacker(creep);
        }
        else if(creep.memory.role == 'ranger') {
            runRanger(creep);
        }
        else if(creep.memory.role == 'healer') {
            runHealer(creep);
        }
    }

    // Enhanced Tower defense with prioritization
    runTowers(towers, room);

    // Scout and coordinate attacks every 5 ticks
    if (Game.time % 5 === 0) {
        scoutAndCoordinate();
    }
    
    // Place spawn if we're in an empty world
    if (Game.time % 50 === 0 && spawns.length === 0) {
        attemptSpawnPlacement();
    }
};

function attemptSpawnPlacement() {
    console.log('Attempting to place spawn...');
    // In an empty world, try to place spawn via game API
    const room = Game.rooms.W5N5;
    if (room && !Object.keys(Game.spawns).length) {
        console.log('Room W5N5 available, trying to place spawn...');
        // Room is available but we need to use HTTP API to place spawn
        // For now, just log that we need spawn placement
        console.log('NEED SPAWN PLACEMENT VIA HTTP API AT W5N5 (25,25)');
    } else {
        console.log('Checking available rooms for spawn placement...');
        for (let roomName in Game.rooms) {
            console.log(`Available room: ${roomName}`);
        }
    }
}

function spawnWorker(spawn) {
    const name = 'Worker' + Game.time;
    const parts = spawn.room.energyAvailable >= 300 ? 
        [WORK,WORK,CARRY,MOVE] :  // Efficient worker
        [WORK,CARRY,MOVE];        // Basic worker
    
    if(spawn.spawnCreep(parts, name, {memory: {role: 'worker'}}) == OK) {
        console.log('Spawning worker: ' + name + ' (' + parts.length + ' parts)');
    }
}

function spawnRanger(spawn) {
    const name = 'Ranger' + Game.time;
    const energy = spawn.room.energyAvailable;
    let parts;
    
    if (energy >= 400) {
        parts = [RANGED_ATTACK,RANGED_ATTACK,MOVE,MOVE];  // Strong ranger
    } else if (energy >= 260) {
        parts = [RANGED_ATTACK,MOVE,MOVE];                // Fast ranger
    } else {
        return; // Not enough energy
    }
    
    if(spawn.spawnCreep(parts, name, {memory: {role: 'ranger'}}) == OK) {
        console.log('Spawning ranger: ' + name);
    }
}

function spawnAttacker(spawn) {
    const name = 'Attacker' + Game.time;
    const energy = spawn.room.energyAvailable;
    let parts;
    
    if (energy >= 390) {
        parts = [ATTACK,ATTACK,MOVE,MOVE,MOVE];  // Strong attacker
    } else if (energy >= 210) {
        parts = [ATTACK,MOVE,MOVE];              // Fast attacker
    } else {
        return;
    }
    
    if(spawn.spawnCreep(parts, name, {memory: {role: 'attacker'}}) == OK) {
        console.log('Spawning attacker: ' + name);
    }
}

function spawnHealer(spawn) {
    const name = 'Healer' + Game.time;
    const energy = spawn.room.energyAvailable;
    let parts;
    
    if (energy >= 500) {
        parts = [HEAL,HEAL,MOVE,MOVE];    // Strong healer
    } else if (energy >= 300) {
        parts = [HEAL,MOVE,MOVE];         // Basic healer
    } else {
        return;
    }
    
    if(spawn.spawnCreep(parts, name, {memory: {role: 'healer'}}) == OK) {
        console.log('Spawning healer: ' + name);
    }
}

function buildDefenses(room, spawn) {
    const controller = room.controller;
    const towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    const extensions = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}});
    const constructionSites = room.find(FIND_CONSTRUCTION_SITES);
    
    // Priority 1: Towers for defense
    if (towers.length === 0 && controller.level >= 3 && constructionSites.filter(s => s.structureType === STRUCTURE_TOWER).length === 0) {
        const pos = spawn.pos;
        // Try to place tower in a defensive position
        for(let range = 2; range <= 4; range++) {
            for(let dx = -range; dx <= range; dx++) {
                for(let dy = -range; dy <= range; dy++) {
                    if(Math.abs(dx) + Math.abs(dy) !== range) continue;
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
    }
    
    // Priority 2: Extensions for economy
    const maxExtensions = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][controller.level] || 0;
    if (extensions.length < maxExtensions && constructionSites.filter(s => s.structureType === STRUCTURE_EXTENSION).length === 0) {
        const pos = spawn.pos;
        // Place extensions near spawn
        for(let range = 2; range <= 5; range++) {
            for(let dx = -range; dx <= range; dx++) {
                for(let dy = -range; dy <= range; dy++) {
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
    
    // Priority 3: Walls and ramparts for protection
    if (controller.level >= 2 && towers.length > 0) {
        buildWallsAroundSpawn(room, spawn);
    }
}

function buildWallsAroundSpawn(room, spawn) {
    const constructionSites = room.find(FIND_CONSTRUCTION_SITES);
    const wallSites = constructionSites.filter(s => s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART);
    
    if (wallSites.length > 0) return; // Already building walls
    
    const pos = spawn.pos;
    const positions = [
        {x: pos.x-2, y: pos.y-2}, {x: pos.x-1, y: pos.y-2}, {x: pos.x, y: pos.y-2}, {x: pos.x+1, y: pos.y-2}, {x: pos.x+2, y: pos.y-2},
        {x: pos.x-2, y: pos.y+2}, {x: pos.x-1, y: pos.y+2}, {x: pos.x, y: pos.y+2}, {x: pos.x+1, y: pos.y+2}, {x: pos.x+2, y: pos.y+2},
        {x: pos.x-2, y: pos.y-1}, {x: pos.x-2, y: pos.y}, {x: pos.x-2, y: pos.y+1},
        {x: pos.x+2, y: pos.y-1}, {x: pos.x+2, y: pos.y}, {x: pos.x+2, y: pos.y+1}
    ];
    
    for(let pos of positions) {
        if(pos.x > 0 && pos.x < 49 && pos.y > 0 && pos.y < 49) {
            if(room.createConstructionSite(pos.x, pos.y, STRUCTURE_WALL) === OK) {
                console.log(`Placing wall at ${pos.x},${pos.y}`);
                return;
            }
        }
    }
}

function runWorker(creep) {
    if(creep.carry.energy == 0) {
        // Harvest energy
        const sources = creep.room.find(FIND_SOURCES);
        const source = creep.pos.findClosestByPath(sources);
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
    else {
        // Priority: Spawn > Extensions > Towers > Build > Upgrade
        const targets = [
            ...creep.room.find(FIND_MY_STRUCTURES, {filter: (s) => s.energy < s.energyCapacity && (s.structureType === STRUCTURE_SPAWN || s.structureType === STRUCTURE_EXTENSION)}),
            ...creep.room.find(FIND_MY_STRUCTURES, {filter: (s) => s.energy < s.energyCapacity && s.structureType === STRUCTURE_TOWER})
        ];
        
        if(targets.length > 0) {
            const target = creep.pos.findClosestByPath(targets);
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            const buildTargets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(buildTargets.length > 0) {
                // Priority: Towers > Extensions > Walls
                const priority = buildTargets.find(s => s.structureType === STRUCTURE_TOWER) ||
                               buildTargets.find(s => s.structureType === STRUCTURE_EXTENSION) ||
                               buildTargets[0];
                if(creep.build(priority) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(priority, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else if(creep.room.controller) {
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
}

function runAttacker(creep) {
    const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if(target) {
        if(creep.attack(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
        }
    } else {
        const structures = creep.room.find(FIND_HOSTILE_STRUCTURES);
        if(structures.length > 0) {
            const target = structures.find(s => s.structureType === STRUCTURE_SPAWN) ||
                          structures.find(s => s.structureType === STRUCTURE_TOWER) ||
                          structures[0];
            if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
            }
        } else {
            // No enemies, patrol or move to center
            const flag = Game.flags.attack;
            if(flag) {
                creep.moveTo(flag);
            } else {
                const center = new RoomPosition(25, 25, creep.room.name);
                if(creep.pos.getRangeTo(center) > 10) {
                    creep.moveTo(center);
                }
            }
        }
    }
}

function runRanger(creep) {
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
            creep.moveTo(target, {visualizePathStyle: {stroke: '#00ff00'}});
        } else if(range < 2) {
            // Keep distance
            const direction = creep.pos.getDirectionTo(target);
            const oppositeDir = ((direction + 3) % 8) + 1;
            creep.move(oppositeDir);
        }
    } else {
        const structures = creep.room.find(FIND_HOSTILE_STRUCTURES);
        if(structures.length > 0) {
            const target = structures.find(s => s.structureType === STRUCTURE_SPAWN) ||
                          structures.find(s => s.structureType === STRUCTURE_TOWER) ||
                          structures[0];
            if(creep.pos.getRangeTo(target) <= 3) {
                creep.rangedAttack(target);
            }
            if(creep.pos.getRangeTo(target) > 3) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#00ff00'}});
            }
        } else {
            // Defensive position
            const spawn = Object.values(Game.spawns)[0];
            if(spawn && creep.pos.getRangeTo(spawn) > 5) {
                creep.moveTo(spawn);
            }
        }
    }
}

function runHealer(creep) {
    // Find damaged friendly creeps
    const damaged = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
        filter: (c) => c.hits < c.hitsMax
    });
    
    if(damaged) {
        if(creep.heal(damaged) == ERR_NOT_IN_RANGE) {
            creep.moveTo(damaged, {visualizePathStyle: {stroke: '#00ff00'}});
        }
    } else {
        // Follow military units
        const military = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: (c) => c.memory.role === 'attacker' || c.memory.role === 'ranger'
        });
        
        if(military && creep.pos.getRangeTo(military) > 3) {
            creep.moveTo(military);
        }
    }
}

function runTowers(towers, room) {
    for(let tower of towers) {
        const target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(target) {
            tower.attack(target);
        } else {
            // Heal damaged creeps
            const damaged = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: (c) => c.hits < c.hitsMax
            });
            if(damaged) {
                tower.heal(damaged);
            } else {
                // Repair structures
                const damagedStructure = tower.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                    filter: (s) => s.hits < s.hitsMax && s.structureType !== STRUCTURE_WALL
                });
                if(damagedStructure) {
                    tower.repair(damagedStructure);
                }
            }
        }
    }
}

function scoutAndCoordinate() {
    const spawns = Object.values(Game.spawns);
    if(spawns.length === 0) return;
    
    const room = spawns[0].room;
    const enemies = room.find(FIND_HOSTILE_CREEPS);
    const enemyStructures = room.find(FIND_HOSTILE_STRUCTURES);
    
    if(enemies.length > 0) {
        console.log(`ALERT: ${enemies.length} enemy creeps detected!`);
        for(let enemy of enemies) {
            console.log(`- ${enemy.name} at ${enemy.pos} (${enemy.body.length} parts, ${enemy.hits}/${enemy.hitsMax} HP)`);
        }
    }
    
    if(enemyStructures.length > 0) {
        console.log(`ALERT: ${enemyStructures.length} enemy structures detected!`);
        const spawns = enemyStructures.filter(s => s.structureType === STRUCTURE_SPAWN);
        if(spawns.length > 0) {
            console.log(`Priority target: ${spawns.length} enemy spawn(s) at ${spawns[0].pos}`);
        }
    }
}