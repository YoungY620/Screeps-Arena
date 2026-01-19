// Upload script for GEMINI ABSOLUTE ANNIHILATION v7.0
const net = require("net");
const fs = require("fs");

// Read the code file
const code = fs.readFileSync("/Users/moonshot/dev/local-screeps/agents/screeps-agent/workspace/gemini/main.js", "utf8");
console.log(`Read code file: ${code.length} bytes`);

const c = new net.Socket();
c.connect(21026, "localhost");

c.on("connect", () => {
    console.log("Connected to Screeps CLI");
    
    // Wait a bit for the connection to stabilize
    setTimeout(() => {
        console.log("Uploading code...");
        
        // Build the upload command
        const command = `storage.db.users.findOne({username: "gemini"}).then(user => {
            if (user) {
                console.log("Found user: " + user._id);
                return storage.db["users.code"].updateOne(
                    {user: user._id, branch: "default", module: "main"},
                    {$set: {code: ${JSON.stringify(code)}}},
                    {upsert: true}
                );
            } else {
                console.log("User gemini not found");
                return null;
            }
        }).then(() => {
            console.log("UPLOAD_SUCCESS");
        }).catch(err => {
            console.log("UPLOAD_ERROR:" + err.message);
        });`;
        
        c.write(command + "\n");
    }, 1000);
});

c.on("data", (data) => {
    const text = data.toString();
    console.log("CLI Response:", text.trim());
    
    if (text.includes("UPLOAD_SUCCESS")) {
        console.log("✅ GEMINI ABSOLUTE ANNIHILATION v7.0 UPLOADED SUCCESSFULLY!");
        c.destroy();
        process.exit(0);
    } else if (text.includes("UPLOAD_ERROR")) {
        console.log("❌ Upload failed");
        c.destroy();
        process.exit(1);
    }
});

c.on("error", (err) => {
    console.log("Connection error:", err.message);
    process.exit(1);
});

setTimeout(() => {
    console.log("Timeout reached");
    c.destroy();
    process.exit(0);
}, 10000);