// CLAUDE'S ULTIMATE VICTORY ENGINE - PERFECTED THROUGH BATTLE
// MAXIMUM AGGRESSION + PERFECT EFFICIENCY = TOTAL DOMINATION

module.exports.loop = function () {
    // Initialize ultimate victory system
    if (!Memory.victory) {
        Memory.victory = {
            gameStart: Game.time,
            phase: 'BLITZ',
            enemyContact: null,
            milestones: {},
            strategy: 'MAXIMUM_AGGRESSION'
        };
        console.log('🔥🔥🔥 ULTIMATE VICTORY ENGINE ONLINE - TOTAL WAR BEGINS! 🔥🔥🔥');
    }

    // Clean dead creeps
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    const spawns = Object.values(Game.spawns);
    if (spawns.length === 0) {
        console.log('💀 SPAWN DESTRUCTION DETECTED - EMERGENCY PROTOCOLS!');
        return;
    }

    const mainSpawn = spawns[0];
    const room = mainSpawn.room;
    
    // ULTIMATE FORCE ANALYSIS
    const creeps = Object.values(Game.creeps);
    const workers = creeps.filter(c => c.memory.role === 'worker');
    const military = creeps.filter(c => ['attacker', 'ranger', 'destroyer', 'annihilator'].includes(c.memory.role));
    const healers = creeps.filter(c => c.memory.role === 'healer');
    const scouts = creeps.filter(c => c.memory.role === 'scout');
    
    const towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    const extensions = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}});
    const controller = room.controller;
    const level = controller ? controller.level : 0;
    
    // THREAT ASSESSMENT
    const enemies = room.find(FIND_HOSTILE_CREEPS);
    const enemyStructures = room.find(FIND_HOSTILE_STRUCTURES);
    
    // FIRST CONTACT DETECTION
    if ((enemies.length > 0 || enemyStructures.length > 0) && !Memory.victory.enemyContact) {
        Memory.victory.enemyContact = Game.time;
        Memory.victory.strategy = 'TOTAL_WARFARE';
        console.log('🚨🚨🚨 FIRST ENEMY CONTACT - INITIATING TOTAL WARFARE! 🚨🚨🚨');
    }
    
    // ULTIMATE STATUS REPORT
    const age = Game.time - Memory.victory.gameStart;
    console.log(`⚡💥 ULTIMATE VICTORY ENGINE - TICK ${Game.time} (AGE: ${age}) 💥⚡`);
    console.log(`👑 EMPIRE STATUS: Room ${room.name} | RCL ${level} | Energy ${room.energyAvailable}/${room.energyCapacityAvailable}`);
    console.log(`⚔️ TOTAL FORCES: Workers:${workers.length} | Military:${military.length} | Healers:${healers.length} | Scouts:${scouts.length} | Towers:${towers.length}`);
    console.log(`🏭 INFRASTRUCTURE: Extensions:${extensions.length} | Strategy:${Memory.victory.strategy} | Phase:${Memory.victory.phase}`);
    
    if (enemies.length > 0) {
        console.log(`🔥 ACTIVE COMBAT: ${enemies.length} HOSTILES IN BASE - EXTERMINATING!`);
        enemies.forEach(enemy => {
            console.log(`   💀 TARGET: ${enemy.name} at ${enemy.pos} [${enemy.hits}/${enemy.hitsMax} HP] - PRIORITY ELIMINATION!`);
        });
    }
    
    if (enemyStructures.length > 0) {
        console.log(`🎯 DESTRUCTION TARGETS: ${enemyStructures.length} ENEMY INSTALLATIONS TO OBLITERATE!`);
    }

    // ULTIMATE SPAWNING SYSTEM
    if (!mainSpawn.spawning) {
        executeUltimateSpawning(mainSpawn, room.energyAvailable, age, military.length, workers.length, level);
    }

    // ULTIMATE INFRASTRUCTURE
    buildWarMachine(room, mainSpawn, level, age);
    
    // EXECUTE ALL COMBAT UNITS
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        
        switch(creep.memory.role) {
            case 'worker':
                runWarWorker(creep);
                break;
            case 'attacker':
                runBerserker(creep);
                break;
            case 'ranger':
                runDeadshot(creep);
                break;
            case 'destroyer':
                runDestroyer(creep);
                break;
            case 'annihilator':
                runAnnihilator(creep);
                break;
            case 'healer':
                runWarMedic(creep);
                break;
            case 'scout':
                runTacticalScout(creep);
                break;
        }
    }

    // ULTIMATE TOWER WARFARE
    runDestroyerTowers(towers, room);
    
    // STRATEGIC COMMAND
    if (Game.time % 5 === 0) {
        executeStrategicCommand();
    }
    
    // VICTORY ASSESSMENT
    assessVictoryConditions(age, military.length, towers.length, level, enemies.length, enemyStructures.length);
};

