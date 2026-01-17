// 🚨 EMERGENCY PVP COMBAT PROTOCOL - IMMEDIATE DEPLOYMENT
// Mission: SURVIVE AT ALL COSTS - Tick: Game.time

console.log('🚨 EMERGENCY PVP PROTOCOL ACTIVATED - SURVIVAL MODE');
console.log('💀 CRITICAL: 17 enemies detected - Immediate defense required');

// EMERGENCY ROLES
const ROLE_HARVESTER = 'harvester';
const ROLE_DEFENDER = 'defender';
const ROLE_ATTACKER = 'attacker';

// EMERGENCY SPAWN PROTOCOL - FIX SPAWNING ISSUE
function emergencySpawn(spawn) {
    if (!spawn) return;
    
    console.log(`🚨 EMERGENCY SPAWN CHECK: ${spawn.name}`);
    
    // Force activate spawn
    if (spawn.off) {
        console.log(`🚨 FORCE ACTIVATING SPAWN: ${spawn.name}`);
        spawn.off = false;
    }
    
    const room = spawn.room;
    const energy = spawn.store ? spawn.store.energy : spawn.energy || 0;
    const energyCapacity = spawn.storeCapacityResource ? spawn.storeCapacityResource.energy : 300;
    
    console.log(`[EMERGENCY] ${spawn.name} - ENERGY: ${energy}/${energyCapacity}`);
    
    // Check for enemies - CRITICAL PRIORITY
    const hostiles = room.find(FIND_HOSTILE_CREEPS).filter(c => 
        c.owner.username !== 'Source Keeper' && c.owner.username !== 'gpt'
    );
    
    console.log(`[EMERGENCY] ENEMIES IN ${room.name}: ${hostiles.length}`);
    
    // EMERGENCY PRIORITY 1: IMMEDIATE DEFENSE
    if (hostiles.length > 0) {
        console.log(`🚨 EMERGENCY DEFENSE: ${hostiles.length} enemies detected!`);
        
        // Build smallest possible defender immediately
        let defenseBody = [];
        if (energy >= 200) {
            defenseBody = [ATTACK, MOVE]; // Minimum viable defender
        } else if (energy >= 130) {
            defenseBody = [ATTACK]; // Last resort
        } else {
            defenseBody = [MOVE]; // Desperate - just move around
        }
        
        console.log(`🚨 DEPLOYING EMERGENCY DEFENDER: ${defenseBody.join(',')}`);
        
        try {
            const result = spawn.spawnCreep(defenseBody, `Defender_${Game.time}`, {
                memory: { role: ROLE_DEFENDER, room: room.name, emergency: true }
            });
            
            console.log(`🚨 SPAWN RESULT: ${result}`);
            
            if (result === OK) {
                console.log(`✅ EMERGENCY DEFENDER DEPLOYED!`);
                return;
            } else {
                console.log(`❌ SPAWN FAILED: ${result} - Trying alternative`);
                
                // Try with different body
                const altResult = spawn.spawnCreep([MOVE], `Move_${Game.time}`, {
                    memory: { role: ROLE_DEFENDER, room: room.name }
                });
                
                if (altResult === OK) {
                    console.log(`✅ ALTERNATIVE DEPLOYED!`);
                    return;
                }
            }
        } catch (error) {
            console.log(`❌ SPAWN ERROR: ${error.message}`);
            
            // Ultimate fallback - try anything
            try {
                const fallback = spawn.spawnCreep([MOVE], `F_${Game.time}`);
                console.log(`🚨 FALLBACK RESULT: ${fallback}`);
            } catch (e) {
                console.log(`💀 CRITICAL: All spawning failed`);
            }
        }
    }
    
    // EMERGENCY PRIORITY 2: FAST HARVESTER
    if (energy >= 200 && hostiles.length === 0) {
        console.log(`⚡ EMERGENCY HARVESTER DEPLOYMENT`);
        
        try {
            const result = spawn.spawnCreep([WORK,CARRY,MOVE], `Harvester_${Game.time}`, {
                memory: { role: ROLE_HARVESTER, room: room.name }
            });
            
            if (result === OK) {
                console.log(`✅ EMERGENCY HARVESTER DEPLOYED`);
                return;
            }
        } catch (error) {
            console.log(`❌ HARVESTER SPAWN FAILED: ${error.message}`);
        }
    }
    
    // EMERGENCY PRIORITY 3: ANY UNIT TO TEST SPAWNING
    if (energy >= 50) {
        console.log(`🧪 TESTING SPAWN MECHANISM`);
        
        try {
            const result = spawn.spawnCreep([MOVE], `Test_${Game.time}`, {
                memory: { role: 'test', room: room.name }
            });
            
            console.log(`🧪 TEST SPAWN RESULT: ${result}`);
            
            if (result === OK) {
                console.log(`✅ SPAWN MECHANISM WORKING!`);
                return;
            }
        } catch (error) {
            console.log(`💀 SPAWN MECHANISM BROKEN: ${error.message}`);
        }
    }
    
    console.log(`💀 NO EMERGENCY DEPLOYMENT POSSIBLE`);
}

