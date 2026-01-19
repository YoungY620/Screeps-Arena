// GPT PvP Agent - Game State Monitor
// This script monitors game state and provides tactical updates

const MONITOR_CONFIG = {
    checkInterval: 10, // Check every 10 ticks
    alertThreshold: 2, // Alert if threats detected
    logLevel: 'detailed' // basic, detailed, verbose
};

function analyzeGameState() {
    const report = {
        timestamp: Game.time,
        rooms: {},
        military: {},
        economy: {},
        threats: {},
        recommendations: []
    };
    
    // Analyze each room
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        const controller = room.controller;
        
        // Room basics
        report.rooms[roomName] = {
            level: controller ? controller.level : 0,
            energyAvailable: room.energyAvailable,
            energyCapacity: room.energyCapacityAvailable,
            sources: room.find(FIND_SOURCES).length,
            spawns: room.find(FIND_MY_SPAWNS).length,
            towers: room.find(FIND_MY_STRUCTURES, {
                filter: s => s.structureType === STRUCTURE_TOWER
            }).length,
            extensions: room.find(FIND_MY_STRUCTURES, {
                filter: s => s.structureType === STRUCTURE_EXTENSION
            }).length
        };
        
        // Military analysis
        const militaryCreeps = room.find(FIND_MY_CREEPS, {
            filter: c => ['defender', 'attacker', 'ranger', 'healer'].includes(c.memory.role)
        });
        
        const enemyCreeps = room.find(FIND_HOSTILE_CREEPS).filter(c => 
            c.owner.username !== 'Source Keeper'
        );
        
        report.military[roomName] = {
            friendly: militaryCreeps.length,
            hostile: enemyCreeps.length,
            threatLevel: calculateThreatLevel(enemyCreeps),
            defenseStrength: calculateDefenseStrength(room)
        };
        
        // Economic analysis
        const harvesters = room.find(FIND_MY_CREEPS, {
            filter: c => c.memory.role === 'harvester'
        });
        
        const upgraders = room.find(FIND_MY_CREEPS, {
            filter: c => c.memory.role === 'upgrader'
        });
        
        report.economy[roomName] = {
            harvesters: harvesters.length,
            upgraders: upgraders.length,
            totalCreeps: room.find(FIND_MY_CREEPS).length,
            controllerProgress: controller ? controller.progress : 0,
            controllerProgressTotal: controller ? controller.progressTotal : 0
        };
        
        // Threat assessment
        report.threats[roomName] = {
            immediate: enemyCreeps.length > 0,
            enemyStructures: room.find(FIND_HOSTILE_STRUCTURES).length,
            adjacentThreats: 0, // Will be populated by scout reports
            recommendedAction: getRecommendedAction(room, enemyCreeps.length, militaryCreeps.length)
        };
    }
    
    // Global statistics
    report.global = {
        totalCreeps: Object.keys(Game.creeps).length,
        totalRooms: Object.keys(Game.rooms).length,
        totalSpawns: Object.keys(Game.spawns).length,
        gamePhase: determineGamePhase(report),
        overallThreat: calculateOverallThreat(report),
        strategicPriority: determineStrategicPriority(report)
    };
    
    return report;
}

function calculateThreatLevel(enemies) {
    return enemies.reduce((threat, enemy) => {
        const attackParts = enemy.body.filter(part => 
            part.type === ATTACK || part.type === RANGED_ATTACK
        ).length;
        const healParts = enemy.body.filter(part => part.type === HEAL).length;
        return threat + (attackParts * 30) + (healParts * 50);
    }, 0);
}

function calculateDefenseStrength(room) {
    const towers = room.find(FIND_MY_STRUCTURES, {
        filter: s => s.structureType === STRUCTURE_TOWER
    });
    
    const defenders = room.find(FIND_MY_CREEPS, {
        filter: c => c.memory.role === 'defender'
    });
    
    return (towers.length * 100) + (defenders.length * 50);
}

function getRecommendedAction(room, enemies, defenders) {
    if (enemies > defenders) {
        return 'SPAWN_DEFENDERS_IMMEDIATELY';
    } else if (enemies > 0) {
        return 'ENGAGE_ENEMIES';
    } else {
        const harvesters = room.find(FIND_MY_CREEPS, {
            filter: c => c.memory.role === 'harvester'
        }).length;
        
        if (harvesters < 3) {
            return 'BUILD_ECONOMY';
        } else {
            return 'EXPAND_MILITARY';
        }
    }
}

