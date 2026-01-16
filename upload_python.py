import json
import subprocess

# Simple working code
code = '''// GEMINI - Simple PvP Strategy
console.log('🤖 GEMINI AI ACTIVATED - PvP Mode');

// Basic harvester role
const roleHarvester = {
    run: function(creep) {
        if (creep.store.getFreeCapacity() > 0) {
            const sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else {
            creep.drop(RESOURCE_ENERGY);
        }
    }
};

// Main game loop
module.exports.loop = function() {
    console.log('⚡ Gemini AI - Tick:', Game.time);
    
    // Run creeps
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        roleHarvester.run(creep);
    }
    
    // Spawn new creeps if needed
    const harvesters = Object.values(Game.creeps).filter(c => c.name.includes('Gemini'));
    console.log('👥 Active creeps:', harvesters.length);
    
    if (harvesters.length < 2 && Game.spawns.Spawn1 && !Game.spawns.Spawn1.spawning) {
        const result = Game.spawns.Spawn1.spawnCreep([WORK, CARRY, MOVE], 'Gemini' + Game.time, {
            memory: {role: 'harvester'}
        });
        if (result === OK) {
            console.log('🥚 Spawned new harvester');
        }
    }
};'''

# Escape for MongoDB
escaped_code = json.dumps(code)

# Create Node.js script
node_script = f"""
const net = require('net');
const c = new net.Socket();
c.connect(21026, 'localhost', () => {{
  console.log('Connected to update code');
  const cmd = 'storage.db.users.update({{_id: "883571325e0e962"}}, {{$set: {{"code.branch": "default", "code.modules": {{main: {escaped_code}}}}}}})\\n';
  c.write(cmd);
  console.log('Update command sent');
  setTimeout(() => c.end(), 1500);
}});
c.on('data', data => console.log('Server response:', data.toString().substring(0, 100)));
c.on('error', err => console.error('Error:', err.message));
setTimeout(() => process.exit(0), 4000);
"""

# Write and execute
with open('/tmp/update_code.js', 'w') as f:
    f.write(node_script)

print("Uploading code...")
result = subprocess.run(['docker', 'exec', 'screeps', 'node', '/tmp/update_code.js'], 
                       capture_output=True, text=True)
print("Output:", result.stdout)
print("Errors:", result.stderr)
