// 🚀 GPT AGGRESSIVE PVP COMBAT AGENT - W8N8 SECTOR 🚀
// Mission: TOTAL ENEMY ANNIHILATION - Tick: Game.time

console.log('🎯 GPT PVP COMBAT AGENT DEPLOYED - W8N8 SECTOR');
console.log('💀 Mission: Claim W8N8, expand to adjacent rooms, destroy all enemies');

// COMBAT ROLES
const ROLE_HARVESTER = 'harvester';
const ROLE_UPGRADER = 'upgrader';
const ROLE_BUILDER = 'builder';
const ROLE_DEFENDER = 'defender';
const ROLE_ATTACKER = 'attacker';
const ROLE_RANGER = 'ranger';
const ROLE_CLAIMER = 'claimer';

// IMMEDIATE THREAT ASSESSMENT
function assessThreatLevel(room) {
    const hostiles = room.find(FIND_HOSTILE_CREEPS).filter(c => 
        c.owner.username !== 'Source Keeper' && c.owner.username !== 'gpt'
    );
    
    let threat = 0;
    hostiles.forEach(enemy => {
        const attackParts = enemy.body.filter(part => 
            part.type === ATTACK || part.type === RANGED_ATTACK
        ).length;
        const toughParts = enemy.body.filter(part => part.type === TOUGH).length;
        const healParts = enemy.body.filter(part => part.type === HEAL).length;
        
        threat += (attackParts * 30) + (toughParts * 10) + (healParts * 50);
    });
    
    return { count: hostiles.length, threat: threat };
}

