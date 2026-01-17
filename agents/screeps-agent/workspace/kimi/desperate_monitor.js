const net = require('net');
const client = new net.Socket();
let output = '';
let querySent = false;

client.connect(21026, 'localhost');

client.on('data', (data) => {
  const str = data.toString();
  output += str;
  
  if (!querySent && str.includes('< ')) {
    querySent = true;
    console.log('=== ULTRA-SIMPLE FINAL DESPERATE STAND MONITOR ===');
    console.log('Checking for desperate activity...');
    
    // Check game time and desperate creeps
    client.write('console.log("Current Game Time:", Game.time)\n');
    client.write('storage.db.creeps.find({user: "b331714fa09c566"}).toArray().then(creeps => {\n');
    client.write('  console.log("Total GPT Creeps:", creeps.length);\n');
    client.write('  const desperateCreeps = creeps.filter(c => \n');
    client.write('    c.name.includes("desperate") || c.name.includes("final") || c.name.includes("ultra")\n');
    client.write('  );\n');
    client.write('  console.log("Desperate Creeps Found:", desperateCreeps.length);\n');
    client.write('  desperateCreeps.forEach(c => {\n');
    client.write('    console.log("DESPERATE UNIT:", c.name, "Type:", c.type, "Room:", c.room);\n');
    client.write('  });\n');
    client.write('}).catch(e => console.log("Error checking creeps:", e.message))\n');
  }
  
  // Print any output that contains our keywords
  if (str.includes('Current Game Time:') || str.includes('Total GPT Creeps:') || str.includes('Desperate Creeps Found:') || str.includes('DESPERATE UNIT:')) {
    console.log(str.trim());
  }
});

client.on('close', () => {
  console.log('=== MONITORING COMPLETE ===');
});

setTimeout(() => {
  if (client.readyState !== 'closed') {
    client.end();
  }
}, 10000);