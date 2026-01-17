#!/usr/bin/env node

const net = require('net');

console.log('🚨 EMERGENCY COMBAT DEPLOYMENT - GPT PvP Agent 🚨');

const client = new net.Socket();
let step = 0;
let fullOutput = '';

client.connect(21026, 'localhost', () => {
  console.log('🎯 Connected to CLI server - Deploying combat AI');
});

client.on('data', (data) => {
  const response = data.toString();
  fullOutput += response;
  
  console.log(`Step ${step} - Received ${response.length} chars`);
  
  if (response.includes('> ')) {
    if (step === 0) {
      console.log('🚀 Deploying emergency combat code...');
      // Deploy basic combat AI
      const combatCode = `
// Emergency GPT Combat AI
module.exports.loop = function() {
  console.log('🚨 GPT COMBAT AI ACTIVE - Tick:', Game.time);
  
  // Check if we have any spawns
  const spawns = Object.keys(Game.spawns);
  console.log('Available spawns:', spawns);
  
  if (spawns.length > 0) {
    const spawn = Game.spawns[spawns[0]];
    console.log('Spawn found:', spawn.name, 'Room:', spawn.room.name);
    
    // Emergency claimer deployment
    const room = spawn.room;
    const energy = spawn.store.energy || 0;
    
    if (energy >= 600) {
      const result = spawn.spawnCreep([CLAIM, MOVE, MOVE], 'EmergencyClaimer_' + Game.time, {
        memory: { role: 'claimer', targetRoom: 'W9N8' }
      });
      
      if (result === OK) {
        console.log('🎯 EMERGENCY CLAIMER DEPLOYED to W9N8');
      } else {
        console.log('❌ Claimer spawn failed:', result);
      }
    }
  } else {
    console.log('❌ NO SPAWNS AVAILABLE - Need to claim room first');
  }
};
`;
      
      client.write(`storage.db.users.update({username: "gpt"}, {$set: {code: ${JSON.stringify({main: combatCode})}}})
`);
      step++;
    } else if (step === 1) {
      console.log('✅ Code deployment attempted');
      client.end();
    }
  }
});

client.on('end', () => {
  console.log('🏁 Emergency deployment complete');
  console.log('Final output:', fullOutput.slice(-500));
  process.exit(0);
});

client.on('error', (err) => {
  console.error('❌ Connection error:', err);
  process.exit(1);
});

setTimeout(() => {
  console.log('⏰ Timeout reached');
  console.log('Final output:', fullOutput);
  client.end();
  process.exit(1);
}, 15000);