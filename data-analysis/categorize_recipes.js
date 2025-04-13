const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'public', 'data', 'recipes.json');

// Helper function to estimate recipe difficulty
function estimateDifficulty(recipe) {
  let score = 0;
  
  // Time-based scoring
  if (recipe.total_time) {
    const timeInMinutes = parseInt(recipe.total_time);
    if (timeInMinutes <= 30) score += 1;
    else if (timeInMinutes <= 60) score += 2;
    else score += 3;
  }
  
  // Ingredient count scoring
  if (recipe.ingredients) {
    const ingredientCount = recipe.ingredients.length;
    if (ingredientCount <= 8) score += 1;
    else if (ingredientCount <= 12) score += 2;
    else score += 3;
  }
  
  // Instruction complexity scoring
  if (recipe.instructions) {
    const instructionCount = recipe.instructions.length;
    if (instructionCount <= 5) score += 1;
    else if (instructionCount <= 8) score += 2;
    else score += 3;
    
    // Check for complex techniques
    const complexTechniques = [
      'braise', 'sous vide', 'temper', 'knead', 'proof',
      'ferment', 'cure', 'smoke', 'brine', 'marinate'
    ];
    
    const instructionsText = recipe.instructions.join(' ').toLowerCase();
    complexTechniques.forEach(technique => {
      if (instructionsText.includes(technique)) score += 1;
    });
  }
  
  // Determine final difficulty
  if (score <= 4) return 'Easy';
  if (score <= 7) return 'Medium';
  return 'Hard';
}

try {
  console.log('Reading recipes file...');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  console.log(`Processing ${data.length} recipes...`);
  
  // Update each recipe with estimated difficulty
  const updatedRecipes = data.map(recipe => ({
    ...recipe,
    difficulty: estimateDifficulty(recipe)
  }));
  
  // Write back to file
  fs.writeFileSync(filePath, JSON.stringify(updatedRecipes, null, 2));
  
  // Print statistics
  const stats = updatedRecipes.reduce((acc, recipe) => {
    acc[recipe.difficulty] = (acc[recipe.difficulty] || 0) + 1;
    return acc;
  }, {});
  
  console.log('\nRecipe difficulty distribution:');
  console.log('Easy:', stats.Easy || 0);
  console.log('Medium:', stats.Medium || 0);
  console.log('Hard:', stats.Hard || 0);
  
  console.log('\nCategorization complete!');
} catch (error) {
  console.error('Error processing recipes:', error);
} 