// Agent 2 - 升级专家
module.exports.loop = function() {
  console.log('[Agent2] Tick:', Game.time);
  
  for (const name in Game.spawns) {
    const spawn = Game.spawns[name];
    const creeps = _.filter(Game.creeps, c => c.my);
    
    if (creeps.length < 4 && !spawn.spawning) {
      const role = creeps.length < 2 ? 'harvester' : 'upgrader';
      spawn.spawnCreep([WORK, WORK, CARRY, MOVE], 'Creep' + Game.time, {
        memory: { role }
      });
    }
  }
  
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    
    if (creep.memory.role === 'harvester') {
      if (creep.store.getFreeCapacity() > 0) {
        const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) creep.moveTo(source);
      } else {
        const spawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS);
        if (spawn && creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) creep.moveTo(spawn);
      }
    } else {
      if (creep.store[RESOURCE_ENERGY] === 0) {
        const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) creep.moveTo(source);
      } else {
        if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
          creep.moveTo(creep.room.controller);
        }
      }
    }
  }
};
