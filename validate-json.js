const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public', 'data', 'recipes.json');

try {
  console.log(`Reading file: ${filePath}`);
  const data = fs.readFileSync(filePath, 'utf8');
  
  console.log('Parsing JSON...');
  const json = JSON.parse(data);
  
  console.log(`Successfully parsed JSON with ${json.length} recipes`);
  
  // Check for missing difficulty
  const missingDifficulty = json.filter(recipe => !recipe.difficulty);
  if (missingDifficulty.length > 0) {
    console.log(`Found ${missingDifficulty.length} recipes with missing difficulty`);
  }
  
  // Check for missing content
  const missingContent = json.filter(recipe => !recipe.content);
  if (missingContent.length > 0) {
    console.log(`Found ${missingContent.length} recipes with missing content`);
  }
  
  console.log('Validation complete');
} catch (error) {
  console.error('Error validating JSON:', error);
} 