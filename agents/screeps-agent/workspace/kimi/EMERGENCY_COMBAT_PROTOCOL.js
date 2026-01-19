// 🚨 EMERGENCY COMBAT PROTOCOL v5.0 🚨
// IMMEDIATE BATTLE RESPONSE - NO TIME TO WASTE

const BATTLE_STATUS = {
    PEACE: 0,
    THREAT_DETECTED: 1,
    ACTIVE_COMBAT: 2,
    CRITICAL_DEFENSE: 3,
    SPAWN_DESTROYED: 4,
    TOTAL_WAR: 5
};

let battleState = {
    status: BATTLE_STATUS.SPAWN_DESTROYED,
    enemyDetected: true,
    spawnDestroyed: true,
    lastCombatTick: 0,
    roomName: 'W1N3',
    emergencyMode: true,
    totalWarDeclared: false,
    enemyRooms: new Set(),
    attackTargets: []
};

// EMERGENCY military units - Maximum damage, minimum cost
const emergencyBodies = {
    defender: [ATTACK, ATTACK, MOVE, MOVE], // Cheap but effective
    
    kamikaze: [ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE], // Pure offense
    
    guard: [TOUGH, ATTACK, MOVE, MOVE], // Defense focused
    
    scout: [MOVE, MOVE], // Ultra cheap recon
    
    warrior: [TOUGH, TOUGH, ATTACK, ATTACK, MOVE, MOVE, MOVE], // Balanced fighter
    
    archer: [RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE], // Ranged support
    
    healer: [HEAL, HEAL, MOVE, MOVE], // Support unit
    
    assassin: [MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK] // Fast killer
};

// EMERGENCY roles - Prioritize combat readiness
const emergencyRoles = {
    defender: {
        body: emergencyBodies.defender,
        maxCount: 10,
        priority: 1,
        emergency: true
    },
    
    kamikaze: {
        body: emergencyBodies.kamikaze,
        maxCount: 8,
        priority: 2,
        emergency: true
    },
    
    warrior: {
        body: emergencyBodies.warrior,
        maxCount: 6,
        priority: 3,
        emergency: true
    },
    
    archer: {
        body: emergencyBodies.archer,
        maxCount: 6,
        priority: 4,
        emergency: true
    },
    
    healer: {
        body: emergencyBodies.healer,
        maxCount: 4,
        priority: 5,
        emergency: true
    },
    
    scout: {
        body: emergencyBodies.scout,
        maxCount: 3,
        priority: 6,
        emergency: true
    },
    
    harvester: {
        body: [WORK, WORK, CARRY, MOVE],
        maxCount: 6,
        priority: 7,
        emergency: false
    },
    
    builder: {
        body: [WORK, CARRY, CARRY, MOVE],
        maxCount: 4,
        priority: 8,
        emergency: false
    }
};

