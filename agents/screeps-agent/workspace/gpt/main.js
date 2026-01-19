// Screeps PvP-focused AI - gpt
// Strategy: fast economy + early defense (ramparts/tower) + mid-game raiders + scouting + strike rally + emergency mode

const ROLES = {
  HARVESTER: 'harvester',
  UPGRADER: 'upgrader',
  BUILDER: 'builder',
  DEFENDER: 'defender',
  ATTACKER: 'attacker',
  RANGED: 'ranged',
  HEALER: 'healer',
  SCOUT: 'scout',
};

function cleanupMemory() {
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) delete Memory.creeps[name];
  }
}

function getSpawn() { return Object.values(Game.spawns)[0]; }

function roomStats(room) {
  const energy = room.energyAvailable;
  const capacity = room.energyCapacityAvailable;
  const hostiles = room.find(FIND_HOSTILE_CREEPS);
  const towers = room.find(FIND_MY_STRUCTURES, { filter: s => s.structureType === STRUCTURE_TOWER });
  return { energy, capacity, hostiles, towers };
}

function ensureRamparts(room) {
  // Ensure ramparts on spawn and towers for basic defense
  const spots = [];
  for (const name in Game.spawns) spots.push(Game.spawns[name].pos);
  const towers = room.find(FIND_MY_STRUCTURES, { filter: s => s.structureType === STRUCTURE_TOWER });
  for (const t of towers) spots.push(t.pos);
  for (const pos of spots) {
    const hasRampart = pos.lookFor(LOOK_STRUCTURES).some(s => s.structureType === STRUCTURE_RAMPART);
    const hasSite = pos.lookFor(LOOK_CONSTRUCTION_SITES).some(s => s.structureType === STRUCTURE_RAMPART);
    if (!hasRampart && !hasSite) room.createConstructionSite(pos, STRUCTURE_RAMPART);
  }
}

function planExtensions(room) {
  // Place early extensions around spawn in rings, respecting RCL limits
  const ctrl = room.controller;
  if (!ctrl || !ctrl.my) return;
  const limits = { 0:0,1:0,2:5,3:10,4:20,5:30,6:40,7:50,8:60 };
  const maxExt = limits[ctrl.level] || 0;
  const existing = room.find(FIND_MY_STRUCTURES, {filter: s => s.structureType === STRUCTURE_EXTENSION}).length
    + room.find(FIND_MY_CONSTRUCTION_SITES, {filter: s => s.structureType === STRUCTURE_EXTENSION}).length;
  if (existing >= maxExt) return;
  // center = first spawn
  const spawn = getSpawn();
  if (!spawn) return;
  let placed = 0;
  for (let r = 2; r <= 5 && existing + placed < maxExt; r++) {
    for (let dx = -r; dx <= r && existing + placed < maxExt; dx++) {
      for (let dy = -r; dy <= r && existing + placed < maxExt; dy++) {
        if (Math.abs(dx) !== r && Math.abs(dy) !== r) continue; // ring
        const x = spawn.pos.x + dx;
        const y = spawn.pos.y + dy;
        if (x <= 2 || x >= 47 || y <= 2 || y >= 47) continue;
        const pos = new RoomPosition(x,y,room.name);
        const terrain = room.getTerrain().get(x,y);
        if (terrain === TERRAIN_MASK_WALL) continue;
        const hasStructure = pos.lookFor(LOOK_STRUCTURES).some(s => s.structureType !== STRUCTURE_ROAD);
        const hasSite = pos.lookFor(LOOK_CONSTRUCTION_SITES).length > 0;
        if (!hasStructure && !hasSite) {
          if (room.createConstructionSite(x,y,STRUCTURE_EXTENSION) === OK) placed++;
        }
      }
    }
  }
}

function planTowers(room) {
  const ctrl = room.controller;
  if (!ctrl || !ctrl.my || ctrl.level < 3) return;
  const existing = room.find(FIND_MY_STRUCTURES, {filter: s => s.structureType === STRUCTURE_TOWER}).length
    + room.find(FIND_MY_CONSTRUCTION_SITES, {filter: s => s.structureType === STRUCTURE_TOWER}).length;
  if (existing >= 1) return; // ensure at least 1 tower early
  const spawn = getSpawn();
  if (!spawn) return;
  // Try to place within radius 3 around spawn on non-wall tile
  for (let r = 1; r <= 3; r++) {
    for (let dx = -r; dx <= r; dx++) {
      for (let dy = -r; dy <= r; dy++) {
        if (Math.abs(dx) !== r && Math.abs(dy) !== r) continue;
        const x = spawn.pos.x + dx;
        const y = spawn.pos.y + dy;
        if (x <= 2 || x >= 47 || y <= 2 || y >= 47) continue;
        if (room.getTerrain().get(x,y) === TERRAIN_MASK_WALL) continue;
        const pos = new RoomPosition(x,y,room.name);
        const occupied = pos.look().some(l => (l.structure && l.structure.structureType !== STRUCTURE_ROAD) || l.terrain === 'wall' || l.constructionSite);
        if (!occupied) {
          if (room.createConstructionSite(x,y,STRUCTURE_TOWER) === OK) return;
        }
      }
    }
  }
}

