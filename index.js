const fs = require("fs");
const configPath = "./src/config/config.json";

if (fs.existsSync(configPath)) {
  require("./server");
} else {
  fs.writeFile(configPath, fs.readFileSync("./config.example.json", "utf-8"), (err) => {
    if (err) return console.error(err);

    console.log("config File created!");
  });
}