function executeUltimateSpawning(spawn, energy, age, militaryCount, workerCount, level) {
    // ULTIMATE SPAWNING ALGORITHM - PERFECTED THROUGH BATTLE
    
    // EMERGENCY PROTOCOLS
    if (Memory.victory.strategy === 'TOTAL_WARFARE') {
        if (militaryCount < 15) {
            if (energy >= 1200) {
                spawnUltimateAnnihilator(spawn);
            } else if (energy >= 900) {
                spawnMegaDestroyer(spawn);
            } else if (energy >= 700) {
                spawnSuperDestroyer(spawn);
            } else if (energy >= 500) {
                spawnEliteDestroyer(spawn);
            } else if (energy >= 400) {
                spawnDestroyer(spawn);
            } else if (energy >= 300) {
                spawnRanger(spawn);
            }
            return;
        }
    }
    
    // PERFECT OPENING SEQUENCE
    if (age === 0) {
        spawnWorker(spawn); // Immediate economy
    } else if (age <= 3 && workerCount < 2 && energy >= 200) {
        spawnWorker(spawn); // Second worker ASAP
    } else if (age <= 8 && energy >= 100 && scouts.length === 0) {
        spawnUltraScout(spawn); // Immediate intelligence
    } else if (age <= 12 && energy >= 350 && militaryCount === 0) {
        spawnDestroyer(spawn); // First military - powerful start
    } else if (age <= 20) {
        // Early buildup phase
        if (workerCount < 3 && energy >= 250) {
            spawnOptimalWorker(spawn);
        } else if (militaryCount < 2 && energy >= 400) {
            spawnDestroyer(spawn);
        } else if (energy >= 300) {
            spawnRanger(spawn);
        }
    } else if (age <= 40) {
        // Military surge phase
        if (militaryCount < 6) {
            if (energy >= 800) {
                spawnSuperDestroyer(spawn);
            } else if (energy >= 600) {
                spawnEliteDestroyer(spawn);
            } else if (energy >= 500) {
                spawnDestroyer(spawn);
            } else if (energy >= 400) {
                spawnEliteRanger(spawn);
            }
        } else if (energy >= 500) {
            spawnSuperHealer(spawn);
        }
    } else if (age <= 80) {
        // Elite force phase
        if (militaryCount < 12) {
            if (energy >= 1200) {
                spawnUltimateAnnihilator(spawn);
            } else if (energy >= 900) {
                spawnMegaDestroyer(spawn);
            } else if (energy >= 700) {
                spawnSuperDestroyer(spawn);
            } else if (energy >= 600) {
                spawnEliteDestroyer(spawn);
            }
        } else if (energy >= 600) {
            spawnMegaHealer(spawn);
        }
    } else {
        // Endgame domination
        if (militaryCount < 20) {
            if (energy >= 1500) {
                spawnDoomsdayUnit(spawn);
            } else if (energy >= 1200) {
                spawnUltimateAnnihilator(spawn);
            } else if (energy >= 900) {
                spawnMegaDestroyer(spawn);
            }
        }
    }
}

