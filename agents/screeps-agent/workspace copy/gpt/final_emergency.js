// 🚨 FINAL EMERGENCY PVP DEPLOYMENT - IMMEDIATE EXECUTION 🚨
// Tick: Game.time - Combat Ready Status

console.log('🎯 GPT PVP AGENT DEPLOYED - DESTROY ALL ENEMIES');

// IMMEDIATE THREAT SCAN
function scanForEnemies() {
    const room = Game.rooms.W5N5;
    if (!room) return 0;
    
    const hostiles = room.find(FIND_HOSTILE_CREEPS).filter(c => 
        c.owner.username !== 'Source Keeper' && c.owner.username !== 'gpt'
    );
    
    if (hostiles.length > 0) {
        console.log(`🚨 ${hostiles.length} ENEMIES DETECTED IN W5N5!`);
        hostiles.forEach(enemy => {
            const attackParts = enemy.body.filter(part => 
                part.type === ATTACK || part.type === RANGED_ATTACK
            ).length;
            console.log(`   Enemy: ${attackParts} attack parts at ${enemy.pos.x},${enemy.pos.y}`);
        });
    }
    
    return hostiles.length;
}

// EMERGENCY SPAWN PROTOCOL
function emergencySpawn() {
    const spawn = Game.spawns.Spawn1;
    if (!spawn || spawn.spawning) return;
    
    const room = spawn.room;
    const enemies = scanForEnemies();
    const energy = spawn.energy;
    
    console.log(`[EMERGENCY] Spawn: ${energy}/${spawn.energyCapacity} energy, ${enemies} enemies detected`);
    
    if (enemies > 0) {
        // PRIORITY 1: DEFEND AT ALL COSTS
        console.log('⚔️ EMERGENCY DEFENSE MODE - Spawning defenders');
        
        const defenseBody = energy >= 300 ? [TOUGH, ATTACK, ATTACK, MOVE, MOVE] :
                           energy >= 200 ? [TOUGH, ATTACK, MOVE, MOVE] :
                           [ATTACK, MOVE];
        
        const result = spawn.spawnCreep(defenseBody, `Defender_${Game.time}`, {
            memory: { role: 'defender', priority: 'emergency' }
        });
        
        if (result === OK) {
            console.log('🛡️ EMERGENCY DEFENDER DEPLOYED!');
        } else {
            console.log(`❌ Defense spawn failed: ${result}`);
        }
        
    } else {
        // PRIORITY 2: ECONOMIC BUILDUP
        console.log('⚡ ECONOMY MODE - Spawning harvesters');
        
        const harvestBody = energy >= 300 ? [WORK, WORK, CARRY, MOVE] :
                           energy >= 200 ? [WORK, CARRY, MOVE] :
                           [WORK, MOVE];
        
        const result = spawn.spawnCreep(harvestBody, `Harvester_${Game.time}`, {
            memory: { role: 'harvester' }
        });
        
        if (result === OK) {
            console.log('⚡ HARVESTER DEPLOYED - Economy building');
        } else {
            console.log(`❌ Harvester spawn failed: ${result}`);
        }
    }
}

// CREEP COMBAT BEHAVIORS
const combatBehaviors = {
    defender: (creep) => {
        const enemies = creep.room.find(FIND_HOSTILE_CREEPS).filter(c => 
            c.owner.username !== 'Source Keeper' && c.owner.username !== 'gpt'
        );
        
        if (enemies.length > 0) {
            // Attack closest enemy
            const target = creep.pos.findClosestByRange(enemies);
            if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000' } });
            }
            console.log(`${creep.name} engaging enemy at ${target.pos.x},${target.pos.y}`);
        } else {
            // Patrol room perimeter
            const patrolPoints = [
                new RoomPosition(1, 25, creep.room.name),
                new RoomPosition(25, 1, creep.room.name),
                new RoomPosition(49, 25, creep.room.name),
                new RoomPosition(25, 49, creep.room.name)
            ];
            
            const patrolIndex = Math.floor(Game.time / 20) % 4;
            creep.moveTo(patrolPoints[patrolIndex], { visualizePathStyle: { stroke: '#00ff00' } });
        }
    },
    
    harvester: (creep) => {
        if (creep.store.getFreeCapacity() > 0) {
            // Harvest from nearest source
            const sources = creep.room.find(FIND_SOURCES);
            const source = creep.pos.findClosestByRange(sources);
            
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        } else {
            // Deliver energy to spawn
            const spawn = Game.spawns.Spawn1;
            if (spawn) {
                if (creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawn, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        }
    }
};

// MAIN EXECUTION LOOP
module.exports.loop = function() {
    console.log('');
    console.log('🎯 GPT COMBAT AGENT - Tick:', Game.time);
    
    // Execute emergency spawn protocol
    emergencySpawn();
    
    // Execute combat behaviors for all creeps
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        const behavior = combatBehaviors[creep.memory.role];
        
        if (behavior) {
            try {
                behavior(creep);
            } catch (error) {
                console.log(`❌ ${creep.name} error: ${error.message}`);
            }
        }
    }
    
    // Strategic status report
    const creepCount = Object.keys(Game.creeps).length;
    const enemies = scanForEnemies();
    
    console.log(`📊 Status: ${creepCount} creeps, ${enemies} enemies, Spawn: ${Game.spawns.Spawn1.energy}/${Game.spawns.Spawn1.energyCapacity} energy`);
    
    if (enemies > 0) {
        console.log('🚨 COMBAT ACTIVE - All units engage!');
    } else {
        console.log('✅ SECTOR CLEAR - Continuing buildup');
    }
    
    console.log('🔄 End combat cycle');
};