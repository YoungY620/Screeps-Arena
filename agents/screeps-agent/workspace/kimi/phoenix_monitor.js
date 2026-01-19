// PHOENIX MONITOR - Track emergency rebirth progress
const http = require('http');

class PhoenixMonitor {
    constructor() {
        this.token = null;
        this.lastCheck = 0;
        this.phoenixData = {
            startTime: Date.now(),
            gameStartTick: null,
            currentTick: null,
            forceSize: 0,
            energyLevel: 0,
            spawnStatus: 'UNKNOWN',
            phase: 'CRITICAL',
            threats: 0
        };
    }

    async authenticate() {
        return new Promise((resolve, reject) => {
            const postData = JSON.stringify({
                email: "kimi@test.com",
                password: "password"
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
                            console.log('🔐 Phoenix Monitor Authenticated');
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

    async getGameTime() {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: 'localhost',
                port: 21025,
                path: '/api/game/time',
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
                        resolve(response.time || null);
                    } catch (e) {
                        console.log('Game time error:', e.message);
                        resolve(null);
                    }
                });
            });

            req.on('error', (e) => {
                console.error(`Game time error: ${e.message}`);
                resolve(null);
            });

            req.end();
        });
    }

    async getRoomStatus(roomName = 'W1N3') {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: 'localhost',
                port: 21025,
                path: `/api/game/room-objects`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Token': this.token,
                    'X-Username': 'kimi'
                }
            };

            const postData = JSON.stringify({
                rooms: [roomName]
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
                        console.log('Room status error:', e.message);
                        resolve(null);
                    }
                });
            });

            req.on('error', (e) => {
                console.error(`Room status error: ${e.message}`);
                resolve(null);
            });

            req.write(postData);
            req.end();
        });
    }

    async getBattlefieldIntel() {
        return new Promise((resolve) => {
            // Use CLI approach for more reliable data
            const { exec } = require('child_process');
            
            exec('docker exec screeps node -e \'const net = require("net"); const c = new net.Socket(); let out = "", ready = false; c.connect(21026, "localhost"); c.on("data", d => { out += d; if (!ready && out.includes("< ")) { ready = true; out = ""; c.write("storage.db[\\"rooms.objects\\"].find({room: \\"W1N3\\", user: \\"171c453f16af42e\\"}).then(myObjects=>{const creeps = myObjects.filter(o=>o.type===\\"creep\\"); const spawns = myObjects.filter(o=>o.type===\\"spawn\\"); const energy = spawns.length > 0 ? spawns[0].store.energy : 0; print(JSON.stringify({creeps: creeps.length, energy: energy, spawnAlive: spawns.length > 0}));})\\n"); } if (ready && out.includes("{\"creeps\"")) { console.log(out.split("\\n").filter(l=>!l.startsWith("< ")).join("\\n")); c.destroy(); } }); setTimeout(() => process.exit(0), 3000);\'', (error, stdout, stderr) => {
                if (error) {
                    console.log('CLI intel error:', error.message);
                    resolve(null);
                    return;
                }
                
                try {
                    const lines = stdout.split('\n').filter(line => line.includes('{"creeps"'));
                    if (lines.length > 0) {
                        const data = JSON.parse(lines[0]);
                        resolve(data);
                    } else {
                        resolve(null);
                    }
                } catch (e) {
                    console.log('Parse error:', e.message);
                    resolve(null);
                }
            });
        });
    }

    analyzePhase(forceSize, energyLevel) {
        if (forceSize < 3) return 'CRITICAL';
        if (forceSize < 10) return 'RECOVERY';
        if (forceSize < 20) return 'OFFENSIVE';
        return 'DOMINANCE';
    }

    getThreatLevel(enemyCount, allyCount) {
        const ratio = enemyCount / Math.max(allyCount, 1);
        if (ratio > 10) return 'EXTINCTION';
        if (ratio > 5) return 'CRITICAL';
        if (ratio > 3) return 'HIGH';
        if (ratio > 1) return 'MEDIUM';
        if (ratio > 0.5) return 'LOW';
        return 'MINIMAL';
    }

    async collectIntelligence() {
        const intel = await this.getBattlefieldIntel();
        if (!intel) {
            console.log('🚫 Intelligence gathering failed');
            return null;
        }

        this.phoenixData.forceSize = intel.creeps || 0;
        this.phoenixData.energyLevel = intel.energy || 0;
        this.phoenixData.spawnStatus = intel.spawnAlive ? 'ALIVE' : 'DESTROYED';
        this.phoenixData.phase = this.analyzePhase(intel.creeps, intel.energy);
        
        return this.phoenixData;
    }

    async runIntelligenceReport() {
        console.log('\n' + '='.repeat(60));
        console.log('🔥 PHOENIX INTELLIGENCE REPORT');
        console.log('='.repeat(60));
        
        if (!this.token) {
            await this.authenticate();
        }

        const intel = await this.collectIntelligence();
        
        if (!intel) {
            console.log('❌ Phoenix intelligence unavailable');
            return;
        }

        const runtime = Date.now() - this.phoenixData.startTime;
        const survivalMinutes = Math.floor(runtime / 60000);
        const survivalSeconds = Math.floor((runtime % 60000) / 1000);

        console.log(`⏰ Report Time: ${new Date().toLocaleTimeString()}`);
        console.log(`🕐 Survival Runtime: ${survivalMinutes}m ${survivalSeconds}s`);
        console.log('');
        
        console.log('⚔️ FORCE STATUS:');
        console.log(`   Current Force: ${intel.forceSize} creeps`);
        console.log(`   Energy Level: ${intel.energyLevel} units`);
        console.log(`   Spawn Status: ${intel.spawnStatus}`);
        console.log(`   Phoenix Phase: ${intel.phase}`);
        console.log('');
        
        // Phase-specific analysis
        switch (intel.phase) {
            case 'CRITICAL':
                console.log('🚨 CRITICAL ANALYSIS:');
                console.log('   • Force size critically low');
                console.log('   • Prioritizing emergency survival');
                console.log('   • Focus on harvesters and basic defense');
                if (intel.forceSize === 0) {
                    console.log('   • ⚠️  TOTAL CREEP LOSS DETECTED');
                    console.log('   • 🔄 Emergency rebirth protocol active');
                }
                break;
                
            case 'RECOVERY':
                console.log('🔄 RECOVERY ANALYSIS:');
                console.log('   • Force rebuilding in progress');
                console.log('   • Balancing economy and military');
                console.log('   • Target: 10+ total creeps');
                break;
                
            case 'OFFENSIVE':
                console.log('⚡ OFFENSIVE ANALYSIS:');
                console.log('   • Strong force established');
                console.log('   • Ready for counter-attacks');
                console.log('   • Target: 20+ total creeps');
                break;
                
            case 'DOMINANCE':
                console.log('👑 DOMINANCE ANALYSIS:');
                console.log('   • Superior force achieved');
                console.log('   • Launch coordinated attacks');
                console.log('   • Expand territory control');
                break;
        }
        
        console.log('');
        console.log('📊 STRATEGIC RECOMMENDATIONS:');
        
        if (intel.forceSize === 0) {
            console.log('   🎯 IMMEDIATE ACTIONS:');
            console.log('   • Spawn emergency harvester (200 energy)');
            console.log('   • Build basic military defense');
            console.log('   • Secure energy sources');
            console.log('   • Monitor for enemy threats');
        } else if (intel.phase === 'CRITICAL') {
            console.log('   🎯 CRITICAL PRIORITIES:');
            console.log('   • Minimum 3 harvesters for energy');
            console.log('   • 2+ soldiers for basic defense');
            console.log('   • 1 healer for sustainability');
            console.log('   • Avoid unnecessary risks');
        } else if (intel.phase === 'RECOVERY') {
            console.log('   🎯 RECOVERY OBJECTIVES:');
            console.log('   • Reach 10 total creeps');
            console.log('   • Balance economy (4 harvesters)');
            console.log('   • Build military core (4+ soldiers)');
            console.log('   • Construct defensive towers');
        }
        
        console.log('');
        console.log('⚡ ENERGY STRATEGY:');
        if (intel.energyLevel < 200) {
            console.log('   🔴 Energy Critical - Prioritize harvesters');
        } else if (intel.energyLevel < 500) {
            console.log('   🟡 Energy Low - Cautious expansion');
        } else {
            console.log('   🟢 Energy Good - Aggressive building');
        }
        
        console.log('='.repeat(60));
        
        return intel;
    }

    async continuousMonitoring(interval = 15000) {
        console.log('🔄 Starting Phoenix continuous monitoring...');
        
        while (true) {
            try {
                await this.runIntelligenceReport();
                console.log(`\n⏳ Next Phoenix report in ${interval/1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, interval));
            } catch (error) {
                console.log(`❌ Phoenix monitoring error: ${error.message}`);
                await new Promise(resolve => setTimeout(resolve, 5000)); // Retry in 5 seconds
            }
        }
    }
}

// Run Phoenix intelligence report
const monitor = new PhoenixMonitor();
monitor.runIntelligenceReport().then(() => {
    console.log('📊 Phoenix intelligence complete');
}).catch(err => {
    console.log('❌ Phoenix intelligence failed:', err.message);
});