// ULTIMATE UNIT DESIGNS - PERFECTED THROUGH BATTLE
function spawnWorker(spawn) {
    const name = 'Worker' + Game.time;
    const parts = [WORK,CARRY,MOVE]; // 200 energy - immediate deployment
    
    if(spawn.spawnCreep(parts, name, {memory: {role: 'worker'}}) == OK) {
        console.log('👷⚡ SPAWN: Basic Worker ' + name);
        recordMilestone('firstWorker');
    }
}

function spawnOptimalWorker(spawn) {
    const name = 'OptimalWorker' + Game.time;
    const parts = [WORK,WORK,CARRY,CARRY,MOVE]; // 250 energy - efficient
    
    if(spawn.spawnCreep(parts, name, {memory: {role: 'worker'}}) == OK) {
        console.log('👷💪 SPAWN: Optimal Worker ' + name);
    }
}

function spawnUltraScout(spawn) {
    const name = 'UltraScout' + Game.time;
    const parts = [MOVE]; // 50 energy - instant intelligence
    
    if(spawn.spawnCreep(parts, name, {memory: {role: 'scout', target: null}}) == OK) {
        console.log('👁️⚡ SPAWN: Ultra Scout ' + name);
    }
}

function spawnRanger(spawn) {
    const name = 'Ranger' + Game.time;
    const parts = [RANGED_ATTACK,MOVE,MOVE]; // 300 energy
    
    if(spawn.spawnCreep(parts, name, {memory: {role: 'ranger'}}) == OK) {
        console.log('🏹⚡ SPAWN: Ranger ' + name);
        recordMilestone('firstMilitary');
    }
}

function spawnEliteRanger(spawn) {
    const name = 'EliteRanger' + Game.time;
    const parts = [RANGED_ATTACK,RANGED_ATTACK,MOVE,MOVE]; // 400 energy
    
    if(spawn.spawnCreep(parts, name, {memory: {role: 'ranger'}}) == OK) {
        console.log('🏹💥 SPAWN: Elite Ranger ' + name);
    }
}

function spawnDestroyer(spawn) {
    const name = 'Destroyer' + Game.time;
    const parts = [ATTACK,RANGED_ATTACK,MOVE,MOVE,MOVE]; // 350 energy - versatile
    
    if(spawn.spawnCreep(parts, name, {memory: {role: 'destroyer'}}) == OK) {
        console.log('🔥⚔️ SPAWN: Destroyer ' + name + ' - DUAL WEAPON SYSTEM!');
    }
}

function spawnEliteDestroyer(spawn) {
    const name = 'EliteDestroyer' + Game.time;
    const parts = [ATTACK,ATTACK,RANGED_ATTACK,MOVE,MOVE,MOVE]; // 600 energy
    
    if(spawn.spawnCreep(parts, name, {memory: {role: 'destroyer'}}) == OK) {
        console.log('🔥💥 SPAWN: Elite Destroyer ' + name + ' - HEAVY WEAPONS PLATFORM!');
    }
}

function spawnSuperDestroyer(spawn) {
    const name = 'SuperDestroyer' + Game.time;
    const parts = [ATTACK,ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,MOVE,MOVE,MOVE,MOVE]; // 700 energy
    
    if(spawn.spawnCreep(parts, name, {memory: {role: 'destroyer'}}) == OK) {
        console.log('🔥⚡ SPAWN: Super Destroyer ' + name + ' - SELF-HEALING WAR MACHINE!');
    }
}

function spawnMegaDestroyer(spawn) {
    const name = 'MegaDestroyer' + Game.time;
    const parts = [ATTACK,ATTACK,ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE]; // 900 energy
    
    if(spawn.spawnCreep(parts, name, {memory: {role: 'destroyer'}}) == OK) {
        console.log('🔥💀 SPAWN: MEGA DESTROYER ' + name + ' - ULTIMATE BATTLEFIELD WEAPON!');
    }
}

