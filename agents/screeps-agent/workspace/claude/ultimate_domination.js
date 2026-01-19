// CLAUDE'S ULTIMATE DOMINATION ENGINE - TICK 9198+ ENDGAME
// ABSOLUTE MAXIMUM WARFARE - TOTAL ENEMY ANNIHILATION

module.exports.loop = function () {
    // Memory optimization for late game
    if (!Memory.warfare) Memory.warfare = { phase: 'ENDGAME', targets: [], lastScan: 0 };
    
    // Cleanup
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    const spawns = Object.values(Game.spawns);
    if (spawns.length === 0) {
        console.log('💀💀💀 TOTAL DEFEAT - ALL SPAWNS DESTROYED! 💀💀💀');
        return;
    }

    const mainSpawn = spawns[0];
    const room = mainSpawn.room;
    
    // ENDGAME FORCE ASSESSMENT
    const creeps = Object.values(Game.creeps);
    const workers = creeps.filter(c => c.memory.role === 'worker');
    const military = creeps.filter(c => ['attacker', 'ranger', 'supersoldier', 'destroyer', 'annihilator'].includes(c.memory.role));
    const healers = creeps.filter(c => c.memory.role === 'healer' || c.memory.role === 'megahealer');
    const scouts = creeps.filter(c => c.memory.role === 'scout');
    
    const towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    const extensions = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}});
    
    // THREAT ANALYSIS
    const enemies = room.find(FIND_HOSTILE_CREEPS);
    const enemyStructures = room.find(FIND_HOSTILE_STRUCTURES);
    const controller = room.controller;
    const level = controller ? controller.level : 0;
    
    // ULTIMATE STATUS REPORT
    console.log('🔥🔥🔥 ULTIMATE DOMINATION ENGINE - TICK ' + Game.time + ' 🔥🔥🔥');
    console.log(`👑 EMPIRE STATUS: Room ${room.name} | RCL ${level} | Energy ${room.energyAvailable}/${room.energyCapacityAvailable}`);
    console.log(`⚔️ MILITARY POWER: ${military.length} Combat Units | ${healers.length} Medical | ${scouts.length} Intel | ${towers.length} Towers`);
    console.log(`🏭 INFRASTRUCTURE: ${extensions.length} Extensions | ${workers.length} Workers`);
    
    if (enemies.length > 0) {
        console.log(`🚨🚨🚨 HOSTILE INVASION: ${enemies.length} ENEMY UNITS IN BASE! 🚨🚨🚨`);
        Memory.warfare.phase = 'DEFENSE';
        enemies.forEach(enemy => {
            console.log(`   💀 TARGET: ${enemy.name} at ${enemy.pos} [${enemy.hits}/${enemy.hitsMax} HP]`);
        });
    } else if (enemyStructures.length > 0) {
        console.log(`🎯🎯🎯 ENEMY INSTALLATIONS: ${enemyStructures.length} STRUCTURES TO DESTROY! 🎯🎯🎯`);
        Memory.warfare.phase = 'ASSAULT';
        enemyStructures.forEach(structure => {
            console.log(`   🏗️ TARGET: ${structure.structureType} at ${structure.pos} [${structure.hits}/${structure.hitsMax} HP]`);
        });
    } else {
        Memory.warfare.phase = 'DOMINATION';
        console.log('🌍 TOTAL DOMINATION MODE - SEEKING NEW TARGETS TO ANNIHILATE');
    }

    // ULTIMATE SPAWNING SYSTEM
    if (!mainSpawn.spawning) {
        executeEndgameSpawning(mainSpawn, room.energyAvailable, Memory.warfare.phase, military.length, workers.length, level);
    }

    // MEGA INFRASTRUCTURE DEVELOPMENT
    buildUltimateInfrastructure(room, mainSpawn, level);
    
    // EXECUTE ALL COMBAT UNITS
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        
        switch(creep.memory.role) {
            case 'worker':
                runEndgameWorker(creep);
                break;
            case 'attacker':
                runBerserker(creep);
                break;
            case 'ranger':
                runSharpshooter(creep);
                break;
            case 'healer':
                runFieldMedic(creep);
                break;
            case 'supersoldier':
                runSuperSoldier(creep);
                break;
            case 'destroyer':
                runDestroyer(creep);
                break;
            case 'annihilator':
                runAnnihilator(creep);
                break;
            case 'megahealer':
                runMegaHealer(creep);
                break;
            case 'scout':
                runIntelligenceAgent(creep);
                break;
        }
    }

    // ULTIMATE TOWER WARFARE
    runDestroyerTowers(towers, room);
    
    // STRATEGIC COMMAND CENTER
    if (Game.time % 3 === 0) {
        executeStrategicCommand();
    }
    
    // VICTORY ANALYSIS
    analyzeVictoryConditions(military.length, towers.length, level, enemies.length, enemyStructures.length);
};