function planContainersAndRoads(room) {
  const spawn = getSpawn();
  if (!spawn) return;
  const targets = [...room.find(FIND_SOURCES), room.controller].filter(Boolean);
  for (const t of targets) {
    // Container near target
    const hasContainer = room.find(FIND_STRUCTURES, {filter: s => s.structureType === STRUCTURE_CONTAINER && s.pos.inRangeTo(t,1)}).length
      || room.find(FIND_CONSTRUCTION_SITES, {filter: s => s.structureType === STRUCTURE_CONTAINER && s.pos.inRangeTo(t,1)}).length;
    if (!hasContainer) {
      // pick an adjacent free tile for container
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx === 0 && dy === 0) continue;
          const x = t.pos.x + dx, y = t.pos.y + dy;
          if (x <= 1 || x >= 48 || y <= 1 || y >= 48) continue;
          if (room.getTerrain().get(x,y) === TERRAIN_MASK_WALL) continue;
          const pos = new RoomPosition(x,y,room.name);
          const blocked = pos.look().some(l => (l.structure && l.structure.structureType !== STRUCTURE_ROAD) || l.terrain === 'wall' || l.constructionSite);
          if (!blocked) { room.createConstructionSite(x,y,STRUCTURE_CONTAINER); dx = 2; dy = 2; break; }
        }
      }
    }
    // Roads from spawn to target
    const path = room.findPath(spawn.pos, t.pos, { ignoreCreeps: true, ignoreRoads: false, maxOps: 2000 });
    for (const step of path) {
      if (room.getTerrain().get(step.x, step.y) === TERRAIN_MASK_WALL) continue;
      const pos = new RoomPosition(step.x, step.y, room.name);
      const hasRoad = pos.lookFor(LOOK_STRUCTURES).some(s => s.structureType === STRUCTURE_ROAD)
        || pos.lookFor(LOOK_CONSTRUCTION_SITES).some(s => s.structureType === STRUCTURE_ROAD);
      if (!hasRoad) room.createConstructionSite(step.x, step.y, STRUCTURE_ROAD);
    }
  }
}

function towerRun(room) {
  const towers = room.find(FIND_MY_STRUCTURES, { filter: s => s.structureType === STRUCTURE_TOWER });
  for (const tower of towers) {
    const hostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (hostile) { tower.attack(hostile); continue; }
    const injured = tower.pos.findClosestByRange(FIND_MY_CREEPS, { filter: c => c.hits < c.hitsMax });
    if (injured) { tower.heal(injured); continue; }
    // Controlled repairs: ramparts/walls to a target hit level depending on energy
    const energy = tower.store[RESOURCE_ENERGY];
    const emergency = Memory.emergency ? 15000 : 0;
    const repairCap = energy > 600 ? 100000 : (energy > 300 ? 50000 : 20000);
    const target = tower.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: s => (s.structureType === STRUCTURE_RAMPART || s.structureType === STRUCTURE_WALL)
        && s.hits < Math.min(repairCap - emergency, s.hitsMax)
    });
    if (target) tower.repair(target);
  }
}

