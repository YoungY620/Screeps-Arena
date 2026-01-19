#!/usr/bin/env node

const net = require('net');

console.log('Connecting to Screeps CLI to place spawn...');

const client = new net.Socket();
let step = 0;
let fullOutput = '';

client.connect(21026, 'localhost', () => {
  console.log('Connected to CLI server');
});

client.on('data', (data) => {
  const response = data.toString();
  fullOutput += response;
  
  console.log(`Step ${step} - Received ${response.length} chars`);
  
  if (response.includes('> ')) {
    if (step === 0) {
      console.log('CLI ready, trying to access storage...');
      client.write('storage\n');
      step++;
    } else if (step === 1) {
      console.log('Checking storage availability...');
      client.write('storage.db\n');
      step++;
    } else if (step === 2) {
      console.log('Trying to access users collection...');
      client.write('storage.db.users.findOne({username: "gpt"})\n');
      step++;
    } else if (step === 3) {
      console.log('User found, now trying to place spawn...');
      // Try to create a spawn object directly
      client.write(`storage.db['rooms.objects'].insert({
        type: 'spawn',
        room: 'W5N5',
        x: 25,
        y: 25,
        name: 'Spawn1',
        user: 'gpt',
        store: {energy: 0},
        storeCapacity: 1000,
        hits: 5000,
        hitsMax: 5000,
        spawning: null,
        notifyWhenAttacked: true
      })\n`);
      step++;
    } else if (step === 4) {
      console.log('Spawn placement attempted');
      client.end();
    }
  }
});

client.on('end', () => {
  console.log('Disconnected from CLI');
  console.log('Final output:', fullOutput.slice(-500));
  process.exit(0);
});

client.on('error', (err) => {
  console.error('Connection error:', err);
  process.exit(1);
});

setTimeout(() => {
  console.log('Timeout reached');
  console.log('Final output:', fullOutput);
  client.end();
  process.exit(1);
}, 15000);