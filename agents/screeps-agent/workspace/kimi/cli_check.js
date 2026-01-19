const net = require('net');
const client = new net.Socket();

client.connect(21026, 'localhost', () => {
  console.log('Connected to CLI');
  
  // Try to get game time
  client.write('storage.env.get("gameTime")\n');
  
  // Set a timeout to close connection
  setTimeout(() => {
    client.destroy();
  }, 3000);
});

let buffer = '';
client.on('data', (data) => {
  buffer += data.toString();
  console.log('Received data:', buffer);
  
  // Look for the prompt or response
  if (buffer.includes('>')) {
    console.log('Got prompt, trying command...');
  }
});

client.on('error', (err) => {
  console.error('Connection error:', err.message);
});

client.on('close', () => {
  console.log('Connection closed');
});