// Claude's Advanced PvP Combat AI - Optimized for rapid destruction
// ULTIMATE GOAL: DESTROY ALL OPPONENTS AS FAST AS POSSIBLE

module.exports.loop = function () {
    // Clean dead creeps
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    const spawns = Object.values(Game.spawns);
    if (spawns.length === 0) {
        console.log('CRITICAL: No spawns! Need emergency placement!');
        return;
    }

    const mainSpawn = spawns[0];
    const room = mainSpawn.room;
    
    // Count forces and assess threat level
    const creeps = Object.values(Game.creeps);
    const workers = creeps.filter(c => c.memory.role === 'worker');
    const attackers = creeps.filter(c => c.memory.role === 'attacker');
    const rangers = creeps.filter(c => c.memory.role === 'ranger');
    const healers = creeps.filter(c => c.memory.role === 'healer');
    const towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    
    // THREAT ASSESSMENT
    const enemies = room.find(FIND_HOSTILE_CREEPS);
    const enemyStructures = room.find(FIND_HOSTILE_STRUCTURES);
    const totalMilitary = attackers.length + rangers.length;
    const threatLevel = enemies.length + (enemyStructures.length > 0 ? 5 : 0);
    
    console.log(`COMBAT STATUS - Tick ${Game.time}: Workers:${workers.length} | Military:${totalMilitary} (A:${attackers.length} R:${rangers.length} H:${healers.length}) | Towers:${towers.length} | Threat:${threatLevel} | Energy:${room.energyAvailable}/${room.energyCapacityAvailable}`);
    
    if (enemies.length > 0) {
        console.log(`ALERT: ${enemies.length} ENEMIES IN BASE!`);
    }
    if (enemyStructures.length > 0) {
        console.log(`TARGET: ${enemyStructures.length} enemy structures detected!`);
    }

    // EMERGENCY SPAWNING LOGIC
    if (!mainSpawn.spawning) {
        if (threatLevel > 0 && totalMilitary < threatLevel + 3) {
            // EMERGENCY: Prioritize military
            if (room.energyAvailable >= 400) {
                spawnRanger(mainSpawn); // Rangers for defense
            } else if (room.energyAvailable >= 290) {
                spawnAttacker(mainSpawn); // Attackers for offense
            } else if (room.energyAvailable >= 250 && workers.length < 2) {
                spawnWorker(mainSpawn); // Minimum workers
            }
        } else if (workers.length < 3) {
            spawnWorker(mainSpawn); // Economy first if no threat
        } else if (totalMilitary < 8) {
            // BUILD ARMY
            if (room.energyAvailable >= 400) {
                if (rangers.length < attackers.length) {
                    spawnRanger(mainSpawn);
                } else if (healers.length < Math.floor(totalMilitary / 4)) {
                    spawnHealer(mainSpawn);
                } else {
                    spawnAttacker(mainSpawn);
                }
            } else if (room.energyAvailable >= 250) {
                spawnWorker(mainSpawn);
            }
        }
    }

    // BUILD CRITICAL DEFENSES
    buildDefenses(room, mainSpawn);
    
    // Execute creep behaviors
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        
        if(creep.memory.role == 'worker') {
            runWorker(creep);
        } else if(creep.memory.role == 'attacker') {
            runAttacker(creep);
        } else if(creep.memory.role == 'ranger') {
            runRanger(creep);
        } else if(creep.memory.role == 'healer') {
            runHealer(creep);
        }
    }

    // TOWER OPERATIONS
    runTowers(towers, room);
};

function spawnWorker(spawn) {
    const name = 'Worker' + Game.time;
    const parts = spawn.room.energyAvailable >= 300 ? 
        [WORK,WORK,CARRY,MOVE] : [WORK,CARRY,MOVE];
    
    if(spawn.spawnCreep(parts, name, {memory: {role: 'worker'}}) == OK) {
        console.log('SPAWN: Worker ' + name);
    }
}

function spawnRanger(spawn) {
    const name = 'Ranger' + Game.time;
    const energy = spawn.room.energyAvailable;
    let parts;
    
    if (energy >= 500) {
        parts = [RANGED_ATTACK,RANGED_ATTACK,MOVE,MOVE,HEAL]; // Elite ranger
    } else if (energy >= 400) {
        parts = [RANGED_ATTACK,RANGED_ATTACK,MOVE,MOVE]; // Strong ranger
    } else if (energy >= 260) {
        parts = [RANGED_ATTACK,MOVE,MOVE]; // Fast ranger
    } else {
        return;
    }
    
    if(spawn.spawnCreep(parts, name, {memory: {role: 'ranger'}}) == OK) {
        console.log('SPAWN: Ranger ' + name + ' (Combat Ready)');
    }
}

function spawnAttacker(spawn) {
    const name = 'Attacker' + Game.time;
    const energy = spawn.room.energyAvailable;
    let parts;
    
    if (energy >= 520) {
        parts = [ATTACK,ATTACK,TOUGH,MOVE,MOVE,MOVE]; // Elite attacker
    } else if (energy >= 390) {
        parts = [ATTACK,ATTACK,MOVE,MOVE,MOVE]; // Strong attacker
    } else if (energy >= 210) {
        parts = [ATTACK,MOVE,MOVE]; // Fast attacker
    } else {
        return;
    }
    
    if(spawn.spawnCreep(parts, name, {memory: {role: 'attacker'}}) == OK) {
        console.log('SPAWN: Attacker ' + name + ' (Assault Ready)');
    }
}

