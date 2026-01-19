// Monitoring script to track game state
const net = require("net");

function executeCLI(command) {
    return new Promise((resolve, reject) => {
        const c = new net.Socket();
        let out = "", ready = false;
        
        c.connect(21026, "localhost");
        c.on("data", d => {
            out += d;
            if (!ready && out.includes("< ")) {
                ready = true;
                out = "";
                c.write(command + "\n");
            }
            if (ready && out.includes("\n< ")) {
                resolve(out.split("\n").filter(l => !l.startsWith("< ")).join("\n"));
                c.destroy();
            }
        });
        
        setTimeout(() => {
            c.destroy();
            resolve(out);
        }, 3000);
    });
}

async function monitorGame() {
    try {
        console.log("=== CLAUDE PvP MONITORING ===");
        
        // Get game time
        const gameTime = await executeCLI('storage.env.get("gameTime").then(t=>print("Game Time: " + t))');
        console.log(gameTime);
        
        // Get my user info
        const userInfo = await executeCLI('storage.db.users.findOne({username: "claude"}).then(u=>print("User: " + u.username + " | GCL: " + u.gcl + " | CPU: " + u.cpu))');
        console.log(userInfo);
        
        // Get my spawns
        const spawns = await executeCLI('storage.db.users.findOne({username: "claude"}).then(u=>storage.db["rooms.objects"].find({type: "spawn", user: u._id}).then(spawns=>print("Spawns: " + spawns.map(s=>s.name + "(" + s.room + ")").join(", "))))');
        console.log(spawns);
        
        // Get my creeps
        const myCreeps = await executeCLI('storage.db.users.findOne({username: "claude"}).then(u=>storage.db["rooms.objects"].find({type: "creep", user: u._id}).limit(10).then(creeps=>print("My Creeps: " + creeps.length + " | Roles: " + creeps.map(c=>c.name.split("_")[0]).join(", "))))');
        console.log(myCreeps);
        
        // Check for enemies
        const enemies = await executeCLI('storage.db.users.findOne({username: "claude"}).then(u=>storage.db["rooms.objects"].find({type: "creep", user: {$ne: u._id}}).limit(5).then(enemies=>print("Enemy Creeps: " + enemies.length + " | Users: " + [...new Set(enemies.map(e=>e.user))].length)))');
        console.log(enemies);
        
        // Get room status for W5N5
        const roomStatus = await executeCLI('storage.db["rooms.objects"].find({room: "W5N5"}).then(objects=>{const spawns = objects.filter(o=>o.type==="spawn"); const sources = objects.filter(o=>o.type==="source"); const creeps = objects.filter(o=>o.type==="creep"); print("W5N5 Status: " + spawns.length + " spawns, " + sources.length + " sources, " + creeps.length + " creeps")})');
        console.log(roomStatus);
        
        console.log("=== MONITORING COMPLETE ===\n");
        
    } catch (error) {
        console.error("Monitoring error:", error.message);
    }
}

// Run monitoring
monitorGame();