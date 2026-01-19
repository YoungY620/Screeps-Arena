
const net = require('net');
const c = new net.Socket();
c.connect(21026, '127.0.0.1');
c.on('connect', () => { c.write("storage.db[\"rooms.objects\"].find({type: \"tower\"}).then(o=> { print(\"JSON_START\"); print(JSON.stringify(o)); print(\"JSON_END\"); })" + '\n'); });
let buffer = '';
c.on('data', d => {
    buffer += d.toString();
    const s = buffer;
    if (s.includes('JSON_START') && s.includes('JSON_END')) {
        console.log(s);
        c.destroy();
    }
});
setTimeout(() => { process.exit(0); }, 3000);
