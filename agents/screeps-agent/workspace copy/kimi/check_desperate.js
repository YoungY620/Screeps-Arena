const net = require('net');
const client = new net.Socket();
let output = '';

client.connect(21026, 'localhost');

client.on('data', (data) => {
  const str = data.toString();
  output += str;
  
  if (str.includes('< ')) {
    console.log('=== CHECKING FOR ULTRA-SIMPLE FINAL DESPERATE STAND ===');
    
    // Check for desperate creeps
    client.write('storage.db.creeps.find({user: "b331714fa09c566"}).toArray()\n');
  }
  
  // Look for any output that might contain creep data
  if (str.includes('[') || str.includes('{')) {
    console.log('RAW DATA:', str.trim());
    
    // Try to parse if it looks like JSON
    if (str.includes('name') && str.includes('type')) {
      console.log('POTENTIAL CREEP DATA DETECTED!');
    }
  }
});

client.on('close', () => {
  console.log('Check complete');
});

setTimeout(() => {
  if (client.readyState !== 'closed') {
    client.end();
  }
}, 15000);