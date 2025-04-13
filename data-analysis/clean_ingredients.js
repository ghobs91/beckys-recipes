const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'public', 'data', 'recipes.json');

// Helper function to clean ingredients
function cleanIngredients(ingredients) {
  if (!ingredients || !Array.isArray(ingredients)) return [];
  
  // Common measurement units to preserve
  const measurementUnits = [
    'cup', 'cups', 'tablespoon', 'tablespoons', 'teaspoon', 'teaspoons',
    'pound', 'pounds', 'ounce', 'ounces', 'gram', 'grams', 'kilogram', 'kilograms',
    'ml', 'liter', 'liters', 'g', 'kg', 'tbsp', 'tsp', 'oz', 'lb', 'lbs'
  ];
  
  // Process each ingredient entry
  const cleanedIngredients = ingredients.flatMap(ingredient => {
    if (!ingredient || typeof ingredient !== 'string') return [];
    
    // Skip very short ingredients
    if (ingredient.trim().length < 3) return [];
    
    // Check if this ingredient contains multiple ingredients separated by commas
    if (ingredient.includes(',')) {
      // Split by commas, but be careful not to split measurements
      const parts = ingredient.split(',').map(part => part.trim());
      
      // If we have multiple parts, process each one
      if (parts.length > 1) {
        // Check if this is a list of measurements or just a comma-separated list
        const hasMeasurements = parts.some(part => 
          measurementUnits.some(unit => part.toLowerCase().includes(unit))
        );
        
        if (hasMeasurements) {
          // This is likely a list of measurements, keep as is
          return [ingredient];
        } else {
          // This is likely a list of ingredients, split them
          return parts.filter(part => part.length > 0);
        }
      }
    }
    
    // If no commas or special handling needed, return as is
    return [ingredient];
  });
  
  // Remove duplicates while preserving order
  const uniqueIngredients = [];
  const seen = new Set();
  
  cleanedIngredients.forEach(ingredient => {
    // Normalize the ingredient for comparison
    const normalized = ingredient.toLowerCase().replace(/\s+/g, ' ').trim();
    if (!seen.has(normalized) && normalized.length > 0) {
      seen.add(normalized);
      uniqueIngredients.push(ingredient);
    }
  });
  
  return uniqueIngredients;
}

try {
  console.log('Reading recipes file...');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  console.log(`Processing ${data.length} recipes...`);
  
  // Clean ingredients for each recipe
  const updatedRecipes = data.map(recipe => {
    const cleanedIngredients = cleanIngredients(recipe.ingredients);
    
    // Log recipes with significant changes
    if (recipe.ingredients && recipe.ingredients.length !== cleanedIngredients.length) {
      console.log(`Recipe "${recipe.title}": ${recipe.ingredients.length} ingredients → ${cleanedIngredients.length} ingredients`);
    }
    
    return {
      ...recipe,
      ingredients: cleanedIngredients
    };
  });
  
  // Write back to file
  fs.writeFileSync(filePath, JSON.stringify(updatedRecipes, null, 2));
  
  // Print statistics
  const totalIngredientsBefore = data.reduce((sum, recipe) => 
    sum + (recipe.ingredients?.length || 0), 0);
  const totalIngredientsAfter = updatedRecipes.reduce((sum, recipe) => 
    sum + (recipe.ingredients?.length || 0), 0);
  
  console.log('\nCleaning statistics:');
  console.log(`Total ingredients before: ${totalIngredientsBefore}`);
  console.log(`Total ingredients after: ${totalIngredientsAfter}`);
  console.log(`Added ${totalIngredientsAfter - totalIngredientsBefore} ingredient entries`);
  
  // Print distribution of ingredient counts
  const ingredientCounts = updatedRecipes.reduce((acc, recipe) => {
    const count = recipe.ingredients.length;
    acc[count] = (acc[count] || 0) + 1;
    return acc;
  }, {});
  
  console.log('\nIngredient count distribution:');
  Object.entries(ingredientCounts)
    .sort(([a], [b]) => Number(a) - Number(b))
    .forEach(([count, recipes]) => {
      console.log(`${count} ingredients: ${recipes} recipes`);
    });
  
  console.log('\nCleaning complete!');
} catch (error) {
  console.error('Error processing recipes:', error);
} 