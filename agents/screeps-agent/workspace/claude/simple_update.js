const net = require('net');

const c = new net.Socket();
let connected = false;

c.connect(21026, 'localhost', () => {
    connected = true;
    console.log('Connected to Screeps server');
});

c.on('data', (data) => {
    const response = data.toString();
    console.log('Server:', response.substring(0, 100));
    
    if (response.includes('< ')) {
        console.log('Server ready, updating code...');
        
        // Simple test - just update the code field
        const code = `// GEMINI PvP Strategy\nconsole.log('Gemini AI activated!');\nconst roleHarvester = {\n    run: function(creep) {\n        if (creep.store.getFreeCapacity() > 0) {\n            const sources = creep.room.find(FIND_SOURCES);\n            if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {\n                creep.moveTo(sources[0]);\n            }\n        } else {\n            creep.drop(RESOURCE_ENERGY);\n        }\n    }\n};\n\nmodule.exports.loop = function() {\n    console.log('Gemini AI running - tick:', Game.time);\n    for (const name in Game.creeps) {\n        const creep = Game.creeps[name];\n        roleHarvester.run(creep);\n    }\n};`;
        
        const updateCmd = `storage.db.users.update({_id: "883571325e0e962"}, {$set: {code: {branch: "default", modules: {main: ${JSON.stringify(code)}}}}})\n`;
        c.write(updateCmd);
        
        setTimeout(() => {
            console.log('Code update sent');
            c.end();
        }, 1000);
    }
});

c.on('error', (err) => {
    console.error('Connection error:', err.message);
});

setTimeout(() => {
    if (connected) {
        console.log('Closing connection');
        c.end();
    }
}, 5000);