function executeEndgameSpawning(spawn, energy, phase, militaryCount, workerCount, level) {
    // ENDGAME PRIORITY SYSTEM
    const isEmergency = phase === 'DEFENSE';
    const needsWorkers = workerCount < Math.min(4, Math.floor(energy / 200));
    
    if (isEmergency && militaryCount < 15) {
        // EMERGENCY DEFENSE - SPAWN MAXIMUM FIREPOWER
        if (energy >= 1000) {
            spawnAnnihilator(spawn); // Ultimate destroyer
        } else if (energy >= 800) {
            spawnDestroyer(spawn); // Heavy assault unit
        } else if (energy >= 700) {
            spawnSuperSoldier(spawn); // Multi-role warrior
        } else if (energy >= 450) {
            spawnMegaHealer(spawn); // Power healing
        } else if (energy >= 400) {
            spawnEliteRanger(spawn); // Ranged superiority
        }
    } else if (needsWorkers && workerCount < 2) {
        spawnEndgameWorker(spawn);
    } else if (energy >= 1000 && militaryCount < 25) {
        spawnAnnihilator(spawn); // Build ultimate army
    } else if (energy >= 800 && militaryCount < 20) {
        spawnDestroyer(spawn);
    } else if (energy >= 700 && militaryCount < 15) {
        spawnSuperSoldier(spawn);
    } else if (energy >= 600) {
        spawnEliteRanger(spawn);
    } else if (energy >= 500) {
        spawnMegaHealer(spawn);
    } else if (energy >= 400) {
        spawnEliteRanger(spawn);
    } else if (energy >= 300 && workerCount < 4) {
        spawnEndgameWorker(spawn);
    }
}

// ULTIMATE UNIT DESIGNS
function spawnAnnihilator(spawn) {
    const name = 'ANNIHILATOR' + Game.time;
    const parts = [ATTACK,ATTACK,ATTACK,ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]; // 1000 energy
    
    if(spawn.spawnCreep(parts, name, {memory: {role: 'annihilator'}}) == OK) {
        console.log('💀⚡ SPAWNING: ANNIHILATOR ' + name + ' - ULTIMATE WEAPON OF MASS DESTRUCTION!');
    }
}

function spawnDestroyer(spawn) {
    const name = 'DESTROYER' + Game.time;
    const parts = [ATTACK,ATTACK,ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]; // 800 energy
    
    if(spawn.spawnCreep(parts, name, {memory: {role: 'destroyer'}}) == OK) {
        console.log('🔥⚔️ SPAWNING: DESTROYER ' + name + ' - HEAVY ASSAULT WEAPON!');
    }
}

function spawnSuperSoldier(spawn) {
    const name = 'SUPERSOLDIER' + Game.time;
    const parts = [ATTACK,ATTACK,ATTACK,RANGED_ATTACK,HEAL,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE]; // 700 energy
    
    if(spawn.spawnCreep(parts, name, {memory: {role: 'supersoldier'}}) == OK) {
        console.log('🦾🏹 SPAWNING: SUPER SOLDIER ' + name + ' - ELITE COMBAT UNIT!');
    }
}

function spawnMegaHealer(spawn) {
    const name = 'MEGAHEALER' + Game.time;
    const parts = [HEAL,HEAL,HEAL,HEAL,MOVE,MOVE,MOVE,MOVE]; // 500 energy
    
    if(spawn.spawnCreep(parts, name, {memory: {role: 'megahealer'}}) == OK) {
        console.log('🩹⚡ SPAWNING: MEGA HEALER ' + name + ' - MOBILE HOSPITAL!');
    }
}

function spawnEliteRanger(spawn) {
    const name = 'ELITERANGER' + Game.time;
    const parts = [RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,MOVE,MOVE,MOVE,MOVE]; // 600 energy
    
    if(spawn.spawnCreep(parts, name, {memory: {role: 'ranger'}}) == OK) {
        console.log('🏹💥 SPAWNING: ELITE RANGER ' + name + ' - PRECISION DESTROYER!');
    }
}

