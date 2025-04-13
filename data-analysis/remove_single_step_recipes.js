const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'public', 'data', 'recipes.json');

try {
  console.log('Reading recipes file...');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  console.log(`Processing ${data.length} recipes...`);
  
  // Filter out recipes with only one instruction
  const filteredRecipes = data.filter(recipe => {
    const hasMultipleSteps = recipe.instructions && recipe.instructions.length > 1;
    
    if (!hasMultipleSteps) {
      console.log(`Removing recipe with only ${recipe.instructions?.length || 0} steps: ${recipe.title}`);
    }
    
    return hasMultipleSteps;
  });
  
  // Write back to file
  fs.writeFileSync(filePath, JSON.stringify(filteredRecipes, null, 2));
  
  // Print statistics
  console.log('\nFiltering statistics:');
  console.log(`Total recipes before: ${data.length}`);
  console.log(`Total recipes after: ${filteredRecipes.length}`);
  console.log(`Removed ${data.length - filteredRecipes.length} recipes with only one step`);
  
  // Print distribution of instruction counts
  const instructionCounts = filteredRecipes.reduce((acc, recipe) => {
    const count = recipe.instructions.length;
    acc[count] = (acc[count] || 0) + 1;
    return acc;
  }, {});
  
  console.log('\nInstruction count distribution:');
  Object.entries(instructionCounts)
    .sort(([a], [b]) => Number(a) - Number(b))
    .forEach(([count, recipes]) => {
      console.log(`${count} instructions: ${recipes} recipes`);
    });
  
  console.log('\nFiltering complete!');
} catch (error) {
  console.error('Error processing recipes:', error);
} 