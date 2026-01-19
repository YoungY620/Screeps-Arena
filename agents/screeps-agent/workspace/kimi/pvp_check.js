// Comprehensive PvP game state check
const net = require('net');

function cliQuery(command) {
    return new Promise((resolve, reject) => {
        const client = new net.Socket();
        let response = '';
        
        client.connect(21026, 'localhost', () => {
            console.log('Connected to CLI');
            client.write(command + '\n');
        });
        
        client.on('data', (data) => {
            response += data.toString();
        });
        
        client.on('error', reject);
        
        setTimeout(() => {
            client.destroy();
            // Clean up the response - remove CLI prompts and whitespace
            const cleaned = response.replace(/>/g, '').replace(/</g, '').trim();
            resolve(cleaned);
        }, 1000);
    });
}

async function checkGameState() {
    console.log('🎮 Starting comprehensive PvP check...\n');
    
    try {
        // 1. Get game time
        console.log('1️⃣ Getting current game time...');
        const gameTime = await cliQuery('storage.env.get("gameTime")');
        console.log('Game Time:', gameTime || 'Unknown');
        
        // 2. Check room W1N3 for objects
        console.log('\n2️⃣ Checking room W1N3 objects...');
        const roomObjects = await cliQuery('storage.db[{"$match": {"room": "W1N3"}}]');
        console.log('Room W1N3 objects:', roomObjects || 'No data');
        
        // 3. Check for hostile creeps in W1N3
        console.log('\n3️⃣ Checking for hostile creeps in W1N3...');
        const hostileCreeps = await cliQuery('storage.db[{"$match": {"room": "W1N3", "type": "creep", "user": {"$ne": "kimi"}}}]');
        console.log('Hostile creeps in W1N3:', hostileCreeps || 'None detected');
        
        // 4. Check for enemy spawns in W1N3
        console.log('\n4️⃣ Checking for enemy spawns in W1N3...');
        const enemySpawns = await cliQuery('storage.db[{"$match": {"room": "W1N3", "type": "spawn", "user": {"$ne": "kimi"}}}]');
        console.log('Enemy spawns in W1N3:', enemySpawns || 'None detected');
        
        // 5. Check for enemy towers in W1N3
        console.log('\n5️⃣ Checking for enemy towers in W1N3...');
        const enemyTowers = await cliQuery('storage.db[{"$match": {"room": "W1N3", "type": "tower", "user": {"$ne": "kimi"}}}]');
        console.log('Enemy towers in W1N3:', enemyTowers || 'None detected');
        
        // 6. Check nearby rooms for threats
        console.log('\n6️⃣ Checking nearby rooms for threats...');
        const nearbyRooms = ['W0N3', 'W2N3', 'W1N2', 'W1N4'];
        for (const room of nearbyRooms) {
            const threats = await cliQuery(`storage.db[{"$match": {"room": "${room}", "type": {"$in": ["spawn", "tower", "creep"]}, "user": {"$ne": "kimi"}}}]`);
            if (threats && threats.length > 0) {
                console.log(`🚨 Threats detected in ${room}:`, threats);
            } else {
                console.log(`✅ No threats in ${room}`);
            }
        }
        
        // 7. Get my structures in W1N3
        console.log('\n7️⃣ Checking my structures in W1N3...');
        const myStructures = await cliQuery('storage.db[{"$match": {"room": "W1N3", "user": "kimi"}}]');
        console.log('My structures in W1N3:', myStructures || 'None found');
        
        console.log('\n✅ PvP check complete!');
        
    } catch (error) {
        console.error('❌ Error during PvP check:', error.message);
    }
}

checkGameState();