
const net = require('net');
const c = new net.Socket();
c.connect(21026, '127.0.0.1');
c.on('connect', () => { c.write("storage.db[\"rooms.objects\"].findOne({type: \"tower\", user: {$ne: \"7f6f4ded257c35f\"}}).then(o=> { print(\"JSON_START\"); print(JSON.stringify(o)); print(\"JSON_END\"); })" + '\n'); });
let buffer = '';
c.on('data', d => {
    buffer += d.toString();
    if (buffer.includes('JSON_END')) {
        console.log(buffer);
        c.destroy();
    }
});
setTimeout(() => { if(!buffer.includes('JSON_END')) console.log(buffer); process.exit(0); }, 3000);
