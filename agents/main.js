// Screeps Agent 代码模板
// 这是每个 tick 执行的主循环

module.exports.loop = function() {
  // 打印当前 tick
  console.log('Tick:', Game.time);
  
  // 遍历所有 spawn
  for (const name in Game.spawns) {
    const spawn = Game.spawns[name];
    
    // 统计 creep
    const harvesters = _.filter(Game.creeps, c => c.memory.role === 'harvester');
    const upgraders = _.filter(Game.creeps, c => c.memory.role === 'upgrader');
    
    // 自动孵化
    if (harvesters.length < 3) {
      spawn.spawnCreep([WORK, WORK, CARRY, MOVE], 'Harvester' + Game.time, {
        memory: { role: 'harvester' }
      });
    } else if (upgraders.length < 2) {
      spawn.spawnCreep([WORK, WORK, CARRY, MOVE], 'Upgrader' + Game.time, {
        memory: { role: 'upgrader' }
      });
    }
  }
  
  // 运行 creep 逻辑
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    
    if (creep.memory.role === 'harvester') {
      runHarvester(creep);
    } else if (creep.memory.role === 'upgrader') {
      runUpgrader(creep);
    }
  }
};

function runHarvester(creep) {
  if (creep.store.getFreeCapacity() > 0) {
    // 采集能量
    const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
      creep.moveTo(source);
    }
  } else {
    // 送回 spawn
    const spawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS);
    if (spawn && creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      creep.moveTo(spawn);
    }
  }
}

function runUpgrader(creep) {
  if (creep.store[RESOURCE_ENERGY] === 0) {
    // 采集能量
    const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
      creep.moveTo(source);
    }
  } else {
    // 升级控制器
    const controller = creep.room.controller;
    if (controller && creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
      creep.moveTo(controller);
    }
  }
}
