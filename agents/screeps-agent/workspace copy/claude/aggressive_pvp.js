// AGGRESSIVE PvP AI - ULTIMATE COMBAT STRATEGY
// Fast economy + strong defense + relentless offense

const ROLES = {
    HARVESTER: 'harvester',
    BUILDER: 'builder', 
    UPGRADER: 'upgrader',
    GUARD: 'guard',
    ATTACKER: 'attacker',
    RANGED: 'ranged',
    HEALER: 'healer',
    SCOUT: 'scout',
    SABOTEUR: 'saboteur'
};

function getBodyParts(role, energy) {
    // Optimized bodies for PvP combat
    if (role === ROLES.ATTACKER) {
        // High damage melee units
        if (energy >= 1300) return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE];
        if (energy >= 1000) return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE];
        if (energy >= 700) return [ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE];
        return [ATTACK, ATTACK, ATTACK, MOVE, MOVE];
    }
    if (role === ROLES.RANGED) {
        // Ranged attack specialists
        if (energy >= 1200) return [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE];
        if (energy >= 800) return [RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE];
        return [RANGED_ATTACK, MOVE, MOVE];
    }
    if (role === ROLES.HEALER) {
        // Combat healers
        if (energy >= 1000) return [HEAL, HEAL, MOVE, MOVE, MOVE];
        if (energy >= 600) return [HEAL, MOVE, MOVE];
        return [HEAL, MOVE];
    }
    if (role === ROLES.GUARD) {
        // Base defense with tough parts
        if (energy >= 1000) return [TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, MOVE, MOVE];
        if (energy >= 700) return [TOUGH, ATTACK, ATTACK, MOVE, MOVE];
        return [ATTACK, ATTACK, MOVE, MOVE];
    }
    if (role === ROLES.SCOUT) {
        // Fast reconnaissance
        return [MOVE, MOVE, MOVE, MOVE];
    }
    if (role === ROLES.SABOTEUR) {
        // Controller attackers
        if (energy >= 800) return [CLAIM, MOVE, MOVE];
        return [CLAIM, MOVE];
    }
    // Economic units
    if (energy >= 800) return [WORK, WORK, WORK, CARRY, CARRY, MOVE];
    if (energy >= 600) return [WORK, WORK, CARRY, CARRY, MOVE];
    return [WORK, CARRY, MOVE];
}

function spawnCreep(spawn, role, body) {
    if (!spawn.spawning && spawn.store[RESOURCE_ENERGY] >= body.reduce((sum, part) => sum + BODYPART_COST[part], 0)) {
        const name = role + '_' + Game.time;
        const result = spawn.spawnCreep(body, name, {memory: {role: role, born: Game.time}});
        if (result === OK) {
            console.log('🎯 DEPLOYED: ' + name + ' (' + role.toUpperCase() + ')');
            return true;
        }
    }
    return false;
}

function defendRoom(room) {
    // Tower defense - maximum efficiency
    const towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    const enemies = room.find(FIND_HOSTILE_CREEPS);
    
    if (enemies.length > 0) {
        console.log('⚔️ ENEMY DETECTED: ' + enemies.length + ' hostiles in ' + room.name);
        
        towers.forEach(tower => {
            if (tower.store[RESOURCE_ENERGY] >= 10) {
                const target = tower.pos.findClosestByRange(enemies);
                if (target) {
                    tower.attack(target);
                    console.log('🔫 TOWER FIRING: ' + target.name + ' (' + Math.floor(600 / Math.max(1, tower.pos.getRangeTo(target))) + ' dmg)');
                }
            }
        });
        
        return true;
    }
    return false;
}

function emergencyDefense(room) {
    // Rapid response to enemy attacks
    const enemies = room.find(FIND_HOSTILE_CREEPS);
    const spawns = room.find(FIND_MY_SPAWNS);
    
    if (enemies.length > 0) {
        console.log('🚨 EMERGENCY DEFENSE: ' + enemies.length + ' enemies attacking!');
        
        spawns.forEach(spawn => {
            // Deploy guards immediately
            const guardsNeeded = Math.ceil(enemies.length * 1.5);
            const currentGuards = room.find(FIND_MY_CREEPS, {filter: c => c.memory.role === ROLES.GUARD}).length;
            
            if (currentGuards < guardsNeeded) {
                spawnCreep(spawn, ROLES.GUARD, getBodyParts(ROLES.GUARD, spawn.store[RESOURCE_ENERGY]));
            }
            
            // Deploy attackers for counter-offensive
            if (spawn.store[RESOURCE_ENERGY] > 500) {
                spawnCreep(spawn, ROLES.ATTACKER, getBodyParts(ROLES.ATTACKER, spawn.store[RESOURCE_ENERGY]));
            }
        });
        
        return true;
    }
    return false;
}

