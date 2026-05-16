const fs = require('fs');
try {
    const content = fs.readFileSync('package.json', 'utf8');
    JSON.parse(content);
    console.log('JSON is valid');
} catch (e) {
    console.error('JSON is invalid:', e.message);
}
