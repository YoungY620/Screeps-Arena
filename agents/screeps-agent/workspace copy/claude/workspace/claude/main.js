// ULTRA-AGGRESSIVE PvP AI - MAXIMUM DESTRUCTION v4.0
// EMERGENCY DEPLOYMENT - Tick 44903 - IMMEDIATE THREAT RESPONSE

const ROLES = {
    HARVESTER: 'harvester',
    BUILDER: 'builder', 
    UPGRADER: 'upgrader',
    GUARD: 'guard',
    ATTACKER: 'attacker',
    BERSERKER: 'berserker',
    ASSASSIN: 'assassin',
    SCOUT: 'scout'
};

function getCombatBody(role, energy) {
    // MAXIMUM EFFICIENCY COMBAT BODIES
    if (role === ROLES.BERSERKER) {
        // Pure damage output - 5:1 attack ratio
        if (energy >= 800) return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE];
        if (energy >= 600) return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE];
        return [ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE];
    }
    if (role === ROLES.GUARD) {
        // Tough frontline with damage
        if (energy >= 600) return [TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE];
        if (energy >= 500) return [TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE];
        return [TOUGH, ATTACK, ATTACK, MOVE, MOVE];
    }
    if (role === ROLES.ATTACKER) {
        // Balanced assault units
        if (energy >= 600) return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE];
        return [ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE];
    }
    if (role === ROLES.ASSASSIN) {
        // Fast controller attackers
        return [MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK];
    }
    if (role === ROLES.SCOUT) {
        // Fast reconnaissance
        return [MOVE, MOVE, MOVE, MOVE];
    }
    // Economic units
    if (energy >= 500) return [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
    if (energy >= 400) return [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
    return [WORK, CARRY, MOVE];
}

function spawnCombatUnit(spawn, role, body) {
    if (!spawn.spawning && spawn.store[RESOURCE_ENERGY] >= body.reduce((sum, part) => sum + BODYPART_COST[part], 0)) {
        const name = role + '_' + Game.time + '_' + Math.floor(Math.random() * 1000);
        const result = spawn.spawnCreep(body, name, {memory: {role: role, born: Game.time, squad: 'alpha'}});
        if (result === OK) {
            console.log('🚀 DEPLOYED: ' + name + ' (' + role.toUpperCase() + ')');
            return true;
        }
    }
    return false;
}

function immediateThreatResponse(room) {
    const enemies = room.find(FIND_HOSTILE_CREEPS);
    if (enemies.length > 0) {
        console.log('⚠️  THREAT DETECTED: ' + enemies.length + ' ENEMIES IN SECTOR');
        
        // EMERGENCY TOWER PROTOCOL
        const towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        towers.forEach(tower => {
            const target = tower.pos.findClosestByRange(enemies);
            if (target && tower.store[RESOURCE_ENERGY] >= 10) {
                tower.attack(target);
                console.log('💥 TOWER FIRE: ' + target.name + ' DMG: ' + Math.floor(600 / (Math.max(1, tower.pos.getRangeTo(target)))));
            }
        });
        
        // MASSIVE MILITARY RESPONSE - 5:1 SUPERIORITY DOCTRINE
        const spawns = room.find(FIND_MY_SPAWNS);
        spawns.forEach(spawn => {
            const enemyCount = enemies.length;
            const militaryNeeded = Math.max(5, enemyCount * 5); // MINIMUM 5 UNITS
            
            console.log('🎯 SPAWNING ' + militaryNeeded + ' COMBAT UNITS');
            
            for (let i = 0; i < militaryNeeded; i++) {
                if (i % 5 === 0) {
                    spawnCombatUnit(spawn, ROLES.BERSERKER, getCombatBody(ROLES.BERSERKER, spawn.store[RESOURCE_ENERGY]));
                } else if (i % 3 === 0) {
                    spawnCombatUnit(spawn, ROLES.GUARD, getCombatBody(ROLES.GUARD, spawn.store[RESOURCE_ENERGY]));
                } else if (i % 2 === 0) {
                    spawnCombatUnit(spawn, ROLES.ATTACKER, getCombatBody(ROLES.ATTACKER, spawn.store[RESOURCE_ENERGY]));
                } else {
                    spawnCombatUnit(spawn, ROLES.ASSASSIN, getCombatBody(ROLES.ASSASSIN, spawn.store[RESOURCE_ENERGY]));
                }
            }
        });
        
        return true;
    }
    return false;
}

function scoutEnemyBases(room) {
    const enemySpawns = room.find(FIND_HOSTILE_SPAWNS);
    const enemyControllers = room.find(FIND_HOSTILE_STRUCTURES, {filter: {structureType: STRUCTURE_CONTROLLER}});
    
    if (enemySpawns.length > 0 || enemyControllers.length > 0) {
        console.log('🏰 ENEMY BASE DETECTED: ' + (enemySpawns.length + enemyControllers.length) + ' STRUCTURES');
        
        // DEPLOY SCOUTS FOR RECONNAISSANCE
        const spawns = room.find(FIND_MY_SPAWNS);
        spawns.forEach(spawn => {
            if (Math.random() < 0.3) { // 30% scout deployment
                spawnCombatUnit(spawn, ROLES.SCOUT, getCombatBody(ROLES.SCOUT, spawn.store[RESOURCE_ENERGY]));
            }
        });
        
        return true;
    }
    return false;
}

function economicWarfare(room) {
    // Target enemy economic infrastructure
    const enemyStructures = room.find(FIND_HOSTILE_STRUCTURES);
    const priorityTargets = enemyStructures.filter(s => 
        s.structureType === STRUCTURE_SPAWN || 
        s.structureType === STRUCTURE_TOWER || 
        s.structureType === STRUCTURE_EXTENSION
    );
    
    if (priorityTargets.length > 0) {
        console.log('💣 ECONOMIC WARFARE: ' + priorityTargets.length + ' HIGH-VALUE TARGETS');
        
        const spawns = room.find(FIND_MY_SPAWNS);
        spawns.forEach(spawn => {
            // Deploy specialized attack forces
            spawnCombatUnit(spawn, ROLES.ASSASSIN, getCombatBody(ROLES.ASSASSIN, spawn.store[RESOURCE_ENERGY]));
            spawnCombatUnit(spawn, ROLES.BERSERKER, getCombatBody(ROLES.BERSERKER, spawn.store[RESOURCE_ENERGY]));
        });
        
        return true;
    }
    return false;
}

function wartimeEconomy(room) {
    // Maintain economic production during conflict
    const spawns = room.find(FIND_MY_SPAWNS);
    
    spawns.forEach(spawn => {
        if (!spawn.spawning) {
            const harvesters = room.find(FIND_MY_CREEPS, {filter: c => c.memory.role === ROLES.HARVESTER}).length;
            const builders = room.find(FIND_MY_CREEPS, {filter: c => c.memory.role === ROLES.BUILDER}).length;
            const military = room.find(FIND_MY_CREEPS, {filter: c => 
                c.memory.role === ROLES.GUARD || 
                c.memory.role === ROLES.ATTACKER || 
                c.memory.role === ROLES.BERSERKER || 
                c.memory.role === ROLES.ASSASSIN
            }).length;
            
            // Prioritize military during wartime
            if (military < 10) {
                spawnCombatUnit(spawn, ROLES.GUARD, getCombatBody(ROLES.GUARD, spawn.store[RESOURCE_ENERGY]));
            } else if (harvesters < 6) {
                spawnCombatUnit(spawn, ROLES.HARVESTER, getCombatBody(ROLES.HARVESTER, spawn.store[RESOURCE_ENERGY]));
            } else if (builders < 3) {
                spawnCombatUnit(spawn, ROLES.BUILDER, getCombatBody(ROLES.BUILDER, spawn.store[RESOURCE_ENERGY]));
            } else {
                // Maintain military readiness
                spawnCombatUnit(spawn, ROLES.BERSERKER, getCombatBody(ROLES.BERSERKER, spawn.store[RESOURCE_ENERGY]));
            }
        }
    });
}

module.exports.loop = function() {
    console.log('🔄 ULTRA-COMBAT AI v4.0 - TICK: ' + Game.time);
    
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        
        // BATTLE PRIORITY 1: IMMEDIATE THREAT RESPONSE
        const threatDetected = immediateThreatResponse(room);
        
        // BATTLE PRIORITY 2: ENEMY BASE DETECTION
        const enemyBaseFound = scoutEnemyBases(room);
        
        // BATTLE PRIORITY 3: ECONOMIC WARFARE
        const economicTargets = economicWarfare(room);
        
        // BATTLE PRIORITY 4: MAINTAIN WARTIME ECONOMY
        wartimeEconomy(room);
    }
    
    // TACTICAL AI - UNIT COMMAND AND CONTROL
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        
        if (creep.memory.role === ROLES.BERSERKER) {
            // MAXIMUM DAMAGE OUTPUT - PRIMARY ASSAULT
            const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
            if (enemies.length > 0) {
                const target = creep.pos.findClosestByRange(enemies);
                if (target) {
                    if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000', lineStyle: 'dashed'}});
                        console.log('🗡️  BERSERKER ' + creep.name + ' CHARGING ' + target.name);
                    } else {
                        console.log('💀 BERSERKER ' + creep.name + ' SLAUGHTERING ' + target.name);
                    }
                }
            } else {
                // Seek enemy structures
                const enemyStructs = creep.room.find(FIND_HOSTILE_STRUCTURES);
                if (enemyStructs.length > 0) {
                    creep.moveTo(enemyStructs[0], {visualizePathStyle: {stroke: '#ff0000'}});
                }
            }
        }
        else if (creep.memory.role === ROLES.GUARD || creep.memory.role === ROLES.ATTACKER) {
            // COMBAT SUPPORT - SECONDARY ASSAULT
            const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
            if (enemies.length > 0) {
                const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {filter: e => e.getActiveBodyparts(ATTACK) > 0});
                if (target) {
                    if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
            }
        }
        else if (creep.memory.role === ROLES.ASSASSIN) {
            // STRUCTURE DESTRUCTION - TERTIARY TARGETS
            const enemyStructs = creep.room.find(FIND_HOSTILE_STRUCTURES);
            const priorityTargets = enemyStructs.filter(s => 
                s.structureType === STRUCTURE_SPAWN || 
                s.structureType === STRUCTURE_TOWER || 
                s.structureType === STRUCTURE_CONTROLLER
            );
            
            if (priorityTargets.length > 0) {
                const target = creep.pos.findClosestByRange(priorityTargets);
                if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ff00ff'}});
                    console.log('🎯 ASSASSIN ' + creep.name + ' TARGETING ' + target.structureType);
                }
            }
        }
        else if (creep.memory.role === ROLES.SCOUT) {
            // RECONNAISSANCE - INTELLIGENCE GATHERING
            const enemyStructs = creep.room.find(FIND_HOSTILE_STRUCTURES);
            if (enemyStructs.length > 0) {
                const target = creep.pos.findClosestByRange(enemyStructs);
                creep.moveTo(target, {visualizePathStyle: {stroke: '#00ff00'}});
                console.log('👁️  SCOUT ' + creep.name + ' OBSERVING ' + target.structureType);
            } else {
                // Patrol room perimeter
                const sources = creep.room.find(FIND_SOURCES);
                if (sources.length > 0) {
                    creep.moveTo(sources[Math.floor(Math.random() * sources.length)]);
                }
            }
        }
        else {
            // ECONOMIC UNITS - RESOURCE GENERATION
            if (creep.memory.role === ROLES.HARVESTER) {
                const sources = creep.room.find(FIND_SOURCES);
                if (sources.length > 0) {
                    const targetSource = sources[Math.floor(Math.random() * sources.length)];
                    if (creep.harvest(targetSource) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(targetSource);
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
};