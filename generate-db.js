const fs = require('fs');
const path = require('path');

// Target the replicated-tickets directory
const ticketsDir = path.join(__dirname, 'replicated-tickets');
const outputDb = path.join(ticketsDir, 'tickets.json');

let database = [];

// Ensure the directory exists before reading
if (!fs.existsSync(ticketsDir)) {
    console.error("❌ Error: 'replicated-tickets' folder not found!");
    process.exit(1);
}

const items = fs.readdirSync(ticketsDir);

items.forEach(item => {
  const itemPath = path.join(ticketsDir, item);
  
  if (fs.statSync(itemPath).isDirectory()) {
    const metaPath = path.join(itemPath, 'meta.json');
    
    if (fs.existsSync(metaPath)) {
      const metaData = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
      metaData.link = `./${item}/index.html`; 
      database.push(metaData);
    }
  }
});

// Sort by date (newest first)
database.sort((a, b) => new Date(b.date) - new Date(a.date));

// Save the JSON file
fs.writeFileSync(outputDb, JSON.stringify(database, null, 2));
console.log(`✅ Successfully generated tickets.json with ${database.length} tickets!`);