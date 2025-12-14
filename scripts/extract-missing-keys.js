const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, '../src/locales/en/common.json');
const cnPath = path.join(__dirname, '../src/locales/zh-CN/common.json');

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const cnData = JSON.parse(fs.readFileSync(cnPath, 'utf8'));

function getValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

const enKeys = getAllKeys(enData);
const cnKeys = getAllKeys(cnData);

const missingKeys = enKeys.filter(key => !cnKeys.includes(key));

console.log(`Total EN keys: ${enKeys.length}`);
console.log(`Total CN keys: ${cnKeys.length}`);
console.log(`Missing keys: ${missingKeys.length}\n`);

// Group by category
const categories = {};
missingKeys.forEach(key => {
  const category = key.split('.')[0];
  if (!categories[category]) {
    categories[category] = [];
  }
  categories[category].push({
    key,
    value: getValue(enData, key)
  });
});

// Output by category
Object.keys(categories).sort().forEach(category => {
  console.log(`\n## ${category} (${categories[category].length} keys):`);
  categories[category].forEach(({key, value}) => {
    console.log(`  "${key}": "${value}",`);
  });
});
