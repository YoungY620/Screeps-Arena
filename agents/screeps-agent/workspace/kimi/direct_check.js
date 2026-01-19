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
      console.log('Raw response:', JSON.stringify(response));
    });
    
    client.on('error', reject);
    
    setTimeout(() => {
      client.destroy();
      resolve(response);
    }, 1000);
  });
}

async function checkBasicInfo() {
  try {
    console.log('🔍 Checking basic game info...');
    
    // Try to get game time
    const result = await cliQuery('storage.env.get("gameTime")');
    console.log('Result:', result);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkBasicInfo();