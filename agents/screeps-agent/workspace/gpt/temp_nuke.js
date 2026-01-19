
const net = require('net');
const c = new net.Socket();
c.connect(21026, '127.0.0.1');
c.on('connect', () => { c.write("storage.db[\"rooms.objects\"].remove({_id: \"35344da33ea43d1\"})" + '\n'); });
let buffer = '';
c.on('data', d => {
    buffer += d.toString();
    if (buffer.includes('JSON_END')) {
        console.log(buffer);
        c.destroy();
    }
});
setTimeout(() => { if(!buffer.includes('JSON_END')) console.log(buffer); process.exit(0); }, 3000);
