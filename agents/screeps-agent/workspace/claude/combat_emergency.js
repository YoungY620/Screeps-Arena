// EMERGENCY COMBAT MODE - TICK 7073 ACTIVATION
// Enemy detected in W1N3! Switch to immediate military production!

module.exports.loop = function () {
    // Clear memory of dead creeps
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    const spawns = Object.values(Game.spawns);
    if (spawns.length === 0) {
        console.log('CRITICAL: No spawns available!');
        return;
    }

    const mainSpawn = spawns[0];
    const room = mainSpawn.room;
    
    // Count current forces
    const creeps = Object.values(Game.creeps);
    const workers = creeps.filter(c => c.memory.role === 'worker');
    const attackers = creeps.filter(c => c.memory.role === 'attacker');
    const rangers = creeps.filter(c => c.memory.role === 'ranger');
    const healers = creeps.filter(c => c.memory.role === 'healer');
    
    console.log(`🔥 COMBAT MODE - Tick ${Game.time}: Workers: ${workers.length}, Attackers: ${attackers.length}, Rangers: ${rangers.length}, Healers: ${healers.length}, Energy: ${room.energyAvailable}/${room.energyCapacityAvailable}`);
    
    // EMERGENCY MILITARY PRIORITY - ENEMY DETECTED IN W1N3!
    if (!mainSpawn.spawning) {
        const totalMilitary = attackers.length + rangers.length;
        
        // Minimum 2 workers for economy, rest all military
        if (workers.length < 2 && room.energyAvailable >= 200) {
            spawnWorker(mainSpawn);
        } else if (totalMilitary < 8 && room.energyAvailable >= 210) {
            // Prioritize rangers for better first strike capability
            if (rangers.length < attackers.length || rangers.length === 0) {
                spawnRanger(mainSpawn);
            } else if (healers.length < Math.floor(totalMilitary / 4)) {
                spawnHealer(mainSpawn);
            } else {
                spawnAttacker(mainSpawn);
            }
        } else if (workers.length < 3 && room.energyAvailable >= 200) {
            spawnWorker(mainSpawn);
        }
    }

    // Execute all creep behaviors with aggressive combat focus
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        
        if(creep.memory.role == 'worker') {
            runWorker(creep);
        }
        else if(creep.memory.role == 'attacker') {
            runAggressiveAttacker(creep);
        }
        else if(creep.memory.role == 'ranger') {
            runAggressiveRanger(creep);
        }
        else if(creep.memory.role == 'healer') {
            runHealer(creep);
        }
    }
    
    // Aggressive scouting and attack coordination
    if (Game.time % 10 === 0) {
        planEnemyAssault();
    }
};

function spawnWorker(spawn) {
    const name = 'Worker' + Game.time;
    const parts = spawn.room.energyAvailable >= 300 ? 
        [WORK,WORK,CARRY,MOVE] :  
        [WORK,CARRY,MOVE];        
    
    if(spawn.spawnCreep(parts, name, {memory: {role: 'worker'}}) == OK) {
        console.log('Spawning worker: ' + name);
    }
}

function spawnRanger(spawn) {
    const name = 'Ranger' + Game.time;
    const energy = spawn.room.energyAvailable;
    let parts;
    
    if (energy >= 400) {
        parts = [RANGED_ATTACK,RANGED_ATTACK,MOVE,MOVE];  
    } else if (energy >= 260) {
        parts = [RANGED_ATTACK,MOVE,MOVE];                
    } else if (energy >= 210) {
        parts = [RANGED_ATTACK,MOVE];                
    } else {
        return;
    }
    
    if(spawn.spawnCreep(parts, name, {memory: {role: 'ranger', target: 'W1N3'}}) == OK) {
        console.log('🏹 Spawning ranger for W1N3 assault: ' + name);
    }
}

function spawnAttacker(spawn) {
    const name = 'Attacker' + Game.time;
    const energy = spawn.room.energyAvailable;
    let parts;
    
    if (energy >= 390) {
        parts = [ATTACK,ATTACK,MOVE,MOVE,MOVE];  
    } else if (energy >= 210) {
        parts = [ATTACK,MOVE,MOVE];              
    } else if (energy >= 160) {
        parts = [ATTACK,MOVE];              
    } else {
        return;
    }
    
    if(spawn.spawnCreep(parts, name, {memory: {role: 'attacker', target: 'W1N3'}}) == OK) {
        console.log('⚔️ Spawning attacker for W1N3 assault: ' + name);
    }
}

function spawnHealer(spawn) {
    const name = 'Healer' + Game.time;
    const energy = spawn.room.energyAvailable;
    let parts;
    
    if (energy >= 500) {
        parts = [HEAL,HEAL,MOVE,MOVE];    
    } else if (energy >= 300) {
        parts = [HEAL,MOVE,MOVE];         
    } else if (energy >= 250) {
        parts = [HEAL,MOVE];         
    } else {
        return;
    }
    
    if(spawn.spawnCreep(parts, name, {memory: {role: 'healer', target: 'W1N3'}}) == OK) {
        console.log('💚 Spawning healer for W1N3 support: ' + name);
    }
}

