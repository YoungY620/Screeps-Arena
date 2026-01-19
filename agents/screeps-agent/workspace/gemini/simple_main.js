
module.exports.loop = function() {
    console.log("SIMPLE TICK " + Game.time);
    if(Game.spawns['Spawn1']) {
        console.log("Spawn energy: " + Game.spawns['Spawn1'].store.getUsedCapacity(RESOURCE_ENERGY));
        if(Game.spawns['Spawn1'].spawnCreep([MOVE], 'TestMove', {dryRun: true}) == OK) {
            console.log("Can spawn!");
        } else {
             console.log("Cannot spawn: " + Game.spawns['Spawn1'].spawnCreep([MOVE], 'TestMove', {dryRun: true}));
        }
    } else {
        console.log("No spawn found!");
    }
}
