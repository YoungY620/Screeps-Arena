const { rpc } = require('@screeps/common');
const net = require('net');

async function checkGameState() {
  try {
    console.log('🎮 Connecting to Screeps storage...');
    
    const socket = net.connect(21026, 'localhost');
    const client = new rpc.RpcClient(socket);
    
    console.log('Connected, querying game state...');
    
    // Get game time
    const gameTime = await client.request('env.get', ['gameTime']);
    console.log('✅ Current game time:', gameTime);
    
    // Get rooms
    const rooms = await client.request('rooms.find', [{}]);
    console.log('✅ Available rooms:', rooms.map(r => r._id));
    console.log('✅ Total rooms:', rooms.length);
    
    // Get users
    const users = await client.request('users.find', [{}]);
    console.log('✅ Registered users:', users.map(u => u.username));
    console.log('✅ Total users:', users.length);
    
    // Get current room status for W1N3 (from main.js)
    const w1n3Room = rooms.find(r => r._id === 'W1N3');
    if (w1n3Room) {
      console.log('✅ Room W1N3 status:', {
        controller: w1n3Room.controller ? 'Has controller' : 'No controller',
        sources: w1n3Room.sources ? w1n3Room.sources.length : 0,
        objects: w1n3Room.objects ? w1n3Room.objects.length : 0
      });
    }
    
    // Get creeps in W1N3
    const creeps = await client.request('creeps.find', [{ room: 'W1N3' }]);
    console.log('✅ Creeps in W1N3:', creeps.length);
    if (creeps.length > 0) {
      console.log('✅ Creep details:', creeps.map(c => ({
        name: c.name,
        user: c.user,
        body: c.body.length,
        pos: c.pos
      })));
    }
    
    socket.end();
    console.log('✅ Game state check complete!');
    
  } catch (err) {
    console.error('❌ Error checking game state:', err.message);
    console.error('Stack:', err.stack);
  }
}

checkGameState();