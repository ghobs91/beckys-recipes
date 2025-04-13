'use client';

import React, { useState, useEffect } from "react";
import Image from 'next/image';

const difficulties = ["Easy", "Medium", "Hard"];

export default function RecipeCollections() {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLoading(true);
    fetch("/data/recipes.json")
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch recipes');
        return res.json();
      })
      .then((data) => {
        const processedData = data.map(recipe => ({
          ...recipe,
          difficulty: recipe.difficulty || "Medium"
        }));
        setRecipes(processedData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.title.toLowerCase().includes(search.toLowerCase()) ||
      (recipe.ingredients && recipe.ingredients.some(ingredient => 
        ingredient.toLowerCase().includes(search.toLowerCase())
      ))
  );

  // Don't render anything until after hydration to avoid mismatch
  if (!mounted) {
    return (
      <div className="p-4 space-y-8">
        <div className="max-w-xl mx-auto mb-10">
          <input
            type="text"
            placeholder="Search recipes..."
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled
          />
        </div>
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>Error loading recipes: {error}</p>
      </div>
    );
  }

  // Group recipes by difficulty
  const recipesByDifficulty = difficulties.reduce((acc, level) => {
    acc[level] = filteredRecipes.filter(recipe => recipe.difficulty === level);
    return acc;
  }, {});

  return (
    <div className="p-4 space-y-8">
      <div className="max-w-xl mx-auto mb-10">
        <input
          type="text"
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      {difficulties.map((level) => (
        <div key={level} className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">{level} Recipes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipesByDifficulty[level] && recipesByDifficulty[level].map((recipe, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden transition-transform duration-300 transform hover:scale-105 cursor-pointer"
                onClick={() => setSelectedRecipe(recipe)}
              >
                <div className="relative h-48 w-full">
                  {recipe.image ? (
                    <Image
                      src={recipe.image}
                      alt={recipe.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={idx < 6}
                      unoptimized={true}
                      onError={(e) => {
                        // Handle image load error by replacing with a placeholder
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement.innerHTML = `
                          <div class="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span class="text-gray-500">No image available</span>
                          </div>
                        `;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No image available</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{recipe.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Recipe Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">{selectedRecipe.title}</h2>
              <button
                onClick={() => setSelectedRecipe(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              {selectedRecipe.image && (
                <div className="relative h-64 w-full mb-6">
                  <Image
                    src={selectedRecipe.image}
                    alt={selectedRecipe.title}
                    fill
                    className="object-cover rounded-lg"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                    unoptimized={true}
                    onError={(e) => {
                      // Handle image load error by replacing with a placeholder
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement.innerHTML = `
                        <div class="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
                          <span class="text-gray-500">No image available</span>
                        </div>
                      `;
                    }}
                  />
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Ingredients</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {selectedRecipe.ingredients && selectedRecipe.ingredients.map((ingredient, i) => (
                      <li key={i} className="text-gray-700">{ingredient}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Instructions</h3>
                  <ol className="list-decimal pl-5 space-y-3">
                    {selectedRecipe.instructions && selectedRecipe.instructions.map((instruction, i) => (
                      <li key={i} className="text-gray-700">{instruction}</li>
                    ))}
                  </ol>
                </div>
              </div>
              {selectedRecipe.total_time && (
                <div className="mt-6 text-sm text-gray-600">
                  Total Time: {selectedRecipe.total_time} minutes
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