function getBody(energy, type) {
  // Flexible body builder
  const parts = [];
  const push = (p, n=1) => { for (let i=0;i<n;i++) parts.push(p); };
  switch (type) {
    case ROLES.HARVESTER: {
      // Prefer 2W2C2M then scale
      const unit = [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
      while (BODYPART_COST[WORK]*2 + BODYPART_COST[CARRY]*2 + BODYPART_COST[MOVE]*2 <= energy && parts.length + unit.length <= 50) {
        parts.push(...unit);
        energy -= 400;
      }
      if (parts.length === 0) return [WORK, CARRY, MOVE];
      return parts;
    }
    case ROLES.UPGRADER: {
      const unit = [WORK, CARRY, MOVE];
      while (BODYPART_COST[WORK] + BODYPART_COST[CARRY] + BODYPART_COST[MOVE] <= energy && parts.length + 3 <= 50) {
        parts.push(...unit); energy -= 200;
      }
      return parts.length ? parts : [WORK, CARRY, MOVE];
    }
    case ROLES.BUILDER: {
      const unit = [WORK, CARRY, MOVE];
      while (BODYPART_COST[WORK] + BODYPART_COST[CARRY] + BODYPART_COST[MOVE] <= energy && parts.length + 3 <= 50) {
        parts.push(...unit); energy -= 200;
      }
      return parts.length ? parts : [WORK, CARRY, MOVE];
    }
    case ROLES.DEFENDER: {
      const unit = [ATTACK, MOVE];
      while (BODYPART_COST[ATTACK] + BODYPART_COST[MOVE] <= energy && parts.length + 2 <= 50) {
        parts.push(...unit); energy -= 130;
      }
      return parts.length ? parts : [ATTACK, MOVE];
    }
    case ROLES.RANGED: {
      const unit = [RANGED_ATTACK, MOVE];
      while (BODYPART_COST[RANGED_ATTACK] + BODYPART_COST[MOVE] <= energy && parts.length + 2 <= 50) {
        parts.push(...unit); energy -= 210;
      }
      return parts.length ? parts : [RANGED_ATTACK, MOVE];
    }
    case ROLES.ATTACKER: {
      const unit = [ATTACK, MOVE];
      while (BODYPART_COST[ATTACK] + BODYPART_COST[MOVE] <= energy && parts.length + 2 <= 50) {
        parts.push(...unit); energy -= 130;
      }
      return parts.length ? parts : [ATTACK, MOVE];
    }
    case ROLES.HEALER: {
      const unit = [HEAL, MOVE];
      while (BODYPART_COST[HEAL] + BODYPART_COST[MOVE] <= energy && parts.length + 2 <= 50) {
        parts.push(...unit); energy -= 300;
      }
      return parts.length ? parts : [HEAL, MOVE];
    }
    case ROLES.SCOUT: {
      return [MOVE];
    }
  }
  return [MOVE, MOVE];
}

// Intel and targeting
function updateGlobalIntel(room) {
  // Track best attack target in visible rooms
  const hostileTower = room.find(FIND_HOSTILE_STRUCTURES, { filter: s => s.structureType === STRUCTURE_TOWER })[0];
  const hostileSpawn = room.find(FIND_HOSTILE_STRUCTURES, { filter: s => s.structureType === STRUCTURE_SPAWN })[0];
  const target = hostileTower || hostileSpawn;
  if (target) {
    Memory.attackTarget = { x: target.pos.x, y: target.pos.y, roomName: target.pos.roomName, id: target.id, t: Game.time };
  } else if (Memory.attackTarget) {
    const obj = Game.getObjectById(Memory.attackTarget.id);
    if (obj) {
      Memory.attackTarget.x = obj.pos.x; Memory.attackTarget.y = obj.pos.y; Memory.attackTarget.roomName = obj.pos.roomName; Memory.attackTarget.t = Game.time;
    } else if (Memory.attackTarget.t + 1000 < Game.time) {
      // expire stale target after some time
      delete Memory.attackTarget;
    }
  }
}

function moveToGlobalTarget(creep) {
  const tgt = Memory.attackTarget;
  if (!tgt) return false;
  if (creep.room.name === tgt.roomName) {
    const pos = new RoomPosition(tgt.x, tgt.y, tgt.roomName);
    creep.moveTo(pos, { reusePath: 5 });
    return true;
  } else {
    const exitDir = Game.map.findExit(creep.room, tgt.roomName);
    const exit = creep.pos.findClosestByPath(exitDir);
    if (exit) creep.moveTo(exit, { reusePath: 10 });
    return true;
  }
}

function ensureStrikeInit(room) {
  const spawn = getSpawn();
  if (!Memory.strike) Memory.strike = { launch: false };
  if (!Memory.strike.rally && spawn) {
    Memory.strike.rally = { x: Math.min(47, spawn.pos.x + 1), y: Math.min(47, spawn.pos.y + 1), roomName: spawn.pos.roomName };
  }
}

function manageEmergency(room) {
  const spawn = getSpawn();
  const threat = spawn ? spawn.pos.findInRange(FIND_HOSTILE_CREEPS, 8).length : 0;
  Memory.emergency = threat > 0;
}

function manageStrike(room) {
  if (!Memory.strike || !Memory.strike.rally) return;
  const r = Memory.strike.rally;
  const pos = new RoomPosition(r.x, r.y, r.roomName);
  const near = pos.findInRange(FIND_MY_CREEPS, 3);
  const cnt = role => near.filter(c => c.memory.role === role).length;
  const attackers = cnt(ROLES.ATTACKER);
  const ranged = cnt(ROLES.RANGED);
  const healers = cnt(ROLES.HEALER);

  // Launch condition: enough forces gathered
  if (!Memory.strike.launch) {
    if (attackers >= 2 || (attackers >= 1 && (ranged >= 1 || healers >= 1))) {
      Memory.strike.launch = true;
      Memory.strike.launchTick = Game.time;
    }
  } else {
    // Reset if no target for a while
    if (!Memory.attackTarget && Game.time - (Memory.strike.launchTick || 0) > 600) {
      Memory.strike.launch = false;
    }
  }
}

function shouldRally(creep) {
  const s = Memory.strike;
  if (!s || s.launch) return false;
  if (!s.rally) return false;
  // If immediate combat nearby, skip rally and fight
  if (creep.pos.findInRange(FIND_HOSTILE_CREEPS, 4).length) return false;
  const rp = new RoomPosition(s.rally.x, s.rally.y, s.rally.roomName);
  creep.moveTo(rp, { reusePath: 5 });
  return true;
}

const roleHarvester = {
  run(creep) {
    if (!creep.memory.working && creep.store.getFreeCapacity() === 0) creep.memory.working = true;
    if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) creep.memory.working = false;

    if (!creep.memory.working) {
      const src = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
      if (src) {
        if (creep.harvest(src) === ERR_NOT_IN_RANGE) creep.moveTo(src, {reusePath: 5, visualizePathStyle: {stroke:'#ffaa00'}});
      }
    } else {
      const targets = creep.room.find(FIND_STRUCTURES, {filter: s =>
        (s.structureType === STRUCTURE_SPAWN || s.structureType === STRUCTURE_EXTENSION || s.structureType === STRUCTURE_TOWER)
        && s.store && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0});
      if (targets.length) {
        const t = creep.pos.findClosestByRange(targets);
        if (creep.transfer(t, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) creep.moveTo(t, {reusePath: 3});
      } else {
        if (creep.room.controller) {
          if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) creep.moveTo(creep.room.controller);
        }
      }
    }
  }
};

