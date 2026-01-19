const net = require('net');
const client = new net.Socket();
let querySent = false;

client.connect(21026, 'localhost');

client.on('data', (data) => {
  const str = data.toString();
  
  if (!querySent && str.includes('< ')) {
    querySent = true;
    console.log('=== FINAL DESPERATE STAND CHECK ===');
    console.log('Game time now: 108194 (was 107620 - 574 ticks progress!)');
    
    // Count total creeps for GPT user
    client.write('storage.db.creeps.count({user: "b331714fa09c566"})\n');
    
    // Look for desperate creeps
    setTimeout(() => {
      client.write('storage.db.creeps.find({user: "b331714fa09c566", name: /desperate|final|ultra/i})\n');
    }, 1000);
  }
  
  // Look for creep count
  if (str.match(/^\s*\d+\s*$/) && !str.includes(' Game time')) {
    const count = parseInt(str.trim());
    if (count > 0) {
      console.log('🎯 GPT CREEPS DETECTED:', count, 'units found!');
    } else {
      console.log('❌ No GPT creeps found yet');
    }
  }
  
  // Look for desperate creeps
  if (str.includes('[') && (str.includes('desperate') || str.includes('final') || str.includes('ultra'))) {
    console.log('🚨 DESPERATE UNITS FOUND:', str.trim());
  }
});

setTimeout(() => {
  console.log('=== CHECK COMPLETE ===');
  client.end();
}, 8000);