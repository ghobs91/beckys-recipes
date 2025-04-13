const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'public', 'data', 'recipes.json');

// Helper function to clean instructions
function cleanInstructions(instructions) {
  if (!instructions || !Array.isArray(instructions)) return [];
  
  // Join instructions with newlines to preserve structure
  const fullText = instructions.join('\n');
  
  // Common recipe intro/outro phrases to remove
  const skipPhrases = [
    'posted on',
    'copyright',
    'all rights reserved',
    'privacy policy',
    'terms of use',
    'this recipe is',
    'you\'ll love this',
    'perfect for',
    'prep time:',
    'cook time:',
    'total time:',
    'servings:',
    'yield:',
    'recipe rating',
    'print recipe',
    'save recipe',
    'jump to recipe'
  ];

  // Try to find the main instructions block
  let instructionsText = fullText;
  
  // Look for common instruction section markers with everything that follows
  const sectionMarkers = [
    /instructions:?\s*([\s\S]+?)(?=(?:notes:|nutrition:|recipe notes:|storage:|tips:|print recipe|save recipe|you may also like|share this recipe|category:|cuisine:|keywords:|prep time:|cook time:|total time:|servings:|yield:|\n\s*\n\s*\n|$))/i,
    /directions:?\s*([\s\S]+?)(?=(?:notes:|nutrition:|recipe notes:|storage:|tips:|print recipe|save recipe|you may also like|share this recipe|category:|cuisine:|keywords:|prep time:|cook time:|total time:|servings:|yield:|\n\s*\n\s*\n|$))/i,
    /method:?\s*([\s\S]+?)(?=(?:notes:|nutrition:|recipe notes:|storage:|tips:|print recipe|save recipe|you may also like|share this recipe|category:|cuisine:|keywords:|prep time:|cook time:|total time:|servings:|yield:|\n\s*\n\s*\n|$))/i,
    /steps:?\s*([\s\S]+?)(?=(?:notes:|nutrition:|recipe notes:|storage:|tips:|print recipe|save recipe|you may also like|share this recipe|category:|cuisine:|keywords:|prep time:|cook time:|total time:|servings:|yield:|\n\s*\n\s*\n|$))/i,
    /preparation:?\s*([\s\S]+?)(?=(?:notes:|nutrition:|recipe notes:|storage:|tips:|print recipe|save recipe|you may also like|share this recipe|category:|cuisine:|keywords:|prep time:|cook time:|total time:|servings:|yield:|\n\s*\n\s*\n|$))/i
  ];

  // Try each marker pattern until we find a match
  for (const pattern of sectionMarkers) {
    const match = fullText.match(pattern);
    if (match && match[1] && match[1].trim().length > 0) {
      instructionsText = match[1];
      break;
    }
  }

  // If no section markers found, try to identify the largest block of text that looks like instructions
  if (instructionsText === fullText) {
    const blocks = fullText.split(/\n\s*\n/);
    const instructionBlocks = blocks.filter(block => {
      const lines = block.split('\n');
      // Look for blocks that have multiple lines and start with numbers or step indicators
      return lines.length > 2 && lines.some(line => 
        line.match(/^(?:\d+[\.)]\s*|\(?\d+\)?[\.)]\s*|Step \d+[\.)]\s*)/i)
      );
    });
    
    if (instructionBlocks.length > 0) {
      // Use the largest block that looks like instructions
      instructionsText = instructionBlocks.reduce((a, b) => 
        a.length > b.length ? a : b
      );
    }
  }

  // Split instructions into steps
  let steps = [];
  
  // First try to split by numbered steps
  const numberedSteps = instructionsText
    .split(/(?:\n|\r\n)*(?:\d+[\.)]\s*|\(?\d+\)?[\.)]\s*|Step \d+[\.)]\s*)/g)
    .map(step => step.trim())
    .filter(step => step.length > 0);
  
  if (numberedSteps.length > 1) {
    steps = numberedSteps;
  } else {
    // If no numbered steps found, try splitting by sentences while preserving structure
    steps = instructionsText
      .split(/(?<=\.|\!|\?)\s+(?=[A-Z])/g)
      .map(step => step.trim())
      .filter(step => step.length > 0);
    
    // If we still don't have multiple steps, try splitting by line breaks
    if (steps.length <= 1) {
      steps = instructionsText
        .split(/\n+/)
        .map(step => step.trim())
        .filter(step => step.length > 0);
    }
  }

  // Clean and filter the steps
  const cleanedSteps = steps
    .filter(step => {
      if (!step || step.length < 10) return false;
      
      const lowerStep = step.toLowerCase();
      
      // Skip steps that contain any of the skip phrases
      if (skipPhrases.some(phrase => lowerStep.includes(phrase))) return false;
      
      // Skip steps that are just ingredient lists
      if (lowerStep.match(/^(?:\d+\s+)?(?:cup|tablespoon|teaspoon|pound|gram|oz|ml|g|tbsp|tsp)\b/i)) return false;
      
      // Skip steps that are just section headers
      if (lowerStep.match(/^(?:ingredients|instructions|directions|steps|method|notes|tips):?$/i)) return false;
      
      return true;
    })
    .map(step => {
      // Clean up the step text
      return step
        .replace(/^[^a-zA-Z]+/, '') // Remove leading non-letter characters
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
    });

  // Remove duplicates while preserving order
  const uniqueSteps = [];
  const seen = new Set();
  
  cleanedSteps.forEach(step => {
    // Normalize the step for comparison
    const normalized = step.toLowerCase().replace(/\s+/g, ' ').trim();
    if (!seen.has(normalized) && normalized.length > 0) {
      seen.add(normalized);
      uniqueSteps.push(step);
    }
  });
  
  return uniqueSteps;
}

try {
  console.log('Reading recipes file...');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  console.log(`Processing ${data.length} recipes...`);
  
  // Clean instructions for each recipe
  const updatedRecipes = data.map(recipe => {
    const cleanedInstructions = cleanInstructions(recipe.instructions);
    
    // Log recipes that end up with no instructions
    if (cleanedInstructions.length === 0) {
      console.log(`Warning: No instructions found for recipe: ${recipe.title}`);
    } else if (cleanedInstructions.length === 1) {
      console.log(`Warning: Only one instruction found for recipe: ${recipe.title}`);
    }
    
    return {
      ...recipe,
      instructions: cleanedInstructions
    };
  });
  
  // Write back to file
  fs.writeFileSync(filePath, JSON.stringify(updatedRecipes, null, 2));
  
  // Print statistics
  const totalInstructionsBefore = data.reduce((sum, recipe) => 
    sum + (recipe.instructions?.length || 0), 0);
  const totalInstructionsAfter = updatedRecipes.reduce((sum, recipe) => 
    sum + (recipe.instructions?.length || 0), 0);
  
  console.log('\nCleaning statistics:');
  console.log(`Total instructions before: ${totalInstructionsBefore}`);
  console.log(`Total instructions after: ${totalInstructionsAfter}`);
  console.log(`Removed ${totalInstructionsBefore - totalInstructionsAfter} instructions`);
  
  // Print distribution of instruction counts
  const instructionCounts = updatedRecipes.reduce((acc, recipe) => {
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
  
  console.log('\nCleaning complete!');
} catch (error) {
  console.error('Error processing recipes:', error);
} 