const roleUpgrader = {
  run(creep) {
    if (!creep.memory.working && creep.store.getFreeCapacity() === 0) creep.memory.working = true;
    if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) creep.memory.working = false;

    if (!creep.memory.working) {
      const srcs = creep.room.find(FIND_STRUCTURES, {filter: s => s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0});
      const target = srcs.length ? creep.pos.findClosestByRange(srcs) : creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
      if (target && target.structureType) {
        if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) creep.moveTo(target);
      } else if (target) {
        if (creep.harvest(target) === ERR_NOT_IN_RANGE) creep.moveTo(target);
      }
    } else if (creep.room.controller) {
      if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) creep.moveTo(creep.room.controller, {reusePath: 5});
    }
  }
};

const roleBuilder = {
  run(creep) {
    if (!creep.memory.working && creep.store.getFreeCapacity() === 0) creep.memory.working = true;
    if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) creep.memory.working = false;

    if (!creep.memory.working) {
      const storeTargets = creep.room.find(FIND_STRUCTURES, {filter: s => (s.structureType === STRUCTURE_CONTAINER || s.structureType === STRUCTURE_STORAGE) && s.store[RESOURCE_ENERGY] > 0});
      const target = storeTargets.length ? creep.pos.findClosestByRange(storeTargets) : creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
      if (target && target.structureType) {
        if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) creep.moveTo(target);
      } else if (target) {
        if (creep.harvest(target) === ERR_NOT_IN_RANGE) creep.moveTo(target);
      }
    } else {
      const site = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
      if (site) {
        if (creep.build(site) === ERR_NOT_IN_RANGE) creep.moveTo(site, {reusePath: 3});
      } else {
        // Repair ramparts/walls first to reasonable threshold, then any structure
        const rampWall = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: s => (s.structureType === STRUCTURE_RAMPART || s.structureType === STRUCTURE_WALL) && s.hits < 30000});
        if (rampWall) {
          if (creep.repair(rampWall) === ERR_NOT_IN_RANGE) creep.moveTo(rampWall);
        } else {
          const dmg = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: s => s.hits < s.hitsMax && s.structureType !== STRUCTURE_WALL && s.structureType !== STRUCTURE_RAMPART});
          if (dmg) {
            if (creep.repair(dmg) === ERR_NOT_IN_RANGE) creep.moveTo(dmg);
          } else if (creep.room.controller) {
            if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) creep.moveTo(creep.room.controller);
          }
        }
      }
    }
  }
};