// EMERGENCY defense - Build while under attack
const emergencyDefense = {
    buildEmergencyRamparts: function(room) {
        // Build ramparts in a cross pattern around controller if spawn is destroyed
        const controller = room.controller;
        if (!controller) return;
        
        const rampartPositions = [
            {x: controller.pos.x - 1, y: controller.pos.y},
            {x: controller.pos.x + 1, y: controller.pos.y},
            {x: controller.pos.x, y: controller.pos.y - 1},
            {x: controller.pos.x, y: controller.pos.y + 1},
            {x: controller.pos.x - 1, y: controller.pos.y - 1},
            {x: controller.pos.x + 1, y: controller.pos.y - 1},
            {x: controller.pos.x - 1, y: controller.pos.y + 1},
            {x: controller.pos.x + 1, y: controller.pos.y + 1}
        ];
        
        rampartPositions.forEach(pos => {
            const structures = room.lookForAt(LOOK_STRUCTURES, pos.x, pos.y);
            const hasWall = structures.some(s => s.structureType === STRUCTURE_RAMPART);
            
            if (!hasWall && room.createConstructionSite(pos.x, pos.y, STRUCTURE_RAMPART) === OK) {
                console.log(`🛡️ EMERGENCY Rampart at ${pos.x},${pos.y}`);
            }
        });
    },
    
    buildEmergencyTowers: function(room) {
        const controller = room.controller;
        if (!controller) return;
        
        const towerPositions = [
            {x: controller.pos.x - 3, y: controller.pos.y - 3},
            {x: controller.pos.x + 3, y: controller.pos.y - 3},
            {x: controller.pos.x - 3, y: controller.pos.y + 3},
            {x: controller.pos.x + 3, y: controller.pos.y + 3}
        ];
        
        towerPositions.forEach(pos => {
            if (room.createConstructionSite(pos.x, pos.y, STRUCTURE_TOWER) === OK) {
                console.log(`🏗️ EMERGENCY Tower at ${pos.x},${pos.y}`);
            }
        });
    },
    
    buildEmergencyExtensions: function(room) {
        const controller = room.controller;
        if (!controller) return;
        
        for (let x = controller.pos.x - 5; x <= controller.pos.x + 5; x++) {
            for (let y = controller.pos.y - 5; y <= controller.pos.y + 5; y++) {
                if (Math.abs(x - controller.pos.x) + Math.abs(y - controller.pos.y) > 2) {
                    if (room.createConstructionSite(x, y, STRUCTURE_EXTENSION) === OK) {
                        console.log(`🔋 EMERGENCY Extension at ${x},${y}`);
                    }
                }
            }
        }
    },
    
    activateEmergencyTowers: function(room) {
        const towers = room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_TOWER }
        });
        
        let enemiesEngaged = 0;
        
        towers.forEach(tower => {
            // KILL ENEMY HEALERS FIRST
            const hostileHealers = tower.room.find(FIND_HOSTILE_CREEPS, {
                filter: hostile => hostile.getActiveBodyparts(HEAL) > 0
            });
            
            if (hostileHealers.length > 0) {
                const target = tower.pos.findClosestByRange(hostileHealers);
                if (target) {
                    tower.attack(target);
                    console.log(`💥 EMERGENCY Tower EXECUTING healer!`);
                    enemiesEngaged++;
                    return;
                }
            }
            
            // KILL ENEMY ATTACKERS
            const hostileAttackers = tower.room.find(FIND_HOSTILE_CREEPS, {
                filter: hostile => {
                    return hostile.getActiveBodyparts(ATTACK) > 0 || hostile.getActiveBodyparts(RANGED_ATTACK) > 0;
                }
            });
            
            if (hostileAttackers.length > 0) {
                const target = tower.pos.findClosestByRange(hostileAttackers);
                if (target) {
                    tower.attack(target);
                    console.log(`⚔️ EMERGENCY Tower ELIMINATING attacker!`);
                    enemiesEngaged++;
                    return;
                }
            }
            
            // ATTACK ANY HOSTILE
            const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (closestHostile) {
                tower.attack(closestHostile);
                console.log(`⚔️ EMERGENCY Tower ATTACKING hostile`);
                enemiesEngaged++;
                return;
            }
            
            // HEAL DAMAGED ALLIES
            const damagedAlly = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: creep => creep.hits < creep.hitsMax * 0.7
            });
            
            if (damagedAlly) {
                tower.heal(damagedAlly);
                console.log(`💚 EMERGENCY Tower HEALING ally`);
            }
        });
        
        return enemiesEngaged;
    }
};