// EMERGENCY DEFENSE BEHAVIOR
const emergencyBehaviors = {
    [ROLE_DEFENDER]: (creep) => {
        console.log(`${creep.name}: Emergency defense active`);
        
        const hostiles = creep.room.find(FIND_HOSTILE_CREEPS).filter(c => 
            c.owner.username !== 'Source Keeper' && c.owner.username !== 'gpt'
        );
        
        if (hostiles.length > 0) {
            console.log(`${creep.name}: ${hostiles.length} enemies found!`);
            
            // Attack closest enemy
            const target = creep.pos.findClosestByRange(hostiles);
            console.log(`${creep.name}: Targeting ${target.name}`);
            
            if (creep.attack) {
                const result = creep.attack(target);
                console.log(`${creep.name}: Attack result: ${result}`);
                
                if (result === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000' } });
                }
            } else {
                // No attack parts - just move toward enemy to distract/block
                creep.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        } else {
            console.log(`${creep.name}: No enemies, patrolling`);
            // Patrol room center
            creep.moveTo(25, 25, { visualizePathStyle: { stroke: '#00ff00' } });
        }
    },
    
    [ROLE_HARVESTER]: (creep) => {
        console.log(`${creep.name}: Emergency harvester active`);
        
        if (creep.store.getFreeCapacity() > 0) {
            const sources = creep.room.find(FIND_SOURCES);
            if (sources.length > 0) {
                const source = sources[0];
                if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            }
        } else {
            const spawn = Game.spawns.Spawn1;
            if (spawn && creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(spawn, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
    },
    
    test: (creep) => {
        console.log(`${creep.name}: Test creep active - spawn working!`);
        creep.moveTo(25, 25, { visualizePathStyle: { stroke: '#00ff00' } });
        
        // Convert to defender if enemies appear
        const hostiles = creep.room.find(FIND_HOSTILE_CREEPS).filter(c => 
            c.owner.username !== 'Source Keeper' && c.owner.username !== 'gpt'
        );
        
        if (hostiles.length > 0) {
            creep.memory.role = ROLE_DEFENDER;
            console.log(`${creep.name}: Converting to defender!`);
        }
    }
};

// EMERGENCY MAIN LOOP
module.exports.loop = function() {
    console.log(`🚨 EMERGENCY LOOP - Tick: ${Game.time}`);
    
    // Memory cleanup
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log(`Cleaned up memory for: ${name}`);
        }
    }
    
    // Emergency spawn activation and deployment
    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName];
        console.log(`Processing spawn: ${spawnName}`);
        emergencySpawn(spawn);
    }
    
    // Execute emergency behaviors
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName];
        console.log(`Processing creep: ${creepName} (${creep.memory.role})`);
        
        const behavior = emergencyBehaviors[creep.memory.role];
        if (behavior) {
            try {
                behavior(creep);
            } catch (error) {
                console.log(`❌ ${creepName} behavior error: ${error.message}`);
            }
        } else {
            // Default behavior for unknown roles
            console.log(`${creepName}: No behavior found for role ${creep.memory.role}`);
            creep.moveTo(25, 25);
        }
    }
    
    // Emergency status reporting
    if (Game.time % 10 === 0) {
        const myCreeps = Object.keys(Game.creeps).length;
        const hostiles = Game.rooms[Game.spawns.Spawn1?.room?.name]?.find(FIND_HOSTILE_CREEPS)?.filter(c => 
            c.owner.username !== 'Source Keeper' && c.owner.username !== 'gpt'
        ).length || 0;
        
        console.log('');
        console.log(`🚨 EMERGENCY STATUS: ${myCreeps} creeps vs ${hostiles} enemies`);
        console.log(`💀 Mission: SURVIVE at all costs`);
        console.log('');
    }
};