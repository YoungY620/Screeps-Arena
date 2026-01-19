const net = require('net');
const fs = require('fs');

const code = fs.readFileSync('/tmp/final_emergency.js', 'utf8');
const c = new net.Socket();
let step = 0;

c.connect(21026, 'localhost');

c.on('data', d => {
  const response = d.toString();
  
  if (response.includes('> ') && step === 0) {
    console.log('Getting user...');
    c.write('storage.db.users.findOne({username: "gpt"}).then(user => print(user._id))\n');
    step++;
  } else if (step === 1 && response.includes('"')) {
    const userId = response.match(/[a-f0-9]{24}/)[0];
    console.log('User ID:', userId);
    
    const cmd = `storage.db["users.code"].update({user: "${userId}"}, {$set: {branch: "default", modules: {main: ${JSON.stringify(code)}}}}, {upsert: true})`;
    c.write(cmd + '\n');
    step++;
  } else if (step === 2) {
    console.log('Code deployed!');
    c.end();
  }
});

setTimeout(() => c.end(), 8000);