// API-based game state check
const http = require('http');

function getGameStatus() {
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
                        console.log('✅ Authentication successful');
                        resolve(response.token);
                    } else {
                        console.log('❌ Authentication failed:', response);
                        resolve(null);
                    }
                } catch (e) {
                    console.log('Auth response error:', e.message);
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

function apiRequest(token, path) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 21025,
            path: path,
            method: 'GET',
            headers: {
                'X-Token': token,
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
                    console.log(`API error for ${path}:`, e.message);
                    resolve(null);
                }
            });
        });

        req.on('error', (e) => {
            console.error(`API request error for ${path}: ${e.message}`);
            resolve(null);
        });

        req.end();
    });
}

async function comprehensiveCheck() {
    console.log('🎮 Starting comprehensive PvP game state check...\n');
    
    const token = await getGameStatus();
    if (!token) {
        console.log('❌ Could not authenticate');
        return;
    }
    
    console.log('🔑 Token obtained:', token.substring(0, 10) + '...\n');
    
    try {
        // 1. Get game time
        console.log('1️⃣ Getting game time...');
        const gameTime = await apiRequest(token, '/api/game/time');
        console.log('Game Time:', gameTime ? gameTime.time : 'Unknown');
        
        // 2. Get room status
        console.log('\n2️⃣ Getting room W1N3 status...');
        const roomStatus = await apiRequest(token, '/api/game/room-status?room=W1N3');
        console.log('Room W1N3 Status:', roomStatus || 'No data');
        
        // 3. Get room objects
        console.log('\n3️⃣ Getting room W1N3 objects...');
        const roomObjects = await apiRequest(token, '/api/game/room-objects?room=W1N3');
        console.log('Room W1N3 Objects:', roomObjects ? JSON.stringify(roomObjects, null, 2) : 'No data');
        
        // 4. Get room terrain
        console.log('\n4️⃣ Getting room W1N3 terrain...');
        const roomTerrain = await apiRequest(token, '/api/game/room-terrain?room=W1N3&encoded=1');
        console.log('Room W1N3 Terrain:', roomTerrain ? 'Available' : 'No data');
        
        // 5. Get user info
        console.log('\n5️⃣ Getting user info...');
        const userInfo = await apiRequest(token, '/api/user/me');
        console.log('User Info:', userInfo ? JSON.stringify(userInfo, null, 2) : 'No data');
        
        // 6. Get world status
        console.log('\n6️⃣ Getting world status...');
        const worldStatus = await apiRequest(token, '/api/user/world-status');
        console.log('World Status:', worldStatus || 'No data');
        
        console.log('\n✅ Comprehensive check complete!');
        
    } catch (error) {
        console.error('❌ Error during comprehensive check:', error.message);
    }
}

comprehensiveCheck();