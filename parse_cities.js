const fs = require('fs');

const md = fs.readFileSync('us_states_cities_complete.md', 'utf8');
const stateCities = {};
let currentState = null;
const lines = md.split('\n');

for (let line of lines) {
  if (line.startsWith('## ')) {
    // Extract state name
    const match = line.match(/^## ([A-Z\s]+) \(/);
    if (match) {
      currentState = match[1].trim();
      // Convert to title case
      currentState = currentState.split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
      stateCities[currentState] = [];
    }
  } else if (line.startsWith('- ') && currentState) {
    // Extract city name
    const city = line.substring(2).trim();
    if (city && !city.includes(':') && !city.includes('**')) {
      stateCities[currentState].push(city);
    }
  }
}

// Generate JavaScript object
console.log('\t\t\tconst stateToCities = {');
const states = Object.keys(stateCities).sort();
states.forEach((state, idx) => {
  const cities = stateCities[state];
  if (cities.length > 0) {
    const citiesStr = cities.map(c => `'${c.replace(/'/g, "\\'")}'`).join(', ');
    console.log(`\t\t\t\t'${state}': [${citiesStr}]${idx < states.length - 1 ? ',' : ''}`);
  }
});
console.log('\t\t\t};');