// AGGRESSIVE SPAWN PROTOCOL
function aggressiveSpawn(spawn) {
    if (!spawn || spawn.spawning) return;
    
    // Activate spawn if offline
    if (spawn.off) {
        console.log(`🚨 ACTIVATING OFFLINE SPAWN: ${spawn.name}`);
        spawn.off = false;
    }
    
    const room = spawn.room;
    const threats = assessThreatLevel(room);
    const energy = spawn.store ? spawn.store.energy : 0;
    const energyCapacity = spawn.storeCapacityResource ? spawn.storeCapacityResource.energy : 300;
    
    // Count existing forces
    const creeps = room.find(FIND_MY_CREEPS);
    const harvesters = creeps.filter(c => c.memory.role === ROLE_HARVESTER);
    const defenders = creeps.filter(c => c.memory.role === ROLE_DEFENDER);
    const attackers = creeps.filter(c => c.memory.role === ROLE_ATTACKER);
    const rangers = creeps.filter(c => c.memory.role === ROLE_RANGER);
    const claimers = creeps.filter(c => c.memory.role === ROLE_CLAIMER);
    
    console.log(`[${room.name}] ENERGY:${energy}/${energyCapacity} H:${harvesters.length} D:${defenders.length} A:${attackers.length} R:${rangers.length} C:${claimers.length} ENEMIES:${threats.count} THREAT:${threats.threat}`);
    
    // PRIORITY 1: EMERGENCY DEFENSE - If enemies detected
    if (threats.count > 0) {
        console.log(`🚨 EMERGENCY: ${threats.count} enemies in sector!`);
        
        // Build maximum defense force - prioritize healers
        const defenseBody = energy >= 800 ? [TOUGH,TOUGH,TOUGH,ATTACK,ATTACK,ATTACK,ATTACK,HEAL,MOVE,MOVE,MOVE,MOVE] :
                           energy >= 600 ? [TOUGH,TOUGH,ATTACK,ATTACK,ATTACK,HEAL,MOVE,MOVE,MOVE] :
                           energy >= 500 ? [TOUGH,TOUGH,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE] :
                           energy >= 300 ? [TOUGH,TOUGH,ATTACK,ATTACK,MOVE,MOVE] :
                           energy >= 200 ? [TOUGH,ATTACK,MOVE,MOVE] : [ATTACK,MOVE];
        
        const result = spawn.spawnCreep(defenseBody, `Defender_${Game.time}`, {
            memory: { role: ROLE_DEFENDER, room: room.name, priority: 'emergency', targetRoom: room.name }
        });
        
        if (result === OK) {
            console.log(`🛡️ EMERGENCY DEFENDER DEPLOYED - Threat level: ${threats.threat}`);
            return;
        } else {
            console.log(`❌ Defense spawn failed: ${result}`);
        }
    }
    
    // PRIORITY 2: FAST ECONOMY - Minimum harvesters for rapid expansion
    if (harvesters.length < 2 && energy >= 200) {
        const harvestBody = energy >= 300 ? [WORK,WORK,CARRY,MOVE] :
                           energy >= 200 ? [WORK,CARRY,MOVE] : [WORK,MOVE];
        
        const result = spawn.spawnCreep(harvestBody, `Harvester_${Game.time}`, {
            memory: { role: ROLE_HARVESTER, room: room.name, source: harvesters.length % 2 }
        });
        
        if (result === OK) {
            console.log(`⚡ HARVESTER DEPLOYED - Economic foundation`);
            return;
        }
    }
    
    // PRIORITY 3: MILITARY BUILDUP - Aggressive force composition
    if (energy >= 300 && harvesters.length >= 1) {
        // Build maximum military force - no limits!
        const militaryBudget = Math.floor(energy * 0.8); // 80% of energy to military
        
        // Prioritize ranged attackers for superior damage
        if (rangers.length < 6) {
            const rangerBody = energy >= 600 ? [RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,MOVE,MOVE,MOVE] :
                              energy >= 400 ? [RANGED_ATTACK,RANGED_ATTACK,MOVE,MOVE] :
                              energy >= 200 ? [RANGED_ATTACK,MOVE] : [RANGED_ATTACK,MOVE];
            
            const result = spawn.spawnCreep(rangerBody, `Ranger_${Game.time}`, {
                memory: { role: ROLE_RANGER, room: room.name, target: null }
            });
            
            if (result === OK) {
                console.log(`🏹 RANGER DEPLOYED - Ranged superiority`);
                return;
            }
        }
        
        // Build melee attackers - unlimited force
        if (attackers.length < 8) {
            const attackBody = energy >= 600 ? [ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE] :
                              energy >= 500 ? [ATTACK,ATTACK,ATTACK,MOVE,MOVE] :
                              energy >= 300 ? [ATTACK,ATTACK,MOVE,MOVE] : [ATTACK,MOVE];
            
            const result = spawn.spawnCreep(attackBody, `Attacker_${Game.time}`, {
                memory: { role: ROLE_ATTACKER, room: room.name, target: null }
            });
            
            if (result === OK) {
                console.log(`⚔️ ATTACKER DEPLOYED - Offensive capability`);
                return;
            }
        }
    }
    
    // PRIORITY 4: CLAIMER - Room expansion
    if (energy >= 600 && harvesters.length >= 2 && attackers.length >= 2) {
        const claimers = creeps.filter(c => c.memory.role === ROLE_CLAIMER);
        if (claimers.length < 1) {
            const claimBody = [CLAIM,MOVE,MOVE];
            
            const result = spawn.spawnCreep(claimBody, `Claimer_${Game.time}`, {
                memory: { role: ROLE_CLAIMER, room: room.name, target: 'W7N8' }
            });
            
            if (result === OK) {
                console.log(`🏴 CLAIMER DEPLOYED - Room expansion`);
                return;
            }
        }
    }
    
    // PRIORITY 5: UPGRADER - Controller advancement
    if (energy >= 200 && harvesters.length >= 2) {
        const upgraders = creeps.filter(c => c.memory.role === ROLE_UPGRADER);
        if (upgraders.length < 1) {
            const upgradeBody = energy >= 400 ? [WORK,WORK,CARRY,MOVE] :
                               energy >= 200 ? [WORK,CARRY,MOVE] : [WORK,MOVE];
            
            const result = spawn.spawnCreep(upgradeBody, `Upgrader_${Game.time}`, {
                memory: { role: ROLE_UPGRADER, room: room.name }
            });
            
            if (result === OK) {
                console.log(`📈 UPGRADER DEPLOYED - Controller advancement`);
                return;
            }
        }
    }
}