function determineGamePhase(report) {
    const avgLevel = Object.values(report.rooms).reduce((sum, room) => sum + room.level, 0) / Object.keys(report.rooms).length;
    
    if (avgLevel <= 2) return 'EARLY';
    if (avgLevel <= 4) return 'MID';
    return 'LATE';
}

function calculateOverallThreat(report) {
    return Object.values(report.military).reduce((total, military) => total + military.threatLevel, 0);
}

function determineStrategicPriority(report) {
    const totalThreat = calculateOverallThreat(report);
    const totalMilitary = Object.values(report.military).reduce((sum, m) => sum + m.friendly, 0);
    
    if (totalThreat > 100) return 'DEFENSE';
    if (totalMilitary < 5) return 'MILITARY_BUILDUP';
    return 'EXPANSION';
}

function generateTacticalReport() {
    const report = analyzeGameState();
    
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║                 GPT PVP TACTICAL REPORT                      ║');
    console.log('║                     Tick: ' + String(report.timestamp).padStart(6, '0') + '                          ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    
    // Room status
    console.log('\n📍 ROOM STATUS:');
    for (const roomName in report.rooms) {
        const room = report.rooms[roomName];
        const military = report.military[roomName];
        const economy = report.economy[roomName];
        const threat = report.threats[roomName];
        
        console.log(`  ${roomName}:`);
        console.log(`    Level: ${room.level} | Energy: ${room.energyAvailable}/${room.energyCapacity}`);
        console.log(`    Military: ${military.friendly} friendly, ${military.hostile} hostile`);
        console.log(`    Economy: ${economy.harvesters} harvesters, ${economy.upgraders} upgraders`);
        console.log(`    Threat: ${military.threatLevel} | Defense: ${military.defenseStrength}`);
        console.log(`    Action: ${threat.recommendedAction}`);
    }
    
    // Global status
    console.log('\n🌍 GLOBAL STATUS:');
    console.log(`  Phase: ${report.global.gamePhase}`);
    console.log(`  Total Creeps: ${report.global.totalCreeps}`);
    console.log(`  Overall Threat: ${report.global.overallThreat}`);
    console.log(`  Strategic Priority: ${report.global.strategicPriority}`);
    
    // Alerts
    if (report.global.overallThreat > MONITOR_CONFIG.alertThreshold * 50) {
        console.log('\n🚨 ALERT: HIGH THREAT DETECTED!');
        console.log('Immediate defensive action required!');
    }
    
    if (report.global.totalCreeps < 3) {
        console.log('\n⚠️  WARNING: CRITICAL CREEP SHORTAGE!');
        console.log('Emergency spawning required!');
    }
    
    // Recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    const recommendations = generateRecommendations(report);
    recommendations.forEach(rec => console.log(`  • ${rec}`));
    
    console.log('\n' + '='.repeat(64));
}

function generateRecommendations(report) {
    const recommendations = [];
    
    // Threat-based recommendations
    if (report.global.overallThreat > 100) {
        recommendations.push('IMMEDIATE: Spawn defenders in all threatened rooms');
        recommendations.push('URGENT: Build towers for automated defense');
    }
    
    // Economic recommendations
    const totalHarvesters = Object.values(report.economy).reduce((sum, e) => sum + e.harvesters, 0);
    if (totalHarvesters < 6) {
        recommendations.push('ECONOMY: Increase harvester production (target: 6+ total)');
    }
    
    const totalUpgraders = Object.values(report.economy).reduce((sum, e) => sum + e.upgraders, 0);
    if (totalUpgraders < 4) {
        recommendations.push('GROWTH: Build more upgraders for controller advancement');
    }
    
    // Military recommendations
    const totalMilitary = Object.values(report.military).reduce((sum, m) => sum + m.friendly, 0);
    if (totalMilitary < 4 && report.global.gamePhase !== 'EARLY') {
        recommendations.push('MILITARY: Build military force for defense and expansion');
    }
    
    // Phase-specific recommendations
    if (report.global.gamePhase === 'EARLY') {
        recommendations.push('EARLY GAME: Focus on economy and basic defense');
    } else if (report.global.gamePhase === 'MID') {
        recommendations.push('MID GAME: Begin military expansion and enemy scouting');
    } else {
        recommendations.push('LATE GAME: Launch coordinated attacks on enemies');
    }
    
    return recommendations;
}

// Export for use in main loop
module.exports = {
    generateReport: generateTacticalReport,
    analyzeGameState: analyzeGameState
};