// EMERGENCY combat tactics - Fight to survive
const emergencyCombat = {
    engageEnemy: function(creep) {
        // Find nearest hostile and attack
        const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
        if (hostiles.length === 0) return false;
        
        const target = creep.pos.findClosestByRange(hostiles);
        if (!target) return false;
        
        // Prioritize healers first
        if (target.getActiveBodyparts(HEAL) > 0) {
            console.log(`🎯 ${creep.name} TARGETING ENEMY HEALER!`);
        }
        
        // Attack or move to attack
        if (creep.attack(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
        }
        
        return true;
    },
    
    launchImmediateAttack: function(targetRoom) {
        console.log(`🚀🚨 EMERGENCY ATTACK ON ${targetRoom}!`);
        
        // Count available attack forces
        const attackers = Object.keys(Game.creeps).filter(name => {
            const creep = Game.creeps[name];
            return (creep.memory.role === 'attacker' || creep.memory.role === 'kamikaze' || 
                   creep.memory.role === 'warrior' || creep.memory.role === 'assassin') && 
                   creep.room.name === battleState.roomName;
        }).length;
        
        const healers = Object.keys(Game.creeps).filter(name => {
            const creep = Game.creeps[name];
            return creep.memory.role === 'healer' && creep.room.name === battleState.roomName;
        }).length;
        
        console.log(`🚨 EMERGENCY forces: ${attackers} attackers, ${healers} healers`);
        
        // Launch attack with any available forces
        if (attackers >= 1) {
            Object.keys(Game.creeps).forEach(name => {
                const creep = Game.creeps[name];
                if (creep.room.name === battleState.roomName) {
                    if (creep.memory.role === 'attacker' || creep.memory.role === 'kamikaze' || 
                        creep.memory.role === 'warrior' || creep.memory.role === 'assassin') {
                        creep.memory.targetRoom = targetRoom;
                        creep.memory.mode = 'attack';
                        console.log(`🚨 ${name} EMERGENCY ATTACK ORDER on ${targetRoom}`);
                    }
                    if (creep.memory.role === 'healer') {
                        creep.memory.targetRoom = targetRoom;
                        creep.memory.mode = 'support';
                        console.log(`💚 ${name} EMERGENCY SUPPORT ORDER on ${targetRoom}`);
                    }
                }
            });
            
            battleState.lastAttackTime = Game.time;
            battleState.attackWaveSize = attackers;
        } else {
            console.log(`⚠️ INSUFFICIENT FORCES for emergency attack`);
        }
    }
};

// EMERGENCY roles - Fight or die
const emergencyRoles = {
    defender: function(creep) {
        // Defend at all costs
        if (!emergencyCombat.engageEnemy(creep)) {
            // No enemies, patrol or build
            const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length > 0) {
                if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            } else {
                creep.moveTo(new RoomPosition(25, 25, creep.room.name));
            }
        }
    },
    
    kamikaze: function(creep) {
        // Suicide attack - no retreat
        if (creep.memory.targetRoom && creep.room.name !== creep.memory.targetRoom) {
            creep.moveTo(new RoomPosition(25, 25, creep.memory.targetRoom), {visualizePathStyle: {stroke: '#ff0000'}});
            return;
        }
        
        // Find highest value target
        const targets = [
            ...creep.room.find(FIND_HOSTILE_SPAWNS),
            ...creep.room.find(FIND_HOSTILE_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}}),
            ...creep.room.find(FIND_HOSTILE_CREEPS, {filter: c => c.getActiveBodyparts(HEAL) > 0}),
            ...creep.room.find(FIND_HOSTILE_CREEPS, {filter: c => c.getActiveBodyparts(ATTACK) > 0 || c.getActiveBodyparts(RANGED_ATTACK) > 0}),
            ...creep.room.find(FIND_HOSTILE_CREEPS)
        ];
        
        if (targets.length > 0) {
            const target = creep.pos.findClosestByRange(targets);
            if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
            }
            console.log(`💀🚨 KAMIKAZE ${creep.name} ATTACKING ${target.structureType || 'CREEP'}!`);
        }
    },
    
    warrior: function(creep) {
        // Professional combat unit
        if (creep.memory.targetRoom && creep.room.name !== creep.memory.targetRoom) {
            creep.moveTo(new RoomPosition(25, 25, creep.memory.targetRoom), {visualizePathStyle: {stroke: '#ff0000'}});
            return;
        }
        
        if (!emergencyCombat.engageEnemy(creep)) {
            // No enemies, patrol
            creep.moveTo(new RoomPosition(Math.random() * 40 + 10, Math.random() * 40 + 10, creep.room.name));
        }
    },
    
    archer: function(creep) {
        // Ranged combat support
        if (creep.memory.targetRoom && creep.room.name !== creep.memory.targetRoom) {
            creep.moveTo(new RoomPosition(25, 25, creep.memory.targetRoom), {visualizePathStyle: {stroke: '#ff0000'}});
            return;
        }
        
        const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
        if (hostiles.length > 0) {
            const target = creep.pos.findClosestByRange(hostiles);
            if (creep.rangedAttack(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
            } else {
                if (creep.pos.getRangeTo(target) <= 3) {
                    creep.rangedMassAttack();
                }
            }
        } else if (creep.memory.mode === 'attack' && creep.memory.targetRoom) {
            creep.moveTo(new RoomPosition(25, 25, creep.memory.targetRoom), {visualizePathStyle: {stroke: '#ff0000'}});
        } else {
            creep.moveTo(new RoomPosition(Math.random() * 40 + 10, Math.random() * 40 + 10, creep.room.name));
        }
    },
    
    healer: function(creep) {
        // Combat medic
        if (creep.memory.targetRoom && creep.room.name !== creep.memory.targetRoom && creep.memory.mode === 'support') {
            creep.moveTo(new RoomPosition(25, 25, creep.memory.targetRoom), {visualizePathStyle: {stroke: '#00ff00'}});
            return;
        }
        
        // Heal military allies first
        const militaryAllies = creep.room.find(FIND_MY_CREEPS, {
            filter: ally => (ally.memory.role === 'warrior' || ally.memory.role === 'archer' || 
                           ally.memory.role === 'attacker' || ally.memory.role === 'kamikaze' || 
                           ally.memory.role === 'defender' || ally.memory.role === 'assassin') && 
                           ally.hits < ally.hitsMax
        });
        
        if (militaryAllies.length > 0) {
            const target = creep.pos.findClosestByRange(militaryAllies);
            if (creep.heal(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#00ff00'}});
            }
            return;
        }
        
        // Heal any damaged ally
        const damagedAlly = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: ally => ally.hits < ally.hitsMax
        });
        
        if (damagedAlly) {
            if (creep.heal(damagedAlly) === ERR_NOT_IN_RANGE) {
                creep.moveTo(damagedAlly, {visualizePathStyle: {stroke: '#00ff00'}});
            }
            return;
        }
        
        // Follow military units
        const militaryUnits = creep.room.find(FIND_MY_CREEPS, {
            filter: ally => ['warrior', 'archer', 'attacker', 'kamikaze', 'defender', 'assassin'].includes(ally.memory.role)
        });
        
        if (militaryUnits.length > 0) {
            const target = creep.pos.findClosestByRange(militaryUnits);
            if (creep.pos.getRangeTo(target) > 2) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#00ff00'}});
            }
        }
    },
    
    scout: function(creep) {
        // Quick reconnaissance
        const enemyRooms = ['W1N1', 'W1N2', 'W1N4', 'W1N5', 'W2N1', 'W2N2', 'W2N3', 'W0N1', 'W0N2', 'W0N3'];
        const targetRoom = enemyRooms[Math.floor(Math.random() * enemyRooms.length)];
        
        if (creep.room.name !== targetRoom) {
            creep.moveTo(new RoomPosition(25, 25, targetRoom), {visualizePathStyle: {stroke: '#00ff00'}});
            return;
        }
        
        // Report enemy activity
        const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
        const enemyStructures = creep.room.find(FIND_HOSTILE_STRUCTURES);
        
        if (hostiles.length > 0 || enemyStructures.length > 0) {
            battleState.enemyRooms.add(creep.room.name);
            console.log(`🚨 EMERGENCY SCOUT Enemy in ${creep.room.name}!`);
        }
        
        // Keep moving to survive
        creep.moveTo(new RoomPosition(Math.random() * 40 + 10, Math.random() * 40 + 10, creep.room.name));
    },
    
    harvester: function(creep) {
        // Keep economy running during war
        if (creep.store.getFreeCapacity() > 0) {
            const sources = creep.room.find(FIND_SOURCES);
            if (sources.length > 0) {
                if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        } else {
            const targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_EXTENSION ||
                            structure.structureType === STRUCTURE_SPAWN ||
                            structure.structureType === STRUCTURE_TOWER) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    },
    
    builder: function(creep) {
        // Build defenses during combat
        const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (targets.length) {
            if (creep.store[RESOURCE_ENERGY] === 0) {
                const sources = creep.room.find(FIND_SOURCES);
                if (sources.length > 0) {
                    if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
            } else {
                if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        } else {
            // No construction, help harvest
            emergencyRoles.harvester(creep);
        }
    },
    
    assassin: function(creep) {
        // Fast execution unit
        if (creep.memory.targetRoom && creep.room.name !== creep.memory.targetRoom) {
            creep.moveTo(new RoomPosition(25, 25, creep.memory.targetRoom), {visualizePathStyle: {stroke: '#ff0000'}});
            return;
        }
        
        // Target high-value enemies
        const enemyHealers = creep.room.find(FIND_HOSTILE_CREEPS, {
            filter: hostile => hostile.getActiveBodyparts(HEAL) > 0
        });
        
        if (enemyHealers.length > 0) {
            const target = creep.pos.findClosestByRange(enemyHealers);
            if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#aa0000'}});
            }
            return;
        }
        
        // Attack any enemy
        emergencyCombat.engageEnemy(creep);
    }
};

// EMERGENCY spawn management
const emergencySpawn = {
    spawnCreep: function(spawn, role) {
        const roleConfig = emergencyRoles[role];
        if (!roleConfig) return null;
        
        const body = roleConfig.body;
        const name = `${role}_${Game.time}_${Math.floor(Math.random() * 1000)}`;
        
        const result = spawn.spawnCreep(body, name, {
            memory: {
                role: role,
                born: Game.time,
                emergency: true
            }
        });
        
        if (result === OK) {
            console.log(`🚨 EMERGENCY Spawned ${role}: ${name}`);
            return name;
        }
        
        return null;
    },
    
    manageEmergencySpawning: function(spawn) {
        if (spawn.spawning) return;
        
        const room = spawn.room;
        const currentCreeps = Object.keys(Game.creeps);
        
        // Count creeps by role in this room
        const roomCreeps = {};
        currentCreeps.forEach(name => {
            const creep = Game.creeps[name];
            if (creep.memory.role && creep.room.name === room.name) {
                roomCreeps[creep.memory.role] = (roomCreeps[creep.memory.role] || 0) + 1;
            }
        });
        
        console.log(`🚨 EMERGENCY Creeps: ${JSON.stringify(roomCreeps)}`);
        
        // EMERGENCY PRIORITY: Military units first
        if (battleState.status >= BATTLE_STATUS.THREAT_DETECTED) {
            if (roomCreeps.defender < 4) {
                emergencySpawn.spawnCreep(spawn, 'defender');
                return;
            }
            if (roomCreeps.kamikaze < 3) {
                emergencySpawn.spawnCreep(spawn, 'kamikaze');
                return;
            }
            if (roomCreeps.warrior < 3) {
                emergencySpawn.spawnCreep(spawn, 'warrior');
                return;
            }
            if (roomCreeps.archer < 2) {
                emergencySpawn.spawnCreep(spawn, 'archer');
                return;
            }
            if (roomCreeps.healer < 2) {
                emergencySpawn.spawnCreep(spawn, 'healer');
                return;
            }
        }
        
        // Secondary: Scouts and economy
        if (roomCreeps.scout < 2) {
            emergencySpawn.spawnCreep(spawn, 'scout');
            return;
        }
        
        if (roomCreeps.harvester < 4) {
            emergencySpawn.spawnCreep(spawn, 'harvester');
            return;
        }
        
        if (roomCreeps.builder < 2) {
            emergencySpawn.spawnCreep(spawn, 'builder');
            return;
        }
    }
};

// Main EMERGENCY loop - SURVIVE AT ALL COSTS
module.exports.loop = function() {
    // Update battle state
    battleState.currentTick = Game.time;
    
    // Clear dead creeps
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log(`💀 EMERGENCY Cleared dead creep: ${name}`);
        }
    }
    
    const room = Game.rooms[battleState.roomName];
    if (!room) {
        console.log(`❌ EMERGENCY Room ${battleState.roomName} not found!`);
        return;
    }
    
    // IMMEDIATE THREAT ASSESSMENT
    const hostiles = room.find(FIND_HOSTILE_CREEPS);
    const enemyStructures = room.find(FIND_HOSTILE_STRUCTURES);
    const enemySpawns = room.find(FIND_HOSTILE_SPAWNS);
    const enemyTowers = room.find(FIND_HOSTILE_STRUCTURES, {
        filter: { structureType: STRUCTURE_TOWER }
    });
    
    if (hostiles.length > 0 || enemyStructures.length > 0) {
        battleState.lastCombatTick = Game.time;
        battleState.enemyDetected = true;
        
        // Determine threat level
        const dangerousEnemies = hostiles.filter(e => 
            e.getActiveBodyparts(ATTACK) > 0 || e.getActiveBodyparts(RANGED_ATTACK) > 0
        ).length;
        
        if (enemySpawns.length > 0 || enemyTowers.length > 0) {
            battleState.status = BATTLE_STATUS.TOTAL_WAR;
            battleState.totalWarDeclared = true;
            console.log(`🚨 TOTAL WAR DECLARED - Enemy structures detected!`);
        } else if (dangerousEnemies >= 3) {
            battleState.status = BATTLE_STATUS.CRITICAL_DEFENSE;
            console.log(`🚨 CRITICAL DEFENSE MODE - Multiple attackers detected!`);
        } else if (dangerousEnemies > 0) {
            battleState.status = BATTLE_STATUS.ACTIVE_COMBAT;
            console.log(`🚨 ACTIVE COMBAT MODE - Enemy attackers detected!`);
        } else {
            battleState.status = BATTLE_STATUS.THREAT_DETECTED;
            console.log(`🚨 THREAT DETECTED - Non-combat hostiles in room!`);
        }
    } else {
        battleState.enemyDetected = false;
        const timeSinceCombat = Game.time - battleState.lastCombatTick;
        
        if (timeSinceCombat > 100) {
            battleState.status = BATTLE_STATUS.PEACE;
            console.log(`✅ PEACE MODE - No enemies detected`);
        } else if (timeSinceCombat > 50) {
            battleState.status = BATTLE_STATUS.THREAT_DETECTED;
            console.log(`⚠️ THREAT DETECTED - Recent combat activity`);
        }
    }
    
    // Check spawn status
    const spawn = Game.spawns.Spawn1;
    if (!spawn) {
        battleState.spawnDestroyed = true;
        battleState.status = BATTLE_STATUS.SPAWN_DESTROYED;
        console.log(`💀 SPAWN DESTROYED - Operating in emergency mode!`);
    } else if (spawn.hits < spawn.hitsMax) {
        console.log(`⚠️ SPAWN DAMAGED - ${spawn.hits}/${spawn.hitsMax} HP`);
    }
    
    // EMERGENCY CONSTRUCTION - Build while fighting
    if (Game.time % 5 === 0) {
        if (battleState.spawnDestroyed) {
            emergencyDefense.buildEmergencyRamparts(room);
            emergencyDefense.buildEmergencyExtensions(room);
        }
        emergencyDefense.buildEmergencyTowers(room);
    }
    
    // ACTIVATE TOWERS - Kill enemies immediately
    const towersEngaged = emergencyDefense.activateEmergencyTowers(room);
    
    // EMERGENCY SPAWNING - Replace losses immediately
    if (spawn) {
        emergencySpawn.manageEmergencySpawning(spawn);
    }
    
    // EXECUTE EMERGENCY ROLES - Every creep fights
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        if (creep.spawning) continue;
        
        const role = creep.memory.role;
        if (emergencyRoles[role]) {
            try {
                emergencyRoles[role](creep);
            } catch (error) {
                console.log(`❌ EMERGENCY Error in ${role} ${name}: ${error}`);
            }
        }
    }
    
    // IMMEDIATE COUNTER-ATTACK - Strike back fast
    if (Game.time % 20 === 0 && battleState.status >= BATTLE_STATUS.ACTIVE_COMBAT) {
        const targetRooms = ['W1N1', 'W1N2', 'W1N4', 'W1N5', 'W2N1', 'W2N2'];
        const targetRoom = targetRooms[Math.floor(Math.random() * targetRooms.length)];
        emergencyCombat.launchImmediateAttack(targetRoom);
    }
    
    // CONTINUOUS RECON - Always know enemy positions
    if (Game.time % 30 === 0) {
        // Send scouts to gather intelligence
        const scouts = Object.keys(Game.creeps).filter(name => {
            const creep = Game.creeps[name];
            return creep.memory.role === 'scout' && creep.room.name === battleState.roomName;
        });
        
        if (scouts.length > 0) {
            const scoutName = scouts[0];
            const scout = Game.creeps[scoutName];
            if (scout) {
                emergencyRoles.scout(scout);
            }
        }
    }
    
    // EMERGENCY STATUS REPORT
    if (Game.time % 5 === 0) {
        const statusNames = ['PEACE', 'THREAT_DETECTED', 'ACTIVE_COMBAT', 'CRITICAL_DEFENSE', 'SPAWN_DESTROYED', 'TOTAL_WAR'];
        const hostiles = room.find(FIND_HOSTILE_CREEPS).length;
        const militaryCreeps = Object.keys(Game.creeps).filter(name => {
            const creep = Game.creeps[name];
            return ['defender', 'warrior', 'archer', 'attacker', 'kamikaze', 'assassin'].includes(creep.memory.role) && 
                   creep.room.name === battleState.roomName;
        }).length;
        
        console.log(`🚨 EMERGENCY: ${statusNames[battleState.status]} | Hostiles: ${hostiles} | Military: ${militaryCreeps} | Energy: ${room.energyAvailable}/${room.energyCapacityAvailable} | Creeps: ${Object.keys(Game.creeps).length}`);
        
        if (battleState.totalWarDeclared) {
            console.log(`🔥🔥🔥 TOTAL WAR - NO MERCY FOR ENEMIES! 🔥🔥🔥`);
        }
        
        if (battleState.spawnDestroyed) {
            console.log(`💀 SPAWN DESTROYED - FIGHTING WITHOUT RESPAWN!`);
        }
    }
};