function spawnHealer(spawn) {
    const name = 'Healer' + Game.time;
    const energy = spawn.room.energyAvailable;
    let parts;
    
    if (energy >= 500) {
        parts = [HEAL,HEAL,MOVE,MOVE]; // Strong healer
    } else if (energy >= 300) {
        parts = [HEAL,MOVE,MOVE]; // Basic healer
    } else {
        return;
    }
    
    if(spawn.spawnCreep(parts, name, {memory: {role: 'healer'}}) == OK) {
        console.log('SPAWN: Healer ' + name + ' (Support Ready)');
    }
}

function buildDefenses(room, spawn) {
    const controller = room.controller;
    const towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    const extensions = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}});
    const constructionSites = room.find(FIND_CONSTRUCTION_SITES);
    
    // PRIORITY 1: TOWERS FOR DEFENSE
    if (towers.length === 0 && controller && controller.level >= 3) {
        const towerSites = constructionSites.filter(s => s.structureType === STRUCTURE_TOWER);
        if (towerSites.length === 0) {
            for(let range = 3; range <= 6; range++) {
                const positions = [];
                for(let dx = -range; dx <= range; dx++) {
                    for(let dy = -range; dy <= range; dy++) {
                        if(Math.abs(dx) + Math.abs(dy) === range) {
                            positions.push({x: spawn.pos.x + dx, y: spawn.pos.y + dy});
                        }
                    }
                }
                
                for(let pos of positions) {
                    if(pos.x > 0 && pos.x < 49 && pos.y > 0 && pos.y < 49) {
                        if(room.createConstructionSite(pos.x, pos.y, STRUCTURE_TOWER) === OK) {
                            console.log(`BUILD: Tower at ${pos.x},${pos.y}`);
                            return;
                        }
                    }
                }
            }
        }
    }
    
    // PRIORITY 2: EXTENSIONS FOR ENERGY
    const maxExtensions = CONTROLLER_STRUCTURES && CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION] ? 
        CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][controller.level] : 0;
    if (extensions.length < maxExtensions && constructionSites.filter(s => s.structureType === STRUCTURE_EXTENSION).length === 0) {
        for(let range = 2; range <= 4; range++) {
            for(let dx = -range; dx <= range; dx++) {
                for(let dy = -range; dy <= range; dy++) {
                    const x = spawn.pos.x + dx;
                    const y = spawn.pos.y + dy;
                    if(x > 0 && x < 49 && y > 0 && y < 49) {
                        if(room.createConstructionSite(x, y, STRUCTURE_EXTENSION) === OK) {
                            console.log(`BUILD: Extension at ${x},${y}`);
                            return;
                        }
                    }
                }
            }
        }
    }
}

function runWorker(creep) {
    if(creep.store.energy == 0) {
        const source = creep.pos.findClosestByPath(FIND_SOURCES);
        if(source && creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    } else {
        // Priority: Spawn > Extensions > Towers > Build > Upgrade
        const energyTargets = creep.room.find(FIND_MY_STRUCTURES, {
            filter: (s) => s.store && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0 &&
                          (s.structureType === STRUCTURE_SPAWN || 
                           s.structureType === STRUCTURE_EXTENSION ||
                           s.structureType === STRUCTURE_TOWER)
        });
        
        if(energyTargets.length > 0) {
            const target = creep.pos.findClosestByPath(energyTargets);
            if(target && creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        } else {
            const buildTargets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(buildTargets.length > 0) {
                const priority = buildTargets.find(s => s.structureType === STRUCTURE_TOWER) ||
                               buildTargets.find(s => s.structureType === STRUCTURE_EXTENSION) ||
                               buildTargets[0];
                if(creep.build(priority) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(priority);
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
    const enemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if(enemy) {
        if(creep.attack(enemy) == ERR_NOT_IN_RANGE) {
            creep.moveTo(enemy, {visualizePathStyle: {stroke: '#ff0000'}});
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
            // Patrol position
            const center = new RoomPosition(25, 25, creep.room.name);
            if(creep.pos.getRangeTo(center) > 15) {
                creep.moveTo(center);
            }
        }
    }
}

function runRanger(creep) {
    const enemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if(enemy) {
        const range = creep.pos.getRangeTo(enemy);
        if(range <= 3) {
            if(range > 1) {
                creep.rangedAttack(enemy);
            } else {
                creep.rangedMassAttack();
            }
        }
        
        // Maintain optimal range
        if(range > 3) {
            creep.moveTo(enemy);
        } else if(range < 2) {
            // Kite away
            const direction = creep.pos.getDirectionTo(enemy);
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
                creep.moveTo(target);
            }
        } else {
            // Defensive position near spawn
            const spawn = Object.values(Game.spawns)[0];
            if(spawn && creep.pos.getRangeTo(spawn) > 4) {
                creep.moveTo(spawn);
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
        const enemy = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(enemy) {
            tower.attack(enemy);
            console.log(`TOWER FIRE: Attacking ${enemy.name} at ${enemy.pos}`);
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