// EMERGENCY REBIRTH - DIRECT SPAWN PROTOCOL
// STATUS: EXTINCTION LEVEL - MANUAL EMERGENCY RESPONSE
// MISSION: IMMEDIATE FORCE GENERATION

// Ultra-simple emergency spawning
module.exports.loop = function () {
    try {
        console.log('🚨 EMERGENCY REBIRTH PROTOCOL ACTIVE');
        
        const spawn = Game.spawns.Spawn1;
        if (!spawn) {
            console.log('💀 NO SPAWN FOUND');
            return;
        }
        
        const energy = spawn.room.energyAvailable;
        console.log(`⚡ Available Energy: ${energy}`);
        
        // Count current creeps
        let harvesters = 0;
        let soldiers = 0;
        let ranged = 0;
        let healers = 0;
        
        for (let name in Game.creeps) {
            const creep = Game.creeps[name];
            if (creep.memory.role === 'harvester') harvesters++;
            if (creep.memory.role === 'soldier') soldiers++;
            if (creep.memory.role === 'ranged') ranged++;
            if (creep.memory.role === 'healer') healers++;
        }
        
        console.log(`📊 Current Force: ${harvesters}H, ${soldiers}S, ${ranged}R, ${healers}H`);
        
        // EMERGENCY SPAWNING - Ultra-cheap templates
        
        // Priority 1: Emergency Harvester (200 energy)
        if (harvesters < 1 && energy >= 200) {
            console.log('🔥 SPAWNING EMERGENCY HARVESTER');
            const result = spawn.spawnCreep([WORK, CARRY, MOVE], `emergency_harvester_${Game.time}`, {
                memory: { role: 'harvester', emergency: true }
            });
            
            if (result === OK) {
                console.log('✅ EMERGENCY HARVESTER SPAWNED!');
                return;
            } else {
                console.log(`❌ Harvester spawn failed: ${result}`);
            }
        }
        
        // Priority 2: Emergency Soldier (130 energy)
        if (soldiers < 2 && energy >= 130) {
            console.log('🔥 SPAWNING EMERGENCY SOLDIER');
            const result = spawn.spawnCreep([ATTACK, MOVE], `emergency_soldier_${Game.time}`, {
                memory: { role: 'soldier', emergency: true }
            });
            
            if (result === OK) {
                console.log('✅ EMERGENCY SOLDIER SPAWNED!');
                return;
            } else {
                console.log(`❌ Soldier spawn failed: ${result}`);
            }
        }
        
        // Priority 3: Another Soldier (130 energy)
        if (soldiers < 3 && energy >= 130) {
            console.log('🔥 SPAWNING SECOND EMERGENCY SOLDIER');
            const result = spawn.spawnCreep([ATTACK, MOVE], `emergency_soldier2_${Game.time}`, {
                memory: { role: 'soldier', emergency: true }
            });
            
            if (result === OK) {
                console.log('✅ SECOND EMERGENCY SOLDIER SPAWNED!');
                return;
            } else {
                console.log(`❌ Second soldier spawn failed: ${result}`);
            }
        }
        
        // Priority 4: Emergency Ranged (200 energy)
        if (ranged < 1 && energy >= 200) {
            console.log('🔥 SPAWNING EMERGENCY RANGED');
            const result = spawn.spawnCreep([RANGED_ATTACK, MOVE], `emergency_ranged_${Game.time}`, {
                memory: { role: 'ranged', emergency: true }
            });
            
            if (result === OK) {
                console.log('✅ EMERGENCY RANGED SPAWNED!');
                return;
            } else {
                console.log(`❌ Ranged spawn failed: ${result}`);
            }
        }
        
        // Priority 5: Emergency Healer (300 energy)
        if (healers < 1 && energy >= 300) {
            console.log('🔥 SPAWNING EMERGENCY HEALER');
            const result = spawn.spawnCreep([HEAL, MOVE], `emergency_healer_${Game.time}`, {
                memory: { role: 'healer', emergency: true }
            });
            
            if (result === OK) {
                console.log('✅ EMERGENCY HEALER SPAWNED!');
                return;
            } else {
                console.log(`❌ Healer spawn failed: ${result}`);
            }
        }
        
        // Priority 6: More Harvesters (200 energy each)
        if (harvesters < 3 && energy >= 200) {
            console.log('🔥 SPAWNING ADDITIONAL HARVESTER');
            const result = spawn.spawnCreep([WORK, CARRY, MOVE], `emergency_harvester${harvesters}_${Game.time}`, {
                memory: { role: 'harvester', emergency: true }
            });
            
            if (result === OK) {
                console.log('✅ ADDITIONAL HARVESTER SPAWNED!');
                return;
            } else {
                console.log(`❌ Additional harvester spawn failed: ${result}`);
            }
        }
        
        console.log('⏳ Waiting for more energy to spawn emergency units...');
        
    } catch (error) {
        console.log(`💀 EMERGENCY REBIRTH ERROR: ${error.message}`);
    }
};