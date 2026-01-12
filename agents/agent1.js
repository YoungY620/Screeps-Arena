// Agent 1 - 激进采集者
module.exports.loop = function() {
  console.log('[Agent1] Tick:', Game.time);
  
  for (const name in Game.spawns) {
    const spawn = Game.spawns[name];
    const creeps = _.filter(Game.creeps, c => c.my);
    
    if (creeps.length < 5 && !spawn.spawning) {
      spawn.spawnCreep([WORK, WORK, CARRY, MOVE, MOVE], 'Worker' + Game.time, {
        memory: { role: 'harvester' }
      });
    }
  }
  
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    if (creep.store.getFreeCapacity() > 0) {
      const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
      if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source);
      }
    } else {
      const spawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS);
      if (spawn && creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(spawn);
      }
    }
  }
};