function scoutEnemies(room) {
    // Intelligence gathering
    const enemyRooms = [];
    const exits = Game.map.describeExits(room.name);
    
    for (const direction in exits) {
        const roomName = exits[direction];
        const room = Game.rooms[roomName];
        if (room) {
            const enemies = room.find(FIND_HOSTILE_SPAWNS);
            if (enemies.length > 0) {
                enemyRooms.push(roomName);
            }
        }
    }
    
    if (enemyRooms.length > 0) {
        console.log('👁️ ENEMY BASES DETECTED: ' + enemyRooms.join(', '));
        return enemyRooms;
    }
    return [];
}

function launchAttack(room, targetRoom) {
    // Coordinated assault on enemy base
    console.log('⚔️ LAUNCHING ATTACK on ' + targetRoom);
    
    const spawns = room.find(FIND_MY_SPAWNS);
    spawns.forEach(spawn => {
        // Mixed force composition
        spawnCreep(spawn, ROLES.ATTACKER, getBodyParts(ROLES.ATTACKER, spawn.store[RESOURCE_ENERGY]));
        spawnCreep(spawn, ROLES.RANGED, getBodyParts(ROLES.RANGED, spawn.store[RESOURCE_ENERGY]));
        spawnCreep(spawn, ROLES.HEALER, getBodyParts(ROLES.HEALER, spawn.store[RESOURCE_ENERGY]));
    });
}

function economicWar(room) {
    // Sabotage enemy economy
    const enemyControllers = room.find(FIND_HOSTILE_STRUCTURES, {filter: {structureType: STRUCTURE_CONTROLLER}});
    
    if (enemyControllers.length > 0) {
        console.log('💥 ECONOMIC WARFARE: Targeting enemy controllers');
        
        const spawns = room.find(FIND_MY_SPAWNS);
        spawns.forEach(spawn => {
            if (spawn.store[RESOURCE_ENERGY] > 600) {
                spawnCreep(spawn, ROLES.SABOTEUR, getBodyParts(ROLES.SABOTEUR, spawn.store[RESOURCE_ENERGY]));
            }
        });
        
        return true;
    }
    return false;
}

function manageEconomy(room) {
    // Balanced economic development
    const spawns = room.find(FIND_MY_SPAWNS);
    
    spawns.forEach(spawn => {
        if (!spawn.spawning) {
            const harvesters = room.find(FIND_MY_CREEPS, {filter: c => c.memory.role === ROLES.HARVESTER}).length;
            const builders = room.find(FIND_MY_CREEPS, {filter: c => c.memory.role === ROLES.BUILDER}).length;
            const upgraders = room.find(FIND_MY_CREEPS, {filter: c => c.memory.role === ROLES.UPGRADER}).length;
            const guards = room.find(FIND_MY_CREEPS, {filter: c => c.memory.role === ROLES.GUARD}).length;
            const attackers = room.find(FIND_MY_CREEPS, {filter: c => c.memory.role === ROLES.ATTACKER}).length;
            
            const energy = spawn.store[RESOURCE_ENERGY];
            const enemies = room.find(FIND_HOSTILE_CREEPS).length;
            
            // Wartime economy - prioritize defense
            if (enemies > 0) {
                if (guards < enemies * 2) {
                    spawnCreep(spawn, ROLES.GUARD, getBodyParts(ROLES.GUARD, energy));
                } else if (attackers < enemies) {
                    spawnCreep(spawn, ROLES.ATTACKER, getBodyParts(ROLES.ATTACKER, energy));
                }
            }
            // Early game economy
            else if (harvesters < 6) {
                spawnCreep(spawn, ROLES.HARVESTER, getBodyParts(ROLES.HARVESTER, energy));
            } else if (upgraders < 4) {
                spawnCreep(spawn, ROLES.UPGRADER, getBodyParts(ROLES.UPGRADER, energy));
            } else if (builders < 3) {
                spawnCreep(spawn, ROLES.BUILDER, getBodyParts(ROLES.BUILDER, energy));
            } else if (guards < 2) {
                spawnCreep(spawn, ROLES.GUARD, getBodyParts(ROLES.GUARD, energy));
            } else {
                // Mid-game military buildup
                if (energy > 800) {
                    spawnCreep(spawn, ROLES.ATTACKER, getBodyParts(ROLES.ATTACKER, energy));
                }
            }
        }
    });
}