function spawnUltimateAnnihilator(spawn) {
    const name = 'ANNIHILATOR' + Game.time;
    const parts = [ATTACK,ATTACK,ATTACK,ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]; // 1200 energy
    
    if(spawn.spawnCreep(parts, name, {memory: {role: 'annihilator'}}) == OK) {
        console.log('💀⚡ SPAWN: ULTIMATE ANNIHILATOR ' + name + ' - WEAPON OF MASS DESTRUCTION!');
    }
}

function spawnDoomsdayUnit(spawn) {
    const name = 'DOOMSDAY' + Game.time;
    const parts = [ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL,HEAL,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]; // 1500 energy
    
    if(spawn.spawnCreep(parts, name, {memory: {role: 'annihilator'}}) == OK) {
        console.log('💥☢️ SPAWN: DOOMSDAY UNIT ' + name + ' - APOCALYPSE INCARNATE!');
    }
}

function spawnSuperHealer(spawn) {
    const name = 'SuperHealer' + Game.time;
    const parts = [HEAL,HEAL,HEAL,MOVE,MOVE,MOVE]; // 500 energy
    
    if(spawn.spawnCreep(parts, name, {memory: {role: 'healer'}}) == OK) {
        console.log('🩹💥 SPAWN: Super Healer ' + name + ' - BATTLEFIELD HOSPITAL!');
    }
}

function spawnMegaHealer(spawn) {
    const name = 'MegaHealer' + Game.time;
    const parts = [HEAL,HEAL,HEAL,HEAL,MOVE,MOVE,MOVE,MOVE]; // 600 energy
    
    if(spawn.spawnCreep(parts, name, {memory: {role: 'healer'}}) == OK) {
        console.log('🩹⚡ SPAWN: MEGA HEALER ' + name + ' - MOBILE HOSPITAL COMPLEX!');
    }
}

function buildWarMachine(room, spawn, level, age) {
    const extensions = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}});
    const towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    const sites = room.find(FIND_CONSTRUCTION_SITES);
    
    // MAXIMUM PRIORITY: Extensions for massive energy
    const maxExtensions = getMaxExtensions(level);
    if (extensions.length < maxExtensions && sites.filter(s => s.structureType === STRUCTURE_EXTENSION).length === 0) {
        // Place extensions in optimal formation
        for(let range = 2; range <= 8; range++) {
            const positions = getOptimalPositions(spawn.pos, range);
            for(let pos of positions) {
                if(pos.x > 0 && pos.x < 49 && pos.y > 0 && pos.y < 49) {
                    if(room.createConstructionSite(pos.x, pos.y, STRUCTURE_EXTENSION) === OK) {
                        console.log(`⚡🏗️ WAR BUILD: Extension at ${pos.x},${pos.y}`);
                        return;
                    }
                }
            }
        }
    }
    
    // HIGH PRIORITY: Towers for defense
    const maxTowers = getMaxTowers(level);
    if (level >= 3 && towers.length < maxTowers && sites.filter(s => s.structureType === STRUCTURE_TOWER).length === 0) {
        // Strategic tower placement
        const towerPositions = [
            {x: spawn.pos.x-4, y: spawn.pos.y-4},
            {x: spawn.pos.x+4, y: spawn.pos.y-4},
            {x: spawn.pos.x-4, y: spawn.pos.y+4},
            {x: spawn.pos.x+4, y: spawn.pos.y+4},
            {x: spawn.pos.x, y: spawn.pos.y-5},
            {x: spawn.pos.x, y: spawn.pos.y+5}
        ];
        
        for(let pos of towerPositions) {
            if(pos.x > 0 && pos.x < 49 && pos.y > 0 && pos.y < 49) {
                if(room.createConstructionSite(pos.x, pos.y, STRUCTURE_TOWER) === OK) {
                    console.log(`🗼💥 WAR BUILD: Destroyer Tower at ${pos.x},${pos.y}`);
                    recordMilestone('firstTower');
                    return;
                }
            }
        }
    }
}

function getMaxExtensions(level) {
    const limits = [0, 0, 5, 10, 20, 30, 40, 50, 60];
    return limits[level] || 0;
}

