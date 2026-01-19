
const net = require('net');
const c = new net.Socket();
console.log('CONNECTING...');
c.connect(21026, 'localhost', () => console.log('CONNECTED'));
let step = 0;
let buffer = '';

c.on('data', d => {
    const s = d.toString();
    console.log('DEBUG_CHUNK:', JSON.stringify(s));
    buffer += s;
    
    // Check for prompt
    if (buffer.includes('< ') && step === 0) {
        c.write("storage.db[\"rooms.objects\"].find({room: \"W9N8\"}).then(o=>print(JSON.stringify(o)))" + '\n');
        step = 1;
        buffer = ''; 
    } else if (buffer.includes('< ') && step === 1) {
        console.log('JSON_START');
        console.log(buffer.replace(/< $/,'')); // Remove trailing prompt
        console.log('JSON_END');
        c.destroy();
    }
});

c.on('error', e => console.error(e));
setTimeout(() => { process.exit(0); }, 5000);