function tacticalAI(creep) {
    // Smart combat behavior
    if (creep.memory.role === ROLES.ATTACKER) {
        const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
        if (enemies.length > 0) {
            const target = creep.pos.findClosestByRange(enemies);
            if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
            }
        } else {
            // Attack enemy structures
            const enemyStructs = creep.room.find(FIND_HOSTILE_STRUCTURES);
            if (enemyStructs.length > 0) {
                const target = creep.pos.findClosestByRange(enemyStructs);
                if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        }
    }
    else if (creep.memory.role === ROLES.RANGED) {
        const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
        if (enemies.length > 0) {
            const target = creep.pos.findClosestByRange(enemies);
            if (creep.rangedAttack(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff6600'}});
            }
        }
    }
    else if (creep.memory.role === ROLES.HEALER) {
        const wounded = creep.room.find(FIND_MY_CREEPS, {filter: c => c.hits < c.hitsMax});
        if (wounded.length > 0) {
            const target = creep.pos.findClosestByRange(wounded);
            if (creep.heal(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    }
    else if (creep.memory.role === ROLES.GUARD) {
        const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
        if (enemies.length > 0) {
            const target = creep.pos.findClosestByRange(enemies);
            if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#00ff00'}});
            }
        } else {
            // Patrol near spawn
            const spawns = creep.room.find(FIND_MY_SPAWNS);
            if (spawns.length > 0) {
                creep.moveTo(spawns[0]);
            }
        }
    }
    else if (creep.memory.role === ROLES.SABOTEUR) {
        const enemyControllers = creep.room.find(FIND_HOSTILE_STRUCTURES, {filter: {structureType: STRUCTURE_CONTROLLER}});
        if (enemyControllers.length > 0) {
            if (creep.attack(enemyControllers[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(enemyControllers[0]);
            }
        }
    }
    else if (creep.memory.role === ROLES.SCOUT) {
        const enemyStructs = creep.room.find(FIND_HOSTILE_STRUCTURES);
        if (enemyStructs.length > 0) {
            creep.moveTo(enemyStructs[0], {visualizePathStyle: {stroke: '#ffff00'}});
        }
    }
    else {
        // Economic roles
        if (creep.memory.role === ROLES.HARVESTER) {
            const sources = creep.room.find(FIND_SOURCES);
            if (sources.length > 0) {
                const source = sources[Math.floor(Math.random() * sources.length)];
                if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }
        } else if (creep.memory.role === ROLES.BUILDER) {
            const constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (constructionSites.length > 0) {
                if (creep.build(constructionSites[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructionSites[0]);
                }
            }
        } else if (creep.memory.role === ROLES.UPGRADER) {
            const controller = creep.room.controller;
            if (controller) {
                if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(controller);
                }
            }
        }
    }
}

module.exports.loop = function() {
    console.log('⚔️ PvP AI v2.0 - TICK: ' + Game.time);
    
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        
        // Priority 1: Defense - survive at all costs
        const underAttack = defendRoom(room);
        if (underAttack) {
            emergencyDefense(room);
        }
        
        // Priority 2: Intelligence gathering
        const enemyBases = scoutEnemies(room);
        
        // Priority 3: Economic warfare
        economicWar(room);
        
        // Priority 4: Launch attacks if safe
        if (enemyBases.length > 0 && !underAttack) {
            launchAttack(room, enemyBases[0]);
        }
        
        // Priority 5: Economy management
        manageEconomy(room);
    }
    
    // Tactical AI for all creeps
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        tacticalAI(creep);
    }
};