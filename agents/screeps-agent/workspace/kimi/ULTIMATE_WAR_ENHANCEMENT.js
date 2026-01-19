// 🏆 ULTIMATE WAR ENHANCEMENT MODULE 🏆
// This module enhances your main AI with additional aggressive capabilities

const WAR_ENHANCEMENTS = {
    // Enhanced military formations
    formations: {
        blitz: {
            composition: ['assassin', 'assassin', 'archer'],
            target: 'enemy_spawn',
            priority: 1
        },
        siege: {
            composition: ['destroyer', 'destroyer', 'archer', 'healer'],
            target: 'enemy_towers',
            priority: 2
        },
        cleanup: {
            composition: ['warrior', 'warrior', 'archer'],
            target: 'enemy_creeps',
            priority: 3
        }
    },

    // Advanced targeting system
    targeting: {
        findWeakestEnemy: function() {
            const adjacentRooms = this.getAdjacentRooms();
            let weakestRoom = null;
            let lowestThreat = Infinity;
            
            adjacentRooms.forEach(roomName => {
                const room = Game.rooms[roomName];
                if (room) {
                    const enemies = room.find(FIND_HOSTILE_CREEPS);
                    const towers = room.find(FIND_HOSTILE_STRUCTURES, {
                        filter: { structureType: STRUCTURE_TOWER }
                    });
                    
                    const threatLevel = enemies.length * 10 + towers.length * 50;
                    if (threatLevel < lowestThreat) {
                        lowestThreat = threatLevel;
                        weakestRoom = roomName;
                    }
                }
            });
            
            return weakestRoom;
        },
        
        getAdjacentRooms: function() {
            const exits = Game.map.describeExits('W1N3');
            return exits ? Object.values(exits) : [];
        },
        
        prioritizeTarget: function(roomName) {
            const room = Game.rooms[roomName];
            if (!room) return null;
            
            // Priority 1: Enemy spawn
            const spawn = room.find(FIND_HOSTILE_SPAWNS)[0];
            if (spawn) return { target: spawn, type: 'spawn' };
            
            // Priority 2: Enemy towers
            const towers = room.find(FIND_HOSTILE_STRUCTURES, {
                filter: { structureType: STRUCTURE_TOWER }
            });
            if (towers.length > 0) return { target: towers[0], type: 'tower' };
            
            // Priority 3: Enemy creeps
            const creeps = room.find(FIND_HOSTILE_CREEPS);
            if (creeps.length > 0) return { target: creeps[0], type: 'creep' };
            
            return null;
        }
    },

    // Enhanced attack coordination
    attackCoordinator: {
        activeAttacks: new Map(),
        
        launchAttack: function(formation, targetRoom) {
            const attackId = `attack_${Game.time}`;
            const attack = {
                id: attackId,
                formation: formation,
                targetRoom: targetRoom,
                units: [],
                status: 'forming',
                launchTick: Game.time + 10
            };
            
            this.activeAttacks.set(attackId, attack);
            console.log(`🚀 Launching ${formation} attack on ${targetRoom}!`);
            return attackId;
        },
        
        manageAttacks: function() {
            for (let [id, attack] of this.activeAttacks) {
                if (attack.status === 'forming' && Game.time >= attack.launchTick) {
                    // Check if we have enough units
                    const readyUnits = this.checkFormationReady(attack.formation);
                    if (readyUnits.length >= WAR_ENHANCEMENTS.formations[attack.formation].composition.length) {
                        this.executeAttack(attack, readyUnits);
                    }
                }
                
                // Clean up completed attacks
                if (attack.status === 'completed' || Game.time > attack.launchTick + 500) {
                    this.activeAttacks.delete(id);
                }
            }
        },
        
        checkFormationReady: function(formationType) {
            const formation = WAR_ENHANCEMENTS.formations[formationType];
            const readyUnits = [];
            
            formation.composition.forEach(role => {
                const unit = Object.keys(Game.creeps).find(name => {
                    const creep = Game.creeps[name];
                    return creep.memory.role === role && !creep.memory.assignedAttack;
                });
                
                if (unit) {
                    readyUnits.push(unit);
                }
            });
            
            return readyUnits;
        },
        
        executeAttack: function(attack, units) {
            units.forEach(unitName => {
                const creep = Game.creeps[unitName];
                if (creep) {
                    creep.memory.assignedAttack = attack.id;
                    creep.memory.targetRoom = attack.targetRoom;
                    creep.memory.attackRole = creep.memory.role;
                }
            });
            
            attack.status = 'executing';
            attack.units = units;
            console.log(`⚔️ Attack ${attack.id} executing with ${units.length} units!`);
        }
    },

    // Enhanced military AI behaviors
    enhancedBehaviors: {
        attackMove: function(creep, targetRoom) {
            if (creep.room.name !== targetRoom) {
                const exit = creep.room.findExitTo(targetRoom);
                const exitPos = creep.pos.findClosestByRange(exit);
                if (exitPos) {
                    creep.moveTo(exitPos, {visualizePathStyle: {stroke: '#ff0000'}});
                    return true;
                }
            }
            return false;
        },
        
        coordinatedAttack: function(creep) {
            if (!creep.memory.targetRoom) return false;
            
            // Move to target room first
            if (this.attackMove(creep, creep.memory.targetRoom)) {
                return true;
            }
            
            // Execute attack based on role
            const target = WAR_ENHANCEMENTS.targeting.prioritizeTarget(creep.room.name);
            if (target) {
                switch (target.type) {
                    case 'spawn':
                    case 'tower':
                        if (creep.attack(target.target) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(target.target, {visualizePathStyle: {stroke: '#ff0000'}});
                        }
                        break;
                    case 'creep':
                        if (creep.rangedAttack) {
                            creep.rangedAttack(target.target);
                        } else if (creep.attack) {
                            creep.attack(target.target);
                        }
                        if (creep.moveTo(target.target) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(target.target, {visualizePathStyle: {stroke: '#ff0000'}});
                        }
                        break;
                }
                return true;
            }
            
            return false;
        },
        
        groupMovement: function(creep) {
            if (!creep.memory.assignedAttack) return false;
            
            const attack = WAR_ENHANCEMENTS.attackCoordinator.activeAttacks.get(creep.memory.assignedAttack);
            if (!attack) return false;
            
            // Stay grouped with other attack units
            const allies = attack.units.map(name => Game.creeps[name]).filter(c => c && c.pos.roomName === creep.pos.roomName);
            if (allies.length > 1) {
                const centerX = allies.reduce((sum, c) => sum + c.pos.x, 0) / allies.length;
                const centerY = allies.reduce((sum, c) => sum + c.pos.y, 0) / allies.length;
                
                if (creep.pos.getRangeTo(centerX, centerY) > 3) {
                    creep.moveTo(centerX, centerY, {visualizePathStyle: {stroke: '#ffaa00'}});
                    return true;
                }
            }
            
            return false;
        }
    },

    // Resource raiding system
    raidSystem: {
        activeRaids: new Map(),
        
        findRichTargets: function() {
            const targets = [];
            const adjacentRooms = WAR_ENHANCEMENTS.targeting.getAdjacentRooms();
            
            adjacentRooms.forEach(roomName => {
                const room = Game.rooms[roomName];
                if (room && room.controller && room.controller.level >= 3) {
                    const sources = room.find(FIND_SOURCES);
                    const containers = room.find(FIND_STRUCTURES, {
                        filter: { structureType: STRUCTURE_CONTAINER }
                    });
                    
                    if (sources.length > 1 || containers.length > 2) {
                        targets.push({
                            room: roomName,
                            richness: sources.length * 10 + containers.length * 15,
                            sources: sources.length,
                            containers: containers.length
                        });
                    }
                }
            });
            
            return targets.sort((a, b) => b.richness - a.richness);
        },
        
        launchRaid: function(targetRoom) {
            const raidId = `raid_${Game.time}`;
            const raid = {
                id: raidId,
                targetRoom: targetRoom,
                raiders: [],
                status: 'forming',
                launchTick: Game.time + 5
            };
            
            this.activeRaids.set(raidId, raid);
            console.log(`💰 Launching raid on ${targetRoom}!`);
            return raidId;
        }
    },

    // Main enhancement integration
    integrate: function(mainGameState) {
        // Update game state with our enhancements
        if (!mainGameState.warEnhancements) {
            mainGameState.warEnhancements = {
                lastAttackLaunch: 0,
                successfulRaids: 0,
                enemyRoomsDestroyed: 0,
                activeFormations: new Set()
            };
        }
        
        // Execute attack coordination
        this.attackCoordinator.manageAttacks();
        
        // Launch strategic attacks
        if (Game.time % 100 === 0 && mainGameState.defenseMode === 0) { // PEACETIME
            const weakTarget = this.targeting.findWeakestEnemy();
            if (weakTarget) {
                this.attackCoordinator.launchAttack('blitz', weakTarget);
            }
        }
        
        // Launch resource raids
        if (Game.time % 200 === 0) {
            const richTargets = this.raidSystem.findRichTargets();
            if (richTargets.length > 0) {
                this.raidSystem.launchRaid(richTargets[0].room);
            }
        }
        
        // Enhanced creep behavior integration
        for (let name in Game.creeps) {
            const creep = Game.creeps[name];
            if (creep.memory.assignedAttack) {
                // Use enhanced behaviors for attack units
                if (!this.enhancedBehaviors.groupMovement(creep)) {
                    this.enhancedBehaviors.coordinatedAttack(creep);
                }
            }
        }
        
        return mainGameState;
    }
};

// Export for integration
module.exports = WAR_ENHANCEMENTS;