const roleDefender = {
  run(creep) {
    // Rally before launch unless engaged
    if (shouldRally(creep)) return;

    const hostile = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
    if (hostile) {
      if (creep.attack(hostile) === ERR_NOT_IN_RANGE) creep.moveTo(hostile, {reusePath: 3});
      return;
    }
    // Offensive: attack high-value hostile structures if visible
    const structure = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
      filter: s => s.structureType === STRUCTURE_TOWER || s.structureType === STRUCTURE_SPAWN || s.structureType === STRUCTURE_EXTENSION
    });
    if (structure) {
      if (creep.attack(structure) === ERR_NOT_IN_RANGE) creep.moveTo(structure, {reusePath: 3});
      return;
    }
    // Move to global target if any
    if (moveToGlobalTarget(creep)) return;
    // Idle on rampart near spawn
    const spawn = getSpawn();
    if (spawn) creep.moveTo(spawn, {range: 2});
  }
};

const roleRanged = {
  run(creep) {
    // Rally before launch unless engaged
    if (shouldRally(creep)) return;

    const hostile = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
    if (hostile) {
      const range = creep.pos.getRangeTo(hostile);
      if (range > 3) creep.moveTo(hostile, {reusePath: 2});
      else if (range < 3) creep.moveTo(creep.pos.findClosestByPath(FIND_MY_STRUCTURES) || creep.room.controller || creep);
      creep.rangedAttack(hostile);
      return;
    }
    // Offensive vs structures
    const structure = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
      filter: s => s.structureType === STRUCTURE_TOWER || s.structureType === STRUCTURE_SPAWN || s.structureType === STRUCTURE_EXTENSION
    });
    if (structure) {
      if (creep.pos.inRangeTo(structure, 3)) creep.rangedAttack(structure); else creep.moveTo(structure, {reusePath: 2});
      return;
    }
    if (moveToGlobalTarget(creep)) return;
    const spawn = getSpawn();
    if (spawn) creep.moveTo(spawn, {range: 3});
  }
};

const roleAttacker = {
  run(creep) {
    // Rally before launch unless engaged
    if (shouldRally(creep)) return;

    const hostile = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
    if (hostile) {
      if (creep.attack(hostile) === ERR_NOT_IN_RANGE) creep.moveTo(hostile, {reusePath: 2});
      return;
    }
    // Target priority: towers > spawns > extensions > any hostile structure
    const structure = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
      filter: s => s.structureType === STRUCTURE_TOWER || s.structureType === STRUCTURE_SPAWN || s.structureType === STRUCTURE_EXTENSION
    }) || creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES);
    if (structure) {
      if (creep.attack(structure) === ERR_NOT_IN_RANGE) creep.moveTo(structure, {reusePath: 2});
      return;
    }
    if (moveToGlobalTarget(creep)) return;
    // fallback idle near spawn
    const spawn = getSpawn();
    if (spawn) creep.moveTo(spawn, {range: 2});
  }
};

const roleHealer = {
  run(creep) {
    // Rally before launch unless engaged or someone is injured
    if (!creep.pos.findInRange(FIND_MY_CREEPS, 1).some(c=>c.hits < c.hitsMax) && shouldRally(creep)) return;

    const injured = creep.pos.findClosestByPath(FIND_MY_CREEPS, { filter: c => c.hits < c.hitsMax });
    if (injured) {
      if (creep.heal(injured) === ERR_NOT_IN_RANGE) creep.moveTo(injured);
      return;
    }
    const fighters = creep.room.find(FIND_MY_CREEPS, { filter: c => c.memory.role === ROLES.DEFENDER || c.memory.role === ROLES.RANGED || c.memory.role === ROLES.ATTACKER });
    if (fighters.length) {
      const f = creep.pos.findClosestByRange(fighters);
      creep.moveTo(f, {range: 1});
    } else {
      const spawn = getSpawn();
      if (spawn) creep.moveTo(spawn, {range: 2});
    }
  }
};

