const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, '../src/locales/en/common.json');
const cnPath = path.join(__dirname, '../src/locales/zh-CN/common.json');

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const cnData = JSON.parse(fs.readFileSync(cnPath, 'utf8'));

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

if (missingKeys.length > 0) {
  console.log('Missing keys in zh-CN:');
  missingKeys.forEach(key => {
    console.log(`  ${key}`);
  });
}