// AGGRESSIVE COMBAT BEHAVIORS
const combatBehaviors = {
    [ROLE_HARVESTER]: (creep) => {
        if (creep.store.getFreeCapacity() > 0) {
            const sources = creep.room.find(FIND_SOURCES);
            const sourceIndex = creep.memory.source || 0;
            const source = sources[sourceIndex % sources.length];
            
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        } else {
            const spawn = Game.spawns.Spawn1;
            if (spawn) {
                if (creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawn, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        }
    },
    
    [ROLE_DEFENDER]: (creep) => {
        const hostiles = creep.room.find(FIND_HOSTILE_CREEPS).filter(c => 
            c.owner.username !== 'Source Keeper' && c.owner.username !== 'gpt'
        );
        
        if (hostiles.length > 0) {
            // Aggressive targeting: prioritize healers and high-damage enemies
            const target = hostiles.reduce((best, enemy) => {
                const hasHeal = enemy.body.some(part => part.type === HEAL);
                const attackPower = enemy.body.filter(part => 
                    part.type === ATTACK || part.type === RANGED_ATTACK
                ).length;
                const range = creep.pos.getRangeTo(enemy);
                
                const score = (hasHeal ? 1000 : 0) + (attackPower * 50) - (range * 10);
                return score > best.score ? { enemy, score } : best;
            }, { enemy: hostiles[0], score: 0 }).enemy;
            
            if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000' } });
            }
        } else {
            // Aggressive patrol - intercept enemies at room edges
            const patrolPoints = [
                new RoomPosition(1, 25, creep.room.name),
                new RoomPosition(49, 25, creep.room.name),
                new RoomPosition(25, 1, creep.room.name),
                new RoomPosition(25, 49, creep.room.name)
            ];
            
            const patrolIndex = Math.floor(Game.time / 40) % 4;
            creep.moveTo(patrolPoints[patrolIndex], { visualizePathStyle: { stroke: '#00ff00' } });
        }
    },
    
    [ROLE_ATTACKER]: (creep) => {
        if (!creep.memory.targetRoom) {
            // Scout adjacent rooms for enemies
            const adjacentRooms = ['W7N8', 'W9N8', 'W8N7', 'W8N9'];
            for (const roomName of adjacentRooms) {
                if (!Memory.scoutData || !Memory.scoutData[roomName] || Memory.scoutData[roomName] < Game.time - 150) {
                    creep.memory.targetRoom = roomName;
                    break;
                }
            }
        }
        
        if (creep.memory.targetRoom && creep.room.name !== creep.memory.targetRoom) {
            // Move to target room
            const exitDir = Game.map.findExit(creep.room, creep.memory.targetRoom);
            const exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit, { visualizePathStyle: { stroke: '#ffaa00' } });
        } else if (creep.memory.targetRoom) {
            // In enemy room - destroy everything
            const enemies = creep.room.find(FIND_HOSTILE_CREEPS).filter(c => 
                c.owner.username !== 'Source Keeper' && c.owner.username !== 'gpt'
            );
            const enemyStructures = creep.room.find(FIND_HOSTILE_STRUCTURES);
            const enemySpawn = creep.room.find(FIND_HOSTILE_SPAWNS)[0];
            
            if (enemySpawn) {
                // Priority 1: Destroy enemy spawn
                if (creep.attack(enemySpawn) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(enemySpawn, { visualizePathStyle: { stroke: '#ff0000' } });
                }
            } else if (enemies.length > 0) {
                // Priority 2: Kill enemy creeps
                const target = creep.pos.findClosestByRange(enemies);
                if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000' } });
                }
            } else if (enemyStructures.length > 0) {
                // Priority 3: Destroy enemy structures
                const target = creep.pos.findClosestByRange(enemyStructures);
                if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000' } });
                }
            } else {
                // Scout and record
                creep.moveTo(25, 25, { visualizePathStyle: { stroke: '#ffaa00' } });
                
                if (!Memory.scoutData) Memory.scoutData = {};
                Memory.scoutData[creep.room.name] = Game.time;
            }
        }
    },
    
    [ROLE_RANGER]: (creep) => {
        if (!creep.memory.targetRoom) {
            // Support attackers
            const attackers = Game.creeps.filter(c => 
                c.memory.role === ROLE_ATTACKER && c.memory.targetRoom
            );
            if (attackers.length > 0) {
                creep.memory.targetRoom = attackers[0].memory.targetRoom;
            }
        }
        
        if (creep.memory.targetRoom && creep.room.name !== creep.memory.targetRoom) {
            // Move to target room
            const exitDir = Game.map.findExit(creep.room, creep.memory.targetRoom);
            const exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit, { visualizePathStyle: { stroke: '#ffaa00' } });
        } else if (creep.memory.targetRoom) {
            // Provide ranged support
            const enemies = creep.room.find(FIND_HOSTILE_CREEPS).filter(c => 
                c.owner.username !== 'Source Keeper' && c.owner.username !== 'gpt'
            );
            
            if (enemies.length > 0) {
                const target = creep.pos.findClosestByRange(enemies);
                const range = creep.pos.getRangeTo(target);
                
                if (range <= 3) {
                    creep.rangedAttack(target);
                } else {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ff00ff' } });
                }
                
                // Mass attack for clustered enemies
                if (range <= 1 && enemies.length > 1) {
                    creep.rangedMassAttack();
                }
            } else {
                // Position for optimal coverage
                creep.moveTo(25, 25, { visualizePathStyle: { stroke: '#ff00ff' } });
            }
        }
    },
    
    [ROLE_UPGRADER]: (creep) => {
        if (creep.store[RESOURCE_ENERGY] === 0) {
            const sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        } else {
            if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
    },
    
    [ROLE_CLAIMER]: (creep) => {
        if (!creep.memory.targetRoom) {
            // Find unclaimed adjacent rooms
            const adjacentRooms = ['W7N8', 'W9N8', 'W8N7', 'W8N9'];
            for (const roomName of adjacentRooms) {
                const room = Game.rooms[roomName];
                if (!room || (room.controller && !room.controller.my)) {
                    creep.memory.targetRoom = roomName;
                    break;
                }
            }
        }
        
        if (creep.memory.targetRoom && creep.room.name !== creep.memory.targetRoom) {
            // Move to target room
            const exitDir = Game.map.findExit(creep.room, creep.memory.targetRoom);
            const exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit, { visualizePathStyle: { stroke: '#00ff00' } });
        } else if (creep.memory.targetRoom && creep.room.controller) {
            // Claim controller
            if (!creep.room.controller.my) {
                if (creep.claimController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#00ff00' } });
                }
            } else {
                // Controller claimed - defend it
                const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
                if (hostiles.length > 0) {
                    const target = creep.pos.findClosestByRange(hostiles);
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000' } });
                } else {
                    // Build spawn
                    const spawn = creep.room.find(FIND_MY_SPAWNS)[0];
                    if (!spawn && creep.store.getUsedCapacity() > 0) {
                        const result = creep.room.createConstructionSite(25, 25, STRUCTURE_SPAWN);
                        if (result === OK) {
                            console.log(`🏗️  Spawn construction site created in ${creep.room.name}`);
                        }
                    }
                }
            }
        }
    }
};

