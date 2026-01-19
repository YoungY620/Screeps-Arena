const net = require('net');

function queryStorage(command) {
  return new Promise((resolve, reject) => {
    const client = new net.Socket();
    let response = '';
    let connected = false;
    
    client.connect(21026, 'localhost', () => {
      connected = true;
      console.log('Connected to storage CLI');
      client.write(command + '\n');
    });
    
    client.on('data', (data) => {
      response += data.toString();
      console.log('Data received:', response);
      
      // Check if we got a complete response
      if (response.includes('>') && response.includes('\n')) {
        const lines = response.split('\n');
        const resultLine = lines.find(line => line.includes(':') && !line.includes('storage') && !line.includes('>'));
        if (resultLine) {
          resolve(resultLine.trim());
          client.destroy();
        }
      }
    });
    
    client.on('error', (err) => {
      reject(err);
    });
    
    setTimeout(() => {
      if (connected) {
        client.destroy();
        resolve(response);
      }
    }, 2000);
  });
}

async function checkGameState() {
  try {
    console.log('🎮 Checking current game state...');
    
    // Get game time
    const gameTime = await queryStorage('storage.env.get("gameTime")');
    console.log('Game time:', gameTime);
    
    // Get user data
    const users = await queryStorage('storage.db.users.find({})');
    console.log('Users:', users);
    
  } catch (error) {
    console.error('Error checking game state:', error.message);
  }
}

checkGameState();