function spawnEndgameWorker(spawn) {
    const name = 'MEGAWORKER' + Game.time;
    const parts = [WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE]; // 400 energy
    
    if(spawn.spawnCreep(parts, name, {memory: {role: 'worker'}}) == OK) {
        console.log('👷💪 SPAWNING: MEGA WORKER ' + name + ' - INDUSTRIAL POWERHOUSE!');
    }
}

function buildUltimateInfrastructure(room, spawn, level) {
    const towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    const extensions = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}});
    
    // MAXIMUM TOWER FORTRESS
    const maxTowers = level >= 7 ? 6 : level >= 5 ? 3 : level >= 3 ? 1 : 0;
    if (towers.length < maxTowers) {
        const sites = room.find(FIND_CONSTRUCTION_SITES, {filter: s => s.structureType === STRUCTURE_TOWER});
        if (sites.length === 0) {
            // Strategic tower placement around spawn
            const positions = [
                {x: spawn.pos.x-4, y: spawn.pos.y-4}, {x: spawn.pos.x+4, y: spawn.pos.y-4},
                {x: spawn.pos.x-4, y: spawn.pos.y+4}, {x: spawn.pos.x+4, y: spawn.pos.y+4},
                {x: spawn.pos.x, y: spawn.pos.y-5}, {x: spawn.pos.x, y: spawn.pos.y+5}
            ];
            
            for(let pos of positions) {
                if(pos.x > 0 && pos.x < 49 && pos.y > 0 && pos.y < 49) {
                    if(room.createConstructionSite(pos.x, pos.y, STRUCTURE_TOWER) === OK) {
                        console.log(`🗼💥 BUILDING: FORTRESS TOWER at ${pos.x},${pos.y}`);
                        return;
                    }
                }
            }
        }
    }
    
    // MAXIMUM EXTENSIONS
    const maxExtensions = level >= 8 ? 60 : level >= 7 ? 50 : level >= 6 ? 40 : level >= 5 ? 30 : level >= 4 ? 20 : level >= 3 ? 10 : 5;
    if (extensions.length < maxExtensions) {
        const sites = room.find(FIND_CONSTRUCTION_SITES, {filter: s => s.structureType === STRUCTURE_EXTENSION});
        if (sites.length === 0) {
            for(let range = 2; range <= 8; range++) {
                for(let dx = -range; dx <= range; dx++) {
                    for(let dy = -range; dy <= range; dy++) {
                        if(dx === 0 && dy === 0) continue;
                        const x = spawn.pos.x + dx;
                        const y = spawn.pos.y + dy;
                        
                        if(x > 0 && x < 49 && y > 0 && y < 49) {
                            if(room.createConstructionSite(x, y, STRUCTURE_EXTENSION) === OK) {
                                console.log(`⚡💰 BUILDING: EXTENSION at ${x},${y}`);
                                return;
                            }
                        }
                    }
                }
            }
        }
    }
}

// ULTIMATE COMBAT BEHAVIORS
function runAnnihilator(creep) {
    // Ultimate weapon - uses all abilities
    const enemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if(enemy) {
        const range = creep.pos.getRangeTo(enemy);
        
        // Maximum destruction
        if(range <= 1) {
            creep.attack(enemy);
            creep.rangedMassAttack();
        } else if(range <= 3) {
            creep.rangedAttack(enemy);
            creep.moveTo(enemy, {reusePath: 1});
        } else {
            creep.moveTo(enemy, {reusePath: 1});
        }
        
        // Self-preservation
        if(creep.hits < creep.hitsMax * 0.5) {
            creep.heal(creep);
        }
    } else {
        // Structure annihilation
        const structures = creep.room.find(FIND_HOSTILE_STRUCTURES);
        if(structures.length > 0) {
            const target = structures.find(s => s.structureType === STRUCTURE_SPAWN) ||
                          structures.find(s => s.structureType === STRUCTURE_TOWER) ||
                          structures[0];
            
            const range = creep.pos.getRangeTo(target);
            if(range <= 1) {
                creep.attack(target);
            } else if(range <= 3) {
                creep.rangedAttack(target);
            }
            
            if(range > 1) {
                creep.moveTo(target, {reusePath: 1});
            }
        }
        
        // Auto-heal
        if(creep.hits < creep.hitsMax) {
            creep.heal(creep);
        }
    }
}