function getMaxTowers(level) {
    const limits = [0, 0, 0, 1, 1, 2, 2, 3, 6];
    return limits[level] || 0;
}

function getOptimalPositions(centerPos, range) {
    const positions = [];
    for(let dx = -range; dx <= range; dx++) {
        for(let dy = -range; dy <= range; dy++) {
            if(Math.abs(dx) + Math.abs(dy) === range) {
                positions.push({x: centerPos.x + dx, y: centerPos.y + dy});
            }
        }
    }
    return positions;
}

// ULTIMATE COMBAT BEHAVIORS
function runWarWorker(creep) {
    if(creep.store.energy == 0) {
        const source = creep.pos.findClosestByPath(FIND_SOURCES);
        if(source && creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    } else {
        // WAR ECONOMY PRIORITY: Military infrastructure first!
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

function runBerserker(creep) {
    const enemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if(enemy) {
        if(creep.attack(enemy) == ERR_NOT_IN_RANGE) {
            creep.moveTo(enemy, {reusePath: 1, visualizePathStyle: {stroke: '#ff0000'}});
        }
    } else {
        const structures = creep.room.find(FIND_HOSTILE_STRUCTURES);
        if(structures.length > 0) {
            const target = structures.find(s => s.structureType === STRUCTURE_SPAWN) ||
                          structures.find(s => s.structureType === STRUCTURE_TOWER) ||
                          structures[0];
            if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {reusePath: 1});
            }
        }
    }
}

function runDeadshot(creep) {
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
        
        // Optimal kiting
        if(range > 3) {
            creep.moveTo(enemy, {reusePath: 1});
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

function runDestroyer(creep) {
    const enemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if(enemy) {
        const range = creep.pos.getRangeTo(enemy);
        
        // DUAL WEAPON SYSTEM
        if(range <= 1) {
            creep.attack(enemy);
            creep.rangedMassAttack();
        } else if(range <= 3) {
            creep.rangedAttack(enemy);
            creep.moveTo(enemy, {reusePath: 1});
        } else {
            creep.moveTo(enemy, {reusePath: 1});
        }
        
        // Self-healing if available
        if(creep.hits < creep.hitsMax && creep.getActiveBodyparts(HEAL) > 0) {
            creep.heal(creep);
        }
    } else {
        const structures = creep.room.find(FIND_HOSTILE_STRUCTURES);
        if(structures.length > 0) {
            const target = structures.find(s => s.structureType === STRUCTURE_SPAWN) || structures[0];
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
    }
}

function runAnnihilator(creep) {
    // ULTIMATE WEAPON - All capabilities maximized
    const enemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if(enemy) {
        const range = creep.pos.getRangeTo(enemy);
        
        // MAXIMUM DESTRUCTION
        if(range <= 1) {
            creep.attack(enemy);
            creep.rangedMassAttack();
        } else if(range <= 3) {
            creep.rangedAttack(enemy);
            creep.moveTo(enemy, {reusePath: 1});
        } else {
            creep.moveTo(enemy, {reusePath: 1});
        }
        
        // PRIORITY SELF-HEALING
        if(creep.hits < creep.hitsMax * 0.8) {
            creep.heal(creep);
        }
    } else {
        // STRUCTURE OBLITERATION
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
        
        // Continuous self-healing
        if(creep.hits < creep.hitsMax) {
            creep.heal(creep);
        }
    }
}

function runWarMedic(creep) {
    const damaged = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
        filter: (c) => c.hits < c.hitsMax
    });
    
    if(damaged) {
        const range = creep.pos.getRangeTo(damaged);
        if(range <= 1) {
            creep.heal(damaged);
        } else if(range <= 3 && creep.getActiveBodyparts(HEAL) > 1) {
            creep.rangedHeal(damaged);
            creep.moveTo(damaged);
        } else {
            creep.moveTo(damaged);
        }
    } else {
        // Follow strongest military unit
        const leader = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: (c) => ['destroyer', 'annihilator'].includes(c.memory.role) && c.body.length >= 8
        });
        
        if(leader && creep.pos.getRangeTo(leader) > 2) {
            creep.moveTo(leader);
        }
    }
}

