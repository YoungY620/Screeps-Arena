// BATTLE MONITOR - Real-time PvP Intelligence
// Monitors game state and provides tactical updates

const MONITOR_VERSION = "2.0";
const CHECK_INTERVAL = 10; // Check every 10 seconds

// Battle state tracking
let battleState = {
    enemiesDetected: 0,
    lastEnemyContact: 0,
    militaryUnits: 0,
    economicUnits: 0,
    threatLevel: "LOW",
    lastUpdate: 0
};

// Enhanced monitoring with more detailed reporting
function monitorBattlefield() {
    console.log(`
🎯 BATTLEFIELD MONITOR v${MONITOR_VERSION} 🎯
=====================================`, "background: #ff0000; color: #ffffff; font-size: 16px;");
    
    try {
        // Check current game state
        const currentTime = Game.time;
        const myCreeps = Object.keys(Game.creeps).length;
        const mySpawns = Object.keys(Game.spawns).length;
        
        // Count military vs economic units
        let militaryCount = 0;
        let economicCount = 0;
        let scoutCount = 0;
        
        for (const name in Game.creeps) {
            const creep = Game.creeps[name];
            const role = creep.memory.role;
            
            if (['guard', 'attacker', 'ranger', 'healer'].includes(role)) {
                militaryCount++;
            } else if (['scout', 'saboteur'].includes(role)) {
                scoutCount++;
            } else {
                economicCount++;
            }
        }
        
        battleState.militaryUnits = militaryCount;
        battleState.economicUnits = economicCount;
        
        // Check for enemies in all visible rooms
        let totalEnemies = 0;
        let enemyRooms = [];
        let immediateThreats = [];
        
        for (const roomName in Game.rooms) {
            const room = Game.rooms[roomName];
            const enemies = room.find(FIND_HOSTILE_CREEPS);
            
            if (enemies.length > 0) {
                totalEnemies += enemies.length;
                enemyRooms.push(roomName);
                
                // Analyze threat level
                const dangerousEnemies = enemies.filter(e => 
                    e.getActiveBodyparts(ATTACK) > 0 || 
                    e.getActiveBodyparts(RANGED_ATTACK) > 0
                );
                
                if (dangerousEnemies.length > 0) {
                    immediateThreats.push({
                        room: roomName,
                        count: dangerousEnemies.length,
                        total: enemies.length
                    });
                }
            }
        }
        
        battleState.enemiesDetected = totalEnemies;
        
        // Determine threat level
        if (totalEnemies === 0) {
            battleState.threatLevel = "LOW";
        } else if (totalEnemies <= 3) {
            battleState.threatLevel = "MEDIUM";
        } else if (totalEnemies <= 6) {
            battleState.threatLevel = "HIGH";
        } else {
            battleState.threatLevel = "CRITICAL";
        }
        
        if (totalEnemies > 0) {
            battleState.lastEnemyContact = currentTime;
        }
        
        // Enhanced tactical report
        console.log(`⏰ Game Time: ${currentTime}`);
        console.log(`🏰 My Spawns: ${mySpawns}`);
        console.log(`👥 Total Creeps: ${myCreeps}`);
        console.log(`⚔️ Military Units: ${militaryCount} | 🏗️ Economic: ${economicCount} | 🔍 Scouts: ${scoutCount}`);
        console.log(`🎯 Threat Level: ${battleState.threatLevel}`);
        
        if (totalEnemies > 0) {
            console.log(`🚨 ENEMIES DETECTED: ${totalEnemies} hostile creeps`);
            console.log(`📍 Enemy Rooms: ${enemyRooms.join(', ')}`);
            
            if (immediateThreats.length > 0) {
                console.log(`⚡ IMMEDIATE THREATS:`);
                immediateThreats.forEach(threat => {
                    console.log(`   Room ${threat.room}: ${threat.count} dangerous / ${threat.total} total`);
                });
            }
        } else {
            console.log(`✅ No enemies detected - Building strength...`);
        }
        
        // Strategic recommendations
        if (totalEnemies > militaryCount * 2) {
            console.log(`🚨 CRITICAL: Need more military units!`);
        } else if (totalEnemies > 0 && militaryCount < totalEnemies) {
            console.log(`⚠️ WARNING: Military disadvantage - Spawn more guards!`);
        } else if (militaryCount > totalEnemies * 2) {
            console.log(`🚀 ADVANTAGE: Ready to launch counter-attack!`);
        }
        
        // Intelligence update
        if (Memory.invasionTargets && Memory.invasionTargets.length > 0) {
            console.log(`🎯 Known Enemy Bases: ${Memory.invasionTargets.join(', ')}`);
        }
        
        if (Memory.scoutedRooms) {
            const scoutedCount = Object.keys(Memory.scoutedRooms).length;
            console.log(`📡 Intelligence: ${scoutedCount} rooms scouted`);
        }
        
        // Resource status
        let totalEnergy = 0;
        let totalCapacity = 0;
        
        for (const roomName in Game.rooms) {
            const room = Game.rooms[roomName];
            if (room.controller && room.controller.my) {
                totalEnergy += room.energyAvailable;
                totalCapacity += room.energyCapacityAvailable;
            }
        }
        
        console.log(`⚡ Energy: ${totalEnergy}/${totalCapacity}`);
        
        battleState.lastUpdate = currentTime;
        
    } catch (error) {
        console.log(`❌ Monitor Error: ${error.message}`);
    }
    
    console.log(`=====================================
`);
}

