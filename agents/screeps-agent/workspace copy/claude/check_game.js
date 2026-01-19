const net = require('net');

console.log('Connecting to Screeps server...');
const c = new net.Socket();

let ready = false;
let buffer = '';

c.connect(21026, 'localhost', () => {
    console.log('Connected!');
});

c.on('data', (data) => {
    buffer += data.toString();
    console.log('Received:', buffer);
    
    if (!ready && buffer.includes('< ')) {
        ready = true;
        buffer = '';
        console.log('Ready to send commands...');
        c.write('storage.env.get("gameTime").then(t => print("TIME:" + t))\n');
    }
    
    if (ready && buffer.includes('TIME:')) {
        console.log('Game time received!');
        c.end();
    }
});

c.on('error', (err) => {
    console.error('Connection error:', err);
});

setTimeout(() => {
    console.log('Closing connection...');
    c.end();
}, 3000);