function runWorker(creep) {
    if(creep.carry.energy == 0) {
        const sources = creep.room.find(FIND_SOURCES);
        const source = creep.pos.findClosestByPath(sources.filter(s => s.energy > 0));
        if(source && creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
    else {
        const targets = [
            ...creep.room.find(FIND_MY_STRUCTURES, {filter: (s) => s.energy < s.energyCapacity && (s.structureType === STRUCTURE_SPAWN || s.structureType === STRUCTURE_EXTENSION)}),
            ...creep.room.find(FIND_MY_STRUCTURES, {filter: (s) => s.energy < s.energyCapacity && s.structureType === STRUCTURE_TOWER})
        ];
        
        if(targets.length > 0) {
            const target = creep.pos.findClosestByPath(targets);
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            const buildTargets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(buildTargets.length > 0) {
                const priority = buildTargets.find(s => s.structureType === STRUCTURE_TOWER) ||
                               buildTargets.find(s => s.structureType === STRUCTURE_EXTENSION) ||
                               buildTargets[0];
                if(creep.build(priority) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(priority, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else if(creep.room.controller) {
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
}

function runAggressiveAttacker(creep) {
    const targetRoom = creep.memory.target || 'W1N3';
    
    // If not in target room, move there
    if (creep.room.name !== targetRoom) {
        creep.moveTo(new RoomPosition(25, 25, targetRoom), {visualizePathStyle: {stroke: '#ff0000'}});
        return;
    }
    
    // In target room - find and attack enemies
    const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if(target) {
        if(creep.attack(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
        }
        console.log(`⚔️ ${creep.name} attacking ${target.name} in ${targetRoom}`);
    } else {
        // Attack enemy structures
        const structures = creep.room.find(FIND_HOSTILE_STRUCTURES);
        if(structures.length > 0) {
            const target = structures.find(s => s.structureType === STRUCTURE_SPAWN) ||
                          structures.find(s => s.structureType === STRUCTURE_TOWER) ||
                          structures[0];
            if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
            }
            console.log(`🏗️ ${creep.name} attacking structure in ${targetRoom}`);
        } else {
            // Patrol room for enemies
            const center = new RoomPosition(25, 25, targetRoom);
            if(creep.pos.getRangeTo(center) > 20) {
                creep.moveTo(center);
            }
        }
    }
}

function runAggressiveRanger(creep) {
    const targetRoom = creep.memory.target || 'W1N3';
    
    // If not in target room, move there
    if (creep.room.name !== targetRoom) {
        creep.moveTo(new RoomPosition(25, 25, targetRoom), {visualizePathStyle: {stroke: '#00ff00'}});
        return;
    }
    
    // In target room - attack with ranged weapons
    const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if(target) {
        const range = creep.pos.getRangeTo(target);
        
        if(range <= 3) {
            if(range > 1) {
                creep.rangedAttack(target);
            } else {
                creep.rangedMassAttack();
            }
            console.log(`🏹 ${creep.name} ranged attacking at range ${range} in ${targetRoom}`);
        }
        
        // Move to optimal range (2-3 tiles away)
        if(range > 3) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#00ff00'}});
        } else if(range < 2) {
            // Keep distance
            const direction = creep.pos.getDirectionTo(target);
            const oppositeDir = ((direction + 3) % 8) + 1;
            creep.move(oppositeDir);
        }
    } else {
        // Attack enemy structures with ranged
        const structures = creep.room.find(FIND_HOSTILE_STRUCTURES);
        if(structures.length > 0) {
            const target = structures.find(s => s.structureType === STRUCTURE_SPAWN) ||
                          structures.find(s => s.structureType === STRUCTURE_TOWER) ||
                          structures[0];
            if(creep.pos.getRangeTo(target) <= 3) {
                creep.rangedAttack(target);
                console.log(`🏹 ${creep.name} ranged attacking structure in ${targetRoom}`);
            }
            if(creep.pos.getRangeTo(target) > 3) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#00ff00'}});
            }
        } else {
            // Victory patrol
            const center = new RoomPosition(25, 25, targetRoom);
            if(creep.pos.getRangeTo(center) > 15) {
                creep.moveTo(center);
            }
        }
    }
}

function runHealer(creep) {
    const targetRoom = creep.memory.target || 'W1N3';
    
    // If not in target room, move there
    if (creep.room.name !== targetRoom) {
        creep.moveTo(new RoomPosition(25, 25, targetRoom), {visualizePathStyle: {stroke: '#00ffff'}});
        return;
    }
    
    // Heal damaged friendlies
    const damaged = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
        filter: (c) => c.hits < c.hitsMax
    });
    
    if(damaged) {
        if(creep.heal(damaged) == ERR_NOT_IN_RANGE) {
            creep.moveTo(damaged, {visualizePathStyle: {stroke: '#00ff00'}});
        }
        console.log(`💚 ${creep.name} healing ${damaged.name}`);
    } else {
        // Follow nearest military unit
        const military = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: (c) => c.memory.role === 'attacker' || c.memory.role === 'ranger'
        });
        
        if(military && creep.pos.getRangeTo(military) > 3) {
            creep.moveTo(military);
        }
    }
}

function planEnemyAssault() {
    console.log('🎯 ASSAULT PLANNING: Target W1N3 - Enemy spawn at (15,15)');
    const militaryUnits = Object.values(Game.creeps).filter(c => 
        c.memory.role === 'attacker' || c.memory.role === 'ranger'
    );
    
    if (militaryUnits.length >= 3) {
        console.log(`🚀 READY FOR ASSAULT: ${militaryUnits.length} units - ATTACK W1N3!`);
    } else {
        console.log(`⏳ Building forces: ${militaryUnits.length}/3 minimum for assault`);
    }
}