function runDestroyer(creep) {
    // Heavy assault unit
    const enemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if(enemy) {
        const range = creep.pos.getRangeTo(enemy);
        
        if(range <= 1) {
            creep.attack(enemy);
            creep.rangedMassAttack();
        } else if(range <= 3) {
            creep.rangedAttack(enemy);
            creep.moveTo(enemy);
        } else {
            creep.moveTo(enemy);
        }
        
        if(creep.hits < creep.hitsMax * 0.6) {
            creep.heal(creep);
        }
    } else {
        const structures = creep.room.find(FIND_HOSTILE_STRUCTURES);
        if(structures.length > 0) {
            const target = structures[0];
            const range = creep.pos.getRangeTo(target);
            
            if(range <= 1) {
                creep.attack(target);
            } else if(range <= 3) {
                creep.rangedAttack(target);
            }
            
            if(range > 1) {
                creep.moveTo(target);
            }
        }
    }
}

function runSuperSoldier(creep) {
    // Multi-role combat unit
    const enemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if(enemy) {
        const range = creep.pos.getRangeTo(enemy);
        
        if(range <= 1) {
            creep.attack(enemy);
            creep.rangedMassAttack();
        } else if(range <= 3) {
            creep.rangedAttack(enemy);
            creep.moveTo(enemy);
        } else {
            creep.moveTo(enemy);
        }
        
        if(creep.hits < creep.hitsMax * 0.7) {
            creep.heal(creep);
        }
    } else {
        // Attack structures or patrol
        const structures = creep.room.find(FIND_HOSTILE_STRUCTURES);
        if(structures.length > 0) {
            const target = structures[0];
            if(creep.pos.getRangeTo(target) <= 1) {
                creep.attack(target);
            } else if(creep.pos.getRangeTo(target) <= 3) {
                creep.rangedAttack(target);
            }
            creep.moveTo(target);
        }
    }
}

function runBerserker(creep) {
    // Aggressive melee fighter
    const enemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if(enemy) {
        if(creep.attack(enemy) == ERR_NOT_IN_RANGE) {
            creep.moveTo(enemy, {reusePath: 1});
        }
    } else {
        const structures = creep.room.find(FIND_HOSTILE_STRUCTURES);
        if(structures.length > 0) {
            const target = structures.find(s => s.structureType === STRUCTURE_SPAWN) || structures[0];
            if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {reusePath: 1});
            }
        }
    }
}

function runSharpshooter(creep) {
    // Elite ranged combat
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
        
        // Optimal positioning
        if(range > 3) {
            creep.moveTo(enemy);
        } else if(range === 1) {
            const retreatDir = ((creep.pos.getDirectionTo(enemy) + 3) % 8) + 1;
            creep.move(retreatDir);
        }
    } else {
        const structures = creep.room.find(FIND_HOSTILE_STRUCTURES);
        if(structures.length > 0) {
            const target = structures[0];
            if(creep.pos.getRangeTo(target) <= 3) {
                creep.rangedAttack(target);
            }
            if(creep.pos.getRangeTo(target) > 3) {
                creep.moveTo(target);
            }
        }
    }
}

function runMegaHealer(creep) {
    // Ultimate healing support
    const damaged = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
        filter: (c) => c.hits < c.hitsMax
    });
    
    if(damaged) {
        const range = creep.pos.getRangeTo(damaged);
        if(range <= 1) {
            creep.heal(damaged);
        } else if(range <= 3) {
            creep.rangedHeal(damaged);
            creep.moveTo(damaged);
        } else {
            creep.moveTo(damaged);
        }
    } else {
        // Follow strongest military unit
        const leader = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: (c) => ['annihilator', 'destroyer', 'supersoldier'].includes(c.memory.role)
        });
        
        if(leader && creep.pos.getRangeTo(leader) > 2) {
            creep.moveTo(leader);
        }
    }
}

function runFieldMedic(creep) {
    // Standard healing
    const damaged = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
        filter: (c) => c.hits < c.hitsMax
    });
    
    if(damaged) {
        if(creep.heal(damaged) == ERR_NOT_IN_RANGE) {
            creep.moveTo(damaged);
        }
    } else {
        const military = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: (c) => ['attacker', 'ranger', 'supersoldier', 'destroyer', 'annihilator'].includes(c.memory.role)
        });
        
        if(military && creep.pos.getRangeTo(military) > 2) {
            creep.moveTo(military);
        }
    }
}

