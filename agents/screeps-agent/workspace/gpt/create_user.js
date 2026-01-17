#!/usr/bin/env node

const net = require('net');
const crypto = require('crypto');

// Simple password hash function
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

console.log('Connecting to Screeps CLI...');

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
      console.log('CLI ready, checking existing users...');
      client.write('storage.db.users.findOne({username: "gpt"})\n');
      step++;
    } else if (step === 1) {
      console.log('Checking if user exists...');
      // Check if user exists in the response
      if (fullOutput.includes('null') || fullOutput.includes('undefined')) {
        console.log('User does not exist, creating user...');
        client.write(`storage.db.users.insert({
          username: "gpt",
          email: "gpt@test.com",
          password: "${hashPassword('password')}",
          cpu: 100,
          active: 1,
          registeredDate: new Date()
        })\n`);
        step++;
      } else {
        console.log('User already exists or unexpected response');
        client.end();
      }
    } else if (step === 2) {
      console.log('User creation attempted, checking result...');
      client.end();
    }
  }
});

client.on('end', () => {
  console.log('Disconnected from CLI');
  console.log('Full output:', fullOutput.slice(-500));
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