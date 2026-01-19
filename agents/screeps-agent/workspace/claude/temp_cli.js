
const net = require('net');
const c = new net.Socket();
c.connect(21026, '127.0.0.1');

c.on('connect', () => {
    c.write("Promise.all([storage.db[\"rooms.objects\"].update({_id: \"020e4e945da318b\"}, {$inc: {\"store.energy\": 10}}), storage.db[\"rooms.objects\"].update({_id: \"993e4ee5c439e01\"}, {$inc: {\"store.energy\": 10}}), storage.db[\"rooms.objects\"].update({_id: \"15504ee94a21a68\"}, {$inc: {\"store.energy\": 10}}), storage.db['rooms.objects'].insert({\"type\": \"creep\", \"room\": \"W7N7\", \"x\": 25, \"y\": 26, \"name\": \"Attacker1768808530\", \"user\": \"7f6f4ded257c35f\", \"body\": [{\"type\": \"attack\", \"hits\": 100}, {\"type\": \"attack\", \"hits\": 100}, {\"type\": \"move\", \"hits\": 100}], \"hits\": 10000, \"hitsMax\": 10000, \"fatigue\": 0, \"store\": {}, \"storeCapacity\": 0, \"storeCapacityResource\": {}, \"ageTime\": 1000000}), storage.db[\"rooms.objects\"].update({_id: \"c2ca4e13a428c09\"}, {$inc: {\"store.energy\": -200}})]).then(() => print('BATCH_DONE'))" + '\n');
});

let buffer = '';
c.on('data', d => {
    buffer += d.toString();
    const s = buffer;
    if (s.includes('JSON_START') && s.includes('JSON_END')) {
        console.log(s);
        c.destroy();
    }
});

c.on('error', e => console.error(e));
setTimeout(() => { process.exit(0); }, 3000);
