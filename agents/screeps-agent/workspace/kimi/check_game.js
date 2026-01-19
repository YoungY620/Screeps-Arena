const net = require("net");
const c = new net.Socket();
let out = "", ready = false;
c.connect(21026, "localhost");
c.on("data", d => {
  out += d.toString();
  if (!ready && out.includes("< ")) { 
    ready = true; 
    out = ""; 
    c.write('storage.env.get("gameTime")\n'); 
  }
  else if (ready && out.includes("< ")) { 
    console.log(out.split("\n").find(l => l.includes(":") && !l.includes("storage"))); 
    c.end(); 
  }
});
c.on("error", e => console.error(e));