// Emergency response system
function emergencyResponse() {
    const enemies = [];
    
    // Scan all rooms for immediate threats
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        const hostileCreeps = room.find(FIND_HOSTILE_CREEPS);
        
        if (hostileCreeps.length > 0) {
            const dangerousEnemies = hostileCreeps.filter(e => 
                e.getActiveBodyparts(ATTACK) > 0 || e.getActiveBodyparts(RANGED_ATTACK) > 0
            );
            
            enemies.push({
                room: roomName,
                total: hostileCreeps.length,
                dangerous: dangerousEnemies.length,
                enemies: hostileCreeps
            });
        }
    }
    
    if (enemies.length > 0) {
        console.log(`🚨 EMERGENCY ALERT: Active enemy incursions detected!`);
        
        // Trigger emergency spawn protocols
        for (const threat of enemies) {
            console.log(`⚡ Emergency response needed in ${threat.room}: ${threat.dangerous}/${threat.total} enemies`);
            
            const room = Game.rooms[threat.room];
            if (room && room.controller && room.controller.my) {
                const spawn = room.find(FIND_MY_SPAWNS)[0];
                if (spawn && !spawn.spawning) {
                    // Emergency military spawn
                    const guards = room.find(FIND_MY_CREEPS, {
                        filter: c => c.memory.role === 'guard'
                    });
                    
                    if (guards.length < threat.total * 3) {
                        console.log(`🚀 Emergency guard deployment needed in ${threat.room}`);
                    }
                }
            }
        }
    }
}

// Victory condition tracking
function checkVictoryConditions() {
    const allRooms = Object.keys(Game.rooms);
    const myRooms = allRooms.filter(roomName => {
        const room = Game.rooms[roomName];
        return room.controller && room.controller.my;
    });
    
    const enemyRooms = allRooms.filter(roomName => {
        const room = Game.rooms[roomName];
        return room.controller && !room.controller.my;
    });
    
    console.log(`🏆 DOMINION TRACKING:`);
    console.log(`   My Rooms: ${myRooms.length} (${myRooms.join(', ')})`);
    console.log(`   Enemy Rooms: ${enemyRooms.length} (${enemyRooms.join(', ')})`);
    
    if (myRooms.length === allRooms.length && allRooms.length > 0) {
        console.log(`🎉 TOTAL DOMINION ACHIEVED! 🎉`);
        return true;
    }
    
    return false;
}

// Main monitor loop
function runMonitor() {
    console.clear();
    monitorBattlefield();
    emergencyResponse();
    
    if (Game.time % 100 === 0) {
        checkVictoryConditions();
    }
    
    // Schedule next update
    setTimeout(runMonitor, CHECK_INTERVAL * 1000);
}

// Export for use in main loop
module.exports = {
    monitor: monitorBattlefield,
    emergency: emergencyResponse,
    victory: checkVictoryConditions,
    getState: () => battleState
};

// If running standalone
if (typeof Game !== 'undefined') {
    runMonitor();
}