const roleScout = {
  run(creep) {
    // Circle the room edge to reveal and spot hostiles; then update global intel
    const room = creep.room;
    const targetPoints = [new RoomPosition(3,3,room.name), new RoomPosition(46,3,room.name), new RoomPosition(46,46,room.name), new RoomPosition(3,46,room.name)];
    const idx = (creep.memory.idx || 0) % targetPoints.length;
    const tp = targetPoints[idx];
    if (creep.pos.inRangeTo(tp, 1)) creep.memory.idx = (idx + 1) % targetPoints.length; else creep.moveTo(tp, {reusePath: 10});
    updateGlobalIntel(room);
  }
};

function desiredCounts(room) {
  const ctrlLevel = room.controller?.level || 0;
  const hostileCount = room.find(FIND_HOSTILE_CREEPS).length;
  const base = { [ROLES.HARVESTER]: 4, [ROLES.UPGRADER]: 2, [ROLES.BUILDER]: 2, [ROLES.DEFENDER]: 0, [ROLES.ATTACKER]: 0, [ROLES.RANGED]: 0, [ROLES.HEALER]: 0, [ROLES.SCOUT]: 1 };
  if (ctrlLevel >= 2) { base[ROLES.HARVESTER] = 5; base[ROLES.UPGRADER] = 3; base[ROLES.BUILDER] = 2; }
  if (ctrlLevel >= 3) { base[ROLES.HARVESTER] = 6; base[ROLES.UPGRADER] = 3; base[ROLES.BUILDER] = 3; base[ROLES.DEFENDER] = 1; base[ROLES.ATTACKER] = 2; base[ROLES.RANGED] = 1; }
  if (ctrlLevel >= 4) { base[ROLES.DEFENDER] = 2; base[ROLES.ATTACKER] = 3; base[ROLES.RANGED] = 1; base[ROLES.HEALER] = 1; }
  if (hostileCount > 0) { base[ROLES.DEFENDER] += 1; base[ROLES.RANGED] = Math.max(base[ROLES.RANGED], 1); }
  if (Memory.emergency) { base[ROLES.DEFENDER] = Math.max(base[ROLES.DEFENDER], 3); base[ROLES.RANGED] = Math.max(base[ROLES.RANGED], 1); }
  return base;
}

function spawnLoop(room) {
  const spawn = getSpawn();
  if (!spawn || spawn.spawning) return;
  const counts = Object.values(Game.creeps).reduce((acc,c)=>{acc[c.memory.role]= (acc[c.memory.role]||0)+1; return acc;},{})
  const target = desiredCounts(room);
  // Priority: harvesters -> defenders -> attackers -> builders -> upgraders -> ranged -> healer -> scout
  const priority = [ROLES.HARVESTER, ROLES.DEFENDER, ROLES.ATTACKER, ROLES.BUILDER, ROLES.UPGRADER, ROLES.RANGED, ROLES.HEALER, ROLES.SCOUT];
  for (const role of priority) {
    if ((counts[role]||0) < (target[role]||0)) {
      const body = getBody(room.energyAvailable, role);
      const name = `${role}-${Game.time}`;
      const memory = { role, working: false };
      const res = spawn.spawnCreep(body, name, { memory });
      if (res === OK) return; // spawned one
    }
  }
}

function runCreeps(room) {
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    switch (creep.memory.role) {
      case ROLES.HARVESTER: roleHarvester.run(creep); break;
      case ROLES.UPGRADER: roleUpgrader.run(creep); break;
      case ROLES.BUILDER: roleBuilder.run(creep); break;
      case ROLES.DEFENDER: roleDefender.run(creep); break;
      case ROLES.ATTACKER: roleAttacker.run(creep); break;
      case ROLES.RANGED: roleRanged.run(creep); break;
      case ROLES.HEALER: roleHealer.run(creep); break;
      case ROLES.SCOUT: roleScout.run(creep); break;
      default:
        creep.memory.role = ROLES.HARVESTER;
        roleHarvester.run(creep);
    }
  }
}

module.exports.loop = function() {
  cleanupMemory();
  const myRooms = Object.values(Game.rooms).filter(r => r.controller && r.controller.my);
  if (myRooms.length === 0) return;
  for (const room of myRooms) {
    manageEmergency(room);
    ensureStrikeInit(room);
    updateGlobalIntel(room);
    ensureRamparts(room);
    planExtensions(room);
    planTowers(room);
    planContainersAndRoads(room);
    towerRun(room);
    manageStrike(room);
    spawnLoop(room);
    runCreeps(room);
  }
};
