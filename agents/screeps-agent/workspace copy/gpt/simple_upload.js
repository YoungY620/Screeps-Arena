const net = require('net');
const fs = require('fs');

const client = new net.Socket();
let step = 0;

client.connect(21026, 'localhost');

client.on('data', (data) => {
  const response = data.toString();
  console.log('Response:', response.slice(0, 100));
  
  if (response.includes('> ')) {
    if (step === 0) {
      console.log('Getting user...');
      client.write('storage.db.users.findOne({username: "gpt"}).then(u => print(u._id))\n');
      step++;
    } else if (step === 1) {
      // Extract user ID and upload code
      const match = response.match(/[a-f0-9]{24}/);
      if (match) {
        const userId = match[0];
        console.log('User ID:', userId);
        
        const code = fs.readFileSync('/tmp/main.js', 'utf8');
        const cmd = `storage.db["users.code"].update({user: "${userId}"}, {$set: {branch: "default", modules: {main: ${JSON.stringify(code)}}}}, {upsert: true})`;
        
        console.log('Uploading code...');
        client.write(cmd + '\n');
        step++;
      }
    } else {
      console.log('Done!');
      client.end();
    }
  }
});

client.on('end', () => console.log('Finished'));
setTimeout(() => client.end(), 10000);