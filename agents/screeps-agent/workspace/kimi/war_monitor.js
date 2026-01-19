// WAR MONITOR - Real-time battlefield intelligence
const http = require('http');

class WarMonitor {
    constructor() {
        this.token = null;
        this.lastUpdate = 0;
        this.enemyData = [];
        this.myData = [];
        this.warStats = {
            totalEnemies: 0,
            totalAllies: 0,
            forceRatio: 0,
            threatLevel: 'LOW',
            recommendedAction: 'BUILDUP'
        };
    }

    async authenticate() {
        return new Promise((resolve, reject) => {
            const postData = JSON.stringify({
                email: "kimi",
                kimi123: "password"
            });

            const options = {
                hostname: 'localhost',
                port: 21025,
                path: '/api/auth/signin',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData)
                }
            };

            const req = http.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                
                res.on('end', () => {
                    try {
                        const response = JSON.parse(data);
                        if (response.token) {
                            this.token = response.token;
                            console.log('🔐 War Monitor Authenticated');
                            resolve(response.token);
                        } else {
                            console.log('❌ Authentication failed');
                            resolve(null);
                        }
                    } catch (e) {
                        console.log('Auth error:', e.message);
                        resolve(null);
                    }
                });
            });

            req.on('error', (e) => {
                console.error(`Auth error: ${e.message}`);
                resolve(null);
            });

            req.write(postData);
            req.end();
        });
    }

    async getBattlefieldIntel() {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: 'localhost',
                port: 21025,
                path: '/api/game/room-objects',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Token': this.token,
                    'X-Username': 'kimi'
                }
            };

            // Get multiple rooms for broader intel
            const postData = JSON.stringify({
                rooms: ['W1N1', 'W1N2', 'W1N3', 'W1N4', 'W2N3', 'W0N3']
            });

            const req = http.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                
                res.on('end', () => {
                    try {
                        const response = JSON.parse(data);
                        resolve(response);
                    } catch (e) {
                        console.log('Intel error:', e.message);
                        resolve(null);
                    }
                });
            });

            req.on('error', (e) => {
                console.error(`Intel error: ${e.message}`);
                resolve(null);
            });

            req.write(postData);
            req.end();
        });
    }

    async getWorldStatus() {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: 'localhost',
                port: 21025,
                path: '/api/user/world-status',
                method: 'GET',
                headers: {
                    'X-Token': this.token,
                    'X-Username': 'kimi'
                }
            };

            const req = http.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                
                res.on('end', () => {
                    try {
                        const response = JSON.parse(data);
                        resolve(response);
                    } catch (e) {
                        console.log('World status error:', e.message);
                        resolve(null);
                    }
                });
            });

            req.on('error', (e) => {
                console.error(`World status error: ${e.message}`);
                resolve(null);
            });

            req.end();
        });
    }

    analyzeThreatLevel(enemies, allies) {
        const ratio = enemies / Math.max(allies, 1);
        
        if (ratio > 3) return 'CRITICAL';
        if (ratio > 2) return 'HIGH';
        if (ratio > 1) return 'MEDIUM';
        if (ratio > 0.5) return 'LOW';
        return 'MINIMAL';
    }

    getRecommendedAction(threatLevel, forceRatio) {
        switch (threatLevel) {
            case 'CRITICAL':
                return 'EMERGENCY DEFENSE - Build maximum military NOW!';
            case 'HIGH':
                return 'DEFENSIVE BUILDUP - Prioritize soldiers and towers';
            case 'MEDIUM':
                return 'BALANCED GROWTH - Economy + military equally';
            case 'LOW':
                return 'ECONOMIC FOCUS - Expand economy, maintain defense';
            case 'MINIMAL':
                return 'AGGRESSIVE EXPANSION - Full economy, prepare for attack';
            default:
                return 'UNKNOWN - Gather more intelligence';
        }
    }

    async analyzeBattlefield() {
        const intel = await this.getBattlefieldIntel();
        const worldStatus = await this.getWorldStatus();
        
        if (!intel || !intel.rooms) {
            console.log('🚫 Battlefield intel unavailable');
            return null;
        }

        let totalEnemies = 0;
        let totalAllies = 0;
        let enemyRooms = [];
        let allyRooms = [];
        let contestedRooms = [];

        // Analyze each room
        for (let roomData of intel.rooms) {
            if (!roomData.objects) continue;

            let roomEnemies = 0;
            let roomAllies = 0;

            for (let obj of roomData.objects) {
                if (obj.type === 'creep') {
                    if (obj.user && obj.user !== '171c453f16af42e') {
                        roomEnemies++;
                        totalEnemies++;
                    } else if (obj.user === '171c453f16af42e') {
                        roomAllies++;
                        totalAllies++;
                    }
                }
            }

            if (roomEnemies > 0 && roomAllies > 0) {
                contestedRooms.push({
                    room: roomData.room,
                    enemies: roomEnemies,
                    allies: roomAllies,
                    ratio: roomEnemies / Math.max(roomAllies, 1)
                });
            } else if (roomEnemies > 0) {
                enemyRooms.push({
                    room: roomData.room,
                    enemies: roomEnemies
                });
            } else if (roomAllies > 0) {
                allyRooms.push({
                    room: roomData.room,
                    allies: roomAllies
                });
            }
        }

        const forceRatio = totalEnemies / Math.max(totalAllies, 1);
        const threatLevel = this.analyzeThreatLevel(totalEnemies, totalAllies);
        const recommendedAction = this.getRecommendedAction(threatLevel, forceRatio);

        const analysis = {
            timestamp: Date.now(),
            gameStatus: worldStatus,
            totalEnemies,
            totalAllies,
            forceRatio: forceRatio.toFixed(2),
            threatLevel,
            recommendedAction,
            enemyRooms: enemyRooms.length,
            allyRooms: allyRooms.length,
            contestedRooms: contestedRooms.length,
            contestedDetails: contestedRooms,
            enemyDetails: enemyRooms,
            allyDetails: allyRooms
        };

        this.warStats = analysis;
        return analysis;
    }

    async runIntelligenceReport() {
        console.log('🕵️ WAR INTELLIGENCE REPORT');
        console.log('='.repeat(50));
        
        if (!this.token) {
            await this.authenticate();
        }

        const analysis = await this.analyzeBattlefield();
        
        if (!analysis) {
            console.log('❌ Intelligence gathering failed');
            return;
        }

        console.log(`⏰ Report Time: ${new Date(analysis.timestamp).toLocaleTimeString()}`);
        console.log(`🎮 Game Status: ${analysis.gameStatus ? analysis.gameStatus.status : 'Unknown'}`);
        console.log('');
        
        console.log('⚔️ FORCE ANALYSIS:');
        console.log(`   Enemy Forces: ${analysis.totalEnemies} hostiles`);
        console.log(`   Allied Forces: ${analysis.totalAllies} units`);
        console.log(`   Force Ratio: ${analysis.forceRatio}:1`);
        console.log(`   Threat Level: ${analysis.threatLevel} 🔴`);
        console.log('');
        
        console.log('🗺️ TERRITORIAL CONTROL:');
        console.log(`   Enemy Controlled Rooms: ${analysis.enemyRooms}`);
        console.log(`   Allied Controlled Rooms: ${analysis.allyRooms}`);
        console.log(`   Contested Rooms: ${analysis.contestedRooms}`);
        console.log('');
        
        if (analysis.contestedDetails.length > 0) {
            console.log('🔥 CONTESTED ZONES:');
            analysis.contestedDetails.forEach(zone => {
                console.log(`   ${zone.room}: ${zone.enemies}E vs ${zone.allies}A (Ratio: ${zone.ratio.toFixed(1)}:1)`);
            });
            console.log('');
        }
        
        console.log('📋 STRATEGIC RECOMMENDATION:');
        console.log(`   ${analysis.recommendedAction}`);
        console.log('');
        
        // Specific tactical advice
        if (analysis.threatLevel === 'CRITICAL') {
            console.log('🚨 IMMEDIATE ACTIONS REQUIRED:');
            console.log('   • Switch to emergency defense protocol');
            console.log('   • Build maximum military units');
            console.log('   • Construct defensive towers');
            console.log('   • Consider strategic retreat if overwhelmed');
        } else if (analysis.threatLevel === 'HIGH') {
            console.log('⚠️ DEFENSIVE PRIORITIES:');
            console.log('   • Increase military production');
            console.log('   • Build defensive structures');
            console.log('   • Maintain economy for sustained defense');
        } else if (analysis.threatLevel === 'MEDIUM') {
            console.log('⚖️ BALANCED APPROACH:');
            console.log('   • Continue economic development');
            console.log('   • Build military at steady pace');
            console.log('   • Scout enemy positions');
        } else if (analysis.threatLevel === 'LOW') {
            console.log('📈 EXPANSION OPPORTUNITY:');
            console.log('   • Focus on economic growth');
            console.log('   • Build moderate defense');
            console.log('   • Prepare for future offensives');
        }
        
        console.log('='.repeat(50));
    }

    async continuousMonitoring(interval = 30000) {
        console.log('🔄 Starting continuous battlefield monitoring...');
        
        while (true) {
            try {
                await this.runIntelligenceReport();
                console.log(`\n⏳ Next intelligence update in ${interval/1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, interval));
            } catch (error) {
                console.log(`❌ Monitoring error: ${error.message}`);
                await new Promise(resolve => setTimeout(resolve, 10000)); // Retry in 10 seconds
            }
        }
    }
}

// Run intelligence report
const monitor = new WarMonitor();
monitor.runIntelligenceReport().then(() => {
    console.log('📊 Intelligence report complete');
}).catch(err => {
    console.log('❌ Intelligence failed:', err.message);
});