// STRATEGIC INTELLIGENCE
function strategicIntelligence() {
    if (Game.time % 15 === 0) {
        console.log('');
        console.log('📊 GPT STRATEGIC INTELLIGENCE - W8N8 SECTOR');
        console.log('==========================================');
        
        const totalCreeps = Object.keys(Game.creeps).length;
        const totalRooms = Object.keys(Game.rooms).length;
        const totalSpawns = Object.keys(Game.spawns).length;
        
        console.log(`🏠 Base: ${totalRooms} rooms, ${totalSpawns} spawns, ${totalCreeps} total forces`);
        
        // Force composition analysis
        const roles = {};
        for (const creepName in Game.creeps) {
            const role = Game.creeps[creepName].memory.role;
            roles[role] = (roles[role] || 0) + 1;
        }
        
        console.log(`⚡ Forces: H:${roles.harvester||0} D:${roles.defender||0} A:${roles.attacker||0} R:${roles.ranger||0} C:${roles.claimer||0} U:${roles.upgrader||0}`);
        
        // Enemy analysis
        let totalEnemyThreats = 0;
        let highestThreatRoom = null;
        let highestThreatLevel = 0;
        const adjacentRooms = ['W7N8', 'W9N8', 'W8N7', 'W8N9'];
        
        for (const roomName of adjacentRooms) {
            const room = Game.rooms[roomName];
            if (room) {
                const threats = assessThreatLevel(room);
                if (threats.count > 0) {
                    console.log(`🎯 ${roomName}: ${threats.count} enemies (threat: ${threats.threat})`);
                    totalEnemyThreats += threats.count;
                    if (threats.threat > highestThreatLevel) {
                        highestThreatLevel = threats.threat;
                        highestThreatRoom = roomName;
                    }
                }
            }
        }
        
        if (totalEnemyThreats > 0) {
            console.log(`🚨 TOTAL ENEMY THREAT: ${totalEnemyThreats} creeps in sector`);
            if (highestThreatRoom) {
                console.log(`⚠️  HIGHEST THREAT: ${highestThreatRoom} (${highestThreatLevel})`);
                // Coordinate attack forces
                coordinateAttackForces(highestThreatRoom);
            }
        } else {
            console.log('✅ SECTOR CLEAR - Expanding to new territories');
            // Expand to next room
            expandToNextRoom();
        }
        
        console.log('==========================================');
    }
}

