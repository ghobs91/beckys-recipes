'use client';

import React, { useState, useEffect } from "react";
import Image from 'next/image';

const difficulties = ["Easy", "Medium", "Hard"];

export default function RecipeCollections() {
  const [expanded, setExpanded] = useState(null);
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
        // Add default difficulty if missing
        const processedData = data.map(recipe => ({
          ...recipe,
          difficulty: recipe.difficulty || "Medium" // Default to Medium if difficulty is missing
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
      (recipe.content && recipe.content.toLowerCase().includes(search.toLowerCase()))
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
                onClick={() => setExpanded(expanded === idx ? null : idx)}
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
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No image available</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{recipe.title}</h3>
                  {expanded === idx && (
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 mt-2 bg-gray-50 p-3 rounded">{recipe.content}</pre>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
