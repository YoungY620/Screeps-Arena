const net = require('net');
const client = new net.Socket();
let querySent = false;

client.connect(21026, 'localhost');

client.on('data', (data) => {
  const str = data.toString();
  
  if (!querySent && str.includes('< ')) {
    querySent = true;
    console.log('Checking for GPT creeps...');
    client.write('storage.db.creeps.count({user: "b331714fa09c566"})\n');
  }
  
  // Look for numbers (creep count)
  if (str.match(/^\s*\d+\s*$/)) {
    console.log('GPT Creep Count:', str.trim());
  }
});

setTimeout(() => {
  client.end();
}, 5000);