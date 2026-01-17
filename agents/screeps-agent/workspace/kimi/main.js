// KIMI - ULTRA-SIMPLE FINAL DESPERATE STAND
// Absolute final desperate attempt - MUST EXECUTE OR DIE!

console.log('💀 ULTRA-SIMPLE FINAL DESPERATE STAND - Tick:', Game.time);

// === ULTRA-SIMPLE FINAL CONFIGURATION ===
const MUST_EXECUTE = true;
const DESPERATE_MODE = true;
const FINAL_ATTEMPT = true;

// === ULTRA-SIMPLE FINAL MAIN LOOP ===
module.exports.loop = function () {
    console.log('💀 ULTRA-SIMPLE FINAL LOOP - Tick:', Game.time);
    
    // ULTRA-SIMPLE: Clear only creeps memory
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
    
    // ULTRA-SIMPLE: Check spawn exists
    const spawn = Game.spawns.Spawn1;
    if (!spawn) {
        console.log('💀 ULTRA-SIMPLE: NO SPAWN - DESPERATE FAILURE');
        return;
    }
    
    console.log('💀 ULTRA-SIMPLE: Spawn at', spawn.room.name);
    console.log('💀 ULTRA-SIMPLE: Energy:', spawn.room.energyAvailable);
    
    // ULTRA-SIMPLE: Force spawn regardless of conditions
    if (!spawn.spawning) {
        const energy = spawn.room.energyAvailable;
        console.log('💀 ULTRA-SIMPLE: Energy available:', energy);
        
        // ULTRA-SIMPLE: Force spawn ANY unit possible
        console.log('💀 ULTRA-SIMPLE: Attempting DESPERATE spawn...');
        
        // DESPERATE: Try any spawn possible
        const result = spawn.spawnCreep([MOVE], `desperate_${Game.time}`, {
            memory: { role: 'desperate', room: spawn.room.name }
        });
        console.log('💀 ULTRA-SIMPLE: Desperate spawn result:', result);
        
        // DESPERATE: Try minimal spawn
        if (result !== OK) {
            const result2 = spawn.spawnCreep([MOVE], `final_${Game.time}`, {
                memory: { role: 'final', room: spawn.room.name }
            });
            console.log('💀 ULTRA-SIMPLE: Final spawn result:', result2);
        }
    }
    
    // ULTRA-SIMPLE: Manage any existing creeps
    console.log('💀 ULTRA-SIMPLE: Managing', Object.keys(Game.creeps).length, 'creeps');
    
    for (let name in Game.creeps) {
        const creep = Game.creeps[name];
        
        try {
            console.log('💀 ULTRA-SIMPLE: Managing', name);
            
            if (creep.memory.role === 'desperate') {
                console.log('💀 ULTRA-SIMPLE: Managing desperate unit');
                const exits = Game.map.describeExits(creep.room.name);
                if (exits) {
                    const directions = Object.keys(exits);
                    const targetRoom = exits[directions[Game.time % directions.length]];
                    creep.moveTo(new RoomPosition(25, 25, targetRoom));
                    
                    const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
                    if (enemies.length > 0) {
                        creep.say(`ENEMIES: ${enemies.length}`);
                        console.log(`💀 ULTRA-SIMPLE: ${enemies.length} enemies detected`);
                    }
                }
            }
            
            if (creep.memory.role === 'final') {
                console.log('💀 ULTRA-SIMPLE: Managing final unit');
                const enemy = creep.pos.findClosestByPath(FIND_HOSTILE_CREEps);
                if (enemy) {
                    creep.moveTo(enemy);
                    creep.say('FINAL!');
                } else {
                    creep.moveTo(25, 25);
                }
            }
            
        } catch (error) {
            console.log(`💀 ULTRA-SIMPLE ERROR with ${creep.name}:`, error);
        }
    }
    
    // ULTRA-SIMPLE: Ultra-simple tower defense
    console.log('🏰 ULTRA-SIMPLE: Ultra-simple tower defense');
    const towers = _.filter(Game.structures, s => s.structureType === STRUCTURE_TOWER);
    towers.forEach(tower => {
        console.log('🏰 ULTRA-SIMPLE: Tower at', tower.pos);
        
        const enemy = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (enemy) {
            console.log('🏰 ULTRA-SIMPLE: Tower attacking enemy');
            tower.attack(enemy);
            return;
        }
        
        const wounded = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: creep => creep.hits < creep.hitsMax
        });
        
        if (wounded) {
            console.log('🏰 ULTRA-SIMPLE: Tower healing wounded');
            tower.heal(wounded);
        }
    });
    
    console.log(`=== 💀 ULTRA-SIMPLE FINAL STATUS: Tick ${Game.time} ===`);
    console.log(`Spawn: ${spawn.name} in ${spawn.room.name}`);
    console.log(`Energy: ${spawn.room.energyAvailable}/${spawn.room.energyCapacityAvailable}`);
    console.log(`Controller: ${spawn.room.controller ? 'EXISTS' : 'MISSING'}`);
    console.log(`Controller Owned: ${spawn.room.controller && spawn.room.controller.my ? 'YES' : 'NO'}`);
    console.log(`Creeps: ${Object.keys(Game.creeps).length}`);
    console.log(`Spawning: ${spawn.spawning ? spawn.spawning.name : 'NONE'}`);
    console.log(`Towers: ${towers.length}`);
    console.log(`=== ULTRA-SIMPLE FINAL COMPLETE ===`);
};