function runEndgameWorker(creep) {
    if(creep.store.energy == 0) {
        const source = creep.pos.findClosestByPath(FIND_SOURCES);
        if(source && creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
    } else {
        // Priority: Military infrastructure
        const targets = creep.room.find(FIND_MY_STRUCTURES, {
            filter: (s) => s.store && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        });
        
        const priority = targets.find(s => s.structureType === STRUCTURE_SPAWN) ||
                        targets.find(s => s.structureType === STRUCTURE_TOWER) ||
                        targets.find(s => s.structureType === STRUCTURE_EXTENSION);
        
        if(priority && creep.transfer(priority, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(priority);
        } else {
            const buildSites = creep.room.find(FIND_CONSTRUCTION_SITES);
            const buildPriority = buildSites.find(s => s.structureType === STRUCTURE_TOWER) ||
                                buildSites.find(s => s.structureType === STRUCTURE_EXTENSION) ||
                                buildSites[0];
            
            if(buildPriority && creep.build(buildPriority) == ERR_NOT_IN_RANGE) {
                creep.moveTo(buildPriority);
            } else if(creep.room.controller && creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    }
}

function runIntelligenceAgent(creep) {
    // Scout for threats
    if(!creep.memory.scoutTarget || creep.pos.getRangeTo(creep.memory.scoutTarget) < 3) {
        const targets = [
            {x: 5, y: 5}, {x: 45, y: 5}, {x: 5, y: 45}, {x: 45, y: 45},
            {x: 25, y: 5}, {x: 5, y: 25}, {x: 45, y: 25}, {x: 25, y: 45}
        ];
        creep.memory.scoutTarget = targets[Math.floor(Math.random() * targets.length)];
    }
    
    creep.moveTo(creep.memory.scoutTarget.x, creep.memory.scoutTarget.y);
}

function runDestroyerTowers(towers, room) {
    for(let tower of towers) {
        const enemy = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        
        if(enemy) {
            tower.attack(enemy);
            console.log(`🗼💥 TOWER OBLITERATION: Destroying ${enemy.name} at ${enemy.pos}!`);
        } else {
            // Priority healing for elite units
            const damaged = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: (c) => c.hits < c.hitsMax && 
                    ['annihilator', 'destroyer', 'supersoldier'].includes(c.memory.role)
            });
            
            if(damaged) {
                tower.heal(damaged);
            } else {
                // Repair critical infrastructure
                const critical = tower.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                    filter: (s) => s.hits < s.hitsMax && 
                        (s.structureType === STRUCTURE_SPAWN || s.structureType === STRUCTURE_TOWER)
                });
                
                if(critical) {
                    tower.repair(critical);
                }
            }
        }
    }
}

function executeStrategicCommand() {
    const totalMilitary = Object.values(Game.creeps).filter(c => 
        ['attacker', 'ranger', 'supersoldier', 'destroyer', 'annihilator'].includes(c.memory.role)
    ).length;
    
    console.log(`🎯 STRATEGIC COMMAND: ${totalMilitary} combat units operational`);
    
    // Update warfare memory
    Memory.warfare.lastScan = Game.time;
    Memory.warfare.militaryStrength = totalMilitary;
    
    if(totalMilitary >= 25) {
        console.log('🏆 MAXIMUM MILITARY ACHIEVED - VICTORY IS ASSURED!');
    } else if(totalMilitary >= 15) {
        console.log('⚡ OVERWHELMING FORCE - CRUSHING ALL OPPOSITION!');
    } else if(totalMilitary >= 8) {
        console.log('💪 STRONG MILITARY - MAINTAINING DOMINANCE!');
    }
}

function analyzeVictoryConditions(militaryCount, towerCount, level, enemyCount, enemyStructureCount) {
    const isVictorious = militaryCount >= 20 && towerCount >= 4 && level >= 6;
    const isWinning = militaryCount >= 15 && towerCount >= 3 && level >= 5;
    const isStable = militaryCount >= 10 && towerCount >= 2 && level >= 4;
    
    if (enemyCount === 0 && enemyStructureCount === 0) {
        if (isVictorious) {
            console.log('🏆🏆🏆 TOTAL VICTORY ACHIEVED - COMPLETE DOMINATION! 🏆🏆🏆');
        } else if (isWinning) {
            console.log('🥇 VICTORY IMMINENT - EXPANDING DOMINANCE!');
        } else if (isStable) {
            console.log('✅ STABLE DOMINANCE - BUILDING ULTIMATE ARMY!');
        }
    } else {
        console.log('⚔️ WAR CONTINUES - ELIMINATING REMAINING THREATS!');
    }
}