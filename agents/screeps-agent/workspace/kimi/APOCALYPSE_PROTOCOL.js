// 💀 APOCALYPSE PROTOCOL - TOTAL ANNIHILATION EDITION 💀
// This AI doesn't just win - it ERADICATES all opposition
// Deploy only when you want COMPLETE DOMINATION

const APOCALYPSE = {
    // Nuclear threat levels
    THREAT: {
        NONE: 0,
        MINIMAL: 1,
        MODERATE: 2,
        SEVERE: 3,
        CRITICAL: 4,
        APOCALYPTIC: 5
    },
    
    // Global annihilation state
    annihilationState: {
        threatLevel: 0,
        enemiesLocated: new Set(),
        activeNuclearStrikes: [],
        totalEnemiesEliminated: 0,
        roomsScorched: 0,
        doomsdayClock: 0,
        warPhase: 'GENESIS', // GENESIS, REVELATION, APOCALYPSE, EXTINCTION
        lastMassacre: 0,
        spawnProtection: false
    },

    // Doomsday unit compositions
    doomsdayUnits: {
        // ☢️ NUCLEAR OPTION - Total destruction teams
        nuke_squad: {
            body: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
            role: 'apocalypse_titan',
            priority: 1,
            mission: 'TOTAL_ANNIHILATION'
        },
        
        // 🩸 BLOOD LEGION - Swarm attackers
        blood_legion: {
            body: [MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK],
            role: 'apocalypse_berzerker',
            priority: 2,
            mission: 'MASSACRE'
        },
        
        // ☠️ DEATH SQUAD - Elite extermination team
        death_squad: {
            body: [TOUGH, TOUGH, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
            role: 'apocalypse_exterminator',
            priority: 3,
            mission: 'EXTERMINATION'
        },
        
        // 🔥 HELLFIRE BRIGADE - Fast assault team
        hellfire_brigade: {
            body: [MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK],
            role: 'apocalypse_assassin',
            priority: 4,
            mission: 'BLITZ_ASSAULT'
        },
        
        // 🌪️ OMEGA SWARM - Overwhelming force
        omega_swarm: {
            body: [MOVE, MOVE, ATTACK, ATTACK, ATTACK, MOVE, MOVE, ATTACK, ATTACK, ATTACK],
            role: 'apocalypse_swarm',
            priority: 5,
            mission: 'OVERWHELM'
        }
    },

    // Nuclear launch codes
    nuclearCodes: {
        // Find weakest enemy for first strike
        findFirstStrikeTarget: function() {
            const adjacentRooms = this.getAdjacentRooms('W1N3');
            let weakestTarget = null;
            let lowestThreat = Infinity;
            
            adjacentRooms.forEach(roomName => {
                const room = Game.rooms[roomName];
                if (room) {
                    const hostiles = room.find(FIND_HOSTILE_CREEPS);
                    const enemySpawn = room.find(FIND_HOSTILE_SPAWNS)[0];
                    const enemyTowers = room.find(FIND_HOSTILE_STRUCTURES, {
                        filter: { structureType: STRUCTURE_TOWER }
                    });
                    
                    const threatLevel = hostiles.length * 15 + (enemySpawn ? 100 : 0) + enemyTowers.length * 75;
                    
                    if (threatLevel < lowestThreat) {
                        lowestThreat = threatLevel;
                        weakestTarget = {
                            room: roomName,
                            threat: threatLevel,
                            hasSpawn: !!enemySpawn,
                            towers: enemyTowers.length,
                            hostiles: hostiles.length
                        };
                    }
                }
            });
            
            return weakestTarget;
        },
        
        // Get all adjacent rooms
        getAdjacentRooms: function(roomName) {
            const exits = Game.map.describeExits(roomName);
            return exits ? Object.values(exits) : [];
        },
        
        // Launch coordinated nuclear strike
        launchNuclearStrike: function(targetRoom, formationType = 'mixed') {
            const strikeId = `NUCLEAR_${Game.time}`;
            const formation = this.selectFormation(formationType, targetRoom);
            
            const strike = {
                id: strikeId,
                targetRoom: targetRoom,
                formation: formation,
                units: [],
                status: 'ARMING',
                launchTick: Game.time + 15,
                formationType: formationType,
                priority: 'EXTREME'
            };
            
            this.annihilationState.activeNuclearStrikes.push(strike);
            console.log(`☢️ NUCLEAR STRIKE AUTHORIZED: ${strikeId} targeting ${targetRoom}!`);
            
            return strikeId;
        },
        
        // Select optimal formation based on target
        selectFormation: function(type, targetRoom) {
            const room = Game.rooms[targetRoom];
            if (!room) return ['apocalypse_titan', 'apocalypse_berzerker'];
            
            const hostiles = room.find(FIND_HOSTILE_CREEPS);
            const towers = room.find(FIND_HOSTILE_STRUCTURES, {
                filter: { structureType: STRUCTURE_TOWER }
            });
            const spawn = room.find(FIND_HOSTILE_SPAWNS)[0];
            
            // Choose formation based on enemy defenses
            if (spawn) {
                return ['apocalypse_titan', 'apocalypse_berzerker', 'apocalypse_assassin']; // Spawn killer team
            } else if (towers.length > 2) {
                return ['apocalypse_exterminator', 'apocalypse_exterminator', 'apocalypse_titan']; // Siege team
            } else if (hostiles.length > 5) {
                return ['apocalypse_swarm', 'apocalypse_swarm', 'apocalypse_swarm', 'apocalypse_berzerker']; // Swarm team
            } else {
                return ['apocalypse_titan', 'apocalypse_berzerker']; // Standard assault
            }
        }
    },

    // Extermination coordination
    exterminationCoordination: {
        // Manage all active nuclear strikes
        manageStrikes: function() {
            this.annihilationState.activeNuclearStrikes = this.annihilationState.activeNuclearStrikes.filter(strike => {
                if (strike.status === 'ARMING' && Game.time >= strike.launchTick) {
                    this.executeNuclearStrike(strike);
                }
                
                if (strike.status === 'EXECUTING' && Game.time > strike.launchTick + 500) {
                    strike.status = 'COMPLETED';
                    this.annihilationState.roomsScorched++;
                    console.log(`💀 STRIKE COMPLETED: ${strike.id} - Room ${strike.targetRoom} SCORCHED!`);
                    return false;
                }
                
                return strike.status !== 'COMPLETED';
            });
        },
        
        // Execute nuclear strike with available units
        executeNuclearStrike: function(strike) {
            const availableUnits = [];
            
            strike.formation.forEach(role => {
                const unit = Object.keys(Game.creeps).find(name => {
                    const creep = Game.creeps[name];
                    return creep.memory.role === role && 
                           !creep.memory.assignedStrike && 
                           creep.room.name === 'W1N3' &&
                           creep.ticksToLive > 100; // Only use fresh units
                });
                
                if (unit) {
                    availableUnits.push(unit);
                }
            });
            
            if (availableUnits.length >= strike.formation.length * 0.6) {
                // Launch strike with available units
                availableUnits.forEach(unitName => {
                    const creep = Game.creeps[unitName];
                    creep.memory.assignedStrike = strike.id;
                    creep.memory.targetRoom = strike.targetRoom;
                    creep.memory.mission = 'EXTERMINATE';
                    creep.memory.attackRole = creep.memory.role;
                });
                
                strike.status = 'EXECUTING';
                strike.units = availableUnits;
                console.log(`💀 NUCLEAR STRIKE EXECUTING: ${strike.id} with ${availableUnits.length} units!`);
            }
        },
        
        // Coordinate multiple simultaneous strikes
        coordinateMassStrikes: function() {
            if (Game.time % 75 === 0 && this.annihilationState.activeNuclearStrikes.length < 3) {
                const enemies = this.nuclearCodes.findFirstStrikeTarget();
                
                if (enemies && enemies.length > 0) {
                    // Launch strikes on multiple targets
                    const targets = enemies.slice(0, 3); // Up to 3 simultaneous strikes
                    
                    targets.forEach(target => {
                        this.nuclearCodes.launchNuclearStrike(target.room, 'mixed');
                    });
                    
                    console.log(`🌪️ MASS STRIKE LAUNCHED: ${targets.length} simultaneous nuclear strikes!`);
                }
            }
        }
    },

    // Doomsday defense system
    doomsdayDefense: {
        // Build impenetrable fortress
        buildDoomsdayFortress: function(room) {
            const spawn = Game.spawns.Spawn1;
            if (!spawn) return;
            
            // Multi-layer apocalypse bunker
            const bunkerLayers = [
                // Core layer - spawn protection
                [{x:0,y:0},{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}],
                
                // Inner defense ring
                [{x:-2,y:-2},{x:-1,y:-2},{x:0,y:-2},{x:1,y:-2},{x:2,y:-2},
                 {x:-2,y:-1},{x:2,y:-1},{x:-2,y:0},{x:2,y:0},{x:-2,y:1},{x:2,y:1},
                 {x:-2,y:2},{x:-1,y:2},{x:0,y:2},{x:1,y:2},{x:2,y:2}],
                
                // Tower positions
                [{x:-3,y:-3},{x:3,y:-3},{x:-3,y:3},{x:3,y:3},{x:0,y:-4},{x:0,y:4}],
                
                // Outer perimeter
                [{x:-5,y:0},{x:5,y:0},{x:0,y:-6},{x:0,y:6},{x:-4,y:-4},{x:4,y:-4},{x:-4,y:4},{x:4,y:4}]
            ];
            
            bunkerLayers.forEach((layer, index) => {
                layer.forEach(pos => {
                    const worldX = spawn.pos.x + pos.x;
                    const worldY = spawn.pos.y + pos.y;
                    
                    const structures = room.lookForAt(LOOK_STRUCTURES, worldX, worldY);
                    const hasDefense = structures.some(s => 
                        s.structureType === STRUCTURE_RAMPART || s.structureType === STRUCTURE_WALL
                    );
                    
                    if (!hasDefense && room.createConstructionSite(worldX, worldY, STRUCTURE_RAMPART) === OK) {
                        console.log(`💀 BUNKER LAYER ${index + 1}: Doomsday rampart at ${worldX},${worldY}`);
                    }
                });
            });
        },
        
        // Build doomsday towers
        buildDoomsdayTowers: function(room) {
            const maxTowers = 6;
            const currentTowers = room.find(FIND_MY_STRUCTURES, {
                filter: { structureType: STRUCTURE_TOWER }
            }).length;
            
            if (currentTowers < maxTowers) {
                // Strategic tower positions for maximum kill zone
                const towerPositions = [
                    {x: this.annihilationState.spawnPos.x - 6, y: this.annihilationState.spawnPos.y - 6},
                    {x: this.annihilationState.spawnPos.x + 6, y: this.annihilationState.spawnPos.y - 6},
                    {x: this.annihilationState.spawnPos.x - 6, y: this.annihilationState.spawnPos.y + 6},
                    {x: this.annihilationState.spawnPos.x + 6, y: this.annihilationState.spawnPos.y + 6},
                    {x: this.annihilationState.spawnPos.x, y: this.annihilationState.spawnPos.y - 8},
                    {x: this.annihilationState.spawnPos.x, y: this.annihilationState.spawnPos.y + 8}
                ];
                
                towerPositions.forEach(pos => {
                    if (room.createConstructionSite(pos.x, pos.y, STRUCTURE_TOWER) === OK) {
                        console.log(`🏗️ DOOMSDAY TOWER: Position ${pos.x},${pos.y}`);
                    }
                });
            }
        },
        
        // Activate doomsday towers with enhanced targeting
        activateDoomsdayTowers: function(room) {
            const towers = room.find(FIND_MY_STRUCTURES, {
                filter: { structureType: STRUCTURE_TOWER }
            });
            
            let enemiesAnnihilated = 0;
            
            towers.forEach(tower => {
                // Enhanced threat detection
                const allHostiles = tower.room.find(FIND_HOSTILE_CREEPS);
                
                if (allHostiles.length > 0) {
                    // Prioritize by danger level
                    const prioritizedTargets = allHostiles.sort((a, b) => {
                        const aThreat = this.calculateApocalypseThreat(a);
                        const bThreat = this.calculateApocalypseThreat(b);
                        return bThreat - aThreat;
                    });
                    
                    const primaryTarget = prioritizedTargets[0];
                    tower.attack(primaryTarget);
                    
                    console.log(`💀 DOOMSDAY TOWER: Annihilating ${primaryTarget.name} (Threat: ${this.calculateApocalypseThreat(primaryTarget)})`);
                    enemiesAnnihilated++;
                } else {
                    // Enhanced healing for damaged allies
                    const damagedCreeps = tower.room.find(FIND_MY_CREEPS, {
                        filter: creep => creep.hits < creep.hitsMax * 0.9
                    });
                    
                    if (damagedCreeps.length > 0) {
                        const mostDamaged = damagedCreeps.sort((a, b) => 
                            (a.hits / a.hitsMax) - (b.hits / b.hitsMax)
                        )[0];
                        tower.heal(mostDamaged);
                    }
                }
            });
            
            return enemiesAnnihilated;
        },
        
        // Calculate apocalypse threat level of enemy
        calculateApocalypseThreat: function(enemy) {
            let threat = 0;
            threat += enemy.getActiveBodyparts(ATTACK) * 50;
            threat += enemy.getActiveBodyparts(RANGED_ATTACK) * 40;
            threat += enemy.getActiveBodyparts(HEAL) * 60;
            threat += enemy.getActiveBodyparts(TOUGH) * 20;
            threat += enemy.hits / 10; // Higher health = higher threat
            
            return threat;
        }
    },

    // Apocalypse spawn management
    apocalypseSpawner: {
        // Spawn doomsday units
        spawnApocalypseUnit: function(unitType) {
            const spawn = Game.spawns.Spawn1;
            if (!spawn) return null;
            
            const unit = APOCALYPSE.doomsdayUnits[unitType];
            if (!unit) return null;
            
            const body = unit.body;
            const bodyCost = body.reduce((cost, part) => cost + BODYPART_COST[part], 0);
            
            if (spawn.room.energyAvailable < bodyCost) return null;
            
            const unitName = `${unit.role}_${Game.time}_APOCALYPSE`;
            const result = spawn.spawnCreep(body, unitName, {
                memory: {
                    role: unit.role,
                    mission: unit.mission,
                    born: Game.time,
                    apocalypse: true,
                    doomsday: true
                }
            });
            
            if (result === OK) {
                console.log(`💀 APOCALYPSE UNIT SPAWNED: ${unitName} - Mission: ${unit.mission}`);
                return unitName;
            }
            
            return null;
        },
        
        // Maintain apocalypse army
        maintainApocalypseArmy: function() {
            const currentUnits = this.countApocalypseUnits();
            const threatLevel = this.assessApocalypseThreat();
            
            // Determine required army composition based on threat
            const requiredUnits = this.calculateRequiredApocalypseForce(threatLevel);
            
            // Spawn missing doomsday units
            for (let [unitType, requiredCount] of Object.entries(requiredUnits)) {
                if (currentUnits[unitType] < requiredCount) {
                    this.spawnApocalypseUnit(unitType);
                    break; // Only spawn one per tick
                }
            }
        },
        
        // Count current apocalypse units
        countApocalypseUnits: function() {
            const counts = {};
            Object.keys(APOCALYPSE.doomsdayUnits).forEach(type => {
                counts[type] = 0;
            });
            
            for (let name in Game.creeps) {
                const creep = Game.creeps[name];
                if (creep.memory.apocalypse) {
                    const unitType = Object.keys(APOCALYPSE.doomsdayUnits).find(type => 
                        APOCALYPSE.doomsdayUnits[type].role === creep.memory.role
                    );
                    if (unitType) counts[unitType]++;
                }
            }
            
            return counts;
        },
        
        // Calculate required apocalypse force
        calculateRequiredApocalypseForce: function(threatLevel) {
            const baseForce = {
                nuke_squad: 1,
                blood_legion: 2,
                death_squad: 1,
                hellfire_brigade: 2,
                omega_swarm: 3
            };
            
            // Scale based on threat
            const multiplier = Math.max(1, threatLevel / 2);
            
            const required = {};
            for (let [unit, count] of Object.entries(baseForce)) {
                required[unit] = Math.ceil(count * multiplier);
            }
            
            return required;
        }
    },

    // Apocalypse unit behaviors
    apocalypseBehaviors: {
        // ☢️ APOCALYPSE TITAN - Ultimate destruction unit
        apocalypse_titan: function(creep) {
            if (!creep.memory.targetRoom) {
                const target = APOCALYPSE.nuclearCodes.findFirstStrikeTarget();
                if (target) creep.memory.targetRoom = target.room;
                return;
            }
            
            // Move to target room
            if (creep.room.name !== creep.memory.targetRoom) {
                const exit = creep.room.findExitTo(creep.memory.targetRoom);
                const exitPos = creep.pos.findClosestByRange(exit);
                if (exitPos) {
                    creep.moveTo(exitPos, {visualizePathStyle: {stroke: '#ff0000', lineStyle: 'dashed'}});
                }
                return;
            }
            
            // In target room - seek and destroy
            const priorityTargets = [
                FIND_HOSTILE_SPAWNS,
                FIND_HOSTILE_STRUCTURES,
                FIND_HOSTILE_CREEPS
            ];
            
            for (let targetType of priorityTargets) {
                const targets = creep.room.find(targetType);
                if (targets.length > 0) {
                    const target = creep.pos.findClosestByRange(targets);
                    if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#aa0000'}});
                    }
                    break;
                }
            }
        },
        
        // 🩸 APOCALYPSE BERZERKER - Massacre specialist
        apocalypse_berzerker: function(creep) {
            const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
            if (enemies.length > 0) {
                const target = creep.pos.findClosestByRange(enemies);
                if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#dd0000'}});
                }
            } else {
                // Attack structures if no creeps
                const structures = creep.room.find(FIND_HOSTILE_STRUCTURES);
                if (structures.length > 0) {
                    if (creep.attack(structures[0]) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(structures[0], {visualizePathStyle: {stroke: '#cc0000'}});
                    }
                }
            }
        },
        
        // ☠️ APOCALYPSE EXTERMINATOR - Elite ranged killer
        apocalypse_exterminator: function(creep) {
            const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
            
            if (enemies.length > 0) {
                // Prioritize healers and high-damage enemies
                const priorityTargets = enemies.sort((a, b) => {
                    const aHeal = a.getActiveBodyparts(HEAL);
                    const bHeal = b.getActiveBodyparts(HEAL);
                    const aAttack = a.getActiveBodyparts(ATTACK) + a.getActiveBodyparts(RANGED_ATTACK);
                    const bAttack = b.getActiveBodyparts(ATTACK) + b.getActiveBodyparts(RANGED_ATTACK);
                    
                    if (aHeal > 0 && bHeal === 0) return -1;
                    if (bHeal > 0 && aHeal === 0) return 1;
                    return bAttack - aAttack;
                });
                
                const target = priorityTargets[0];
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
            
            // Heal allies
            const damagedAlly = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: ally => ally.hits < ally.hitsMax && ally.pos.getRangeTo(creep) <= 3
            });
            
            if (damagedAlly) {
                creep.heal(damagedAlly);
            }
        },
        
        // 🔥 APOCALYPSE ASSASSIN - Fast blitz unit
        apocalypse_assassin: function(creep) {
            const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
            if (enemies.length > 0) {
                const target = creep.pos.findClosestByRange(enemies);
                if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ff4444'}});
                }
            } else {
                // Move to adjacent rooms to hunt
                const exits = Game.map.describeExits(creep.room.name);
                if (exits) {
                    const exitDirs = Object.keys(exits);
                    const targetRoom = exits[exitDirs[Math.floor(Math.random() * exitDirs.length)]];
                    const exitDir = creep.room.findExitTo(targetRoom);
                    const exit = creep.pos.findClosestByRange(exitDir);
                    if (exit) {
                        creep.moveTo(exit);
                    }
                }
            }
        },
        
        // 🌪️ APOCALYPSE SWARM - Swarm attacker
        apocalypse_swarm: function(creep) {
            const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
            if (enemies.length > 0) {
                // Attack weakest enemy first
                const weakestEnemy = enemies.sort((a, b) => a.hits - b.hits)[0];
                if (creep.attack(weakestEnemy) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(weakestEnemy, {visualizePathStyle: {stroke: '#ff8888'}});
                }
            } else {
                // Attack any structure
                const structures = creep.room.find(FIND_HOSTILE_STRUCTURES);
                if (structures.length > 0) {
                    if (creep.attack(structures[0]) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(structures[0]);
                    }
                }
            }
        }
    },

    // Apocalypse threat assessment
    assessApocalypseThreat: function() {
        const room = Game.rooms.W1N3;
        if (!room) return 0;
        
        const hostiles = room.find(FIND_HOSTILE_CREEPS);
        const hostileStructures = room.find(FIND_HOSTILE_STRUCTURES);
        
        let threatLevel = 0;
        
        // Calculate threat from creeps
        hostiles.forEach(creep => {
            threatLevel += creep.getActiveBodyparts(ATTACK) * 50;
            threatLevel += creep.getActiveBodyparts(RANGED_ATTACK) * 40;
            threatLevel += creep.getActiveBodyparts(HEAL) * 60;
            threatLevel += creep.getActiveBodyparts(TOUGH) * 25;
            threatLevel += creep.hits / 20;
        });
        
        // Calculate threat from structures
        hostileStructures.forEach(structure => {
            if (structure.structureType === STRUCTURE_TOWER) threatLevel += 150;
            if (structure.structureType === STRUCTURE_SPAWN) threatLevel += 300;
            if (structure.structureType === STRUCTURE_EXTENSION) threatLevel += 20;
        });
        
        // Update annihilation state
        this.annihilationState.threatLevel = Math.min(5, Math.floor(threatLevel / 100));
        
        // Update war phase based on threat and time
        if (this.annihilationState.threatLevel >= 4) {
            this.annihilationState.warPhase = 'APOCALYPSE';
        } else if (this.annihilationState.threatLevel >= 2) {
            this.annihilationState.warPhase = 'REVELATION';
        } else if (Game.time > 5000) {
            this.annihilationState.warPhase = 'EXTINCTION';
        }
        
        return this.annihilationState.threatLevel;
    },

    // Resource annihilation
    resourceAnnihilation: {
        // Starve enemies by denying resources
        denyEnemyResources: function(room) {
            const sources = room.find(FIND_SOURCES);
            
            sources.forEach(source => {
                // Build walls around sources to deny access
                const protectionPositions = [
                    {x: source.pos.x-1, y: source.pos.y-1}, {x: source.pos.x, y: source.pos.y-1}, {x: source.pos.x+1, y: source.pos.y-1},
                    {x: source.pos.x-1, y: source.pos.y}, {x: source.pos.x+1, y: source.pos.y},
                    {x: source.pos.x-1, y: source.pos.y+1}, {x: source.pos.x, y: source.pos.y+1}, {x: source.pos.x+1, y: source.pos.y+1}
                ];
                
                protectionPositions.forEach(pos => {
                    const structures = room.lookForAt(LOOK_STRUCTURES, pos.x, pos.y);
                    const hasWall = structures.some(s => 
                        s.structureType === STRUCTURE_RAMPART || s.structureType === STRUCTURE_WALL
                    );
                    
                    if (!hasWall && room.createConstructionSite(pos.x, pos.y, STRUCTURE_RAMPART) === OK) {
                        console.log(`🔒 RESOURCE DENIAL: Sealing source at ${pos.x},${pos.y}`);
                    }
                });
            });
        },
        
        // Rapid expansion for resource dominance
        expandResourceControl: function(room) {
            if (room.energyAvailable > room.energyCapacityAvailable * 0.9) {
                // Build extensions rapidly
                const extensionCount = room.find(FIND_MY_STRUCTURES, {
                    filter: { structureType: STRUCTURE_EXTENSION }
                }).length;
                
                if (extensionCount < 50) {
                    const positions = [];
                    for (let x = 10; x <= 40; x++) {
                        for (let y = 10; y <= 40; y++) {
                            if (Math.abs(x - 25) + Math.abs(y - 25) > 5) {
                                positions.push({x, y});
                            }
                        }
                    }
                    
                    positions.slice(0, 5).forEach(pos => {
                        if (room.createConstructionSite(pos.x, pos.y, STRUCTURE_EXTENSION) === OK) {
                            console.log(`⚡ RAPID EXPANSION: Extension at ${pos.x},${pos.y}`);
                        }
                    });
                }
            }
        }
    },

    // Main apocalypse loop
    apocalypseLoop: function() {
        // Update doomsday clock
        this.annihilationState.doomsdayClock = Game.time;
        
        // Assess apocalypse threat
        const threatLevel = this.assessApocalypseThreat();
        
        // Execute doomsday defense
        const room = Game.rooms.W1N3;
        if (room) {
            // Build doomsday fortress based on threat
            if (threatLevel >= 3) {
                this.doomsdayDefense.buildDoomsdayFortress(room);
            }
            
            if (threatLevel >= 2) {
                this.doomsdayDefense.buildDoomsdayTowers(room);
            }
            
            // Activate doomsday towers
            const enemiesAnnihilated = this.doomsdayDefense.activateDoomsdayTowers(room);
            this.annihilationState.totalEnemiesEliminated += enemiesAnnihilated;
            
            // Resource annihilation
            if (threatLevel >= 1) {
                this.resourceAnnihilation.denyEnemyResources(room);
                this.resourceAnnihilation.expandResourceControl(room);
            }
        }
        
        // Maintain apocalypse army
        this.apocalypseSpawner.maintainApocalypseArmy();
        
        // Coordinate nuclear strikes
        this.exterminationCoordination.manageStrikes();
        this.exterminationCoordination.coordinateMassStrikes();
        
        // Launch preventive strikes
        if (Game.time % 100 === 0 && threatLevel < 3) {
            const weakTarget = this.nuclearCodes.findFirstStrikeTarget();
            if (weakTarget) {
                this.nuclearCodes.launchNuclearStrike(weakTarget.room, 'blitz');
            }
        }
        
        // Handle apocalypse unit behaviors
        for (let name in Game.creeps) {
            const creep = Game.creeps[name];
            if (creep.memory.role && this.apocalypseBehaviors[creep.memory.role]) {
                this.apocalypseBehaviors[creep.memory.role](creep);
            }
        }
        
        // Apocalypse status logging
        if (Game.time % 3 === 0) {
            const threatNames = ['NONE', 'MINIMAL', 'MODERATE', 'SEVERE', 'CRITICAL', 'APOCALYPTIC'];
            console.log(`💀 APOCALYPSE STATUS: ${threatNames[threatLevel]} | Phase: ${this.annihilationState.warPhase} | Enemies Killed: ${this.annihilationState.totalEnemiesEliminated} | Rooms Scorched: ${this.annihilationState.roomsScorched}`);
        }
        
        // Doomsday countdown
        if (this.annihilationState.warPhase === 'EXTINCTION' && Game.time % 50 === 0) {
            console.log(`⏰ DOOMSDAY COUNTDOWN: Total enemy extinction imminent!`);
        }
    }
};

// Export the apocalypse
module.exports.loop = function() {
    // Clear memory of the fallen
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
    
    // Initiate apocalypse
    APOCALYPSE.apocalypseLoop();
};