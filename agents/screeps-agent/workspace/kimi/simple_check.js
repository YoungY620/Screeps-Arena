const net = require("net");
const client = new net.Socket();

client.connect(21026, "localhost", () => {
  console.log("Connected to CLI");
  client.write('storage.env.get("gameTime")\n');
});

client.on("data", (data) => {
  console.log("Response:", data.toString());
  client.destroy();
});

client.on("error", (err) => {
  console.error("Error:", err.message);
});

setTimeout(() => {
  client.destroy();
}, 5000);