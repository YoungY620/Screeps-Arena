#!/usr/bin/env node

const net = require('net');
const fs = require('fs');

// Read the main PvP code
const mainCode = fs.readFileSync("/Users/moonshot/dev/local-screeps/agents/screeps-agent/workspace/gpt/main.js", "utf8");

const client = new net.Socket();
let step = 0;
let userId = null;

client.connect(21026, 'localhost', () => {
  console.log('Connected to CLI server');
});

client.on('data', (data) => {
  const response = data.toString();
  
  console.log(`Step ${step} - Received response`);
  
  if (response.includes('> ')) {
    if (step === 0) {
      console.log('Getting user ID...');
      client.write('storage.db.users.findOne({username: "gpt"}).then(user => print(user._id))\n');
      step++;
    } else if (step === 1 && !userId) {
      // Extract user ID from response
      const match = response.match(/[a-f0-9]{24}/);
      if (match) {
        userId = match[0];
        console.log('User ID:', userId);
        
        console.log('Uploading code...');
        const codeCommand = `storage.db["users.code"].update({user: "${userId}"}, {$set: {branch: "default", modules: {main: ${JSON.stringify(mainCode)}}}, {upsert: true})`;
        client.write(codeCommand + '\n');
        step++;
      }
    } else if (step === 2) {
      console.log('Code upload complete!');
      client.end();
    }
  }
});

client.on('end', () => {
  console.log('Disconnected from CLI');
  process.exit(0);
});

client.on('error', (err) => {
  console.error('Connection error:', err);
  process.exit(1);
});

setTimeout(() => {
  console.log('Timeout reached');
  client.end();
  process.exit(1);
}, 10000);