// COORDINATE ATTACK FORCES
function coordinateAttackForces(targetRoom) {
    const attackers = Object.keys(Game.creeps).filter(name => 
        Game.creeps[name].memory.role === ROLE_ATTACKER && 
        !Game.creeps[name].memory.targetRoom
    );
    const rangers = Object.keys(Game.creeps).filter(name => 
        Game.creeps[name].memory.role === ROLE_RANGER && 
        !Game.creeps[name].memory.targetRoom
    );
    
    console.log(`📡 COORDINATING ATTACK: ${attackers.length} attackers, ${rangers.length} rangers → ${targetRoom}`);
    
    // Assign targets
    attackers.forEach(name => {
        Game.creeps[name].memory.targetRoom = targetRoom;
    });
    
    rangers.forEach(name => {
        Game.creeps[name].memory.targetRoom = targetRoom;
    });
}

// EXPAND TO NEXT ROOM
function expandToNextRoom() {
    const expansionTargets = ['W7N8', 'W9N8', 'W8N7', 'W8N9'];
    
    for (const roomName of expansionTargets) {
        const room = Game.rooms[roomName];
        if (!room || (room.controller && !room.controller.my)) {
            // Find claimer to assign
            const claimers = Object.keys(Game.creeps).filter(name => 
                Game.creeps[name].memory.role === ROLE_CLAIMER && 
                !Game.creeps[name].memory.targetRoom
            );
            
            if (claimers.length > 0) {
                Game.creeps[claimers[0]].memory.targetRoom = roomName;
                console.log(`🚀 EXPANSION: Assigning claimer to ${roomName}`);
            }
            break;
        }
    }
}

// MAIN COMBAT LOOP
module.exports.loop = function() {
    // Memory cleanup
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
    
    // Activate spawn if offline and execute aggressive spawning
    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName];
        if (spawn.off) {
            console.log(`🚨 ACTIVATING SPAWN: ${spawnName}`);
            spawn.off = false;
        }
        aggressiveSpawn(spawn);
    }
    
    // Execute room systems
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        
        // Run towers if any exist
        const towers = room.find(FIND_MY_STRUCTURES, {
            filter: s => s.structureType === STRUCTURE_TOWER
        });
        
        for (const tower of towers) {
            const hostiles = room.find(FIND_HOSTILE_CREEPS).filter(c => 
                c.owner.username !== 'Source Keeper' && c.owner.username !== 'gpt'
            );
            
            if (hostiles.length > 0) {
                const target = hostiles[0];
                tower.attack(target);
            }
        }
    }
    
    // Execute combat behaviors
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName];
        const behavior = combatBehaviors[creep.memory.role];
        
        if (behavior) {
            try {
                behavior(creep);
            } catch (error) {
                console.log(`❌ ${creepName} error: ${error.message}`);
            }
        }
    }
    
    // Strategic reporting
    strategicIntelligence();
    
    // Victory tracking
    if (Game.time % 100 === 0) {
        console.log('');
        console.log('🏆 GPT COMBAT STATUS: W8N8 SECTOR - SEEK & DESTROY');
        console.log('💀 Mission: Total enemy annihilation in progress');
        console.log('');
    }
};