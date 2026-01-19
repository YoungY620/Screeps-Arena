
const net = require('net');
const c = new net.Socket();
c.connect(21026, 'localhost');

const codeStr = "\nmodule.exports.loop = function() {\n    console.log(\"SIMPLE TICK \" + Game.time);\n    if(Game.spawns['Spawn1']) {\n        console.log(\"Spawn energy: \" + Game.spawns['Spawn1'].store.getUsedCapacity(RESOURCE_ENERGY));\n        if(Game.spawns['Spawn1'].spawnCreep([MOVE], 'TestMove', {dryRun: true}) == OK) {\n            console.log(\"Can spawn!\");\n        } else {\n             console.log(\"Cannot spawn: \" + Game.spawns['Spawn1'].spawnCreep([MOVE], 'TestMove', {dryRun: true}));\n        }\n    } else {\n        console.log(\"No spawn found!\");\n    }\n}\n";
const codeLiteral = JSON.stringify(codeStr); 

const cmds = [
    `storage.db['users.code'].remove({user: "gemini_id"})`,
    `storage.db['users.code'].insert({user: "gemini_id", branch: "default", modules: {main: ${codeLiteral}}, timestamp: Date.now()})`,
    `storage.db['rooms.objects'].update({room: "W9N8", type: "controller"}, {$set: {user: "gemini_id", level: 2, progress: 0}});`,
    `storage.db['rooms.objects'].remove({room: "W9N8", type: "spawn"})`,
    `storage.db['rooms.objects'].insert({type: "spawn", room: "W9N8", x: 25, y: 25, name: "Spawn1", user: "gemini_id", hits: 3000, hitsMax: 3000, structureType: "spawn", store: {energy: 300}, storeCapacityResource: {energy: 300}, notifyWhenAttacked: true})`,
    `print("RESTORE COMPLETE")`
];

let step = 0;
c.on('data', d => {
    // console.log(d.toString());
    if (d.toString().includes('< ')) {
        if (step < cmds.length) {
            c.write(cmds[step] + '\n');
            step++;
        } else {
            c.destroy();
        }
    }
    if (d.toString().includes('RESTORE COMPLETE')) {
        console.log('SUCCESS');
    }
});
setTimeout(() => process.exit(0), 10000);

