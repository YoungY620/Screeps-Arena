// Monitor script to check game state
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
                        console.log('Authentication successful');
                        resolve(response.token);
                    } else {
                        console.log('Authentication failed:', response);
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

function checkWorldStatus(token) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 21025,
            path: '/api/user/world-status',
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
                    console.log('World status:', response);
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

async function monitor() {
    console.log('🎮 Starting game monitor...');
    
    const token = await getGameStatus();
    if (token) {
        console.log('Token obtained:', token.substring(0, 10) + '...');
        await checkWorldStatus(token);
    } else {
        console.log('❌ Could not authenticate');
    }
    
    console.log('Monitor complete');
}

monitor();