// 🏆 ABSOLUTE FINAL ULTIMATE DOMINATION PROTOCOL 🏆
// This is your final weapon - deploy when you want TOTAL VICTORY

// Import our enhancement modules
const WAR_ENHANCEMENTS = require('./ULTIMATE_WAR_ENHANCEMENT');
const EMERGENCY_PROTOCOL = require('./EMERGENCY_COMBAT_PROTOCOL');

// Enhanced main game loop with ALL systems integrated
const ULTIMATE_AI = {
    
    // Ultimate game state
    gameState: {
        defenseMode: 0, // PEACETIME
        lastEnemySeen: 0,
        currentTick: 0,
        roomName: 'W1N3',
        spawnPos: {x: 25, y: 25},
        enemies: [],
        enemyRooms: new Set(),
        attackTargets: [],
        warPhase: 'EARLY', // EARLY, MID, LATE
        totalKills: 0,
        roomsDestroyed: 0,
        lastAttackTime: 0,
        victoryScore: 0
    },

    // Ultimate military units
    militaryBodies: {
        scout: [MOVE, MOVE, MOVE, MOVE],
        warrior: [TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE],
        archer: [TOUGH, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE],
        healer: [TOUGH, HEAL, HEAL, HEAL, MOVE, MOVE, MOVE, MOVE],
        destroyer: [TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        siege: [TOUGH, TOUGH, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE],
        assassin: [MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK],
        // NEW: Ultimate units
        titan: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        doom_squad: [TOUGH, TOUGH, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        blitz_krieg: [MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK]
    },

    // Ultimate role system
    roles: {
        harvester: { body: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE], maxCount: 8, priority: 1 },
        upgrader: { body: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE], maxCount: 6, priority: 2 },
        builder: { body: [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], maxCount: 4, priority: 3 },
        repairer: { body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE], maxCount: 3, priority: 4 },
        scout: { body: [MOVE, MOVE, MOVE, MOVE], maxCount: 3, priority: 5 },
        defender: { body: [TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE], maxCount: 6, priority: 6 },
        archer: { body: [TOUGH, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE], maxCount: 4, priority: 7 },
        attacker: { body: [TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], maxCount: 4, priority: 8 },
        assassin: { body: [MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK], maxCount: 3, priority: 9 },
        // NEW: Ultimate roles
        titan: { body: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], maxCount: 2, priority: 10 },
        doom_squad: { body: [TOUGH, TOUGH, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], maxCount: 2, priority: 11 },
        blitz_krieg: { body: [MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK], maxCount: 3, priority: 12 }
    },

    // Ultimate defense system
    ultimateDefense: {
        buildFortress: function(room) {
            const spawn = Game.spawns.Spawn1;
            if (!spawn) return;
            
            // Multi-layer defense
            const layers = [
                // Inner layer - immediate spawn protection
                [{x:-2,y:-2},{x:-1,y:-2},{x:0,y:-2},{x:1,y:-2},{x:2,y:-2},
                 {x:-2,y:-1},{x:2,y:-1},{x:-2,y:0},{x:2,y:0},{x:-2,y:1},{x:2,y:1},
                 {x:-2,y:2},{x:-1,y:2},{x:0,y:2},{x:1,y:2},{x:2,y:2}],
                
                // Middle layer - tower positions
                [{x:-4,y:-4},{x:4,y:-4},{x:-4,y:4},{x:4,y:4},{x:0,y:-6},{x:0,y:6}],
                
                // Outer layer - extended perimeter
                [{x:-6,y:0},{x:6,y:0},{x:0,y:-8},{x:0,y:8},{x:-5,y:-5},{x:5,y:-5},{x:-5,y:5},{x:5,y:5}]
            ];
            
            layers.forEach((layer, layerIndex) => {
                layer.forEach(pos => {
                    const worldX = spawn.pos.x + pos.x;
                    const worldY = spawn.pos.y + pos.y;
                    
                    const structures = room.lookForAt(LOOK_STRUCTURES, worldX, worldY);
                    const hasDefense = structures.some(s => 
                        s.structureType === STRUCTURE_RAMPART || s.structureType === STRUCTURE_WALL
                    );
                    
                    if (!hasDefense && room.createConstructionSite(worldX, worldY, STRUCTURE_RAMPART) === OK) {
                        console.log(`🏰 FORTRESS LAYER ${layerIndex + 1}: Rampart at ${worldX},${worldY}`);
                    }
                });
            });
        },
        
        buildTowers: function(room) {
            const maxTowers = 6;
            const currentTowers = room.find(FIND_MY_STRUCTURES, {
                filter: { structureType: STRUCTURE_TOWER }
            }).length;
            
            if (currentTowers < maxTowers) {
                // Strategic tower positions for maximum coverage
                const towerPositions = [
                    {x: this.gameState.spawnPos.x - 5, y: this.gameState.spawnPos.y - 5},
                    {x: this.gameState.spawnPos.x + 5, y: this.gameState.spawnPos.y - 5},
                    {x: this.gameState.spawnPos.x - 5, y: this.gameState.spawnPos.y + 5},
                    {x: this.gameState.spawnPos.x + 5, y: this.gameState.spawnPos.y + 5},
                    {x: this.gameState.spawnPos.x, y: this.gameState.spawnPos.y - 8},
                    {x: this.gameState.spawnPos.x, y: this.gameState.spawnPos.y + 8}
                ];
                
                towerPositions.forEach(pos => {
                    if (room.createConstructionSite(pos.x, pos.y, STRUCTURE_TOWER) === OK) {
                        console.log(`🏗️ ULTIMATE TOWER: Position ${pos.x},${pos.y}`);
                    }
                });
            }
        },
        
        activateUltimateTowers: function(room) {
            const towers = room.find(FIND_MY_STRUCTURES, {
                filter: { structureType: STRUCTURE_TOWER }
            });
            
            let enemiesDestroyed = 0;
            
            towers.forEach(tower => {
                // Enhanced targeting priority
                const threats = tower.room.find(FIND_HOSTILE_CREEPS, {
                    filter: hostile => {
                        const attackParts = hostile.getActiveBodyparts(ATTACK) + hostile.getActiveBodyparts(RANGED_ATTACK);
                        const healParts = hostile.getActiveBodyparts(HEAL);
                        return attackParts > 0 || healParts > 0;
                    }
                });
                
                // Prioritize healers, then high-damage enemies
                threats.sort((a, b) => {
                    const aHeal = a.getActiveBodyparts(HEAL);
                    const bHeal = b.getActiveBodyparts(HEAL);
                    const aAttack = a.getActiveBodyparts(ATTACK) + a.getActiveBodyparts(RANGED_ATTACK);
                    const bAttack = b.getActiveBodyparts(ATTACK) + b.getActiveBodyparts(RANGED_ATTACK);
                    
                    if (aHeal > 0 && bHeal === 0) return -1;
                    if (bHeal > 0 && aHeal === 0) return 1;
                    return bAttack - aAttack;
                });
                
                if (threats.length > 0) {
                    tower.attack(threats[0]);
                    console.log(`⚔️ ULTIMATE TOWER: Destroying ${threats[0].name}`);
                    enemiesDestroyed++;
                } else {
                    // Heal damaged allies
                    const damagedCreeps = tower.room.find(FIND_MY_CREEPS, {
                        filter: creep => creep.hits < creep.hitsMax
                    });
                    
                    if (damagedCreeps.length > 0) {
                        tower.heal(damagedCreeps[0]);
                    }
                }
            });
            
            return enemiesDestroyed;
        }
    },

    // Ultimate attack coordination
    ultimateAttack: {
        activeAttacks: new Map(),
        warRooms: new Set(),
        
        findAllEnemies: function() {
            const allEnemies = [];
            const visitedRooms = new Set();
            
            // BFS to find all enemy rooms
            const queue = ['W1N3'];
            visitedRooms.add('W1N3');
            
            while (queue.length > 0) {
                const currentRoom = queue.shift();
                const exits = Game.map.describeExits(currentRoom);
                
                if (exits) {
                    Object.values(exits).forEach(roomName => {
                        if (!visitedRooms.has(roomName)) {
                            visitedRooms.add(roomName);
                            queue.push(roomName);
                            
                            const room = Game.rooms[roomName];
                            if (room) {
                                const hostiles = room.find(FIND_HOSTILE_CREEPS);
                                const enemySpawn = room.find(FIND_HOSTILE_SPAWNS)[0];
                                const enemyTowers = room.find(FIND_HOSTILE_STRUCTURES, {
                                    filter: { structureType: STRUCTURE_TOWER }
                                });
                                
                                if (hostiles.length > 0 || enemySpawn || enemyTowers.length > 0) {
                                    allEnemies.push({
                                        room: roomName,
                                        hostiles: hostiles.length,
                                        hasSpawn: !!enemySpawn,
                                        towers: enemyTowers.length,
                                        threat: hostiles.length * 10 + (enemySpawn ? 100 : 0) + enemyTowers.length * 50
                                    });
                                }
                            }
                        }
                    });
                }
            }
            
            return allEnemies.sort((a, b) => a.threat - b.threat);
        },
        
        launchUltimateAttack: function(targetRoom, formationType = 'mixed') {
            const attackId = `ULTIMATE_${Game.time}`;
            
            const formation = {
                mixed: ['titan', 'doom_squad', 'blitz_krieg', 'assassin', 'archer'],
                blitz: ['blitz_krieg', 'blitz_krieg', 'assassin'],
                siege: ['titan', 'doom_squad', 'doom_squad'],
                swarm: ['assassin', 'assassin', 'assassin', 'archer', 'archer']
            }[formationType] || formationType.mixed;
            
            const attack = {
                id: attackId,
                targetRoom: targetRoom,
                formation: formation,
                units: [],
                status: 'forming',
                launchTick: Game.time + 20,
                formationType: formationType
            };
            
            this.activeAttacks.set(attackId, attack);
            console.log(`🚀 ULTIMATE ATTACK LAUNCHED: ${attackId} targeting ${targetRoom} with ${formationType} formation!`);
            
            return attackId;
        },
        
        coordinateAttacks: function() {
            // Manage existing attacks
            for (let [id, attack] of this.activeAttacks) {
                if (attack.status === 'forming' && Game.time >= attack.launchTick) {
                    this.executeUltimateAttack(attack);
                }
                
                if (attack.status === 'completed' || Game.time > attack.launchTick + 1000) {
                    this.activeAttacks.delete(id);
                }
            }
            
            // Launch new attacks based on strategy
            if (Game.time % 150 === 0) {
                const enemies = this.findAllEnemies();
                
                if (enemies.length > 0) {
                    const target = enemies[0]; // Weakest enemy
                    
                    // Choose formation based on enemy type
                    let formation = 'mixed';
                    if (target.hasSpawn) formation = 'blitz';
                    if (target.towers > 2) formation = 'siege';
                    if (target.hostiles > 5) formation = 'swarm';
                    
                    this.launchUltimateAttack(target.room, formation);
                }
            }
        },
        
        executeUltimateAttack: function(attack) {
            // Find available units
            const availableUnits = [];
            
            attack.formation.forEach(role => {
                const unit = Object.keys(Game.creeps).find(name => {
                    const creep = Game.creeps[name];
                    return creep.memory.role === role && 
                           !creep.memory.assignedAttack && 
                           creep.room.name === 'W1N3';
                });
                
                if (unit) {
                    availableUnits.push(unit);
                }
            });
            
            if (availableUnits.length >= attack.formation.length * 0.7) {
                // Launch attack with available units
                availableUnits.forEach(unitName => {
                    const creep = Game.creeps[unitName];
                    creep.memory.assignedAttack = attack.id;
                    creep.memory.targetRoom = attack.targetRoom;
                    creep.memory.attackRole = creep.memory.role;
                    creep.memory.formation = attack.formationType;
                });
                
                attack.status = 'executing';
                attack.units = availableUnits;
                console.log(`⚔️ ULTIMATE ATTACK EXECUTING: ${attack.id} with ${availableUnits.length} units!`);
            }
        }
    },

    // Ultimate economy management
    ultimateEconomy: {
        optimizeHarvesting: function(room) {
            const sources = room.find(FIND_SOURCES);
            const harvesters = Object.keys(Game.creeps).filter(name => 
                Game.creeps[name].memory.role === 'harvester'
            ).length;
            
            // Assign harvesters to sources optimally
            sources.forEach((source, index) => {
                const assignedHarvesters = Object.keys(Game.creeps).filter(name => {
                    const creep = Game.creeps[name];
                    return creep.memory.role === 'harvester' && 
                           creep.memory.sourceId === source.id;
                });
                
                if (assignedHarvesters.length < 2) {
                    // Find unassigned harvesters
                    const unassigned = Object.keys(Game.creeps).find(name => {
                        const creep = Game.creeps[name];
                        return creep.memory.role === 'harvester' && !creep.memory.sourceId;
                    });
                    
                    if (unassigned) {
                        Game.creeps[unassigned].memory.sourceId = source.id;
                    }
                }
            });
        },
        
        rapidExpansion: function(room) {
            const controller = room.controller;
            if (!controller) return;
            
            // Focus on upgrading controller rapidly
            const upgraders = Object.keys(Game.creeps).filter(name => 
                Game.creeps[name].memory.role === 'upgrader'
            ).length;
            
            if (upgraders < this.roles.upgrader.maxCount && room.energyAvailable > 300) {
                this.spawnManager.spawnUltimateCreep('upgrader');
            }
        }
    },

    // Ultimate spawn management
    spawnManager: {
        spawnUltimateCreep: function(roleName) {
            const spawn = Game.spawns.Spawn1;
            if (!spawn) return null;
            
            const role = ULTIMATE_AI.roles[roleName];
            if (!role) return null;
            
            const body = role.body;
            const bodyCost = body.reduce((cost, part) => cost + BODYPART_COST[part], 0);
            
            if (spawn.room.energyAvailable < bodyCost) return null;
            
            const creepName = `${roleName}_ULTIMATE_${Game.time}`;
            const result = spawn.spawnCreep(body, creepName, {
                memory: { 
                    role: roleName, 
                    born: Game.time, 
                    ultimate: true,
                    mission: 'DOMINATION'
                }
            });
            
            if (result === OK) {
                console.log(`🐣 ULTIMATE SPAWN: ${creepName} - ${roleName.toUpperCase()}`);
                return creepName;
            }
            
            return null;
        },
        
        maintainUltimatePopulation: function() {
            const creeps = Game.creeps;
            const creepCounts = {};
            
            Object.keys(ULTIMATE_AI.roles).forEach(role => creepCounts[role] = 0);
            
            for (let creepName in creeps) {
                const creep = creeps[creepName];
                if (creep.memory.role) {
                    creepCounts[creep.memory.role]++;
                }
            }
            
            // Prioritize based on war phase
            const rolePriorities = this.getUltimatePriorities();
            
            for (let role of rolePriorities) {
                if (creepCounts[role] < ULTIMATE_AI.roles[role].maxCount) {
                    this.spawnUltimateCreep(role);
                    break;
                }
            }
        },
        
        getUltimatePriorities: function() {
            const phase = this.determineWarPhase();
            
            const priorities = {
                'EARLY': ['harvester', 'upgrader', 'scout', 'defender', 'builder'],
                'MID': ['harvester', 'defender', 'archer', 'upgrader', 'attacker', 'scout'],
                'LATE': ['titan', 'doom_squad', 'blitz_krieg', 'assassin', 'archer', 'harvester']
            };
            
            return priorities[phase] || priorities['EARLY'];
        },
        
        determineWarPhase: function() {
            const room = Game.rooms[ULTIMATE_AI.gameState.roomName];
            if (!room) return 'EARLY';
            
            const controller = room.controller;
            if (!controller) return 'EARLY';
            
            if (controller.level >= 6) return 'LATE';
            if (controller.level >= 4) return 'MID';
            return 'EARLY';
        }
    },

    // Ultimate intelligence
    ultimateIntelligence: {
        gatherIntel: function() {
            const room = Game.rooms[ULTIMATE_AI.gameState.roomName];
            if (!room) return;
            
            // Enhanced enemy detection
            const hostiles = room.find(FIND_HOSTILE_CREEPS);
            const hostileStructures = room.find(FIND_HOSTILE_STRUCTURES);
            
            ULTIMATE_AI.gameState.enemies = hostiles;
            
            if (hostiles.length > 0 || hostileStructures.length > 0) {
                ULTIMATE_AI.gameState.lastEnemySeen = Game.time;
                
                // Calculate threat level with more precision
                let threatLevel = 0;
                hostiles.forEach(creep => {
                    threatLevel += creep.getActiveBodyparts(ATTACK) * 30;
                    threatLevel += creep.getActiveBodyparts(RANGED_ATTACK) * 20;
                    threatLevel += creep.getActiveBodyparts(HEAL) * 25;
                    threatLevel += creep.getActiveBodyparts(TOUGH) * 10;
                });
                
                hostileStructures.forEach(structure => {
                    if (structure.structureType === STRUCTURE_TOWER) threatLevel += 100;
                    if (structure.structureType === STRUCTURE_SPAWN) threatLevel += 200;
                });
                
                // Update defense mode based on threat
                if (threatLevel > 300 || hostiles.length > 8) {
                    ULTIMATE_AI.gameState.defenseMode = 3; // EMERGENCY
                    console.log(`🚨 ULTIMATE EMERGENCY: Threat level ${threatLevel}!`);
                } else if (threatLevel > 150 || hostiles.length > 4) {
                    ULTIMATE_AI.gameState.defenseMode = 2; // WAR
                    console.log(`🚨 ULTIMATE WAR: Threat level ${threatLevel}!`);
                } else if (threatLevel > 50 || hostiles.length > 1) {
                    ULTIMATE_AI.gameState.defenseMode = 1; // ALERT
                    console.log(`⚠️ ULTIMATE ALERT: Threat level ${threatLevel}!`);
                }
            } else {
                // Return to peacetime after 50 ticks
                if (Game.time - ULTIMATE_AI.gameState.lastEnemySeen > 50) {
                    ULTIMATE_AI.gameState.defenseMode = 0; // PEACETIME
                }
            }
            
            return { hostiles, hostileStructures, threatLevel };
        },
        
        updateVictoryScore: function() {
            // Calculate victory score based on various factors
            let score = 0;
            
            // Base score from controller level
            const room = Game.rooms[ULTIMATE_AI.gameState.roomName];
            if (room && room.controller) {
                score += room.controller.level * 100;
            }
            
            // Score from military units
            const militaryUnits = Object.keys(Game.creeps).filter(name => {
                const creep = Game.creeps[name];
                const militaryRoles = ['defender', 'archer', 'attacker', 'assassin', 'titan', 'doom_squad', 'blitz_krieg'];
                return militaryRoles.includes(creep.memory.role);
            }).length;
            
            score += militaryUnits * 50;
            
            // Score from successful attacks
            score += ULTIMATE_AI.gameState.totalKills * 200;
            score += ULTIMATE_AI.gameState.roomsDestroyed * 500;
            
            ULTIMATE_AI.gameState.victoryScore = score;
            return score;
        }
    },

    // Ultimate creep behaviors
    ultimateBehaviors: {
        // Enhanced versions of all creep behaviors
        titan: function(creep) {
            // Ultimate tank unit
            const target = creep.pos.findClosestByPath(FIND_HOSTILE_SPAWNS) ||
                          creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
                              filter: { structureType: STRUCTURE_TOWER }
                          }) ||
                          creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
            
            if (target) {
                if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000', lineStyle: 'dashed'}});
                }
            }
        },
        
        doom_squad: function(creep) {
            // Ultimate ranged unit with healing
            const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS) ||
                          creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
            
            if (target) {
                const range = creep.pos.getRangeTo(target);
                if (range <= 3) {
                    creep.rangedAttack(target);
                }
                
                if (range > 3) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ff6600'}});
                } else if (range < 2) {
                    // Kite away
                    const fleeDirection = creep.pos.getDirectionTo(target);
                    const fleePos = creep.pos.getAdjacentPosition((fleeDirection + 3) % 8 + 1);
                    creep.moveTo(fleePos);
                }
            }
            
            // Heal nearby allies
            const damagedAlly = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: ally => ally.hits < ally.hitsMax && ally.pos.getRangeTo(creep) <= 3
            });
            
            if (damagedAlly) {
                creep.heal(damagedAlly);
            }
        },
        
        blitz_krieg: function(creep) {
            // Ultimate fast assault unit
            const target = creep.pos.findClosestByPath(FIND_HOSTILE_SPAWNS) ||
                          creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES) ||
                          creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
            
            if (target) {
                if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#aa0000', lineStyle: 'dashed'}});
                }
            }
        }
    },

    // Main ultimate game loop
    ultimateLoop: function() {
        ULTIMATE_AI.gameState.currentTick = Game.time;
        
        // Clear memory
        for (let name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }
        
        const room = Game.rooms[ULTIMATE_AI.gameState.roomName];
        if (!room) {
            console.log(`❌ ULTIMATE FAILURE: Room ${ULTIMATE_AI.gameState.roomName} not found!`);
            return;
        }
        
        // Execute emergency protocol first
        const threat = EMERGENCY_PROTOCOL.execute();
        
        // Ultimate intelligence gathering
        const intel = ULTIMATE_AI.ultimateIntelligence.gatherIntel();
        
        // Ultimate defense activation
        const enemiesDestroyed = ULTIMATE_AI.ultimateDefense.activateUltimateTowers(room);
        
        // Build based on defense mode
        if (ULTIMATE_AI.gameState.defenseMode === 3) { // EMERGENCY
            ULTIMATE_AI.ultimateDefense.buildFortress(room);
        } else if (ULTIMATE_AI.gameState.defenseMode === 2) { // WAR
            ULTIMATE_AI.ultimateDefense.buildFortress(room);
            ULTIMATE_AI.ultimateDefense.buildTowers(room);
        } else if (ULTIMATE_AI.gameState.defenseMode === 0) { // PEACETIME
            ULTIMATE_AI.ultimateDefense.buildTowers(room);
            ULTIMATE_AI.ultimateEconomy.rapidExpansion(room);
        }
        
        // Ultimate population management
        ULTIMATE_AI.spawnManager.maintainUltimatePopulation();
        
        // Ultimate attack coordination
        ULTIMATE_AI.ultimateAttack.coordinateAttacks();
        
        // Integrate war enhancements
        WAR_ENHANCEMENTS.integrate(ULTIMATE_AI.gameState);
        
        // Handle ultimate creep behaviors
        for (let name in Game.creeps) {
            const creep = Game.creeps[name];
            const role = creep.memory.role;
            
            if (ULTIMATE_AI.ultimateBehaviors[role]) {
                ULTIMATE_AI.ultimateBehaviors[role](creep);
            } else if (ULTIMATE_AI.creepActions && ULTIMATE_AI.creepActions[role]) {
                ULTIMATE_AI.creepActions[role](creep);
            }
        }
        
        // Update victory score
        const victoryScore = ULTIMATE_AI.ultimateIntelligence.updateVictoryScore();
        
        // Ultimate status logging
        if (Game.time % 3 === 0) {
            const modeNames = ['PEACETIME', 'ALERT', 'WAR', 'EMERGENCY'];
            const warPhase = ULTIMATE_AI.spawnManager.determineWarPhase();
            console.log(`🏆 ULTIMATE STATUS: ${modeNames[ULTIMATE_AI.gameState.defenseMode]} | Phase: ${warPhase} | Score: ${victoryScore} | Enemies: ${ULTIMATE_AI.gameState.enemies.length} | Kills: ${ULTIMATE_AI.gameState.totalKills}`);
        }
        
        // Victory check
        if (victoryScore > 2000) {
            console.log(`🎉 ULTIMATE VICTORY ACHIEVED! Score: ${victoryScore}`);
        }
    }
};

// Export the ultimate AI
module.exports.loop = ULTIMATE_AI.ultimateLoop;