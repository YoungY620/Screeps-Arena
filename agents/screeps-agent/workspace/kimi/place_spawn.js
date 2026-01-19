// Script to place spawn in available room
const http = require('http');

const rooms = ['W1N1', 'W1N3', 'W3N1', 'W3N3', 'W5N1', 'W5N3', 'W5N5'];
const positions = [
    {x: 10, y: 10}, {x: 15, y: 15}, {x: 20, y: 20}, 
    {x: 25, y: 25}, {x: 30, y: 30}, {x: 35, y: 35}
];

const token = '825a47dc6595309b1be4598c11d6b276863b1590';

function tryPlaceSpawn(room, x, y) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            room: room,
            x: x,
            y: y,
            name: "Spawn1"
        });

        const options = {
            hostname: 'localhost',
            port: 21025,
            path: '/api/game/place-spawn',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
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
                const response = JSON.parse(data);
                console.log(`Trying ${room} at ${x},${y}: ${JSON.stringify(response)}`);
                
                if (response.ok === 1) {
                    console.log(`🎉 SUCCESS! Spawn placed in ${room} at ${x},${y}`);
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });

        req.on('error', (e) => {
            console.error(`Error trying ${room} at ${x},${y}: ${e.message}`);
            resolve(false);
        });

        req.write(postData);
        req.end();
    });
}

async function findAvailableSpawn() {
    for (let room of rooms) {
        for (let pos of positions) {
            const success = await tryPlaceSpawn(room, pos.x, pos.y);
            if (success) {
                console.log(`Spawn successfully placed!`);
                return;
            }
            // Small delay between attempts
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
    console.log('No available spawn locations found');
}

findAvailableSpawn();