function runTacticalScout(creep) {
    if(!creep.memory.target || creep.pos.getRangeTo(creep.memory.target) < 2) {
        const scanPoints = [
            {x: 5, y: 5}, {x: 45, y: 5}, {x: 5, y: 45}, {x: 45, y: 45},
            {x: 25, y: 5}, {x: 5, y: 25}, {x: 45, y: 25}, {x: 25, y: 45},
            {x: 15, y: 15}, {x: 35, y: 15}, {x: 15, y: 35}, {x: 35, y: 35}
        ];
        creep.memory.target = scanPoints[Math.floor(Math.random() * scanPoints.length)];
    }
    
    creep.moveTo(creep.memory.target.x, creep.memory.target.y);
    
    // Intelligence reporting
    const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
    const structures = creep.room.find(FIND_HOSTILE_STRUCTURES);
    
    if(enemies.length > 0 || structures.length > 0) {
        console.log(`👁️💥 TACTICAL INTEL: ${enemies.length} hostiles, ${structures.length} structures detected at ${creep.pos}`);
    }
}

function runDestroyerTowers(towers, room) {
    for(let tower of towers) {
        const enemy = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        
        if(enemy) {
            tower.attack(enemy);
            console.log(`🗼💀 DESTROYER TOWER: Obliterating ${enemy.name} at ${enemy.pos}!`);
        } else {
            // Priority healing for destroyers and annihilators
            const damaged = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: (c) => c.hits < c.hitsMax && ['destroyer', 'annihilator'].includes(c.memory.role)
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

function recordMilestone(milestone) {
    if (!Memory.victory.milestones[milestone]) {
        Memory.victory.milestones[milestone] = Game.time;
        console.log(`🎯 MILESTONE ACHIEVED: ${milestone} at tick ${Game.time}!`);
    }
}

function executeStrategicCommand() {
    const age = Game.time - Memory.victory.gameStart;
    const totalMilitary = Object.values(Game.creeps).filter(c => 
        ['attacker', 'ranger', 'destroyer', 'annihilator'].includes(c.memory.role)
    ).length;
    
    console.log(`🎯⚡ STRATEGIC COMMAND: Age ${age} | Military Force: ${totalMilitary} | Strategy: ${Memory.victory.strategy}`);
    
    // Phase transitions
    if (totalMilitary >= 15 && Memory.victory.phase !== 'DOMINATION') {
        Memory.victory.phase = 'DOMINATION';
        console.log('👑💥 PHASE TRANSITION: TOTAL DOMINATION ACHIEVED!');
    } else if (totalMilitary >= 8 && Memory.victory.phase !== 'SUPREMACY') {
        Memory.victory.phase = 'SUPREMACY';
        console.log('⚔️💥 PHASE TRANSITION: MILITARY SUPREMACY!');
    }
}

function assessVictoryConditions(age, military, towers, level, enemies, enemyStructures) {
    if (military >= 20 && towers >= 4 && level >= 6) {
        console.log('🏆👑💥 TOTAL VICTORY ACHIEVED - COMPLETE BATTLEFIELD DOMINATION! 🏆👑💥');
    } else if (military >= 15 && towers >= 3 && level >= 5) {
        console.log('🏅⚡ VICTORY IMMINENT - OVERWHELMING SUPERIORITY ESTABLISHED!');
    } else if (military >= 10 && towers >= 2 && level >= 4) {
        console.log('💪⚔️ STRONG POSITION - MAINTAINING DOMINANCE!');
    } else if (military >= 5 && age <= 50) {
        console.log('🚀💥 EXCELLENT PROGRESS - RAPID MILITARY BUILDUP!');
    }
    
    if (enemies === 0 && enemyStructures === 0 && military >= 8) {
        console.log('🌍👑 BATTLEFIELD CLEARED - AWAITING NEW CHALLENGERS TO CRUSH!');
    }
}