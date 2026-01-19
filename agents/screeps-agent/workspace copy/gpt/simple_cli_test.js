const net = require('net');

const client = new net.Socket();
let received = '';

client.connect(21026, 'localhost', () => {
    console.log('Connected to CLI');
});

client.on('data', (data) => {
    received += data.toString();
    console.log('Received:', data.toString().substring(0, 50));
    
    if (received.includes('> ')) {
        console.log('CLI ready, sending commands...');
        
        // Get game time
        client.write('storage.env.get("gameTime")\n');
        
        setTimeout(() => {
            // Get user info
            client.write('storage.db.users.findOne({username: "gpt"})\n');
        }, 1000);
        
        setTimeout(() => {
            client.end();
        }, 3000);
    }
});

client.on('end', () => {
    console.log('Connection closed');
    console.log('Full response:', received);
});

client.on('error', (err) => {
    console.error('Error:', err.message);
});

setTimeout(() => client.end(), 5000);